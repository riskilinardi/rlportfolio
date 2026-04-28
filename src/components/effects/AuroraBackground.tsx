"use client";

import { useEffect, useState } from "react";

export function AuroraBackground() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
      return;
    }

    const handleVisibilityChange = () => {
      setAnimate(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const playState = animate ? "running" : "paused";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
    >
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 -top-48 -left-48 animate-aurora-1"
        style={{
          background: "radial-gradient(circle, #1f6feb 0%, transparent 70%)",
          animationPlayState: playState,
        }}
      />

      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 -bottom-24 -right-24 animate-aurora-2"
        style={{
          background: "radial-gradient(circle, #58a6ff 0%, transparent 70%)",
          animationPlayState: playState,
        }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-15 top-[40%] left-1/2 animate-aurora-3"
        style={{
          background: "radial-gradient(circle, #79c0ff 0%, transparent 70%)",
          animationPlayState: playState,
        }}
      />

      <div className="grain-overlay" />
      <div className="absolute inset-0 grid-overlay" />
    </div>
  );
}
