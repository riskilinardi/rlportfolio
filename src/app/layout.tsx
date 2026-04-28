import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { siteConfig } from "@/data/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.fullName} — Software Engineer`,
    template: `%s | ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
  keywords: [
    siteConfig.fullName,
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
  authors: [{ name: siteConfig.fullName, url: siteConfig.url }],
  creator: siteConfig.fullName,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.fullName,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
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
  name: siteConfig.fullName,
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
      name: "Singapore Institute of Management (UOL)",
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
      lang="en"
      suppressHydrationWarning
      className={`no-js ${GeistSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js');",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-charcoal-bg text-charcoal-text font-sans antialiased selection:bg-accent/30 selection:text-white">
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
