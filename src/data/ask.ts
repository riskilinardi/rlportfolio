import type { TraceStep } from "@/components/trace/Trace";

/*
 * Questions for Ask my portfolio. Every answer is drawn only from what the
 * page already says, in the same house style: no em dashes, British
 * spelling. There is no live AI behind this, so nothing is made up.
 */

export type AskAction =
  | { kind: "scroll"; label: string; target: string }
  | { kind: "copy-email"; label: string };

export interface AskQuestion {
  id: string;
  question: string;
  /** Extra words that should match this question when someone types. */
  keywords: string[];
  steps: TraceStep[];
  answer: string;
  action: AskAction;
}

const check: TraceStep = { label: "check", call: "every claim has a source", result: "✓" };

export const askQuestions: AskQuestion[] = [
  {
    id: "trackery",
    question: "What is Trackery?",
    keywords: ["production", "business", "inventory", "desktop", "live"],
    steps: [
      { label: "plan", call: "find the project and how it is used" },
      { label: "tool", call: 'search("projects")', result: "Trackery · live in production" },
      check,
    ],
    answer:
      "Trackery is the desktop app a lab instrument distributor uses every day to run its orders and stock across two warehouses. I am the lead developer, working with a co-developer.",
    action: { kind: "scroll", label: "Show me Trackery", target: "project-trackery" },
  },
  {
    id: "nec",
    question: "What did you do at NEC?",
    keywords: ["experience", "work", "intern", "job", "career"],
    steps: [
      { label: "plan", call: "look up work experience" },
      { label: "tool", call: 'search("experience")', result: "NEC Asia Pacific, 2020 to 2021" },
      check,
    ],
    answer:
      "As an intern, I led a team of interns to build a C# inventory system in five months and moved over 100,000 rows of old records into it. NEC then brought me back on contract to fix slow bulk uploads at production scale.",
    action: { kind: "scroll", label: "Show me the experience", target: "experience" },
  },
  {
    id: "ai",
    question: "Show me your AI work",
    keywords: ["machine learning", "ml", "llm", "agent", "rag", "projects"],
    steps: [
      { label: "plan", call: "find the AI projects" },
      {
        label: "tool",
        call: 'search("projects", tag="AI")',
        result: "Let It Cook · Pull The Receipts · Fake News Classifier",
      },
      check,
    ],
    answer:
      "Three projects, each built to show how it got its answer: an agent that shows every step, document Q&A that points to the exact page, and a fake news detector that shows which words made it decide.",
    action: { kind: "scroll", label: "Show me the AI projects", target: "project-let-it-cook" },
  },
  {
    id: "hire",
    question: "Why should we hire you?",
    keywords: ["hire", "strengths", "why", "summary", "about"],
    steps: [
      { label: "plan", call: "summarise the strongest evidence" },
      { label: "tool", call: 'search("projects")', result: "Trackery, live in production" },
      { label: "tool", call: 'search("education")', result: "First Class Honours, Computer Science" },
      { label: "tool", call: 'search("awards")', result: "IRAS Book Prize, Gold and Silver" },
      check,
    ],
    answer:
      "I ship software people rely on: a business runs on Trackery every day. I graduated with First Class Honours, specialising in Machine Learning and AI, and I build AI that explains itself.",
    action: { kind: "scroll", label: "Get in touch", target: "contact" },
  },
  {
    id: "contact",
    question: "How do I contact you?",
    keywords: ["email", "contact", "reach", "hire", "location", "singapore"],
    steps: [
      { label: "tool", call: 'search("contact")', result: "riskilinardi@gmail.com" },
      check,
    ],
    answer:
      "Email me at riskilinardi@gmail.com. I am based in Singapore and open to on-site and hybrid roles.",
    action: { kind: "copy-email", label: "Copy email" },
  },
];
