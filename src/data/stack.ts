import type { Project } from "@/types";

/** Tools offered as filters above the projects. Only those a project uses are shown. */
export const STACK_FILTERS = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "FastAPI",
  "PostgreSQL",
  "LangGraph",
  "PyTorch",
  "Hugging Face",
  "Docker",
  "Flutter",
];

/** Filtering by a tool also finds projects built on it: Next.js is React, FastAPI is Python. */
export const IMPLIED_TECH: Record<string, string[]> = {
  React: ["Next.js"],
  Python: ["FastAPI", "PyTorch", "LangGraph", "Pydantic", "pytest"],
};

export function usesTech(project: Project, tech: string) {
  return (
    project.tech.includes(tech) ||
    (IMPLIED_TECH[tech] ?? []).some((implied) => project.tech.includes(implied))
  );
}
