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
    title: "Design",
    caption: "Visual systems that speak to users.",
    items: ["Figma", "Adobe XD", "Sketch", "Photoshop"],
    note: "Crafted with intention and iteration.",
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
  const headerRef = useRef<HTMLDivElement | null>(null);

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
        const headerElements = header.querySelectorAll('p, h2');
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
        <div
          ref={contentRef}
          className="relative z-10 py-16 px-6 sm:px-12 lg:px-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-3" ref={headerRef}>
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/35">
                Tools I actually enjoy using
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                The stack behind the work.
              </h2>
              <p className="text-base text-foreground/60">
                These are the languages, frameworks, and services I reach for most often—from first idea to
                production deploy. Different projects need different tools, but this stack feels like home.
              </p>
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
