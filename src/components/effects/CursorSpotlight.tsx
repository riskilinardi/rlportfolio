"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Write the position to CSS variables once per frame instead of
    // re-rendering React on every mouse move.
    let frame = 0;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--spot-x", `${e.clientX}px`);
        el.style.setProperty("--spot-y", `${e.clientY}px`);
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 hidden md:block"
      style={{
        background:
          "radial-gradient(600px circle at var(--spot-x, -500px) var(--spot-y, -500px), rgba(88, 166, 255, 0.08), transparent 50%)",
      }}
    />
  );
}
