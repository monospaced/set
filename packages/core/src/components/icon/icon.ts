import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import { TDESIGN_ICONS, type TdesignIconNode } from "./icons.generated";

export const SET_ICON_RECOMMENDED = [
  "adjustment",
  "arrow-down",
  "arrow-left-right-1",
  "arrow-left",
  "arrow-right",
  "arrow-up-down-1",
  "arrow-up",
  "check-circle",
  "chevron-down",
  "chevron-right",
  "circle",
  "city-6",
  "close",
  "copy",
  "download",
  "enter",
  "error-circle",
  "error-triangle",
  "horizontal",
  "info-circle",
  "jump",
  "layers",
  "link",
  "member",
  "pantone",
  "rectangle",
  "refresh",
  "robot-1",
  "search",
  "setting-1",
  "swap",
  "user-1",
  "view-list",
] as const;

export type SetIconMirrorMode = "always" | "rtl";
export type SetIconSize = "2xs" | "xs" | "sm" | "md" | "lg" | "fill";

export interface SetIconProps {
  /** Emits `aria-hidden="true"` when true. @default true */
  ariaHidden?: boolean;
  /** DOM id. Required when `ariaHidden` is false. */
  id?: string;
  /** SVG title text. Required when `ariaHidden` is false. */
  title?: string;
  /** TDesign icon name (kebab-case). See https://tdesign.tencent.com/icon */
  name: string;
  /** Horizontal mirroring behavior. Omit for no mirroring. */
  mirrored?: SetIconMirrorMode;
  /** Size variant. @default "md" */
  size?: SetIconSize;
}

function iconNodesToSetNodes(nodes: TdesignIconNode[]): SetNode[] {
  return nodes.map((node) => ({
    kind: "element",
    tag: node.tag,
    attrs: node.attrs,
    children: node.children ? iconNodesToSetNodes(node.children) : [],
  }));
}

/**
 * Builds the IR tree for the Set icon component.
 *
 * Emits inline `<svg>` markup for the TDesign icon set. Stroke, fill, and
 * linecap are authored per-path in the TDesign source, so the SVG root does
 * not set them.
 *
 * @param props - Icon component props.
 * @returns IR node for the Set icon component.
 */
export function buildSetIcon({
  ariaHidden = true,
  id,
  mirrored,
  name,
  size = "md",
  title,
}: SetIconProps): SetNode {
  const iconNodes = TDESIGN_ICONS[name];

  if (!iconNodes) {
    throw new Error(`Unknown TDesign icon name: ${name}`);
  }

  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedTitle = title?.trim();

  if (!ariaHidden && !normalizedTitle) {
    throw new Error("title must be non-empty when ariaHidden is false.");
  }

  if (!ariaHidden && !normalizedId) {
    throw new Error("id must be provided when ariaHidden is false.");
  }

  const titleId = !ariaHidden ? `${normalizedId}-title` : undefined;

  const children: SetNode[] = [];
  if (!ariaHidden) {
    children.push({
      kind: "element",
      tag: "title",
      attrs: { id: titleId },
      children: [{ kind: "text", value: normalizedTitle! }],
    });
  }
  children.push(...iconNodesToSetNodes(iconNodes));

  return {
    kind: "element",
    tag: "svg",
    attrs: {
      "aria-hidden": ariaHidden ? "true" : undefined,
      "aria-labelledby": titleId,
      class: "set-icon",
      "data-mirrored": mirrored,
      "data-size": size,
      fill: "none",
      height: "24",
      id: normalizedId,
      role: !ariaHidden ? "img" : undefined,
      stroke: "currentColor",
      "stroke-width": "1.75",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    },
    children,
  };
}

/**
 * SSR renderer for the Set icon component.
 *
 * Emits inline `<svg>` markup for the TDesign icon set.
 *
 * @param props - Icon component props.
 * @returns HTML string for the Set icon component.
 */
export function renderSetIcon(props: SetIconProps): string {
  return serializeSetNode(buildSetIcon(props));
}

/** Declarative icon contract mirror for tooling, docs, and adapters. */
export const SET_ICON_SPEC: SetComponentSpec = {
  name: "icon",
  description: "Use `icon` to render a TDesign icon.",
  output: { element: "svg", class: "set-icon" },
  content: { kind: "none" },
  props: {
    ariaHidden: {
      default: true,
      description:
        "Hides the icon from assistive technology. Decorative by default; set to false for a labelled icon (then `title` and `id` are required).",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      requiredWhen: "`ariaHidden` is false",
      type: { kind: "string" },
    },
    mirrored: {
      description: "Mirrors the icon horizontally.",
      type: { kind: "enum", values: ["always", "rtl"] },
    },
    name: {
      description: "TDesign icon name.",
      required: true,
      type: { kind: "iconName" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["2xs", "xs", "sm", "md", "lg", "fill"],
      },
    },
    title: {
      description: "Accessible title announced by assistive technology.",
      requiredWhen: "`ariaHidden` is false",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "aria-hidden",
        condition: { kind: "when-truthy", prop: "ariaHidden" },
        value: { kind: "literal", text: "true" },
      },
      {
        target: { on: "host" },
        attribute: "data-mirrored",
        condition: { kind: "when-provided", prop: "mirrored" },
        value: { kind: "prop", prop: "mirrored" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "fill",
        condition: { kind: "always" },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "host" },
        attribute: "height",
        condition: { kind: "always" },
        value: { kind: "literal", text: "24" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: {
          kind: "not",
          of: { kind: "when-truthy", prop: "ariaHidden" },
        },
        value: { kind: "literal", text: "img" },
      },
      {
        target: { on: "host" },
        attribute: "stroke",
        condition: { kind: "always" },
        value: { kind: "literal", text: "currentColor" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-width",
        condition: { kind: "always" },
        value: { kind: "literal", text: "1.75" },
      },
      {
        target: { on: "host" },
        attribute: "viewBox",
        condition: { kind: "always" },
        value: { kind: "literal", text: "0 0 24 24" },
      },
      {
        target: { on: "host" },
        attribute: "xmlns",
        condition: { kind: "always" },
        value: { kind: "literal", text: "http://www.w3.org/2000/svg" },
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
