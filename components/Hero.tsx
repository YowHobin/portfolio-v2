"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightRays from "./common/LightRays";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  type StartPos = { x: number; y: number; rotation: number };
  type SpanWithStart = HTMLSpanElement & { _startPos?: StartPos };
  type DivWithCleanup = HTMLDivElement & { _cleanupMouseMove?: () => void };

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark") ||
                    document.documentElement.getAttribute("data-theme") === "dark";
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"]
    });

    const handleStorageChange = () => checkTheme();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current || !nameRef.current) return;

  const el = rootRef.current as DivWithCleanup;
  const name = nameRef.current as HTMLHeadingElement;

    const nameText = name.textContent || "";

    name.textContent = "";

    const nameChars: SpanWithStart[] = [];
    const nameWords = nameText.trim().split(/\s+/);

    nameWords.forEach((word, wIndex) => {
      const wordWrapper = document.createElement("span");
      wordWrapper.style.display = "inline-block";
      wordWrapper.style.whiteSpace = "nowrap";
      if (wIndex < nameWords.length - 1) {
        wordWrapper.style.marginRight = "0.4em";
      }

      word.split("").forEach((char) => {
        const span = document.createElement("span") as SpanWithStart;
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.transformOrigin = "center center";

        const directions = [
          { x: -200, y: -100, rotation: 45 },
          { x: 200, y: -100, rotation: -45 },
          { x: -200, y: 100, rotation: -45 },
          { x: 200, y: 100, rotation: 45 },
          { x: 0, y: -150, rotation: 0 },
          { x: 0, y: 150, rotation: 0 },
          { x: -250, y: 0, rotation: 0 },
          { x: 250, y: 0, rotation: 0 },
          { x: -150, y: -150, rotation: 90 },
          { x: 150, y: -150, rotation: -90 },
          { x: -150, y: 150, rotation: -90 },
          { x: 150, y: 150, rotation: 90 },
        ];

        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        span._startPos = randomDir;

        wordWrapper.appendChild(span);
        nameChars.push(span);
      });

      name.appendChild(wordWrapper);
    });

    // removed title-related processing

    const createSequentialAnimation = (): Promise<void> => {
      return new Promise<void>((resolve) => {
      nameChars.forEach((char) => {
        const startPos = (char as SpanWithStart)._startPos as StartPos;
        gsap.set(char, {
          opacity: 0,
          x: startPos.x,
          y: startPos.y,
          rotation: startPos.rotation,
          scale: 0.5
        });
      });

      // no title chars to preset

      const animateNameSequentially = () => {
        let currentIndex = 0;

        const animateNext = () => {
          if (currentIndex >= nameChars.length) {
            resolve();
            return;
          }

          const char = nameChars[currentIndex] as SpanWithStart;

          gsap.to(char, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)",
            onComplete: () => {
              currentIndex++;
              animateNext();
            }
          });
        };

        animateNext();
      };

      animateNameSequentially();
      });
    };

    createSequentialAnimation().then(() => {
      const moveTarget = name;
      gsap.to(moveTarget, {
        scale: 1.02,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      name.style.perspective = "800px";

      const letterSpans = nameChars.filter((s) => (s.textContent || "").trim() !== "");
      letterSpans.forEach((s) => {
        s.style.backfaceVisibility = "hidden";
        s.style.willChange = "transform";
      });
      const activeTimelines: gsap.core.Timeline[] = [];
      const activeIndices = new Set<number>();
      const neutral = new Set([
        "o", "O", "0", "l", "i", "I", "H", "X", "x", "T", "V", "U", "W", "Y", "A", "M"
      ]);
      let lastPicked: number[] = [];

      const pickNextIndices = (count: number): number[] => {
        const indices = letterSpans.map((_, i) => i);
        const eligible = indices.filter((i) => {
          const ch = (letterSpans[i].textContent || "");
          if (!ch) return false;
          if (neutral.has(ch)) return false;
          if (activeIndices.has(i)) return false;
          return true;
        });

        let pool = eligible.length >= count ? eligible : indices.filter((i) => !activeIndices.has(i));
        const result: number[] = [];
        for (let n = 0; n < count && pool.length > 0; n++) {
          let pick = pool[Math.floor(Math.random() * pool.length)];
          let tries = 0;
          while (
            pool.length > 1 && (result.includes(pick) || lastPicked.includes(pick)) && tries < 10
          ) {
            pick = pool[Math.floor(Math.random() * pool.length)];
            tries++;
          }
          result.push(pick);
          pool = pool.filter((i) => i !== pick);
        }
        if (result.length === 0 && indices.length > 0) result.push(indices[0]);
        lastPicked = result.slice();
        return result;
      };

      const startPairCycle = (indices: number[]) => {
        if (indices.length === 0) return;
        const tls: gsap.core.Timeline[] = [];
        indices.forEach((idx) => {
          const elSpan = letterSpans[idx];
          activeIndices.add(idx);
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
          tl.to(elSpan, { rotateY: "+=720", duration: 0.8 })
            .to(elSpan, { scaleX: -1, duration: 0.2 })
            .to({}, { duration: 3 })
            .add("return")
            .to(elSpan, { rotateY: "+=360", duration: 0.6 })
            .to(elSpan, { scaleX: 1, duration: 0.6 }, "<")
            .call(() => { activeIndices.delete(idx); });
          tls.push(tl);
          activeTimelines.push(tl);
        });
        if (tls.length > 0) {
          tls[0].call(() => {
            const next = pickNextIndices(Math.min(2, letterSpans.length));
            startPairCycle(next);
          }, [], "return");
        }
      };

      const firstPair = pickNextIndices(Math.min(2, letterSpans.length));
      startPairCycle(firstPair);

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        gsap.to(moveTarget, {
          x: x * 20,
          y: y * 20,
          duration: 0.8,
          ease: "power2.out"
        });
      };

  el.addEventListener("mousemove", handleMouseMove);

      const cleanup = () => {
      el.removeEventListener("mousemove", handleMouseMove);
        activeTimelines.forEach((t) => t.kill());
      };

  el._cleanupMouseMove = cleanup;
    });

    const header = document.querySelector("header");
    if (header) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(header, {
                y: "-100%",
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut"
              });
            } else {
              gsap.to(header, {
                y: "0%",
                opacity: 1,
                duration: 0.6,
                ease: "power2.inOut"
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      heroObserver.observe(el);

      return () => {
        heroObserver.disconnect();
        if (el._cleanupMouseMove) {
          el._cleanupMouseMove();
        }
      };
    }
  }, []);

  return (
    <section id="home" className="relative overflow-hidden" ref={rootRef}>
      <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-0 transition-opacity duration-300" />
      {isDarkMode && (
        <div className="absolute inset-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.3}
            lightSpread={1.2}
            rayLength={1.5}
            pulsating={true}
            fadeDistance={0.8}
            saturation={0.8}
            followMouse={true}
            mouseInfluence={0.15}
            noiseAmount={0.1}
            distortion={0.05}
            className="opacity-100"
          />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full ">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh]">
          <div>
            <h1
              ref={nameRef}
              className="text-[6rem] md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tight text-foreground mb-4"
            >
              Lenard Roy Arellano
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
