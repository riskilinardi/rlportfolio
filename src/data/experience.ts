import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "sim-uol-degree",
    role: "BSc (Hons) Computer Science — Machine Learning & AI",
    company: "Singapore Institute of Management (UOL)",
    location: "Singapore",
    period: "Apr 2023 — Apr 2026",
    description:
      "Specialised in Machine Learning and AI. Awarded the IRAS Book Prize twice (Gold in 2025, Silver in 2024) for top academic performance. Final Year Project: TogetherSafe — a cross-platform emergency coordination app built solo.",
    type: "education",
  },
  {
    id: "nec-assistant-engineer",
    role: "Assistant Engineer",
    company: "NEC Asia Pacific Pte Ltd",
    location: "Singapore",
    period: "Feb 2021 — Apr 2021",
    description:
      "Continued core development on the enterprise Inventory Management System following my internship. Focused on database query optimisation, feature development, and mobile app extension with an Agile team.",
    tech: ["Dart", "C#", "SQL", "ASP.NET"],
    type: "work",
  },
  {
    id: "nec-intern",
    role: "Application Developer — Intern",
    company: "NEC Asia Pacific Pte Ltd",
    location: "Singapore",
    period: "Sep 2020 — Jan 2021",
    description:
      "Core developer on an enterprise Inventory Management System. Optimised backend queries for a database handling 50,000+ active records, fixed concurrency bottlenecks, and developed new features following strict Clean Code practices.",
    tech: ["C#", "SQL", "ASP.NET"],
    type: "work",
  },
  {
    id: "republic-poly",
    role: "Diploma in Information Technology",
    company: "Republic Polytechnic",
    location: "Singapore",
    period: "Apr 2018 — Apr 2021",
    description:
      "Foundation in software engineering. Director's Roll of Honour (2018). Competed in PolyFinTech100 API Hackathon (1st Runner-up, 2020) and vSplash Awards (1st Runner-up, 2020 — Assurance: ML & computer vision for vehicle damage assessment).",
    type: "education",
  },
];

export const awards = [
  {
    title: "IRAS Book Prize — Silver Award",
    year: "2025",
    issuer: "IRAS",
  },
  {
    title: "IRAS Book Prize — Gold Award",
    year: "2024",
    issuer: "IRAS",
  },
  {
    title: "vSplash Awards — 1st Runner-up",
    year: "2020",
    issuer: "Singapore Computer Society (SCS)",
  },
  {
    title: "PolyFinTech100 API Hackathon — 1st Runner-up",
    year: "2020",
    issuer: "PolyFinTech",
  },
  {
    title: "Director's Roll of Honour",
    year: "2018",
    issuer: "Republic Polytechnic",
  },
];
