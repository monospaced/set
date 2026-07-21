import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize } from "../../types";

export interface SetSwitchProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Helper text rendered after the label. Requires `id`. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** DOM id applied to the underlying input. Required when `description` is provided. */
  id?: string;
  /** Label text content (escaped before render). */
  label: string;
  /** Form field name. */
  name?: string;
  /** Size variant. @default "md" */
  size?: SetControlSize;
  /** Submitted field value. */
  value?: string;
}

/**
 * Builds the IR tree for the Set switch component.
 *
 * @param props - Switch component props.
 * @returns IR node for a switch field wrapper.
 */
export function buildSetSwitch({
  checked,
  description,
  disabled,
  id,
  label,
  name,
  size = "md",
  value,
}: SetSwitchProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedDescription = description?.trim();

  if (normalizedDescription && !normalizedId) {
    throw new Error("id must be provided when description is provided.");
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const children: SetNode[] = [
    {
      kind: "element",
      tag: "label",
      attrs: { class: "label" },
      children: [
        {
          kind: "element",
          tag: "input",
          attrs: {
            "aria-describedby": descriptionId,
            checked: Boolean(checked),
            class: "switch",
            disabled: Boolean(disabled),
            id: normalizedId,
            name: name || undefined,
            role: "switch",
            type: "checkbox",
            value: value || undefined,
          },
          children: [],
        },
        {
          kind: "element",
          tag: "span",
          attrs: {},
          children: [{ kind: "text", value: label }],
        },
      ],
    },
  ];

  if (normalizedDescription) {
    children.push({
      kind: "element",
      tag: "p",
      attrs: { class: "description", id: descriptionId },
      children: [{ kind: "text", value: normalizedDescription }],
    });
  }

  return {
    kind: "element",
    tag: "div",
    attrs: { class: "set-switch", "data-size": size },
    children,
  };
}

/**
 * SSR renderer for the Set switch component.
 *
 * @param props - Switch component props.
 * @returns HTML string for a switch field wrapper.
 */
export function renderSetSwitch(props: SetSwitchProps): string {
  return serializeSetNode(buildSetSwitch(props));
}

/** Declarative switch contract mirror for tooling, docs, and adapters. */
export const SET_SWITCH_SPEC: SetComponentSpec = {
  name: "switch",
  description:
    "Use `switch` to let users instantly toggle a setting on or off.",
  output: { element: "div", class: "set-switch" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "description", kind: "text" },
    ],
  },
  props: {
    checked: {
      default: false,
      description: "Whether the switch is on.",
      type: { kind: "boolean" },
    },
    description: {
      description: "Helper text shown below the label.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the switch.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      requiredWhen: "`description` is provided",
      type: { kind: "string" },
    },
    label: {
      description: "Label text.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Form field name.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    value: {
      description: "Submitted value when checked.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "switch" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "checkbox" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "role",
        condition: { kind: "always" },
        value: { kind: "literal", text: "switch" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "checked",
        condition: { kind: "when-truthy", prop: "checked" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "value",
        condition: { kind: "when-non-empty", prop: "value" },
        value: { kind: "prop", prop: "value" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
