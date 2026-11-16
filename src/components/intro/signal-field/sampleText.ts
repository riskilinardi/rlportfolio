export interface TextSample {
  box: DOMRect;
  /** Viewport positions covering the glyphs, flattened as x, y, highlight (1 or 0). */
  points: number[];
}

/** Gradient text (background-clip: text) has a transparent fill. */
function isHighlight(style: CSSStyleDeclaration) {
  const fill = style.getPropertyValue("-webkit-text-fill-color");
  return fill === "transparent" || fill === "rgba(0, 0, 0, 0)";
}

/**
 * Points covering the glyphs of `el`, sampled every `step` pixels and thinned
 * at random to at most `maxPoints`. Each glyph is drawn to a canvas where it
 * sits on screen, in its own font: plain text in red and highlighted text in
 * green, so a single pass tells them apart.
 */
export function sampleText(el: HTMLElement, maxPoints: number, step: number): TextSample {
  const box = el.getBoundingClientRect();
  // Room for descenders and italic overhangs outside the element's box.
  const pad = Math.ceil((parseFloat(getComputedStyle(el).fontSize) || 16) * 0.45) + 4;
  const width = Math.ceil(box.width) + pad * 2;
  const height = Math.ceil(box.height) + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { box, points: [] };

  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    const style = getComputedStyle(node.parentElement ?? el);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fillStyle = isHighlight(style) ? "#00ff00" : "#ff0000";
    for (let i = 0; i < text.length; i++) {
      if (!text[i].trim()) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getClientRects()[0];
      if (!rect) continue;
      const metrics = ctx.measureText(text[i]);
      const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
      ctx.fillText(text[i], rect.left - box.left + pad, rect.top - box.top + pad + ascent);
    }
  }

  const data = ctx.getImageData(0, 0, width, height).data;
  const points: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > 128) {
        points.push(box.left + x - pad, box.top + y - pad, data[i + 1] > data[i] ? 1 : 0);
      }
    }
  }

  const count = points.length / 3;
  if (count <= maxPoints) return { box, points };
  const keep = maxPoints / count;
  const kept: number[] = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() < keep) kept.push(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
  }
  return { box, points: kept };
}
