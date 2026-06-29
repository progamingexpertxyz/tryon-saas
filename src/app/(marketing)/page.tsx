import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignUpButton } from "@clerk/nextjs";
import LandingNav from "@/components/LandingNav";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
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

const platforms: {
  name: string; badge: string; desc: string;
  color: string; dotColor: string; bg: string;
  glow: string;
  icon: PlatformIcon; slug: string;
}[] = [
  { name: "Shopify",        badge: "Script Tag",  desc: "Paste one line in your theme.liquid. Works on any Shopify store instantly.",         color: "from-green-500/10 to-transparent border-green-500/20",   dotColor: "bg-green-400",  bg: "bg-[#96BF48]",                      glow: "#96BF48",   icon: SiShopify,     slug: "shopify"      },
  { name: "WooCommerce",    badge: "Script Tag",  desc: "Add via Custom CSS & JS plugin or paste directly in your theme header.",             color: "from-purple-500/10 to-transparent border-purple-500/20",  dotColor: "bg-purple-400", bg: "bg-[#96588A]",                      glow: "#96588A",   icon: SiWoo,         slug: "woocommerce"  },
  { name: "WordPress",      badge: "Script Tag",  desc: "Add via Custom HTML block or inject in your theme header.php.",                      color: "from-blue-500/10 to-transparent border-blue-500/20",     dotColor: "bg-blue-400",   bg: "bg-[#21759B]",                      glow: "#21759B",   icon: SiWordpress,   slug: "wordpress"    },
  { name: "BigCommerce",    badge: "Script Tag",  desc: "Paste via Storefront Script Manager. No theme editing required.",                    color: "from-slate-400/10 to-transparent border-slate-400/20",   dotColor: "bg-slate-300",  bg: "bg-[#34313F]",                      glow: "#888888",   icon: SiBigcommerce, slug: "bigcommerce"  },
  { name: "Wix",            badge: "Script Tag",  desc: "Settings › Custom Code › Add to Head. Works on all Wix stores instantly.",           color: "from-blue-400/10 to-transparent border-blue-400/20",     dotColor: "bg-blue-400",   bg: "bg-[#116BFF]",                      glow: "#116BFF",   icon: SiWix,         slug: "wix"          },
  { name: "Squarespace",    badge: "Script Tag",  desc: "Settings › Advanced › Code Injection › paste in the Footer field.",                  color: "from-zinc-400/10 to-transparent border-zinc-400/20",     dotColor: "bg-zinc-300",   bg: "bg-[#1a1a1a] ring-1 ring-white/15", glow: "#aaaaaa",   icon: SiSquarespace, slug: "squarespace"  },
  { name: "Magento",        badge: "Script Tag",  desc: "Content › Configuration › HTML Head › Scripts and Style Sheets.",                    color: "from-orange-500/10 to-transparent border-orange-500/20",  dotColor: "bg-orange-400", bg: "bg-[#EE672F]",                      glow: "#EE672F",   icon: MagentoIcon,   slug: "magento"      },
  { name: "React / Next.js",badge: "NPM Package", desc: "Import our component directly. Full TypeScript support and hooks included.",          color: "from-cyan-500/10 to-transparent border-cyan-500/20",     dotColor: "bg-cyan-400",   bg: "bg-black ring-1 ring-white/15",     glow: "#61DAFB",   icon: SiNextdotjs,   slug: "react"        },
];

const features = [
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Results in under 5 seconds",
    desc: "Our AI processes garment images and shopper selfies in real time. No waiting, no batch jobs. Instant try-on every time.",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "One script tag, zero config",
    desc: "Drop a single line of code into any page. Our widget auto-detects product images and injects the Try-On button automatically.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Enterprise-grade reliability",
    desc: "99.9% uptime SLA. Every request is logged, monitored, and recoverable. Full analytics dashboard included on every plan.",
  },
  {
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    title: "Transparent usage billing",
    desc: "Know exactly what you're paying for. Usage resets monthly, no surprise overages. Upgrade or downgrade any time.",
  },
  {
    icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
    title: "Secure API keys",
    desc: "All keys are scoped, revokable, and tied to your account. Full HTTPS enforcement. Never exposed in browser JavaScript.",
  },
  {
    icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    title: "Detailed analytics",
    desc: "Track requests, success rates, latency trends, and API key usage. All in a clean dashboard built for store owners, not engineers.",
  },
];

