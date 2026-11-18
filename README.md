# riskilinardi.dev

My personal website, live at [riskilinardi.dev](https://riskilinardi.dev).

I'm a software engineer in Singapore who builds full-stack and AI apps. This site is where I point people to my work.

## What's in it

- **An intro that answers "Who is Riski Linardi?" as an agent trace.** The agent searches, sources land as cards (on anything bigger than a phone), and the answer forms out of particles before it becomes the page's headline. The dot grid behind it is a single WebGL draw call. It plays once per tab, never with reduced motion, and any click, key, scroll or tap skips it. Want to see it again? Open `/?intro`, or pick "Replay the intro" in Ask my portfolio. No WebGL? You get a plain CSS dot grid instead.
- **Ask my portfolio** (`Ctrl K` / `⌘K`): a command palette that answers a few common questions, jumps to sections, copies my email and doubles as the mobile menu. There's no LLM behind it, and that's on purpose. The answers are written by hand from what's already on the page, so it can't make anything up about me. Typing a question just matches keywords.
- **Six projects**, filterable by stack, each linking to a live demo or the source where there is one.

## A few things that bit me

- **Safari froze on load.** The glow behind the page used large `filter: blur()` layers. Safari (and so every browser on iOS) blurs those on the CPU, and at a phone's 3x resolution that took seconds to paint. The glow is plain radial gradients now, with a comment in `AuroraBackground.tsx` so future me doesn't bring the blur back.
- **The intro runs on the clock.** Without a guard, a busy phone or a tab you'd switched away from would jump ahead and skip part of it. Any gap between frames over 250 ms now pauses the intro instead.
- **My favourite number in the codebase is 0.999.** That's the opacity of the intro's background. At a full 1, Chrome stops drawing the page underneath, so the first frame of the handoff has to draw the whole page at once.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19, in TypeScript
- Tailwind CSS v4
- WebGL for the intro's particle field, the Web Animations API for its handoff, and Framer Motion for UI transitions
- Hosted on Vercel, with Web Analytics and Speed Insights

## Running it locally

You'll need Node 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

There's no test suite for this one. Lint and the type check are the safety net.

## Where things live

```
src/
  app/                 layout, page, error and 404 pages, icon, Open Graph image, robots, sitemap
  components/
    intro/             the intro: timeline, handoff, Source cards
      signal-field/    the WebGL particle field and its shaders
    sections/          Hero, About, Work, Experience, Contact
    ask/               Ask my portfolio
    trace/             the agent-trace UI shared by the intro, Ask and the 404 page
    effects/           the background glow, cursor spotlight and 404 terminal
    ui/                navigation, footer and small shared pieces
  data/                all of the site's content: projects, experience, intro, Ask answers
  lib/                 small client stores and helpers
  types/               shared TypeScript types
```

Content lives in `src/data`, so updating a project or a line of copy doesn't mean touching components.

## License

The code is public, so feel free to look around or take ideas. There's no open-source licence on it, though, so please don't copy it wholesale and pass it off as your own portfolio.

If you spot something broken or have feedback, my contact details are on the site.
