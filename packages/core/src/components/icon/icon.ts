import { icons } from "lucide";

import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

type LucideSvgAttrs = Record<string, string | number | undefined>;
type LucideIconNode = Array<[tag: string, attrs: LucideSvgAttrs]>;

const LUCIDE_ICONS = icons as Record<string, LucideIconNode>;

export const SET_ICON_RECOMMENDED = [
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "arrow-right-left",
  "arrow-up",
  "arrow-up-down",
  "bot",
  "building-2",
  "chevron-down",
  "chevron-right",
  "circle",
  "circle-alert",
  "circle-check",
  "copy",
  "corner-down-left",
  "corner-down-right",
  "corner-up-left",
  "corner-up-right",
  "dice-5",
  "download",
  "external-link",
  "info",
  "layers",
  "link",
  "menu",
  "panel-left",
  "search",
  "settings",
  "shuffle",
  "sliders-horizontal",
  "square",
  "sun-moon",
  "swatch-book",
  "triangle-alert",
  "user",
  "users",
  "x",
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
  /** Lucide icon name (kebab-case, camelCase, or PascalCase). See https://lucide.dev/icons/ */
  name: string;
  /** Horizontal mirroring behavior. Omit for no mirroring. */
  mirrored?: SetIconMirrorMode;
  /** Size variant. @default "md" */
  size?: SetIconSize;
}

function normalizeLucideKey(name: string): string {
  if (!name) return name;

  // kebab/snake/space forms: `arrow-right` -> `ArrowRight`
  if (/[-_\s]/.test(name)) {
    return name
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  // camelCase form: `arrowRight` -> `ArrowRight`
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function resolveIconNode(name: string): LucideIconNode | undefined {
  const direct = LUCIDE_ICONS[name];
  if (direct) return direct;

  const normalizedKey = normalizeLucideKey(name);
  return LUCIDE_ICONS[normalizedKey];
}

function iconNodeToChildren(iconNode: LucideIconNode): SetNode[] {
  return iconNode.map(([tag, nodeAttrs]) => ({
    kind: "element",
    tag,
    attrs: Object.fromEntries(
      Object.entries(nodeAttrs).map(([key, value]) => [
        key,
        value == null ? undefined : String(value),
      ]),
    ),
    children: [],
  }));
}

/**
 * Builds the IR tree for the Set icon component.
 *
 * Emits inline `<svg>` markup for the Lucide icon set.
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
  const iconNode = resolveIconNode(name);

  if (!iconNode) {
    throw new Error(`Unknown Lucide icon name: ${name}`);
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
  children.push(...iconNodeToChildren(iconNode));

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
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    },
    children,
  };
}

/**
 * SSR renderer for the Set icon component.
 *
 * Emits inline `<svg>` markup for the Lucide icon set.
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
  description: "Use `icon` to render a Lucide icon.",
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
      description: "Lucide icon name.",
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
        attribute: "stroke-linecap",
        condition: { kind: "always" },
        value: { kind: "literal", text: "round" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-linejoin",
        condition: { kind: "always" },
        value: { kind: "literal", text: "round" },
      },
      {
        target: { on: "host" },
        attribute: "stroke-width",
        condition: { kind: "always" },
        value: { kind: "literal", text: "2" },
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
