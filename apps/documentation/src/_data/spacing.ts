/**
 * Spacing page metadata and hero content, available as `data.spacing.*`.
 */
export default {
  strapline:
    "Set’s spacing scale sets vertical and horizontal rhythm. Use these tokens for spacing in custom CSS; prefer the responsive vertical scale at page level.",
  title: "Spacing",
} as const;

export type SpacingData = typeof import("./spacing").default;
