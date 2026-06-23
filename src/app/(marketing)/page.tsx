import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import LandingNav from "@/components/LandingNav";

const platforms = [
  { name: "Shopify",        badge: "Script Tag",  desc: "Paste one line in your theme.liquid file. Works instantly on any Shopify store.",        color: "from-green-500/10 to-transparent border-green-500/20",  dotColor: "bg-green-400",  bg: "bg-[#96BF48]", label: "S",    slug: "shopify"      },
  { name: "WooCommerce",    badge: "Script Tag",  desc: "Add via Simple Custom CSS & JS plugin or paste in your theme header.",                   color: "from-purple-500/10 to-transparent border-purple-500/20", dotColor: "bg-purple-400", bg: "bg-[#7F54B3]", label: "Woo",  slug: "woocommerce"  },
  { name: "WordPress",      badge: "Script Tag",  desc: "Add via Custom HTML block or inject in your theme header.php file.",                     color: "from-blue-500/10 to-transparent border-blue-500/20",    dotColor: "bg-blue-400",   bg: "bg-[#21759B]", label: "WP",   slug: "wordpress"    },
  { name: "BigCommerce",    badge: "Script Tag",  desc: "Paste via Storefront Script Manager. No theme editing required.",                        color: "from-slate-400/10 to-transparent border-slate-400/20",  dotColor: "bg-slate-300",  bg: "bg-[#34313F]", label: "BC",   slug: "bigcommerce"  },
  { name: "Wix",            badge: "Script Tag",  desc: "Settings › Custom Code › Add to Head. Works on all Wix stores instantly.",               color: "from-blue-400/10 to-transparent border-blue-400/20",    dotColor: "bg-blue-400",   bg: "bg-[#0C6EFC]", label: "Wix",  slug: "wix"          },
  { name: "Squarespace",    badge: "Script Tag",  desc: "Settings › Advanced › Code Injection › paste in the Footer field.",                      color: "from-zinc-400/10 to-transparent border-zinc-400/20",    dotColor: "bg-zinc-300",   bg: "bg-[#444]",    label: "Sqsp", slug: "squarespace"  },
  { name: "Magento",        badge: "Script Tag",  desc: "Content › Configuration › HTML Head › Scripts and Style Sheets.",                        color: "from-orange-500/10 to-transparent border-orange-500/20", dotColor: "bg-orange-400", bg: "bg-[#EE672F]", label: "M",    slug: "magento"      },
  { name: "React / Next.js",badge: "NPM Package", desc: "Import our component directly. Full TypeScript support and hooks included.",              color: "from-cyan-500/10 to-transparent border-cyan-500/20",    dotColor: "bg-cyan-400",   bg: "bg-[#61DAFB]", label: "Re",   slug: "react"        },
];

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <LandingNav isLoggedIn={!!userId} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            Powered by Vertex AI Virtual Try-On
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Virtual Try-On<br />
            <span className="text-yellow-400">for every store</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Add AI-powered try-on to Shopify, WooCommerce, WordPress, or any platform
            with <span className="text-white/80">one line of code</span>. Your customers see themselves in your products instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up" className="rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-400/20">
              Start free, no credit card
            </Link>
            <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all">
              View pricing
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { val: "8+", label: "Platforms supported" },
              { val: "60s", label: "To integrate" },
              { val: "100%", label: "No-code option" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-yellow-400">{s.val}</div>
                <div className="text-xs text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
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
            {platforms.map((p) => (
              <Link
                href="/sign-up"
                key={p.name}
                className={`group relative rounded-2xl border bg-linear-to-b ${p.color} bg-white/3 p-5 flex flex-col gap-4 hover:bg-white/6 transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.bg}`}>
                    <span className="text-white font-black text-sm leading-none">{p.label}</span>
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
            ))}
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
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition">
                Get your API key free
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
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
                <Link href="/sign-up" className="rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-lg shadow-yellow-400/20">
                  Get started free
                </Link>
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
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-400">
              <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold">TryOn<span className="text-yellow-400">AI</span></span>
          </div>
          <p className="text-sm text-white/30">© {new Date().getFullYear()} TryOnAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="text-sm text-white/30 hover:text-white transition">Pricing</Link>
            <Link href="/dashboard" className="text-sm text-white/30 hover:text-white transition">Dashboard</Link>
            <Link href="/sign-up" className="text-sm text-white/30 hover:text-white transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
