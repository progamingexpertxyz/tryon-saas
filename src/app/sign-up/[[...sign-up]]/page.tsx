import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0d0d0d] border-r border-white/5 p-12">
        <Link href="/">
          <Image src="/logo3.png" alt="TryOnAI" width={60} height={60} />
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5 text-xs font-semibold text-yellow-400 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Free to get started
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Start selling more<br />
            <span className="text-yellow-400">with virtual try-on</span>
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            Join stores using TryOnAI to boost conversions. No credit card, no commitment — 100 free requests included.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "100", label: "Free requests" },
              { val: "60s", label: "To integrate" },
              { val: "8+", label: "Platforms" },
              { val: "5s", label: "Per try-on" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-4">
                <p className="text-2xl font-extrabold text-white">{s.val}</p>
                <p className="text-xs text-white/35 mt-1">{s.label}</p>
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
          <Image src="/logo3.png" alt="TryOnAI" width={48} height={48} />
        </Link>

        <SignUp />

        <p className="text-xs text-white/25 text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-yellow-400 hover:text-yellow-300 transition font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
