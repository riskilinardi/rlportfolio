import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const runtime = "edge";
export const alt = siteConfig.fullName;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse at top left, #1f6feb40 0%, transparent 60%), radial-gradient(ellipse at bottom right, #58a6ff30 0%, transparent 60%), #0d1117",
          color: "#e6edf3",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            color: "#8b949e",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "100%",
              background: "#58a6ff",
            }}
          />
          {siteConfig.fullName}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "84px",
              lineHeight: 1.05,
              fontWeight: 300,
              color: "#e6edf3",
              letterSpacing: "-2px",
              fontStyle: "italic",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: "#8b949e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "100%",
                background: "#34d399",
              }}
            />
            {siteConfig.currentStatus}
          </div>
          <div>{siteConfig.location}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
