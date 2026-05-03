"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/site";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function smoothScrollTo(targetId: string) {
  const el = document.querySelector(targetId);
  if (!el) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).lenis;

  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, { offset: -80, duration: 1.5 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navigation() {
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    smoothScrollTo(href);

    if (window.history) {
      window.history.replaceState(null, "", href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-charcoal-bg/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Back to top"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="font-display italic text-sm tracking-wide text-white group-hover:text-accent-light transition-colors">
            {siteConfig.name}
            <span className="text-accent"></span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="group relative text-sm text-charcoal-muted hover:text-white transition-colors"
            >
              <span className="mr-2 text-[10px] text-charcoal-muted-deep font-mono"></span>
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        <a
          href={`mailto:${siteConfig.email}`}
          className="group relative px-4 py-2 rounded-full text-xs border border-white/10 hover:border-accent/50 text-white overflow-hidden transition-all"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Let&apos;s talk
            <ArrowUpRight
              size={12}
              className="group-hover:rotate-45 transition-transform"
            />
          </span>
          <span className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </a>
      </div>
    </nav>
  );
}
