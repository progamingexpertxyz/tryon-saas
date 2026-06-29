import { prisma } from "@/lib/prisma";
import { PLAN_DISPLAY } from "@/lib/plans";
import Link from "next/link";
import { HiUsers, HiCurrencyDollar, HiBolt, HiCheckCircle } from "react-icons/hi2";

export const dynamic = "force-dynamic";

const PLAN_PRICES: Record<string, number> = { free: 0, pro: 29, business: 99 };

export default async function AdminOverviewPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalUsers,
    newUsersThisMonth,
    totalRequests,
    requestsThisMonth,
    requestsToday,
    successfulRequests,
    usersByPlan,
    recentUsers,
    avgLatencyRaw,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.request.count(),
    prisma.request.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.request.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.request.count({ where: { success: true } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        monthlyUsageCount: true,
        createdAt: true,
      },
    }),
    prisma.request.aggregate({ _avg: { latencyMs: true } }),
  ]);

  const planCounts = Object.fromEntries(usersByPlan.map((p) => [p.plan, p._count._all]));
  const successRate = totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0;
  const avgLatency = Math.round(avgLatencyRaw._avg.latencyMs ?? 0);

  // Estimated MRR from current paid users
  const mrr = Object.entries(planCounts).reduce((sum, [plan, count]) => {
    return sum + (PLAN_PRICES[plan] ?? 0) * count;
  }, 0);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      sub: `+${newUsersThisMonth} this month`,
      Icon: HiUsers,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Est. MRR",
      value: `$${mrr.toLocaleString()}`,
      sub: `${(planCounts.pro ?? 0) + (planCounts.business ?? 0)} paid users`,
      Icon: HiCurrencyDollar,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Requests",
      value: totalRequests.toLocaleString(),
      sub: `${requestsThisMonth.toLocaleString()} this month · ${requestsToday} today`,
      Icon: HiBolt,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      sub: `${(totalRequests - successfulRequests).toLocaleString()} failed · avg ${avgLatency}ms`,
      Icon: HiCheckCircle,
      color: successRate >= 90 ? "text-green-400" : successRate >= 70 ? "text-yellow-400" : "text-red-400",
      bg: successRate >= 90 ? "bg-green-400/10" : successRate >= 70 ? "bg-yellow-400/10" : "bg-red-400/10",
    },
  ];

  const planOrder = ["free", "pro", "business"] as const;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Overview</h1>
          <p className="text-white/40 mt-1 text-sm">
            {now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          href="/admin/users"
          className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 transition shrink-0"
        >
          All Users →
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg} mb-4`}>
              <s.Icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-white mb-1">{s.value}</p>
            <p className="text-xs font-semibold text-white/30 mb-0.5">{s.label}</p>
            <p className="text-[11px] text-white/20">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Plan breakdown */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <h2 className="text-sm font-bold text-white mb-6">Users by Plan</h2>
          <div className="flex flex-col gap-5">
            {planOrder.map((key) => {
              const count = planCounts[key] ?? 0;
              const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              const p = PLAN_DISPLAY[key];
              const revenue = PLAN_PRICES[key] * count;
              return (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${key === "business" ? "bg-purple-400" : key === "pro" ? "bg-yellow-400" : "bg-white/30"}`} />
                      <span className="font-semibold text-white/70">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40">
                      <span>{count} users</span>
                      {revenue > 0 && <span className="text-green-400 font-semibold">${revenue}/mo</span>}
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${key === "business" ? "bg-purple-400" : key === "pro" ? "bg-yellow-400" : "bg-white/20"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-white/20">{pct}% of users</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent signups */}
        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Recent Signups</h2>
            <Link href="/admin/users" className="text-xs text-yellow-400 hover:text-yellow-300 transition font-semibold">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentUsers.map((u) => {
              const plan = PLAN_DISPLAY[u.plan as keyof typeof PLAN_DISPLAY] ?? PLAN_DISPLAY.free;
              return (
                <div key={u.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{u.name || u.email}</p>
                    {u.name && <p className="text-xs text-white/30 truncate">{u.email}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      u.plan === "business" ? "bg-purple-400/10 text-purple-400" :
                      u.plan === "pro" ? "bg-yellow-400/10 text-yellow-400" :
                      "bg-white/8 text-white/30"
                    }`}>
                      {plan.name}
                    </span>
                    <span className="text-[11px] text-white/25">
                      {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentUsers.length === 0 && (
              <div className="px-5 py-10 text-center text-white/20 text-sm">No users yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
