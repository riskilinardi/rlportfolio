"use client";

import { useState } from "react";
import { featuredSkills } from "@/data/skills";

export function SkillsMarquee() {
  const [paused, setPaused] = useState(false);

  const doubled = [...featuredSkills, ...featuredSkills];

  return (
    <section
      aria-label="Technical skills"
      className="relative py-16 border-y border-white/5 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-charcoal-bg to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-charcoal-bg to-transparent" />

      <div
        className="flex gap-12 whitespace-nowrap"
        style={{
          animation: "marquee2 30s linear infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-12 text-4xl md:text-6xl font-display text-charcoal-border-hi"
          >
            <span className="hover:text-accent transition-colors duration-300 cursor-default">
              {skill.name}
            </span>
            <span className="text-accent/40 text-3xl md:text-4xl">✦</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
