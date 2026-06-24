import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import LandingNav from "@/components/LandingNav";
import {
  SiShopify,
  SiWoo,
  SiWordpress,
  SiBigcommerce,
  SiWix,
  SiSquarespace,
  SiNextdotjs,
} from "react-icons/si";
import type { IconType } from "react-icons";

// Custom Magento icon (not in SimpleIcons)
function MagentoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L0 6.93v10.14L2.77 18.7V8.31L12 13.56l9.23-5.25v10.39L24 17.07V6.93L12 0zm0 3.08l7.08 4.04L12 11.16 4.92 7.12 12 3.08zM2.77 20.21L12 24l9.23-3.79v-1.73L12 22.27l-9.23-3.79v1.73z" />
    </svg>
  );
}

type PlatformIcon = IconType | ((props: { className?: string }) => React.ReactElement);

const platforms: {
  name: string;
  badge: string;
  desc: string;
  color: string;
  dotColor: string;
  bg: string;
  icon: PlatformIcon;
  slug: string;
}[] = [
  { name: "Shopify",        badge: "Script Tag",  desc: "Paste one line in your theme.liquid file. Works instantly on any Shopify store.",        color: "from-green-500/10 to-transparent border-green-500/20",  dotColor: "bg-green-400",  bg: "bg-[#96BF48]",                          icon: SiShopify,     slug: "shopify"      },
  { name: "WooCommerce",    badge: "Script Tag",  desc: "Add via Simple Custom CSS & JS plugin or paste in your theme header.",                   color: "from-purple-500/10 to-transparent border-purple-500/20", dotColor: "bg-purple-400", bg: "bg-[#96588A]",                          icon: SiWoo,         slug: "woocommerce"  },
  { name: "WordPress",      badge: "Script Tag",  desc: "Add via Custom HTML block or inject in your theme header.php file.",                     color: "from-blue-500/10 to-transparent border-blue-500/20",    dotColor: "bg-blue-400",   bg: "bg-[#21759B]",                          icon: SiWordpress,   slug: "wordpress"    },
  { name: "BigCommerce",    badge: "Script Tag",  desc: "Paste via Storefront Script Manager. No theme editing required.",                        color: "from-slate-400/10 to-transparent border-slate-400/20",  dotColor: "bg-slate-300",  bg: "bg-[#34313F]",                          icon: SiBigcommerce, slug: "bigcommerce"  },
  { name: "Wix",            badge: "Script Tag",  desc: "Settings › Custom Code › Add to Head. Works on all Wix stores instantly.",               color: "from-blue-400/10 to-transparent border-blue-400/20",    dotColor: "bg-blue-400",   bg: "bg-[#116BFF]",                          icon: SiWix,         slug: "wix"          },
  { name: "Squarespace",    badge: "Script Tag",  desc: "Settings › Advanced › Code Injection › paste in the Footer field.",                      color: "from-zinc-400/10 to-transparent border-zinc-400/20",    dotColor: "bg-zinc-300",   bg: "bg-[#1a1a1a] ring-1 ring-white/15",     icon: SiSquarespace, slug: "squarespace"  },
  { name: "Magento",        badge: "Script Tag",  desc: "Content › Configuration › HTML Head › Scripts and Style Sheets.",                        color: "from-orange-500/10 to-transparent border-orange-500/20", dotColor: "bg-orange-400", bg: "bg-[#EE672F]",                          icon: MagentoIcon,   slug: "magento"      },
  { name: "React / Next.js",badge: "NPM Package", desc: "Import our component directly. Full TypeScript support and hooks included.",              color: "from-cyan-500/10 to-transparent border-cyan-500/20",    dotColor: "bg-cyan-400",   bg: "bg-black ring-1 ring-white/15",         icon: SiNextdotjs,   slug: "react"        },
];

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <LandingNav isLoggedIn={!!userId} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.16) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
            }}
          />
          {/* gradient orbs */}
          <div className="absolute -top-24 left-1/4 w-[560px] h-[480px] bg-yellow-400/15 rounded-full blur-[140px]" />
          <div className="absolute top-32 -right-20 w-[440px] h-[440px] bg-fuchsia-500/10 rounded-full blur-[130px]" />
          {/* bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-24 lg:pt-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-400 mb-7">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Powered by Google Vertex AI
              </div>

              <h1 className="text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4rem] font-extrabold tracking-tight mb-6">
                Virtual Try-On
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  for every store
                </span>
              </h1>

              <p className="text-base sm:text-lg text-white/50 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
                Let shoppers see themselves in your products. Add AI try-on to Shopify,
                WooCommerce, WordPress, or any platform with{" "}
                <span className="text-white/80 font-medium">one line of code</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <SignUpButton mode="modal">
                  <button className="rounded-2xl bg-yellow-400 px-7 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-400/25 cursor-pointer">
                    Start free, no credit card
                  </button>
                </SignUpButton>
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all text-center">
                  View pricing
                </Link>
              </div>

              {/* micro trust line */}
              <div className="mt-5 flex items-center gap-4 justify-center lg:justify-start text-xs text-white/35">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  100 free requests
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card
                </span>
              </div>

              {/* stats */}
              <div className="mt-10 flex items-center gap-8 justify-center lg:justify-start">
                {[
                  { val: "8+", label: "Platforms" },
                  { val: "60s", label: "To integrate" },
                  { val: "100%", label: "No-code option" },
                ].map((s, i) => (
                  <div key={s.label} className={`text-center lg:text-left ${i > 0 ? "border-l border-white/10 pl-8" : ""}`}>
                    <div className="text-2xl font-extrabold text-white">{s.val}</div>
                    <div className="text-xs text-white/35 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — try-on preview mockup */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
              {/* floating status chip */}
              <div className="absolute -bottom-3 -right-3 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#111]/90 backdrop-blur px-3 py-2 shadow-xl shadow-black/40">
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/70">Generated in 4.2s</span>
              </div>

              {/* glow behind card */}
              <div className="absolute inset-0 -m-6 bg-yellow-400/10 blur-3xl rounded-full" />

              {/* main card */}
              <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-2.5 shadow-2xl shadow-black/50">
                {/* browser bar */}
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                  <div className="ml-2 flex-1 rounded-md bg-white/5 px-3 py-1 text-[10px] text-white/30 font-mono truncate">
                    yourstore.com/products/denim-jacket
                  </div>
                </div>

                {/* transformation flow: product + shopper → result */}
                <div className="flex items-stretch gap-1.5 p-2.5">
                  {/* product */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="relative rounded-xl bg-gradient-to-br from-zinc-600/30 to-zinc-900/50 aspect-[3/4] overflow-hidden flex items-center justify-center">
                      <svg className="h-10 w-10 text-white/25" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 3l5 2.5v4.5h-3V21H6V10H3V5.5L8 3l4 2 4-2z" />
                      </svg>
                    </div>
                    <span className="text-center text-[10px] font-semibold text-white/40">Your product</span>
                  </div>

                  {/* + */}
                  <div className="flex flex-col items-center justify-center pb-5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/60 text-xs font-bold">+</div>
                  </div>

                  {/* shopper */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="relative rounded-xl bg-gradient-to-br from-sky-500/20 to-zinc-900/50 aspect-[3/4] overflow-hidden flex items-center justify-center">
                      <svg className="h-10 w-10 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                      </svg>
                    </div>
                    <span className="text-center text-[10px] font-semibold text-white/40">Shopper photo</span>
                  </div>

                  {/* → */}
                  <div className="flex flex-col items-center justify-center pb-5">
                    <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </div>

                  {/* result */}
                  <div className="flex-[1.15] flex flex-col gap-1.5">
                    <div className="relative rounded-xl bg-gradient-to-br from-yellow-400/30 via-amber-500/20 to-fuchsia-500/25 aspect-[3/4] overflow-hidden flex items-center justify-center ring-1 ring-yellow-400/40 shadow-lg shadow-yellow-400/10">
                      <svg className="h-12 w-12 text-white/35" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                      </svg>
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[8px] font-extrabold text-black">
                        <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11 1l2.5 6.5L20 10l-6.5 2.5L11 19l-2.5-6.5L2 10l6.5-2.5L11 1z" />
                        </svg>
                        AI
                      </div>
                    </div>
                    <span className="text-center text-[10px] font-bold text-yellow-400">Try-on result</span>
                  </div>
                </div>

                {/* explainer */}
                <p className="px-3 pb-2 text-center text-[11px] leading-relaxed text-white/45">
                  Shopper uploads a selfie and AI shows them{" "}
                  <span className="text-white/70 font-medium">wearing your product</span> in seconds.
                </p>

                {/* try-on button */}
                <div className="p-2 pt-0">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-bold text-black">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Virtual Try-On
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Works with your platform</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Already selling somewhere? Integrate in minutes without switching platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
              <Link
                href={`/dashboard/integrate?platform=${p.slug}`}
                key={p.name}
                className={`group relative rounded-2xl border bg-linear-to-b ${p.color} bg-white/3 p-5 flex flex-col gap-4 hover:bg-white/6 transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.bg}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/50">
                    <span className={`h-1.5 w-1.5 rounded-full ${p.dotColor}`} />
                    {p.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1.5">{p.name}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Integrate now
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Up and running in 3 steps</h2>
            <p className="text-white/50 max-w-lg mx-auto">No ML expertise. No complex setup. Just copy, paste, done.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { step: "01", title: "Sign up and get your API key", desc: "Create a free account and generate your unique API key from the dashboard in under 60 seconds.", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
              { step: "02", title: "Paste one line in your store", desc: "Add our script tag to your Shopify theme, WooCommerce header, or any HTML page. Takes 30 seconds.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
              { step: "03", title: "Customers try on instantly", desc: "A Virtual Try-On button appears on product pages. Customers upload their photo and see results in seconds.", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-white/10 bg-white/3 p-8">
                <span className="text-6xl font-extrabold text-white/5 absolute top-6 right-6 leading-none select-none">{item.step}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 mb-6">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code section */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                One line.<br />Any platform.
              </h2>
              <p className="text-white/50 mb-8 leading-relaxed">
                Our embed script auto-detects your product images and injects a try-on button. Zero configuration. Works on Shopify, WooCommerce, WordPress, BigCommerce, Wix, and more.
              </p>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer">
                  Get your API key free
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </SignUpButton>
            </div>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-white/30 font-mono">Shopify / WordPress / Any HTML</span>
                </div>
                <pre className="px-5 py-5 text-sm font-mono overflow-x-auto leading-relaxed">
                  <span className="text-blue-400">{"<script"}</span>{"\n"}
                  {"  "}<span className="text-green-400">{"src"}</span><span className="text-white/40">{"="}</span><span className="text-yellow-300">{'"https://yourdomain.com/widget/tryon.js"'}</span>{"\n"}
                  {"  "}<span className="text-green-400">{"data-api-key"}</span><span className="text-white/40">{"="}</span><span className="text-yellow-300">{'"sk_live_YOUR_KEY"'}</span>{"\n"}
                  <span className="text-blue-400">{">"}</span><span className="text-blue-400">{"</script>"}</span>
                </pre>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-xs text-white/30 font-mono">React / Next.js</span>
                </div>
                <pre className="px-5 py-5 text-sm font-mono overflow-x-auto leading-relaxed">
                  <span className="text-purple-400">{"import"}</span>{" "}<span className="text-white">{"{ VirtualTryOn }"}</span>{" "}<span className="text-purple-400">{"from"}</span>{" "}<span className="text-yellow-300">{'"@tryon-ai/react"'}</span>{"\n\n"}
                  <span className="text-blue-400">{"<VirtualTryOn"}</span>{"\n"}
                  {"  "}<span className="text-green-400">{"apiKey"}</span><span className="text-white/40">{"="}</span><span className="text-yellow-300">{'"sk_live_YOUR_KEY"'}</span>{"\n"}
                  {"  "}<span className="text-green-400">{"clothImageUrl"}</span><span className="text-white/40">{"="}</span><span className="text-white/50">{"{product.image}"}</span>{"\n"}
                  <span className="text-blue-400">{"/>"}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/10 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/3 px-8 py-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
                Ready to add<br />
                <span className="text-yellow-400">Virtual Try-On?</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Free to start. No credit card. Works on every major platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <SignUpButton mode="modal">
                  <button className="rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-400/20 cursor-pointer">
                    Get started free
                  </button>
                </SignUpButton>
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white transition">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logonav.png" alt="TryOnAI" width={36} height={36} className="rounded-md" />
            <span className="font-extrabold">TryOn<span className="text-yellow-400">AI</span></span>
          </div>
          <p className="text-sm text-white/30">© {new Date().getFullYear()} TryOnAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm text-white/30 hover:text-white transition">Pricing</Link>
            <Link href="/dashboard" className="text-sm text-white/30 hover:text-white transition">Dashboard</Link>
            <SignUpButton mode="modal">
              <button className="text-sm text-white/30 hover:text-white transition cursor-pointer">Sign up</button>
            </SignUpButton>
          </div>
        </div>
      </footer>
    </div>
  );
}
