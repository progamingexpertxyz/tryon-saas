import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-extrabold leading-none text-white/5 select-none mb-2">
          404
        </div>
        <h1 className="text-3xl font-extrabold mb-3">Page not found</h1>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
