"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Me() {
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!descriptionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(descriptionRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="me" className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 w-full h-full   flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-0 items-center w-full">
          <Reveal>
            <div className="relative">
              <div className=" rounded-2xl overflow-hidden">
                <img
                  src="/images/1000231009.jpg"
                  alt="Profile picture"
                  className="w-full h-[120vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </Reveal>

          <div ref={descriptionRef} className="space-y-6">
            <Reveal delay={0.4}>
              <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  I’ve always been drawn to exploring new technologies and
                  ideas, not just for the sake of knowing them, but for the way
                  they expand how I see the world. Curiosity feels less like a
                  habit and more like a way of living, a reminder that there’s
                  always something more to learn. To me, growth isn’t about
                  reaching perfection, but about embracing the endless process
                  of becoming.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
