import { GoogleAuth } from "google-auth-library";

export const runtime = "nodejs";

const LOCATION = process.env.GCP_LOCATION || "us-central1";
const MODEL = "virtual-try-on-001";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";

type AuthResult =
  | { ok: true; token: string; projectId: string }
  | { ok: false; status: number; error: string };

async function authFromServiceAccountJson(json: string): Promise<AuthResult> {
  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(json);
  } catch {
    return { ok: false, status: 500, error: "virtual_try_on_key looks like JSON but could not be parsed." };
  }

  const projectId = (credentials.project_id as string) || process.env.GCP_PROJECT_ID || "";
  if (!projectId) {
    return { ok: false, status: 500, error: "Service-account JSON has no project_id, and GCP_PROJECT_ID is not set." };
  }

  const auth = new GoogleAuth({ credentials, scopes: SCOPE });
  const token = await auth.getAccessToken();
  if (!token) {
    return { ok: false, status: 500, error: "Failed to mint an access token from the service account." };
  }
  return { ok: true, token, projectId };
}

export async function resolveAuth(): Promise<AuthResult> {
  let raw = (process.env.virtual_try_on_key || "").trim();

  if (!raw) {
    return { ok: false, status: 500, error: "virtual_try_on_key is not set in the environment." };
  }

  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }

  if (raw.startsWith("{")) return authFromServiceAccountJson(raw);

  if (/^[A-Za-z0-9+/=\s]+$/.test(raw) && raw.length > 100) {
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8").trim();
      if (decoded.startsWith("{")) return authFromServiceAccountJson(decoded);
    } catch { /* fall through */ }
  }

  if (raw.startsWith("ya29.")) {
    const projectId = process.env.GCP_PROJECT_ID || "";
    if (!projectId) {
      return { ok: false, status: 500, error: "virtual_try_on_key is an access token. Also set GCP_PROJECT_ID." };
    }
    return { ok: true, token: raw, projectId };
  }

  if (raw.startsWith("AIza") || raw.startsWith("AQ.")) {
    return { ok: false, status: 500, error: "virtual_try_on_key is a plain API key. Use a Service Account JSON with Vertex AI User role." };
  }

  return { ok: false, status: 500, error: `Unrecognised virtual_try_on_key format. Expected Service Account JSON or base64.` };
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export type TryOnResult =
  | { ok: true; image: string }
  | { ok: false; status: number; error: string };

export async function generateTryOn(personFile: File, clothFile: File): Promise<TryOnResult> {
  const auth = await resolveAuth();
  if (!auth.ok) return auth;

  const [personB64, clothB64] = await Promise.all([
    fileToBase64(personFile),
    fileToBase64(clothFile),
  ]);

  const endpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${auth.projectId}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

  const body = {
    instances: [
      {
        personImage: { image: { bytesBase64Encoded: personB64 } },
        productImages: [{ image: { bytesBase64Encoded: clothB64 } }],
      },
    ],
    parameters: { sampleCount: 1 },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, status: res.status, error: `Vertex AI returned ${res.status}: ${detail}` };
    }

    const data = await res.json();
    const prediction = data?.predictions?.[0];
    const b64 = prediction?.bytesBase64Encoded;
    if (!b64) {
      return { ok: false, status: 502, error: "Vertex AI returned no image" };
    }

    const mime = prediction.mimeType || "image/png";
    return { ok: true, image: `data:${mime};base64,${b64}` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Inference failed";
    return { ok: false, status: 500, error: message };
  }
}
