export type ProjectType =
  | "web"
  | "mobile"
  | "desktop"
  | "ai"
  | "game"
  | "other";

export type ProjectCategory = "university" | "freelance" | "personal";

export interface ProjectLinks {
  live?: string;
  github?: string;
  demo?: string;
  caseStudy?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  year: number;
  featured?: boolean;
  tech: string[];
  links?: ProjectLinks;
  image?: string;
  highlights?: string[];
}

export type SkillCategory =
  | "language"
  | "framework"
  | "tool"
  | "design"
  | "database"
  | "cloud";

export interface Skill {
  name: string;
  category: SkillCategory;
  featured?: boolean;
}

export type ExperienceType = "work" | "education" | "freelance";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string;
  tech?: string[];
  type: ExperienceType;
}

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "email"
  | "twitter"
  | "instagram"
  | "dribbble";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  url: string;
  location: string;
  availableForWork: boolean;
  currentStatus: string;
  email: string;
  responseTime?: string;
  socials: SocialLink[];
  stats: Stat[];
  bio: string[];
  photo?: string;
}
