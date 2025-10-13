"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";
import TextType from "../common/TextType";

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
    <section id="me" className="relative min-h-screen py-19">
      <div className="mx-auto max-w-7xl px-6 w-full h-full   flex items-center justify-center">
        <div className="grid xl:grid-cols-2 gap-8 xl:gap-0 items-center w-full">
          <Reveal>
            <div className="relative">
              <div className=" rounded-2xl overflow-hidden ">
                <img
                  src="/images/1000231009.jpg"
                  alt="Profile picture"
                  className="w-full sm:h-[120vh] object-cover object-[15%_35%] rounded-lg"
                />
              </div>
            </div>
          </Reveal>

          <div ref={descriptionRef} className="space-y-6 xl:px-6">
            <Reveal delay={0.4}>
              <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                <TextType
                  as="p"
                  className="max-w-prose"
                  text="I’ve always been drawn to exploring new technologies and ideas, not just for the sake of knowing them, but for the way they expand how I see the world. Curiosity feels less like a habit and more like a way of living, a reminder that there’s always something more to learn. To me, growth isn’t about reaching perfection, but about embracing the endless process of becoming."
                  typingSpeed={42}
                  variableSpeed={{ min: 28, max: 56 }}
                  initialDelay={200}
                  loop={false}
                  startOnVisible
                  textColors={["currentColor"]}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
