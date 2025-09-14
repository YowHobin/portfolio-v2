"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
};

const PROJECTS: Project[] = [
  {
    title: "Realtime Dashboard",
    description: "High‑throughput analytics dashboard with live updates and role‑based access.",
    tags: ["Next.js", "WebSockets", "Postgres"],
    href: "#",
  },
  {
    title: "E‑commerce Platform",
    description: "Headless storefront with server‑side rendering and optimized checkout flow.",
    tags: ["React", "Stripe", "Prisma"],
    href: "#",
  },
  {
    title: "Design System",
    description: "Composable components with accessibility baked in and comprehensive docs.",
    tags: ["TypeScript", "Radix", "Storybook"],
    href: "#",
  },
];

export default function Projects() {
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

    const cards = Array.from(stage.querySelectorAll<HTMLAnchorElement>(".project-card"));

    const handlers: Array<{
      el: HTMLElement;
      enter: () => void;
      leave: () => void;
      move: (e: MouseEvent) => void;
    }> = [];

    cards.forEach((el) => {
      const enter = () => {
        if (!el.classList.contains("is-active")) return;
        gsap.to(el, { 
          duration: 0.3, 
          scale: 1.05, 
          rotationY: 2,
          rotationX: 1,
          ease: "power2.out"
        });
      };
      const leave = () => {
        gsap.to(el, { 
          duration: 0.4, 
          rotateX: 0, 
          rotateY: 0, 
          scale: el.classList.contains("is-active") ? 1.02 : 1, 
          transformPerspective: 1000,
          ease: "power2.out"
        });
      };
      const move = (e: MouseEvent) => {
        if (!el.classList.contains("is-active")) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(el, { 
          duration: 0.3, 
          rotateY: dx * 8, 
          rotateX: -dy * 4, 
          transformPerspective: 1000,
          ease: "power2.out"
        });
      };

      el.addEventListener("mouseenter", enter);
  el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      handlers.push({ el, enter, leave, move });
    });

    const ctx = gsap.context(() => {
      if (!cards.length) return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;
      cards[0].classList.add("is-active");

      if (progressBar) {
        gsap.set(progressBar, { scaleX: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 15%",
          end: () => "+=" + Math.max(window.innerHeight * 1.2 * Math.max(cards.length - 1, 1), 600),
          pin: true,
          scrub: 1.5,
          snap: {
            snapTo: (value) => {
              const steps = cards.length - 1;
              if (steps <= 0) return 0;
              return Math.round(value * steps) / steps;
            },
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            if (progressBar) {
              gsap.to(progressBar, {
                scaleX: self.progress,
                duration: 0.3,
                ease: "power2.out"
              });
              progressBar.classList.toggle("active", self.progress > 0.05);
            }

            const dots = root?.querySelectorAll('.progress-dot');
            if (dots) {
              const currentIndex = Math.round(self.progress * (cards.length - 1));
              dots.forEach((dot, i) => {
                const element = dot as HTMLElement;
                element.style.backgroundColor = i === currentIndex ? "var(--accent)" : "var(--muted)";
              });
            }

            // Maintain active states during scroll
            const currentIndex = Math.round(self.progress * (cards.length - 1));
            cards.forEach((card, i) => {
              if (i === currentIndex) {
                if (!card.classList.contains("is-active")) {
                  card.classList.add("is-active");
                }
              } else {
                if (card.classList.contains("is-active") && 
                    Math.abs(i - currentIndex) > 0.5) {
                  card.classList.remove("is-active");
                }
              }
            });
          }
        },
        defaults: { ease: "power2.inOut" },
      });

      // Create scaling animation for each card transition
      cards.forEach((card, i) => {
        if (i === 0) return;
        
        // Phase 1: Previous card scales down and fades out
        tl.to(
          cards[i - 1],
          {
            opacity: 0,
            scale: 0.8,
            yPercent: -20,
            duration: 1,
            ease: "power2.in",
            onStart: () => {
              // Keep active class during transition to maintain border
            },
            onComplete: () => {
              gsap.set(cards[i - 1], { css: { pointerEvents: "none" } });
              cards[i - 1].classList.remove("is-active");
            },
          },
          "+=0.1"
        )
        // Phase 2: Current card appears large and scales down to normal
        .fromTo(
          card,
          {
            opacity: 0,
            scale: 2.5,
            yPercent: 30,
            rotation: 3,
          },
          {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            rotation: 0,
            duration: 1.5,
            ease: "power2.out",
            onStart: () => {
              gsap.set(card, { css: { pointerEvents: "auto" } });
              card.classList.add("is-active");
            },
            onUpdate: function() {
              // Ensure active class stays during animation
              if (!card.classList.contains("is-active")) {
                card.classList.add("is-active");
              }
            }
          },
          "-=0.5"
        );
      });
    }, root);

    return () => {
      ctx.revert();
      handlers.forEach(({ el, enter, leave, move }) => {
        el.removeEventListener("mouseenter", enter);
  el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section id="projects" className="relative" ref={rootRef}>
      <div className="scroll-progress" ref={progressRef}></div>
  <div className="mx-auto max-w-6xl px-4 py-16 w-full">
        <Reveal>
          <div>
            <h2 className="section-title">My projects</h2>
            <p className="section-subtitle mt-2">Selected work I&apos;m proud of</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Scroll to explore</span>
              <div className="flex gap-1">
                {PROJECTS.map((_, i) => (
                  <div 
                    key={i} 
                    className="progress-dot w-2 h-2 rounded-full bg-muted transition-all duration-300"
                    style={{
                      backgroundColor: i === 0 ? "var(--accent)" : "var(--muted)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <div ref={stageRef} className="pin-stage mt-8 relative h-[90vh] sm:h-[95vh] md:h-screen">
          {PROJECTS.map((p) => (
            <div key={p.title} className="slide absolute inset-0 flex items-center justify-center">
              <a
                href={p.href}
                className="project-card block w-[min(100%,48rem)] sm:w-[min(85%,42rem)] lg:w-[min(66%,40rem)] xl:w-[min(50%,36rem)] max-w-full glass border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:shadow-lg transition-shadow will-change-transform"
              >
                <div className="aspect-[16/9] rounded-xl bg-muted/70 border border-black/10 dark:border-white/10 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 project-overlay" />
                </div>
                <h3 className="card-title mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs border border-black/10 dark:border-white/10 bg-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}