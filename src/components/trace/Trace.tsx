"use client";

import { useEffect, useState } from "react";

/*
 * The agent trace shared by the intro, Ask my portfolio and the 404 page: an
 * agent.run("…") call, then plan / tool / check lines with results. Every line
 * is rendered up front and only fades in, so the layout never shifts.
 */

/** The coloured window controls of the terminal windows. */
export const WINDOW_LIGHTS = ["#ff5f57", "#febc2e", "#28c840"];

export type TraceLabel = "plan" | "tool" | "check";

export interface TraceStep {
  label: TraceLabel;
  call: string;
  result?: string;
  /** A check that did not pass (shown in red with a cross). */
  failed?: boolean;
}

export const traceLabelColour: Record<TraceLabel | "answer", string> = {
  plan: "text-charcoal-muted-deep",
  tool: "text-accent",
  check: "text-emerald-400",
  answer: "text-white",
};

/** Shared grid so labels and content line up across every trace line. */
export const traceGrid =
  "grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4rem_1fr] gap-x-3";

function callTokens(question: string) {
  const tokens = [
    { text: "agent", className: "text-charcoal-text" },
    { text: ".", className: "text-charcoal-muted" },
    { text: "run", className: "text-[#d2a8ff]" },
    { text: "(", className: "text-charcoal-muted" },
    { text: `"${question}"`, className: "text-[#a5d6ff]" },
    { text: ")", className: "text-charcoal-muted" },
  ];
  return tokens.map((token, i) => ({
    ...token,
    start: tokens.slice(0, i).reduce((n, t) => n + t.text.length, 0),
  }));
}

export function agentCallLength(question: string) {
  return question.length + 'agent.run("")'.length;
}

/** `>>> agent.run("question")`, optionally typed out up to `typed` characters. */
export function AgentCall({
  question,
  typed,
}: {
  question: string;
  typed?: number;
}) {
  const total = agentCallLength(question);
  const shownCount = typed ?? total;
  return (
    <div className="break-words">
      <span className="text-accent">&gt;&gt;&gt; </span>
      {callTokens(question).map((token) => (
        <span key={token.start} className={token.className}>
          {token.text.slice(0, Math.max(0, shownCount - token.start))}
        </span>
      ))}
      {shownCount < total && (
        <span className="inline-block w-[0.55em] h-[1.1em] align-[-0.15em] bg-accent-light/80 animate-blink" />
      )}
    </div>
  );
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>";

/**
 * Text that "decodes" into place: random characters resolve left to right.
 * In a monospace font every frame has the same width, so nothing shifts.
 */
export function DecodeText({
  text,
  active,
  duration = 420,
}: {
  text: string;
  active: boolean;
  duration?: number;
}) {
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const fixed = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        next +=
          i < fixed || text[i] === " "
            ? text[i]
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text, duration]);

  return <>{shown}</>;
}

/** The plan / tool / check lines. `shown` and `results` count how many have appeared. */
export function TraceLines({
  steps,
  shown,
  results,
}: {
  steps: TraceStep[];
  shown: number;
  results: number;
}) {
  return (
    <div className="space-y-0.5">
      {steps.map((step, i) => {
        const isShown = i < shown;
        const resultShown = i < results;
        const labelColour = step.failed ? "text-rose-400" : traceLabelColour[step.label];
        return (
          <div
            key={`${step.label}-${step.call}`}
            data-trace-row={i}
            className={`${traceGrid} transition duration-200 ease-out ${
              isShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            }`}
          >
            <span className={labelColour}>{step.label}</span>
            <span className="text-charcoal-muted">
              {step.call}{" "}
              {step.result && (
                <span className="relative">
                  {!resultShown && (
                    <span className="absolute left-0 top-0 text-charcoal-muted-deep animate-pulse">
                      …
                    </span>
                  )}
                  <span
                    className={`transition-opacity duration-200 ${
                      resultShown ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {step.label === "check" ? (
                      <span className={step.failed ? "text-rose-400" : "text-emerald-400"}>
                        {step.result}
                      </span>
                    ) : (
                      <>
                        <span className="text-charcoal-muted-deep">→</span>{" "}
                        <span className="text-charcoal-text">
                          <DecodeText text={step.result} active={resultShown} />
                        </span>
                      </>
                    )}
                  </span>
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
