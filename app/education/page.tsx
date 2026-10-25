import type { Metadata } from "next";
import Link from "next/link";
import { EducationSupportButton, EducationSupportDetails } from "@/components/education-support";
import { EducationFundingOptions } from "@/components/education-funding-options";
import { checkoutConfiguration } from "@/lib/education-checkout.mjs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Codepet Education",
  description: "Free tools and resources for students and educators. Meet Zero, a simple kit for building Java apps.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  const checkout = checkoutConfiguration(process.env);
  const checkoutReady = checkout !== null;
  return (
    <section className="w-full max-w-2xl px-6 py-12 sm:py-16">
      <nav aria-label="Education page" className="mb-10 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/dash" className="hover:text-gray-800 hover:underline dark:hover:text-gray-200">Codepet projects</Link>
      </nav>

      <h1 className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-4xl">Codepet Education</h1>
      <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300">Free tools and resources for students and educators.</p>
      <div className="flex flex-wrap items-center gap-x-6">
        <EducationSupportButton />
        <Link href="/education/campaign-preview" className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400">Campaign preview →</Link>
      </div>

      <section aria-labelledby="zero-title" className="my-10">
        <h2 id="zero-title" className="text-2xl font-semibold text-gray-950 dark:text-white"><a href="https://zero.codepet.ca" className="inline-flex min-h-11 items-center hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Zero</a></h2>
        <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">A simple kit for building Java apps.</p>
      </section>

      <details className="border-t border-gray-200 text-sm dark:border-gray-800">
        <summary className="min-h-11 cursor-pointer py-3 text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-gray-200">About the program</summary>
        <p className="pb-4 leading-6 text-gray-600 dark:text-gray-300">Codepet Education is an internal education program of Codepet Inc., bringing together Zero, learning resources, and future education projects.</p>
      </details>
      <EducationSupportDetails>
        <summary className="min-h-11 cursor-pointer py-3 text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-gray-200">Support education</summary>
        <div className="space-y-3 pb-4 leading-6 text-gray-600 dark:text-gray-300">
          <p>Voluntary support helps fund maintenance, learning materials, testing, and development and teaching time. Everyone gets the same Zero tools and materials.</p>
          <EducationFundingOptions checkoutReady={checkoutReady} portalUrl={checkout?.portalUrl} />
          <p>{checkoutReady ? "Test mode only. Live payments are not yet available. " : "Payments are not yet available. "}Once set up, contributions will go to Codepet Inc. for Zero and its other education projects. The program does not issue charitable tax receipts.</p>
          <p><a href="https://zero.codepet.ca/community" className="text-blue-600 hover:underline dark:text-blue-400">Contribute examples, guides, or components →</a></p>
        </div>
      </EducationSupportDetails>
    </section>
  );
}
