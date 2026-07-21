import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetExpanderSize = "sm" | "md" | "lg";

export interface SetExpanderProps {
  /** Optional id of the controlled element (emitted as `aria-controls`). */
  controlsId?: string;
  /** Expanded state. @default false */
  expanded?: boolean;
  /** DOM id. */
  id?: string;
  /** Accessible label for the toggle control. @default "Menu" */
  label?: string;
  /** Size variant. @default "md" */
  size?: SetExpanderSize;
}

const expanderLabelDefault = "Menu";

/**
 * Builds the IR tree for the Set expander control.
 *
 * @param props - Expander component props.
 * @returns IR node for a toggle button.
 */
export function buildSetExpander({
  controlsId,
  expanded,
  id,
  label = expanderLabelDefault,
  size = "md",
}: SetExpanderProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedLabel = label.trim() === "" ? expanderLabelDefault : label;

  return {
    kind: "element",
    tag: "button",
    attrs: {
      "aria-controls": controlsId || undefined,
      "aria-expanded": expanded ? "true" : "false",
      class: "set-expander",
      "data-size": size,
      id: normalizedId,
      type: "button",
    },
    children: [
      {
        kind: "element",
        tag: "span",
        attrs: { class: "expander-box" },
        children: [
          {
            kind: "element",
            tag: "span",
            attrs: { class: "expander-inner" },
            children: [],
          },
          {
            kind: "element",
            tag: "span",
            attrs: { class: "visually-hidden" },
            children: [{ kind: "text", value: normalizedLabel }],
          },
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Set expander control.
 *
 * Emits a semantic `button` with accessible text and animated line glyph
 * wrapper markup.
 *
 * @param props - Expander component props.
 * @returns HTML string for a toggle button.
 */
export function renderSetExpander(props: SetExpanderProps = {}): string {
  return serializeSetNode(buildSetExpander(props));
}

/** Declarative expander contract mirror for tooling, docs, and adapters. */
export const SET_EXPANDER_SPEC: SetComponentSpec = {
  name: "expander",
  description:
    "Use `expander` as a toggle for disclosure regions such as menus.",
  output: { element: "button", class: "set-expander" },
  content: { kind: "text", prop: "label" },
  props: {
    controlsId: {
      description: "`id` of the element this toggle controls.",
      type: { kind: "string" },
    },
    expanded: {
      default: false,
      description: "Whether the controlled region is expanded.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    label: {
      default: expanderLabelDefault,
      description: "Accessible label.",
      type: { kind: "text" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "button" },
      },
      {
        target: { on: "host" },
        attribute: "aria-expanded",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{expanded}" },
      },
      {
        target: { on: "host" },
        attribute: "aria-controls",
        condition: { kind: "when-non-empty", prop: "controlsId" },
        value: { kind: "prop", prop: "controlsId" },
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
