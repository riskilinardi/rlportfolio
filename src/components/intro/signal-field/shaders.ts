import {
  HEADLINE_PAINT_MS,
  MAX_HITS,
  MAX_HOLES,
  MAX_RIPPLES,
  MAX_SOURCES,
  MAX_STREAMS,
  PAGE_GRID,
  SEARCH_R,
  SEARCH_TAU,
} from "./config";

/*
 * One vertex shader draws everything as points. aKind 0 is a grid dot, moved
 * by ripples, lit by hits and streams. Anything else is an evidence particle:
 * kind = 1, +1 if its answer point is a highlighted word, +2 if its headline
 * point is. Times are in seconds; -1 means "not yet".
 */
export const VERTEX_SHADER = `
precision highp float;
attribute vec2 aHome;
attribute vec2 aTarget;
attribute vec2 aTarget2;
attribute vec2 aSeed;
attribute float aKind;
attribute float aSource;

uniform vec2 uView;
uniform float uScale;
uniform float uTime;
uniform vec4 uRipples[${MAX_RIPPLES}]; // x, y, start, kind
uniform vec4 uHits[${MAX_HITS}];       // x, y, start, -
uniform vec4 uStreamA[${MAX_STREAMS}]; // from.xy, corner.xy
uniform vec4 uStreamB[${MAX_STREAMS}]; // to.xy, start, duration
uniform vec3 uStreamColour[${MAX_STREAMS}];
uniform vec3 uSourceColours[${MAX_SOURCES}];
uniform vec4 uHoles[${MAX_HOLES}];     // left, top, right, bottom
uniform float uFormAt;
uniform float uRevealAt;
uniform float uReleaseAt;
uniform vec2 uAnswerShift;   // how far the answer moved since it was sampled
uniform vec2 uAnswerSpan;    // left, width when sampled
uniform vec2 uHeadlineShift;
uniform vec2 uHeadlineSpan;
uniform vec2 uFunnel;        // where poured particles converge (x < 0: none)

varying vec3 vColour;
varying float vAlpha;
varying float vRadius;
varying float vSprite;
varying float vHalo;

const vec3 ANSWER_WHITE = vec3(0.85, 0.94, 1.0);
const vec3 ANSWER_BLUE = vec3(0.47, 0.75, 1.0);
const vec3 HEADLINE_WHITE = vec3(0.95, 0.98, 1.0);
const vec3 HEADLINE_BLUE = vec3(0.40, 0.68, 1.0);

float easeInOut(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) * 0.5;
}

vec2 bezier(vec2 a, vec2 c, vec2 b, float t) {
  float u = 1.0 - t;
  return u * u * a + 2.0 * u * t * c + t * t * b;
}

vec3 sourceColour(float s) {
  if (s < 0.5) return uSourceColours[0];
  if (s < 1.5) return uSourceColours[1];
  return uSourceColours[2];
}

void main() {
  vec2 pos = aHome;
  vec3 colour = vec3(1.0);
  float alpha = 0.0;
  float radius = 1.0;
  float halo = 0.0;

  if (aKind < 0.5) {
    // Grid dot: same elliptical fade as the CSS fallback grid.
    vec2 q = (aHome / uView - vec2(0.5, 0.45)) / vec2(0.79, 0.71);
    float mask = 1.0 - smoothstep(0.15, 0.65, length(q));
    vec3 tintSum = vec3(0.0);
    float glow = 0.0;

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 r = uRipples[i];
      float t = uTime - r.z;
      if (r.z < 0.0 || t < 0.0) continue;
      float kind = r.w;
      float R = ${SEARCH_R}.0;
      float tau = ${SEARCH_TAU};
      float life = 1.9;
      float strength = 1.0;
      vec3 front = vec3(0.20, 0.45, 1.0);
      vec3 peak = vec3(0.50, 0.84, 1.0);
      vec3 tail = vec3(0.55, 0.40, 1.0);
      if (kind > 0.5 && kind < 1.5) {          // impact
        R = 150.0; tau = 0.16; life = 0.7; strength = 0.85;
      } else if (kind > 1.5 && kind < 2.5) {   // check
        R = 2000.0; tau = 1.25; life = 2.2; strength = 1.25;
        front = vec3(0.05, 0.65, 0.45); peak = vec3(0.45, 1.0, 0.75); tail = vec3(0.10, 0.80, 0.55);
      } else if (kind > 2.5) {                 // lock-in
        R = 1000.0; tau = 0.55; life = 1.3; strength = 0.9;
        front = vec3(0.45, 0.70, 1.0); peak = vec3(0.88, 0.96, 1.0); tail = vec3(0.62, 0.62, 1.0);
      }
      if (t > life) continue;
      vec2 d = aHome - r.xy;
      float dist = length(d);
      float x = dist - R * (1.0 - exp(-t / tau));
      float amp = strength * pow(1.0 - t / life, 1.6);
      float crest = exp(-x * x / 900.0);
      // Two fainter echoes trail behind the crest.
      float echo = x < 0.0 ? exp(x / 120.0) * pow(0.5 + 0.5 * cos(6.2832 * x / 70.0), 4.0) * 0.6 : 0.0;
      float e = amp * (crest + echo);
      vec2 dir = dist > 0.001 ? d / dist : vec2(0.0);
      pos += dir * amp * (crest * 9.0 + echo * 3.0);
      vec3 tint = x > 0.0
        ? mix(peak, front, clamp(x / 30.0, 0.0, 1.0))
        : mix(peak, tail, clamp(-x / 40.0, 0.0, 1.0));
      tintSum += tint * e;
      glow += e;
    }

    for (int i = 0; i < ${MAX_HITS}; i++) {
      vec4 h = uHits[i];
      float t = uTime - h.z;
      if (h.z < 0.0 || t < 0.0 || t > 1.4) continue;
      if (distance(aHome, h.xy) < 2.0) {
        float f = exp(-t / 0.45) * 2.4;
        tintSum += vec3(1.0, 0.97, 0.9) * f;
        glow += f;
      }
    }

    // Streams run along two grid segments: from -> corner -> to.
    for (int i = 0; i < ${MAX_STREAMS}; i++) {
      vec4 A = uStreamA[i];
      vec4 B = uStreamB[i];
      float t = uTime - B.z;
      if (B.z < 0.0 || t < 0.0 || t > B.w + 0.5) continue;
      vec2 S = A.xy;
      vec2 C = A.zw;
      vec2 sc = C - S;
      vec2 ce = B.xy - C;
      float len1 = length(sc);
      float len2 = length(ce);
      float h1 = clamp(dot(aHome - S, sc) / max(dot(sc, sc), 1.0), 0.0, 1.0);
      float h2 = clamp(dot(aHome - C, ce) / max(dot(ce, ce), 1.0), 0.0, 1.0);
      float d1 = length(aHome - (S + sc * h1));
      float d2 = length(aHome - (C + ce * h2));
      float along = d1 <= d2 ? h1 * len1 : len1 + h2 * len2;
      float off = min(d1, d2);
      float head = (len1 + len2) * easeInOut(clamp(t / B.w, 0.0, 1.0));
      float behind = head - along;
      float trail = behind >= 0.0 ? exp(-behind / 80.0) : 0.0;
      float spark = exp(-behind * behind / 260.0) * 1.5;
      float fade = 1.0 - clamp((t - B.w) / 0.5, 0.0, 1.0);
      float e = exp(-off * off / 18.0) * (trail + spark) * fade * 1.3;
      tintSum += uStreamColour[i] * e;
      glow += e;
    }

    for (int i = 0; i < ${MAX_HOLES}; i++) {
      vec4 h = uHoles[i];
      if (h.z > h.x && aHome.x > h.x && aHome.x < h.z && aHome.y > h.y && aHome.y < h.w) {
        mask = 0.0;
        glow = 0.0;
      }
    }

    float lit = clamp(glow, 0.0, 1.5);
    alpha = 0.075 * mask + clamp(lit, 0.0, 1.0) * mix(0.35, 1.0, mask);
    radius = 1.0 + 2.2 * clamp(lit, 0.0, 1.2);
    if (glow > 0.001) colour = mix(tintSum / glow, vec3(1.0), clamp(lit - 1.1, 0.0, 0.4));
    halo = alpha > 0.12 ? 0.55 : 0.0;

    // Handoff: slide onto the nearest line of the page grid, then fade out.
    if (uReleaseAt > 0.0) {
      float p = easeInOut(clamp((uTime - uReleaseAt - aSeed.x * 0.15) / 0.85, 0.0, 1.0));
      vec2 delta = floor(aHome / ${PAGE_GRID}.0 + 0.5) * ${PAGE_GRID}.0 - aHome;
      vec2 toLine = abs(delta.x) < abs(delta.y) ? vec2(delta.x, 0.0) : vec2(0.0, delta.y);
      pos = mix(pos, aHome + toLine, p);
      float fadeOut = 1.0 - clamp((uTime - uReleaseAt - 0.9) / 0.7, 0.0, 1.0);
      alpha = mix(alpha, 0.1, p) * fadeOut;
      colour = mix(colour, vec3(0.75, 0.85, 1.0), p);
      halo = 0.0;
    }
  } else if (uFormAt >= 0.0) {
    vec2 target = aTarget + uAnswerShift;
    float flags = aKind - 1.0;
    vec3 answerEnd = mod(flags, 2.0) > 0.5 ? ANSWER_BLUE : ANSWER_WHITE;
    bool headlineBlue = flags > 1.5;

    // 1. Pour from the card into the answer, right side first, braiding on the way.
    float xn = clamp((aTarget.x - uAnswerSpan.x) / max(uAnswerSpan.y, 1.0), 0.0, 1.0);
    float p = clamp((uTime - uFormAt - (1.0 - xn) * 0.25 - aSeed.x * 0.1) / 0.65, 0.0, 1.0);
    float e = easeInOut(p);
    vec2 ctrl;
    if (uFunnel.x > 0.0) {
      ctrl = uFunnel + vec2(0.0, (aSeed.y - 0.5) * 60.0);
    } else {
      vec2 dir = target - aHome;
      vec2 perp = vec2(-dir.y, dir.x) / max(length(dir), 1.0);
      ctrl = (aHome + target) * 0.5 + perp * (aSeed.y - 0.5) * 280.0;
    }
    pos = bezier(aHome, ctrl, target, e);
    vec2 path = target - aHome;
    vec2 normal = vec2(-path.y, path.x) / max(length(path), 1.0);
    pos += normal * sin(e * 9.42 + aSource * 2.094) * 14.0 * sin(3.1416 * e);
    colour = mix(sourceColour(aSource), answerEnd, smoothstep(0.55, 1.0, e));
    radius = 0.9 + 0.9 * sin(3.1416 * e);
    halo = mix(0.45, 0.1, smoothstep(0.8, 1.0, p));

    // 2. Lock-in: a sweep along the line, a flash, then fade under the real text.
    float sweepX = mix(uAnswerSpan.x, uAnswerSpan.x + uAnswerSpan.y,
      clamp((uTime - (uRevealAt - 0.3)) / 0.3, 0.0, 1.0)) + uAnswerShift.x;
    float sweep = (uTime > uRevealAt - 0.3 && uTime < uRevealAt + 0.05)
      ? exp(-pow(target.x - sweepX, 2.0) / 1600.0) : 0.0;
    float lockT = uTime - uRevealAt;
    float flash = lockT >= 0.0 ? exp(-lockT / 0.2) : 0.0;
    colour = mix(colour, vec3(1.0), clamp(flash + sweep, 0.0, 1.0));
    radius += 0.9 * flash + 0.6 * sweep;
    halo = max(halo, 0.5 * clamp(flash + sweep, 0.0, 1.0));
    float settled = 1.0 - clamp((uTime - (uRevealAt + 0.1)) / 0.45, 0.0, 1.0);
    alpha = smoothstep(0.0, 0.2, p) * settled * 0.95;

    // 3. Handoff: lift out of the answer and paint the headline, left to right.
    if (uReleaseAt > 0.0) {
      vec2 to = aTarget2 + uHeadlineShift;
      float hx = clamp((aTarget2.x - uHeadlineSpan.x) / max(uHeadlineSpan.y, 1.0), 0.0, 1.0);
      float r = clamp((uTime - uReleaseAt - hx * 0.25 - aSeed.x * 0.1) / 0.8, 0.0, 1.0);
      float er = easeInOut(r);
      vec2 lift = (target + to) * 0.5 + vec2((aSeed.x - 0.5) * 220.0, -160.0 - aSeed.y * 140.0);
      pos = bezier(target, lift, to, er);
      float headT = uTime - (uReleaseAt + ${HEADLINE_PAINT_MS / 1000});
      float headFlash = headT >= 0.0 ? exp(-headT / 0.22) : 0.0;
      float headFade = 1.0 - clamp((headT - 0.1) / 0.5, 0.0, 1.0);
      alpha = smoothstep(0.0, 0.05, r) * headFade * 0.9;
      radius = (r < 1.0 ? 1.0 + 0.7 * sin(3.1416 * er) : 1.25) + 0.8 * headFlash;
      halo = mix(0.45, 0.12, smoothstep(0.85, 1.0, r)) + 0.4 * headFlash;
      // Blue words only flash half-way, so they stay blue under the real headline.
      vec3 headEnd = headlineBlue ? HEADLINE_BLUE : HEADLINE_WHITE;
      colour = mix(
        mix(vec3(0.62, 0.86, 1.0), headEnd, er),
        vec3(1.0),
        headFlash * (headlineBlue ? 0.45 : 1.0)
      );
    }
  }

  vRadius = radius;
  vAlpha = alpha;
  vColour = colour;
  vHalo = halo;
  // Only glowing points get room for a halo, so the faint grid stays cheap to fill.
  vSprite = radius * 2.0 + (halo > 0.0 ? 12.0 : 2.0);
  bool hidden = alpha < 0.002;
  gl_PointSize = hidden ? 0.0 : vSprite * uScale;
  gl_Position = hidden
    ? vec4(2.0, 2.0, 0.0, 1.0)
    : vec4(pos.x / uView.x * 2.0 - 1.0, 1.0 - pos.y / uView.y * 2.0, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vColour;
varying float vAlpha;
varying float vRadius;
varying float vSprite;
varying float vHalo;

void main() {
  float d = length(gl_PointCoord - 0.5) * vSprite;
  float core = 1.0 - smoothstep(vRadius - 0.5, vRadius + 0.5, d);
  // Falls to zero at the sprite edge, so the square point never shows.
  float halo = vHalo * pow(max(0.0, 1.0 - d / (vSprite * 0.5)), 2.2);
  float a = clamp(core + halo, 0.0, 1.0) * vAlpha;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vColour * a, a);
}
`;
