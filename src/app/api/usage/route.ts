import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/clerk";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const keyIds = keys.map((k: { id: string }) => k.id);

  const [totalRequests, successfulRequests, recentRequests] = await Promise.all([
    prisma.request.count({ where: { apiKeyId: { in: keyIds } } }),
    prisma.request.count({ where: { apiKeyId: { in: keyIds }, success: true } }),
    prisma.request.findMany({
      where: { apiKeyId: { in: keyIds } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        success: true,
        latencyMs: true,
        origin: true,
        createdAt: true,
        apiKey: { select: { name: true } },
      },
    }),
  ]);

  const avgLatency =
    recentRequests.length > 0
      ? Math.round(recentRequests.reduce((s: number, r: { latencyMs: number | null }) => s + (r.latencyMs ?? 0), 0) / recentRequests.length)
      : 0;

  return NextResponse.json({
    totalRequests,
    successfulRequests,
    failedRequests: totalRequests - successfulRequests,
    avgLatencyMs: avgLatency,
    recentRequests,
  });
}
