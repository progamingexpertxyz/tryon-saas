"use client";

import { useState, useEffect, useMemo } from "react";

interface Request {
  id: string;
  success: boolean;
  latencyMs: number | null;
  origin: string | null;
  createdAt: string;
  apiKey: { name: string };
}

interface UsageData {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatencyMs: number;
  recentRequests: Request[];
}

type Range = "7d" | "30d" | "all";

function MiniBarChart({ requests }: { requests: Request[] }) {
  const days = useMemo(() => {
    const map: Record<string, { ok: number; fail: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map[d.toISOString().slice(0, 10)] = { ok: 0, fail: 0 };
    }
    requests.forEach((r) => {
      const key = r.createdAt.slice(0, 10);
      if (map[key]) r.success ? map[key].ok++ : map[key].fail++;
    });
    return Object.entries(map).map(([date, v]) => ({ date, ...v }));
  }, [requests]);

  const max = Math.max(...days.map((d) => d.ok + d.fail), 1);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-white">Requests — last 7 days</p>
        <div className="flex items-center gap-4 text-xs text-white/35">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400" />Success</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" />Failed</span>
        </div>
      </div>
      <div className="flex items-end gap-1.5 h-24">
        {days.map((d) => {
          const total = d.ok + d.fail;
          const okPct = total > 0 ? (d.ok / max) * 100 : 0;
          const failPct = total > 0 ? (d.fail / max) * 100 : 0;
          return (
            <div key={d.date} className="flex-1 flex flex-col justify-end gap-0.5 group" title={`${d.date}: ${d.ok} ok, ${d.fail} failed`}>
              {failPct > 0 && <div className="rounded-t-sm bg-red-400/70" style={{ height: `${failPct}%` }} />}
              {okPct > 0 && <div className={`${failPct > 0 ? "" : "rounded-t-sm"} bg-green-400/70`} style={{ height: `${okPct}%` }} />}
              {total === 0 && <div className="h-1 rounded-full bg-white/10" />}
              <span className="text-[9px] text-white/20 text-center mt-1 leading-none">
                {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<Range>("all");

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  const filteredRequests = useMemo(() => {
    if (!data) return [];
    if (range === "all") return data.recentRequests;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (range === "7d" ? 7 : 30));
    return data.recentRequests.filter((r) => new Date(r.createdAt) >= cutoff);
  }, [data, range]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
        <div className="h-72 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!data) return (
    <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-red-400 mb-1">Failed to load usage data</p>
      <p className="text-xs text-white/30">Please refresh the page to try again.</p>
    </div>
  );

  const successRate = data.totalRequests > 0
    ? Math.round((data.successfulRequests / data.totalRequests) * 100)
    : 0;

  const stats = [
    {
      label: "Total Requests",
      value: data.totalRequests.toLocaleString(),
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "text-white",
      bg: "bg-white/5 border-white/8",
      iconColor: "text-white/40",
    },
    {
      label: "Successful",
      value: data.successfulRequests.toLocaleString(),
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-green-400",
      bg: "bg-green-400/5 border-green-400/15",
      iconColor: "text-green-400",
    },
    {
      label: "Failed",
      value: data.failedRequests.toLocaleString(),
      icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-red-400",
      bg: "bg-red-400/5 border-red-400/15",
      iconColor: "text-red-400",
    },
    {
      label: "Avg Latency",
      value: data.avgLatencyMs > 0 ? `${data.avgLatencyMs}ms` : "N/A",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-blue-400",
      bg: "bg-blue-400/5 border-blue-400/15",
      iconColor: "text-blue-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Usage Analytics</h1>
          <p className="text-white/40 mt-1 text-sm">Track your API requests and performance</p>
        </div>
        {data.totalRequests > 0 && (
          <div className="text-right">
            <p className="text-2xl font-extrabold text-white tabular-nums">{successRate}%</p>
            <p className="text-xs text-white/35">success rate</p>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border ${stat.bg} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <svg className={`h-4 w-4 ${stat.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={stat.icon} />
              </svg>
              <p className="text-xs text-white/30 font-medium truncate">{stat.label}</p>
            </div>
            <p className={`text-2xl font-extrabold tabular-nums ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {data.recentRequests.length > 0 && <MiniBarChart requests={data.recentRequests} />}

      {/* Breakdown bar */}
      {data.totalRequests > 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white/60">Request breakdown</p>
            <div className="flex items-center gap-4 text-xs text-white/35">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-400" />Success
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400" />Failed
              </span>
            </div>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden flex gap-0.5">
            <div className="bg-green-400 transition-all rounded-l-full" style={{ width: `${successRate}%` }} />
            <div className="bg-red-400 transition-all rounded-r-full flex-1" />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-green-400/60">{data.successfulRequests} succeeded</span>
            <span className="text-xs text-red-400/60">{data.failedRequests} failed</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-white">Recent Requests</h2>
          <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/3 p-1">
            {(["7d", "30d", "all"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  range === r ? "bg-yellow-400 text-black" : "text-white/40 hover:text-white"
                }`}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "All"}
              </button>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/8 mx-auto mb-4">
              <svg className="h-5 w-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-white/40 mb-1">No requests yet</p>
            <p className="text-xs text-white/25">Make your first API call to see data here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider">API Key</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider">Latency</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider hidden sm:table-cell">Origin</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/25 uppercase tracking-wider">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        req.success
                          ? "bg-green-400/10 text-green-400"
                          : "bg-red-400/10 text-red-400"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${req.success ? "bg-green-400" : "bg-red-400"}`} />
                        {req.success ? "OK" : "Fail"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/50 font-medium">{req.apiKey.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/40 tabular-nums">
                        {req.latencyMs ? `${req.latencyMs}ms` : <span className="text-white/20">N/A</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-white/30 max-w-28 truncate block">
                        {req.origin || <span className="text-white/15">N/A</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/25 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleString("en-US", {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
