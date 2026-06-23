import { NextRequest, NextResponse } from "next/server";
import { generateTryOn } from "@/lib/tryon-service";
import { validateApiKey, incrementUsage } from "@/lib/api-key";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-api-key");
  const validation = await validateApiKey(key);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const form = await req.formData();
  const personFile = form.get("person_image") as File | null;
  const clothFile = form.get("cloth_image") as File | null;

  if (!personFile || !clothFile) {
    return NextResponse.json({ error: "Both person_image and cloth_image are required." }, { status: 422 });
  }

  const start = Date.now();
  const result = await generateTryOn(personFile, clothFile);
  const latencyMs = Date.now() - start;

  const origin = req.headers.get("origin") ?? undefined;
  await incrementUsage(validation.apiKey.id, result.ok, latencyMs, origin);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ image: result.image });
}
