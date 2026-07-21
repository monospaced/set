/**
 * Not-found (404) page content, available as `data["not-found"].*`.
 */
export default {
  headline: "404",
  message: "This page could not be found.",
  title: "Not found",
} as const;

export type NotFoundData = typeof import("./not-found").default;
