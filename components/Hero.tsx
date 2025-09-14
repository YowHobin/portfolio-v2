"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
import DevTerminal from "./DevTerminal";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const heading = el.querySelector("h1");
    const paragraph = el.querySelector("p[data-hero-sub]");
    const ctas = el.querySelectorAll("a[data-cta]");
    const right = el.querySelector("div[data-terminal]");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(heading, { y: 24, opacity: 0, duration: 0.6 })
      .from(paragraph, { y: 18, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(ctas, { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.2")
      .from(right, { y: 26, opacity: 0, duration: 0.6 }, "-=0.2");

    const aurora = el.querySelector(".aurora");
    if (aurora) {
      gsap.to(aurora, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-28" ref={rootRef}>
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg opacity-20" />
  <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Full‑Stack Developer
              <span className="text-accent"> & Problem Solver</span>
            </h1>
            <p data-hero-sub className="mt-4 text-base md:text-lg text-muted-foreground max-w-prose">
              I build high‑impact web apps with clean architecture, modern UX, and production‑grade performance. I love turning complex ideas into delightful experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a data-cta href="#projects" className="px-5 py-2.5 rounded-full bg-accent text-accent-foreground font-medium border border-transparent hover:opacity-90">
                View Projects
              </a>
              <a data-cta href="#contact" className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 hover-bg-muted">
                Contact Me
              </a>
            </div>
          </div>
          <div className="relative min-w-0 w-full max-w-full" data-terminal>
            <DevTerminal />
          </div>
        </div>
      </div>
    </section>
  );
}
