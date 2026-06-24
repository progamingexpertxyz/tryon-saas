import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

function getStripe(): Stripe {
  if (globalForStripe.stripe) return globalForStripe.stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const instance = new Stripe(key, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
  });
  if (process.env.NODE_ENV !== "production") globalForStripe.stripe = instance;
  return instance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
