import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetShapeVariant } from "../shape/shape";

export type SetPatternSize = "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type SetPatternTone = "default" | "subtle" | "support";
export type SetPatternVariant = SetShapeVariant;

export interface SetPatternProps {
  /** Trusted inner HTML rendered inside the pattern container. */
  children?: string;
  /** DOM id. */
  id?: string;
  /** Pattern variant. @default "corner" */
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
  children,
  id,
  size = "md",
  tone = "default",
  variant = "corner",
}: SetPatternProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-pattern",
      "data-size": size,
      "data-tone": tone === "default" ? undefined : tone,
      "data-variant": variant,
      id: normalizedId,
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
    "Use `pattern` to render repeated visual language components behind content.",
  output: { element: "div", class: "set-pattern" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered above the pattern.",
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "subtle", "support"] },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl", "fill"] },
    },
    variant: {
      default: "corner",
      description: "Shape used for the pattern tile.",
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
          values: ["subtle", "support"],
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
