"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoLoop from "../ui/LogoLoop";

// First layer - Languages & Databases
const LAYER_ONE = [
  { name: "PHP" },
  { name: "JS" },
  { name: "TS" },
  { name: "Python" },
  { name: "MS SQL" },
  { name: "MongoDB" },
  { name: "MySQL" },
  { name: "Tailwind" },
];

// Second layer - Frameworks & Tools
const LAYER_TWO = [
  { name: "Laravel" },
  { name: "Next" },
  { name: "React" },
  { name: "Vue" },
  { name: "IIS" },
  { name: "Figma" },
  { name: "Git" },
  { name: "Azure DevOps" },
];

const STACKS = [
  {
    title: "Frontend Atelier",
    caption: "Clean UI systems for fast, confident shipping.",
    tone: "Lightweight, responsive, and detail-forward.",
    accent: "from-primary/20 via-transparent to-transparent",
    chipAccent: "hover:border-primary/40",
    items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Vue", "Blade"],
    note: "Built for speed, clarity, and a polished feel.",
  },
  {
    title: "Backend House",
    caption: "Reliable APIs and services that scale with the product.",
    tone: "Structured flows, stable contracts, calm latency.",
    accent: "from-secondary/20 via-transparent to-transparent",
    chipAccent: "hover:border-secondary/40",
    items: ["Node.js", "Express", "REST", "GraphQL", "Laravel", "CodeIgniter"],
    note: "Optimized for maintainability and smooth deployments.",
  },
  {
    title: "Design Studio",
    caption: "Design systems that look premium and feel intentional.",
    tone: "Typography, rhythm, and consistent visual language.",
    accent: "from-[color-mix(in_oklch,var(--brand-tertiary)_22%,transparent)] via-transparent to-transparent",
    chipAccent: "hover:border-foreground/35",
    items: ["Figma", "Adobe XD", "Sketch", "Photoshop"],
    note: "Where structure meets taste.",
  },
  {
    title: "Ops Backstage",
    caption: "Release-ready setups with monitoring and repeatable processes.",
    tone: "Observability, releases, and repeatable rituals.",
    accent: "from-foreground/15 via-transparent to-transparent",
    chipAccent: "hover:border-foreground/35",
    items: ["Vercel", "Docker", "CI/CD", "IIS", "Jest", "PHPUnit"],
    note: "Less drama in production.",
  },
];

