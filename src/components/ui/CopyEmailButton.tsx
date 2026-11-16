"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyText } from "@/lib/actions";

/** Copies the email address, for visitors whose mailto links open nothing (webmail users). */
export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (await copyText(email)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 px-5 md:px-6 py-4 md:py-5 rounded-full border border-white/15 bg-white/5 text-sm md:text-base text-white hover:border-accent/60 hover:bg-accent/10 transition-colors"
    >
      {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
