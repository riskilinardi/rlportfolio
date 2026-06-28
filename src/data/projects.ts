import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "trackery",
    image: "/trackery.png",
    slug: "trackery",
    title: "Trackery",
    tagline: "A desktop inventory system I built for a family business.",
    description:
      "A desktop inventory app I built for a family business, replacing their pen-and-paper purchase orders and sales tracking. I designed the PostgreSQL schema around how they actually work day-to-day, then built the React and Node.js app to be something they could rely on without a developer on call.",
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
      "Built the frontend with React and Electron, wired to a remote PostgreSQL database so inventory stays in sync in real time.",
      "Set up a zero-trust network with Tailscale so the business could access the system from anywhere without exposing the database to the public internet.",
      "Replaced a manual pen-and-paper workflow with a proper system they can trust for daily purchase orders and sales tracking.",
    ],
  },
  {
    id: "let-it-cook",
    slug: "let-it-cook",
    title: "Let It Cook",
    tagline:
      "An AI research agent that plans its approach, picks the right tool for each step, and checks its own work, with every step shown.",
    description:
      "My follow-up to Pull The Receipts, moving from retrieval into agents. Instead of answering in one pass, it plans an approach, picks between web search, document retrieval, and a calculator, then reviews its own draft before answering. I built the reasoning loop by hand in LangGraph so every step is visible, and the interface streams it live as the agent plans, picks tools, and corrects itself.",
    type: "ai",
    category: "personal",
    year: 2026,
    featured: true,
    tech: [
      "LangGraph",
      "LangChain",
      "Gemini",
      "ChromaDB",
      "FastAPI",
      "Next.js",
      "Docker",
    ],
    links: {
      live: "https://letitcook-rl.vercel.app/",
      github: "https://github.com/riskilinardi/let-it-cook",
    },
    image: "/letitcook.png",
    highlights: [
      "Built the agent in LangGraph around the four core agentic patterns: planning, tool use, memory, and reflection, all as a custom stateful graph.",
      "Gave it three tools and let it choose between them with function calling: web search, document retrieval over local embeddings, and a calculator parsed from an AST so it can't run arbitrary code.",
      "Added a self-correction loop where the agent grades its own draft and revises when it falls short, with hard caps so it always terminates.",
      "Streamed the agent's reasoning live to a Next.js frontend, with rate limiting to keep API costs in check and LangSmith tracing for observability.",
    ],
  },
  {
    id: "pull-the-receipts",
    slug: "pull-the-receipts",
    title: "Pull The Receipts",
    tagline:
      "Source-grounded document Q&A that won't answer without showing its receipts.",
    description:
      "A retrieval-augmented generation app that answers only from the documents you give it, citing the exact source behind every claim, and saying so when the answer isn't there rather than guessing. I built the whole RAG pipeline by hand instead of reaching for LangChain, because I wanted to understand and explain every stage rather than hide it behind a framework.",
    type: "ai",
    category: "personal",
    year: 2026,
    featured: true,
    tech: [
      "Python",
      "FastAPI",
      "ChromaDB",
      "sentence-transformers",
      "Next.js",
      "TypeScript",
      "Docker",
      "Pydantic",
      "pytest",
    ],
    links: {
      live: "https://pullthereceipts-rl.vercel.app/",
      github: "https://github.com/riskilinardi/pull-the-receipts",
    },
    image: "/pullthereceipts.png",
    highlights: [
      "Wrote the full RAG pipeline from scratch: document loading, sentence-aware chunking, local embeddings, vector retrieval, prompt augmentation, and generation, with every step explicit.",
      "Grounded every answer in retrieved chunks with inline citations to file and page, and made the model refuse when the documents don't back up an answer.",
      "Put the embedding model, vector store, and LLM provider behind clean interfaces, so each is swappable and the test suite can fake all three to run offline.",
      "Streamed answers token by token over Server-Sent Events with sources sent first, then containerised the backend with Docker for deployment.",
    ],
  },
  {
    id: "fakenews-bert",
    image: "/FakeNewsBert.png",
    slug: "fakenews-bert",
    title: "Fake News Classifier",
    tagline: "Fine-tuned BERT with explainability, deployed end-to-end.",
    description:
      "A full-stack fake-news classifier built on a fine-tuned BERT model. Paste a statement and it returns a verdict, confidence, and the exact tokens that drove the decision. I compared five model architectures along the way, from Naive Bayes to BERT with metadata, to find where the real accuracy ceiling sits.",
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
      "Fine-tuned bert-base-uncased on the PolitiFact dataset and compared five architectures, finding the accuracy ceiling sits with the task itself, not the model size.",
      "Added token-level explanations with integrated gradients (a more reliable signal than raw attention), so you can see which words pushed the prediction.",
      "Split it into a real microservice setup: FastAPI backend on Hugging Face Spaces, Next.js frontend on Vercel, model on HF Hub, each deployable on its own.",
      "Surfaced a finding most tutorials miss: the bottleneck was missing context, not capacity. Adding speaker and source metadata lifted accuracy from 69% to 71%.",
    ],
  },
  {
    id: "howlennz",
    slug: "howlennz",
    title: "Howlennz Portfolio",
    tagline: "A fast, self-managed portfolio for a Live2D artist.",
    description:
      "Lennz is a Live2D artist who was stuck on a slow Carrd page with no way to manage his own content. I rebuilt it as a Next.js site backed by Sanity, so he can update his gallery, commissions, and about page himself without touching code.",
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
      "Rebuilt a slow Carrd page as a Next.js 14 site that loads far faster, giving Lennz a more professional first impression for commission clients.",
      "Designed the Sanity content model so he can manage his gallery, work history, and contact details himself, with no developer needed for updates.",
      "Hit a Cloudflare Pages and Sanity edge-runtime incompatibility mid-deployment, debugged it, and migrated to Netlify without compromising the stack.",
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
      "My final year project, built solo: a mobile app to help communities coordinate during local emergencies, with shared alerts and check-ins. I built every layer myself, from the UI to the backend, and treated it like a real product rather than a school assignment.",
    type: "mobile",
    category: "university",
    year: 2026,
    featured: true,
    tech: ["Flutter", "Dart", "REST APIs"],
    links: { github: "https://github.com/riskilinardi/TogetherSafe" },
    highlights: [
      "Wired up REST APIs to push real-time emergency alerts and safety updates straight to users.",
      "Built the interface in Flutter and Dart, focusing on clarity so people can find critical information instantly during stressful moments.",
      "Owned the whole stack myself: UI, frontend, and backend, end to end.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectsByCategory = {
  university: projects.filter((p) => p.category === "university"),
  freelance: projects.filter((p) => p.category === "freelance"),
  personal: projects.filter((p) => p.category === "personal"),
};
