import type { Award, ExperienceItem } from "@/types";

export const experience: ExperienceItem[] = [
  {
    id: "since-graduating",
    role: "Personal and freelance projects",
    period: "Apr 2026 to now",
    description:
      "Since graduating, I've kept building to sharpen my skills while I look for my next role. The biggest so far is Trackery.",
    type: "projects",
  },
  {
    id: "sim-uol-degree",
    role: "BSc (Hons) Computer Science, First Class Honours",
    company: "University of London – Singapore Institute of Management",
    period: "Apr 2023 to Apr 2026",
    description:
      "I specialised in Machine Learning and AI. My final year project was TogetherSafe, an emergency preparedness app I built solo in Flutter.",
    type: "education",
  },
  {
    id: "nec-assistant-engineer",
    role: "Assistant Engineer (Contract)",
    company: "NEC Asia Pacific Pte Ltd",
    location: "Singapore",
    period: "Feb 2021 to Apr 2021",
    description:
      "Back on contract, I fixed slow bulk uploads that only showed up at production scale. I also built a Flutter app so floor staff could use the system on their phones.",
    tech: ["C#", "SQL", "ASP.NET Core", "Flutter"],
    type: "work",
  },
  {
    id: "nec-intern",
    role: "Application Developer (Intern)",
    company: "NEC Asia Pacific Pte Ltd",
    location: "Singapore",
    period: "Sep 2020 to Jan 2021",
    description:
      "I led a team of interns to build a C# inventory system in five months, with approvals, access control and a live dashboard, hosted on Azure. We also moved over 100,000 rows of old records into it.",
    tech: ["C#", "SQL", "ASP.NET Core", "Azure"],
    type: "work",
  },
  {
    id: "republic-poly",
    role: "Diploma in Information Technology",
    company: "Republic Polytechnic",
    location: "Singapore",
    period: "Apr 2018 to Apr 2021",
    description:
      "This is where I started coding, and where I spent a lot of my time testing my skills at hackathons.",
    type: "education",
  },
];

export const awards: Award[] = [
  {
    title: "IRAS Book Prize · Silver Award",
    year: "2025",
    issuer: "IRAS",
    detail: "One of the top scorers again, in Year 2",
  },
  {
    title: "IRAS Book Prize · Gold Award",
    year: "2024",
    issuer: "IRAS",
    detail: "One of the top scorers across the whole cohort, all majors, in Year 1",
  },
  {
    title: "vSplash Awards · First Runner-up",
    year: "2020",
    issuer: "Singapore Computer Society",
  },
  {
    title: "PolyFinTech100 API Hackathon · First Runner-up",
    year: "2020",
    issuer: "PolyFinTech",
  },
  {
    title: "Director's Roll of Honour",
    year: "2018",
    issuer: "Republic Polytechnic",
  },
];
