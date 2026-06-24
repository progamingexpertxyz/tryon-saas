import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/clerk";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      plan: user.plan ?? "free",
      monthlyUsageCount: user.monthlyUsageCount ?? 0,
      currentPeriodEnd: user.currentPeriodEnd ?? null,
      stripeCustomerId: user.stripeCustomerId ?? null,
      email: user.email,
      name: user.name,
    },
  });
}
