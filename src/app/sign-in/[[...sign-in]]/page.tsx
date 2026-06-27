import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0d0d0d] border-r border-white/5 p-12">
        <Link href="/">
          <Image src="/logo2.png" alt="TryOnAI" width={60} height={60} />
        </Link>

        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Virtual try-on<br />
            <span className="text-yellow-400">for every store</span>
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            Add AI-powered try-on to your store in under 60 seconds. Works with Shopify, WooCommerce, WordPress, and more.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: "M5 13l4 4L19 7", text: "100 free requests — no credit card" },
              { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", text: "One script tag, any platform" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Results in under 5 seconds" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-white/50">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <svg className="h-3.5 w-3.5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                  </svg>
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/20">© {new Date().getFullYear()} TryOnAI</p>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 gap-6">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-2">
          <Image src="/logo2.png" alt="TryOnAI" width={48} height={48} />
        </Link>

        <SignIn />

        <p className="text-xs text-white/25 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
