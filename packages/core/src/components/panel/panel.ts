import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetSurfaceVariant } from "../surface/surface";

export type SetPanelPadding = "xs" | "sm" | "md" | "lg" | "xl";

export interface SetPanelProps {
  /** Trusted inner HTML. */
  children?: string;
  /** DOM id. */
  id?: string;
  /** Inner spacing scale. @default "md" */
  padding?: SetPanelPadding;
  /** Surface context. */
  surface?: SetSurfaceVariant;
}

/**
 * Builds the IR tree for the Set panel component.
 *
 * @param props - Panel component props.
 * @returns IR node for a panel wrapper.
 */
export function buildSetPanel({
  children,
  id,
  padding = "md",
  surface,
}: SetPanelProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-panel",
      "data-padding": padding,
      "data-set-surface": surface,
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set panel component.
 *
 * @param props - Panel component props.
 * @returns HTML string for a panel wrapper.
 */
export function renderSetPanel(props: SetPanelProps): string {
  return serializeSetNode(buildSetPanel(props));
}

/** Declarative panel contract mirror for tooling, docs, and adapters. */
export const SET_PANEL_SPEC: SetComponentSpec = {
  name: "panel",
  description: "Use `panel` to group related content in a contained region.",
  output: { element: "div", class: "set-panel" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the panel.",
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    padding: {
      default: "md",
      description: "Inner spacing scale.",
      type: { kind: "enum", values: ["xs", "sm", "md", "lg", "xl"] },
    },
    surface: {
      description: "Surface context.",
      type: {
        kind: "enum",
        values: ["default", "brand", "inverse", "brand-inverse"],
      },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-padding",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "padding" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-surface",
        condition: { kind: "when-provided", prop: "surface" },
        value: { kind: "prop", prop: "surface" },
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
