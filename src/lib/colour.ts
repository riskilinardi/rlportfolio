/** A colour as 0 to 255 RGB. */
export type Rgb = readonly [number, number, number];

export const rgba = (colour: Rgb, alpha: number) => `rgba(${colour.join(", ")}, ${alpha})`;
