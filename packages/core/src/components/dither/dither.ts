import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAspectRatio } from "../../types";

export type SetDitherDirection =
  "inline-start" | "inline-end" | "block-start" | "block-end";
export type SetDitherCell = "sm" | "md" | "lg" | "xl";
export type SetDitherTone =
  | "default"
  | "subtle"
  | "brand"
  | "brandSecondary"
  | "brandTertiary"
  | "brandSupport"
  | "brandSupportSecondary"
  | "brandSupportTertiary";

/** Ordered dither levels: 0 to 16 cells of a 4×4 Bayer matrix. */
const DITHER_LEVELS = 16;

/**
 * Snaps a 0–100 density to one of the 17 dither levels. Only 0 is empty and
 * only 100 is solid: anything between snaps to levels 1 to 15, so a density
 * of 1 still shows a dot per tile and 99 still leaves a gap.
 */
export function ditherLevel(density: number): number {
  if (density <= 0) return 0;
  if (density >= 100) return DITHER_LEVELS;
  return Math.min(
    DITHER_LEVELS - 1,
    Math.max(1, Math.round((density / 100) * DITHER_LEVELS)),
  );
}

export interface SetDitherProps {
  /** Aspect ratio of the box. Applies to any axis without an explicit size. */
  aspectRatio?: SetAspectRatio;
  /** Block size in pixels, snapped to whole cells. Fills the parent when omitted. */
  blockSize?: number;
  /** Content rendered over the dither. */
  children?: string;
  /** Density from empty at 0 to solid at 100, snapped to 17 levels (0–16). @default 50 */
  density?: number;
  /** DOM id. */
  id?: string;
  /** Inline size in pixels, snapped to whole cells and never wider than the parent. Fills the parent when omitted. */
  inlineSize?: number;
  /** Ramp the dither from the selected edge, fading to empty at the opposite end. */
  ramp?: SetDitherDirection;
  /** Cell size. @default "md" */
  cell?: SetDitherCell;
  /** Semantic tone. Only `default` and `subtle` are contrast-safe for children. With `brand*` tones, place any children on a solid background, such as a Box. @default "default" */
  tone?: SetDitherTone;
}

/**
 * Builds the IR tree for the Set dither component.
 *
 * @param props - Dither component props.
 * @returns IR node for a dither container.
 */
export function buildSetDither({
  aspectRatio,
  blockSize,
  cell = "md",
  inlineSize,
  children,
  density = 50,
  id,
  ramp,
  tone = "default",
}: SetDitherProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  // Pixel sizes travel as rem custom properties, as Image's do; the
  // stylesheet snaps each to whole cells and falls back to filling the parent.
  const styleChunks: string[] = [];
  if (blockSize)
    styleChunks.push(`--set-dither-block-size: ${blockSize / 16}rem`);
  if (inlineSize)
    styleChunks.push(`--set-dither-inline-size: ${inlineSize / 16}rem`);

  const level = ditherLevel(density);

  // A ramp is one band per level from `density` down to empty, in visual
  // order. The band index anchors the tile phase so the pattern runs unbroken
  // across band edges; the level picks the tile. The ramp starts dense at the
  // `ramp` edge and fades toward the opposite one.
  const bands: SetNode[] = ramp
    ? Array.from({ length: level + 1 }, (_, index) => {
        const denseAtStart = ramp === "inline-start" || ramp === "block-start";
        const bandLevel = denseAtStart ? level - index : index;
        return {
          kind: "element",
          tag: "span",
          attrs: {
            class: "band",
            "data-band": String(index),
            "data-level": String(bandLevel),
          },
          children: [],
        };
      })
    : [];

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-dither",
      "data-aspect-ratio": aspectRatio,
      "data-block-size": blockSize ? "" : undefined,
      "data-inline-size": inlineSize ? "" : undefined,
      "data-level": String(level),
      "data-ramp": ramp,
      "data-cell": cell,
      "data-tone": tone === "default" ? undefined : tone,
      id: normalizedId,
      style: styleChunks.length > 0 ? styleChunks.join("; ") : undefined,
    },
    children: [
      ...(ramp
        ? [
            {
              kind: "element" as const,
              tag: "span",
              attrs: { class: "ramp", "aria-hidden": "true" },
              children: bands,
            },
          ]
        : []),
      ...(children ? [{ kind: "raw" as const, html: children }] : []),
    ],
  };
}

/**
 * SSR renderer for the Set dither component.
 *
 * @param props - Dither component props.
 * @returns HTML string for a dither container.
 */
export function renderSetDither(props: SetDitherProps = {}): string {
  return serializeSetNode(buildSetDither(props));
}

/** Declarative dither contract mirror for tooling, docs, and adapters. */
export const SET_DITHER_SPEC: SetComponentSpec = {
  name: "dither",
  description:
    "Use `dither` to render an ordered dither as a graphic or behind content.",
  output: { element: "div", class: "set-dither" },
  content: { kind: "html", prop: "children" },
  props: {
    aspectRatio: {
      description:
        "Aspect ratio of the box. Applies to any axis without an explicit size.",
      type: { kind: "enum", values: ["1:1", "4:5", "3:2", "16:9", "21:9"] },
    },
    blockSize: {
      description:
        "Block size in pixels, snapped to whole cells. Fills the parent when omitted.",
      type: { kind: "number" },
    },
    children: {
      description: "Content rendered over the dither.",
      type: { kind: "html" },
    },
    density: {
      default: 50,
      description:
        "Density from empty at 0 to solid at 100, snapped to 17 levels (0–16).",
      type: { kind: "number", min: 0, max: 100 },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    inlineSize: {
      description:
        "Inline size in pixels, snapped to whole cells and never wider than the parent. Fills the parent when omitted.",
      type: { kind: "number" },
    },
    ramp: {
      description:
        "Ramp the dither from the selected edge, fading to empty at the opposite end.",
      type: {
        kind: "enum",
        values: ["inline-start", "inline-end", "block-start", "block-end"],
      },
    },
    cell: {
      default: "md",
      description: "Cell size.",
      type: { kind: "enum", values: ["sm", "md", "lg", "xl"] },
    },
    tone: {
      default: "default",
      description:
        "Semantic tone. Only `default` and `subtle` are contrast-safe for children. With `brand*` tones, place any children on a solid background, such as a Box.",
      type: {
        kind: "enum",
        values: [
          "default",
          "subtle",
          "brand",
          "brandSecondary",
          "brandTertiary",
          "brandSupport",
          "brandSupportSecondary",
          "brandSupportTertiary",
        ],
      },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-aspect-ratio",
        condition: { kind: "when-provided", prop: "aspectRatio" },
        value: { kind: "prop", prop: "aspectRatio" },
      },
      {
        target: { on: "host" },
        attribute: "data-block-size",
        condition: { kind: "when-truthy", prop: "blockSize" },
      },
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-truthy", prop: "inlineSize" },
      },
      {
        target: { on: "host" },
        attribute: "data-ramp",
        condition: { kind: "when-provided", prop: "ramp" },
        value: { kind: "prop", prop: "ramp" },
      },
      {
        target: { on: "host" },
        attribute: "data-cell",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "cell" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: [
            "subtle",
            "brand",
            "brandSecondary",
            "brandTertiary",
            "brandSupport",
            "brandSupportSecondary",
            "brandSupportTertiary",
          ],
        },
        value: { kind: "prop", prop: "tone" },
      },
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
