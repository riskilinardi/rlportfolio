import { siteConfig } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-6 md:px-10 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-charcoal-muted">
        <span>
          © {year} — {siteConfig.fullName}
        </span>
        <span className="font-display italic">
          Crafted with care in {siteConfig.location}
        </span>
      </div>
    </footer>
  );
}
