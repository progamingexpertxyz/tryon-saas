import { prisma } from "./prisma";
import type { ApiKey } from "@prisma/client";
import { PLANS, isValidPlan } from "./plans";

export type ValidateResult =
  | { ok: true; apiKey: ApiKey }
  | { ok: false; status: number; error: string };

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function validateApiKey(key: string | null): Promise<ValidateResult> {
  if (!key) {
    return { ok: false, status: 401, error: "Missing API key. Pass it via x-api-key header." };
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: { user: true },
  });

  if (!apiKey) {
    return { ok: false, status: 401, error: "Invalid API key." };
  }

  if (!apiKey.isActive) {
    return { ok: false, status: 403, error: "API key is disabled." };
  }

  const user = apiKey.user;
  const now = Date.now();
  const plan = isValidPlan(user.plan) ? user.plan : "free";
  const planLimit = PLANS[plan].requestsPerMonth;

  // Monthly reset for free plan users (paid plans are reset via Stripe invoice.paid webhook)
  if (plan === "free" && now - user.usageResetAt.getTime() > THIRTY_DAYS_MS) {
    await prisma.$transaction([
      prisma.apiKey.updateMany({ where: { userId: user.id }, data: { usageCount: 0 } }),
      prisma.user.update({
        where: { id: user.id },
        data: { usageResetAt: new Date(), monthlyUsageCount: 0 },
      }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (apiKey as any).usageCount = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user as any).monthlyUsageCount = 0;
  }

  if (user.monthlyUsageCount >= planLimit) {
    return {
      ok: false,
      status: 429,
      error: `Monthly limit reached (${planLimit} requests on ${PLANS[plan].name} plan). Upgrade your plan at your dashboard.`,
    };
  }

  return { ok: true, apiKey };
}

export async function incrementUsage(
  apiKeyId: string,
  userId: string,
  success: boolean,
  latencyMs: number,
  origin?: string,
) {
  await Promise.all([
    prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { monthlyUsageCount: { increment: 1 } },
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
