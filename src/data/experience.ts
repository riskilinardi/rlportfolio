import type { ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "sim-uol-degree",
    role: "BSc (Hons) Computer Science — Machine Learning & AI",
    company: "Singapore Institute of Management (UOL)",
    location: "Singapore",
    period: "Apr 2023 — Apr 2026",
    description:
      "Focused my studies on Machine Learning and AI while building full-stack and mobile projects on the side, like my Flutter capstone, TogetherSafe. I worked hard to keep my grades up alongside my coding projects and was awarded the IRAS Book Prize twice (Gold in 2024, Silver in 2025).",
    type: "education",
  },
  {
    id: "nec-assistant-engineer",
    role: "Assistant Engineer",
    company: "NEC Asia Pacific Pte Ltd",
    location: "Singapore",
    period: "Feb 2021 — Apr 2021",
    description:
      "NEC brought me back on contract to fix the database bottlenecks we hit after the initial launch. I rewrote the SQL queries and adjusted the schema to handle massive data uploads smoothly. I also built a companion Flutter app so the staff could check inventory straight from their phones.",
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
      "I led a small intern team to build a C# inventory system from scratch, replacing the department's old Excel sheets in just five months. We handled the entire process ourselves, from gathering requirements from the admin staff to deploying the system on Azure and loading in 100,000+ rows of legacy data.",
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
      "This is where I got my start in programming. Beyond my classes (where I made the 2018 Director's Roll of Honour), I spent a lot of time testing my skills in hackathons. I took 1st Runner-up at both the PolyFinTech100 Hackathon and the vSplash Awards, where I pitched an early computer vision prototype.",
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
