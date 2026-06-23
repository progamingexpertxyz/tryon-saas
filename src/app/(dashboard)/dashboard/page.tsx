import { getOrCreateUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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
