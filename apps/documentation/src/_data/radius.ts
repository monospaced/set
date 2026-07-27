/**
 * Radius page metadata and hero content, available as `data.radius.*`.
 */
export default {
  strapline:
    "Fixed radius steps for UI surfaces; ratios scale rounding to an element's size. Use these tokens, not literal radius values.",
  title: "Radius",
} as const;

export type RadiusData = typeof import("./radius").default;
