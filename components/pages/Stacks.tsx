"use client";

import { useEffect, useRef } from "react";
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
    title: "Frontend Systems",
    caption: "Precision UI layers, built composably.",
    items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Vue", "Blade"],
    note: "Pinned after a late-night component audit.",
  },
  {
    title: "Backend Spine",
    caption: "API-first services with calm latency.",
    items: ["Node.js", "Express", "REST", "GraphQL", "Laravel", "CodeIgniter"],
    note: "Scribbled on a whiteboard between deploy windows.",
  },
  {
    title: "Infra & Ops",
    caption: "Deployment, telemetry, and ritual QA.",
    items: ["Vercel", "Docker", "CI/CD", "IIS", "Jest", "PHPUnit"],
    note: "Field note from the observability war-room.",
  },
];

export default function Stacks() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      
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

  return (
    <section id="stacks" className="relative py-16" ref={rootRef}>
      {/* Full-width container that breaks out of parent padding */}
      <div className="stacks-full-width relative min-h-[600px] px-6 sm:px-10 lg:px-20">
        {/* Vertical corner Logo Loops */}
        <div className="pointer-events-auto absolute inset-y-0 left-0 z-20 flex justify-center px-2 lg:px-20">
          <LogoLoop
            items={LAYER_ONE}
            direction="up"
            baseSpeed={28}
            orientation="vertical"
            className="hidden sm:flex h-full w-16 sm:w-20 lg:w-28 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl"
          />
        </div>
        <div className="pointer-events-auto absolute inset-y-0 right-0 z-20 flex justify-center px-2 lg:px-20">
          <LogoLoop
            items={LAYER_TWO}
            direction="down"
            baseSpeed={28}
            orientation="vertical"
            className="hidden sm:flex h-full w-16 sm:w-20 lg:w-28 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl"
          />
        </div>

        <div className="absolute inset-0 z-10" aria-hidden />

        {/* Main Content */}
        <div
          ref={contentRef}
          className="relative z-10 py-16 px-6 sm:px-12 lg:px-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-3">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/35">
                Studio stack roster
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Three signals. One signature voice.
              </h2>
              <p className="text-base text-foreground/60">
                Think of it as a private label kit—per project, I dial each layer up or down
                without ever losing the brand texture.
              </p>
            </div>

            <div className="mt-14 relative">
              <div className="absolute left-4 top-0 bottom-0 hidden sm:block">
                <div className="h-full w-px bg-foreground/10" />
              </div>
              <div className="flex flex-col gap-12">
                {STACKS.map((stack, index) => (
                  <div key={stack.title} className="group relative pl-0 sm:pl-16">
                    <div className="absolute left-4 top-0 hidden sm:flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-foreground/20 bg-background text-xs uppercase tracking-[0.35em] text-foreground/50">
                      0{index + 1}
                    </div>
                    <article className="stack-card rounded-[32px] border border-foreground/12 bg-background/75 p-6 sm:p-8 backdrop-blur-md transition-colors duration-500 hover:border-foreground/35">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.4em] text-foreground/45">
                          <span>{stack.title}</span>
                          <span>{stack.items.length} tracks</span>
                        </div>
                        <p className="text-sm text-foreground/60">{stack.caption}</p>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {stack.items.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-foreground/12 px-3 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-foreground/60 transition-colors duration-300 hover:border-foreground/40"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-[0.65rem] italic text-foreground/50">
                        {stack.note}
                      </p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
