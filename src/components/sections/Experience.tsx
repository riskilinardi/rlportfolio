import { Briefcase, GraduationCap, Code2 } from "lucide-react";
import { experience } from "@/data/experience";
import type { ExperienceType } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const typeMeta: Record<
  ExperienceType,
  { icon: typeof Briefcase; label: string; color: string }
> = {
  work: {
    icon: Briefcase,
    label: "Work",
    color: "text-accent-light",
  },
  education: {
    icon: GraduationCap,
    label: "Education",
    color: "text-emerald-300",
  },
  freelance: {
    icon: Code2,
    label: "Freelance",
    color: "text-amber-300",
  },
};

export function Experience() {
  return (
    <section id="experience" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-charcoal-muted-deep mb-3 flex items-center gap-2">
              <span className="font-mono text-accent">03</span>
              <span className="w-8 h-px bg-accent/40" />
              Experience
            </div>
            <h2 className="text-4xl md:text-6xl text-white font-light font-display leading-tight">
              The <span className="italic text-accent-light">journey</span> so
              far.
            </h2>
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent" />

          <div className="space-y-10">
            {experience.map((item, idx) => {
              const meta = typeMeta[item.type];
              const Icon = meta.icon;

              return (
                <Reveal key={item.id} animation="fadeLeft" delay={idx * 0.08}>
                  <div className="relative pl-14 md:pl-20 group">
                    <div className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-charcoal-surface border border-white/10 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                      <Icon size={16} className={meta.color} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-accent-light">
                        {item.period}
                      </span>
                      <span className="text-charcoal-muted-deep">·</span>
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] ${meta.color}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl text-white font-display mb-1 leading-tight">
                      {item.role}
                    </h3>

                    <div className="text-sm text-charcoal-muted mb-4">
                      {item.company}
                      {item.location && (
                        <>
                          <span className="text-charcoal-muted-deep mx-2">
                            ·
                          </span>
                          <span className="text-charcoal-muted-deep">
                            {item.location}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-sm md:text-base text-charcoal-muted leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {item.tech && item.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-charcoal-muted border border-white/5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
