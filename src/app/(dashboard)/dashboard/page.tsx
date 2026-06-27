import { getOrCreateUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PLAN_DISPLAY } from "@/lib/plans";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) return null;

  const keys = await prisma.apiKey.findMany({ where: { userId: user.id } });
  const keyIds = keys.map((k: { id: string }) => k.id);

  const [totalRequests, successfulRequests] = await Promise.all([
    prisma.request.count({ where: { apiKeyId: { in: keyIds } } }),
    prisma.request.count({ where: { apiKeyId: { in: keyIds }, success: true } }),
  ]);

  const totalLimit = keys.reduce((s: number, k: { usageLimit: number }) => s + k.usageLimit, 0);
  const totalUsed = keys.reduce((s: number, k: { usageCount: number }) => s + k.usageCount, 0);
  const planLimit = PLAN_DISPLAY[user.plan as keyof typeof PLAN_DISPLAY]?.requestsPerMonth ?? 100;
  const usagePct = planLimit > 0 ? Math.round((user.monthlyUsageCount / planLimit) * 100) : 0;

  const stats = [
    { label: "Total Requests", value: totalRequests.toString(), icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Successful", value: successfulRequests.toString(), icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "API Keys", value: keys.length.toString(), icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { label: "Usage", value: `${totalUsed}/${totalLimit}`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  const quickLinks = [
    { href: "/dashboard/api-keys", title: "API Keys", desc: "Generate and manage your keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
    { href: "/dashboard/integrate", title: "Integration Guide", desc: "Add try-on to your store", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { href: "/dashboard/usage", title: "Analytics", desc: "Track requests and performance", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Overview</h1>
        <p className="text-white/40 mt-1 text-sm">Welcome back, {user.name || user.email}</p>
      </div>

      {/* Plan limit warning at 80%+ */}
      {usagePct >= 80 && (
        <div className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${
          usagePct >= 100
            ? "border-red-400/30 bg-red-400/8"
            : "border-yellow-400/30 bg-yellow-400/8"
        }`}>
          <svg className={`h-5 w-5 shrink-0 mt-0.5 ${usagePct >= 100 ? "text-red-400" : "text-yellow-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${usagePct >= 100 ? "text-red-400" : "text-yellow-400"}`}>
              {usagePct >= 100 ? "Monthly limit reached" : `${usagePct}% of monthly limit used`}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {usagePct >= 100
                ? "New try-on requests are blocked until your limit resets."
                : "You're approaching your plan limit. Upgrade to avoid interruptions."}
            </p>
          </div>
          <Link href="/dashboard/settings" className="shrink-0 rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black hover:bg-yellow-300 transition">
            Upgrade
          </Link>
        </div>
      )}

      {/* Onboarding banner — shown only when user has no keys yet */}
      {keys.length === 0 && (
        <div className="rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/15 border border-yellow-400/20">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white mb-1">Get started in 3 steps</p>
              <ol className="flex flex-col gap-2 mt-3">
                {[
                  { step: "1", text: "Create an API key", href: "/dashboard/api-keys", cta: "Create key →" },
                  { step: "2", text: "Add one script tag to your store", href: "/dashboard/integrate", cta: "Integration guide →" },
                  { step: "3", text: "Your shoppers can now try on products instantly", href: null, cta: null },
                ].map((s) => (
                  <li key={s.step} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-extrabold">
                      {s.step}
                    </span>
                    <span className="text-sm text-white/60 flex-1">{s.text}</span>
                    {s.href && s.cta && (
                      <Link href={s.href} className="text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition shrink-0">
                        {s.cta}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={stat.icon} />
              </svg>
              <p className="text-xs font-medium text-white/40">{stat.label}</p>
            </div>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-white/10 bg-white/3 p-6 hover:border-yellow-400/30 hover:bg-white/6 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 mb-4">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={link.icon} />
              </svg>
            </div>
            <h3 className="font-bold text-white group-hover:text-yellow-400 transition mb-1">{link.title}</h3>
            <p className="text-sm text-white/40">{link.desc}</p>
          </Link>
        ))}
      </div>

      {/* Keys list or empty state */}
      {keys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 mx-auto mb-4">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-white/60 mb-4">No API keys yet</p>
          <Link href="/dashboard/api-keys" className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition">
            Create your first API key
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-white text-sm">Your API Keys</h2>
            <Link href="/dashboard/api-keys" className="text-xs text-yellow-400 hover:text-yellow-300 transition font-semibold">
              Manage all →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {keys.map((key: { id: string; name: string; key: string; usageCount: number; usageLimit: number; isActive: boolean }) => (
              <div key={key.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{key.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${key.isActive ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/40"}`}>
                      {key.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 font-mono">{key.key.slice(0, 24)}...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{key.usageCount}<span className="text-white/30">/{key.usageLimit}</span></p>
                  <p className="text-xs text-white/30">requests</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
