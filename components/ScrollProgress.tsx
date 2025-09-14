"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const el = barRef.current;
    const ctx = gsap.context(() => {
      gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.to(el, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          scrub: 0.2,
          start: 0,
          end: "max",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="h-0.5 bg-accent" ref={barRef} />
    </div>
  );
}
