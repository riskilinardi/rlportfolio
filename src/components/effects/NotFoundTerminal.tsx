"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  AgentCall,
  TraceLines,
  WINDOW_LIGHTS,
  traceGrid,
  type TraceStep,
} from "@/components/trace/Trace";
import { useClientValue } from "@/lib/useClientValue";
import { traceTimes, useTimeline } from "@/lib/useTimeline";

/** The 404 page as an agent trace: it searches for the page and fails its check. */
export function NotFoundTerminal() {
  // The 404 page is pre-rendered once, so the visited path is only known in the browser.
  const path = useClientValue<string | null>(() => window.location.pathname, null);
  const target = path ?? "this page";
  const steps: TraceStep[] = useMemo(
    () => [
      { label: "plan", call: "look for the page" },
      { label: "tool", call: `search("${target}")`, result: "no match" },
      { label: "check", call: "the page exists", result: "✗", failed: true },
    ],
    [target],
  );
  const times = useMemo(() => traceTimes(steps.length, 320, 180), [steps.length]);
  const reached = useTimeline(times);
  const shown = Math.min(steps.length, Math.ceil(reached / 2));
  const results = Math.min(steps.length, Math.floor(reached / 2));
  const answered = reached > steps.length * 2;

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-charcoal-surface/85 shadow-[0_30px_120px_-20px_rgba(31,111,235,0.4)] overflow-hidden animate-intro-boot">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        {WINDOW_LIGHTS.map((colour, i) => (
          <span
            key={colour}
            className="w-2.5 h-2.5 rounded-full animate-intro-light"
            style={{ background: colour, animationDelay: `${0.2 + i * 0.12}s` }}
          />
        ))}
        <span className="ml-3 font-mono text-[11px] text-charcoal-muted-deep">
          ~/riski · 404
        </span>
      </div>

      <div className="px-4 sm:px-6 py-5 sm:py-6 font-mono text-[12px] sm:text-sm leading-6 sm:leading-7">
        <AgentCall question={`Find ${target}`} />
        <div className="mt-3">
          <TraceLines steps={steps} shown={shown} results={results} />
        </div>

        <div
          className={`mt-4 pt-4 border-t border-white/5 items-baseline ${traceGrid} transition duration-500 ease-out ${
            answered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
          }`}
        >
          <span className="text-white">answer</span>
          <div>
            <h1 className="font-display text-xl sm:text-2xl leading-snug text-white">
              This page does not exist, but{" "}
              <span className="italic text-gradient-blue">the rest of the site does</span>.
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 font-sans">
              <Link
                href="/"
                tabIndex={answered ? 0 : -1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-medium hover:shadow-[0_0_30px_rgba(88,166,255,0.45)] transition-shadow"
              >
                <ArrowLeft size={14} />
                Back home
              </Link>
              <Link
                href="/#work"
                tabIndex={answered ? 0 : -1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-sm font-medium text-white hover:border-accent/60 hover:bg-accent/10 transition-colors"
              >
                See my work
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
