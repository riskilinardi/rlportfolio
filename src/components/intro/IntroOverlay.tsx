"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { INTRO_ANSWER, INTRO_QUESTION, INTRO_SOURCES } from "@/data/intro";
import { AgentCall, TraceLines, WINDOW_LIGHTS, traceGrid, traceLabelColour } from "@/components/trace/Trace";
import { introStore, useIntro } from "@/lib/intro";
import { rgba } from "@/lib/colour";
import { flyCardsIntoTargets, revealHeadline } from "./handoff";
import { IntroStatus } from "./IntroStatus";
import { SignalField, type SignalFieldHandle } from "./signal-field/SignalField";
import { SourceCard } from "./SourceCard";
import {
  ANSWER_AT,
  END_AT,
  FORM_AT,
  HANDOFF_AT,
  LAND_MS,
  STEPS,
  TOOL_STEPS,
  isVerified,
  progressAt,
  progressKey,
  type Progress,
} from "./timeline";

/*
 * The intro: an agent trace answering "Who is Riski Linardi?". Searches light
 * up the dot grid and fill the Source cards, the evidence forms the answer,
 * and at the handoff the answer paints the hero headline while each card flies
 * into the stat it backs up.
 *
 * It plays once per tab once fonts and the page have loaded (layout.tsx
 * decides before first paint), never with reduced motion; ?intro replays it.
 * Any click, key, scroll or tap skips to the handoff.
 */

const READY_PAUSE = 250;
const MAX_WAIT = 2500;
const STALL_MS = 250;

const centreOf = (rect: DOMRect): [number, number] => [
  rect.left + rect.width / 2,
  rect.top + rect.height / 2,
];

