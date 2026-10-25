"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";

export function EducationSupportButton() {
  return (
    <a
      href="#support"
      onClick={() => {
        const details = document.getElementById("support");
        if (details instanceof HTMLDetailsElement) details.open = true;
      }}
      className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-lg bg-emerald-700 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
    >
      <FontAwesomeIcon icon={faHandHoldingDollar} className="h-5 w-5" aria-hidden="true" />
      Support Education
    </a>
  );
}

export function EducationSupportDetails({ children }: { children: ReactNode }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function openFromHash() {
      if (window.location.hash !== "#support" || !detailsRef.current) return;
      detailsRef.current.open = true;
      detailsRef.current.scrollIntoView({ block: "start" });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <details ref={detailsRef} id="support" className="scroll-mt-8 border-y border-gray-200 text-sm dark:border-gray-800">
      {children}
    </details>
  );
}
