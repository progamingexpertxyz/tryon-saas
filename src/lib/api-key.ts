import { prisma } from "./prisma";
import type { ApiKey } from "@prisma/client";

export type ValidateResult =
  | { ok: true; apiKey: ApiKey }
  | { ok: false; status: number; error: string };

export async function validateApiKey(key: string | null): Promise<ValidateResult> {
  if (!key) {
    return { ok: false, status: 401, error: "Missing API key. Pass it via x-api-key header." };
  }

  const apiKey = await prisma.apiKey.findUnique({ where: { key } });

  if (!apiKey) {
    return { ok: false, status: 401, error: "Invalid API key." };
  }

  if (!apiKey.isActive) {
    return { ok: false, status: 403, error: "API key is disabled." };
  }

  if (apiKey.usageCount >= apiKey.usageLimit) {
    return { ok: false, status: 429, error: `Usage limit reached (${apiKey.usageLimit} requests). Upgrade your plan.` };
  }

  return { ok: true, apiKey };
}

export async function incrementUsage(apiKeyId: string, success: boolean, latencyMs: number, origin?: string) {
  await Promise.all([
    prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
    }),
    prisma.request.create({
      data: { apiKeyId, success, latencyMs, origin },
    }),
  ]);
}

export function generateKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "sk_live_";
  let result = prefix;
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
