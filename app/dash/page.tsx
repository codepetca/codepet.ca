import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faFlask,
  faLaptopCode,
  faRocket,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { DashTitlePet } from "@/components/dash-title-pet";

interface Project {
  name: string;
  domain: string;
  href: string;
  status: "Beta" | "Experimental";
  description: string;
  icon: IconDefinition;
}

const projects: Project[] = [
  {
    name: "Pika",
    domain: "pika.codepet.ca",
    href: "https://pika.codepet.ca",
    status: "Experimental",
    description: "A classroom LMS for modern learning.",
    icon: faRocket,
  },
  {
    name: "Labs",
    domain: "labs.codepet.ca",
    href: "https://labs.codepet.ca",
    status: "Beta",
    description: "Early learning experiments and prototypes in progress.",
    icon: faFlask,
  },
  {
    name: "Lop",
    domain: "lop.codepet.ca",
    href: "https://lop.codepet.ca",
    status: "Experimental",
    description: "A polling app with useful features.",
    icon: faLaptopCode,
  },
];

export const metadata: Metadata = {
  title: "Projects",
  description: "Codepet projects and experiments.",
};

export default function DashPage() {
  return (
    <section className="animate-page-fade-in flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8">
        <div className="text-center">
          <div className="relative inline-block">
            <h1 className="text-3xl font-semibold text-gray-950 dark:text-white sm:text-4xl">
              Codepet
            </h1>
            <span className="absolute left-full top-1/2 ml-3 -translate-y-1/2 text-3xl text-gray-950 dark:text-white sm:text-4xl">
              <Suspense fallback={null}>
                <DashTitlePet />
              </Suspense>
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
            Building fun stuff together.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.domain}
              href={project.href}
              className="group flex min-h-52 flex-col rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  <FontAwesomeIcon icon={project.icon} className="h-4 w-4" />
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
                  {project.status}
                </span>
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                  {project.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {project.domain}
                </p>
                <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {project.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:underline dark:text-blue-400">
                  Open project
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="h-3 w-3"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <nav
        aria-label="Site links"
        className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <Link href="/contact" className="hover:text-gray-800 hover:underline dark:hover:text-gray-200">
          Contact
        </Link>
        <Link href="/privacy" className="hover:text-gray-800 hover:underline dark:hover:text-gray-200">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-gray-800 hover:underline dark:hover:text-gray-200">
          Terms
        </Link>
      </nav>
    </section>
  );
}
