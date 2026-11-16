import Image from "next/image";
import { Award } from "lucide-react";
import { siteConfig } from "@/data/site";
import { awards } from "@/data/experience";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function About() {
  return (
    <section id="about" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16 items-start">
          <Reveal animation="fadeLeft" className="md:col-span-1">
            <div className="relative group">
              <div className="absolute -inset-2 rounded-2xl bg-accent/20 blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-charcoal-surface">
                <Image
                  src={siteConfig.photo}
                  alt={`Photo of ${siteConfig.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-bg/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-charcoal-text">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {siteConfig.location}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-2 space-y-10">
            <Reveal animation="fadeRight">
              <div>
                <Eyebrow file="about.md" />
                <h2 className="text-3xl md:text-5xl text-white font-light font-display leading-tight">
                  Useful is my favourite feature.
                </h2>
              </div>
            </Reveal>

            <div className="grid xl:grid-cols-[1.15fr_1fr] gap-10 items-start">
              <div className="space-y-5">
                {siteConfig.bio.map((paragraph, i) => (
                  <Reveal key={i} animation="fadeUp">
                    <p className="text-charcoal-muted text-base md:text-lg leading-relaxed">
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal animation="fadeUp">
                <div className="relative rounded-2xl border border-white/5 bg-charcoal-surface/60 p-6 md:p-7">
                  <div className="flex items-center gap-2 mb-5">
                    <Award size={14} className="text-accent" />
                    <span className="text-xs uppercase tracking-[0.2em] text-charcoal-muted">
                      Recognition
                    </span>
                  </div>

                  <ul className="space-y-3.5">
                    {awards.map((award) => {
                      // Keep the prize ("First Runner-up") on one line.
                      const [name, prize] = award.title.split(" · ");
                      return (
                        <li
                          key={award.title}
                          className="flex items-start gap-4 group"
                        >
                          <span className="flex-shrink-0 font-mono text-xs text-accent-light/70 mt-0.5 w-10">
                            {award.year}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-charcoal-text group-hover:text-white transition-colors">
                              {name}
                              {prize && (
                                <>
                                  {" · "}
                                  <span className="whitespace-nowrap">
                                    {prize}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="text-xs text-charcoal-muted-deep mt-0.5 leading-relaxed">
                              {award.issuer}
                              {award.detail && ` · ${award.detail}`}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
