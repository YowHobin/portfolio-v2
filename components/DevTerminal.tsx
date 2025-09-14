"use client";

import { useEffect, useRef, useState } from "react";

const TICK_MS = 18 as const;
const NEXT_LINE_DELAY = 650 as const;
const LOOP_DELAY = 1500 as const;

type TerminalLine = {
  text: string;
  prompt?: boolean;
};

const LINES: TerminalLine[] = [
  { text: "$ npx create-delight --project=enterprise-web", prompt: true },
  { text: "Scaffolding a beautiful experience..." },
  { text: "[█████░░░░░] 34%" },
  { text: "Installing deps: react, next, prisma, zod, tailwind" },
  { text: "[██████████░] 96%" },
  { text: "$ pnpm generate:design-system", prompt: true },
  { text: "Creating tokens: colors, typography, radii, spacing" },
  { text: "Generating components: Button, Card, Table, Modal" },
  { text: "$ pnpm setup:backend", prompt: true },
  { text: "API routes: auth, users, billing, audit" },
  { text: "DB migrations: +8  (postgres)" },
  { text: "$ pnpm test", prompt: true },
  { text: "Tests: 128 passed  •  0 failed" },
  { text: "$ pnpm ci --with=preview", prompt: true },
  { text: "Building app for production..." },
  { text: "Bundle size optimized  •  TTI < 1.2s" },
  { text: "Enabling analytics, tracing, error reporting" },
  { text: "$ pnpm deploy --env=prod", prompt: true },
  { text: "Deploying... done in 42s" },
  { text: "Live: https://app.prod.run" },
  { text: "Success: crafted a delightful, revenue‑boosting experience for your team." },
];

export default function DevTerminal() {
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  const DEFAULT_BAR_SLOTS = 10 as const;

  const parseProgress = (s: string) => {
    const pctMatch = s.match(/(\d{1,3})%/);
    const percentFromNumber = pctMatch ? Math.min(100, parseInt(pctMatch[1], 10)) : null;

    const barMatch = s.match(/\[([█░]+)?\]?/);
    const barStr = barMatch?.[1] ?? "";
    const filled = (barStr.match(/█/g) || []).length;
    const total = barStr.length || DEFAULT_BAR_SLOTS;
    const percentFromBar = total > 0 ? Math.round((filled / total) * 100) : null;

    const hasProgressSyntax = /\[/.test(s) || /%/.test(s);
    const percent = percentFromNumber ?? percentFromBar ?? null;
    return { hasProgressSyntax, percent } as { hasProgressSyntax: boolean; percent: number | null };
  };

  useEffect(() => {
    const start = () => {
      setDisplayLines([]);
      idxRef.current = 0;
      charRef.current = 0;
      step();
    };

    const step = () => {
      const current = LINES[idxRef.current];
      if (!current) {
        window.setTimeout(start, LOOP_DELAY);
        return;
      }
      const full = current.text;
      const nextLen = Math.min(charRef.current + 1, full.length);
      const isDone = nextLen === full.length;
      charRef.current = nextLen;

      setDisplayLines((prev) => {
        const before = prev.slice(0, idxRef.current);
        const curr = (current.prompt ? "" : "") + full.slice(0, nextLen);
        return [...before, curr];
      });

      if (isDone) {
        idxRef.current += 1;
        charRef.current = 0;
        timerRef.current = window.setTimeout(step, NEXT_LINE_DELAY);
      } else {
        timerRef.current = window.setTimeout(step, TICK_MS);
      }
    };

    start();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!preRef.current) return;
    preRef.current.scrollTop = preRef.current.scrollHeight;
  }, [displayLines]);

  return (
    <div className="glass w-full max-w-full border border-black/10 dark:border-white/10 rounded-2xl sm:rounded-3xl p-0 overflow-hidden" role="region" aria-label="Developer terminal">
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-black/10 dark:border-white/10">
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }} />
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }} />
        <span className="ml-2 flex-1 min-w-0 truncate text-[11px] sm:text-xs opacity-70">dev@lenard:~/projects</span>
      </div>
      <pre ref={preRef} aria-live="polite" className="m-0 p-3 sm:p-4 text-[11px] sm:text-sm leading-relaxed font-mono h-48 sm:h-56 md:h-64 lg:h-72 max-h-[50vh] overflow-auto whitespace-pre-wrap break-words">
        {displayLines.map((ln, i) => {
          const { hasProgressSyntax, percent } = parseProgress(ln);
          const isProgress = hasProgressSyntax && percent !== null;
          return (
            <div key={i} className="whitespace-pre-wrap">
              {isProgress ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 h-2 rounded bg-black/15 dark:bg-white/15 overflow-hidden" aria-label="progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} role="progressbar">
                    <div className="h-full bg-foreground" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="tabular-nums opacity-70">{percent}%</span>
                </div>
              ) : (
                <>
                  {ln}
                  {i === displayLines.length - 1 ? <span className="animate-pulse">▍</span> : null}
                </>
              )}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
