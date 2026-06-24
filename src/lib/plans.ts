export const PLAN_DISPLAY = {
  free: {
    name: "Starter",
    price: 0,
    requestsPerMonth: 100,
    maxKeys: 1,
    features: [
      "1 API key",
      "100 try-on requests/mo",
      "Basic analytics",
      "Community support",
      "All platforms",
    ],
    highlight: false,
    cta: "Start for free",
  },
  pro: {
    name: "Pro",
    price: 29,
    requestsPerMonth: 2000,
    maxKeys: 5,
    features: [
      "5 API keys",
      "2,000 requests/mo",
      "Advanced analytics",
      "Priority email support",
      "Custom branding",
      "All platforms",
    ],
    highlight: true,
    cta: "Get Pro",
  },
  business: {
    name: "Business",
    price: 99,
    requestsPerMonth: 10000,
    maxKeys: -1,
    features: [
      "Unlimited API keys",
      "10,000 requests/mo",
      "Full analytics",
      "Dedicated support",
      "SLA guarantee",
      "White-label option",
    ],
    highlight: false,
    cta: "Get Business",
  },
} as const;

export type PlanKey = keyof typeof PLAN_DISPLAY;

// Server-only (includes Stripe price IDs — not safe for client components)
export const PLANS = {
  free: { ...PLAN_DISPLAY.free, stripePriceId: null as null },
  pro: { ...PLAN_DISPLAY.pro, stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? "" },
  business: { ...PLAN_DISPLAY.business, stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "" },
} as const;

export function getPlanFromPriceId(priceId: string): PlanKey | null {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceId && plan.stripePriceId === priceId) {
      return key as PlanKey;
    }
  }
  return null;
}

export function isValidPlan(plan: string): plan is PlanKey {
  return plan in PLAN_DISPLAY;
}
