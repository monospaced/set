/**
 * Typography page metadata and hero content, available as `data.typography.*`.
 */
export default {
  strapline:
    "Set's typography tokens drive type size, weight, and rhythm. Compose with the typographic components first; reach for these tokens only when authoring custom type.",
  title: "Typography",
} as const;

export type TypographyData = typeof import("./typography").default;
