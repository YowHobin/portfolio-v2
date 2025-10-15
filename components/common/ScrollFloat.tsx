"use client";

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Highlighter } from '../ui/highlighter';

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
  secondLineIndentClassName?: string;
  onLeaveBack?: () => void;
  annotations?: Array<{
    phrase: string;
    action?: 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket';
    color?: string;
    colorLight?: string;
    colorDark?: string;
    strokeWidth?: number;
    animationDuration?: number;
    iterations?: number;
    padding?: number;
    multiline?: boolean;
  }>;
  highlightActive?: boolean;
  onFirstSegmentDeactivate?: () => void;
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
  onFirstSegmentComplete,
  secondLineIndentClassName = '',
  onLeaveBack,
  annotations = [],
  highlightActive = false,
  onFirstSegmentDeactivate,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const firstFiredRef = useRef(false);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    type Ann = Required<Pick<NonNullable<ScrollFloatProps['annotations']>[number], 'phrase'>> & Omit<NonNullable<ScrollFloatProps['annotations']>[number], 'phrase'>;
    const anns: Ann[] = (annotations || []).filter(a => a && a.phrase && text.includes(a.phrase)) as Ann[];
    const starts: Record<number, Ann[]> = {};
    const ends: Record<number, Ann[]> = {};
    anns.forEach((cfg, idx) => {
      const startIdx = text.indexOf(cfg.phrase);
      if (startIdx >= 0) {
        const endIdx = startIdx + cfg.phrase.length;
        if (!starts[startIdx]) starts[startIdx] = [];
        if (!ends[endIdx]) ends[endIdx] = [];
        starts[startIdx].push(cfg);
        ends[endIdx].push(cfg);
      }
    });

    const root: React.ReactNode[] = [];
    const stack: { cfg: Ann; children: React.ReactNode[]; key: string }[] = [];

    const pushNode = (node: React.ReactNode) => {
      if (stack.length > 0) stack[stack.length - 1].children.push(node);
      else root.push(node);
    };

    for (let i = 0; i < text.length; i++) {
      if (starts[i]) {
        starts[i].forEach((cfg, j) => {
          const key = `ann-${i}-${j}-${cfg.action ?? 'highlight'}`;
          stack.push({ cfg, children: [], key });
        });
      }

      const char = text[i];
      if (char === '\n') {
        pushNode(<br key={`br-${i}`} />);
        if (secondLineIndentClassName) {
          pushNode(
            <span key={`indent-${i}`} aria-hidden className={`inline-block ${secondLineIndentClassName}`} />
          );
        }
      } else {
        pushNode(
          <span className="inline-block word" key={i}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      }

      const endKey = i + 1;
      if (ends[endKey]) {
        for (let k = 0; k < ends[endKey].length; k++) {
          const top = stack.pop();
          if (top) {
            const annEl = (
              <Highlighter
                key={top.key}
                action={top.cfg.action ?? 'highlight'}
                color={top.cfg.color}
                colorLight={top.cfg.colorLight}
                colorDark={top.cfg.colorDark}
                strokeWidth={top.cfg.strokeWidth}
                animationDuration={top.cfg.animationDuration}
                iterations={top.cfg.iterations}
                padding={top.cfg.padding}
                multiline={top.cfg.multiline ?? true}
                isView={false}
                active={highlightActive}
              >
                <span className="inline-block">
                  {top.children}
                </span>
              </Highlighter>
            );
            pushNode(annEl);
          }
        }
      }
    }
    return root;
  }, [children, secondLineIndentClassName, annotations, highlightActive]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

  const charElements = el.querySelectorAll('.inline-block.word');

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
            } else if (firstFiredRef.current && self.direction < 0 && self.progress < firstThreshold) {
              firstFiredRef.current = false;
              if (typeof onFirstSegmentDeactivate === 'function') {
                onFirstSegmentDeactivate();
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
          },
          onLeaveBack: () => {
            if (typeof onLeaveBack === 'function') {
              onLeaveBack();
            }
          }
        }
      }
    );
  }, [children, scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, scrub, onAnimationComplete, onReset, onFirstSegmentComplete, onLeaveBack]);

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <span className={`inline-block leading-[1.1] ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
