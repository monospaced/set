/**
 * Getting Started page metadata and hero content, available as
 * `data["getting-started"].*`.
 */
export default {
  strapline:
    "Set is a code-first design system distributed as npm packages for websites, web applications, and design-in-browser workflows.",
  title: "Getting started",
} as const;

export type GettingStartedData = typeof import("./getting-started").default;
