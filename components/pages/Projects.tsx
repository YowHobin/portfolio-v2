"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "../ui/Reveal";
import CountUp from "../CountUp";
import { Confetti, type ConfettiRef } from "../ui/confetti";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const confettiRef = useRef<ConfettiRef>(null);

  const fireConfetti = useCallback((element?: HTMLElement | null, particleCount = 50, spread = 50) => {
    if (!element || !confettiRef.current) return;
    
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confettiRef.current.fire({
      particleCount,
      spread,
      origin: { x, y }
    });
  }, []);

  useEffect(() => {
    if (!titleRef.current || !sectionRef.current) return;

    const title = titleRef.current;
    
    // Initial state
    gsap.set(title, { 
      opacity: 0, 
      rotateX: 90, 
      transformOrigin: "bottom center" 
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.to(title, {
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "expo.out"
        });
      },
      onLeave: () => {
        gsap.to(title, {
          opacity: 0,
          rotateX: 90,
          duration: 0.8,
          ease: "power2.in"
        });
      },
      onEnterBack: () => {
        gsap.to(title, {
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "expo.out"
        });
      },
      onLeaveBack: () => {
        gsap.to(title, {
          opacity: 0,
          rotateX: 90,
          duration: 0.8,
          ease: "power2.in"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const articles = articlesRef.current?.querySelectorAll('article');

    if (!section || !articles) return;

    // Initial state - set articles to be completely invisible and positioned from sides
    gsap.set(articles, {
      opacity: 0,
      visibility: "hidden",
    });

    // Set initial positions based on article type
    // Index 0 is the Major Project (Left/Main)
    // Indices 1 and 2 are the Minor/Side Projects (Right/Sidebar)
    const majorArticle = articles[0];
    const sideArticles = Array.from(articles).slice(1);

    if (majorArticle) {
      gsap.set(majorArticle, {
        x: -100, // Enters from left
      });
    }

    if (sideArticles.length > 0) {
      gsap.set(sideArticles, {
        x: 100, // Enters from right
      });
    }

    // Create individual ScrollTriggers for each article
    Array.from(articles).forEach((article, index) => {
      const isRight = index !== 0; // Index 0 is Left, others are Right
      
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
        x: isRight ? 50 : -50, // Move in direction of origin (or away)
        duration: 1.0,
        ease: "power2.in",
        paused: true,
      });

      // Create ScrollTrigger for this article
      ScrollTrigger.create({
        trigger: article,
        start: "top 85%",
        onEnter: () => {
          animation.play();
        },
        onLeave: () => {
          leaveAnimation.play();
        },
        onEnterBack: () => {
          leaveAnimation.reverse();
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: sectionRef });
  return (
    <section id="projects" ref={sectionRef} className="relative min-h-screen py-32">
      {/* Background Effects - Gallery Style */}
      <div className="pointer-events-none absolute inset-0 bg-background transition-colors duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(var(--brand-primary-rgb),0.1),transparent),radial-gradient(circle_800px_at_0%_300px,rgba(var(--brand-secondary-rgb),0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="flex flex-col gap-24">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border/40 pb-12">
            <div className="relative">
              <p className="text-sm font-mono text-muted-foreground mb-4 tracking-widest uppercase">Select Work</p>
              <h2
                ref={titleRef}
                className="text-8xl md:text-9xl font-bold tracking-tighter text-foreground leading-[0.9]"
              >
                Selected<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">Works</span>
              </h2>
            </div>
            
            <Reveal>
              <p className="text-xl text-muted-foreground max-w-md font-light leading-relaxed text-right md:text-left">
                A collection of shipped products and experiments. 
                <span className="block mt-2 text-foreground font-medium">Built with precision.</span>
              </p>
            </Reveal>
          </div>

          {/* Gallery Grid */}
          <div ref={articlesRef} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Major Project - Featured */}
            <article className="group md:col-span-8 relative min-h-[600px] rounded-[2rem] overflow-hidden bg-muted/20 border border-white/10 hover:border-primary/50 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/50 z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--brand-primary-rgb),0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
              
              {/* Content */}
              <div className="relative z-20 h-full p-12 flex flex-col justify-end">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider">Featured</span>
                    <span className="text-muted-foreground text-sm font-mono">2023 — Present</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-5xl font-bold tracking-tight">Enterprise Scale</h3>
                    <p className="text-xl text-muted-foreground max-w-xl">
                      Full-stack products built for scale, reliability, and long-term maintenance. 
                      <span className="block mt-2 text-foreground font-medium">
                        From architecture to deployment and beyond.
                      </span>
                    </p>
                  </div>

                  <div className="flex items-baseline gap-4 pt-8 border-t border-border/20">
                    <CountUp
                      to={7}
                      duration={3.2}
                      className="text-8xl font-bold tracking-tighter text-foreground"
                      onEnd={(el) => fireConfetti(el, 100, 70)}
                    />
                    <span className="text-lg font-mono text-muted-foreground">Deliveries</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar Column */}
            <div className="md:col-span-4 flex flex-col gap-8 h-full">
              {/* Minor Projects */}
              <article className="group flex-1 min-h-[280px] rounded-[2rem] bg-muted/20 border border-white/10 p-8 relative overflow-hidden hover:bg-muted/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2">Experiments</h4>
                    <h3 className="text-2xl font-bold">Minor Builds</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Quick, well-scoped implementations to explore ideas fast without cutting corners on quality.
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-4 pt-4">
                    <CountUp
                      to={3}
                      duration={2.5}
                      className="text-6xl font-bold tracking-tighter"
                      onEnd={(el) => fireConfetti(el, 50, 50)}
                    />
                    <span className="text-sm font-mono text-muted-foreground">Projects</span>
                  </div>
                </div>
              </article>

              {/* Side Project */}
              <article className="group flex-1 min-h-[280px] rounded-[2rem] bg-muted/20 border border-white/10 p-8 relative overflow-hidden hover:bg-muted/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full flex flex-col justify-between z-10">
                  <div>
                    <h4 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-2">Playground</h4>
                    <h3 className="text-2xl font-bold">Side Project</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      A long-running playground to test new stacks in production before they land in client work.
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-4 pt-4">
                    <CountUp
                      to={1}
                      duration={2.8}
                      className="text-6xl font-bold tracking-tighter"
                      onEnd={(el) => fireConfetti(el, 40, 60)}
                    />
                    <span className="text-sm font-mono text-muted-foreground">Active</span>
                  </div>
                </div>
              </article>
            </div>
            
          </div>
        </div>
      </div>
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-50 size-full pointer-events-none"
        manualstart
      />
    </section>
  );
}