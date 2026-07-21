import { type SetNode, serializeSetNode } from "../../helpers/node";
import type { SetComponentSpec } from "../../spec";
import { type SetIconMirrorMode, renderSetIcon } from "../icon/icon";

export type SetButtonAppearance = "outline" | "solid" | "text";
export type SetButtonHasPopup = "menu";
export type SetButtonLabelVisibility =
  | "visible"
  | "hidden"
  | "hiddenBelowTablet";
export type SetButtonPlacement = "start" | "end";
export type SetButtonSize = "sm" | "md" | "lg";
export type SetButtonTone = "default" | "neutral";
export type SetButtonType = "button" | "submit";

export interface SetButtonProps {
  /**
   * Structural style.
   * @default "outline"
   */
  appearance?: SetButtonAppearance;
  /**
   * Controlled element id for disclosure-style button interactions.
   * Ignored when `disclosure` is false or omitted.
   */
  controls?: string;
  /**
   * Disables interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Emits `aria-expanded="false"` for disclosure-style button interactions.
   * SSR renderers are expected to update the attribute at runtime if state changes.
   * @default false
   */
  disclosure?: boolean;
  /** Optional form owner ID. */
  form?: string;
  /**
   * Popup type for button interactions.
   */
  haspopup?: SetButtonHasPopup;
  /** DOM id. */
  id?: string;
  /** Optional icon name (Lucide naming semantics). */
  icon?: string;
  /** Optional icon mirroring mode. Ignored when `icon` is omitted. */
  iconMirrored?: SetIconMirrorMode;
  /**
   * Icon placement when icon is present.
   * @default "start"
   */
  iconPlacement?: SetButtonPlacement;
  /** Accessible name text rendered as content (escaped before render). */
  label: string;
  /**
   * Controls whether the visible label is shown alongside the icon.
   * Non-visible values require `icon`.
   * @default "visible"
   */
  labelVisibility?: SetButtonLabelVisibility;
  /** Optional submitted field name. */
  name?: string;
  /**
   * Size variant.
   * @default "md"
   */
  size?: SetButtonSize;
  /**
   * Semantic color intent.
   * @default "default"
   */
  tone?: SetButtonTone;
  /**
   * Native button type.
   * @default "button"
   */
  type?: SetButtonType;
  /** Optional submitted field value. */
  value?: string;
}

/**
 * Builds the `SetNode` IR for the Set button component.
 *
 * This is the shape consumed by framework adapters. The SSR renderer
 * `renderSetButton` is implemented as `serialize(buildSetButton(props))`.
 */
