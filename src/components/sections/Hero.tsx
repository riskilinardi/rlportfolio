"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, FileText } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/ui/brand-icons";
import { NoWrapParts } from "@/components/ui/NoWrapParts";
import { siteConfig } from "@/data/site";
import { useIntro } from "@/lib/intro";

/*
 * The entrance is plain CSS (animate-hero-in). After the intro, the headline,
 * the stats and the honours line are animated by the intro instead, so they
 * are simply shown here.
 */
export function Hero() {
  const intro = useIntro();
  const show = intro.phase === "handoff" || intro.phase === "done";
  const afterIntro = intro.headlineFromIntro === true;
  const targetsFromIntro = intro.targetsFromIntro === true;

  const enter = (delay: number, byIntro = false): { className: string; style?: CSSProperties } => {
    if (!show) return { className: "opacity-0" };
    if (byIntro) return { className: "" };
    return { className: "animate-hero-in", style: { animationDelay: `${delay}s` } };
  };

  // After the intro, the rest waits until the particles have painted the headline.
  const [badge, headline, copy, details, buttons, stats] = afterIntro
    ? [1.25, 0, 1.3, 1.35, 1.45, 1.55]
    : [0, 0.1, 0.3, 0.35, 0.5, 0.7];

  const badgeIn = enter(badge);
  const headlineIn = enter(headline, afterIntro);
  const copyIn = enter(copy);
  const buttonsIn = enter(buttons);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {siteConfig.availableForWork && (
          <div
            data-reveal
            style={badgeIn.style}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-300 mb-8 ${badgeIn.className}`}
          >
            <span className="rounded-full w-1.5 h-1.5 bg-emerald-400" />
            Available for work
          </div>
        )}

        <h1
          data-reveal
          style={headlineIn.style}
          className={`text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.98] tracking-tight text-white font-light font-display mb-8 ${headlineIn.className}`}
        >
          I build{" "}
          <span className={`italic text-gradient-blue ${afterIntro ? "headline-seal" : ""}`}>
            full-stack and <span className="whitespace-nowrap">AI apps</span>
          </span>{" "}
          that real people use.
        </h1>

        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 mb-12 items-end">
          <p
            data-reveal
            style={copyIn.style}
            className={`text-lg md:text-xl text-charcoal-muted leading-relaxed max-w-xl ${copyIn.className}`}
          >
            I&apos;m a{" "}
            <span className="text-white">fresh Computer Science graduate</span>. I
            build <span className="text-white">the whole thing</span>, from the
            database to the interface, and I like it best when it makes
            someone&apos;s day <span className="text-white">a little easier</span>.
          </p>

          {/* Separate lines, so the intro's education card can land on the honours line. */}
          <div className="flex flex-col items-start lg:items-end lg:text-right gap-1">
            {[
              {
                key: "label",
                node: (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-muted-deep">
                    The short version
                  </span>
                ),
              },
              {
                key: "honours",
                target: "honours",
                node: <span className="text-charcoal-text text-sm">{siteConfig.currentStatus}</span>,
              },
              {
                key: "school",
                node: (
                  <span className="text-charcoal-text text-sm">
                    <NoWrapParts text={siteConfig.school} />
                  </span>
                ),
              },
              {
                key: "location",
                node: (
                  <span className="text-charcoal-text text-sm">
                    Based in{" "}
                    <span className="italic font-display text-accent-light">
                      {siteConfig.location}
                    </span>
                  </span>
                ),
              },
            ].map((line, i) => {
              const lineIn = enter(details + i * 0.05, Boolean(line.target) && targetsFromIntro);
              return (
                <div
                  key={line.key}
                  data-reveal
                  data-intro-target={line.target}
                  style={lineIn.style}
                  className={lineIn.className}
                >
                  {line.node}
                </div>
              );
            })}
          </div>
        </div>

        <div
          data-reveal
          style={buttonsIn.style}
          className={`flex flex-wrap items-center gap-3 mb-16 ${buttonsIn.className}`}
        >
          <a
            href="#work"
            className="group relative px-6 py-3.5 rounded-full bg-white text-slate-900 text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(88,166,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              See my work
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </span>
          </a>

          <a
            href={siteConfig.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-3.5 rounded-full border border-accent/30 bg-accent/5 text-sm text-accent-light hover:border-accent/60 hover:bg-accent/15 hover:text-white transition-all"
          >
            <span className="flex items-center gap-2">
              <FileText size={14} />
              Resume
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </span>
          </a>

          <a
            href="#about"
            className="group px-6 py-3.5 rounded-full border border-white/10 bg-white/5 text-sm text-white hover:border-accent/40 hover:bg-accent/10 transition-all"
          >
            <span className="flex items-center gap-2">
              About me
              <span className="w-1 h-1 rounded-full bg-accent group-hover:scale-150 transition-transform" />
            </span>
          </a>

          <div className="flex items-center gap-1 ml-2">
            {siteConfig.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform];
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-full text-charcoal-muted-deep hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:gap-10 pt-8 border-t border-white/5">
          {siteConfig.stats.map((stat, i) => {
            const statIn = enter(stats + i * 0.06, targetsFromIntro);
            const content = (
              <>
                <div className="flex items-center gap-3 text-3xl sm:text-4xl xl:text-5xl text-white font-light font-display whitespace-nowrap mb-1">
                  {stat.live && (
                    <span className="relative flex w-2.5 h-2.5 shrink-0">
                      <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                      <span className="relative rounded-full w-2.5 h-2.5 bg-emerald-400" />
                    </span>
                  )}
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-charcoal-muted-deep group-hover:text-accent-light transition-colors">
                  {stat.label}
                  {stat.href && <ArrowUpRight size={12} className="inline ml-1 -mt-0.5" />}
                </div>
              </>
            );
            return (
              <div
                key={stat.label}
                data-reveal
                data-intro-target={`stat-${i}`}
                style={statIn.style}
                className={statIn.className}
              >
                {stat.href ? (
                  <a href={stat.href} className="group block w-fit">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
