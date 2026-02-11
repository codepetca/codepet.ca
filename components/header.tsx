"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Header() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="p-4">
      <Link href="/" aria-label="Home">
        <FontAwesomeIcon
          icon={faPaw}
          className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        />
      </Link>
    </header>
  );
}
