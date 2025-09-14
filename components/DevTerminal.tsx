"use client";

import { useEffect, useRef, useState } from "react";

const TICK_MS = 18 as const;
const NEXT_LINE_DELAY = 650 as const;
const LOOP_DELAY = 1500 as const;
const PROGRESS_BAR_SLOTS = 20 as const;
const PROGRESS_STEP = 2 as const;

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
  const [showCaret, setShowCaret] = useState(true);
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);
  const startedRef = useRef(false);
  const progressRef = useRef(0);

  const isProgressLine = (s: string) => /(\d{1,3})%/.test(s) || /\[[#█░\.]+\]/.test(s);

  const targetPercentFromLine = (s: string) => {
    const m = s.match(/(\d{1,3})%/);
    if (!m) return 100;
    const n = Math.min(100, parseInt(m[1], 10));
    return Number.isFinite(n) ? n : 100;
  };

  const buildAsciiProgress = (pct: number) => {
    const bounded = Math.max(0, Math.min(100, Math.round(pct)));
    const filled = Math.round((bounded / 100) * PROGRESS_BAR_SLOTS);
    const empty = PROGRESS_BAR_SLOTS - filled;
    return `[${"#".repeat(filled)}${".".repeat(empty)}] ${bounded}%`;
  };


  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const start = () => {
      setDisplayLines([]);
      setShowCaret(true);
      idxRef.current = 0;
      charRef.current = 0;
      step();
    };

    const step = () => {
      const current = LINES[idxRef.current];
      if (!current) {
        setShowCaret(false);
        window.setTimeout(start, LOOP_DELAY);
        return;
      }
      const full = current.text;
      const promptPrefix = current.prompt ? "" : "";

      if (isProgressLine(full)) {
        const target = targetPercentFromLine(full);
        const nextPct = Math.min(target, progressRef.current + PROGRESS_STEP);
        progressRef.current = nextPct;

        const lineText = `${promptPrefix}${buildAsciiProgress(nextPct)}`;
        const lineIndex = idxRef.current;
        setDisplayLines((prev) => {
          const before = prev.slice(0, lineIndex);
          return [...before, lineText];
        });

        if (nextPct >= target) {
          if (idxRef.current === LINES.length - 1) {
            setShowCaret(false);
          }
          idxRef.current += 1;
          progressRef.current = 0;
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(step, NEXT_LINE_DELAY);
        } else {
          if (timerRef.current) window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(step, TICK_MS);
        }
        return;
      }

      const nextLen = Math.min(charRef.current + 1, full.length);
      const isDone = nextLen === full.length;
      charRef.current = nextLen;

      const lineIndex = idxRef.current;
      setDisplayLines((prev) => {
        const before = prev.slice(0, lineIndex);
        const curr = `${promptPrefix}${full.slice(0, nextLen)}`;
        return [...before, curr];
      });

      if (isDone) {
        if (idxRef.current === LINES.length - 1) {
          setShowCaret(false);
        }
        idxRef.current += 1;
        charRef.current = 0;
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(step, NEXT_LINE_DELAY);
      } else {
        if (timerRef.current) window.clearTimeout(timerRef.current);
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
      <pre ref={preRef} aria-live="polite" className="m-0 p-3 sm:p-4 text-[11px] sm:text-sm leading-relaxed font-mono h-48 sm:h-56 md:h-64 lg:h-72 max-h-[50vh] overflow-auto whitespace-pre">
        {displayLines.length > 0
          ? displayLines
              .map((ln, i) => (showCaret && i === displayLines.length - 1 ? `${ln}▍` : ln))
              .join("\n")
          : null}
      </pre>
    </div>
  );
}
