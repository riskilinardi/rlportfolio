import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/ui/brand-icons";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

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
          <Eyebrow file="contact.md" className="mb-6" />

          <h2 className="text-4xl md:text-7xl text-white font-light font-display leading-[1.05] text-balance mb-6">
            Let&apos;s build something useful.
          </h2>

          <p className="text-charcoal-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed text-balance mb-12">
            I&apos;m looking for a software, full-stack or AI role in Singapore.
            If you have one, or just want to chat, my inbox is open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
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
            <CopyEmailButton email={siteConfig.email} />
          </div>

          <div className="mt-14 flex flex-col items-center gap-5">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-charcoal-muted">
              <MapPin size={14} className="text-accent" />
              <span>
                Based in{" "}
                <span className="italic font-display text-accent-light">
                  {siteConfig.location}
                </span>
              </span>
              <span className="hidden sm:inline text-charcoal-muted-deep">
                ·
              </span>
              <span className="basis-full sm:basis-auto">
                Open to on-site and hybrid roles
              </span>
            </div>

            <div className="flex items-center gap-2">
              {siteConfig.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform];
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="p-3 rounded-full border border-white/5 text-charcoal-muted hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
