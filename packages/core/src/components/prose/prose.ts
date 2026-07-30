import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";

export type SetProseHangingPunctuation = "always" | "notebook";

export interface SetProseProps {
  /** Trusted inner HTML. */
  children: string;
  /** Text alignment. @default "start" */
  align?: SetAlign;
  /** Hanging-indent layout behavior. */
  hangingPunctuation?: SetProseHangingPunctuation;
  /** DOM id. */
  id?: string;
  /** Applies max measure constraints for long-form readability. @default true */
  measured?: boolean;
  /** Enables breakpoint-responsive body scale. @default false */
  responsive?: boolean;
}

/**
 * Builds the IR tree for the Set prose component.
 *
 * @param props - Prose component props.
 * @returns IR node for a prose wrapper.
 */
export function buildSetProse({
  align = "start",
  children,
  hangingPunctuation,
  id,
  measured = true,
  responsive,
}: SetProseProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-prose",
      "data-align": align !== "start" ? align : undefined,
      "data-hanging-punctuation": hangingPunctuation,
      "data-measured": measured,
      "data-responsive": responsive,
      id: normalizedId,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Set prose component.
 *
 * @param props - Prose component props.
 * @returns HTML string for a prose wrapper.
 */
export function renderSetProse(props: SetProseProps): string {
  return serializeSetNode(buildSetProse(props));
}

/** Declarative prose contract mirror for tooling, docs, and adapters. */
export const SET_PROSE_SPEC: SetComponentSpec = {
  name: "prose",
  description: "Use `prose` to style rich-text markup.",
  output: { element: "div", class: "set-prose" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the prose wrapper.",
      required: true,
      type: { kind: "html" },
    },
    align: {
      default: "start",
      description: "Text alignment.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    hangingPunctuation: {
      description:
        "Position list markers and leading quote marks in the margin, with text aligned.",
      type: { kind: "enum", values: ["always", "notebook"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    measured: {
      default: true,
      description: "Caps line length for comfortable reading.",
      type: { kind: "boolean" },
    },
    responsive: {
      default: false,
      description: "Scales body text across breakpoints.",
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
          values: ["center", "end"],
        },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-hanging-punctuation",
        condition: { kind: "when-provided", prop: "hangingPunctuation" },
        value: { kind: "prop", prop: "hangingPunctuation" },
      },
      {
        target: { on: "host" },
        attribute: "data-measured",
        condition: { kind: "when-truthy", prop: "measured" },
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
