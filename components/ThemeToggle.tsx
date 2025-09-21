"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STORAGE_KEY = "theme" as const;
const THEME_LIGHT = "light" as const;
const THEME_DARK = "dark" as const;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const docIsDark = document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === THEME_DARK;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = docIsDark ? THEME_DARK : stored ?? (prefersDark ? THEME_DARK : THEME_LIGHT);
    setTheme(initial);
    if (initial === THEME_DARK) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", THEME_DARK);
      gsap.set(moonRef.current, { x: 0, y: 0, opacity: 1, scale: 1 });
      gsap.set(sunRef.current, { x: 10, y: -10, opacity: 0, scale: 0 });
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
      gsap.set(moonRef.current, { x: -10, y: 10, opacity: 0, scale: 0 });
      gsap.set(sunRef.current, { x: 0, y: 0, opacity: 1, scale: 1 });
    }
  }, []);

  const toggle = () => {
    const next = theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `theme=${encodeURIComponent(next)}; Max-Age=31536000; Path=/; SameSite=Lax`;
    if (next === THEME_DARK) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", THEME_DARK);
      gsap.to(sunRef.current, { x: 10, y: -10, opacity: 0, scale: 0, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(moonRef.current, { x: -10, y: 10, opacity: 0, scale: 0 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
      gsap.to(moonRef.current, { x: -10, y: 10, opacity: 0, scale: 0, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(sunRef.current, { x: 10, y: -10, opacity: 0, scale: 0 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm border border-black/10 dark:border-white/10 hover-bg-muted transition-colors"
    >
      <span className="relative inline-flex w-5 h-5 items-center justify-center">
        <svg
          ref={sunRef}
          className="sun-icon absolute"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg
          ref={moonRef}
          className="moon-icon absolute"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </span>
      <span className="hidden sm:inline">{theme === THEME_DARK ? "Dark" : "Light"}</span>
    </button>
  );
}
