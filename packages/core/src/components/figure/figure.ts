import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign, SetInlineSize } from "../../types";
import { buildSetText } from "../text/text";

export interface SetFigureProps {
  /** Alignment within available space. @default "start" */
  align?: SetAlign;
  /** Trusted caption HTML. */
  caption: string;
  /** Trusted media HTML (typically a `renderSetImage` result). */
  children: string;
  /** DOM id. */
  id?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: SetInlineSize;
  /** Enables breakpoint-responsive type sizing for the caption. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Set figure component.
 *
 * @param props - Figure component props.
 * @returns IR node for a figure wrapper.
 */
export function buildSetFigure({
  align = "start",
  caption,
  children,
  id,
  inlineSize = "full",
  responsive = false,
}: SetFigureProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "figure",
    attrs: {
      class: "set-figure",
      "data-align": align === "start" ? undefined : align,
      "data-inline-size": inlineSize === "full" ? undefined : inlineSize,
      id: normalizedId,
    },
    children: [
      { kind: "raw", html: children },
      {
        kind: "element",
        tag: "figcaption",
        attrs: { class: "figcaption" },
        children: [
          buildSetText({
            as: "span",
            children: caption,
            responsive,
            size: "sm",
          }),
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Set figure component.
 *
 * @param props - Figure component props.
 * @returns HTML string for a figure wrapper.
 */
export function renderSetFigure(props: SetFigureProps): string {
  return serializeSetNode(buildSetFigure(props));
}

/** Declarative figure contract mirror for tooling, docs, and adapters. */
export const SET_FIGURE_SPEC: SetComponentSpec = {
  name: "figure",
  description: "Use `figure` to present media with a caption.",
  output: { element: "figure", class: "set-figure" },
  content: {
    kind: "slots",
    slots: [
      { prop: "children", kind: "html" },
      { prop: "caption", kind: "html" },
    ],
  },
  props: {
    align: {
      default: "start",
      description: "Alignment within available space.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    caption: {
      description:
        "Caption shown below the media. Supports inline markup such as `<em>`, `<strong>`, `<cite>`, etc.",
      required: true,
      type: { kind: "html" },
    },
    children: {
      description: "Media rendered inside the figure.",
      required: true,
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description:
        "Whether the figure fills its container or shrinks to fit the media.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    responsive: {
      default: false,
      description: "Scales the caption across breakpoints.",
      type: { kind: "boolean" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
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
