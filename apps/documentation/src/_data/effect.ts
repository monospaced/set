/**
 * Effect page metadata and hero content, available as `data.effect.*`.
 */
export default {
  strapline:
    "Set’s effect tokens apply elevation, emphasis, and decorative treatment. Reach for them in custom CSS instead of hand-tuned values.",
  title: "Effect",
} as const;

export type EffectData = typeof import("./effect").default;
