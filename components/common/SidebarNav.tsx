"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

type NavItem = { href: string; label: string; id: string };

const DOT_SIZE = 10;
const ACTIVE_DOT_SIZE = 20;
const GAP = 18;
const TRANSITION = 0.4;

export default function SidebarNav() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [activeId, setActiveId] = useState<string>("home");
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const toLabel = (id: string, el?: HTMLElement) =>
    el?.dataset.label || el?.getAttribute("aria-label") || id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Build items dynamically from sections present in DOM, excluding bridge
  useEffect(() => {
    const build = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"))
        .filter((el) => el.id && el.id.toLowerCase() !== "bridge");
      const nav: NavItem[] = sections.map((el) => ({ id: el.id, href: `#${el.id}`, label: toLabel(el.id, el) }));
      setItems(nav);
      if (nav.length > 0 && !nav.some((n) => n.id === activeId)) setActiveId(nav[0].id);
    };
    build();
    // Watch for dynamic changes
    const mo = new MutationObserver(build);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", build);
    return () => {
      mo.disconnect();
      window.removeEventListener("hashchange", build);
    };
  }, [activeId]);

  const observedIds = useMemo(() => items.map((m) => m.id), [items]);

  // Intersection observer for active section
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
      const inView = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (inView.length === 0) return;
      const stacksEntry = inView.find((e) => e.target.id.startsWith("stacks-"));
      const best = stacksEntry ?? inView[0];
      setActiveId(best.target.id);
    };

    const observer = new IntersectionObserver(handle, opts);
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [observedIds]);

  // Position the active tracker centered over the active dot
  const positionTracker = useCallback((instant = false) => {
    const tracker = trackerRef.current;
    const target = dotsRef.current[activeId];
    const hostEl = wrapperRef.current;
    if (!tracker || !target || !hostEl) return;

    const rect = target.getBoundingClientRect();
    const host = hostEl.getBoundingClientRect();
    const x = rect.left - host.left + rect.width / 2 - ACTIVE_DOT_SIZE / 2;
    const y = rect.top - host.top + rect.height / 2 - ACTIVE_DOT_SIZE / 2;

    if (instant) {
      gsap.set(tracker, { x, y });
    } else {
      gsap.to(tracker, { x, y, duration: TRANSITION, ease: "power3.out" });
    }
  }, [activeId]);

  useEffect(() => {
    positionTracker(items.length <= 1);
  }, [activeId, items.length, positionTracker]);

  useEffect(() => {
    const onResize = () => positionTracker(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [positionTracker]);

  const scrollTo = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    const dot = dotsRef.current[id];
    if (dot) {
      gsap.fromTo(dot, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" });
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 select-none"
      aria-label="Section navigation"
    >
      <div ref={wrapperRef} className="relative px-3 py-4 rounded-full glass border border-black/10 dark:border-white/10">
        <div
          ref={trackerRef}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: ACTIVE_DOT_SIZE,
            height: ACTIVE_DOT_SIZE,
            background:
              "radial-gradient(closest-side, var(--accent), color-mix(in oklch, var(--accent) 30%, transparent))",
            boxShadow:
              "0 0 0 2px color-mix(in oklch, var(--accent) 40%, transparent), 0 8px 24px color-mix(in oklch, var(--accent) 30%, transparent)",
            willChange: "transform",
          }}
          aria-hidden
        />
        <ul className="flex flex-col items-center" style={{ gap: GAP }}>
          {items.map((item) => (
            <li key={item.id}>
              <button
                ref={(el) => {
                  dotsRef.current[item.id] = el;
                }}
                onClick={scrollTo(item.href)}
                aria-label={item.label}
                className="relative block rounded-full ml-[1px] mt-[2px] hover-bg-muted transition-colors"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  backgroundColor: "color-mix(in oklch, var(--foreground) 35%, transparent)",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
