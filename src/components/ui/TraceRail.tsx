"use client";

import { useEffect, useState } from "react";

/*
 * A thin rail on the left (wide screens) with a dot per section. The section
 * in the middle of the screen is lit, the line fills as you scroll (a CSS
 * scroll-driven animation, see .trace-rail-fill), and each dot jumps to its
 * section.
 */

const RAIL = [
  { id: "home", title: "Intro" },
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
] as const;

export function TraceRail() {
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    // A section is "current" while it crosses a thin band across the middle
    // of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of RAIL) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  const activeIndex = RAIL.findIndex((item) => item.id === active);

  return (
    <nav
      aria-label="Page sections"
      className="hidden xl:block fixed left-5 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="relative flex flex-col gap-6">
        <span aria-hidden="true" className="absolute left-[4px] top-1 bottom-1 w-px bg-white/10" />
        <span
          aria-hidden="true"
          className="trace-rail-fill absolute left-[4px] top-1 bottom-1 w-px bg-accent/60 origin-top"
        />
        {RAIL.map((item, i) => {
          const isActive = i === activeIndex;
          const reached = i <= activeIndex;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-label={item.title}
              aria-current={isActive ? "location" : undefined}
              className="group relative flex items-center gap-3 outline-none"
            >
              <span
                className={`relative w-[9px] h-[9px] rounded-full border transition-colors duration-300 ${
                  reached ? "bg-accent border-transparent" : "bg-charcoal-bg border-white/25"
                } ${isActive ? "ring-4 ring-accent/15" : ""} group-focus-visible:ring-4 group-focus-visible:ring-accent/40`}
              />
              {/* Labels show on hover or focus; the current one stays visible
                  on very wide screens, where it cannot cover the content. */}
              <span
                aria-hidden="true"
                className={`font-mono text-[10px] whitespace-nowrap px-2 py-0.5 rounded-md bg-charcoal-bg/90 border border-white/5 text-charcoal-muted transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                  isActive ? "opacity-0 2xl:opacity-100 text-white" : "opacity-0"
                }`}
              >
                {item.title}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
