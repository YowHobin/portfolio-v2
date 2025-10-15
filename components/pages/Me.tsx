"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Me() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const FULL_TEXT =
    "I’ve always been drawn to exploring new technologies and ideas, not just for the sake of knowing them, but for the way they expand how I see the world. Curiosity feels less like a habit and more like a way of living, a reminder that there’s always something more to learn. To me, growth isn’t about reaching perfection, but about embracing the endless process of becoming.";

  useEffect(() => {
    if (!descriptionRef.current || !textRef.current) return;

    textRef.current.textContent = "";

    const triggerEl = descriptionRef.current;
    const state = { v: 0 } as { v: number };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1280px)", () => {
      gsap.to(state, {
        v: FULL_TEXT.length,
        ease: "none",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = FULL_TEXT.slice(0, Math.floor(state.v));
          }
        },
        scrollTrigger: {
          trigger: triggerEl,
          start: "center center",
          endTrigger: imageRef.current || undefined,
          end: "center center",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            if (textRef.current) textRef.current.textContent = FULL_TEXT;
          },
          onLeaveBack: () => {
            if (textRef.current) textRef.current.textContent = "";
          },
        },
      });
    });

    mm.add("(max-width: 1279px)", () => {
      gsap.to(state, {
        v: FULL_TEXT.length,
        ease: "none",
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = FULL_TEXT.slice(0, Math.floor(state.v));
          }
        },
        scrollTrigger: {
          trigger: descriptionRef.current as Element,
          start: "top 75%",
          endTrigger: sectionRef.current || undefined,
          end: "bottom center",
          scrub: 1.4,
          pin: sectionRef.current as Element,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: () => {
            if (textRef.current) textRef.current.textContent = FULL_TEXT;
          },
          onLeaveBack: () => {
            if (textRef.current) textRef.current.textContent = "";
          },
        },
      });
    });

    if (imageRef.current && !(imageRef.current as HTMLImageElement).complete) {
      const onLoad = () => ScrollTrigger.refresh();
      imageRef.current.addEventListener("load", onLoad, { once: true } as AddEventListenerOptions);
    }

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="me" className="relative min-h-screen py-19">
      <div className="mx-auto max-w-7xl px-6 w-full h-full flex items-center justify-center">
        <div className="grid xl:grid-cols-2 gap-8 xl:gap-0 items-center w-full">
          <Reveal>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden w-full sm:h-[120vh] h-[60vh]">
                <Image
                  src="/images/1000231009.jpg"
                  alt="Profile picture"
                  fill
                  priority={false}
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  className="object-cover object-[15%_35%] rounded-lg"
                  onLoad={() => {
                    try { ScrollTrigger.refresh(); } catch {}
                  }}
                />
              </div>
            </div>
          </Reveal>

          <div ref={descriptionRef} className="space-y-6 xl:px-6">
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p aria-label="About me" className="">
                <span ref={textRef} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

