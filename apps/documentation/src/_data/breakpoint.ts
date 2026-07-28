/**
 * Breakpoint page metadata and hero content, available as `data.breakpoint.*`.
 */
export default {
  strapline:
    "Set's breakpoints mark the viewport widths where layouts adapt. Reference these tokens in custom media and container queries; design from the smallest up.",
  title: "Breakpoint",
} as const;

export type BreakpointData = typeof import("./breakpoint").default;
