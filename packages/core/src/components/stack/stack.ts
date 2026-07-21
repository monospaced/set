import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetStackAlign = "stretch" | "start" | "center" | "end";
export type SetStackAs = "div" | "ul";
export type SetStackGap = "none" | "xs" | "sm" | "md" | "lg";

export interface SetStackProps {
  /** Cross-axis alignment. @default "stretch" */
  align?: SetStackAlign;
  /** Element tag. @default "div" */
  as?: SetStackAs;
  /** Trusted inner HTML. */
  children?: string;
  /** Spacing gap size. @default "md" */
  gap?: SetStackGap;
  /** DOM id. */
  id?: string;
  /** Enables layout-context responsive spacing scale. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Set stack component.
 *
 * @param props - Stack component props.
 * @returns IR node for a stack wrapper.
 */
export function buildSetStack({
  align = "stretch",
  as = "div",
  children,
  gap = "md",
  id,
  responsive,
}: SetStackProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: as,
    attrs: {
      class: "set-stack",
      "data-align": align === "stretch" ? undefined : align,
      "data-gap": gap,
      "data-responsive": responsive,
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set stack component.
 *
 * @param props - Stack component props.
 * @returns HTML string for a stack wrapper.
 */
export function renderSetStack(props: SetStackProps): string {
  return serializeSetNode(buildSetStack(props));
}

/** Declarative stack contract mirror for tooling, docs, and adapters. */
export const SET_STACK_SPEC: SetComponentSpec = {
  name: "stack",
  description: "Use `stack` to lay out content in a vertical column.",
  output: {
    element: { kind: "switch", prop: "as", cases: { div: "div", ul: "ul" } },
    class: "set-stack",
  },
  content: { kind: "html", prop: "children" },
  props: {
    align: {
      default: "stretch",
      description: "Aligns items on the cross axis.",
      type: { kind: "enum", values: ["stretch", "start", "center", "end"] },
    },
    as: {
      default: "div",
      description: "Element tag to render. `ul` children must be `<li>`.",
      type: { kind: "enum", values: ["div", "ul"] },
    },
    children: {
      description: "Items laid out in a column.",
      type: { kind: "html" },
    },
    gap: {
      default: "md",
      description: "Space between children.",
      type: { kind: "enum", values: ["none", "xs", "sm", "md", "lg"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    responsive: {
      default: false,
      description: "Scales spacing across breakpoints.",
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
          values: ["start", "center", "end"],
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
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
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
