"use client";

import { ArrowUpRight, FileText, SquareTerminal } from "lucide-react";
import { siteConfig } from "@/data/site";
import { askStore, useShortcutLabel } from "@/lib/ask";

// In page order.
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

// Plain anchors, scrolled by the browser's smooth scrolling (see globals.css).
export function Navigation() {
  const shortcut = useShortcutLabel();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-charcoal-bg/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-3">
        <a
          href="#home"
          className="flex items-center gap-2 group shrink-0"
          aria-label="Back to top"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="font-display italic text-sm tracking-wide text-white group-hover:text-accent-light transition-colors">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm text-charcoal-muted hover:text-white transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* From md to lg the section links need the room, so Resume (also in
            the hero) and the shortcut hint are hidden. On phones the Ask panel
            doubles as the menu. */}
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <button
            type="button"
            onClick={() => askStore.set(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs border border-accent/30 bg-accent/5 text-accent-light hover:border-accent/60 hover:text-white transition-colors"
          >
            <SquareTerminal size={13} />
            <span className="hidden lg:inline">Ask my portfolio</span>
            <span className="lg:hidden">Ask</span>
            <kbd className="hidden sm:inline md:hidden lg:inline font-mono text-[10px] text-charcoal-muted-deep">
              {shortcut}
            </kbd>
          </button>

          <a
            href={siteConfig.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex md:hidden lg:flex group relative px-4 py-2 rounded-full text-xs border border-white/10 hover:border-accent/50 text-charcoal-muted hover:text-white items-center gap-1.5 transition-colors"
          >
            <FileText size={12} />
            Resume
          </a>

          <a
            href={`mailto:${siteConfig.email}`}
            className="group relative px-4 py-2 rounded-full text-xs border border-white/10 hover:border-accent/50 text-white overflow-hidden transition-all"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Get in touch
              <ArrowUpRight
                size={12}
                className="group-hover:rotate-45 transition-transform"
              />
            </span>
            <span className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </nav>
  );
}
