import { INTRO_SOURCES } from "@/data/intro";
import { rgba, type Rgb } from "@/lib/colour";
import { HEADLINE_PAINT_MS } from "./signal-field/config";

/*
 * The handoff, as Web Animations started in one frame: they run on the
 * compositor and stay in step while React re-renders the page underneath.
 */

const FLIGHT_MS = 1400;
const FLIGHT_STAGGER = 110;
/** After landing, a stat settles from its card's colour to its own over this long. */
const TINT_MS = 800;
const RISE_MS = 1500;
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Elements in the page get their own styles back when the animation ends;
 * elements inside the intro keep the last frame until the intro unmounts.
 */
function play(el: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions, keep = false) {
  const animation = el.animate(frames, { fill: "both", ...options });
  if (!keep) animation.finished.then(() => animation.cancel()).catch(() => {});
}

/**
 * Shows the hero headline. If the particles painted it, the real one fades in
 * as they finish; otherwise (no WebGL) it rises out of the answer line.
 */
export function revealHeadline(headline: HTMLElement, painted: boolean, answer: HTMLElement | null) {
  if (painted) {
    play(headline, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 550,
      delay: HEADLINE_PAINT_MS - 50,
      easing: "ease-out",
    });
    return true;
  }
  if (!answer) return false;
  // The headline is hidden with opacity only, so its box is already in place.
  const fromY = answer.getBoundingClientRect().top - headline.getBoundingClientRect().top;
  play(
    headline,
    [{ transform: `translateY(${fromY.toFixed(1)}px)` }, { transform: "translateY(0px)" }],
    { duration: RISE_MS, easing: EASE_IN_OUT },
  );
  play(headline, [{ opacity: 0 }, { opacity: 0, offset: 0.12 }, { opacity: 1 }], {
    duration: RISE_MS * 0.75,
    easing: "ease-out",
  });
  return true;
}

interface Box {
  x: number;
  y: number;
  height: number;
}

const boxOf = (el: HTMLElement): Box => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, height: rect.height };
};

/**
 * A curve from one box to another, sampled with the easing applied: across at
 * the card's own height first, then down into place, leaning into the turn.
 */
function flightPath(from: Box, to: Box, samples = 30) {
  const control = { x: to.x, y: from.y + (to.y - from.y) * 0.3 };
  const points: { offset: number; t: number; x: number; y: number; lean: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const offset = i / samples;
    const t = easeInOut(offset);
    const u = 1 - t;
    const x = u * u * from.x + 2 * u * t * control.x + t * t * to.x;
    const y = u * u * from.y + 2 * u * t * control.y + t * t * to.y;
    const vx = i === 0 ? 0 : x - points[i - 1].x;
    points.push({ offset, t, x, y, lean: Math.max(-3, Math.min(3, vx * 0.06)) });
  }
  return points;
}

/** The target's text arrives in its card's colour, then settles to its own. */
function tint(target: HTMLElement, colour: Rgb, delay: number) {
  const landing = FLIGHT_MS / (FLIGHT_MS + TINT_MS);
  const textElements = [target, ...target.querySelectorAll<HTMLElement>("*")].filter((el) =>
    Array.from(el.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()),
  );
  for (const el of textElements) {
    play(
      el,
      [
        { color: rgba(colour, 1), offset: 0 },
        { color: rgba(colour, 1), offset: landing, easing: "ease-in-out" },
        { color: getComputedStyle(el).color, offset: 1 },
      ],
      { duration: FLIGHT_MS + TINT_MS, delay },
    );
  }
}

/**
 * Each Source card glides into the hero part it backs up (`data-intro-target`)
 * and fades out as that part fades in along the same path. A card with
 * several targets splits into them. Returns false where the cards are hidden.
 */
export function flyCardsIntoTargets(cards: HTMLElement[]) {
  if (cards.length !== INTRO_SOURCES.length || cards[0].getBoundingClientRect().width === 0) {
    return false;
  }

  INTRO_SOURCES.forEach((source, i) => {
    const card = cards[i];
    const from = boxOf(card);
    source.targets.forEach((name, k) => {
      const target = document.querySelector<HTMLElement>(`#home [data-intro-target="${name}"]`);
      if (!target) return;
      const to = boxOf(target);
      const path = flightPath(from, to);
      const delay = i * FLIGHT_STAGGER + k * 70;
      const timing = { duration: FLIGHT_MS, delay, easing: "linear" };
      const startScale = Math.min(1.6, from.height / to.height);

      play(
        target,
        path.map((p) => ({
          offset: p.offset,
          transform: `translate(${(p.x - to.x).toFixed(1)}px, ${(p.y - to.y).toFixed(1)}px) rotate(${p.lean.toFixed(2)}deg) scale(${(startScale + (1 - startScale) * p.t).toFixed(3)})`,
        })),
        timing,
      );
      play(target, [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }], timing);
      tint(target, source.colour, delay);

      if (k > 0) return;
      const endScale = to.height / from.height;
      play(
        card,
        path.map((p) => ({
          offset: p.offset,
          transform: `translate(${(p.x - from.x).toFixed(1)}px, ${(p.y - from.y).toFixed(1)}px) rotate(${p.lean.toFixed(2)}deg) scale(${(1 + (endScale - 1) * p.t).toFixed(3)})`,
        })),
        timing,
        true,
      );
      play(card, [{ opacity: 1 }, { opacity: 1, offset: 0.62 }, { opacity: 0 }], timing, true);
    });
  });
  return true;
}
