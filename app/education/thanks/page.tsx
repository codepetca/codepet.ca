import type { Metadata } from "next";
import Link from "next/link";
import { educationStripe } from "@/lib/education-stripe";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Education support", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function EducationThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: id } = await searchParams;
  let confirmed = false;
  let monthly = false;
  const setup = educationStripe();
  const sessionPattern = setup?.config.mode === "live" ? /^cs_live_[a-zA-Z0-9]+$/ : /^cs_test_[a-zA-Z0-9]+$/;
  if (setup && typeof id === "string" && sessionPattern.test(id)) {
    try {
      const session = await setup.stripe.checkout.sessions.retrieve(id);
      confirmed = session.livemode === (setup.config.mode === "live") && session.metadata?.program === "codepet_education" && session.status === "complete" && session.payment_status === "paid";
      monthly = confirmed && session.mode === "subscription";
    } catch { /* A redirect alone never confirms a payment. */ }
  }
  return (
    <section className="w-full max-w-2xl px-6 py-12">
      {setup?.config.mode === "test" && <p className="mb-4 text-sm text-amber-700 dark:text-amber-400">Test checkout · no real money</p>}
      <h1 className="text-3xl font-semibold">{confirmed ? "Thank you for your support!" : "Checkout is not confirmed."}</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">{confirmed ? "Your contribution was confirmed. Your support helps maintain Zero and Codepet projects and create more learning experiences." : "Return to education to try again. This page does not confirm a contribution without a completed Stripe payment."}</p>
      <Link href="/education#support" className="mt-6 inline-flex min-h-11 items-center text-emerald-700 hover:underline dark:text-emerald-400">Back to Codepet Education →</Link>
      {monthly && setup && <p className="mt-4 text-sm"><a href={setup.config.portalUrl} className="text-emerald-700 underline dark:text-emerald-400">Manage monthly support</a></p>}
    </section>
  );
}
