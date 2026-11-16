import type { TraceStep } from "@/components/trace/Trace";
import { projects } from "@/data/projects";

// Shared by the intro and the link preview image (opengraph-image.tsx).

export const INTRO_QUESTION = "Who is Riski Linardi?";

export const INTRO_STEPS: TraceStep[] = [
  { label: "plan", call: "find education, work and projects" },
  {
    label: "tool",
    call: 'search("education")',
    result: "BSc Computer Science, First Class Honours",
  },
  { label: "tool", call: 'search("work")', result: "NEC Asia Pacific" },
  {
    label: "tool",
    call: 'search("projects")',
    result: `${projects.length} shipped · Trackery live in production`,
  },
  { label: "check", call: "every claim has a source", result: "✓" },
];

/**
 * The evidence cards beside the terminal, one per tool step, cited by the
 * answer as [1] [2] [3]. At the handoff each card flies into the hero parts it
 * backs up: `targets` are `data-intro-target` values in the Hero ("stat-N" is
 * the Nth of siteConfig.stats). `colour` is used for everything that card
 * touches: its search light, its particles and its citation.
 */
export const INTRO_SOURCES = [
  {
    kind: "education",
    file: "education.md",
    title: "BSc Computer Science",
    detail: "First Class Honours · Machine Learning and AI",
    targets: ["honours"],
    colour: [138, 212, 235],
  },
  {
    kind: "work",
    file: "experience.md",
    title: "NEC Asia Pacific",
    detail: "Intern, then contract · 2020 to 2021",
    targets: ["stat-2"],
    colour: [184, 170, 245],
  },
  {
    kind: "projects",
    file: "projects.md",
    title: `${projects.length} projects shipped`,
    detail: "Trackery · live in production",
    targets: ["stat-0", "stat-1", "stat-3"],
    colour: [140, 222, 184],
  },
] as const;

/** The answer, which is also the hero headline. */
export const INTRO_ANSWER = {
  before: "I build ",
  highlight: "full-stack and AI apps",
  after: " that real people use.",
};
