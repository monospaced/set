import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign, SetHeadingLevel } from "../../types";
export type SetHeadingSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

export interface SetHeadingProps {
  /** Heading content. Supports inline markup such as `<a>`, `<em>`, `<strong>`, etc. */
  children: string;
  /** Text alignment. @default "start" */
  align?: SetAlign;
  /** DOM id. */
  id?: string;
  /** Semantic heading level; omit to render a `span`. */
  level?: SetHeadingLevel;
  /** Enables visited-state styling for links inside the heading. @default true */
  linkVisited?: boolean;
  /** Enables optical alignment for left sidebearing-heavy glyphs. @default false */
  opticalAlign?: boolean;
  /** Enables breakpoint-responsive heading scale. @default false */
  responsive?: boolean;
  /** Heading size. @default "md" */
  size?: SetHeadingSize;
}

/**
 * Builds the IR tree for the Set heading component.
 *
 * @param props - Heading component props.
 * @returns IR node for a heading element (`h1`..`h6`) or `span`.
 */
export function buildSetHeading({
  align = "start",
  children,
  id,
  level,
  linkVisited = true,
  opticalAlign,
  responsive,
  size = "md",
}: SetHeadingProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const tag = level ? (`h${level}` as const) : "span";
  return {
    kind: "element",
    tag,
    attrs: {
      class: "set-heading",
      "data-align": align === "start" ? undefined : align,
      "data-link-visited": linkVisited ? undefined : "off",
      "data-optical-align": opticalAlign,
      "data-responsive": responsive,
      "data-size": size,
      id: normalizedId,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Set heading component.
 *
 * @param props - Heading component props.
 * @returns HTML string for a heading element (`h1`..`h6`) or `span`.
 */
export function renderSetHeading(props: SetHeadingProps): string {
  return serializeSetNode(buildSetHeading(props));
}

/** Declarative heading contract mirror for tooling, docs, and adapters. */
export const SET_HEADING_SPEC: SetComponentSpec = {
  name: "heading",
  description: "Use `heading` to render heading text with consistent type.",
  output: {
    element: {
      kind: "switch",
      prop: "level",
      cases: {
        "1": "h1",
        "2": "h2",
        "3": "h3",
        "4": "h4",
        "5": "h5",
        "6": "h6",
      },
    },
    class: "set-heading",
  },
  content: { kind: "html", prop: "children" },
  props: {
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    children: {
      description:
        "Heading content. Supports inline markup such as `<a>`, `<em>`, `<strong>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    level: {
      description: "Semantic heading level. Renders a `<span>` when omitted.",
      type: { kind: "enum", values: [1, 2, 3, 4, 5, 6] },
    },
    linkVisited: {
      default: true,
      description: "Styles visited links inside the heading.",
      type: { kind: "boolean" },
    },
    opticalAlign: {
      default: false,
      description:
        "Optically aligns left sidebearing-heavy glyphs with the content edge.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales type across breakpoints.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
      },
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
          values: ["center", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-link-visited",
        condition: { kind: "when-equals", prop: "linkVisited", to: false },
        value: { kind: "literal", text: "off" },
      },
      {
        target: { on: "host" },
        attribute: "data-optical-align",
        condition: { kind: "when-truthy", prop: "opticalAlign" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
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
