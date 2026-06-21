import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Riski Linardi",
  fullName: "Riski Linardi",
  tagline: "Engineering intelligent systems from concept to production.",
  description:
    "Fresh Computer Science graduate specialising in Machine Learning and AI. I like building things end-to-end, from quick prototypes to polished, deployed products that real people use.",
  url: "https://riskilinardi.vercel.app",

  location: "Singapore",
  availableForWork: true,
  currentStatus: "Fresh Graduate · BSc (Hons) CS · SIM UOL",

  email: "riskilinardi@gmail.com",
  responseTime: "Usually replies within a few days",

  socials: [
    {
      platform: "github",
      url: "https://github.com/riskilinardi",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/riski-linardi-248456190/",
      label: "LinkedIn",
    },
    {
      platform: "email",
      url: "mailto:riskilinardi@gmail.com",
      label: "Email",
    },
  ],

  stats: [
    { value: "6+", label: "Projects shipped" },
    { value: "6+", label: "Years coding" },
    { value: "5", label: "Awards & honors" },
  ],

  bio: [
    "I'm a recent Computer Science graduate from SIM UOL, specialising in Machine Learning and AI. I like working across the whole stack, from the database up to the interface, and seeing how the parts fit together.",
    "I got my start at NEC Asia Pacific, where I helped migrate a legacy enterprise system to Azure. Later, I came back on contract to rework the SQL schemas and fix bulk-insert bottlenecks for over 100,000 records. Tracking down why those large uploads were so slow, and fixing it at the query and schema level, taught me that how you structure the data matters as much as the code that uses it. I also pushed hard to keep my academic performance consistent, earning the IRAS Book Prize (Gold in 2024, Silver in 2025).",
    "Outside of work, I build end-to-end applications. My recent projects range from Trackery (a custom React/Node.js desktop inventory system) and TogetherSafe (a cross-platform emergency app) to a fine-tuned BERT classifier and a RAG app I built from scratch. I like working across the entire stack because it lets me take an idea and ship it as a complete, polished product.",
  ],

  photo: "/me.png",
};
