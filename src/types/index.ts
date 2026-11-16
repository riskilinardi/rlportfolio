export type ProjectType = "web" | "mobile" | "desktop" | "ai";

export interface ProjectLinks {
  live?: string;
  github?: string;
}

/** A number or outcome shown large on the card. */
export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  /** Label parts shown above the title, joined with a middle dot. */
  label: string[];
  /** Highlights the first label part as live in production. */
  live?: boolean;
  /** Large projects get a full-width card; compact ones share a row. */
  size: "large" | "compact";
  type: ProjectType;
  tagline: string;
  metric?: ProjectMetric;
  /** One line under the metric. Compact cards only. */
  story?: string;
  /** Short bullets. Compact cards fold them into "Under the hood". */
  highlights: string[];
  note?: string;
  underTheHood?: string[];
  tech: string[];
  links?: ProjectLinks;
  /** Screenshot path, plus its real size so the frame keeps its shape. */
  image?: string;
  imageSize?: { width: number; height: number };
}

export type ExperienceType = "work" | "education" | "projects";

export interface ExperienceItem {
  id: string;
  role: string;
  company?: string;
  location?: string;
  period: string;
  description: string;
  tech?: string[];
  type: ExperienceType;
}

export interface Award {
  title: string;
  year: string;
  issuer: string;
  detail?: string;
}

export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Shows a pulsing green dot beside the value. */
  live?: boolean;
  href?: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  location: string;
  availableForWork: boolean;
  /** The headline fact in the hero's short version. */
  currentStatus: string;
  school: string;
  email: string;
  resume: string;
  socials: SocialLink[];
  stats: Stat[];
  bio: string[];
  photo: string;
}
