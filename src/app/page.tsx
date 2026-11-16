import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { CursorSpotlight } from "@/components/effects/CursorSpotlight";
import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { AskPortfolio } from "@/components/ask/AskPortfolio";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { TraceRail } from "@/components/ui/TraceRail";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <AuroraBackground />
      <CursorSpotlight />
      <Navigation />
      <TraceRail />
      <AskPortfolio />

      {/* Slide-in reveals start off to the side; clip (unlike hidden) keeps sticky working. */}
      <main className="relative z-20 overflow-x-clip">
        <Hero />
        <About />
        <Work />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
