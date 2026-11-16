"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { ANSWER_AT, TOOL_STEPS } from "./timeline";

/** "thinking · 1.2s" while the agent works, then "done · 3 tool calls · 4.6s". */
export function IntroStatus({ startedAt, done }: { startedAt: number | null; done: boolean }) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null || done) return;
    const timer = window.setInterval(() => setNow(performance.now()), 100);
    return () => window.clearInterval(timer);
  }, [startedAt, done]);

  const base = "inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px]";
  if (done) {
    return (
      <span className={`${base} text-emerald-400`}>
        <Check size={11} strokeWidth={3} />
        <span>
          done
          <span className="hidden sm:inline"> · {TOOL_STEPS.length} tool calls</span> ·{" "}
          {(ANSWER_AT / 1000).toFixed(1)}s
        </span>
      </span>
    );
  }
  const seconds = startedAt === null ? 0 : Math.max(0, (now - startedAt) / 1000);
  return (
    <span className={`${base} text-charcoal-muted-deep`}>
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      {startedAt === null ? "starting" : `thinking · ${seconds.toFixed(1)}s`}
    </span>
  );
}
