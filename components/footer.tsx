import Link from "next/link";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm">
        <Link href="/" aria-label="Home">
          <FontAwesomeIcon icon={faPaw} className="h-4 w-4" />
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <span className="text-gray-400">&middot;</span>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <span className="text-gray-400">&middot;</span>
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
        <span className="text-gray-400">&middot;</span>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <span className="text-gray-400">|</span>
        <span className="text-gray-400 text-xs">&copy;{year} Codepet</span>
      </div>
    </footer>
  );
}
