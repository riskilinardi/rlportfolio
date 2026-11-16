/** A soft glow fading out from the centre, drawn without a CSS blur filter. */
export const softGlow = (rgb: string) =>
  `radial-gradient(circle closest-side, rgba(${rgb}, 0.55) 0%, rgba(${rgb}, 0.42) 22%, rgba(${rgb}, 0.21) 48%, rgba(${rgb}, 0.06) 74%, transparent 100%)`;

/*
 * The glow behind the page. Gradients only, no `filter: blur()`: Safari
 * (every iOS browser) blurs static elements on the CPU, and at a phone's 3x
 * resolution these large blurs took seconds to paint on every page load.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div
        className="absolute w-[1040px] h-[1040px] opacity-30 -top-[312px] -left-[312px]"
        style={{ background: softGlow("31, 111, 235") }}
      />
      <div
        className="absolute w-[800px] h-[800px] opacity-20 -bottom-[196px] -right-[196px]"
        style={{ background: softGlow("88, 166, 255") }}
      />
      <div
        className="absolute w-[680px] h-[680px] opacity-15 top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: softGlow("121, 192, 255") }}
      />
      <div className="absolute inset-0 grid-overlay" />
    </div>
  );
}
