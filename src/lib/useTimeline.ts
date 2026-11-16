import { useEffect, useState } from "react";

/**
 * Counts how many of the given moments (ms after mount, ascending) have passed.
 * It only re-renders when that count changes, not on every animation frame.
 * With reduced motion, every moment counts as passed straight away.
 */
export function useTimeline(times: readonly number[]) {
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = reduce ? -Infinity : performance.now();
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const t = now - start;
      let n = last;
      while (n < times.length && times[n] <= t) n++;
      if (n !== last) {
        last = n;
        setReached(n);
      }
      if (n < times.length) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [times]);

  return reached;
}

/** Moments for a trace: each step, then its result, then the answer. */
export function traceTimes(stepCount: number, gap = 220, resultDelay = 120) {
  const times: number[] = [];
  for (let i = 0; i < stepCount; i++) {
    times.push(150 + i * gap, 150 + i * gap + resultDelay);
  }
  times.push(150 + stepCount * gap + 80);
  return times;
}
