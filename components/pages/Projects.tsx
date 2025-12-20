"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";
import CountUp from "../CountUp";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const articles = articlesRef.current?.querySelectorAll('article');
    const titleContainer = titleRef.current;

    if (!section || !articles || !titleContainer) return;

    // Set initial state for title and subtitle
    const title = titleContainer.querySelector('h2');
    const subtitle = titleContainer.querySelector('p');
    
    if (title) {
      gsap.set(title, {
        opacity: 0,
        y: 30,
      });
    }
    
    if (subtitle) {
      gsap.set(subtitle, {
        opacity: 0,
        y: 20,
      });
    }

    // Initial state - set articles to be completely invisible and positioned from sides
    gsap.set(articles, {
      opacity: 0,
      visibility: "hidden",
    });

    // Set initial positions based on article type
    const minorSideArticles = Array.from(articles).filter((article, index) => index === 0 || index === 1);
    const majorArticle = Array.from(articles).find((article, index) => index === 2);

    if (minorSideArticles.length > 0) {
      gsap.set(minorSideArticles, {
        x: -100,
      });
    }

    if (majorArticle) {
      gsap.set(majorArticle, {
        x: 100,
      });
    }

    // Create ScrollTrigger for title and subtitle
    ScrollTrigger.create({
      trigger: titleContainer,
      onEnter: () => {
        console.log("Title container entered - playing title animations");
        if (title) {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }
        if (subtitle) {
          gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2,
          });
        }
      },
      onLeave: () => {
        console.log("Title container left - playing leave animations");
        if (title) {
          gsap.to(title, {
            opacity: 0.6,
            y: -10,
            duration: 0.6,
            ease: "power2.in",
          });
        }
        if (subtitle) {
          gsap.to(subtitle, {
            opacity: 0.6,
            y: -10,
            duration: 0.6,
            ease: "power2.in",
          });
        }
      },
      onEnterBack: () => {
        console.log("Title container entered back - playing title animations");
        if (title) {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        }
        if (subtitle) {
          gsap.to(subtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2,
          });
        }
      },
      onLeaveBack: () => {
        console.log("Title container left back - reversing title animations");
        if (title) {
          gsap.to(title, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: "power2.in",
          });
        }
        if (subtitle) {
          gsap.to(subtitle, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.in",
          });
        }
      },
    });

    // Create individual ScrollTriggers for each article
    Array.from(articles).forEach((article, index) => {
      const isMinorOrSide = index === 0 || index === 1;
      
      // Create animation for this specific article
      const animation = gsap.to(article, {
        opacity: 1,
        x: 0,
        visibility: "visible",
        duration: 1.2,
        ease: "power2.out",
        paused: true,
      });

      // Create leave animation for this specific article
      const leaveAnimation = gsap.to(article, {
        opacity: 0.6,
        x: isMinorOrSide ? 50 : -50,
        duration: 1.0,
        ease: "power2.in",
        paused: true,
      });

      // Create ScrollTrigger for this article
      ScrollTrigger.create({
        trigger: article,
        onEnter: () => {
          console.log(`Article ${index} entered - playing animation`);
          animation.play();
        },
        onLeave: () => {
          console.log(`Article ${index} left - playing leave animation`);
          leaveAnimation.play();
        },
        onEnterBack: () => {
          console.log(`Article ${index} entered back - reversing leave and playing enter`);
          leaveAnimation.reverse();
          animation.play();
        },
        onLeaveBack: () => {
          console.log(`Article ${index} left back - reversing enter`);
          animation.reverse();
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: sectionRef });
  return (
    <section id="projects" ref={sectionRef} className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 w-full">

        <Reveal>
          <div ref={titleRef} className="max-w-2xl">
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle mt-2">
              A quick snapshot of the work that actually shipped.
            </p>
          </div>
        </Reveal>

        <div ref={articlesRef} className="mt-10 grid gap-6 md:grid-cols-2 items-stretch">
          <div className="grid gap-6">
            <article className="glass rounded-[32px] border border-foreground/12 bg-background/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/45">
                  Minor projects
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <CountUp
                    to={3}
                    className="text-4xl sm:text-5xl font-semibold tracking-tight"
                  />
                  <span className="text-sm text-foreground/60">shipped builds</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">
                Tight, well-scoped implementations used to explore ideas fast
                without cutting corners on quality.
              </p>
            </article>

            <article className="glass rounded-[32px] border border-foreground/12 bg-background/80 p-6 sm:p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.5em] text-foreground/45">
                  Side project
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <CountUp
                    to={1}
                    className="text-4xl sm:text-5xl font-semibold tracking-tight"
                  />
                  <span className="text-sm text-foreground/60">active build</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground/60">
                A long-running playground to try new stacks in production
                before they land in client work.
              </p>
            </article>
          </div>

          <article className="relative overflow-hidden rounded-[32px] border border-foreground/12 bg-background/95 p-6 sm:p-10 flex flex-col justify-between md:row-span-2">
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-chart-1 via-chart-2 to-chart-3 opacity-80"
              aria-hidden
            />
            <div className="relative z-10 flex flex-col gap-4">
              <p className="text-[0.65rem] uppercase tracking-[0.5em] text-background/70">
                Major projects
              </p>
              <div className="flex items-baseline gap-3">
                <CountUp
                  to={7}
                  className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-background"
                />
                <span className="text-sm font-medium text-background/80">
                  end-to-end deliveries
                </span>
              </div>
              <p className="max-w-md text-sm text-background/80">
                Full-stack products taken from first commit to production:
                architecture, implementation, testing, deployment, and the
                unglamorous maintenance work that keeps everything stable.
                These are the projects with real users, real constraints, and
                long-term ownership—not just prototypes.
              </p>
            </div>
          </article>
        </div>
      </div>

    </section>
  );
}