"use client";

import Reveal from "./Reveal";
import ScrollFloat from "./common/ScrollFloat";
import { createElement, useId } from "react";
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
type ResponsiveHeight = {
  base?: BridgeHeight;
  sm?: BridgeHeight;
  md?: BridgeHeight;
  lg?: BridgeHeight;
  xl?: BridgeHeight;
  "2xl"?: BridgeHeight;
};
type BridgeHeightProp = BridgeHeight | ResponsiveHeight;

type BridgeProps = {
  id?: string;
  className?: string;
  height?: BridgeHeightProp;
  fullHeight?: boolean | number | string; // backward compatibility
  items: BridgeItem[];
};

export default function Bridge({ id, className = "", height, fullHeight = true, items }: BridgeProps) {
  const autoId = useId();
  const sectionId = id ?? `bridge-${autoId}`;
  const getTag = (as?: TagName): ElementType => (as ?? ("h2" as ElementType));

  const resolveHeight = (): BridgeHeightProp | undefined => {
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
  let responsiveStyleCSS: string | undefined;

  const toCssValue = (val: BridgeHeight): string => {
    if (typeof val === "number") return `${val}vh`;
    if (val === "screen") return "100vh";
    if (val === "half") return "50vh";
    if (val === "auto") return "auto";
    if (typeof val === "string") return val; // e.g., "70vh", "80dvh"
    return "auto";
  };

  const isResponsiveMap = (val: BridgeHeightProp | undefined): val is ResponsiveHeight =>
    !!val && typeof val === "object" && !Array.isArray(val) && ("base" in val || "sm" in val || "md" in val || "lg" in val || "xl" in val || "2xl" in val);

  if (isResponsiveMap(h)) {
    const base = h.base ?? "screen";
    const sm = h.sm;
    const md = h.md;
    const lg = h.lg;
    const xl = h.xl;
    const x2 = h["2xl"];
    styleMinHeight = { minHeight: "var(--bridge-min-h)" } as CSSProperties;
    const rules: string[] = [];
    rules.push(`#${sectionId}{--bridge-min-h:${toCssValue(base)};}`);
    if (sm) rules.push(`@media (min-width:640px){#${sectionId}{--bridge-min-h:${toCssValue(sm)};}}`);
    if (md) rules.push(`@media (min-width:768px){#${sectionId}{--bridge-min-h:${toCssValue(md)};}}`);
    if (lg) rules.push(`@media (min-width:1024px){#${sectionId}{--bridge-min-h:${toCssValue(lg)};}}`);
    if (xl) rules.push(`@media (min-width:1280px){#${sectionId}{--bridge-min-h:${toCssValue(xl)};}}`);
    if (x2) rules.push(`@media (min-width:1536px){#${sectionId}{--bridge-min-h:${toCssValue(x2)};}}`);
    responsiveStyleCSS = rules.join("\n");
  } else if (typeof h === "string") {
    if (h === "screen") heightClass = "min-h-screen";
    else if (h === "half") heightClass = "min-h-[50vh]";
    else if (h === "auto") heightClass = "";
    else customHeightClass = h; // pass-through Tailwind/custom classes
  } else if (typeof h === "number") {
    styleMinHeight = { minHeight: `${h}vh` };
  }

  return (
    <section id={sectionId} className={`relative ${heightClass} ${customHeightClass}`} style={styleMinHeight}>
      {responsiveStyleCSS ? (<style dangerouslySetInnerHTML={{ __html: responsiveStyleCSS }} />) : null}
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
