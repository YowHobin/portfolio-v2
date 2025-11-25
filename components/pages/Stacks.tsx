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
  { name: "MS SQL Server" },
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
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const [isRevealed, setIsRevealed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setIsRevealed(true);
        return;
      }

      // Horizontal reveal animation based on scroll direction
      ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          setScrollDirection("down");
          setIsRevealed(true);
        },
        onLeave: () => {
          setIsRevealed(false);
        },
        onEnterBack: () => {
          setScrollDirection("up");
          setIsRevealed(true);
        },
        onLeaveBack: () => {
          setIsRevealed(false);
        },
      });

      // Track scroll direction
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY.current = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stacks" className="relative py-16" ref={rootRef}>
      {/* Full-width container that breaks out of parent padding */}
      <div className="stacks-full-width">
        {/* Top Logo Loops */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10">
          <LogoLoop items={LAYER_ONE} direction="left" baseSpeed={60} />
        </div>
        <div className="border-b border-black/10 dark:border-white/10">
          <LogoLoop items={LAYER_TWO} direction="right" baseSpeed={55} />
        </div>

        {/* Main Content with horizontal reveal */}
        <div
          ref={contentRef}
          className={`py-16 px-4 transition-all duration-700 ease-out ${
            isRevealed
              ? "opacity-100"
              : "opacity-0"
          }`}
          style={{
            clipPath: isRevealed
              ? "inset(0 0 0 0)"
              : scrollDirection === "down"
              ? "inset(0 100% 0 0)"
              : "inset(0 0 0 100%)",
            transition: "clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
          }}
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
              {STACKS.map((stack, index) => (
                <div
                  key={stack.title}
                  className="stack-card glass border border-black/10 dark:border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
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

        {/* Bottom Logo Loops */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10">
          <LogoLoop items={LAYER_TWO} direction="left" baseSpeed={55} />
        </div>
        <div className="border-b border-black/10 dark:border-white/10">
          <LogoLoop items={LAYER_ONE} direction="right" baseSpeed={60} />
        </div>
      </div>
    </section>
  );
}
