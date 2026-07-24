import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetTheme } from "../root/root";

export type SetSurfaceVariant =
  | "default"
  | "brand"
  | "inverse"
  | "brand-inverse";

export interface SetSurfaceProps {
  /** Trusted inner HTML. */
  children: string;
  /** Absolute theme lock for content rendered inside the surface. */
  contentTheme?: SetTheme;
  /** DOM id. */
  id?: string;
  /** Surface variant. @default "default" */
  variant?: SetSurfaceVariant;
}

/**
 * Builds the IR tree for the Set surface component.
 *
 * @param props - Surface component props.
 * @returns IR node for a surface wrapper.
 */
export function buildSetSurface({
  children,
  contentTheme,
  id,
  variant = "default",
}: SetSurfaceProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-surface",
      "data-set-content-theme": contentTheme,
      "data-set-surface": variant,
      id: normalizedId,
    },
    children: [{ kind: "raw", html: children }],
  };
}

/**
 * SSR renderer for the Set surface component.
 *
 * @param props - Surface component props.
 * @returns HTML string for a surface wrapper.
 */
export function renderSetSurface(props: SetSurfaceProps): string {
  return serializeSetNode(buildSetSurface(props));
}

/** Declarative surface contract mirror for tooling, docs, and adapters. */
export const SET_SURFACE_SPEC: SetComponentSpec = {
  name: "surface",
  description: "Use `surface` to set a colour context for nested content.",
  output: { element: "div", class: "set-surface" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the surface.",
      required: true,
      type: { kind: "html" },
    },
    contentTheme: {
      description:
        "Absolute theme lock for content rendered inside the surface.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    variant: {
      default: "default",
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
        attribute: "data-set-content-theme",
        condition: { kind: "when-provided", prop: "contentTheme" },
        value: { kind: "prop", prop: "contentTheme" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-surface",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "variant" },
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
