"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

const STACKS = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "TailwindCSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "REST", "GraphQL"],
  },
  {
    title: "Infra & Tools",
    items: ["Vercel", "Docker", "CI/CD", "Testing"],
  },
];

export default function Stacks() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const stage = stageRef.current;
    const progressBar = progressRef.current;
    if (!root || !stage) return;

    const cards = Array.from(stage.querySelectorAll<HTMLDivElement>(".stack-card"));

    const ctx = gsap.context(() => {
      if (!cards.length) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      // Enhanced initial setup with entrance animations
      gsap.set(cards, { 
        opacity: 0, 
        yPercent: 10, 
        rotationX: 12,
        scale: 0.92
      });
      
      // Animate first card entrance
      gsap.to(cards[0], {
        opacity: 1,
        yPercent: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.5)",
        onComplete: () => cards[0].classList.add("is-active")
      });

      // Progress bar setup
      if (progressBar) {
        gsap.set(progressBar, { scaleX: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 15%",
          end: () => "+=" + Math.max(window.innerHeight * 0.85 * Math.max(cards.length - 1, 1), 500),
          pin: true,
          scrub: 1.1,
          snap: {
            snapTo: (value) => {
              const steps = cards.length - 1;
              if (steps <= 0) return 0;
              return Math.round(value * steps) / steps;
            },
            duration: { min: 0.15, max: 0.35 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            // Update progress bar
            if (progressBar) {
              gsap.to(progressBar, {
                scaleX: self.progress,
                duration: 0.3,
                ease: "power2.out"
              });
              progressBar.classList.toggle("active", self.progress > 0.05);
            }

            // Update dots indicators
            const dots = root?.querySelectorAll('.stack-dot');
            if (dots) {
              const currentIndex = Math.round(self.progress * (cards.length - 1));
              dots.forEach((dot, i) => {
                const element = dot as HTMLElement;
                element.style.backgroundColor = i === currentIndex ? "var(--accent)" : "var(--muted)";
              });
            }
          }
        },
        defaults: { ease: "power2.out" },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        
        // Enhanced exit animation
        tl.to(
          cards[i - 1],
          {
            opacity: 0,
            yPercent: -7,
            rotationX: -8,
            scale: 0.94,
            duration: 0.55,
            ease: "power2.in",
            onComplete: () => {
              cards[i - 1].classList.remove("is-active");
            },
          },
          "+=0.15"
        )
        // Enhanced entrance animation
        .to(
          card,
          {
            opacity: 1,
            yPercent: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.7,
            ease: "back.out(1.3)",
            onStart: () => {
              card.classList.add("is-active");
              
              // Animate card content
              const cardTitle = card.querySelector("h3");
              const cardItems = card.querySelectorAll("li");
              
              if (cardTitle) {
                gsap.fromTo(cardTitle, 
                  { opacity: 0, y: 15, rotationX: 10 },
                  { opacity: 1, y: 0, rotationX: 0, duration: 0.4, ease: "power2.out", delay: 0.2 }
                );
              }
              
              if (cardItems.length) {
                gsap.fromTo(cardItems, 
                  { opacity: 0, y: 12, rotationY: 8 },
                  { 
                    opacity: 1, 
                    y: 0, 
                    rotationY: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    ease: "power2.out",
                    delay: 0.3
                  }
                );
              }
            },
          },
          "-=0.25"
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stacks" className="relative" ref={rootRef}>
      <div className="scroll-progress" ref={progressRef}></div>
  <div className="mx-auto max-w-6xl px-4 py-16 w-full">
        <Reveal>
          <div>
            <h2 className="section-title">My stacks</h2>
            <p className="section-subtitle mt-2">Tools I use to build delightful experiences</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Scroll to discover</span>
              <div className="flex gap-1">
                {STACKS.map((_, i) => (
                  <div 
                    key={i} 
                    className="stack-dot w-2 h-2 rounded-full bg-muted transition-all duration-300"
                    style={{
                      backgroundColor: i === 0 ? "var(--accent)" : "var(--muted)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <div ref={stageRef} className="pin-stage mt-8 relative h-[65vh] sm:h-[70vh] md:h-[75vh]">
          {STACKS.map((c) => (
            <div key={c.title} className="slide absolute inset-0 flex items-center justify-center">
              <div
                id={c.title === "Frontend" ? "stacks-frontend" : c.title === "Backend" ? "stacks-backend" : "stacks-infra"}
                className="stack-card w-[min(100%,48rem)] sm:w-[min(85%,42rem)] lg:w-[min(66%,40rem)] xl:w-[min(50%,36rem)] max-w-full glass border border-black/10 dark:border-white/10 rounded-2xl p-6 transition-all duration-300 will-change-transform"
              >
                <h3 className="text-lg font-semibold transition-all duration-300">{c.title}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.items.map((i) => (
                    <li 
                      key={i} 
                      className="px-3 py-1 rounded-full text-sm border border-black/10 dark:border-white/10 bg-muted transition-all duration-300 hover:bg-accent/10 hover:border-accent/30 hover:scale-105"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