export function IntroOverlay() {
  const { phase } = useIntro();
  const [progress, setProgress] = useState<Progress>(() => progressAt(0));
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const answerTextRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const terminalDepthRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<SignalFieldHandle>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "skip") {
      introStore.set({ phase: "done" });
      return;
    }

    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      // Storage can be blocked; the intro then plays again next time.
    }

    introStore.set({ phase: "playing" });
    window.scrollTo(0, 0);
    root.style.overflow = "hidden";
    const unlockScroll = () => {
      root.style.overflow = "";
    };

    const cards = () =>
      Array.from(sourcesRef.current?.querySelectorAll<HTMLElement>("[data-source-card]") ?? []);
    const terminalCentre = (): [number, number] =>
      terminalRef.current ? centreOf(terminalRef.current.getBoundingClientRect()) : [0, 0];

    // Mouse parallax: the row tilts, and the cards drift further than the terminal.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const tilt = { x: 0, y: 0, targetX: 0, targetY: 0, mouseX: -9999, mouseY: -9999 };
    const onMouseMove = (e: MouseEvent) => {
      tilt.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      tilt.targetY = (e.clientY / window.innerHeight) * 2 - 1;
      tilt.mouseX = e.clientX;
      tilt.mouseY = e.clientY;
    };
    if (finePointer) window.addEventListener("mousemove", onMouseMove, { passive: true });

    const applyTilt = () => {
      tilt.x += (tilt.targetX - tilt.x) * 0.08;
      tilt.y += (tilt.targetY - tilt.y) * 0.08;
      if (rowRef.current) {
        rowRef.current.style.transform = `perspective(1400px) rotateX(${(-tilt.y * 3).toFixed(2)}deg) rotateY(${(tilt.x * 4).toFixed(2)}deg)`;
      }
      if (terminalDepthRef.current) {
        terminalDepthRef.current.style.transform = `translate3d(${(tilt.x * 6).toFixed(1)}px, ${(tilt.y * 6).toFixed(1)}px, 0)`;
      }
      if (sourcesRef.current) {
        sourcesRef.current.style.transform = `translate3d(${(tilt.x * 16).toFixed(1)}px, ${(tilt.y * 14).toFixed(1)}px, 0)`;
      }
      const terminal = terminalRef.current?.getBoundingClientRect();
      if (sheenRef.current && terminal) {
        sheenRef.current.style.transform = `translate3d(${(tilt.mouseX - terminal.left).toFixed(0)}px, ${(tilt.mouseY - terminal.top).toFixed(0)}px, 0)`;
      }
    };
    const resetTilt = () => {
      for (const el of [rowRef.current, terminalDepthRef.current, sourcesRef.current]) {
        if (el) el.style.transform = "";
      }
      if (sheenRef.current) sheenRef.current.style.opacity = "0";
    };

    fieldRef.current?.setOccluders([terminalRef.current, ...cards()]);

    /** Sends the field the events between two progress states. */
    const signal = (before: Progress, after: Progress) => {
      const field = fieldRef.current;
      if (!field) return;
      for (let i = before.steps; i < after.steps; i++) {
        if (STEPS[i].label !== "tool") continue;
        const source = TOOL_STEPS.indexOf(i);
        const card = cards()[source]?.getBoundingClientRect();
        // On phones there are no cards, so the light goes into the terminal.
        const target = card && card.width > 0 ? card : terminalRef.current?.getBoundingClientRect();
        if (target) field.search(terminalCentre(), target, LAND_MS, INTRO_SOURCES[source]?.colour);
      }
      for (let i = before.results; i < after.results; i++) {
        if (STEPS[i].label === "check") field.check(terminalCentre());
      }
      if (!before.form && after.form && answerTextRef.current) {
        field.form(answerTextRef.current, ANSWER_AT - FORM_AT, {
          sources: INTRO_SOURCES.map((source, i) => ({
            rect: cards()[i]?.getBoundingClientRect() ?? new DOMRect(),
            colour: source.colour,
          })),
          // Hidden, but already in its resting place.
          headline: document.querySelector<HTMLElement>("#home h1"),
        });
      }
    };

    const handOff = (current: Progress) => {
      resetTilt();
      const painted = fieldRef.current?.release() ?? false;
      const headline = document.querySelector<HTMLElement>("#home h1");
      // Start every animation first, then tell the Hero (which re-renders after)
      // which parts the intro is already animating.
      introStore.set({
        phase: "handoff",
        headlineFromIntro: headline ? revealHeadline(headline, painted, answerRef.current) : false,
        targetsFromIntro: isVerified(current) && flyCardsIntoTargets(cards()),
      });
      unlockScroll();
    };

    let cancelled = false;
    let started = false;
    let start = 0;
    let frame = 0;
    let lastFrameAt = 0;
    let handedOff = false;
    let skipped = false;
    let last = progressAt(0);

    const tick = (now: number) => {
      // A stall (a busy device, a hidden tab) pauses the intro instead of skipping ahead.
      if (lastFrameAt && now - lastFrameAt > STALL_MS) start += now - lastFrameAt - 1000 / 60;
      lastFrameAt = now;
      const t = now - start;
      const next = progressAt(t);
      if (progressKey(next) !== progressKey(last)) {
        // After a skip, go straight to the handoff without replaying every search.
        if (!skipped) signal(last, next);
        last = next;
        setProgress(next);
      }

      if (!handedOff && finePointer) applyTilt();
      if (!handedOff && t >= HANDOFF_AT) {
        handedOff = true;
        handOff(last);
      }
      if (t >= END_AT) {
        introStore.set({ phase: "done" });
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const begin = (offset = 0) => {
      if (cancelled || started) return;
      started = true;
      start = performance.now() - offset;
      setStartedAt(start);
      frame = requestAnimationFrame(tick);
    };

    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT));
    let pauseTimer = 0;
    Promise.race([Promise.all([document.fonts.ready, loaded]), timeout]).then(() => {
      pauseTimer = window.setTimeout(() => begin(), READY_PAUSE);
    });

    const skip = () => {
      skipped = true;
      if (!started) begin(HANDOFF_AT);
      else if (performance.now() - start < HANDOFF_AT) start = performance.now() - HANDOFF_AT;
    };
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    skipEvents.forEach((name) => window.addEventListener(name, skip, { passive: true }));

    return () => {
      cancelled = true;
      clearTimeout(pauseTimer);
      cancelAnimationFrame(frame);
      skipEvents.forEach((name) => window.removeEventListener(name, skip));
      window.removeEventListener("mousemove", onMouseMove);
      unlockScroll();
    };
  }, []);

  if (phase === "done") return null;

  const leaving = phase === "handoff";
  const verified = isVerified(progress);
  const pouring = progress.form && !progress.answer && !leaving;
  // The glow behind the terminal builds as the evidence comes in.
  const glow = 0.35 + 0.65 * (progress.results / STEPS.length);

  return (
    <div
      id="intro"
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6 overflow-hidden ${
        leaving ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      {/* 0.999, not 1: a fully opaque layer lets Chrome skip drawing the page
          underneath, which then all had to be drawn in the handoff's first frame. */}
      <motion.div
        className="absolute inset-0 bg-charcoal-bg"
        initial={false}
        animate={{ opacity: leaving ? 0 : 0.999 }}
        transition={{ duration: 1.1, delay: leaving ? 0.2 : 0, ease: [0.45, 0, 0.55, 1] }}
      >
        {/* CSS fallback grid, hidden once the WebGL field is drawing. */}
        <div
          className="intro-dot-grid absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse at 50% 45%, black 15%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 15%, transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: glow,
            background: "radial-gradient(ellipse at 50% 45%, rgba(31,111,235,0.24) 0%, transparent 60%)",
          }}
        />
        {leaving && (
          // Smaller on phones, where most of it would be off screen anyway.
          <div
            className="absolute left-1/2 top-1/2 w-[44rem] h-[44rem] -ml-[22rem] -mt-[22rem] md:w-[70rem] md:h-[70rem] md:-ml-[35rem] md:-mt-[35rem] rounded-full animate-intro-bloom"
            style={{
              background:
                "radial-gradient(circle, rgba(121,192,255,0.32) 0%, rgba(31,111,235,0.14) 32%, transparent 62%)",
            }}
          />
        )}
        <div className="absolute bottom-6 inset-x-0 text-center font-mono text-[11px] text-charcoal-muted-deep">
          <span className="hidden sm:inline">Click or press any key to skip</span>
          <span className="sm:hidden">Tap to skip</span>
        </div>
      </motion.div>

      <div
        ref={rowRef}
        className="relative flex items-stretch justify-center gap-5 w-full max-w-[66rem] will-change-transform"
      >
        <div ref={terminalDepthRef} className="w-full max-w-2xl">
          <motion.div
            initial={false}
            animate={leaving ? { opacity: 0, transform: "scale(1.04)" } : { opacity: 1, transform: "scale(1)" }}
            transition={{ duration: 0.75, ease: [0.45, 0, 0.55, 1] }}
          >
            <div
              ref={terminalRef}
              className="relative rounded-2xl border border-white/10 bg-charcoal-surface/95 shadow-[0_30px_120px_-20px_rgba(31,111,235,0.4)] overflow-hidden animate-intro-boot"
            >
              {/* Glass sheen that follows the mouse. */}
              <div
                ref={sheenRef}
                className="pointer-events-none absolute -left-[260px] -top-[260px] w-[520px] h-[520px] rounded-full transition-opacity duration-500"
                style={{
                  background: "radial-gradient(circle, rgba(121,192,255,0.07) 0%, transparent 60%)",
                  transform: "translate3d(-9999px, -9999px, 0)",
                }}
              />

              <div className="relative flex items-center gap-2 px-4 py-3 border-b border-white/5">
                {WINDOW_LIGHTS.map((colour, i) => (
                  <span
                    key={colour}
                    className="w-2.5 h-2.5 rounded-full animate-intro-light"
                    style={{ background: colour, animationDelay: `${0.35 + i * 0.12}s` }}
                  />
                ))}
                <span className="ml-3 font-mono text-[11px] text-charcoal-muted-deep">~/riski · python</span>
                <span className="ml-auto">
                  <IntroStatus startedAt={startedAt} done={progress.answer} />
                </span>
              </div>

              <div className="relative px-4 sm:px-6 py-5 sm:py-6 font-mono text-[12px] sm:text-sm leading-6 sm:leading-7">
                <AgentCall question={INTRO_QUESTION} typed={progress.typed} />
                <div className="mt-3">
                  <TraceLines steps={STEPS} shown={progress.steps} results={progress.results} />
                </div>

                {/* Fades only (no slide), so the particles land exactly on its letters. */}
                <div
                  ref={answerRef}
                  className={`mt-4 pt-4 border-t border-white/5 items-baseline ${traceGrid} transition-opacity duration-500 ease-out ${
                    progress.answer ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className={traceLabelColour.answer}>answer</span>
                  <div className="relative">
                    {progress.answer && <span aria-hidden="true" className="answer-glow" />}
                    <span
                      ref={answerTextRef}
                      className="relative font-display text-lg sm:text-[1.375rem] leading-snug text-white"
                    >
                      {INTRO_ANSWER.before}
                      <span
                        className={`italic ${progress.answer ? "text-shimmer animate-text-shimmer" : "text-gradient-blue"}`}
                      >
                        {INTRO_ANSWER.highlight}
                      </span>
                      {INTRO_ANSWER.after}
                    </span>
                    <div className="hidden lg:block mt-1 text-[11px] text-charcoal-muted-deep">
                      cites
                      {INTRO_SOURCES.map((source, i) => (
                        <span key={source.file} style={{ color: rgba(source.colour, 1) }}>
                          {" "}[{i + 1}]
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div ref={sourcesRef} className="hidden lg:flex w-72 shrink-0 flex-col justify-center gap-3">
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal-muted-deep transition-opacity duration-300 ${
              leaving ? "opacity-0" : ""
            }`}
          >
            <span className="inline-block animate-intro-boot" style={{ animationDelay: "0.2s" }}>
              Sources
            </span>
          </div>
          {INTRO_SOURCES.map((source, i) => (
            <SourceCard
              key={source.file}
              index={i}
              arrived={progress.cards > i}
              verified={verified}
              pouring={pouring}
              leaving={leaving}
            />
          ))}
        </div>
      </div>

      {/* Above the content: dots avoid the terminal and cards, particles can land on the answer. */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <SignalField ref={fieldRef} />
      </div>
    </div>
  );
}
