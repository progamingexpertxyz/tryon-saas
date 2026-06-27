"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  SiShopify, SiWoo, SiWordpress, SiBigcommerce,
  SiWix, SiSquarespace, SiNextdotjs,
} from "react-icons/si";
import type { IconType } from "react-icons";

function MagentoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L0 6.93v10.14L2.77 18.7V8.31L12 13.56l9.23-5.25v10.39L24 17.07V6.93L12 0zm0 3.08l7.08 4.04L12 11.16 4.92 7.12 12 3.08zM2.77 20.21L12 24l9.23-3.79v-1.73L12 22.27l-9.23-3.79v1.73z" />
    </svg>
  );
}

type PlatformIcon = IconType | ((props: { className?: string }) => React.ReactElement);

const platforms: { slug: string; name: string; bg: string; icon: PlatformIcon }[] = [
  { slug: "shopify",     name: "Shopify",        bg: "bg-[#96BF48]",                      icon: SiShopify     },
  { slug: "woocommerce", name: "WooCommerce",     bg: "bg-[#96588A]",                      icon: SiWoo         },
  { slug: "wordpress",   name: "WordPress",       bg: "bg-[#21759B]",                      icon: SiWordpress   },
  { slug: "bigcommerce", name: "BigCommerce",     bg: "bg-[#34313F]",                      icon: SiBigcommerce },
  { slug: "wix",         name: "Wix",             bg: "bg-[#116BFF]",                      icon: SiWix         },
  { slug: "squarespace", name: "Squarespace",     bg: "bg-[#1a1a1a] ring-1 ring-white/15", icon: SiSquarespace },
  { slug: "magento",     name: "Magento",         bg: "bg-[#EE672F]",                      icon: MagentoIcon   },
  { slug: "react",       name: "React / Next.js", bg: "bg-black ring-1 ring-white/15",     icon: SiNextdotjs   },
];

export default function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const platformHref = (slug: string) =>
    isLoggedIn ? `/dashboard/integrate?platform=${slug}` : `/sign-up`;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformsOpen, setPlatformsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlatformsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/6 bg-[#0a0a0a]/80 backdrop-blur-2xl">
      <div className="w-full px-6 sm:px-10 flex h-16 items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/logo3.png" alt="TryOnAI" width={64} height={64} />
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          <Link href="/#how" className="px-3.5 py-2 text-sm text-white/45 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium">
            How it works
          </Link>

          {/* Platforms dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPlatformsOpen(!platformsOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-xl transition-all font-medium ${
                platformsOpen ? "text-white bg-white/8" : "text-white/45 hover:text-white hover:bg-white/5"
              }`}
            >
              Platforms
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${platformsOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {platformsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl border border-white/10 bg-[#111]/95 backdrop-blur-xl shadow-2xl shadow-black/70 overflow-hidden">
                <div className="px-4 pt-4 pb-2">
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em]">
                    Supported platforms
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.slug}
                        href={platformHref(p.slug)}
                        onClick={() => setPlatformsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/7 transition group"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${p.bg}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-[13px] font-medium text-white/50 group-hover:text-white transition truncate">
                          {p.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-white/5">
                  <Link
                    href={isLoggedIn ? "/dashboard/integrate" : "/sign-up"}
                    onClick={() => setPlatformsOpen(false)}
                    className="flex items-center justify-between w-full rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white/40 hover:text-white hover:bg-white/7 transition"
                  >
                    View all integration guides
                    <svg className="h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/pricing" className="px-3.5 py-2 text-sm text-white/45 hover:text-white rounded-xl hover:bg-white/5 transition-all font-medium">
            Pricing
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-2 text-[13px] font-bold text-black hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20"
              >
                Dashboard
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="hidden sm:block text-[13px] font-medium text-white/45 hover:text-white transition px-3.5 py-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-yellow-400 px-4 py-2 text-[13px] font-bold text-black hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20 cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d0d]/95 backdrop-blur-xl px-4 pb-5 pt-4 flex flex-col gap-1">
          <Link href="/#how" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition">
            How it works
          </Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition">
            Pricing
          </Link>

          <div className="border-t border-white/5 pt-3 mt-1">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] px-3 mb-2">Platforms</p>
            <div className="grid grid-cols-2 gap-0.5">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.slug}
                    href={platformHref(p.slug)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/7 transition group"
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${p.bg}`}>
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[13px] font-medium text-white/45 group-hover:text-white transition truncate">
                      {p.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition cursor-pointer">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button onClick={() => setMobileOpen(false)} className="w-full text-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer">
                    Get started free
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
