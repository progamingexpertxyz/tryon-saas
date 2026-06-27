"use client";

import Link from "next/link";
import { useState } from "react";
import { PLAN_DISPLAY } from "@/lib/plans";

const PLAN_KEYS = ["free", "pro", "business"] as const;
const ANNUAL_DISCOUNT = 0.2;

export default function PricingCards({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-semibold ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-6 w-11 rounded-full transition-colors ${annual ? "bg-yellow-400" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              annual ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-sm font-semibold ${annual ? "text-white" : "text-white/40"}`}>
          Annual
          <span className="ml-2 rounded-full bg-green-400/15 border border-green-400/25 px-2 py-0.5 text-[10px] font-bold text-green-400">
            Save 20%
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLAN_KEYS.map((key) => {
          const plan = PLAN_DISPLAY[key];
          const monthlyPrice = plan.price;
          const displayPrice = annual && monthlyPrice > 0
            ? Math.round(monthlyPrice * (1 - ANNUAL_DISCOUNT))
            : monthlyPrice;

          return (
            <div
              key={key}
              className={`relative rounded-2xl border p-8 flex flex-col gap-6 ${
                plan.highlight ? "border-yellow-400/50 bg-yellow-400/5" : "border-white/10 bg-white/3"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-yellow-400 px-4 py-1 text-xs font-extrabold text-black">Most popular</span>
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-extrabold text-white">${displayPrice}</span>
                  <span className="text-white/40 mb-1.5">/month</span>
                </div>
                {annual && monthlyPrice > 0 && (
                  <p className="text-xs text-green-400 mb-1">
                    Billed ${Math.round(displayPrice * 12)}/year · Save ${Math.round((monthlyPrice - displayPrice) * 12)}/yr
                  </p>
                )}
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
                href={isLoggedIn ? "/dashboard/settings" : "/sign-up"}
                className={`w-full text-center rounded-xl py-3 text-sm font-bold transition ${
                  plan.highlight
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isLoggedIn ? (key === "free" ? "Go to Dashboard" : `Upgrade to ${plan.name}`) : plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
