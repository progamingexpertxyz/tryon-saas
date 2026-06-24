import { NextRequest, NextResponse } from "next/server";
import { generateTryOn } from "@/lib/tryon-service";
import { validateApiKey, incrementUsage } from "@/lib/api-key";

export const runtime = "nodejs";
export const maxDuration = 120;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const validation = await validateApiKey(key);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status, headers: CORS });
  }

  const form = await req.formData();
  const personFile = form.get("person_image") as File | null;
  const clothFile = form.get("cloth_image") as File | null;

  if (!personFile || !clothFile) {
    return NextResponse.json(
      { error: "Both person_image and cloth_image are required." },
      { status: 422, headers: CORS },
    );
  }

  for (const [field, file] of [["person_image", personFile], ["cloth_image", clothFile]] as const) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `${field} must be a jpeg, png, or webp image.` },
        { status: 422, headers: CORS },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `${field} must be under 10 MB.` },
        { status: 422, headers: CORS },
      );
    }
  }

  const start = Date.now();
  const result = await generateTryOn(personFile, clothFile);
  const latencyMs = Date.now() - start;

  const origin = req.headers.get("origin") ?? undefined;
  await incrementUsage(validation.apiKey.id, validation.apiKey.userId, result.ok, latencyMs, origin);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status, headers: CORS });
  }

  return NextResponse.json({ image: result.image }, { headers: CORS });
}
