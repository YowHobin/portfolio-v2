"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type NavItem = { href: string; label: string; id: string };

const MAIN: NavItem[] = [
  { href: "#home", label: "Home", id: "home" },
  { href: "#about", label: "About", id: "about" },
  { href: "#stacks", label: "Stacks", id: "stacks" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#contact", label: "Contact", id: "contact" },
];



export default function Header() {
  const [activeId, setActiveId] = useState<string>("home");

  const observedIds = useMemo(
    () => [
      ...MAIN.map((m) => m.id),
    ],
    []
  );

  useEffect(() => {
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const opts: IntersectionObserverInit = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const handle: IntersectionObserverCallback = (entries) => {
      // Prefer stacks sub-sections when they are intersecting.
      const inView = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio - a.intersectionRatio));
      if (inView.length === 0) return;

      // If any stacks-* is in view, take it; otherwise use the highest ratio section
      const stacksEntry = inView.find((e) => e.target.id.startsWith("stacks-"));
      const best = stacksEntry ?? inView[0];
      setActiveId(best.target.id);
    };

    const observer = new IntersectionObserver(handle, opts);
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [observedIds]);

  const isActive = (id: string) => {
    if (id === "stacks") {
      // Consider stacks active when within stacks or any of its sub-ids
      return (
        activeId === "stacks" ||
        activeId === "stacks-frontend" ||
        activeId === "stacks-backend" ||
        activeId === "stacks-infra"
      );
    }
    return activeId === id;
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
  <div className="mx-auto max-w-6xl px-4 w-full">
        <div className="mt-4 glass border border-black/10 dark:border-white/10 rounded-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="#home" className="font-semibold">LA.dev</Link>
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm nav">
              {MAIN.map((n) => (
                <a key={n.id} href={n.href} data-active={isActive(n.id)} className="link-accent">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3 ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
