"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme" as const;
const THEME_LIGHT = "light" as const;
const THEME_DARK = "dark" as const;

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? THEME_DARK : THEME_LIGHT);
    setTheme(initial);
    if (initial === THEME_DARK) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", THEME_DARK);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  const toggle = () => {
    const next = theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(next);
    if (next === THEME_DARK) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", THEME_DARK);
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.removeAttribute("data-theme");
    }
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm border border-black/10 dark:border-white/10 hover-bg-muted transition-colors"
    >
      <span className="relative inline-flex w-5 h-5 items-center justify-center">
        <svg
          className="absolute scale-100 opacity-100 dark:opacity-0 dark:scale-0 transition-all duration-300"
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
          className="absolute scale-0 opacity-0 dark:opacity-100 dark:scale-100 transition-all duration-300"
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
