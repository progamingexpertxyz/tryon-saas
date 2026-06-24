"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PLAN_DISPLAY } from "@/lib/plans";

type UserBilling = {
  plan: "free" | "pro" | "business";
  monthlyUsageCount: number;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  email: string;
  name: string | null;
};

const PLAN_KEYS = ["free", "pro", "business"] as const;

export default function SettingsPage() {
  const [billing, setBilling] = useState<UserBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const upgraded = params.get("upgraded");

  useEffect(() => {
    fetch("/api/billing/info")
      .then((r) => r.json())
      .then((d) => setBilling(d.user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setUpgrading(null);
    }
  }

  async function handlePortal() {
    setOpeningPortal(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setOpeningPortal(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="h-6 w-6 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
      </div>
    );
  }

  if (!billing) return null;

  const currentPlan = PLAN_DISPLAY[billing.plan] ?? PLAN_DISPLAY.free;
  const usagePct = Math.min(100, Math.round((billing.monthlyUsageCount / currentPlan.requestsPerMonth) * 100));
  const periodEnd = billing.currentPeriodEnd ? new Date(billing.currentPeriodEnd).toLocaleDateString() : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Settings &amp; Billing</h1>
        <p className="text-white/40 mt-1 text-sm">Manage your plan and subscription.</p>
      </div>

      {/* Upgrade success banner */}
      {upgraded && (
        <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-5 py-4 flex items-center gap-3">
          <svg className="h-5 w-5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-sm font-semibold text-green-400">Plan upgraded successfully! Your new limits are active.</p>
        </div>
      )}

      {/* Current plan card */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Current Plan</p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-white">{currentPlan.name}</h2>
              <span className="rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-400 uppercase tracking-wide">
                {billing.plan === "free" ? "Free" : `$${currentPlan.price}/mo`}
              </span>
            </div>
          </div>
          {billing.stripeCustomerId && (
            <button
              onClick={handlePortal}
              disabled={openingPortal}
              className="self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:opacity-50"
            >
              {openingPortal ? "Opening..." : "Manage billing"}
            </button>
          )}
        </div>

        {/* Usage bar */}
        <div className="mb-2 flex items-center justify-between text-xs text-white/40">
          <span>Monthly usage</span>
          <span className="font-semibold text-white">
            {billing.monthlyUsageCount} / {currentPlan.requestsPerMonth.toLocaleString()}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all ${
              usagePct >= 90 ? "bg-red-400" : usagePct >= 70 ? "bg-yellow-400" : "bg-green-400"
            }`}
            style={{ width: `${usagePct}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/30">
          <span>Max API keys: {currentPlan.maxKeys === -1 ? "Unlimited" : currentPlan.maxKeys}</span>
          {periodEnd && <span>Renews: {periodEnd}</span>}
          {!periodEnd && billing.plan === "free" && <span>Resets: 30 days after first request</span>}
        </div>
      </div>

      {/* Plan cards */}
      <div>
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLAN_KEYS.map((planKey) => {
            const p = PLAN_DISPLAY[planKey];
            const isCurrent = billing.plan === planKey;
            return (
              <div
                key={planKey}
                className={`relative rounded-2xl border p-6 flex flex-col gap-4 ${
                  isCurrent
                    ? "border-yellow-400/50 bg-yellow-400/5"
                    : "border-white/10 bg-white/3"
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-4 rounded-full bg-yellow-400 px-3 py-0.5 text-[10px] font-extrabold text-black uppercase tracking-wider">
                    Current
                  </span>
                )}
                <div>
                  <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">{p.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold">${p.price}</span>
                    <span className="text-white/30 text-sm mb-1">/mo</span>
                  </div>
                </div>
                <ul className="flex flex-col gap-2 text-xs text-white/60 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-yellow-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div className="w-full text-center rounded-xl py-2.5 text-sm font-bold bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                    Active
                  </div>
                ) : planKey === "free" ? (
                  <button
                    onClick={() => router.push("/dashboard")}
                    disabled
                    className="w-full text-center rounded-xl py-2.5 text-sm font-semibold bg-white/5 text-white/40 border border-white/10 cursor-default"
                  >
                    Downgrade
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(planKey)}
                    disabled={upgrading === planKey}
                    className="w-full text-center rounded-xl py-2.5 text-sm font-bold bg-yellow-400 text-black hover:bg-yellow-300 transition disabled:opacity-60"
                  >
                    {upgrading === planKey ? "Redirecting..." : `Upgrade to ${p.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Account info */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
        <h3 className="text-sm font-bold text-white mb-4">Account</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/40">Name</span>
            <span className="text-white font-medium">{billing.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/40">Email</span>
            <span className="text-white font-medium">{billing.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
