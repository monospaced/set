import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";

export type SetInlineAs = "div" | "ul";
export type SetInlineGap = "2xs" | "xs" | "sm" | "md" | "lg";
export type SetInlineJustify = "start" | "center" | "end" | "between";

export interface SetInlineProps {
  /** Element tag. @default "div" */
  as?: SetInlineAs;
  /** Cross-axis alignment. @default "center" */
  align?: SetAlign;
  /** Trusted inner HTML. */
  children?: string;
  /** Spacing gap size. @default "md" */
  gap?: SetInlineGap;
  /** DOM id. */
  id?: string;
  /** Main-axis distribution. @default "start" */
  justify?: SetInlineJustify;
  /** Prevents wrapping of inline children. */
  nowrap?: boolean;
}

/**
 * Builds the IR tree for the Set inline component.
 *
 * @param props - Inline component props.
 * @returns IR node for an inline wrapper.
 */
export function buildSetInline({
  align = "center",
  as = "div",
  children,
  gap = "md",
  id,
  justify = "start",
  nowrap,
}: SetInlineProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: as,
    attrs: {
      class: "set-inline",
      "data-align": align === "center" ? undefined : align,
      "data-gap": gap,
      "data-justify": justify === "start" ? undefined : justify,
      "data-nowrap": nowrap,
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set inline component.
 *
 * @param props - Inline component props.
 * @returns HTML string for an inline wrapper.
 */
export function renderSetInline(props: SetInlineProps): string {
  return serializeSetNode(buildSetInline(props));
}

/** Declarative inline contract mirror for tooling, docs, and adapters. */
export const SET_INLINE_SPEC: SetComponentSpec = {
  name: "inline",
  description: "Use `inline` to lay out content in a horizontal row.",
  output: {
    element: { kind: "switch", prop: "as", cases: { div: "div", ul: "ul" } },
    class: "set-inline",
  },
  content: { kind: "html", prop: "children" },
  props: {
    as: {
      default: "div",
      description: "Element tag to render. `ul` children must be `<li>`.",
      type: { kind: "enum", values: ["div", "ul"] },
    },
    align: {
      default: "center",
      description: "Aligns items on the cross axis.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    children: {
      description: "Items laid out in a row.",
      type: { kind: "html" },
    },
    gap: {
      default: "md",
      description: "Space between children.",
      type: { kind: "enum", values: ["2xs", "xs", "sm", "md", "lg"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    justify: {
      default: "start",
      description: "Distributes items along the main axis.",
      type: { kind: "enum", values: ["start", "center", "end", "between"] },
    },
    nowrap: {
      description: "Prevents items from wrapping onto new lines.",
      type: { kind: "boolean" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: {
          kind: "when-in",
          prop: "align",
          values: ["start", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-gap",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "gap" },
      },
      {
        target: { on: "host" },
        attribute: "data-justify",
        condition: {
          kind: "when-in",
          prop: "justify",
          values: ["center", "end", "between"],
        },
        value: { kind: "prop", prop: "justify" },
      },
      {
        target: { on: "host" },
        attribute: "data-nowrap",
        condition: { kind: "when-truthy", prop: "nowrap" },
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
