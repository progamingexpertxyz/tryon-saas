"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const platforms = [
  { slug: "shopify",     name: "Shopify",         color: "bg-[#96BF48]", label: "S"   },
  { slug: "woocommerce", name: "WooCommerce",      color: "bg-[#7F54B3]", label: "Woo" },
  { slug: "wordpress",   name: "WordPress",        color: "bg-[#21759B]", label: "WP"  },
  { slug: "bigcommerce", name: "BigCommerce",      color: "bg-[#34313F]", label: "BC"  },
  { slug: "wix",         name: "Wix",              color: "bg-[#0C6EFC]", label: "Wix" },
  { slug: "squarespace", name: "Squarespace",      color: "bg-[#444]",    label: "Sqsp"},
  { slug: "magento",     name: "Magento",          color: "bg-[#EE672F]", label: "M"   },
  { slug: "react",       name: "React / Next.js",  color: "bg-[#61DAFB]", label: "Re"  },
];

export default function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
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
    <nav className="border-b border-white/8 bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logonav.png" alt="TryOnAI" width={44} height={44} className="rounded-xl" />
          <span className="text-base font-extrabold tracking-tight">
            TryOn<span className="text-yellow-400">AI</span>
          </span>
        </Link>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {/* Platforms dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPlatformsOpen(!platformsOpen)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl transition-all ${
                platformsOpen ? "text-white bg-white/8" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              Platforms
              <svg
                className={`h-3.5 w-3.5 transition-transform ${platformsOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {platformsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/60 overflow-hidden">
                <div className="px-4 pt-3 pb-2">
                  <p className="text-xs font-bold text-white/30 uppercase tracking-wider">Choose your platform</p>
                </div>
                <div className="grid grid-cols-2 gap-1 p-2">
                  {platforms.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/dashboard/integrate?platform=${p.slug}`}
                      onClick={() => setPlatformsOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-white/8 transition group"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${p.color}`}>
                        <span className="text-white font-black text-[9px] leading-none">{p.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-white/55 group-hover:text-white transition truncate">
                        {p.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="px-3 pb-3">
                  <Link
                    href="/dashboard/integrate"
                    onClick={() => setPlatformsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/8 bg-white/3 py-2.5 text-xs font-semibold text-white/40 hover:text-white hover:bg-white/8 transition"
                  >
                    View all integrations
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/pricing" className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            Pricing
          </Link>
          <Link href="#how" className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            How it works
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 transition"
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
                <button className="hidden sm:block text-sm text-white/50 hover:text-white transition px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
            </>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition"
          >
            {mobileOpen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        <div className="md:hidden border-t border-white/5 bg-[#0d0d0d] px-4 pb-5 pt-3 flex flex-col gap-1">
          {/* Platforms in mobile */}
          <p className="text-xs font-bold text-white/25 uppercase tracking-wider px-3 py-2">Platforms</p>
          <div className="grid grid-cols-2 gap-1 mb-2">
            {platforms.map((p) => (
              <Link
                key={p.slug}
                href={`/dashboard/integrate?platform=${p.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-white/8 transition"
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${p.color}`}>
                  <span className="text-white font-black text-[9px] leading-none">{p.label}</span>
                </div>
                <span className="text-xs font-semibold text-white/50 truncate">{p.name}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition">
              Pricing
            </Link>
            <Link href="#how" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm text-white/50 hover:text-white rounded-xl hover:bg-white/5 transition">
              How it works
            </Link>
          </div>
          <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button onClick={() => setMobileOpen(false)} className="w-full text-center px-4 py-2.5 text-sm text-white/60 hover:text-white rounded-xl border border-white/10 hover:bg-white/5 transition cursor-pointer">
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
