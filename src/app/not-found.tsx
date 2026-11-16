import type { Metadata } from "next";
import { AuroraBackground } from "@/components/effects/AuroraBackground";
import { NotFoundTerminal } from "@/components/effects/NotFoundTerminal";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <AuroraBackground />
      <main className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 py-16">
        <NotFoundTerminal />
      </main>
    </>
  );
}
