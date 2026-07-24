import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetSurfaceVariant } from "../surface/surface";

export type SetBoxBackground = "default" | "panel" | "transparent";
export type SetBoxPadding =
  | "none"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl";
export type SetBoxRadius = "sm" | "md";

export interface SetBoxProps {
  /** Background treatment. @default "default" */
  background?: SetBoxBackground;
  /** Subtle border. @default false */
  border?: boolean;
  /** Trusted inner HTML. */
  children?: string;
  /** DOM id. */
  id?: string;
  /** Inner block-axis spacing scale. @default "md" */
  paddingBlock?: SetBoxPadding;
  /** Inner inline-axis spacing scale. @default "md" */
  paddingInline?: SetBoxPadding;
  /** Corner radius size. */
  radius?: SetBoxRadius;
  /** Responsive block-axis padding. @default false */
  responsive?: boolean;
  /** Surface context. */
  surface?: SetSurfaceVariant;
}

/**
 * Builds the IR tree for the Set box component.
 *
 * @param props - Box component props.
 * @returns IR node for a box wrapper.
 */
export function buildSetBox({
  background = "default",
  border,
  children,
  id,
  paddingBlock = "md",
  paddingInline = "md",
  radius,
  responsive,
  surface,
}: SetBoxProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-box",
      "data-background": background === "default" ? undefined : background,
      "data-border": border,
      "data-set-surface": surface,
      "data-padding-block": paddingBlock,
      "data-padding-inline": paddingInline,
      "data-radius": radius,
      "data-responsive": responsive,
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set box component.
 *
 * @param props - Box component props.
 * @returns HTML string for a box wrapper.
 */
export function renderSetBox(props: SetBoxProps): string {
  return serializeSetNode(buildSetBox(props));
}

/** Declarative box contract mirror for tooling, docs, and adapters. */
export const SET_BOX_SPEC: SetComponentSpec = {
  name: "box",
  description: "Use `box` to inset content.",
  output: { element: "div", class: "set-box" },
  content: { kind: "html", prop: "children" },
  props: {
    background: {
      default: "default",
      description: "Background treatment.",
      type: { kind: "enum", values: ["default", "panel", "transparent"] },
    },
    border: {
      default: false,
      description: "Shows a subtle border around the box.",
      type: { kind: "boolean" },
    },
    children: {
      description: "Content rendered inside the box.",
      type: { kind: "html" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    paddingBlock: {
      default: "md",
      description: "Vertical padding.",
      type: {
        kind: "enum",
        values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
      },
    },
    paddingInline: {
      default: "md",
      description: "Horizontal padding.",
      type: {
        kind: "enum",
        values: ["none", "2xs", "xs", "sm", "md", "lg", "xl", "2xl"],
      },
    },
    radius: {
      description: "Corner radius.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    responsive: {
      default: false,
      description: "Scales vertical padding across breakpoints.",
      type: { kind: "boolean" },
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
        attribute: "data-background",
        condition: {
          kind: "when-in",
          prop: "background",
          values: ["panel", "transparent"],
        },
        value: { kind: "prop", prop: "background" },
      },
      {
        target: { on: "host" },
        attribute: "data-border",
        condition: { kind: "when-truthy", prop: "border" },
      },
      {
        target: { on: "host" },
        attribute: "data-padding-block",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "paddingBlock" },
      },
      {
        target: { on: "host" },
        attribute: "data-padding-inline",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "paddingInline" },
      },
      {
        target: { on: "host" },
        attribute: "data-radius",
        condition: { kind: "when-provided", prop: "radius" },
        value: { kind: "prop", prop: "radius" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive",
        condition: { kind: "when-truthy", prop: "responsive" },
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
