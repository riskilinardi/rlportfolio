# riskilinardi.dev

My personal website, live at [riskilinardi.dev](https://riskilinardi.dev).

I'm a software engineer in Singapore who builds full-stack and AI apps. This site is where I point people to my work.

## What's in it

- **An intro that answers "Who is Riski Linardi?" as an agent trace.** The agent searches, sources land as cards, and the answer forms out of particles before it becomes the page's headline. The dot grid behind it is a single WebGL draw call. It plays once per tab, never with reduced motion, and `/?intro` replays it.
- **Ask my portfolio** (`Ctrl K` / `⌘K`): a command palette that answers a few common questions from what's on the page, jumps to sections and doubles as the mobile menu.
- **Six projects**, filterable by stack, each linking to a live demo or the source where there is one.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19, in TypeScript
- Tailwind CSS v4
- WebGL for the intro's particle field, the Web Animations API for its handoff, and Framer Motion for UI transitions
- Hosted on Vercel

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

## Where things live

```
src/
  app/                 layout, page, 404, Open Graph image, robots, sitemap
  components/
    intro/             the intro: timeline, handoff, Source cards
      signal-field/    the WebGL particle field and its shaders
    sections/          Hero, About, Work, Experience, Contact
    ask/               Ask my portfolio
    trace/             the agent-trace UI shared by the intro, Ask and the 404 page
    ui/                navigation, footer and small shared pieces
  data/                all of the site's content: projects, experience, intro, Ask answers
  lib/                 small client stores and helpers
```

Content lives in `src/data`, so updating a project or a line of copy doesn't mean touching components.

## License

The code is open source, so feel free to look around or take ideas. Just please don't copy it wholesale and pass it off as your own portfolio.

If you spot something broken or have feedback, my contact details are on the site.
