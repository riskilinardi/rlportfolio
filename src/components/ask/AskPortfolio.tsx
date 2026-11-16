"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  CornerDownLeft,
  FileText,
  Hash,
  MessageSquare,
  RotateCcw,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { AgentCall, TraceLines } from "@/components/trace/Trace";
import { askQuestions, type AskQuestion } from "@/data/ask";
import { siteConfig } from "@/data/site";
import { askStore, useAskOpen, useShortcutLabel } from "@/lib/ask";
import { copyText, replayIntro, scrollToId } from "@/lib/actions";
import { traceTimes, useTimeline } from "@/lib/useTimeline";

/*
 * Ask my portfolio: a command palette (⌘K / Ctrl K, or the nav button).
 * Questions play a short agent trace with a canned answer drawn from the page.
 * It also jumps to sections (the mobile menu) and runs quick actions.
 */

type Item =
  | { kind: "question"; id: string; label: string; keywords: string[]; question: AskQuestion }
  | { kind: "goto"; id: string; label: string; keywords: string[]; target: string }
  | { kind: "action"; id: string; label: string; keywords: string[]; run: ActionId };

type ActionId = "copy-email" | "resume" | "github" | "linkedin" | "replay";

const socialUrl = (platform: string) =>
  siteConfig.socials.find((s) => s.platform === platform)?.url ?? "";

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Ask",
    items: askQuestions.map((q) => ({
      kind: "question" as const,
      id: `q-${q.id}`,
      label: q.question,
      keywords: q.keywords,
      question: q,
    })),
  },
  {
    title: "Go to",
    items: [
      { kind: "goto", id: "go-about", label: "About", keywords: ["bio", "awards", "recognition"], target: "about" },
      { kind: "goto", id: "go-work", label: "Work", keywords: ["projects", "portfolio"], target: "work" },
      { kind: "goto", id: "go-experience", label: "Experience", keywords: ["nec", "education", "journey"], target: "experience" },
      { kind: "goto", id: "go-contact", label: "Contact", keywords: ["email", "hire"], target: "contact" },
    ],
  },
  {
    title: "Do",
    items: [
      { kind: "action", id: "do-copy", label: "Copy email address", keywords: ["email", "contact", "mail"], run: "copy-email" },
      { kind: "action", id: "do-resume", label: "Open resume", keywords: ["cv", "pdf"], run: "resume" },
      { kind: "action", id: "do-github", label: "Open GitHub", keywords: ["code", "source"], run: "github" },
      { kind: "action", id: "do-linkedin", label: "Open LinkedIn", keywords: ["profile"], run: "linkedin" },
      { kind: "action", id: "do-replay", label: "Replay the intro", keywords: ["animation", "terminal"], run: "replay" },
    ],
  },
];

const ITEM_ICONS: Record<string, ReactNode> = {
  question: <MessageSquare size={14} />,
  goto: <Hash size={14} />,
  "copy-email": <Copy size={14} />,
  resume: <FileText size={14} />,
  github: <GithubIcon size={14} />,
  linkedin: <LinkedinIcon size={14} />,
  replay: <RotateCcw size={14} />,
};

