import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";

export type SetTextAs = "p" | "span";
export type SetTextSize = "xs" | "sm" | "md" | "lg";
export type SetTextTone = "default" | "muted";

export interface SetTextProps {
  /** Text content. Supports inline markup such as `<em>`, `<strong>`, `<a>`, `<code>`, `<cite>`, etc. */
  children: string;
  /** Element tag. @default "span" */
  as?: SetTextAs;
  /** Text alignment. Ignored when `as` is `span`. @default "start" */
  align?: SetAlign;
  /** DOM id. */
  id?: string;
  /** Enables visited-state styling for links inside text. @default true */
  linkVisited?: boolean;
  /** Applies max measure constraints for long-form readability. Ignored when `as` is `span`. @default true */
  measured?: boolean;
  /** Enables breakpoint-responsive body scale. @default false */
  responsive?: boolean;
  /** Text size. @default "md" */
  size?: SetTextSize;
  /** Tone variant. @default "default" */
  tone?: SetTextTone;
}

/**
 * Builds the IR tree for the Set text component.
 *
 * @param props - Text component props.
 * @returns IR node for a text paragraph or span element.
 */
export function buildSetText({
  align,
  as,
  children,
  id,
  linkVisited = true,
  measured,
  responsive,
  size = "md",
  tone = "default",
}: SetTextProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const tag: SetTextAs = as === "p" ? "p" : "span";
  const isParagraph = tag === "p";
  const resolvedAlign = isParagraph ? (align ?? "start") : undefined;
  const resolvedMeasured = isParagraph ? (measured ?? true) : undefined;

  return {
    kind: "element",
    tag,
    attrs: {
      class: "set-text",
      "data-align":
        resolvedAlign && resolvedAlign !== "start" ? resolvedAlign : undefined,
      "data-link-visited": linkVisited ? undefined : "off",
      "data-measured": resolvedMeasured,
      "data-responsive": responsive,
      "data-size": size,
      "data-tone": tone === "muted" ? "muted" : undefined,
      id: normalizedId,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Set text component.
 *
 * @param props - Text component props.
 * @returns HTML string for a text paragraph or span element.
 */
export function renderSetText(props: SetTextProps): string {
  return serializeSetNode(buildSetText(props));
}

/** Declarative text contract mirror for tooling, docs, and adapters. */
export const SET_TEXT_SPEC: SetComponentSpec = {
  name: "text",
  description: "Use `text` for inline or paragraph body copy.",
  output: {
    element: { kind: "switch", prop: "as", cases: { p: "p", span: "span" } },
    class: "set-text",
  },
  content: { kind: "html", prop: "children" },
  props: {
    as: {
      default: "span",
      description: "HTML element used for the text.",
      type: { kind: "enum", values: ["p", "span"] },
    },
    children: {
      description:
        "Text content. Supports inline markup such as `<em>`, `<strong>`, `<a>`, `<code>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    linkVisited: {
      default: true,
      description: "Styles visited links inside the text.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales text across breakpoints.",
      type: { kind: "boolean" },
    },
    align: {
      default: "start",
      description: "Text alignment.",
      ignoredWhen: "`as` is span",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      ignoredWhen: "`as` is span",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "muted"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "as", to: "p" },
            { kind: "when-in", prop: "align", values: ["center", "end"] },
          ],
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
        attribute: "data-measured",
        condition: {
          kind: "all",
          of: [
            { kind: "when-equals", prop: "as", to: "p" },
            { kind: "when-truthy", prop: "measured" },
          ],
        },
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
        attribute: "data-tone",
        condition: { kind: "when-equals", prop: "tone", to: "muted" },
        value: { kind: "literal", text: "muted" },
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
