import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetDitherDirection =
  "inline-start" | "inline-end" | "block-start" | "block-end";
export type SetDitherSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SetDitherTone =
  "default" | "subtle" | "brand" | "brandSecondary" | "brandTertiary";

/** Ordered dither levels: 0 to 16 cells of a 4×4 Bayer matrix. */
const DITHER_LEVELS = 16;

/** Snaps a 0–100 density to the nearest of the 17 dither levels. */
export function ditherLevel(density: number): number {
  const clamped = Math.min(100, Math.max(0, density));
  return Math.round((clamped / 100) * DITHER_LEVELS);
}

export interface SetDitherProps {
  /** Trusted inner HTML rendered above the dither. */
  children?: string;
  /** Density of the dither, 0–100, snapped to 17 levels. Ignored when `ramp` is set. @default 50 */
  density?: number;
  /** DOM id. */
  id?: string;
  /** Ramp from solid to empty, fading toward this end. */
  ramp?: SetDitherDirection;
  /** Cell size. @default "md" */
  size?: SetDitherSize;
  /** Colour of the dither. `default` and `subtle` are contrast-safe for content composed over them; the brand tones are decorative, so set composed content on a solid background. @default "default" */
  tone?: SetDitherTone;
}

/**
 * Builds the IR tree for the Set dither component.
 *
 * @param props - Dither component props.
 * @returns IR node for a dither container.
 */
export function buildSetDither({
  children,
  density = 50,
  id,
  ramp,
  size = "md",
  tone = "default",
}: SetDitherProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  // A ramp is 17 bands, one per level, in visual order. The band index
  // anchors the tile phase so the pattern runs unbroken across band edges;
  // the level picks the tile. The ramp fades toward `ramp`, so the solid end
  // is the opposite edge.
  const bands: SetNode[] = ramp
    ? Array.from({ length: DITHER_LEVELS + 1 }, (_, index) => {
        const fromStart = ramp === "inline-end" || ramp === "block-end";
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
      class: "set-dither",
      "data-level": ramp ? undefined : String(ditherLevel(density)),
      "data-ramp": ramp,
      "data-size": size,
      "data-tone": tone === "default" ? undefined : tone,
      id: normalizedId,
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
    "Use `dither` to lay a tone of ordered dither behind content: a flat density, or a ramp from solid to empty.",
  output: { element: "div", class: "set-dither" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered above the dither.",
      type: { kind: "html" },
    },
    density: {
      default: 50,
      description:
        "Density of the dither, 0–100, snapped to 17 levels. Ignored when `ramp` is set.",
      type: { kind: "number", min: 0, max: 100 },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    ramp: {
      description: "Ramp from solid to empty, fading toward this end.",
      type: {
        kind: "enum",
        values: ["inline-start", "inline-end", "block-start", "block-end"],
      },
    },
    size: {
      default: "md",
      description: "Cell size.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl"] },
    },
    tone: {
      default: "default",
      description:
        "Colour of the dither. `default` and `subtle` are contrast-safe for content composed over them; the brand tones are decorative, so set composed content on a solid background.",
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
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-ramp",
        condition: { kind: "when-provided", prop: "ramp" },
        value: { kind: "prop", prop: "ramp" },
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
