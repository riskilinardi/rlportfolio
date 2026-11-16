"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/types";
import { CardFrame, Metric, ProjectLabel, ProjectLinks, UnderTheHood } from "./parts";

function CompactCard({ project, number }: { project: Project; number: number }) {
  const details = [...project.highlights, ...(project.underTheHood ?? [])];
  return (
    <CardFrame id={`project-${project.id}`}>
      <div className="relative h-full rounded-3xl p-5 md:p-6 flex flex-col bg-charcoal-surface">
        {project.image && (
          // A fixed shape, so the cards in a row line up.
          <div className="relative mb-5 aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-charcoal-bg">
            <Image
              src={project.image}
              alt={`${project.title} screenshot`}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 60vw, 30vw"
              className={project.type === "mobile" ? "object-contain" : "object-cover object-top"}
            />
          </div>
        )}
        <ProjectLabel project={project} number={number} compact />

        <h3 className="text-2xl md:text-3xl text-white font-light font-display mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-sm md:text-base text-white font-medium leading-snug text-pretty mb-5">
          {project.tagline}
        </p>

        {project.metric && <Metric metric={project.metric} compact />}
        {project.story && (
          <p className="text-sm text-charcoal-muted leading-relaxed mb-5">{project.story}</p>
        )}

        {details.length > 0 && <UnderTheHood points={details} />}

        <div className="mt-auto">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </CardFrame>
  );
}

/**
 * The compact cards: a swipeable, snapping row with position dots below lg,
 * and a three-column grid from lg up. Give it a `key` that changes with the
 * list, so a new list starts at its first card.
 */
export function CompactRow({ projects, numberOf }: { projects: Project[]; numberOf: (p: Project) => number }) {
  const rowRef = useRef<HTMLUListElement>(null);
  // Cards that are mostly in view (two at once on tablets).
  const [inView, setInView] = useState<boolean[]>(() => projects.map((_, i) => i === 0));

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const items = Array.from(row.children);
    const observer = new IntersectionObserver(
      (entries) => {
        setInView((current) => {
          const next = [...current];
          for (const entry of entries) {
            const index = items.indexOf(entry.target);
            if (index >= 0) next[index] = entry.intersectionRatio >= 0.6;
          }
          return next;
        });
      },
      { root: row, threshold: [0, 0.6, 1] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Scrolls the row, never the page.
  const showCard = (index: number) => {
    const row = rowRef.current;
    const card = row?.children[index] as HTMLElement | undefined;
    if (!row || !card) return;
    const padding = parseFloat(getComputedStyle(row).scrollPaddingLeft) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: card.offsetLeft - padding, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <ul
        ref={rowRef}
        aria-label="More projects"
        className="relative -mx-6 px-6 scroll-px-6 md:-mx-10 md:px-10 md:scroll-px-10 flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:snap-none"
      >
        {projects.map((project) => (
          <li key={project.id} className="shrink-0 w-[85%] sm:w-[60%] md:w-[45%] snap-start lg:w-auto">
            <CompactCard project={project} number={numberOf(project)} />
          </li>
        ))}
      </ul>

      {projects.length > 1 && (
        <div className="mt-4 flex justify-center lg:hidden">
          {projects.map((project, i) => (
            <button
              key={project.id}
              type="button"
              onClick={() => showCard(i)}
              aria-label={`Show ${project.title}`}
              aria-current={inView[i] ? "true" : undefined}
              className="p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  inView[i] ? "w-6 bg-accent" : "w-1.5 bg-white/25"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
