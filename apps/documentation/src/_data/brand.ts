/**
 * Brand page metadata and hero content, available as
 * `data.brand.*`.
 */
export default {
  strapline: "The Monospaced visual identity.",
  title: "Brand",
} as const;

export type BrandData = typeof import("./brand").default;
