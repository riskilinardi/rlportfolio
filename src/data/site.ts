import type { SiteConfig } from "@/types";
import { projects } from "@/data/projects";

export const siteConfig: SiteConfig = {
  name: "Riski Linardi",
  description:
    "Riski Linardi is a software engineer in Singapore who builds full-stack and AI apps. First Class Honours in Computer Science.",
  url: "https://riskilinardi.dev",

  location: "Singapore",
  availableForWork: true,
  currentStatus: "First Class Honours, Computer Science",
  school: "University of London – Singapore Institute of Management",

  email: "riskilinardi@gmail.com",
  resume: "/Riski_Linardi_Resume.pdf",

  socials: [
    { platform: "github", url: "https://github.com/riskilinardi", label: "GitHub" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/riski-linardi", label: "LinkedIn" },
    { platform: "email", url: "mailto:riskilinardi@gmail.com", label: "Email" },
  ],

  stats: [
    { value: String(projects.length), label: "Projects shipped" },
    { value: "Live", label: "App a business runs on daily", live: true },
    { value: "100,000+", label: "Rows of data migrated at NEC" },
    {
      value: String(projects.filter((p) => p.links?.live).length),
      label: "Live demos you can try",
      href: "#work",
    },
  ],

  bio: [
    "I got into software because I like building things that are actually useful: tools that take the repetitive work off someone's plate, so their day runs a little smoother.",
    "My first taste of that was at NEC, where our inventory system replaced a team's spreadsheets. It's still the part of the job I enjoy most.",
    "Away from the keyboard, I bake. I started baking with my sister, and these days I mostly bake to feed my close friends.",
  ],

  photo: "/me.webp",
};
