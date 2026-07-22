import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Codepet.",
};

export default function AboutPage() {
  return (
    <div className="text-center px-6">
      <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 mb-6">
        We&apos;re about creating fun learning experiences together.
      </p>
      <a
        href="mailto:dev.codepet@gmail.com"
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        dev.codepet@gmail.com
      </a>
      <nav className="flex justify-center gap-6 text-sm mt-10">
        <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
          Terms
        </Link>
      </nav>
    </div>
  );
}
