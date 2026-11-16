"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { Rgb } from "@/lib/colour";
import {
  DEFAULT_LIGHT,
  FLOATS,
  GRID,
  HALF,
  MAX_HITS,
  MAX_HOLES,
  MAX_RIPPLES,
  MAX_SOURCES,
  MAX_STREAMS,
  RIPPLE,
  SEARCH_R,
  SEARCH_TAU,
} from "./config";
import { gridMask, landingPoint, type Point } from "./geometry";
import { sampleText } from "./sampleText";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";

/*
 * The intro's dot grid as a WebGL point field, so every dot can move: search
 * shockwaves, light streaming into the Source cards, particles that pour out
 * of the cards to form the answer, and then paint the hero headline.
 *
 * Dots are never drawn over the "occluders" (the terminal and the cards).
 * Without WebGL it renders nothing and the CSS dot grid stays visible.
 * Coordinates are CSS pixels from the viewport's top left.
 */

export interface SignalFieldHandle {
  /** The terminal first, then the Source cards. */
  setOccluders(elements: (HTMLElement | null)[]): void;
  /** A shockwave from `origin`; a few dots it passes stream light into `target`, arriving in `landMs`. */
  search(origin: Point, target: DOMRect, landMs: number, colour?: Rgb): void;
  check(origin: Point): void;
  /**
   * Particles pour out of `sources` and fill in the answer's letters; the real
   * text takes over after `revealMs`. `headline` is sampled now for release().
   */
  form(
    answer: HTMLElement,
    revealMs: number,
    options: { sources: { rect: DOMRect; colour: Rgb }[]; headline: HTMLElement | null },
  ): void;
  /** Starts the handoff. Returns true if the particles will paint the headline. */
  release(): boolean;
}

interface Tracked {
  el: HTMLElement;
  box: DOMRect;
}

/** State shared by the draw loop and the handle. Times are seconds; -1 means not yet. */
interface Field {
  now(): number;
  view: { width: number; height: number };
  grid: Point[];
  particles: Float32Array;
  upload(): void;
  ripples: Float32Array;
  hits: Float32Array;
  streamA: Float32Array;
  streamB: Float32Array;
  streamColours: Float32Array;
  sourceColours: Float32Array;
  next: { ripple: number; hit: number; stream: number };
  occluders: HTMLElement[];
  holes: Float32Array;
  answer: Tracked | null;
  headline: Tracked | null;
  funnel: Point;
  formAt: number;
  revealAt: number;
  releaseAt: number;
}

const toUnit = (colour: Rgb) => colour.map((c) => c / 255);

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function addRipple(field: Field, at: Point, start: number, kind: number) {
  field.ripples.set([at[0], at[1], start, kind], (field.next.ripple++ % MAX_RIPPLES) * 4);
}

function inHoles(field: Field, x: number, y: number) {
  for (let i = 0; i < MAX_HOLES; i++) {
    const [left, top, right, bottom] = field.holes.subarray(i * 4, i * 4 + 4);
    if (right > left && x > left && x < right && y > top && y < bottom) return true;
  }
  return false;
}

