/**
 * Site-wide field data, available in any template as `data.site.*`.
 * Eleventy auto-loads files in `_data/` and namespaces them by filename.
 */
export default {
  title: "Set System",
  description:
    "Set is Monospaced's brand design system for digital experiences, a reference implementation for its design systems practice, and a testbed for new approaches.",
  organization: "Monospaced",
  url: "https://set.monospaced.com",
} as const;

export type SiteData = typeof import("./site").default;
