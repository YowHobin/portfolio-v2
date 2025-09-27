"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  type StartPos = { x: number; y: number; rotation: number };
  type SpanWithStart = HTMLSpanElement & { _startPos?: StartPos };
  type DivWithCleanup = HTMLDivElement & { _cleanupMouseMove?: () => void };


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

    // Add scroll-triggered fade animation
    ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      animation: gsap.fromTo(name, { opacity: 1 }, { opacity: 0 }),
      scrub: true,
    });

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

  const header = document.querySelector("header") as HTMLElement | null;
  let disconnectObserver: (() => void) | null = null;
  if (header) {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    if (document.documentElement.classList.contains("at-hero")) {
      document.documentElement.classList.remove("at-hero");
    }
    gsap.set(header, { y: inView ? "-100%" : "0%", opacity: inView ? 0 : 1 });
    if (inView) header.classList.add("header-hidden"); else header.classList.remove("header-hidden");

    let hidden = inView;
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hidden) {
            hidden = true;
            gsap.to(header, {
              y: "-100%",
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut"
            });
            header.classList.add("header-hidden");
          } else if (!entry.isIntersecting && hidden) {
            hidden = false;
            gsap.to(header, {
              y: "0%",
              opacity: 1,
              duration: 0.6,
              ease: "power2.inOut"
            });
            header.classList.remove("header-hidden");
          }
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(el);
    disconnectObserver = () => heroObserver.disconnect();
  }

  return () => {
    if (disconnectObserver) disconnectObserver();
    if (el._cleanupMouseMove) el._cleanupMouseMove();
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
  }, []);

  return (
    <section id="home" className="relative overflow-hidden" ref={rootRef}>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 dark:opacity-30 transition-opacity duration-300" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 60rem at 50% -10%, color-mix(in oklch, var(--brand-primary) 18%, transparent), transparent 60%), " +
            "radial-gradient(40rem 40rem at 80% 20%, color-mix(in oklch, var(--brand-secondary) 14%, transparent), transparent 70%), " +
            "radial-gradient(50rem 50rem at 20% 80%, color-mix(in oklch, var(--brand-tertiary) 10%, transparent), transparent 70%)",
          maskImage: "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
        aria-hidden
      />

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
