"use client";

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 bg-charcoal-bg">
      <div className="max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-charcoal-muted-deep mb-4 font-mono">
          Something went wrong
        </div>

        <h1 className="text-4xl md:text-5xl text-white font-light font-display leading-tight mb-6">
          A small <span className="italic text-accent-light">hiccup</span>.
        </h1>

        <p className="text-charcoal-muted leading-relaxed mb-8">
          Something unexpected broke. Try refreshing — and if the issue
          sticks around, please let me know.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-medium hover:shadow-[0_0_30px_rgba(88,166,255,0.4)] transition-shadow"
          >
            Try again
          </button>

          <a
            href="/"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-sm text-white hover:border-accent/40 transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back home
          </a>
        </div>

        {error.digest && (
          <div className="mt-12 text-xs font-mono text-charcoal-muted-deep">
            Reference: {error.digest}
          </div>
        )}
      </div>
    </main>
  );
}
