import Link from "next/link";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center justify-center gap-2 px-4 py-2 text-center">
      <Link
        href="/dash"
        aria-label="Open Codepet projects dashboard"
        title="Projects"
        className="inline-flex h-11 w-11 items-center justify-center text-gray-400 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-gray-500 dark:hover:text-gray-300"
      >
        <FontAwesomeIcon icon={faHouse} className="h-5 w-5" aria-hidden="true" />
      </Link>
      <span className="text-xs text-gray-400 dark:text-gray-500">&copy;{year} Codepet</span>
    </footer>
  );
}
