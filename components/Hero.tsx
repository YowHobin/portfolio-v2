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

    const el = rootRef.current;
    const name = nameRef.current;
    const title = titleRef.current;

    const nameText = name.textContent || "";
    const titleText = title.textContent || "";

    name.textContent = "";
    title.textContent = "";

    const nameChars = nameText.split("").map((char, i) => {
      const span = document.createElement("span");
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

      (span as any)._startPos = randomDir;

      name.appendChild(span);
      return span;
    });

    const titleWords = titleText.split(" ");
    const allTitleChars: HTMLElement[] = [];

    titleWords.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.marginRight = "0.5em";

      const chars = word.split("").map((char, i) => {
        const span = document.createElement("span");
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
        (span as any)._startPos = randomDir;

        wordSpan.appendChild(span);
        return span;
      });

      title.appendChild(wordSpan);
      allTitleChars.push(...chars);

      if (wordIndex < titleWords.length - 1) {
        title.appendChild(document.createTextNode(" "));
      }
    });

    const createSequentialAnimation = () => {
      nameChars.forEach((char, i) => {
        const startPos = (char as any)._startPos;
        gsap.set(char, {
          opacity: 0,
          x: startPos.x,
          y: startPos.y,
          rotation: startPos.rotation,
          scale: 0.5
        });
      });

      allTitleChars.forEach((char, i) => {
        const startPos = (char as any)._startPos;
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

          const char = nameChars[currentIndex];
          const startPos = (char as any)._startPos;

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
            return;
          }

          const char = allTitleChars[currentIndex];
          const startPos = (char as any)._startPos;

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
              }
            }
          });
        };

        animateNext();
      };

      animateNameSequentially();
    };

    createSequentialAnimation();

    setTimeout(() => {
      gsap.to(title, {
        scale: 1.02,
        duration: 4,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(nameChars, {
        rotationY: 5,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: {
          amount: 0.5,
          from: "random"
        }
      });

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
      };

      (el as any)._cleanupMouseMove = cleanup;
    }, 1500);

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
        if ((el as any)._cleanupMouseMove) {
          (el as any)._cleanupMouseMove();
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
