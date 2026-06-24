import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import LandingNav from "@/components/LandingNav";
import { PLAN_DISPLAY } from "@/lib/plans";

const PLAN_KEYS = ["free", "pro", "business"] as const;

export default async function PricingPage() {
  const { userId } = await auth();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <LandingNav isLoggedIn={!!userId} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Simple pricing</h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">Start free. Scale as you grow. No hidden fees, ever.</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLAN_KEYS.map((key) => {
            const plan = PLAN_DISPLAY[key];
            return (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 flex flex-col gap-6 ${
                  plan.highlight
                    ? "border-yellow-400/50 bg-yellow-400/5"
                    : "border-white/10 bg-white/3"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-extrabold text-black">Most popular</span>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-white/40 mb-1.5">/month</span>
                  </div>
                  <p className="text-sm text-white/40">
                    {plan.requestsPerMonth.toLocaleString()} requests/mo
                    {" · "}
                    {plan.maxKeys === -1 ? "Unlimited" : plan.maxKeys} API {plan.maxKeys === 1 ? "key" : "keys"}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <svg className="h-4 w-4 shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={userId ? "/dashboard/settings" : "/sign-up"}
                  className={`w-full text-center rounded-xl py-3 text-sm font-bold transition ${
                    plan.highlight
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {userId ? (key === "free" ? "Go to Dashboard" : `Upgrade to ${plan.name}`) : plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
