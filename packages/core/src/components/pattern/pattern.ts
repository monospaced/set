import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAspectRatio } from "../../types";

export type SetPatternCell = "xs" | "sm" | "md" | "lg" | "xl";
export type SetPatternTone =
  | "default"
  | "subtle"
  | "brand"
  | "brandSecondary"
  | "brandTertiary"
  | "brandSupport"
  | "brandSupportSecondary"
  | "brandSupportTertiary";
export type SetPatternVariant = "tile" | "tileLight" | "tileDark";

export interface SetPatternProps {
  /** Aspect ratio of the box. Applies to any axis without an explicit size. */
  aspectRatio?: SetAspectRatio;
  /** Block size in pixels, snapped to whole cells. Fills the parent when omitted. */
  blockSize?: number;
  /** Content rendered over the pattern. */
  children?: string;
  /** DOM id. */
  id?: string;
  /** Inline size in pixels, snapped to whole cells and never wider than the parent. Fills the parent when omitted. */
  inlineSize?: number;
  /** Shape used for the pattern tile. @default "tile" */
  variant?: SetPatternVariant;
  /** Semantic tone. Only `default` and `subtle` are contrast-safe for children. With `brand*` tones, place any children on a solid background, such as a Box. @default "default" */
  tone?: SetPatternTone;
  /** Cell size. @default "md" */
  cell?: SetPatternCell;
}

/**
 * Builds the IR tree for the Set pattern component.
 *
 * @param props - Pattern component props.
 * @returns IR node for a pattern container.
 */
export function buildSetPattern({
  aspectRatio,
  blockSize,
  cell = "md",
  children,
  inlineSize,
  id,
  tone = "default",
  variant = "tile",
}: SetPatternProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  // Pixel sizes travel as rem custom properties, as Image's do; the
  // stylesheet snaps each to whole cells and falls back to filling the parent.
  const styleChunks: string[] = [];
  if (blockSize)
    styleChunks.push(`--set-pattern-block-size: ${blockSize / 16}rem`);
  if (inlineSize)
    styleChunks.push(`--set-pattern-inline-size: ${inlineSize / 16}rem`);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-pattern",
      "data-aspect-ratio": aspectRatio,
      "data-block-size": blockSize ? "" : undefined,
      "data-inline-size": inlineSize ? "" : undefined,
      "data-cell": cell,
      "data-tone": tone === "default" ? undefined : tone,
      "data-variant": variant,
      id: normalizedId,
      style: styleChunks.length > 0 ? styleChunks.join("; ") : undefined,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
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
    "Use `pattern` to render a repeating brand tile as a graphic or behind content.",
  output: { element: "div", class: "set-pattern" },
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
      description: "Content rendered over the pattern.",
      type: { kind: "html" },
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
    cell: {
      default: "md",
      description: "Cell size.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl"] },
    },
    variant: {
      default: "tile",
      description: "Shape used for the pattern tile.",
      type: {
        kind: "enum",
        values: ["tile", "tileLight", "tileDark"],
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
        attribute: "data-variant",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "variant" },
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
