import type { ReactNode } from "react";

export type RevealAnimation = "fadeUp" | "fade" | "fadeLeft" | "fadeRight" | "scaleUp";

/**
 * Fades its content in as it scrolls into view, using a CSS scroll-driven
 * animation (see [data-scroll-reveal] in globals.css), so there is no
 * JavaScript involved. Without browser support the content simply shows.
 */
export function Reveal({
  children,
  animation = "fadeUp",
  className,
}: {
  children: ReactNode;
  animation?: RevealAnimation;
  className?: string;
}) {
  return (
    <div data-scroll-reveal={animation} className={className}>
      {children}
    </div>
  );
}
