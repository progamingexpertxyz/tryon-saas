"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SiShopify,
  SiWoo,
  SiWordpress,
  SiBigcommerce,
  SiWix,
  SiSquarespace,
  SiReact,
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

// ─── Platform guides ──────────────────────────────────────────────────────────

const PLATFORMS: {
  slug: string;
  name: string;
  color: string;
  bg: string;
  icon: PlatformIcon;
  method: string;
  steps: { title: string; detail: string }[];
  code: string;
  codeLabel: string;
  tip?: string;
}[] = [
  {
    slug: "shopify",
    name: "Shopify",
    color: "#96BF48",
    bg: "bg-[#96BF48]",
    icon: SiShopify,
    method: "Script Tag",
    steps: [
      { title: "Open Theme Editor", detail: "Shopify Admin → Online Store → Themes → three dots → Edit Code." },
      { title: "Open theme.liquid", detail: "In the file tree: Layout → theme.liquid." },
      { title: "Paste before </body>", detail: "Find the closing </body> tag near the bottom and paste the script just before it." },
      { title: "Save and preview", detail: "Click Save. Visit any product page — the Try-On button appears automatically." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "theme.liquid — paste before </body>",
    tip: "The widget auto-detects Shopify product images via .product-featured-image selector.",
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    color: "#96588A",
    bg: "bg-[#96588A]",
    icon: SiWoo,
    method: "Script Tag",
    steps: [
      { title: "Install plugin", detail: "WordPress Admin → Plugins → Add New → search 'Simple Custom CSS and JS' → Install & Activate." },
      { title: "Add JavaScript", detail: "Go to Custom CSS & JS → Add JavaScript. Set location to Footer." },
      { title: "Paste and publish", detail: "Paste the script tag, then click Publish. Done — no theme editing needed." },
      { title: "Alternative", detail: "Or paste directly in Appearance → Theme Editor → header.php before </body>." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Footer (via plugin or header.php)",
    tip: "The widget detects WooCommerce images via .woocommerce-product-gallery img selector.",
  },
  {
    slug: "wordpress",
    name: "WordPress",
    color: "#21759B",
    bg: "bg-[#21759B]",
    icon: SiWordpress,
    method: "Script Tag",
    steps: [
      { title: "Install header/footer plugin", detail: "Plugins → Add New → search 'Insert Headers and Footers' → Install & Activate." },
      { title: "Add script to footer", detail: "Go to Settings → Insert Headers and Footers → Scripts in Footer. Paste the code." },
      { title: "Save", detail: "Click Save. Widget appears on all pages that have product images." },
      { title: "Alternative", detail: "Or add to Appearance → Theme Editor → functions.php using wp_enqueue_script()." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Settings → Insert Headers and Footers → Footer",
  },
  {
    slug: "bigcommerce",
    name: "BigCommerce",
    color: "#34313F",
    bg: "bg-[#34313F]",
    icon: SiBigcommerce,
    method: "Script Manager",
    steps: [
      { title: "Open Script Manager", detail: "BigCommerce Admin → Storefront → Script Manager." },
      { title: "Create a script", detail: "Click Create a Script → Name it 'TryOnAI' → Location: Footer → Pages: Store Pages." },
      { title: "Paste script", detail: "Script type: Script. Paste the code in Script Contents." },
      { title: "Save", detail: "Click Save. No theme editing required — works on all product pages immediately." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Script Manager → Script Contents",
    tip: "No theme editing needed. Script Manager handles everything natively.",
  },
  {
    slug: "wix",
    name: "Wix",
    color: "#116BFF",
    bg: "bg-[#116BFF]",
    icon: SiWix,
    method: "Custom Code",
    steps: [
      { title: "Open Custom Code settings", detail: "In Wix Editor, click the Settings gear → Advanced → Custom Code." },
      { title: "Add code snippet", detail: "Click + Add Custom Code in the top right." },
      { title: "Configure", detail: "Paste the script. Set Location to 'Body — End' and apply to 'All Pages'." },
      { title: "Publish", detail: "Click Apply, then Publish your site. Widget activates on all product pages." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Settings → Advanced → Custom Code → Body End",
  },
  {
    slug: "squarespace",
    name: "Squarespace",
    color: "#000000",
    bg: "bg-[#1a1a1a] ring-1 ring-white/15",
    icon: SiSquarespace,
    method: "Code Injection",
    steps: [
      { title: "Open Code Injection", detail: "Squarespace → Settings → Advanced → Code Injection." },
      { title: "Paste in Footer field", detail: "In the Footer section, paste the script tag." },
      { title: "Save", detail: "Click Save. Widget activates on all pages with product images." },
      { title: "Per-page option", detail: "For a specific page only: open page → gear icon → Advanced → Page Header Code Injection." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Settings → Advanced → Code Injection → Footer",
  },
  {
    slug: "magento",
    name: "Magento",
    color: "#EE672F",
    bg: "bg-[#EE672F]",
    icon: MagentoIcon,
    method: "HTML Head",
    steps: [
      { title: "Open HTML Head config", detail: "Magento Admin → Content → Configuration → Edit store view → HTML Head." },
      { title: "Add script", detail: "Scroll to 'Scripts and Style Sheets'. Paste the script tag in the text field." },
      { title: "Save and flush cache", detail: "Click Save Configuration, then System → Cache Management → Flush Magento Cache." },
      { title: "Alternative", detail: "Or add via layout XML in your theme's default_head_blocks.xml file." },
    ],
    code: `<script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY">\n</script>`,
    codeLabel: "Content → Configuration → HTML Head → Scripts",
    tip: "Always flush the Magento cache after saving — changes won't appear until cache is cleared.",
  },
  {
    slug: "react",
    name: "React / Next.js",
    color: "#000000",
    bg: "bg-black ring-1 ring-white/15",
    icon: SiNextdotjs,
    method: "Component / Script",
    steps: [
      { title: "Import the component", detail: "Import VirtualTryOn from our React package into your product page component." },
      { title: "Pass your API key", detail: "Set the apiKey prop to your key from the API Keys page." },
      { title: "Pass cloth image URL", detail: "Pass the product image URL as clothImageUrl prop." },
      { title: "Handle result (optional)", detail: "Use onResult callback to receive the generated try-on image as a base64 URL." },
    ],
    code: `// React component\nimport { VirtualTryOn } from "@tryon-ai/react";\n\nexport default function ProductPage({ product }) {\n  return (\n    <div>\n      <img src={product.image} alt={product.name} />\n      <VirtualTryOn\n        apiKey="sk_live_YOUR_API_KEY"\n        clothImageUrl={product.image}\n      />\n    </div>\n  );\n}\n\n// OR — Next.js script tag (layout.tsx)\nimport Script from "next/script";\n\n<Script\n  src="https://yourdomain.com/widget/tryon.js"\n  data-api-key="sk_live_YOUR_API_KEY"\n  strategy="afterInteractive"\n/>`,
    codeLabel: "ProductPage.tsx / layout.tsx",
    tip: "Use next/script with strategy='afterInteractive' for best Core Web Vitals scores.",
  },
];

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code.replace(/\\n/g, "\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="rounded-2xl bg-black/60 border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-white/30 font-mono">{label}</span>
        </div>
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
            copied
              ? "bg-green-400/10 border border-green-400/30 text-green-400"
              : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
          }`}
        >
          {copied ? (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-5 py-5 text-sm font-mono overflow-x-auto text-white/65 leading-relaxed">{code}</pre>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function IntegrateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeSlug = searchParams.get("platform") ?? "shopify";
  const guide = PLATFORMS.find((p) => p.slug === activeSlug) ?? PLATFORMS[0];
  const GuideIcon = guide.icon;

  const setPlatform = (slug: string) => {
    router.push(`/dashboard/integrate?platform=${slug}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Integration Guide</h1>
        <p className="text-white/40 mt-1 text-sm">Select your platform to get started</p>
      </div>

      {/* Platform selector grid */}
      <div className="rounded-2xl border border-white/8 bg-white/3 p-3">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {PLATFORMS.map((p) => {
            const isActive = p.slug === activeSlug;
            const Icon = p.icon;
            return (
              <button
                key={p.slug}
                onClick={() => setPlatform(p.slug)}
                title={p.name}
                className={`flex flex-col items-center gap-2 rounded-xl px-2 py-3 transition-all group ${
                  isActive ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${p.bg} ${
                    isActive ? "scale-110 shadow-lg shadow-black/40" : "group-hover:scale-105"
                  }`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className={`text-[10px] font-semibold leading-tight text-center transition-colors line-clamp-2 ${
                  isActive ? "text-white" : "text-white/35 group-hover:text-white/60"
                }`}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Guide content */}
      <div className="flex flex-col gap-4">

        {/* Selected platform header */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/3 p-5">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${guide.bg}`}>
            <GuideIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-extrabold text-white">{guide.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                {guide.method}
              </span>
              <span className="text-xs text-white/30">Integration ready in under 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Steps + Code side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Steps */}
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/5">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Setup Steps</p>
            </div>
            <div className="divide-y divide-white/5">
              {guide.steps.map((step, i) => (
                <div key={i} className="flex gap-3.5 px-5 py-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-400/10 border border-yellow-400/20 mt-0.5">
                    <span className="text-[11px] font-extrabold text-yellow-400">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80 mb-0.5">{step.title}</p>
                    <p className="text-xs text-white/40 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code + tip */}
          <div className="flex flex-col gap-3">
            <CodeBlock code={guide.code} label={guide.codeLabel} />

            {guide.tip && (
              <div className="flex gap-3 rounded-xl border border-yellow-400/15 bg-yellow-400/5 px-4 py-3.5">
                <svg className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-xs text-white/50 leading-relaxed">{guide.tip}</p>
              </div>
            )}

            <div className="flex gap-3 rounded-xl border border-white/5 bg-white/3 px-4 py-3.5">
              <svg className="h-4 w-4 text-white/25 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <p className="text-xs text-white/35 leading-relaxed">
                Replace <code className="text-white/55 bg-white/5 rounded px-1 font-mono">sk_live_YOUR_API_KEY</code> with your key from{" "}
                <a href="/dashboard/api-keys" className="text-yellow-400/70 hover:text-yellow-400 underline underline-offset-2 transition">
                  API Keys
                </a>
                . Each request takes 30–60s to process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntegratePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse" />
        <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        <div className="h-72 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    }>
      <IntegrateContent />
    </Suspense>
  );
}
