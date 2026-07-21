/**
 * Motion page metadata and hero content, available as `data.motion.*`.
 */
export default {
  strapline:
    "Durations and easing curves for transitions and animation. Use these tokens so motion stays consistent across the system.",
  title: "Motion",
} as const;

export type MotionData = typeof import("./motion").default;
