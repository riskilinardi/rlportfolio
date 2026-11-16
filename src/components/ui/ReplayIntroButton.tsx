"use client";

import { RotateCcw } from "lucide-react";
import { replayIntro } from "@/lib/actions";

export function ReplayIntroButton() {
  return (
    <button
      type="button"
      onClick={replayIntro}
      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
    >
      <RotateCcw size={12} />
      Replay intro
    </button>
  );
}
