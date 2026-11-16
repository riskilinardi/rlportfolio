import { ArrowUp } from "lucide-react";
import { siteConfig } from "@/data/site";
import { ReplayIntroButton } from "@/components/ui/ReplayIntroButton";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative px-6 md:px-10 py-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
        <span>
          © {year} {siteConfig.name} · Made in Singapore
        </span>
        <div className="flex items-center gap-5">
          <ReplayIntroButton />
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowUp size={12} />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