const testimonials = [
  {
    text: "We integrated TryOnAI into our Shopify store in literally 10 minutes. Conversion on product pages with try-on is up 34% since launch.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Mitchell",
    role: "Founder, Boutique Fashion Store",
  },
  {
    text: "Our WooCommerce customers love it. The try-on button just appears on every product page automatically. Zero ongoing maintenance.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "James Keller",
    role: "Head of eCommerce, Lifestyle Brand",
  },
  {
    text: "Finally a virtual try-on that doesn't require a six-month dev project. The API key took 30 seconds, the script tag took another 30.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Priya Nair",
    role: "CTO, Online Apparel Startup",
  },
  {
    text: "Our return rate dropped 22% after adding TryOnAI. Shoppers actually know how clothes will look before buying. Game changer.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO, Fashion eCommerce",
  },
  {
    text: "Setup was literally copy-paste. I had the try-on widget live on my Wix store in under 5 minutes. Incredible product.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Store Owner, Wix",
  },
  {
    text: "The analytics dashboard alone is worth it. I can see exactly which products get the most try-ons and which convert best.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst, Retail Brand",
  },
  {
    text: "Our Shopify Plus store serves thousands of visitors daily. TryOnAI handles the load without a single hiccup. Rock-solid.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Head of Technology, Fashion Chain",
  },
  {
    text: "I was skeptical about AI try-on but the results look genuinely realistic. Our customers keep coming back to use it.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Founder, Clothing Brand",
  },
  {
    text: "Switched from a competitor and the difference is night and day. Faster, cleaner output and the integration is half the code.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const faqs = [
  {
    q: "How does the virtual try-on work?",
    a: "Your shopper uploads a selfie and selects a product. Our AI overlays the garment onto their photo in real time. No app download, no special hardware needed. Works entirely in the browser.",
  },
  {
    q: "Which platforms are supported?",
    a: "Shopify, WooCommerce, WordPress, BigCommerce, Wix, Squarespace, Magento, and any custom React/Next.js site. If it runs HTML, it works.",
  },
  {
    q: "Do I need a developer to set it up?",
    a: "No. For most platforms it's a single script tag. Copy, paste, done. For React/Next.js there's an npm package with a drop-in component. No backend changes needed.",
  },
  {
    q: "What counts as a request?",
    a: "Each time a shopper triggers a try-on (one photo + one garment) that counts as one request. Browsing, page views, and failed attempts don't count.",
  },
  {
    q: "Can I upgrade or cancel at any time?",
    a: "Yes. Plans are month-to-month. Upgrade instantly from the dashboard, or cancel and you keep access until the end of your billing period.",
  },
];

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <LandingNav isLoggedIn={!!userId} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, #000 30%, transparent 100%)",
            }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-400/10 rounded-full blur-[160px]" />
          <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-fuchsia-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-20 -right-40 w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[120px]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/60 mb-8 hover:border-white/20 transition cursor-default">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            AI-powered virtual try-on for eCommerce
            <span className="text-white/25">·</span>
            <span className="text-yellow-400">Now with React package</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.02] mb-6">
            Let shoppers try on<br />
            <span className="relative">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                before they buy
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            Add AI virtual try-on to any store in under 60 seconds.
            One script tag. Any platform. No ML expertise needed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <SignUpButton mode="modal">
              <button className="rounded-2xl bg-yellow-400 px-8 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-xl shadow-yellow-400/20 cursor-pointer">
                Start free, no credit card
              </button>
            </SignUpButton>
            <Link
              href="/#how"
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              See how it works
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-6 justify-center text-xs text-white/35 flex-wrap">
            {["100 free requests included", "No credit card required", "Live in 60 seconds", "8+ platforms supported"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          {/* Platform icons */}
          <div className="mt-14">
            <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-semibold mb-10">Works with every major platform</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-x-6 gap-y-8 max-w-2xl mx-auto">
              {platforms.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.slug}
                    className="group flex flex-col items-center gap-2.5 cursor-default"
                  >
                    <div className="relative">
                      {/* Hover glow burst */}
                      <div
                        className="absolute -inset-3 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                        style={{ backgroundColor: p.glow }}
                      />
                      {/* Resting ambient glow */}
                      <div
                        className="absolute -inset-2 rounded-2xl blur-md opacity-20"
                        style={{ backgroundColor: p.glow }}
                      />
                      {/* Icon square */}
                      <div
                        className={`icon-box relative flex h-14 w-14 items-center justify-center rounded-2xl ${p.bg} border border-white/10 group-hover:border-white/25 z-10`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-white/25 group-hover:text-white/60 transition-colors whitespace-nowrap text-center">
                      {p.name === "React / Next.js" ? "Next.js" : p.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero visual — wide product mockup */}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pb-24">
          <div className="absolute inset-0 -m-8 bg-yellow-400/5 blur-3xl rounded-full pointer-events-none" />
          <div className="relative rounded-3xl border border-white/10 bg-[#111]/80 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-[#0d0d0d]">
              <span className="h-3 w-3 rounded-full bg-red-500/50" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <span className="h-3 w-3 rounded-full bg-green-500/50" />
              <div className="ml-3 flex-1 max-w-xs rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-[11px] text-white/30 font-mono">
                yourstore.com/products/linen-jacket
              </div>
            </div>

            {/* Mockup content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 min-h-[340px]">
              {/* Left — product page */}
              <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-white/5">
                <div className="flex gap-4 mb-5">
                  {/* Product image placeholder */}
                  <div className="w-24 h-28 rounded-xl bg-gradient-to-br from-zinc-700/40 to-zinc-900/60 border border-white/5 shrink-0 flex items-center justify-center">
                    <svg className="h-8 w-8 text-white/15" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 3l5 2.5v4.5h-3V21H6V10H3V5.5L8 3l4 2 4-2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-3 bg-white/10 rounded-full mb-2 w-3/4" />
                    <div className="h-2.5 bg-white/5 rounded-full mb-4 w-1/2" />
                    <div className="text-lg font-extrabold text-white mb-1">$129.00</div>
                    <div className="flex gap-1.5 flex-wrap">
                      {["XS","S","M","L","XL"].map((s) => (
                        <span key={s} className={`h-7 w-9 rounded-lg border text-xs font-semibold flex items-center justify-center ${s === "M" ? "border-yellow-400/60 bg-yellow-400/10 text-yellow-400" : "border-white/10 text-white/30"}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl bg-white/8 border border-white/10 py-2.5 text-center text-xs font-semibold text-white/50">
                    Add to cart
                  </div>
                  {/* Try-on button */}
                  <div className="flex items-center gap-1.5 rounded-xl bg-yellow-400 px-3 py-2.5 text-xs font-extrabold text-black shrink-0 shadow-lg shadow-yellow-400/25">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Try On
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {[80, 60, 70].map((w, i) => (
                    <div key={i} className={`h-2 bg-white/5 rounded-full`} style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>

              {/* Right — try-on result */}
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Virtual Try-On</p>
                  <div className="flex items-center gap-1.5 rounded-full bg-green-400/10 border border-green-400/20 px-2.5 py-1 text-[10px] font-bold text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Ready in 4.1s
                  </div>
                </div>
                <div className="flex gap-3 flex-1">
                  {/* Shopper photo */}
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-sky-500/15 to-zinc-900/50 border border-white/5 flex items-center justify-center min-h-[160px]">
                    <div className="text-center">
                      <svg className="h-10 w-10 text-white/20 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                      </svg>
                      <span className="text-[9px] text-white/25 font-medium">Your photo</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </div>
                  {/* Result */}
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-yellow-400/20 via-amber-400/10 to-fuchsia-500/15 border border-yellow-400/30 shadow-lg shadow-yellow-400/10 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                    <div className="text-center">
                      <svg className="h-12 w-12 text-white/25 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
                      </svg>
                      <span className="text-[9px] text-yellow-400 font-bold">Try-on result</span>
                    </div>
                    <div className="absolute top-2 right-2 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[8px] font-extrabold text-black flex items-center gap-0.5">
                      <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11 1l2.5 6.5L20 10l-6.5 2.5L11 19l-2.5-6.5L2 10l6.5-2.5L11 1z" />
                      </svg>
                      AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { val: "8+",    label: "Platforms supported" },
              { val: "< 5s",  label: "Average try-on time" },
              { val: "60s",   label: "To go live" },
              { val: "100%",  label: "Browser-based, no app" },
            ].map((s, i) => (
              <div key={s.label} className={`text-center ${i > 0 ? "sm:border-l sm:border-white/5 sm:pl-8" : ""}`}>
                <div className="text-3xl font-extrabold text-white mb-1">{s.val}</div>
                <div className="text-xs text-white/35">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-14 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">Why TryOnAI</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
              Built for store owners,<br />not engineers
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              No ML background required. No server infrastructure. Just fast, accurate try-on results your shoppers will love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 hover:border-white/15 hover:bg-white/[0.05] transition-all group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 mb-5 group-hover:bg-yellow-400/15 transition">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-14 sm:py-28 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">Setup</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">Up and running in 3 steps</h2>
            <p className="text-white/45 text-lg max-w-lg mx-auto">No ML expertise. No complex setup. Copy, paste, done.</p>
          </div>

          {/* Step track — same grid as cards so circles align with card centers */}
          <div className="hidden sm:grid grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="relative flex items-center justify-center h-10">
                {/* Line from circle center into right gap */}
                {i < 2 && (
                  <div className="absolute left-1/2 -right-3 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-yellow-400/60 to-yellow-400/20" />
                )}
                {/* Line from left gap into circle center */}
                {i > 0 && (
                  <div className="absolute -left-3 right-1/2 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-yellow-400/20 to-yellow-400/60" />
                )}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black text-sm font-extrabold shadow-lg shadow-yellow-400/30">
                  {n}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Sign up & get your key",
                desc: "Create a free account and generate your unique API key from the dashboard in under 60 seconds.",
                icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
              },
              {
                title: "Paste one script tag",
                desc: "Add our widget to your Shopify theme, WooCommerce header, or any HTML page. Takes 30 seconds.",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
              },
              {
                title: "Shoppers try on instantly",
                desc: "A Virtual Try-On button appears on product pages. Shoppers upload a selfie and see results in seconds.",
                icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex flex-col">
                {/* Mobile step number */}
                <div className="flex h-8 w-8 sm:hidden items-center justify-center rounded-full bg-yellow-400 text-black text-xs font-extrabold mb-4">
                  {i + 1}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 border border-yellow-400/20 mb-5">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <SignUpButton mode="modal">
              <button className="rounded-2xl bg-yellow-400 px-8 py-3.5 text-sm font-bold text-black hover:bg-yellow-300 transition cursor-pointer">
                Get started free
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms" className="py-14 sm:py-28 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">Integrations</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">Works with your platform</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">
              Already selling somewhere? Integrate in minutes with no platform switch required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  href={userId ? `/dashboard/integrate?platform=${p.slug}` : "/sign-up"}
                  key={p.name}
                  className={`group relative rounded-2xl border bg-gradient-to-b ${p.color} bg-white/[0.03] p-5 flex flex-col gap-4 hover:scale-[1.02] transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bg}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2 py-1 text-[10px] font-semibold text-white/45">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.dotColor}`} />
                      {p.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-white/35 leading-relaxed">{p.desc}</p>
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

      {/* CODE */}
      <section className="py-14 sm:py-28 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">Integration</p>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
                One line.<br />Any platform.
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-8">
                Our widget auto-detects product images and injects a Try-On button. Zero configuration.
                Works on Shopify, WooCommerce, WordPress, BigCommerce, Wix, and more.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  "Auto-detects product images with no manual setup",
                  "Works with any theme, any layout",
                  "Fully responsive on mobile and desktop",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-sm text-white/55">
                    <svg className="h-4 w-4 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
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
              {/* Script tag */}
              <div className="rounded-2xl bg-[#111] border border-white/8 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d0d0d]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] text-white/25 font-mono tracking-wide">Shopify · WordPress · Any HTML</span>
                </div>
                <pre className="px-5 py-5 text-sm font-mono overflow-x-auto leading-[1.8]">
                  <span className="text-blue-400">{"<script"}</span>{"\n"}
                  {"  "}<span className="text-green-400">src</span><span className="text-white/30">=</span><span className="text-yellow-300">{`"https://yourdomain.com/widget/tryon.js"`}</span>{"\n"}
                  {"  "}<span className="text-green-400">data-api-key</span><span className="text-white/30">=</span><span className="text-yellow-300">{`"sk_live_YOUR_KEY"`}</span>{"\n"}
                  <span className="text-blue-400">{">"}</span><span className="text-blue-400">{"</script>"}</span>
                </pre>
              </div>

              {/* NPM */}
              <div className="rounded-2xl bg-[#111] border border-white/8 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0d0d0d]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] text-white/25 font-mono tracking-wide">React · Next.js</span>
                </div>
                <pre className="px-5 py-5 text-sm font-mono overflow-x-auto leading-[1.8]">
                  <span className="text-purple-400">import</span>{" "}<span className="text-white">{`{ VirtualTryOn }`}</span>{" "}<span className="text-purple-400">from</span>{" "}<span className="text-yellow-300">{`"@tryon-ai/react"`}</span>{"\n\n"}
                  <span className="text-blue-400">{"<VirtualTryOn"}</span>{"\n"}
                  {"  "}<span className="text-green-400">apiKey</span><span className="text-white/30">=</span><span className="text-yellow-300">{`"sk_live_YOUR_KEY"`}</span>{"\n"}
                  {"  "}<span className="text-green-400">clothImageUrl</span><span className="text-white/30">=</span><span className="text-white/45">{`{product.image}`}</span>{"\n"}
                  <span className="text-blue-400">{"/>"}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-14 sm:py-28 border-t border-white/5 overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-14">
            <span className="inline-flex items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-400 mb-5">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              What our users say
            </h2>
            <p className="text-white/45 text-base max-w-md mx-auto">
              See what store owners and developers have to say about TryOnAI.
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-28 border-t border-white/5">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-4">FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Common questions</h2>
          </div>
          <div className="flex flex-col divide-y divide-white/5">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-28 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative rounded-3xl border border-yellow-400/15 bg-gradient-to-br from-yellow-400/8 via-transparent to-fuchsia-500/5 px-5 sm:px-8 py-14 sm:py-20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-yellow-400/5 blur-3xl pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400 mb-5">Get started today</p>
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5">
                Add virtual try-on<br />
                <span className="text-yellow-400">to your store today</span>
              </h2>
              <p className="text-white/45 text-lg mb-10 max-w-lg mx-auto">
                Free to start. 100 requests included. Live in 60 seconds. No credit card needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <SignUpButton mode="modal">
                  <button className="rounded-2xl bg-yellow-400 px-9 py-4 text-base font-bold text-black hover:bg-yellow-300 transition-all hover:scale-[1.02] shadow-xl shadow-yellow-400/25 cursor-pointer">
                    Start free
                  </button>
                </SignUpButton>
                <Link href="/pricing" className="rounded-2xl border border-white/10 bg-white/5 px-9 py-4 text-base font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 pt-16 pb-10">
        <div className="w-full px-6 sm:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image src="/logosimple.png" alt="TryOnAI" width={120} height={120} />
              </Link>
              <p className="text-sm text-white/35 leading-relaxed max-w-[200px]">
                AI virtual try-on for every eCommerce store. One line of code, any platform.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-4">Product</p>
              <ul className="flex flex-col gap-3">
                <li><Link href="/#how" className="text-sm text-white/45 hover:text-white transition">How it works</Link></li>
                <li><Link href="/pricing" className="text-sm text-white/45 hover:text-white transition">Pricing</Link></li>
                <li><Link href="/#platforms" className="text-sm text-white/45 hover:text-white transition">Platforms</Link></li>
                <li><Link href="/dashboard" className="text-sm text-white/45 hover:text-white transition">Dashboard</Link></li>
                <li><Link href="/dashboard/api-keys" className="text-sm text-white/45 hover:text-white transition">API Keys</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-4">Platforms</p>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Shopify",         slug: "shopify" },
                  { label: "WooCommerce",     slug: "woocommerce" },
                  { label: "WordPress",       slug: "wordpress" },
                  { label: "BigCommerce",     slug: "bigcommerce" },
                  { label: "Wix",             slug: "wix" },
                  { label: "Squarespace",     slug: "squarespace" },
                  { label: "Magento",         slug: "magento" },
                  { label: "React / Next.js", slug: "react" },
                ].map((p) => (
                  <li key={p.slug}>
                    <Link href={userId ? `/dashboard/integrate?platform=${p.slug}` : "/sign-up"} className="text-sm text-white/45 hover:text-white transition">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-white/25 uppercase tracking-wider mb-4">Get started</p>
              <ul className="flex flex-col gap-3">
                <li><Link href="/sign-in" className="text-sm text-white/45 hover:text-white transition">Sign in</Link></li>
                <li>
                  <SignUpButton mode="modal">
                    <button className="text-sm text-white/45 hover:text-white transition cursor-pointer">Sign up free</button>
                  </SignUpButton>
                </li>
                <li><Link href="/pricing" className="text-sm text-white/45 hover:text-white transition">View pricing</Link></li>
                <li><Link href="/dashboard/integrate" className="text-sm text-white/45 hover:text-white transition">Integration guide</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/25">© {new Date().getFullYear()} TryOnAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-xs text-white/25 hover:text-white/60 transition">Pricing</Link>
              <Link href="/#how" className="text-xs text-white/25 hover:text-white/60 transition">How it works</Link>
              <Link href="/sign-in" className="text-xs text-white/25 hover:text-white/60 transition">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
