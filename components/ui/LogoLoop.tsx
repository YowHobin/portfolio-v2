"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LogoItem {
  name: string;
}

type LoopDirection = "left" | "right" | "up" | "down";

interface LogoLoopProps {
  items: LogoItem[];
  direction?: LoopDirection;
  baseSpeed?: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const LOOP_OFFSET = 33.3333;

// Tech icons component using devicon CDN
const TechIcon = ({ name }: { name: string }) => {
  const iconMap: Record<string, string> = {
    PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    JS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    TS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "MS SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    MySQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    Tailwind: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    Laravel: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    Next: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    Vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    IIS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
    Figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    "Azure DevOps": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  };

  const iconUrl = iconMap[name];
  
  return iconUrl ? (
    <Image
      src={iconUrl}
      alt={name}
      width={40}
      height={40}
      className="w-8 h-8 md:w-10 md:h-10 grayscale group-hover:grayscale-0 transition-all duration-300"
      loading="lazy"
    />
  ) : (
    <span className="text-lg font-bold">{name.slice(0, 2)}</span>
  );
};

export default function LogoLoop({
  items,
  direction = "left",
  baseSpeed = 50,
  className = "",
  orientation = "horizontal",
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVertical = orientation === "vertical";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const forwardDirections = isVertical
        ? direction === "up"
        : direction === "left";
      const axisProp = isVertical ? "yPercent" : "xPercent";
      const start = forwardDirections ? 0 : -LOOP_OFFSET;
      const delta = forwardDirections ? `-=${LOOP_OFFSET}` : `+=${LOOP_OFFSET}`;

      gsap.set(track, { [axisProp]: start });

      tweenRef.current = gsap.to(track, {
        duration: baseSpeed,
        ease: "none",
        repeat: -1,
        [axisProp]: delta,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, baseSpeed, isVertical]);

  useEffect(() => {
    const handleScroll = () => {
      if (!tweenRef.current) return;

      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      const newTimeScale = 1 + delta * 0.05; // Sensitivity factor

      // Smoothly accelerate
      gsap.to(tweenRef.current, {
        timeScale: newTimeScale,
        duration: 0.5,
        overwrite: true,
      });

      lastScrollY.current = currentScrollY;

      // Clear existing timeout to prevent early deceleration
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Decelerate back to normal speed when scrolling stops
      timeoutRef.current = setTimeout(() => {
        if (tweenRef.current) {
          gsap.to(tweenRef.current, {
            timeScale: 1,
            duration: 0.5,
            overwrite: true,
          });
        }
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Duplicate items for seamless loop
  const duplicatedItems = Array.from({ length: 6 }, () => items).flat();

  const containerClasses = isVertical
    ? "h-full overflow-visible"
    : "pb-10 overflow-hidden";

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container ${containerClasses} ${className}`.trim()}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div
        ref={trackRef}
        className={`logo-loop-track flex gap-6 md:gap-8 ${
          isVertical ? "flex-col items-center" : "flex-row items-center"
        } ${isVertical ? "min-h-[350%]" : ""}`.trim()}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="logo-item group relative flex-shrink-0 cursor-pointer"
          >
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-lg transition-all duration-300 hover:scale-110">
              <TechIcon name={item.name} />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 max-w-[7rem] px-2 text-[0.7rem] leading-tight text-center font-medium text-foreground/80 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
