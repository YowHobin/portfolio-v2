"use client";

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RoughNotation } from 'react-rough-notation';
import { useThemeVersion } from '@/lib/useThemeVersion';

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
  const suppressCallbacksRef = useRef(false);
  const themeVersion = useThemeVersion();

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    type Ann = Required<Pick<NonNullable<ScrollFloatProps['annotations']>[number], 'phrase'>> & Omit<NonNullable<ScrollFloatProps['annotations']>[number], 'phrase'>;
    const anns: Ann[] = (annotations || []).filter(a => a && a.phrase && text.includes(a.phrase)) as Ann[];
    const starts: Record<number, Ann[]> = {};
    const ends: Record<number, Ann[]> = {};
  anns.forEach((cfg) => {
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
            const color = (() => {
              const root = typeof document !== 'undefined' ? document.documentElement : null;
              const isDark = !!root && (root.classList.contains('dark') || root.getAttribute('data-theme') === 'dark');
              const action = (top.cfg.action ?? 'highlight');
              if (isDark) {
                if (action === 'underline') return '#a3dd95';
                return '#476eae';
              }
              // light
              if (action === 'highlight') return '#fde68a';
              return (top.cfg.colorLight ?? top.cfg.color ?? '#476eae');
            })();
            const annEl = (
              <RoughNotation
                key={`${top.key}-${themeVersion}`}
                type={(top.cfg.action ?? 'highlight') as 'highlight' | 'underline' | 'box' | 'circle' | 'strike-through' | 'crossed-off' | 'bracket'}
                color={color}
                strokeWidth={top.cfg.strokeWidth}
                animationDuration={top.cfg.animationDuration ?? 600}
                iterations={top.cfg.iterations}
                padding={top.cfg.padding}
                multiline={top.cfg.multiline ?? true}
                show={highlightActive}
                // include themeVersion to force re-render on theme change
                data-theme-version={themeVersion}
              >
                <span className="inline-block">
                  {top.children}
                </span>
              </RoughNotation>
            );
            pushNode(annEl);
          }
        }
      }
    }
    return root;
  }, [children, secondLineIndentClassName, annotations, highlightActive, themeVersion]);

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
            if (suppressCallbacksRef.current) return;
            if (!firstFiredRef.current && self.progress >= firstThreshold) {
              firstFiredRef.current = true;
              if (typeof onFirstSegmentComplete === 'function') {
                onFirstSegmentComplete();
              }
            } else if (firstFiredRef.current && self.direction < 0) {
              const hysteresis = 0.035;
              const deactivateBelow = Math.max(firstThreshold - hysteresis, 0);
              if (self.progress < deactivateBelow) {
              firstFiredRef.current = false;
              if (typeof onFirstSegmentDeactivate === 'function') {
                onFirstSegmentDeactivate();
              }
              }
            }
          },
          onLeave: () => {
            if (suppressCallbacksRef.current) return;
            if (typeof onAnimationComplete === 'function') {
              onAnimationComplete();
            }
          },
          onEnterBack: () => {
            if (suppressCallbacksRef.current) return;
            firstFiredRef.current = false;
            if (typeof onReset === 'function') {
              onReset();
            }
          },
          onLeaveBack: () => {
            if (suppressCallbacksRef.current) return;
            if (typeof onLeaveBack === 'function') {
              onLeaveBack();
            }
          }
        }
      }
    );
  }, [children, scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, scrub, onAnimationComplete, onReset, onFirstSegmentComplete, onLeaveBack, onFirstSegmentDeactivate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      suppressCallbacksRef.current = true;
      const id = window.setTimeout(() => {
        suppressCallbacksRef.current = false;
        try { ScrollTrigger.refresh(); } catch {}
        window.clearTimeout(id);
      }, 220);
    };
    window.addEventListener('theme-changed', handler as EventListener);
    return () => {
      window.removeEventListener('theme-changed', handler as EventListener);
    };
  }, []);

  return (
    <h2 ref={containerRef} className={`overflow-hidden ${containerClassName}`}>
      <span className={`inline-block leading-[1.1] ${textClassName}`}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
