import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getPlanFromPriceId } from "@/lib/plans";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const clerkId = session.client_reference_id;
        if (!clerkId) break;

        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = getPlanFromPriceId(priceId) ?? "pro";
        const periodEnd = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000);

        await prisma.user.updateMany({
          where: { clerkId },
          data: {
            plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: sub.id,
            currentPeriodEnd: periodEnd,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0]?.price.id ?? "";
        const plan = getPlanFromPriceId(priceId) ?? "free";
        const periodEnd = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000);

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan, currentPeriodEnd: periodEnd },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
            currentPeriodEnd: null,
          },
        });
        break;
      }

      case "invoice.paid": {
        // New billing cycle — reset monthly usage
        const invoice = event.data.object as Stripe.Invoice;
        const subId = (invoice as unknown as { subscription: string }).subscription;
        if (!subId) break;

        const user = await prisma.user.findFirst({ where: { stripeSubscriptionId: subId } });
        if (!user) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        const periodEnd = new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000);

        await prisma.$transaction([
          prisma.apiKey.updateMany({ where: { userId: user.id }, data: { usageCount: 0 } }),
          prisma.user.update({
            where: { id: user.id },
            data: { monthlyUsageCount: 0, usageResetAt: new Date(), currentPeriodEnd: periodEnd },
          }),
        ]);
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
