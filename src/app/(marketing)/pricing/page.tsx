import { auth } from "@clerk/nextjs/server";
import LandingNav from "@/components/LandingNav";
import PricingCards from "@/components/PricingCards";

export default async function PricingPage() {
  const { userId } = await auth();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <LandingNav isLoggedIn={!!userId} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Simple pricing</h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">Start free. Scale as you grow. No hidden fees, ever.</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <PricingCards isLoggedIn={!!userId} />
      </section>
    </div>
  );
}
