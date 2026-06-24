import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import AdminMobileNav from "@/components/AdminMobileNav";

async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const adminEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase());
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  if (!adminEmails.includes(email)) redirect("/dashboard");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await checkAdmin();

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-[#0d0d0d] border-r border-white/5 fixed inset-y-0 z-40">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 shrink-0">
            <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight leading-none">
              TryOn<span className="text-yellow-400">AI</span>
            </span>
            <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase mt-0.5">Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {[
            {
              href: "/admin",
              label: "Overview",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              href: "/admin/users",
              label: "Users",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white transition-all border border-transparent"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/5 px-3 py-4 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/30 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2">
            <UserButton />
            <p className="text-xs font-semibold text-white/40">Admin Panel</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#0d0d0d] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400 shrink-0">
            <svg className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-extrabold leading-none">TryOn<span className="text-yellow-400">AI</span></span>
            <span className="ml-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">Admin</span>
          </div>
        </div>
        <UserButton />
      </header>

      {/* Mobile bottom nav */}
      <AdminMobileNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
