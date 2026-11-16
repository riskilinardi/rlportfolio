import Image from "next/image";
import { IMPLIED_TECH } from "@/data/stack";
import type { Project } from "@/types";
import { CardFrame, Metric, ProjectLabel, ProjectLinks, UnderTheHood } from "./parts";

function hostname(url?: string) {
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}

/** The screenshot, in a browser frame (phone screenshots bring their own frames). */
function ProjectVisual({ project }: { project: Project }) {
  if (!project.image || !project.imageSize) return null;
  const screenshot = (
    <Image
      src={project.image}
      alt={`${project.title} screenshot`}
      width={project.imageSize.width}
      height={project.imageSize.height}
      sizes="(max-width: 1024px) 100vw, 40vw"
      className="block w-full h-auto"
    />
  );

  if (project.type === "mobile") return <div className="rounded-xl overflow-hidden">{screenshot}</div>;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-charcoal-bg shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        <span className="w-2 h-2 rounded-full bg-white/10" />
        <span className="w-2 h-2 rounded-full bg-white/10" />
        <span className="w-2 h-2 rounded-full bg-white/10" />
        <span className="ml-2 font-mono text-[10px] text-charcoal-muted-deep truncate">
          {hostname(project.links?.live) ?? project.title}
        </span>
      </div>
      {screenshot}
    </div>
  );
}

/** A full-width project card, with the screenshot alternating sides. */
export function ProjectCard({
  project,
  number,
  reversed,
  selectedTech,
  onSelectTech,
}: {
  project: Project;
  number: number;
  reversed: boolean;
  selectedTech: string | null;
  onSelectTech: (tech: string) => void;
}) {
  // A chip lights up when it is the selected tool, or implies it (Next.js for React).
  const isSelected = (tag: string) =>
    selectedTech !== null &&
    (tag === selectedTech || (IMPLIED_TECH[selectedTech] ?? []).includes(tag));

  return (
    <CardFrame id={`project-${project.id}`}>
      <div
        className={`relative rounded-3xl p-6 md:p-10 grid gap-8 lg:gap-12 items-center bg-charcoal-surface ${
          reversed
            ? "lg:grid-cols-[2fr_3fr] lg:[&>div:first-child]:order-2"
            : "lg:grid-cols-[3fr_2fr]"
        }`}
      >
        <div>
          <ProjectLabel project={project} number={number} />

          <h3 className="text-3xl md:text-5xl text-white font-light font-display mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-lg md:text-xl text-white font-medium leading-snug text-pretty mb-6">
            {project.tagline}
          </p>

          {project.metric && <Metric metric={project.metric} />}

          <ul className="space-y-2.5 mb-6">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2.5 text-sm text-charcoal-muted leading-relaxed"
              >
                <span aria-hidden="true" className="mt-[0.55em] w-1 h-1 rounded-full bg-accent shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          {project.note && <p className="text-xs text-charcoal-muted-deep mb-6">{project.note}</p>}

          {project.underTheHood && <UnderTheHood points={project.underTheHood} />}

          <div className="flex flex-wrap gap-1.5 mb-7 last:mb-0">
            {project.tech.map((tag) => {
              const active = isSelected(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTech(tag)}
                  aria-pressed={active}
                  title={`Show projects that use ${tag}`}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-colors ${
                    active
                      ? "bg-accent text-slate-900 border-accent"
                      : "bg-accent/10 text-accent-light border-accent/20 hover:border-accent/60"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <ProjectLinks project={project} />
        </div>

        <div>
          <ProjectVisual project={project} />
        </div>
      </div>
    </CardFrame>
  );
}
