/**
 * Site-wide field data, available in any template as `data.site.*`.
 * Eleventy auto-loads files in `_data/` and namespaces them by filename.
 */
export default {
  title: "Set Design System",
  description:
    "Set is Measured’s brand design system for digital experiences, a reference implementation for our design systems practice, and a testbed for new approaches.",
  organization: "Measured",
  url: "https://set.measured.co",
} as const;

export type SiteData = typeof import("./site").default;
