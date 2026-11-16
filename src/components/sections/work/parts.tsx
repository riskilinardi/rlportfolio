"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import type { Project, ProjectMetric } from "@/types";

/** Gradient border. The hover state fades in a second layer, so it never repaints. */
export function CardFrame({ id, children }: { id: string; children: ReactNode }) {
  return (
    <article
      id={id}
      className="group relative h-full p-px rounded-3xl scroll-mt-24 bg-gradient-to-br from-accent/30 via-charcoal-border-hi/30 to-accent/30"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent via-accent-deep to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      {children}
    </article>
  );
}

export function ProjectLabel({
  project,
  number,
  compact = false,
}: {
  project: Project;
  number: number;
  compact?: boolean;
}) {
  // Each part carries its separator in a 1.5rem strip on its left. The row is
  // shifted left by that strip and clipped, so a dot that starts a line is hidden.
  return (
    <div className={`overflow-hidden ${compact ? "mb-3" : "mb-5"}`}>
      <div className="-ml-6 flex flex-wrap items-center gap-y-1.5 text-xs uppercase tracking-wider">
        <span className="pl-6 font-mono text-accent normal-case tracking-normal">
          / {String(number).padStart(2, "0")}
        </span>
        {project.label.map((part, i) => (
          <span key={part} className="inline-flex items-center">
            <span aria-hidden="true" className="w-6 text-center text-charcoal-muted-deep">
              {i > 0 ? "·" : ""}
            </span>
            {project.live && i === 0 ? (
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-medium">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
                </span>
                {part}
              </span>
            ) : (
              <span className="text-charcoal-muted-deep">{part}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Metric({ metric, compact = false }: { metric: ProjectMetric; compact?: boolean }) {
  if (compact) {
    return (
      <div className="mb-4">
        <div className="font-display font-light text-3xl text-accent-light leading-none whitespace-nowrap">
          {metric.value}
        </div>
        <div className="mt-1.5 text-xs text-charcoal-muted leading-snug">{metric.label}</div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-display font-light text-5xl md:text-6xl text-accent-light leading-none whitespace-nowrap">
        {metric.value}
      </span>
      <span className="text-sm text-charcoal-muted leading-snug max-w-xs">{metric.label}</span>
    </div>
  );
}

export function UnderTheHood({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-charcoal-muted hover:text-white transition-colors"
      >
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        Under the hood
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-3 pl-4 border-l border-accent/30 space-y-2">
              {points.map((point) => (
                <li key={point} className="text-[13px] text-charcoal-muted leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  const { live, github } = project.links ?? {};
  if (!live && !github) return null;
  const size = compact ? "px-4 py-2.5 text-xs" : "px-5 py-3 text-sm";
  const iconSize = compact ? 13 : 15;
  return (
    <div className="flex flex-wrap gap-3">
      {live && (
        <a
          href={live}
          target="_blank"
          rel="noopener noreferrer"
          className={`group/btn inline-flex items-center gap-2 rounded-full bg-white text-slate-900 font-medium hover:shadow-[0_0_30px_rgba(88,166,255,0.45)] transition-shadow ${size}`}
        >
          <ExternalLink size={iconSize} />
          Live demo
          <span className="sr-only"> of {project.title}</span>
          <ArrowUpRight size={iconSize} className="group-hover/btn:rotate-45 transition-transform" />
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 font-medium text-white hover:border-accent/60 hover:bg-accent/10 transition-colors ${size}`}
        >
          <GithubIcon size={iconSize} />
          Source
          <span className="sr-only"> code for {project.title}</span>
        </a>
      )}
    </div>
  );
}
