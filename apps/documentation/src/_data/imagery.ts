/**
 * Imagery page metadata and hero content, available as `data.imagery.*`.
 */
export default {
  strapline:
    "Set's branded image treatment is a dark, two-level ordered-dither bitmap on a cyan, magenta, yellow or neutral palette axis. Process imagery with [Screen](https://screen.monospaced.com).",
  title: "Imagery",
} as const;

export type ImageryData = typeof import("./imagery").default;
