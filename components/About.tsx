"use client";

import { useState } from "react";
import ScrollFloat from "./common/ScrollFloat";
import { SparklesText } from "./ui/sparkles-text";

export default function About() {
  const [sparklesFirstLine, setSparklesFirstLine] = useState(false);
  const [sparklesBoth, setSparklesBoth] = useState(false);

  return (
    <section id="about" className="relative min-h-screen">
      <div className="mx-auto max-w-7xl px-4 w-full min-h-screen flex items-center justify-center">
        <div className="relative w-fit mx-auto flex justify-center">
          <ScrollFloat
            animationDuration={1.5}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.09}
            scrub={5.2}
            containerClassName="w-fit mx-auto flex justify-center"
              textClassName="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[12.5rem] font-extrabold tracking-tight whitespace-nowrap md:whitespace-normal"
            secondLineIndentClassName="hidden md:inline-block md:w-16 lg:w-24 xl:w-32"
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
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {sparklesFirstLine && !sparklesBoth && (
                <div className="relative w-fit" aria-hidden>
                  <div className="overflow-hidden" style={{ maxHeight: "50%" }}>
                    <SparklesText className="text-transparent leading-[1.1] text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[12.5rem] font-extrabold tracking-tight whitespace-nowrap md:whitespace-normal">
                      <>
                        {`Full stack`}
                        <br />
                        <span className="hidden md:inline-block md:w-16 lg:w-24 xl:w-32" aria-hidden />
                        {`Developer`}
                      </>
                    </SparklesText>
                  </div>
                </div>
              )}
              {sparklesBoth && (
                <SparklesText className="text-transparent leading-[1.1] text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[12.5rem] font-extrabold tracking-tight whitespace-nowrap md:whitespace-normal">
                  <>
                    {`Full stack`}
                    <br />
                    <span className="hidden md:inline-block md:w-16 lg:w-24 xl:w-32" aria-hidden />
                    {`Developer`}
                  </>
                </SparklesText>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
