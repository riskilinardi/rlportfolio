"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site";
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

const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-10 pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        {siteConfig.availableForWork && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur text-xs text-emerald-300 mb-8"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative rounded-full w-1.5 h-1.5 bg-emerald-400" />
            </span>
            Available for work
          </motion.div>
        )}

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] tracking-tight text-white font-light font-display mb-8"
        >
          Building{" "}
          <span className="italic text-gradient-blue">intelligent</span>
          <br />
          software from{" "}
          <span className="italic text-charcoal-muted-deep">
            idea to production.
          </span>
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-16 mb-12 items-end"
        >
          <p className="text-lg md:text-xl text-charcoal-muted leading-relaxed max-w-xl">
            I&apos;m a{" "}
            <span className="text-white">Graduate Software Engineer</span>{" "}
            specialising in Machine Learning and AI. I build production-grade{" "}
            <span className="text-white">web</span>,{" "}
            <span className="text-white">mobile</span>, and{" "}
            <span className="text-white">desktop</span> applications with a
            focus on clean architecture and scalable deployment.
          </p>

          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-muted-deep">
              Currently
            </span>
            <span className="text-charcoal-text text-sm">
              {siteConfig.currentStatus}
            </span>
            <span className="text-charcoal-text text-sm">
              Based in{" "}
              <span className="italic font-display text-accent-light">
                {siteConfig.location}
              </span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3 mb-20"
        >
          <a
            href="#work"
            className="group relative px-6 py-3.5 rounded-full bg-white text-slate-900 text-sm font-medium overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(88,166,255,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              View selected work
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </span>
          </a>

          <a
            href="#about"
            className="group px-6 py-3.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-sm text-white hover:border-accent/40 hover:bg-accent/10 transition-all"
          >
            <span className="flex items-center gap-2">
              Read about me
              <span className="w-1 h-1 rounded-full bg-accent group-hover:scale-150 transition-transform" />
            </span>
          </a>

          <div className="flex items-center gap-1 ml-2">
            {siteConfig.socials.map((social) => {
              const Icon = socialIcons[social.platform];
              return (
                <Link
                  key={social.platform}
                  href={social.url}
                  target={social.platform === "email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-full text-charcoal-muted-deep hover:text-white hover:bg-white/5 transition-all"
                >
                  <Icon size={16} />
                </Link>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-8 border-t border-white/5"
        >
          {siteConfig.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-5xl text-white font-light font-display mb-1">
                {stat.value}
              </div>
              <div className="text-xs uppercase tracking-wider text-charcoal-muted-deep">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
