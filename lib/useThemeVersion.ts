"use client";

import { useEffect, useState } from "react";

export function useThemeVersion(): number {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const bump = () => setV((x) => (x + 1) % 10000);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqHandler = () => bump();
    if ('addEventListener' in mq) {
      mq.addEventListener('change', mqHandler as EventListener);
    } else {
      // Safari fallback
      // @ts-expect-error legacy API
      mq.addListener(mqHandler);
    }

    const customHandler = () => bump();
    window.addEventListener('theme-changed', customHandler as EventListener);

    return () => {
      if ('removeEventListener' in mq) {
        mq.removeEventListener('change', mqHandler as EventListener);
      } else {
        // Safari fallback
        // @ts-expect-error legacy API
        mq.removeListener(mqHandler);
      }
      window.removeEventListener('theme-changed', customHandler as EventListener);
    };
  }, []);

  return v;
}
