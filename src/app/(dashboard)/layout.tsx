import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import NavLinks from "@/components/NavLinks";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0d0d0d] border-r border-white/5 fixed inset-y-0 z-40">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-400 shrink-0">
            <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <Link href="/" className="text-base font-extrabold tracking-tight">
            TryOn<span className="text-yellow-400">AI</span>
          </Link>
          <span className="ml-auto text-[10px] font-bold tracking-widest text-white/20 uppercase">Beta</span>
        </div>

        {/* Nav links (client component for active state) */}
        <NavLinks />

        {/* Footer */}
        <div className="shrink-0 border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition cursor-pointer">
            <UserButton />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/70 truncate">My Account</p>
              <p className="text-xs text-white/30">Settings &amp; billing</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#0d0d0d] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400">
            <svg className="h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <Link href="/" className="text-sm font-extrabold">TryOn<span className="text-yellow-400">AI</span></Link>
        </div>
        <UserButton />
      </header>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-[#0d0d0d] border-t border-white/5 flex items-center justify-around z-50 px-2">
        {[
          { href: "/dashboard", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { href: "/dashboard/api-keys", label: "Keys", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
          { href: "/dashboard/usage", label: "Usage", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
          { href: "/dashboard/integrate", label: "Integrate", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 text-white/40 hover:text-white transition min-w-0 flex-1">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
            </svg>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
