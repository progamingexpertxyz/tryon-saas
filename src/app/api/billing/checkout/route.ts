import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/clerk";
import { PLANS, isValidPlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const plan = body.plan as string;

  if (!isValidPlan(plan) || plan === "free") {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  const priceId = PLANS[plan].stripePriceId;
  if (!priceId) {
    return NextResponse.json({ error: "Plan not configured." }, { status: 500 });
  }

  let customerId = user.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { clerkId: user.clerkId, userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    client_reference_id: user.clerkId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?upgraded=1`,
    cancel_url: `${appUrl}/dashboard/settings`,
    subscription_data: {
      metadata: { clerkId: user.clerkId, userId: user.id, plan },
    },
  });

  return NextResponse.json({ url: session.url });
}
