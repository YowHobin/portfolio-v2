"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightRays from "./common/LightRays";
import ScrambledText from "./common/ScrambledText";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
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
    if (!rootRef.current || !nameRef.current || !titleRef.current) return;

  const el = rootRef.current as DivWithCleanup;
  const name = nameRef.current as HTMLHeadingElement;
  const title = titleRef.current as HTMLParagraphElement;

    const nameText = name.textContent || "";
    const titleText = title.textContent || "";

    name.textContent = "";
    title.textContent = "";

    const nameChars = nameText.split("").map((char) => {
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

      name.appendChild(span);
      return span;
    });

  const titleWords = titleText.split(" ");
    const allTitleChars: HTMLElement[] = [];

    titleWords.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.marginRight = "0.5em";

      const chars = word.split("").map((char) => {
        const span = document.createElement("span") as SpanWithStart;
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.transformOrigin = "center center";

        const directions = [
          { x: -100, y: -50, rotation: 30 },
          { x: 100, y: -50, rotation: -30 },
          { x: -100, y: 50, rotation: -30 },
          { x: 100, y: 50, rotation: 30 },
          { x: 0, y: -80, rotation: 0 },
          { x: 0, y: 80, rotation: 0 },
          { x: -120, y: 0, rotation: 0 },
          { x: 120, y: 0, rotation: 0 },
        ];

        const randomDir = directions[Math.floor(Math.random() * directions.length)];
  span._startPos = randomDir;

        wordSpan.appendChild(span);
        return span;
      });

      title.appendChild(wordSpan);
      allTitleChars.push(...chars);

      if (wordIndex < titleWords.length - 1) {
        title.appendChild(document.createTextNode(" "));
      }
    });

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

      allTitleChars.forEach((char) => {
        const startPos = (char as SpanWithStart)._startPos as StartPos;
        gsap.set(char, {
          opacity: 0,
          x: startPos.x,
          y: startPos.y,
          rotation: startPos.rotation,
          scale: 0.3
        });
      });

      const animateNameSequentially = () => {
        let currentIndex = 0;

        const animateNext = () => {
          if (currentIndex >= nameChars.length) {
            animateTitleSequentially();
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

      const animateTitleSequentially = () => {
        let currentIndex = 0;

        const animateNext = () => {
          if (currentIndex >= allTitleChars.length) {
            resolve();
            return;
          }

          const char = allTitleChars[currentIndex] as SpanWithStart;

          gsap.to(char, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.3,
            ease: "power3.out",
            delay: currentIndex * 0.02,
            onComplete: () => {
              currentIndex++;
              if (currentIndex < allTitleChars.length) {
                animateNext();
              } else {
                resolve();
              }
            }
          });
        };

        animateNext();
      };

      animateNameSequentially();
      });
    };

    createSequentialAnimation().then(() => {
      gsap.to(title, {
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
      let lastIndex = -1;

      const pickNextIndex = (): number => {
        if (letterSpans.length === 0) return -1;
        const neutral = new Set([
          "o", "O", "0", "l", "i", "I", "H", "X", "x", "T", "V", "U", "W", "Y", "A", "M"
        ]);
        const eligible: number[] = [];
        for (let i = 0; i < letterSpans.length; i++) {
          const ch = (letterSpans[i].textContent || "");
          if (ch && !neutral.has(ch)) eligible.push(i);
        }
        const pool = eligible.length > 0 ? eligible : [...letterSpans.keys()];
        let idx = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1) {
          while (idx === lastIndex) {
            idx = pool[Math.floor(Math.random() * pool.length)];
          }
        }
        lastIndex = idx;
        return idx;
      };

      const startLetterCycle = (idx: number) => {
        if (idx < 0) return;
        const elSpan = letterSpans[idx];

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        });

        tl.to(elSpan, { rotateY: "+=720", duration: 0.8 })
          .to(elSpan, { scaleX: -1, duration: 0.2 })
          .to({}, { duration: 3 })
          .add("return")
          .to(elSpan, { rotateY: "+=360", duration: 0.6 })
          .to(elSpan, { scaleX: 1, duration: 0.6 }, "<");

        tl.call(() => {
          const nextIdx = pickNextIndex();
          startLetterCycle(nextIdx);
        }, [], "return");

        activeTimelines.push(tl);
      };

      const firstIdx = pickNextIndex();
      startLetterCycle(firstIdx);

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

        gsap.to(title, {
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
            raysColor="#8b5cf6"
            raysSpeed={0.5}
            lightSpread={1.2}
            rayLength={1.5}
            pulsating={true}
            fadeDistance={0.8}
            saturation={0.8}
            followMouse={true}
            mouseInfluence={0.15}
            noiseAmount={0.1}
            distortion={0.05}
            className="opacity-60"
          />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24 w-full ">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh]">
          <div>
            <h1
              ref={nameRef}
              className="text-6xl md:text-8xl lg:text-[13rem] font-bold tracking-tight text-foreground mb-4"
            >
              <ScrambledText
                className="scrambled-text-demo"
                radius={100}
                duration={1.2}
                speed={0.5}
                
              >Lenard Roy Arellano
              </ScrambledText>
            </h1>
            <p
              ref={titleRef}
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light"
            >
              
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
