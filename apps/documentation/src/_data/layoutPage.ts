/**
 * Layout page metadata and hero content, available as `data.layoutPage.*`.
 *
 * Named `layoutPage` rather than `layout` because Eleventy reserves the
 * `layout` data key for the layout-template specifier.
 */
export default {
  strapline:
    "Structural dimensions that frame and align content. Compose with the layout components first; reach for these tokens when building custom layout.",
  title: "Layout",
} as const;

export type LayoutPageData = typeof import("./layoutPage").default;
