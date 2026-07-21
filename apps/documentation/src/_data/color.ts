/**
 * Color page metadata and hero content, available as `data.color.*`.
 */
export default {
  strapline:
    "Set’s color tokens adapt to theme and surface context automatically. Use them in custom CSS, never raw color values.",
  title: "Color",
} as const;

export type ColorData = typeof import("./color").default;
