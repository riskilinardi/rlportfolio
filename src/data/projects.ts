import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "trackery",
    slug: "trackery",
    title: "Trackery",
    tagline:
      "A custom desktop inventory app built for real business operations.",
    description:
      "Led the full development cycle of a custom desktop inventory application built to solve specific business needs. Owned everything from gathering initial requirements and designing the system architecture to handling the final database deployment.",
    type: "desktop",
    category: "personal",
    year: 2025,
    featured: true,
    tech: [
      "React",
      "Node.js",
      "Electron",
      "PostgreSQL",
      "Zustand",
      "Tailscale",
    ],
    links: {},
    highlights: [
      "Built a responsive frontend using React and Electron, connecting directly to a remote PostgreSQL database for real-time inventory syncing.",
      "Set up a secure, zero-trust network using Tailscale so the client could safely access the system remotely without risking data exposure.",
      "Owned the full lifecycle: requirements → architecture → implementation → deployment.",
    ],
  },
  {
    id: "togethersafe",
    slug: "togethersafe",
    title: "TogetherSafe",
    tagline:
      "Cross-platform mobile app helping communities coordinate during emergencies.",
    description:
      "Solo-developed a cross-platform mobile application aimed at helping communities coordinate better during local emergencies. Handled the entire project independently from UI/UX design to backend services. Final Year Project for BSc (Hons) Computer Science, specialising in Machine Learning & AI.",
    type: "mobile",
    category: "university",
    year: 2026,
    featured: true,
    tech: ["Flutter", "Dart", "REST APIs"],
    links: {},
    highlights: [
      "Integrated REST APIs to push real-time emergency alerts and safety updates directly to users.",
      "Developed a smooth, easy-to-navigate interface in Flutter and Dart so users could access critical information instantly when it matters most.",
      "Solo-shipped: designed UI/UX, built frontend, and architected backend services end-to-end.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectsByCategory = {
  university: projects.filter((p) => p.category === "university"),
  freelance: projects.filter((p) => p.category === "freelance"),
  personal: projects.filter((p) => p.category === "personal"),
};