export function SignalField({ ref }: { ref: Ref<SignalFieldHandle> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<Field | null>(null);

  useImperativeHandle(ref, () => ({
    setOccluders(elements) {
      const field = fieldRef.current;
      if (field) field.occluders = elements.filter((el): el is HTMLElement => Boolean(el));
    },

    search(origin, target, landMs, colour = DEFAULT_LIGHT) {
      const field = fieldRef.current;
      if (!field) return;
      const now = field.now();
      const landAt = now + landMs / 1000;
      addRipple(field, origin, now, RIPPLE.search);

      // Matches are dots outside the terminal that the wave reaches early
      // enough for their light to arrive on time.
      const terminal = field.occluders[0]?.getBoundingClientRect();
      const minRadius = terminal ? Math.hypot(terminal.width / 2, terminal.height / 2) + 30 : 200;
      const latest = landMs / 1000 - 0.3;
      const maxRadius = Math.min(SEARCH_R * (1 - Math.exp(-latest / SEARCH_TAU)), minRadius + 220);
      const { width, height } = field.view;
      const candidates = field.grid.filter(([x, y]) => {
        const d = Math.hypot(x - origin[0], y - origin[1]);
        return (
          d >= minRadius && d <= maxRadius &&
          x > 30 && x < width - 30 && y > 30 && y < height - 30 &&
          gridMask(x, y, width, height) > 0.2 && !inHoles(field, x, y)
        );
      });

      let impactAt: Point | null = null;
      for (let n = 0; n < 2 && candidates.length; n++) {
        const hit = candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0];
        const d = Math.hypot(hit[0] - origin[0], hit[1] - origin[1]);
        const hitAt = now - SEARCH_TAU * Math.log(1 - d / SEARCH_R);
        field.hits.set([hit[0], hit[1], hitAt, 0], (field.next.hit++ % MAX_HITS) * 4);
        addRipple(field, hit, hitAt, RIPPLE.impact);
        // Across first, then up or down into the target.
        const end = landingPoint(hit, target);
        const slot = field.next.stream++ % MAX_STREAMS;
        field.streamA.set([hit[0], hit[1], end[0], hit[1]], slot * 4);
        field.streamB.set([end[0], end[1], hitAt, Math.max(0.2, landAt - hitAt)], slot * 4);
        field.streamColours.set(toUnit(colour), slot * 3);
        impactAt ??= end;
      }
      if (impactAt) addRipple(field, impactAt, landAt, RIPPLE.impact);
    },

    check(origin) {
      const field = fieldRef.current;
      if (field) addRipple(field, origin, field.now(), RIPPLE.check);
    },

    form(answerEl, revealMs, { sources, headline: headlineEl }) {
      const field = fieldRef.current;
      if (!field) return;
      const { width, height } = field.view;
      const large = width * height > 700_000;
      const answer = sampleText(answerEl, large ? 1600 : 700, 2);
      if (!answer.points.length) return;
      const headline = headlineEl ? sampleText(headlineEl, large ? 2600 : 900, large ? 4 : 3) : null;
      // Without a headline, particles just rise and fade.
      const headlinePoints = headline?.points.length
        ? headline.points
        : answer.points.map((v, i) => (i % 3 === 1 ? v - 300 : v));

      const palette = (sources.length ? sources : [{ rect: new DOMRect(), colour: DEFAULT_LIGHT }])
        .slice(0, MAX_SOURCES);
      palette.forEach(({ colour }, i) => field.sourceColours.set(toUnit(colour), i * 3));
      const fromCards = palette.some(({ rect }) => rect.width > 0);
      const gridStarts = field.grid.filter(
        ([x, y]) => gridMask(x, y, width, height) > 0.3 && !inHoles(field, x, y),
      );

      const answerCount = answer.points.length / 3;
      const headlineCount = headlinePoints.length / 3;
      const count = Math.max(answerCount, headlineCount);
      const particles = new Float32Array(count * FLOATS);
      for (let i = 0; i < count; i++) {
        const source = i % palette.length;
        const card = palette[source].rect;
        // From anywhere inside its card, or from the grid where there is no card (phones).
        const [hx, hy] =
          card.width > 0
            ? [card.left + 12 + Math.random() * (card.width - 24), card.top + 12 + Math.random() * (card.height - 24)]
            : (gridStarts[Math.floor(Math.random() * gridStarts.length)] ?? [width / 2, height / 2]);
        const a = (i % answerCount) * 3;
        const b = (i % headlineCount) * 3;
        // Spare particles double up on a point, slightly offset.
        const jitter = i >= answerCount ? 0.8 : 0;
        const ax = answer.points[a] + (Math.random() - 0.5) * jitter;
        const ay = answer.points[a + 1] + (Math.random() - 0.5) * jitter;
        const kind = 1 + answer.points[a + 2] + headlinePoints[b + 2] * 2;
        particles.set(
          [hx, hy, ax, ay, headlinePoints[b], headlinePoints[b + 1], Math.random(), Math.random(), kind, source],
          i * FLOATS,
        );
      }

      field.particles = particles;
      field.answer = { el: answerEl, box: answer.box };
      field.headline = headline?.points.length && headlineEl ? { el: headlineEl, box: headline.box } : null;
      field.funnel = fromCards ? [answer.box.right + 60, answer.box.top + answer.box.height / 2] : [-1, -1];
      field.formAt = field.now();
      field.revealAt = field.formAt + revealMs / 1000;
      const centre: Point = [answer.box.left + answer.box.width / 2, answer.box.top + answer.box.height / 2];
      addRipple(field, centre, field.revealAt, RIPPLE.lock);
      field.upload();
    },

    release() {
      const field = fieldRef.current;
      if (!field) return false;
      field.releaseAt = field.now();
      return Boolean(field.headline && field.particles.length);
    },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const attribute = (name: string, size: number, offset: number) => {
      const location = gl.getAttribLocation(program, name);
      if (location < 0) return;
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, FLOATS * 4, offset * 4);
    };
    attribute("aHome", 2, 0);
    attribute("aTarget", 2, 2);
    attribute("aTarget2", 2, 4);
    attribute("aSeed", 2, 6);
    attribute("aKind", 1, 8);
    attribute("aSource", 1, 9);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const u = {
      view: uniform("uView"),
      scale: uniform("uScale"),
      time: uniform("uTime"),
      ripples: uniform("uRipples"),
      hits: uniform("uHits"),
      streamA: uniform("uStreamA"),
      streamB: uniform("uStreamB"),
      streamColour: uniform("uStreamColour"),
      sourceColours: uniform("uSourceColours"),
      holes: uniform("uHoles"),
      formAt: uniform("uFormAt"),
      revealAt: uniform("uRevealAt"),
      releaseAt: uniform("uReleaseAt"),
      answerShift: uniform("uAnswerShift"),
      answerSpan: uniform("uAnswerSpan"),
      headlineShift: uniform("uHeadlineShift"),
      headlineSpan: uniform("uHeadlineSpan"),
      funnel: uniform("uFunnel"),
    };

    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const start = performance.now();
    // vec4 slots with start time -1, i.e. unused.
    const unused = (n: number) => {
      const slots = new Float32Array(n * 4);
      for (let i = 0; i < n; i++) slots[i * 4 + 2] = -1;
      return slots;
    };
    const colours = (n: number) => {
      const slots = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) slots.set(toUnit(DEFAULT_LIGHT), i * 3);
      return slots;
    };

    let vertexCount = 0;
    const field: Field = {
      now: () => (performance.now() - start) / 1000,
      view: { width: 0, height: 0 },
      grid: [],
      particles: new Float32Array(0),
      upload() {
        const data = new Float32Array(this.grid.length * FLOATS + this.particles.length);
        this.grid.forEach(([x, y], i) =>
          data.set([x, y, x, y, x, y, Math.random(), Math.random(), 0, 0], i * FLOATS),
        );
        data.set(this.particles, this.grid.length * FLOATS);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
        vertexCount = data.length / FLOATS;
      },
      ripples: unused(MAX_RIPPLES),
      hits: unused(MAX_HITS),
      streamA: new Float32Array(MAX_STREAMS * 4),
      streamB: unused(MAX_STREAMS),
      streamColours: colours(MAX_STREAMS),
      sourceColours: colours(MAX_SOURCES),
      next: { ripple: 0, hit: 0, stream: 0 },
      occluders: [],
      holes: new Float32Array(MAX_HOLES * 4),
      answer: null,
      headline: null,
      funnel: [-1, -1],
      formAt: -1,
      revealAt: -1,
      releaseAt: -1,
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      field.view = { width, height };
      field.grid = [];
      for (let y = HALF; y < height; y += GRID) {
        for (let x = HALF; x < width; x += GRID) field.grid.push([x, y]);
      }
      field.upload();
    };
    resize();
    window.addEventListener("resize", resize);
    fieldRef.current = field;
    // Hides the CSS fallback grid (see globals.css).
    canvas.dataset.ready = "true";

    const shiftOf = (tracked: Tracked | null): Point => {
      if (!tracked) return [0, 0];
      const rect = tracked.el.getBoundingClientRect();
      return [rect.left - tracked.box.left, rect.top - tracked.box.top];
    };

    let frame = 0;
    const draw = () => {
      // Holes follow the tilting terminal and cards. The terminal stops being
      // one at the handoff, while it fades out.
      field.holes.fill(0);
      field.occluders.slice(0, MAX_HOLES).forEach((el, i) => {
        if (i === 0 && field.releaseAt > 0) return;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) field.holes.set([rect.left - 4, rect.top - 4, rect.right + 4, rect.bottom + 4], i * 4);
      });
      const answerShift = shiftOf(field.answer);
      const headlineShift = shiftOf(field.headline);

      gl.uniform2f(u.view, field.view.width, field.view.height);
      gl.uniform1f(u.scale, scale);
      gl.uniform1f(u.time, field.now());
      gl.uniform4fv(u.ripples, field.ripples);
      gl.uniform4fv(u.hits, field.hits);
      gl.uniform4fv(u.streamA, field.streamA);
      gl.uniform4fv(u.streamB, field.streamB);
      gl.uniform3fv(u.streamColour, field.streamColours);
      gl.uniform3fv(u.sourceColours, field.sourceColours);
      gl.uniform4fv(u.holes, field.holes);
      gl.uniform1f(u.formAt, field.formAt);
      gl.uniform1f(u.revealAt, field.revealAt);
      gl.uniform1f(u.releaseAt, field.releaseAt);
      gl.uniform2f(u.answerShift, answerShift[0], answerShift[1]);
      gl.uniform2f(u.answerSpan, field.answer?.box.left ?? 0, field.answer?.box.width ?? 1);
      gl.uniform2f(u.headlineShift, headlineShift[0], headlineShift[1]);
      gl.uniform2f(u.headlineSpan, field.headline?.box.left ?? 0, field.headline?.box.width ?? 1);
      gl.uniform2f(u.funnel, field.funnel[0], field.funnel[1]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, vertexCount);
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      fieldRef.current = null;
      delete canvas.dataset.ready;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
