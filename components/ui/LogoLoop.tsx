"use client";

import { useEffect, useRef, useState } from "react";

interface LogoItem {
  name: string;
}

interface LogoLoopProps {
  items: LogoItem[];
  direction?: "left" | "right";
  baseSpeed?: number;
  className?: string;
}

// Tech icons component using devicon CDN
const TechIcon = ({ name }: { name: string }) => {
  const iconMap: Record<string, string> = {
    PHP: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg",
    JS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    TS: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "MS SQL Server": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
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
    <img 
      src={iconUrl} 
      alt={name} 
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
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lastScrollY = useRef(0);

  // Handle scroll speed changes
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = Math.abs(currentScrollY - lastScrollY.current);
          const newSpeed = Math.min(Math.max(1 + delta * 0.005, 1), 1.5);
          setScrollSpeed(newSpeed);
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Decay scroll speed back to 1
  useEffect(() => {
    const decay = setInterval(() => {
      setScrollSpeed((prev) => {
        if (prev > 1.05) return prev * 0.95;
        return 1;
      });
    }, 50);
    return () => clearInterval(decay);
  }, []);

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  const animationDuration = baseSpeed / scrollSpeed;

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container overflow-hidden pb-10 ${className}`}
    >
      <div
        className="logo-loop-track flex items-center gap-6 md:gap-8"
        style={{
          animationName: `marquee-${direction}`,
          animationDuration: `${animationDuration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="logo-item group relative flex-shrink-0 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-lg transition-all duration-300 hover:scale-110">
              <TechIcon name={item.name} />
            </div>
            <div
              className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-foreground/80 transition-all duration-300 ${
                hoveredIndex === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