export default function Stacks() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      const header = headerRef.current;
      
      // Header animation setup
      if (header) {
        const headerElements = header.querySelectorAll('p, h2, h3, button');
        gsap.set(headerElements, { opacity: 0, y: 40, filter: "blur(8px)" });
        
        ScrollTrigger.create({
          trigger: header,
          start: "top 80%",
          onEnter: () => {
            gsap.to(headerElements, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              stagger: 0.2,
              duration: 0.8,
              ease: "power3.out"
            });
          },
          onLeaveBack: () => {
            gsap.to(headerElements, {
              opacity: 0,
              y: 40,
              filter: "blur(8px)",
              stagger: -0.1,
              duration: 0.5,
              ease: "power2.in"
            });
          }
        });
      }
      
      // Ensure initial state is hidden
      gsap.set(cards, { opacity: 0, y: 80, rotateX: -6, filter: "blur(12px)" });

      ScrollTrigger.batch(cards, {
        start: "top 55%",
        end: "bottom 20%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            stagger: 0.3,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeave: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: -40,
            rotateX: 4,
            filter: "blur(6px)",
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.in",
            overwrite: true,
          });
        },
        onEnterBack: (batch) => {
          gsap.set(batch, { y: -60, opacity: 0, rotateX: 6, filter: "blur(10px)" });
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            stagger: -0.3,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: 40,
            rotateX: -4,
            filter: "blur(6px)",
            duration: 0.5,
            stagger: -0.15,
            ease: "power2.in",
            overwrite: true,
          });
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".stack-card"));
    if (cards.length === 0) return;

    const isMatch = (card: HTMLElement) => {
      if (!activeLabel) return true;
      const chips = card.querySelectorAll<HTMLElement>("[data-stack-chip]");
      return Array.from(chips).some((chip) => chip.dataset.stackChip === activeLabel);
    };

    gsap.to(cards, {
      opacity: (i, el) => (isMatch(el as HTMLElement) ? 1 : 0.38),
      scale: (i, el) => (isMatch(el as HTMLElement) ? 1 : 0.985),
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
    });
  }, [activeLabel]);

  return (
    <section id="stacks" className="relative py-16" ref={rootRef}>
      {/* Full-width container that breaks out of parent padding */}
      <div className="stacks-full-width relative min-h-[600px] px-6 sm:px-10 lg:px-20">
        {/* Vertical corner Logo Loops */}
        <div className="pointer-events-auto absolute inset-y-0 left-0 z-20 flex justify-center px-3 lg:px-24">
          <LogoLoop
            items={LAYER_ONE}
            direction="up"
            baseSpeed={28}
            orientation="vertical"
            className="hidden sm:flex h-full w-20 sm:w-24 lg:w-32 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl"
          />
        </div>
        <div className="pointer-events-auto absolute inset-y-0 right-0 z-20 flex justify-center px-3 lg:px-24">
          <LogoLoop
            items={LAYER_TWO}
            direction="down"
            baseSpeed={28}
            orientation="vertical"
            className="hidden sm:flex h-full w-20 sm:w-24 lg:w-32 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl"
          />
        </div>

        <div className="absolute inset-0 z-10" aria-hidden />

        {/* Main Content */}
        <div ref={contentRef} className="relative z-10 py-16 px-6 sm:px-12 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-7 lg:items-end" ref={headerRef}>
              <div className="lg:col-span-7">
                <p className="text-[0.65rem] uppercase tracking-[0.55em] text-foreground/35">
                  Atelier Index
                </p>
                <h2 className="mt-3 text-5xl sm:text-6xl lg:text-9xl font-semibold tracking-tight leading-[0.95]">
                  Tech, but styled like a label.
                </h2>
                <p className="mt-4 text-base sm:text-lg text-foreground/60 max-w-2xl">
                  A curated rack of tools I rotate through—selected for feel, fit, and long-term wear.
                  Click any tool chip below to spotlight where it shows up.
                </p>
              </div>


            </div>

            <div className="mt-14 relative">
              <div className="absolute left-4 top-0 bottom-0 hidden sm:block">
                <div className="h-full w-px bg-foreground/10" />
              </div>

              <div className="flex flex-col gap-12">
                {STACKS.map((stack, index) => (
                  <div key={stack.title} className="group relative pl-0 sm:pl-16">
                    <div className="absolute left-4 top-0 hidden sm:flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-foreground/20 bg-background text-xs font-mono tracking-[0.15em] text-foreground/50">
                      0{index + 1}
                    </div>

                    <article className="stack-card relative overflow-hidden rounded-[34px] border border-foreground/12 bg-background/70 p-6 sm:p-8 backdrop-blur-md transition-all duration-500 hover:border-foreground/35 hover:-translate-y-1">
                      <div
                        className={
                          "pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500 " +
                          "bg-gradient-to-br " +
                          stack.accent
                        }
                        aria-hidden
                      />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_20%_10%,rgba(var(--brand-primary-rgb),0.10),transparent_55%),radial-gradient(circle_700px_at_90%_70%,rgba(var(--brand-secondary-rgb),0.10),transparent_55%)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:140px_140px] opacity-[0.18]" />
                      </div>

                      <div className="relative">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[0.65rem] uppercase tracking-[0.45em] text-foreground/45">
                                {stack.title}
                              </span>
                            </div>
                            <span className="text-[0.65rem] uppercase tracking-[0.4em] text-foreground/45">
                              {stack.items.length} pieces
                            </span>
                          </div>
                          <p className="text-sm text-foreground/60 max-w-2xl">{stack.caption}</p>
                          <p className="text-[0.8rem] text-foreground/55 max-w-2xl">
                            {stack.tone}
                          </p>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {stack.items.map((item) => {
                            const isSelected = activeLabel === item;
                            return (
                              <button
                                key={item}
                                type="button"
                                data-stack-chip={item}
                                onClick={() => setActiveLabel((prev) => (prev === item ? null : item))}
                                className={
                                  "rounded-2xl border px-3 py-2 text-[0.65rem] uppercase tracking-[0.35em] transition-all duration-300 text-left " +
                                  (isSelected
                                    ? "border-foreground/45 bg-foreground/5 text-foreground"
                                    : "border-foreground/12 text-foreground/60 hover:text-foreground " + stack.chipAccent)
                                }
                                aria-pressed={isSelected}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                          <p className="text-[0.65rem] italic text-foreground/50">{stack.note}</p>
                          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-foreground/40">
                            {activeLabel ? "Spotlight" : "Open"}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              <div className="mt-16 rounded-[34px] border border-foreground/12 bg-background/50 backdrop-blur-md p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.55em] text-foreground/35">
                      Styling Note
                    </p>
                    <p className="mt-2 text-sm text-foreground/60 max-w-2xl">
                      I treat a stack like a wardrobe: fewer loud pieces, more reliable staples, and one detail that makes it feel like mine.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-foreground/35" />
                    <div className="h-1.5 w-8 rounded-full bg-foreground/15" />
                    <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
