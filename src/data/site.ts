import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Riski Linardi",
  fullName: "Riski Linardi",
  tagline: "Engineering intelligent systems from concept to production.",
  description:
    "Graduate Software Engineer specializing in Machine Learning & AI. I build production-grade web, mobile, and desktop applications with a focus on clean architecture and scalable deployment.",

  url: "https://riskilinardi.vercel.app",

  location: "Singapore",
  availableForWork: true,
  currentStatus: "Fresh Graduate · BSc (Hons) CS · SIM UOL",

  email: "riskilinardi@gmail.com",
  responseTime: "Usually replies within a few days",

  socials: [
    {
      platform: "github",
      url: "https://github.com/riskilinardi",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/riski-linardi-248456190/",
      label: "LinkedIn",
    },
    {
      platform: "email",
      url: "mailto:riskilinardi@gmail.com",
      label: "Email",
    },
  ],

  stats: [
    { value: "5+", label: "Projects shipped" },
    { value: "6+", label: "Years coding" },
    { value: "5", label: "Awards & honors" },
  ],

  bio: [
    "I recently graduated with a Computer Science degree (specializing in Machine Learning & AI) from SIM UOL. For me, software engineering isn't just about making things work. It's about writing clean code, building systems that scale smoothly, and creating interfaces people actually enjoy using.",
    "I got my start at NEC Asia Pacific, where I helped develop and optimise an enterprise database handling over 50,000 active records. Fixing concurrency bottlenecks there taught me a lot about why good architecture matters just as much as the code itself. I also work hard to maintain consistent performance, which helped me earn the IRAS Book Prize (Gold in 2025, Silver in 2024).",
    "Outside of work and classes, I like to build things end-to-end. Whether I'm building Trackery (a custom desktop inventory system) or my final year project, TogetherSafe (a cross-platform emergency app), I enjoy working across the entire stack. I really believe the best engineers understand how everything connects, from the database all the way to the UI.",
  ],

  photo: "/me.png",
};
