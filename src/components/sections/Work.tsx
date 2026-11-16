"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { usesTech } from "@/data/stack";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { scrollToId } from "@/lib/actions";
import type { Project } from "@/types";
import { CompactRow } from "./work/CompactRow";
import { ProjectCard } from "./work/ProjectCard";
import { StackFilter } from "./work/StackFilter";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const numberOf = (project: Project) => projects.indexOf(project) + 1;

export function Work() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const visible = selectedTech ? projects.filter((p) => usesTech(p, selectedTech)) : projects;
  const large = visible.filter((p) => p.size === "large");
  const compact = visible.filter((p) => p.size === "compact");

  const toggleTech = (tech: string) =>
    setSelectedTech((current) => (current === tech ? null : tech));

  return (
    <section id="work" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <Eyebrow file="projects.md" />
              <h2 className="text-4xl md:text-6xl text-white font-light font-display leading-tight">
                {`${NUMBER_WORDS[projects.length] ?? projects.length} things I've shipped.`}
              </h2>
            </div>
            <p className="text-charcoal-muted text-sm md:text-base max-w-sm leading-relaxed">
              Only got a minute? Start with{" "}
              <a
                href="#project-trackery"
                className="text-white underline decoration-accent/50 underline-offset-4 hover:decoration-accent transition-colors"
              >
                Trackery
              </a>
              . Everything else has a live demo or source code you can poke at.
            </p>
          </div>
        </Reveal>

        <StackFilter
          selected={selectedTech}
          matches={visible.length}
          onSelect={toggleTech}
          onClear={() => setSelectedTech(null)}
        />

        <div className="space-y-8">
          {large.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              number={numberOf(project)}
              reversed={i % 2 === 1}
              selectedTech={selectedTech}
              onSelectTech={(tech) => {
                toggleTech(tech);
                scrollToId("stack");
              }}
            />
          ))}

          {compact.length > 0 && (
            <div className={large.length > 0 ? "pt-6" : ""}>
              <div className="flex items-center justify-between gap-4 mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-charcoal-muted-deep">
                <span>{large.length > 0 ? "More projects" : ""}</span>
                {compact.length > 1 && (
                  <span aria-hidden="true" className="lg:hidden inline-flex items-center gap-1.5">
                    Swipe
                    <ArrowRight size={12} />
                  </span>
                )}
              </div>
              <CompactRow key={selectedTech ?? "all"} projects={compact} numberOf={numberOf} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
