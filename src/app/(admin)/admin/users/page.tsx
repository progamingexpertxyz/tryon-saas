import { prisma } from "@/lib/prisma";
import { PLAN_DISPLAY } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search = "", page: pageStr = "1" } = await searchParams;
  const page = Math.max(1, parseInt(pageStr));
  const limit = 20;

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        monthlyUsageCount: true,
        currentPeriodEnd: true,
        createdAt: true,
        _count: { select: { apiKeys: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Users</h1>
        <p className="text-white/40 mt-1 text-sm">{total.toLocaleString()} total users</p>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by email or name..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20"
        />
        <button
          type="submit"
          className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-yellow-300 transition"
        >
          Search
        </button>
        {search && (
          <a
            href="/admin/users"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/50 hover:text-white transition"
          >
            Clear
          </a>
        )}
      </form>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-5 py-3.5 text-xs font-bold text-white/30 uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-xs font-bold text-white/30 uppercase tracking-wider">Plan</th>
                <th className="px-5 py-3.5 text-xs font-bold text-white/30 uppercase tracking-wider">Usage</th>
                <th className="px-5 py-3.5 text-xs font-bold text-white/30 uppercase tracking-wider">API Keys</th>
                <th className="px-5 py-3.5 text-xs font-bold text-white/30 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => {
                const plan = PLAN_DISPLAY[u.plan as keyof typeof PLAN_DISPLAY] ?? PLAN_DISPLAY.free;
                const usagePct = Math.min(100, Math.round((u.monthlyUsageCount / plan.requestsPerMonth) * 100));
                return (
                  <tr key={u.id} className="hover:bg-white/3 transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{u.name || "—"}</p>
                      <p className="text-xs text-white/40 mt-0.5">{u.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        u.plan === "business" ? "bg-purple-400/10 text-purple-400" :
                        u.plan === "pro" ? "bg-yellow-400/10 text-yellow-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {plan.name}
                      </span>
                      {u.currentPeriodEnd && (
                        <p className="text-[10px] text-white/25 mt-1">
                          Renews {new Date(u.currentPeriodEnd).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${usagePct >= 90 ? "bg-red-400" : usagePct >= 70 ? "bg-yellow-400" : "bg-green-400"}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40">
                          {u.monthlyUsageCount}/{plan.requestsPerMonth.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/50">{u._count.apiKeys}</td>
                    <td className="px-5 py-4 text-white/40 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Page {page} of {pages} · {total} users
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/users?search=${search}&page=${page - 1}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white transition"
                >
                  ← Prev
                </a>
              )}
              {page < pages && (
                <a
                  href={`/admin/users?search=${search}&page=${page + 1}`}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white transition"
                >
                  Next →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
