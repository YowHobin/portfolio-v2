"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Reveal({ children, y = 20, delay = 0 }: { children: React.ReactNode; y?: number; delay?: number; }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y,
        duration: 0.6,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, [y, delay]);

  return <div ref={ref}>{children}</div>;
}
