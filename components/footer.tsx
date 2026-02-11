import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-4 text-center">
      <Link
        href="/about"
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:underline"
      >
        &copy;{year} Codepet
      </Link>
    </footer>
  );
}
