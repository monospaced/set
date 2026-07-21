import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetDividerOrientation = "horizontal" | "vertical";
export type SetDividerTone = "default" | "subtle" | "brand";

export interface SetDividerProps {
  /** DOM id. */
  id?: string;
  /** Divider orientation. @default "horizontal" */
  orientation?: SetDividerOrientation;
  /** Tone variant. @default "default" */
  tone?: SetDividerTone;
}

/**
 * Builds the IR tree for the Set divider component.
 *
 * @param props - Divider component props.
 * @returns IR node for a separator element.
 */
export function buildSetDivider({
  id,
  orientation = "horizontal",
  tone = "default",
}: SetDividerProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: orientation === "horizontal" ? "hr" : "span",
    attrs: {
      "aria-orientation": orientation === "vertical" ? "vertical" : undefined,
      class: "set-divider",
      "data-tone": tone === "subtle" || tone === "brand" ? tone : undefined,
      id: normalizedId,
      role: orientation === "vertical" ? "separator" : undefined,
    },
    children: [],
  };
}

/**
 * SSR renderer for the Set divider component.
 *
 * @param props - Divider component props.
 * @returns HTML string for a separator element.
 */
export function renderSetDivider(props: SetDividerProps = {}): string {
  return serializeSetNode(buildSetDivider(props));
}

/** Declarative divider contract mirror for tooling, docs, and adapters. */
export const SET_DIVIDER_SPEC: SetComponentSpec = {
  name: "divider",
  description: "Use `divider` to separate sections with a rule.",
  output: {
    element: {
      kind: "switch",
      prop: "orientation",
      cases: { horizontal: "hr", vertical: "span" },
    },
    class: "set-divider",
  },
  content: { kind: "none" },
  props: {
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    orientation: {
      default: "horizontal",
      description: "Divider orientation.",
      type: { kind: "enum", values: ["horizontal", "vertical"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "subtle", "brand"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "role",
        condition: { kind: "when-equals", prop: "orientation", to: "vertical" },
        value: { kind: "literal", text: "separator" },
      },
      {
        target: { on: "host" },
        attribute: "aria-orientation",
        condition: { kind: "when-equals", prop: "orientation", to: "vertical" },
        value: { kind: "literal", text: "vertical" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["subtle", "brand"],
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
