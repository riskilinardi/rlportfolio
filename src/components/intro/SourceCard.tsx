import type { CSSProperties } from "react";
import { Briefcase, Check, GraduationCap, Layers } from "lucide-react";
import { INTRO_SOURCES } from "@/data/intro";
import { rgba } from "@/lib/colour";

const ICONS = { education: GraduationCap, work: Briefcase, projects: Layers };

/**
 * An evidence card beside the terminal (wide screens). It starts as a dashed
 * "pending" slot and fills in, in its source's colour, when its search lands.
 */
export function SourceCard({
  index,
  arrived,
  verified,
  pouring,
  leaving,
}: {
  index: number;
  arrived: boolean;
  verified: boolean;
  pouring: boolean;
  leaving: boolean;
}) {
  const source = INTRO_SOURCES[index];
  const Icon = ICONS[source.kind];
  const colour = source.colour;

  return (
    // The wrapper carries the boot animation, leaving the card free for the handoff flight.
    <div className="animate-intro-boot" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
      <div
        data-source-card
        className={`relative rounded-xl border p-4 transition duration-500 ease-out ${
          arrived
            ? "bg-charcoal-surface/95 translate-x-0"
            : "border-dashed border-white/10 bg-transparent translate-x-2"
        } ${leaving && !verified ? "opacity-0" : ""}`}
        style={
          {
            "--source": colour.join(", "),
            borderColor: arrived ? rgba(colour, pouring ? 0.75 : verified ? 0.5 : 0.38) : undefined,
          } as CSSProperties
        }
      >
        {/* Tint while its particles pour out. A plain gradient, no blur: blurs
            made Chrome compile new GPU shaders mid-intro and drop frames. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{
            opacity: pouring ? 1 : 0,
            background: `linear-gradient(90deg, ${rgba(colour, 0.2)}, ${rgba(colour, 0.06)} 75%)`,
          }}
        />
        {arrived && !leaving && (
          <span aria-hidden="true" className="card-trace">
            <span className="t" />
            <span className="r" />
            <span className="b" />
            <span className="l" />
          </span>
        )}
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-charcoal-muted-deep transition-opacity duration-300 ${
            arrived ? "opacity-0" : "opacity-100"
          }`}
        >
          [{index + 1}] pending…
        </span>
        <div className={`relative transition-opacity duration-500 ${arrived ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span style={{ color: rgba(colour, 1) }}>[{index + 1}]</span>
            <span style={{ color: rgba(colour, 0.7) }}>{source.file}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
            <Icon size={14} className="shrink-0" style={{ color: rgba(colour, 1) }} />
            {source.title}
          </div>
          <div className="mt-0.5 text-xs text-charcoal-muted">{source.detail}</div>
        </div>
        <span
          className={`absolute top-3 right-3 grid place-items-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 transition duration-300 ${
            verified ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ transitionDelay: verified ? `${index * 110}ms` : "0ms" }}
        >
          <Check size={12} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}
