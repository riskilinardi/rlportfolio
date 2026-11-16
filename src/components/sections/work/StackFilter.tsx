import { X } from "lucide-react";
import { projects } from "@/data/projects";
import { STACK_FILTERS, usesTech } from "@/data/stack";

// Only tools that at least one project uses, so every chip finds something.
const chips = STACK_FILTERS.map((name) => ({
  name,
  count: projects.filter((p) => usesTech(p, name)).length,
})).filter((chip) => chip.count > 0);

export function StackFilter({
  selected,
  matches,
  onSelect,
  onClear,
}: {
  selected: string | null;
  matches: number;
  onSelect: (tech: string) => void;
  onClear: () => void;
}) {
  return (
    <div id="stack" className="scroll-mt-24 mb-8">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-charcoal-muted-deep mb-3">
        Filter by stack
      </div>
      {/* One swipeable row on phones; wraps from md up. */}
      <div className="-mx-6 px-6 md:mx-0 md:px-0 flex gap-1.5 overflow-x-auto md:flex-wrap md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const active = chip.name === selected;
          return (
            <button
              key={chip.name}
              type="button"
              onClick={() => onSelect(chip.name)}
              aria-pressed={active}
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                active
                  ? "bg-accent text-slate-900 border-accent"
                  : "border-white/10 text-charcoal-text hover:border-accent/50 hover:text-white"
              }`}
            >
              {chip.name}
              <span className={active ? "text-slate-900/60" : "text-charcoal-muted-deep"}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="min-h-[1.75rem] mt-3">
        {selected && (
          <div className="inline-flex items-center gap-3 text-sm text-charcoal-muted">
            <span>
              {matches} {matches === 1 ? "project uses" : "projects use"}{" "}
              <span className="text-white">{selected}</span>
            </span>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs text-accent-light hover:text-white transition-colors"
            >
              <X size={12} />
              Show all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
