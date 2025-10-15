"use client";

import { useEffect, useState } from "react";

export function useThemeVersion(): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const bump = () => setV((x) => (x + 1) % 10000);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqHandler = () => bump();
    try {
      mq.addEventListener('change', mqHandler);
    } catch {
      // @ts-ignore
      mq.addListener(mqHandler);
    }

    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class' || m.attributeName === 'data-theme') {
          bump();
          break;
        }
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    const customHandler = () => bump();
    window.addEventListener('theme-changed', customHandler as EventListener);

    return () => {
      observer.disconnect();
      try {
        mq.removeEventListener('change', mqHandler);
      } catch {
        // @ts-ignore
        mq.removeListener(mqHandler);
      }
      window.removeEventListener('theme-changed', customHandler as EventListener);
    };
  }, []);

  return v;
}
