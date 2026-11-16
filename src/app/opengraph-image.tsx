import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";
import { INTRO_ANSWER, INTRO_QUESTION, INTRO_STEPS } from "@/data/intro";

/*
 * The link preview (LinkedIn, Slack, email): the same agent trace as the intro,
 * ending in the headline. Generated once at build time.
 */

export const alt =
  "Riski Linardi | Software Engineer. A terminal where an agent answers: I build full-stack and AI apps that real people use.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts");

const colour = {
  text: "#e6edf3",
  muted: "#8b949e",
  deep: "#7d8590",
  accent: "#58a6ff",
  accentLight: "#79c0ff",
  string: "#a5d6ff",
  method: "#d2a8ff",
  green: "#34d399",
};

const labelColour = { plan: colour.deep, tool: colour.accent, check: colour.green };

// Satori trims spaces at the edges of text runs; "pre" keeps them.
const run = (text: string, color: string) => (
  <span style={{ color, whiteSpace: "pre" }}>{text}</span>
);

const dot = <div style={{ width: 12, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.12)" }} />;

export default async function OpengraphImage() {
  const [mono, monoMedium, sans] = await Promise.all([
    readFile(join(fontDir, "geist-mono/GeistMono-Regular.ttf")),
    readFile(join(fontDir, "geist-mono/GeistMono-Medium.ttf")),
    readFile(join(fontDir, "geist-sans/Geist-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "44px 64px 52px",
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(31,111,235,0.28) 0%, transparent 60%), #0d1117",
          color: colour.text,
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            fontFamily: "Geist",
            fontSize: 24,
            color: colour.muted,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: colour.accent }} />
            <span style={{ color: colour.text }}>{siteConfig.name}</span>
          </div>
          <span>Software Engineer · {siteConfig.location}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "#161b22",
            boxShadow: "0 30px 120px -20px rgba(31,111,235,0.45)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 26px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              fontSize: 18,
              color: colour.deep,
            }}
          >
            {dot}
            {dot}
            {dot}
            <span style={{ marginLeft: 14 }}>~/riski · python</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "22px 34px 26px",
              fontSize: 22,
              lineHeight: 1.6,
            }}
          >
            <div style={{ display: "flex", fontWeight: 500 }}>
              {run(">>> ", colour.accent)}
              {run("agent", colour.text)}
              {run(".", colour.muted)}
              {run("run", colour.method)}
              {run("(", colour.muted)}
              {run(`"${INTRO_QUESTION}"`, colour.string)}
              {run(")", colour.muted)}
            </div>

            {INTRO_STEPS.map((step) => (
              <div key={step.call} style={{ display: "flex" }}>
                <span style={{ width: 100, color: labelColour[step.label] }}>{step.label}</span>
                {run(step.call, colour.muted)}
                {step.result &&
                  (step.label === "check"
                    ? (
                      // Geist Mono has no ✓ glyph, so the tick is drawn instead.
                      <svg width="22" height="22" viewBox="0 0 24 24" style={{ marginLeft: 14, marginTop: 7 }}>
                        <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={colour.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )
                    : (
                      <div style={{ display: "flex" }}>
                        {run("  →  ", colour.deep)}
                        {run(step.result, colour.text)}
                      </div>
                    ))}
              </div>
            ))}

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: 14,
                paddingTop: 16,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ width: 100, color: "#ffffff", marginTop: 8 }}>answer</span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Geist",
                  fontSize: 40,
                  lineHeight: 1.2,
                  color: "#ffffff",
                  letterSpacing: -0.5,
                }}
              >
                <div style={{ display: "flex" }}>
                  {run(INTRO_ANSWER.before, "#ffffff")}
                  {run(INTRO_ANSWER.highlight, colour.accentLight)}
                </div>
                <div style={{ display: "flex" }}>{run(INTRO_ANSWER.after.trim(), "#ffffff")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "Geist Mono", data: monoMedium, weight: 500, style: "normal" },
        { name: "Geist", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
