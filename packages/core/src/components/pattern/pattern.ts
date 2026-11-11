import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetPatternSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type SetPatternTone =
  "default" | "subtle" | "brand" | "brandSecondary" | "brandTertiary";
export type SetPatternVariant =
  "tile" | "tileLight" | "tileDark" | "dither" | "ditherRamp";
export type SetPatternCell = "dot" | "character";
export type SetPatternDirection =
  "inline-start" | "inline-end" | "block-start" | "block-end";

/** Ordered dither levels: 0 to 16 cells of a 4×4 Bayer matrix. */
const DITHER_LEVELS = 16;

/** Snaps a 0–100 density to the nearest of the 17 dither levels. */
export function ditherLevel(density: number): number {
  const clamped = Math.min(100, Math.max(0, density));
  return Math.round((clamped / 100) * DITHER_LEVELS);
}

export interface SetPatternProps {
  /** Cell shape for the dither variants: square dots, or 1:2 character cells. @default "dot" */
  cell?: SetPatternCell;
  /** Trusted inner HTML rendered inside the pattern container. */
  children?: string;
  /** Ink density for the `dither` variant, 0–100, snapped to 17 levels. @default 50 */
  density?: number;
  /** The end a `ditherRamp` fades toward. @default "inline-end" */
  direction?: SetPatternDirection;
  /** DOM id. */
  id?: string;
  /** Pattern variant. @default "tile" */
  variant?: SetPatternVariant;
  /** Tone. @default "default" */
  tone?: SetPatternTone;
  /** Size mode. @default "md" */
  size?: SetPatternSize;
}

/**
 * Builds the IR tree for the Set pattern component.
 *
 * @param props - Pattern component props.
 * @returns IR node for a pattern container.
 */
export function buildSetPattern({
  cell = "dot",
  children,
  density = 50,
  direction = "inline-end",
  id,
  size = "md",
  tone = "default",
  variant = "tile",
}: SetPatternProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const isRamp = variant === "ditherRamp";

  // The ramp is 17 bands, one per level, in visual order. The band index
  // anchors the tile phase so the pattern runs unbroken across band edges;
  // the level picks the tile. A ramp fades toward `direction`, so the solid
  // end is the opposite edge.
  const bands: SetNode[] = isRamp
    ? Array.from({ length: DITHER_LEVELS + 1 }, (_, index) => {
        const fromStart =
          direction === "inline-end" || direction === "block-end";
        const level = fromStart ? DITHER_LEVELS - index : index;
        return {
          kind: "element",
          tag: "span",
          attrs: {
            class: "band",
            "data-band": String(index),
            "data-level": String(level),
          },
          children: [],
        };
      })
    : [];

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-pattern",
      "data-cell": cell === "character" ? cell : undefined,
      "data-direction":
        isRamp && direction !== "inline-end" ? direction : undefined,
      "data-level":
        variant === "dither" ? String(ditherLevel(density)) : undefined,
      "data-size": size,
      "data-tone": tone === "default" ? undefined : tone,
      "data-variant": variant,
      id: normalizedId,
    },
    children: [
      ...(isRamp
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
 * SSR renderer for the Set pattern component.
 *
 * @param props - Pattern component props.
 * @returns HTML string for a pattern container.
 */
export function renderSetPattern(props: SetPatternProps = {}): string {
  return serializeSetNode(buildSetPattern(props));
}

/** Declarative pattern contract mirror for tooling, docs, and adapters. */
export const SET_PATTERN_SPEC: SetComponentSpec = {
  name: "pattern",
  description:
    "Use `pattern` to render repeated visual language components behind content.",
  output: { element: "div", class: "set-pattern" },
  content: { kind: "html", prop: "children" },
  props: {
    cell: {
      default: "dot",
      description:
        "Cell shape for the dither variants: square dots, or 1:2 character cells. For a flat 25%, 50% or 75% in character cells, use the tile variants.",
      type: { kind: "enum", values: ["dot", "character"] },
    },
    children: {
      description: "Content rendered above the pattern.",
      type: { kind: "html" },
    },
    density: {
      default: 50,
      description:
        "Ink density for the `dither` variant, 0–100, snapped to 17 levels.",
      type: { kind: "number", min: 0, max: 100 },
    },
    direction: {
      default: "inline-end",
      description: "The end a `ditherRamp` fades toward.",
      type: {
        kind: "enum",
        values: ["inline-start", "inline-end", "block-start", "block-end"],
      },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: {
        kind: "enum",
        values: [
          "default",
          "subtle",
          "brand",
          "brandSecondary",
          "brandTertiary",
        ],
      },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl", "fill"] },
    },
    variant: {
      default: "tile",
      description:
        "Shape used for the pattern tile. `dither` is an ordered dither at `density`; `ditherRamp` steps from solid to empty toward `direction`.",
      type: {
        kind: "enum",
        values: ["tile", "tileLight", "tileDark", "dither", "ditherRamp"],
      },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-cell",
        condition: { kind: "when-equals", prop: "cell", to: "character" },
        value: { kind: "prop", prop: "cell" },
      },
      {
        target: { on: "host" },
        attribute: "data-direction",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "variant", to: "ditherRamp" },
            {
              kind: "when-in",
              prop: "direction",
              values: ["inline-start", "block-start", "block-end"],
            },
          ],
        },
        value: { kind: "prop", prop: "direction" },
      },
      {
        target: { on: "host" },
        attribute: "data-variant",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "variant" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["subtle", "brand", "brandSecondary", "brandTertiary"],
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