export function buildSetButton(props: SetButtonProps): SetNode {
  const {
    appearance = "outline",
    controls,
    disabled,
    disclosure,
    form,
    haspopup,
    id,
    icon,
    iconMirrored,
    iconPlacement = "start",
    label,
    labelVisibility = "visible",
    name,
    size = "md",
    tone = "default",
    type,
    value,
  } = props;

  const normalizedIconName = icon?.trim() || undefined;
  const hasIcon = Boolean(normalizedIconName);

  if (labelVisibility !== "visible" && !hasIcon) {
    throw new Error("labelVisibility requires icon when label is not visible.");
  }

  const iconNode: SetNode | null =
    hasIcon && normalizedIconName
      ? {
          kind: "element",
          tag: "span",
          attrs: { class: "icon-wrapper" },
          children: [
            {
              kind: "raw",
              html: renderSetIcon({
                ariaHidden: true,
                mirrored: iconMirrored,
                name: normalizedIconName,
                size: "fill",
              }),
            },
          ],
        }
      : null;

  const labelNode: SetNode = {
    kind: "element",
    tag: "span",
    attrs: { class: "label" },
    children: [{ kind: "text", value: label }],
  };

  const children: SetNode[] = iconNode
    ? iconPlacement === "end"
      ? [labelNode, iconNode]
      : [iconNode, labelNode]
    : [labelNode];

  return {
    kind: "element",
    tag: "button",
    attrs: {
      "aria-controls": disclosure ? controls || undefined : undefined,
      "aria-expanded": disclosure ? "false" : undefined,
      "aria-haspopup": haspopup || undefined,
      class: "set-button",
      "data-appearance": appearance,
      "data-label-visibility":
        labelVisibility === "visible" ? undefined : labelVisibility,
      "data-size": size,
      "data-tone": tone === "neutral" ? "neutral" : undefined,
      disabled: Boolean(disabled),
      form: form || undefined,
      id: id || undefined,
      name: name || undefined,
      type: type || "button",
      value: value || undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Set button component.
 *
 * @param props - Button component props.
 * @returns HTML string for a `<button>` element.
 */
export function renderSetButton(props: SetButtonProps): string {
  return serializeSetNode(buildSetButton(props));
}

/** Declarative button contract mirror for tooling, docs, and adapters. */
export const SET_BUTTON_SPEC: SetComponentSpec = {
  name: "button",
  description: "Use `button` to let users trigger actions.",
  output: { element: "button", class: "set-button" },
  content: { kind: "text", prop: "label" },
  props: {
    appearance: {
      default: "outline",
      description: "Visual appearance.",
      type: { kind: "enum", values: ["outline", "solid", "text"] },
    },
    controls: {
      description: "`id` of the element this button controls.",
      ignoredWhen: "`disclosure` is false",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      type: { kind: "boolean" },
    },
    disclosure: {
      default: false,
      description:
        "Marks the button as a disclosure toggle for another element.",
      type: { kind: "boolean" },
    },
    form: {
      description: "`id` of the form this button belongs to.",
      type: { kind: "string" },
    },
    haspopup: {
      description:
        "Signals that activating the button opens a popup of this type.",
      type: { kind: "enum", values: ["menu"] },
    },
    icon: {
      description: "Icon shown alongside the label.",
      requiredWhen: "`labelVisibility` is hidden or hiddenBelowTablet",
      type: { kind: "iconName" },
    },
    iconMirrored: {
      description: "Mirrors the icon horizontally.",
      ignoredWhen: "`icon` is omitted",
      type: { kind: "enum", values: ["always", "rtl"] },
    },
    iconPlacement: {
      default: "start",
      description: "Where the icon sits relative to the label.",
      ignoredWhen: "`icon` is omitted",
      type: { kind: "enum", values: ["start", "end"] },
    },
    id: {
      description: "`id` for the button.",
      type: { kind: "string" },
    },
    label: {
      description: "Accessible label.",
      required: true,
      type: { kind: "text" },
    },
    labelVisibility: {
      default: "visible",
      description: "How the label is shown. Hidden values require an icon.",
      type: {
        kind: "enum",
        values: ["visible", "hidden", "hiddenBelowTablet"],
      },
    },
    name: {
      description: "Name submitted with the form.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "neutral"] },
    },
    type: {
      default: "button",
      description: "Native button type.",
      type: { kind: "enum", values: ["button", "submit"] },
    },
    value: {
      description: "Value submitted with the form.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
      {
        target: { on: "host" },
        attribute: "data-appearance",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "appearance" },
      },
      {
        target: { on: "host" },
        attribute: "data-label-visibility",
        condition: {
          kind: "when-in",
          prop: "labelVisibility",
          values: ["hidden", "hiddenBelowTablet"],
        },
        value: { kind: "prop", prop: "labelVisibility" },
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
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "host" },
        attribute: "aria-expanded",
        condition: { kind: "when-truthy", prop: "disclosure" },
        value: { kind: "literal", text: "false" },
      },
      {
        target: { on: "host" },
        attribute: "aria-controls",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "disclosure" },
            { kind: "when-non-empty", prop: "controls" },
          ],
        },
        value: { kind: "prop", prop: "controls" },
      },
      {
        target: { on: "host" },
        attribute: "aria-haspopup",
        condition: { kind: "when-provided", prop: "haspopup" },
        value: { kind: "prop", prop: "haspopup" },
      },
      {
        target: { on: "host" },
        attribute: "form",
        condition: { kind: "when-non-empty", prop: "form" },
        value: { kind: "prop", prop: "form" },
      },
      {
        target: { on: "host" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "host" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "type" },
      },
      {
        target: { on: "host" },
        attribute: "value",
        condition: { kind: "when-non-empty", prop: "value" },
        value: { kind: "prop", prop: "value" },
      },
    ],
  },
};