function setPageScrollLocked(locked: boolean) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Keeps items that share at least one word with the query, best matches first. */
function filterGroups(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return GROUPS;
  return GROUPS.map((group) => ({
    ...group,
    items: group.items
      .map((item) => {
        const haystack = `${item.label} ${item.keywords.join(" ")}`.toLowerCase();
        return { item, score: words.filter((w) => haystack.includes(w)).length };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item),
  })).filter((group) => group.items.length > 0);
}

export function AskPortfolio() {
  const open = useAskOpen();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        askStore.set(!askStore.get());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <AnimatePresence>{open && <AskPanel key="ask" />}</AnimatePresence>;
}

function AskPanel() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState<AskQuestion | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shortcut = useShortcutLabel();

  const groups = useMemo(() => filterGroups(query), [query]);
  const items = groups.flatMap((g) => g.items);
  const activeIndex = Math.min(active, Math.max(0, items.length - 1));
  const activeItem = items[activeIndex];

  // Lock page scroll while open, and hand focus back when closed.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    setPageScrollLocked(true);
    return () => {
      setPageScrollLocked(false);
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  // Keep keyboard focus inside the panel as it switches between list and trace.
  useEffect(() => {
    if (running) traceRef.current?.focus();
    else inputRef.current?.focus();
  }, [running]);

  const close = () => {
    // Unlock straight away: the panel stays mounted during its exit animation.
    setPageScrollLocked(false);
    askStore.set(false);
  };

  const goTo = (target: string) => {
    close();
    // Wait a frame so the scroll lock is gone before scrolling.
    requestAnimationFrame(() => {
      if (!scrollToId(target)) scrollToId("work");
    });
  };

  const copyEmail = async () => {
    if (await copyText(siteConfig.email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const runItem = (item: Item) => {
    if (item.kind === "question") return setRunning(item.question);
    if (item.kind === "goto") return goTo(item.target);
    switch (item.run) {
      case "copy-email":
        return void copyEmail();
      case "resume":
        window.open(siteConfig.resume, "_blank", "noopener");
        return close();
      case "github":
      case "linkedin":
        window.open(socialUrl(item.run), "_blank", "noopener");
        return close();
      case "replay":
        return replayIntro();
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (running) setRunning(null);
      else close();
      return;
    }
    if (e.key === "Tab") {
      // Simple focus trap: cycle through the panel's focusable elements.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "button, input, [href], [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (running) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((activeIndex + step + items.length) % items.length);
    } else if (e.key === "Enter" && activeItem) {
      e.preventDefault();
      runItem(activeItem);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[9vh] sm:pt-[14vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#05070a]/75"
        onClick={close}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Ask my portfolio"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-charcoal-surface shadow-[0_30px_120px_-20px_rgba(31,111,235,0.45)] overflow-hidden"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="ml-3 font-mono text-[11px] text-charcoal-muted-deep">
            ask · riski linardi
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="ml-auto p-1.5 -mr-1.5 rounded-md text-charcoal-muted-deep hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {running ? (
          <TraceRun
            key={running.id}
            question={running}
            focusRef={traceRef}
            copied={copied}
            onBack={() => setRunning(null)}
            onScroll={goTo}
            onCopy={copyEmail}
          />
        ) : (
          <>
            <label className="flex items-center gap-2 px-4 py-3 border-b border-white/5 font-mono text-[13px]">
              <span className="text-accent shrink-0">&gt;&gt;&gt;</span>
              <span className="sr-only">Ask a question or jump to a section</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Ask a question or jump to a section"
                role="combobox"
                aria-expanded="true"
                aria-controls="ask-list"
                aria-activedescendant={activeItem ? `ask-${activeItem.id}` : undefined}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 min-w-0 bg-transparent text-charcoal-text placeholder:text-charcoal-muted-deep outline-none"
              />
            </label>

            <div
              id="ask-list"
              role="listbox"
              aria-label="Suggestions"
              className="max-h-[min(58vh,26rem)] overflow-y-auto overscroll-contain py-2"
            >
              {items.length === 0 && (
                <div className="px-4 py-3 text-sm text-charcoal-muted">
                  I only answer from this page, and it does not cover that yet.
                  Try one of these:
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {askQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setRunning(q)}
                        className="px-2.5 py-1 rounded-full text-xs border border-white/10 text-charcoal-text hover:border-accent/50"
                      >
                        {q.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {groups.map((group) => (
                <div key={group.title} role="group" aria-label={group.title} className="mb-1">
                  <div className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal-muted-deep">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const index = items.indexOf(item);
                    const isActive = index === activeIndex;
                    const icon =
                      item.kind === "action" ? ITEM_ICONS[item.run] : ITEM_ICONS[item.kind];
                    const isCopy = item.kind === "action" && item.run === "copy-email";
                    return (
                      <div
                        key={item.id}
                        id={`ask-${item.id}`}
                        role="option"
                        aria-selected={isActive}
                        onMouseMove={() => index !== activeIndex && setActive(index)}
                        onClick={() => runItem(item)}
                        className={`mx-2 flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                          isActive ? "bg-accent/10 text-white" : "text-charcoal-text"
                        }`}
                      >
                        <span className={isActive ? "text-accent-light" : "text-charcoal-muted-deep"}>
                          {isCopy && copied ? <Check size={14} className="text-emerald-400" /> : icon}
                        </span>
                        <span className="flex-1 min-w-0 truncate">
                          {isCopy && copied ? "Email copied" : item.label}
                        </span>
                        {isActive && (
                          <CornerDownLeft size={13} className="text-charcoal-muted-deep shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t border-white/5 font-mono text-[10px] text-charcoal-muted-deep">
          {running ? (
            <span>esc to go back</span>
          ) : (
            <>
              <span>↑↓ to move</span>
              <span>↵ to run</span>
              <span>esc to close</span>
            </>
          )}
          <span className="ml-auto">{shortcut} anywhere</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TraceRun({
  question,
  focusRef,
  copied,
  onBack,
  onScroll,
  onCopy,
}: {
  question: AskQuestion;
  focusRef: RefObject<HTMLDivElement | null>;
  copied: boolean;
  onBack: () => void;
  onScroll: (target: string) => void;
  onCopy: () => void;
}) {
  const times = useMemo(() => traceTimes(question.steps.length), [question]);
  const reached = useTimeline(times);
  const count = question.steps.length;
  const shown = Math.min(count, Math.ceil(reached / 2));
  const results = Math.min(count, Math.floor(reached / 2));
  const answered = reached > count * 2;
  const { action } = question;

  return (
    <div
      ref={focusRef}
      tabIndex={-1}
      className="px-4 sm:px-5 py-4 outline-none"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1.5 text-xs text-charcoal-muted-deep hover:text-white transition-colors"
      >
        <ArrowLeft size={13} />
        All questions
      </button>

      <div className="font-mono text-[12px] sm:text-[13px] leading-6 sm:leading-7">
        <AgentCall question={question.question} />
        <div className="mt-2">
          <TraceLines steps={question.steps} shown={shown} results={results} />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: answered ? 1 : 0, y: answered ? 0 : 6 }}
        transition={{ duration: 0.3 }}
        className="mt-4 pt-4 border-t border-white/5"
        aria-hidden={!answered}
      >
        <p className="text-sm text-charcoal-text leading-relaxed">{question.answer}</p>
        <div className="mt-4">
          {action.kind === "scroll" ? (
            <button
              type="button"
              tabIndex={answered ? 0 : -1}
              onClick={() => onScroll(action.target)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-medium hover:shadow-[0_0_30px_rgba(88,166,255,0.45)] transition-shadow"
            >
              {action.label}
              <ArrowUpRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              tabIndex={answered ? 0 : -1}
              onClick={onCopy}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-medium hover:shadow-[0_0_30px_rgba(88,166,255,0.45)] transition-shadow"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Email copied" : action.label}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
