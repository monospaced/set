import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";
import { buildSetText } from "../text/text";

export type SetBlockquoteSize = "md" | "lg";

export interface SetBlockquoteProps {
  /** Text alignment. @default "start" */
  align?: SetAlign;
  /** Trusted attribution HTML. */
  attribution: string;
  /** DOM id. */
  id?: string;
  /** Applies max measure constraints for long-form readability. @default true */
  monospaced?: boolean;
  /** Trusted quote HTML. */
  quote: string;
  /** Enables breakpoint-responsive type sizing. @default false */
  responsive?: boolean;
  /** Quote size. @default "md" */
  size?: SetBlockquoteSize;
}

/**
 * Builds the IR tree for the Set blockquote component.
 *
 * @param props - Blockquote component props.
 * @returns IR node for a blockquote wrapper.
 */
export function buildSetBlockquote({
  align = "start",
  attribution,
  id,
  monospaced = true,
  quote,
  responsive = false,
  size = "md",
}: SetBlockquoteProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "figure",
    attrs: {
      class: "set-blockquote",
      "data-align": align === "start" ? undefined : align,
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "blockquote",
        attrs: { class: "quote" },
        children: [
          buildSetText({
            align,
            as: "p",
            children: quote,
            monospaced,
            responsive,
            size,
          }),
        ],
      },
      {
        kind: "element",
        tag: "figcaption",
        attrs: { class: "attribution" },
        children: [
          buildSetText({
            as: "span",
            children: attribution,
            responsive,
            size: "sm",
          }),
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Set blockquote component.
 *
 * @param props - Blockquote component props.
 * @returns HTML string for a blockquote wrapper.
 */
export function renderSetBlockquote(props: SetBlockquoteProps): string {
  return serializeSetNode(buildSetBlockquote(props));
}

/** Declarative blockquote contract mirror for tooling, docs, and adapters. */
export const SET_BLOCKQUOTE_SPEC: SetComponentSpec = {
  name: "blockquote",
  description: "Use `blockquote` to display a quote with attribution.",
  output: { element: "figure", class: "set-blockquote" },
  content: {
    kind: "slots",
    slots: [
      { prop: "quote", kind: "html" },
      { prop: "attribution", kind: "html" },
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    attribution: {
      description:
        "Attribution shown beneath the quote. Supports inline markup such as `<a>`, `<cite>`, `<em>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    monospaced: {
      default: true,
      description: "Caps line length for comfortable reading.",
      type: { kind: "boolean" },
    },
    quote: {
      description:
        "Quote content. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    responsive: {
      default: false,
      description: "Scales type across breakpoints.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant for the quote.",
      type: { kind: "enum", values: ["md", "lg"] },
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
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
