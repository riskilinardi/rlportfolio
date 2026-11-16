import type { Project } from "@/types";

// In display order: the large cards first, then the compact row.
export const projects: Project[] = [
  {
    id: "trackery",
    title: "Trackery",
    label: ["Live in production", "Desktop app"],
    live: true,
    size: "large",
    type: "desktop",
    tagline:
      "The app a lab instrument distributor uses every day to run its orders and stock.",
    metric: { value: "2", label: "warehouses, run from one app" },
    highlights: [
      "Quotes, orders, deliveries, invoices and returns, all in one place.",
      "A dashboard shows revenue, unpaid invoices, stock value and low-stock alerts.",
      "Staff changes to deliveries need approval, and completed orders are locked.",
    ],
    note: "I'm the lead developer, working with a co-developer. It's an internal tool, so there's no public demo.",
    underTheHood: [
      "React and Electron on the desktop, talking to a remote PostgreSQL database so stock stays in sync in real time.",
      "A zero-trust network over Tailscale, so staff can reach the system from anywhere without the database ever being exposed to the public internet.",
      "The PostgreSQL schema is designed around how the business actually works day to day.",
    ],
    tech: ["React", "Node.js", "Electron", "PostgreSQL", "Zustand", "Tailscale"],
    image: "/projects/trackery.webp",
    imageSize: { width: 960, height: 504 },
  },
  {
    id: "let-it-cook",
    title: "Let It Cook",
    label: ["Personal", "AI agent"],
    size: "large",
    type: "ai",
    tagline:
      "An AI research agent that plans, picks its own tools and checks its work.",
    metric: {
      value: "4",
      label: "agentic patterns: planning, tool use, memory and reflection",
    },
    highlights: [
      "I built the agent loop myself in LangGraph, as a custom stateful graph.",
      "It can search the web, look through documents or use a calculator that never runs the AI's code.",
      "You can watch every step live, with rate limits and LangSmith tracing behind it.",
    ],
    underTheHood: [
      "Function calling picks between web search, document retrieval over local embeddings and a calculator parsed from an AST, so it cannot run arbitrary code.",
      "A self-correction loop grades each draft and revises it when it falls short, with hard caps so it always finishes.",
    ],
    tech: ["LangGraph", "LangChain", "Gemini", "ChromaDB", "FastAPI", "Next.js", "TypeScript", "Docker"],
    links: {
      live: "https://letitcook-rl.vercel.app/",
      github: "https://github.com/riskilinardi/let-it-cook",
    },
    image: "/projects/letitcook.webp",
    imageSize: { width: 1309, height: 969 },
  },
  {
    id: "pull-the-receipts",
    title: "Pull The Receipts",
    label: ["Personal", "AI / RAG"],
    size: "large",
    type: "ai",
    tagline: "Document Q&A that shows its receipts, or tells you it doesn't know.",
    metric: {
      value: "0",
      label: "lines of LangChain. I wrote every RAG step by hand to understand it.",
    },
    highlights: [
      "Every answer points to the exact file and page it came from.",
      "Each part can be swapped out, and the tests run without internet.",
    ],
    underTheHood: [
      "Every stage is explicit: document loading, sentence-aware chunking, local embeddings, vector retrieval, prompt augmentation and generation.",
      "Answers stream token by token over Server-Sent Events, with the sources sent first.",
    ],
    tech: ["Python", "FastAPI", "ChromaDB", "Next.js", "TypeScript", "Pydantic", "pytest", "Docker"],
    links: {
      live: "https://pullthereceipts-rl.vercel.app/",
      github: "https://github.com/riskilinardi/pull-the-receipts",
    },
    image: "/projects/pullthereceipts.webp",
    imageSize: { width: 1492, height: 991 },
  },
  {
    id: "fakenews-bert",
    title: "Fake News Classifier",
    label: ["Personal", "ML"],
    size: "compact",
    type: "ai",
    tagline: "A fake news detector that shows you which words made it decide.",
    metric: { value: "68% → 71%", label: "accuracy, once it knew who said it and where" },
    story: "The surprise: a bigger model wasn't the fix. More context was.",
    highlights: [
      "I compared five models, from Naive Bayes to a fine-tuned BERT.",
      "It runs on FastAPI in Docker, with 15 passing tests.",
    ],
    underTheHood: [
      "Fine-tuned bert-base-uncased on the PolitiFact dataset.",
      "Token-level explanations use integrated gradients, a more reliable signal than raw attention.",
      "Runs as separate services: a FastAPI backend on Hugging Face Spaces, a Next.js frontend on Vercel and the model on the Hugging Face Hub.",
    ],
    tech: ["PyTorch", "BERT", "Hugging Face", "FastAPI", "Next.js", "TypeScript", "Docker"],
    links: {
      live: "https://fakenewsbert-rl.vercel.app/",
      github: "https://github.com/riskilinardi/fake-news-bert",
    },
    image: "/projects/fakenews.webp",
    imageSize: { width: 711, height: 491 },
  },
  {
    id: "howlennz",
    title: "Howlennz",
    label: ["Freelance", "Web app"],
    size: "compact",
    type: "web",
    tagline: "A fast portfolio for a Live2D artist, rebuilt from his slow Carrd page.",
    metric: { value: "0", label: "lines of code he has to touch to update it" },
    story: "He runs his gallery, commissions and details himself through a CMS.",
    highlights: [
      "Built in Next.js 14 with Sanity CMS.",
      "It looks right in Google and when shared on social media.",
    ],
    underTheHood: [
      "The Sanity content model covers the gallery, work history and contact details.",
      "A Cloudflare Pages and Sanity edge-runtime clash came up mid-deployment, so I debugged it and moved the site to Netlify without changing the stack.",
    ],
    tech: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS", "Netlify"],
    links: { live: "https://howlennz.netlify.app/" },
    image: "/projects/howlennz.webp",
    imageSize: { width: 1901, height: 847 },
  },
  {
    id: "togethersafe",
    title: "TogetherSafe",
    label: ["Final year", "Mobile app"],
    size: "compact",
    type: "mobile",
    tagline:
      "An emergency preparedness app with a calm mode for everyday use and an emergency mode for a crisis.",
    metric: { value: "57% → 86%", label: "preparedness knowledge, tested with 18 people" },
    story: "In a crisis it switches to high contrast and shows only what matters, even offline.",
    highlights: [
      "Usability scored 76.4 on the SUS scale.",
      "Calm mode builds good habits through streaks, points and community goals.",
    ],
    underTheHood: [
      "Built solo in Flutter and Dart, designed for clarity so people can find critical information fast in a stressful moment.",
      "REST APIs deliver emergency alerts and safety updates.",
      "I owned the whole stack: UI, frontend and backend.",
    ],
    tech: ["Flutter", "Dart", "SQLite", "REST APIs", "Figma"],
    links: { github: "https://github.com/riskilinardi/TogetherSafe" },
    image: "/projects/togethersafe.webp",
    imageSize: { width: 1002, height: 734 },
  },
];
