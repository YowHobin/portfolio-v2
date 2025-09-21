"use client";

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  scrub?: boolean | number;
  onAnimationComplete?: () => void;
  onReset?: () => void;
  onFirstSegmentComplete?: () => void;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  scrub = true,
  onAnimationComplete,
  onReset,
  onFirstSegmentComplete
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const firstFiredRef = useRef(false);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      char === '\n' ? (
        <br key={`br-${index}`} />
      ) : (
        <span className="inline-block word" key={index}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      )
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.inline-block');

    const rawText = typeof children === 'string' ? children : '';
    const newlineIndex = rawText.indexOf('\n');
    const totalChars = charElements.length;
    const firstSegmentChars = newlineIndex >= 0 ? Math.min(Math.max(newlineIndex, 1), totalChars) : totalChars;
    const totalDuration = (Math.max(totalChars, 1) - 1) * stagger + animationDuration;
    const firstSegmentDuration = (Math.max(firstSegmentChars, 1) - 1) * stagger + animationDuration;
    const firstThreshold = totalDuration > 0 ? firstSegmentDuration / totalDuration : 1;

    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: scrub,
          onUpdate: (self) => {
            if (!firstFiredRef.current && self.progress >= firstThreshold) {
              firstFiredRef.current = true;
              if (typeof onFirstSegmentComplete === 'function') {
                onFirstSegmentComplete();
              }
            }
          },
          onLeave: () => {
            if (typeof onAnimationComplete === 'function') {
              onAnimationComplete();
            }
          },
          onEnterBack: () => {
            firstFiredRef.current = false;
            if (typeof onReset === 'function') {
              onReset();
            }
          }
        }
      }
    );
  }, [children, scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, scrub, onAnimationComplete, onReset, onFirstSegmentComplete]);

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <span className={`inline-block leading-[1.1] ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
