import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetShapeSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type SetShapeTone = "default" | "brand" | "support" | "neutral";
export type SetShapeVariant =
  | "corner"
  | "tile-lg"
  | "tile-slice-lg"
  | "tile-sm"
  | "tile-slice-sm"
  | "circle-lg"
  | "circle-sm";

export interface SetShapeProps {
  /** DOM id. */
  id?: string;
  /** Size mode. @default "md" */
  size?: SetShapeSize;
  /** Tone. @default "default" */
  tone?: SetShapeTone;
  /** Shape variant. @default "corner" */
  variant?: SetShapeVariant;
}

/**
 * Builds the IR tree for the Set shape component.
 *
 * @param props - Shape component props.
 * @returns IR node for a masked shape element.
 */
export function buildSetShape({
  id,
  variant = "corner",
  tone = "default",
  size = "md",
}: SetShapeProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-shape",
      "data-size": size,
      "data-tone":
        tone === "neutral" || tone === "brand" || tone === "support"
          ? tone
          : undefined,
      "data-variant": variant,
      id: normalizedId,
    },
    children: [],
  };
}

/**
 * SSR renderer for the Set shape component.
 *
 * @param props - Shape component props.
 * @returns HTML string for a masked shape element.
 */
export function renderSetShape(props: SetShapeProps = {}): string {
  return serializeSetNode(buildSetShape(props));
}

/** Declarative shape contract mirror for tooling, docs, and adapters. */
export const SET_SHAPE_SPEC: SetComponentSpec = {
  name: "shape",
  description: "Use `shape` to render brand visual language components.",
  output: { element: "div", class: "set-shape" },
  content: { kind: "none" },
  props: {
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    variant: {
      default: "corner",
      description: "Shape to render.",
      type: {
        kind: "enum",
        values: [
          "corner",
          "tile-lg",
          "tile-slice-lg",
          "tile-sm",
          "tile-slice-sm",
          "circle-lg",
          "circle-sm",
        ],
      },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: {
        kind: "enum",
        values: ["default", "neutral", "brand", "support"],
      },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl", "fill"] },
    },
  },
  events: {},
  rules: {
    attributes: [
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
          values: ["neutral", "brand", "support"],
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
