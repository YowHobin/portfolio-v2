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
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      
      // Ensure initial state is hidden
      gsap.set(cards, { opacity: 0, y: 50 });

      ScrollTrigger.batch(cards, {
        start: "top 55%",
        end: "bottom 20%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.3,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeave: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            stagger: 0.15,
            ease: "power2.in",
            overwrite: true,
          });
        },
        onEnterBack: (batch) => {
          gsap.set(batch, { y: -50, opacity: 0 });
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: -0.3,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: 30,
            duration: 0.4,
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
        <div className="pointer-events-auto absolute inset-y-0 left-0 z-20 flex justify-center px-2 sm:px-20">
          <LogoLoop
            items={LAYER_ONE}
            direction="up"
            baseSpeed={28}
            orientation="vertical"
            className="hidden sm:flex h-full w-16 sm:w-20 lg:w-28 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-xl"
          />
        </div>
        <div className="pointer-events-auto absolute inset-y-0 right-0 z-20 flex justify-center px-2 sm:px-20">
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
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="section-title">My Stacks</h2>
              <p className="section-subtitle mt-2">
                Tools I use to build delightful experiences
              </p>
            </div>

            {/* Stack Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STACKS.map((stack) => (
                <div
                  key={stack.title}
                  className="stack-card glass border border-black/10 dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg opacity-0"
                >
                  <h3 className="text-lg font-semibold mb-4">{stack.title}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {stack.items.map((item) => (
                      <li
                        key={item}
                        className="px-3 py-1 rounded-full text-sm border border-black/10 dark:border-white/10 bg-muted transition-all duration-300 hover:bg-accent/10 hover:border-accent/30"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
