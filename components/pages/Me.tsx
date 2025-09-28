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
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          <Reveal>
            <div className="relative">
              <div className=" rounded-2xl overflow-hidden  p-1">
                <img
                  src="/images/1000231009.jpg"
                  alt="Profile picture"
                  className="w-full h-[100vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </Reveal>

          <div ref={descriptionRef} className="space-y-6">
            <Reveal delay={0.4}>
              <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <p>
                  A person who loves to explore new technologies and learn new things. Always curious and eager to
                  know more. I believe in continuous learning and growth.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
