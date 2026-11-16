/** Smoothly scrolls to an element by id (instantly with reduced motion). Returns false if it is not on the page. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  return true;
}

/** Copies text to the clipboard, with a fallback for browsers that block the Clipboard API. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

/**
 * Reloads with ?intro. A full load is needed: whether the intro plays is decided
 * by an inline script before first paint (see layout.tsx), not by React.
 */
export function replayIntro() {
  window.location.search = "intro";
}
