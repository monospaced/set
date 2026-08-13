import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import {
  buildSetLogoAnimatedGraphic,
  buildSetLogoAnimatedPrimary,
} from "./logos-animated";

export type SetLogoTone = "default" | "neutral";
export type SetLogoSize = "sm" | "md" | "lg" | "xl" | "fill";
export type SetLogoVariant =
  | "primary"
  | "secondary"
  | "typographic"
  | "graphic";

export interface SetLogoProps {
  /** Plays the logo's boot animation. Primary and graphic only; other variants render static. @default false */
  animated?: boolean;
  /** DOM id. */
  id?: string;
  /** Accessible label. */
  label: string;
  /** Size. @default "md" */
  size?: SetLogoSize;
  /** Tone. @default "default" */
  tone?: SetLogoTone;
  /** Variant. @default "primary" */
  variant?: SetLogoVariant;
}

/**
 * Builds the IR tree for the Set logo component.
 *
 * @param props - Logo component props.
 * @returns IR node for a masked logo element.
 */
export function buildSetLogo({
  animated,
  id,
  label,
  size = "md",
  tone = "default",
  variant = "primary",
}: SetLogoProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const isAnimated =
    Boolean(animated) && (variant === "primary" || variant === "graphic");

  const children: SetNode[] = [
    {
      kind: "element",
      tag: "span",
      attrs: { class: "visually-hidden" },
      children: [{ kind: "text", value: label }],
    },
  ];

  if (isAnimated) {
    children.push(
      variant === "graphic"
        ? buildSetLogoAnimatedGraphic()
        : buildSetLogoAnimatedPrimary(),
    );
  }

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-logo",
      "data-animated": isAnimated,
      "data-size": size,
      "data-tone": tone === "neutral" ? "neutral" : undefined,
      "data-variant": variant === "primary" ? undefined : variant,
      id: normalizedId,
    },
    children,
  };
}

/**
 * SSR renderer for the Set logo component.
 *
 * @param props - Logo component props.
 * @returns HTML string for a masked logo element.
 */
export function renderSetLogo(props: SetLogoProps): string {
  return serializeSetNode(buildSetLogo(props));
}

/** Declarative logo contract mirror for tooling, docs, and adapters. */
export const SET_LOGO_SPEC: SetComponentSpec = {
  name: "logo",
  description: "Use `logo` to display the brand mark.",
  output: { element: "div", class: "set-logo" },
  content: { kind: "text", prop: "label" },
  props: {
    animated: {
      default: false,
      description:
        "Plays the logo's boot animation once on render. Animates the `primary` and `graphic` variants; others render static.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    label: {
      description: "Accessible label.",
      required: true,
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg", "xl", "fill"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "neutral"] },
    },
    variant: {
      default: "primary",
      description: "Logo variant.",
      type: {
        kind: "enum",
        values: ["primary", "secondary", "typographic", "graphic"],
      },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-animated",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "animated" },
            {
              kind: "when-in",
              prop: "variant",
              values: ["primary", "graphic"],
            },
          ],
        },
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
        condition: { kind: "when-equals", prop: "tone", to: "neutral" },
        value: { kind: "literal", text: "neutral" },
      },
      {
        target: { on: "host" },
        attribute: "data-variant",
        condition: {
          kind: "when-in",
          prop: "variant",
          values: ["secondary", "typographic", "graphic"],
        },
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
