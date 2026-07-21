import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetStatusTone } from "../../types";

export type SetBadgeSize = "sm" | "md";

export interface SetBadgeProps {
  /** Positions the badge as a floating overlay. */
  floating?: boolean;
  /** DOM id. */
  id?: string;
  /** Badge text content. Escaped as plain text. */
  label: string;
  /** Badge size. @default "md" */
  size?: SetBadgeSize;
  /** Semantic tone variant. */
  tone?: SetStatusTone;
}

/**
 * Builds the IR tree for the Set badge component.
 *
 * @param props - Badge component props.
 * @returns IR node for a badge element.
 */
export function buildSetBadge({
  floating,
  id,
  label,
  size = "md",
  tone,
}: SetBadgeProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "span",
    attrs: {
      class: "set-badge",
      "data-floating": floating,
      "data-size": size,
      "data-tone": tone || undefined,
      id: normalizedId,
    },
    children: [{ kind: "text", value: label }],
  };
}

/**
 * SSR renderer for the Set badge component.
 *
 * @param props - Badge component props.
 * @returns HTML string for a badge element.
 */
export function renderSetBadge(props: SetBadgeProps): string {
  return serializeSetNode(buildSetBadge(props));
}

/** Declarative badge contract mirror for tooling, docs, and adapters. */
export const SET_BADGE_SPEC: SetComponentSpec = {
  name: "badge",
  description: "Use `badge` to annotate content with a short label.",
  output: { element: "span", class: "set-badge" },
  content: { kind: "text", prop: "label" },
  props: {
    floating: {
      default: false,
      description: "Positions the badge as a floating overlay.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    label: {
      description: "Badge text.",
      required: true,
      type: { kind: "text" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    tone: {
      description: "Semantic tone.",
      type: { kind: "enum", values: ["info", "success", "warning", "error"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-floating",
        condition: { kind: "when-truthy", prop: "floating" },
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
        condition: { kind: "when-provided", prop: "tone" },
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
