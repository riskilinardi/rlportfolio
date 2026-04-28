import type { Skill } from "@/types";

export const skills: Skill[] = [
  { name: "Python", category: "language", featured: true },
  { name: "JavaScript", category: "language", featured: true },
  { name: "C#", category: "language", featured: true },
  { name: "Dart", category: "language", featured: true },
  { name: "Java", category: "language" },
  { name: "C++", category: "language" },
  { name: "SQL", category: "language" },

  { name: "React", category: "framework", featured: true },
  { name: "Node.js", category: "framework", featured: true },
  { name: "Electron", category: "framework", featured: true },
  { name: "Flutter", category: "framework", featured: true },
  { name: "Zustand", category: "framework" },
  { name: "ASP.NET", category: "framework" },
  { name: "Bootstrap", category: "framework" },

  { name: "PyTorch", category: "framework", featured: true },
  { name: "TensorFlow", category: "framework", featured: true },
  { name: "Hugging Face", category: "framework", featured: true },
  { name: "Scikit-Learn", category: "framework" },
  { name: "Keras", category: "framework" },
  { name: "OpenCV", category: "framework" },
  { name: "NLTK", category: "framework" },
  { name: "spaCy", category: "framework" },
  { name: "NumPy", category: "framework" },
  { name: "Pandas", category: "framework" },

  { name: "PostgreSQL", category: "database", featured: true },

  { name: "Git", category: "tool" },
  { name: "Jupyter", category: "tool" },
  { name: "Azure", category: "cloud" },
];

export const featuredSkills = skills.filter((s) => s.featured);

export const skillsByCategory = {
  languages: skills.filter((s) => s.category === "language"),
  frameworks: skills.filter((s) => s.category === "framework"),
  databases: skills.filter((s) => s.category === "database"),
  tools: skills.filter((s) => s.category === "tool"),
  cloud: skills.filter((s) => s.category === "cloud"),
};
