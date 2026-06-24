import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import NavLinks from "@/components/NavLinks";
import MobileBottomNav from "@/components/MobileBottomNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0d0d0d] border-r border-white/5 fixed inset-y-0 z-40">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/5 shrink-0">
          <Image src="/logonav.png" alt="TryOnAI" width={32} height={32} className="rounded-xl shrink-0" />
          <Link href="/" className="text-base font-extrabold tracking-tight">
            TryOn<span className="text-yellow-400">AI</span>
          </Link>
          <span className="ml-auto text-[10px] font-bold tracking-widest text-white/20 uppercase">Beta</span>
        </div>

        {/* Nav links (client component for active state) */}
        <NavLinks />

        {/* Footer */}
        <div className="shrink-0 border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition">
            <UserButton />
            <Link href="/dashboard/settings" className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white/70 truncate hover:text-white transition">My Account</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-[#0d0d0d] border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logonav.png" alt="TryOnAI" width={28} height={28} className="rounded-lg" />
          <Link href="/" className="text-sm font-extrabold">TryOn<span className="text-yellow-400">AI</span></Link>
        </div>
        <UserButton />
      </header>

      {/* Mobile bottom nav */}
      <MobileBottomNav />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
