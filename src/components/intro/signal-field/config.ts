import type { Rgb } from "@/lib/colour";

/** When the painted headline is complete, counted from release(). */
export const HEADLINE_PAINT_MS = 1100;

/** Spacing of the intro's dot grid (the CSS fallback uses the same). Dots sit mid-tile. */
export const GRID = 26;
export const HALF = GRID / 2;
/** The page's own background grid (.grid-overlay), which the dots settle onto. */
export const PAGE_GRID = 80;

// Sizes of the shader's uniform arrays.
export const MAX_RIPPLES = 16;
export const MAX_HITS = 8;
export const MAX_STREAMS = 10;
export const MAX_HOLES = 4;
export const MAX_SOURCES = 3;

/** Floats per vertex: home.xy, answer.xy, headline.xy, seed.xy, kind, source. */
export const FLOATS = 10;

/** Ripple kinds, as the shader reads them. */
export const RIPPLE = { search: 0, impact: 1, check: 2, lock: 3 } as const;

/** A search wave's radius after t seconds: SEARCH_R * (1 - e^(-t / SEARCH_TAU)). */
export const SEARCH_R = 1400;
export const SEARCH_TAU = 1.1;

export const DEFAULT_LIGHT: Rgb = [158, 224, 255];
