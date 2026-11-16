import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const pageTitle = `${siteConfig.name} | Software Engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // The site is also reachable at riskilinardi.vercel.app; this tells search
  // engines that riskilinardi.dev is the address to index.
  alternates: { canonical: "/" },
  keywords: [
    siteConfig.name,
    "Software Engineer",
    "Machine Learning",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "Flutter",
    "Electron",
    "Singapore Developer",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    title: pageTitle,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Software Engineer",
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.location,
  },
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: siteConfig.school,
    },
    {
      "@type": "EducationalOrganization",
      name: "Republic Polytechnic",
    },
  ],
  sameAs: siteConfig.socials
    .filter((s) => s.platform !== "email")
    .map((s) => s.url),
  knowsAbout: [
    "Software Engineering",
    "Machine Learning",
    "Artificial Intelligence",
    "Full-Stack Development",
    "React",
    "Next.js",
    "Flutter",
    "PostgreSQL",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`no-js ${GeistSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Runs before first paint: marks JS as available, and decides whether
            the intro plays: once per tab, ?intro forces a replay, and reduced
            motion always skips it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.remove('no-js');try{var force=/[?&]intro(=|&|$)/.test(location.search);var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce||(!force&&sessionStorage.getItem('intro-seen')))d.setAttribute('data-intro','skip');}catch(e){d.setAttribute('data-intro','skip');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Browser extensions such as Grammarly add attributes to <body> before React loads. */}
      <body
        suppressHydrationWarning
        className="bg-charcoal-bg text-charcoal-text font-sans antialiased selection:bg-accent/30 selection:text-white">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
