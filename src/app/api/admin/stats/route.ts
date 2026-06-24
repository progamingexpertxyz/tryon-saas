import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await currentUser();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "");
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [totalUsers, totalRequests, successfulRequests, usersByPlan] = await Promise.all([
    prisma.user.count(),
    prisma.request.count(),
    prisma.request.count({ where: { success: true } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
  ]);

  const planCounts = Object.fromEntries(usersByPlan.map((p) => [p.plan, p._count._all]));

  return NextResponse.json({
    totalUsers,
    totalRequests,
    successfulRequests,
    failedRequests: totalRequests - successfulRequests,
    planCounts,
  });
}
