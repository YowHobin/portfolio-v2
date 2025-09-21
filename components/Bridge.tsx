"use client";

import Reveal from "./Reveal";
import ScrollFloat from "./common/ScrollFloat";
import { createElement } from "react";
import type { CSSProperties, ElementType } from "react";

type TagName = ElementType;

type BridgeItem = {
  id?: string;
  text: string;
  as?: TagName;
  variant?: "float" | "reveal" | "none";
  containerClassName?: string;
  textClassName?: string;
  scroll?: {
    start?: string;
    end?: string;
    stagger?: number;
    scrub?: boolean | number;
    duration?: number;
    ease?: string;
  };
};

type BridgeHeight = "auto" | "half" | "screen" | number | string;

type BridgeProps = {
  id?: string;
  className?: string;
  height?: BridgeHeight;
  fullHeight?: boolean | number | string; // backward compatibility
  items: BridgeItem[];
};

export default function Bridge({ id = "bridge", className = "", height, fullHeight = true, items }: BridgeProps) {
  const getTag = (as?: TagName): ElementType => (as ?? ("h2" as ElementType));

  const resolveHeight = (): BridgeHeight => {
    if (typeof height !== "undefined") return height;
    if (typeof fullHeight === "boolean") return fullHeight ? "screen" : "auto";
    if (typeof fullHeight === "number") return fullHeight; // treated as vh
    if (typeof fullHeight === "string") return fullHeight; // custom class
    return "screen";
  };

  const h = resolveHeight();
  let heightClass = "";
  let customHeightClass = "";
  let styleMinHeight: CSSProperties | undefined;

  if (typeof h === "string") {
    if (h === "screen") heightClass = "min-h-screen";
    else if (h === "half") heightClass = "min-h-[50vh]";
    else if (h === "auto") heightClass = "";
    else customHeightClass = h; // pass-through Tailwind/custom classes
  } else if (typeof h === "number") {
    styleMinHeight = { minHeight: `${h}vh` };
  }

  return (
    <section id={id} className={`relative ${heightClass} ${customHeightClass}`} style={styleMinHeight}>
      <div className={`relative w-full ${heightClass} ${customHeightClass} ${className}`} style={styleMinHeight}>
        {items.map((item, idx) => {
          const key = item.id ?? `bridge-item-${idx}`;
          if (item.variant === "float") {
            return (
              <ScrollFloat
                key={key}
                containerClassName={item.containerClassName ?? ""}
                textClassName={item.textClassName ?? ""}
                scrollStart={item.scroll?.start ?? "top bottom"}
                scrollEnd={item.scroll?.end ?? "bottom top"}
                stagger={item.scroll?.stagger ?? 0.06}
                scrub={item.scroll?.scrub ?? 1}
                animationDuration={item.scroll?.duration ?? 1}
                ease={item.scroll?.ease ?? "back.inOut(2)"}
              >
                {item.text}
              </ScrollFloat>
            );
          }

          if (item.variant === "reveal") {
            const tag = getTag(item.as);
            return (
              <div key={key} className={item.containerClassName ?? ""}>
                <Reveal>
                  {createElement(tag, { className: item.textClassName ?? "" } as Record<string, unknown>, item.text)}
                </Reveal>
              </div>
            );
          }

          const tag = getTag(item.as);
          return (
            <div key={key} className={item.containerClassName ?? ""}>
              {createElement(tag, { className: item.textClassName ?? "" } as Record<string, unknown>, item.text)}
            </div>
          );
        })}
      </div>
    </section>
  );
}
