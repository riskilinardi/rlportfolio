import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { SkillsMarquee } from "@/components/sections/SkillsMarquee";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <AuroraBackground />
      <CursorSpotlight />
      <Navigation />

      <main className="relative z-20">
        <Hero />
        <SkillsMarquee />
        <About />
        <FeaturedProjects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
