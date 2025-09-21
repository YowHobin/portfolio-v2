"use client";

import { useState } from "react";
import ScrollFloat from "./common/ScrollFloat";
import { SparklesText } from "./ui/sparkles-text";

export default function About() {
  const [sparklesFirstLine, setSparklesFirstLine] = useState(false);
  const [sparklesBoth, setSparklesBoth] = useState(false);

  return (
    <section id="about" className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 w-full min-h-screen flex items-start justify-center">
        <div className="relative w-full flex justify-center">
          <ScrollFloat
            animationDuration={1.5}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.09}
            scrub={5.2}
            containerClassName="w-full flex justify-center"
            textClassName="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[11.5rem] font-extrabold tracking-tight w-full"
            onFirstSegmentComplete={() => setSparklesFirstLine(true)}
            onAnimationComplete={() => setSparklesBoth(true)}
            onReset={() => {
              setSparklesFirstLine(false);
              setSparklesBoth(false);
            }}
          >
            {`Full stack
       Developer`}
          </ScrollFloat>

          {(sparklesFirstLine || sparklesBoth) && (
            <div className="pointer-events-none absolute inset-0 flex justify-center">
              {sparklesFirstLine && !sparklesBoth && (
                <div className="relative w-full" aria-hidden>
                  <div className="overflow-hidden" style={{ maxHeight: "50%" }}>
                    <SparklesText className="text-transparent leading-[1.1] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[11.5rem] font-extrabold tracking-tight w-full">
                      {`Full stack
       Developer`}
                    </SparklesText>
                  </div>
                </div>
              )}
              {sparklesBoth && (
                <SparklesText className="text-transparent leading-[1.1] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[11.5rem] font-extrabold tracking-tight w-full">
                  {`Full stack
       Developer`}
                </SparklesText>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
