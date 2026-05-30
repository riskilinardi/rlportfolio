import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "trackery",
    image: "/trackery.png",
    slug: "trackery",
    title: "Trackery",
    tagline:
      "A custom desktop inventory app built for real business operations.",
    description:
      "Led the full development cycle of a custom desktop inventory application built to solve specific business needs. Owned everything from gathering initial requirements and designing the system architecture to handling the final database deployment.",
    type: "desktop",
    category: "personal",
    year: 2026,
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
    id: "fakenews-bert",
    image: "/FakeNewsBert.png",
    slug: "fakenews-bert",
    title: "Fake News Classifier",
    tagline: "Fine-tuned BERT with explainability, deployed end-to-end.",
    description:
      "A full-stack fake-news classifier built around a fine-tuned BERT model. Users paste a statement and get back a verdict, confidence score, per-class probabilities, and the individual tokens that pushed the model toward its decision. Compared five model architectures from Naive Bayes to BERT+metadata to identify where the real bottleneck lies.",
    type: "ai",
    category: "personal",
    year: 2026,
    featured: true,
    tech: [
      "PyTorch",
      "BERT",
      "Hugging Face",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "Docker",
    ],
    links: {
      live: "https://fakenewsbert-rl.vercel.app/",
      github: "https://github.com/riskilinardi/fake-news-bert",
    },
    highlights: [
      "Fine-tuned bert-base-uncased on the PolitiFact dataset (~21,000 statements) and compared 5 model architectures, finding the accuracy ceiling lies with the task, not the model capacity.",
      "Implemented token-level explainability using integrated gradients (more reliable than raw attention per Jain & Wallace 2019), so users can see which words influenced the prediction.",
      "Built a true microservice split: FastAPI backend on Hugging Face Spaces, Next.js frontend on Vercel, model hosted on HF Hub, each component deployable independently.",
      "Production-grade concerns: per-IP rate limiting, CORS-locked endpoints, pytest with fast unit tests using a fake classifier and opt-in integration tests against the real model.",
    ],
  },
  {
    id: "howlennz",
    slug: "howlennz",
    title: "Howlennz Portfolio",
    tagline: "A fast, self-managed portfolio for a Live2D artist.",
    description:
      "Lennz is a Live2D artist who was running his portfolio on a Carrd page that loaded slowly and gave him no real way to manage his own content. I rebuilt it as a Next.js site backed by Sanity, so he can update his gallery, commissions, and about page himself without ever touching code.",
    type: "web",
    category: "personal",
    year: 2026,
    featured: true,
    tech: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS", "Netlify"],
    links: {
      live: "https://howlennz.netlify.app/",
    },
    image: "/howlennz.png",
    highlights: [
      "Replaced a slow Carrd page with a Next.js 14 site that loads in a fraction of the time, giving Lennz a much more professional first impression for potential commission clients.",
      "Designed the content model in Sanity so Lennz can manage his gallery, work history, and contact details himself, no developer involvement needed for content updates.",
      "Debugged a Cloudflare Pages and Sanity edge-runtime incompatibility mid-deployment and migrated the project to Netlify, getting the site live without compromising on stack choices.",
    ],
  },
  {
    id: "togethersafe",
    image: "/togethersafe.png",
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
    links: { github: "https://github.com/riskilinardi/TogetherSafe" },
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
