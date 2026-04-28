import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import type { ComponentType, SVGProps } from "react";

type IconType = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

const socialIcons: Record<string, IconType> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
  twitter: Mail,
  instagram: Mail,
  dribbble: Mail,
};

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-24 md:py-40 overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{
            background: "radial-gradient(circle, #58a6ff 0%, transparent 70%)",
          }}
        />
      </div>

      <Reveal animation="scaleUp">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-charcoal-muted-deep mb-6">
            <span className="font-mono text-accent">05</span>
            <span className="w-8 h-px bg-accent/40" />
            Contact
            <span className="w-8 h-px bg-accent/40" />
          </div>

          {siteConfig.availableForWork && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur text-xs text-emerald-300 mb-8">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
              </span>
              Available for opportunities
            </div>
          )}

          <h2 className="text-4xl md:text-7xl text-white font-light font-display leading-[1.05] mb-6">
            Let&apos;s build{" "}
            <span className="italic text-gradient-blue">something</span>
            <br />
            <span className="italic text-charcoal-muted-deep">
              great together.
            </span>
          </h2>

          <p className="text-charcoal-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            Whether it&apos;s a full-stack application, a machine learning
            prototype, or something unusual that hasn&apos;t been tried yet —
            I&apos;d love to hear about it.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-full bg-white text-slate-900 text-sm md:text-base font-medium hover:shadow-[0_0_60px_rgba(88,166,255,0.6)] transition-shadow"
          >
            <Mail size={18} />
            <span>{siteConfig.email}</span>
            <ArrowUpRight
              size={18}
              className="group-hover:rotate-45 group-hover:translate-x-0.5 transition-transform"
            />
          </a>

          <div className="mt-14 flex flex-col items-center gap-5">
            <div className="flex items-center gap-2 text-sm text-charcoal-muted">
              <MapPin size={14} className="text-accent" />
              Based in{" "}
              <span className="italic font-display text-accent-light">
                {siteConfig.location}
              </span>
              {" · "}
              Open to remote & on-site
            </div>

            <div className="flex items-center gap-2">
              {siteConfig.socials.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <Link
                    key={social.platform}
                    href={social.url}
                    target={social.platform === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group p-3 rounded-full border border-white/5 text-charcoal-muted hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all"
                  >
                    <Icon size={18} />
                  </Link>
                );
              })}
            </div>
          </div>

          {siteConfig.responseTime && (
            <p className="mt-12 text-xs text-charcoal-muted-deep font-mono">
              {siteConfig.responseTime} ·{" "}
              <span className="text-charcoal-muted">{siteConfig.email}</span>
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
