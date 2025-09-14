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

  return (
    <div className="glass border border-black/10 dark:border-white/10 rounded-3xl p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-black/10 dark:border-white/10">
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }} />
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }} />
        <span className="ml-2 text-xs opacity-70">dev@lenard:~/projects</span>
      </div>
      <pre className="m-0 p-4 text-sm leading-relaxed font-mono min-h-64 max-h-[28rem] overflow-hidden">
        {displayLines.map((ln, i) => (
          <div key={i} className="whitespace-pre-wrap">
            <span className="opacity-60">{ln.startsWith("$") ? "" : ""}</span>
            {ln}
            {i === displayLines.length - 1 ? <span className="animate-pulse">▍</span> : null}
          </div>
        ))}
      </pre>
    </div>
  );
}
