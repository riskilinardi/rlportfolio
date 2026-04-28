"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { featuredProjects } from "@/data/projects";
import { TrackeryMockup } from "./project-mockups/TrackeryMockup";
import { TogetherSafeMockup } from "./project-mockups/TogetherSafeMockup";
import { Reveal } from "@/components/ui/Reveal";

const categoryLabels: Record<string, string> = {
  university: "University · Final Year",
  freelance: "Client · Freelance",
  personal: "Personal",
};

const typeLabels: Record<string, string> = {
  web: "Web App",
  mobile: "Mobile App",
  desktop: "Desktop App",
  ai: "AI / ML",
  game: "Game",
  other: "Project",
};

function ProjectVisual({
  slug,
  image,
  title,
}: {
  slug: string;
  image?: string;
  title: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
    );
  }

  if (slug === "trackery") return <TrackeryMockup />;
  if (slug === "togethersafe") return <TogetherSafeMockup />;

  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(88,166,255,0.3) 0%, transparent 70%), linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
      }}
    />
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[0];
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const reversed = index % 2 === 1;

  return (
    <Reveal animation="fadeUp" delay={index * 0.1}>
      <div
        className="relative rounded-3xl p-[1px] overflow-hidden transition-all duration-500"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundImage: hover
            ? "linear-gradient(135deg, #58a6ff 0%, #1f6feb 50%, #58a6ff 100%)"
            : "linear-gradient(135deg, rgba(88,166,255,0.3) 0%, rgba(48,54,61,0.3) 50%, rgba(88,166,255,0.3) 100%)",
          backgroundSize: "200% 200%",
          animation: hover ? "shimmer 3s ease-in-out infinite" : "none",
        }}
      >
        <div
          className={`rounded-3xl p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-10 items-center bg-charcoal-surface ${
            reversed ? "md:[&>div:first-child]:order-2" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-mono text-accent">
                / {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs uppercase tracking-wider text-charcoal-muted-deep">
                {categoryLabels[project.category]}
              </span>
              <span className="text-charcoal-muted-deep">·</span>
              <span className="text-xs uppercase tracking-wider text-charcoal-muted-deep">
                {typeLabels[project.type]}
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl text-white font-light font-display mb-3 leading-tight">
              {project.title}
            </h3>

            <p className="text-accent-light font-display italic text-base md:text-lg mb-5">
              {project.tagline}
            </p>

            <p className="text-charcoal-muted leading-relaxed mb-5 text-sm md:text-base">
              {project.description}
            </p>

            {project.highlights && project.highlights.length > 0 && (
              <ul className="space-y-2 mb-6">
                {project.highlights.map((highlight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-charcoal-muted"
                  >
                    <span className="text-accent mt-1 text-[10px]">▸</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tech.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-xs font-mono bg-accent/10 text-accent-light border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-medium flex items-center gap-1.5 hover:shadow-[0_0_30px_rgba(88,166,255,0.4)] transition-shadow"
                >
                  <ExternalLink size={12} />
                  Live demo
                  <ArrowUpRight
                    size={12}
                    className="group-hover/btn:rotate-45 transition-transform"
                  />
                </a>
              )}

              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-white/10 text-xs text-white flex items-center gap-1.5 hover:border-accent/40 transition-colors"
                >
                  <GithubIcon size={12} />
                  Source
                </a>
              )}
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
            <ProjectVisual
              slug={project.slug}
              image={project.image}
              title={project.title}
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function FeaturedProjects() {
  return (
    <section id="work" className="relative px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-charcoal-muted-deep mb-3 flex items-center gap-2">
                <span className="font-mono text-accent">03</span>
                <span className="w-8 h-px bg-accent/40" />
                Selected Work
              </div>
              <h2 className="text-4xl md:text-6xl text-white font-light font-display leading-tight">
                Projects I&apos;m{" "}
                <span className="italic text-accent-light">most proud of</span>.
              </h2>
            </div>
            <p className="text-charcoal-muted text-sm max-w-md">
              From enterprise inventory systems to community safety apps — each
              project reflects a different angle of full-stack craft.
            </p>
          </div>
        </Reveal>

        <div className="space-y-8">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
