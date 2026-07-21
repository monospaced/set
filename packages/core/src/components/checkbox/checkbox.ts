import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize } from "../../types";

export interface SetCheckboxProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Helper text rendered after the label. Requires `id`. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** DOM id applied to the underlying input. Required when `description` is provided. */
  id?: string;
  /** Invalid state. Ignored when `disabled`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Form field name. */
  name?: string;
  /** Required state. @default false */
  required?: boolean;
  /** Size variant. @default "md" */
  size?: SetControlSize;
  /** Submitted field value. */
  value?: string;
}

/**
 * Builds the IR tree for the Set checkbox component.
 *
 * @param props - Checkbox component props.
 * @returns IR node for a checkbox field wrapper.
 */
export function buildSetCheckbox({
  checked,
  description,
  disabled,
  id,
  invalid,
  label,
  name,
  required,
  size = "md",
  value,
}: SetCheckboxProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedDescription = description?.trim();

  if (normalizedDescription && !normalizedId) {
    throw new Error("id must be provided when description is provided.");
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const isDisabled = Boolean(disabled);
  const isInvalid = !isDisabled && Boolean(invalid);

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
            "aria-invalid": isInvalid ? "true" : undefined,
            checked: Boolean(checked),
            class: "checkbox",
            disabled: isDisabled,
            id: normalizedId,
            name: name || undefined,
            required: Boolean(required),
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
    attrs: { class: "set-checkbox", "data-size": size },
    children,
  };
}

/**
 * SSR renderer for the Set checkbox component.
 *
 * @param props - Checkbox component props.
 * @returns HTML string for a checkbox field wrapper.
 */
export function renderSetCheckbox(props: SetCheckboxProps): string {
  return serializeSetNode(buildSetCheckbox(props));
}

/** Declarative checkbox contract mirror for tooling, docs, and adapters. */
export const SET_CHECKBOX_SPEC: SetComponentSpec = {
  name: "checkbox",
  description: "Use `checkbox` to let users toggle a single option on or off.",
  output: { element: "div", class: "set-checkbox" },
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
      description: "Whether the checkbox is checked.",
      type: { kind: "boolean" },
    },
    description: {
      description: "Helper text shown below the label.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      type: { kind: "boolean" },
    },
    id: {
      description: "DOM id.",
      requiredWhen: "`description` is provided",
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the checkbox as invalid.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    label: {
      description: "Label shown next to the checkbox.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Name submitted with the form.",
      type: { kind: "string" },
    },
    required: {
      default: false,
      description: "Marks the checkbox as required.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
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
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "checkbox" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "checkbox" },
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
        attribute: "required",
        condition: { kind: "when-truthy", prop: "required" },
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
        attribute: "aria-invalid",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "invalid" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
          ],
        },
        value: { kind: "literal", text: "true" },
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
