import { type SetNode, serializeSetNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize } from "../../types";
import { buildSetFieldset } from "../fieldset/fieldset";

export type SetRadiosOrientation = "vertical" | "horizontal";

export interface SetRadioItem {
  /** Optional per-item helper text. */
  description?: string;
  /**
   * Optional per-item disabled override.
   * @default false
   */
  disabled?: boolean;
  /** Radio option label (escaped before render). */
  label: string;
  /** Option value (submitted value and selection key). */
  value: string;
}

export interface SetRadiosProps {
  /** Group description rendered below legend. */
  description?: string;
  /** Group disabled state. @default false */
  disabled?: boolean;
  /** Group id used for group and per-item description id derivation. */
  id: string;
  /** Group invalid state. Ignored when `disabled`. @default false */
  invalid?: boolean;
  /** Radio options. Must include at least 2 options. */
  radios: SetRadioItem[];
  /** Group legend text (escaped before render). */
  legend: string;
  /** Shared radio name applied to all options. */
  name: string;
  /** Layout orientation. @default "vertical" */
  orientation?: SetRadiosOrientation;
  /** Required selection state. @default false */
  required?: boolean;
  /** Size variant for all radios in the group. @default "md" */
  size?: SetControlSize;
  /** Selected option value. When unmatched, no option is checked. */
  value?: string;
}

/**
 * Builds the IR tree for the Set radios component.
 *
 * @param props - Radios component props.
 * @returns IR node for a radios fieldset.
 */
export function buildSetRadios({
  description,
  disabled,
  id,
  invalid,
  radios,
  legend,
  name,
  orientation = "vertical",
  required,
  size = "md",
  value,
}: SetRadiosProps): SetNode {
  const normalizedId = id.trim();
  const normalizedName = name.trim();
  const normalizedValue = value?.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!normalizedName) {
    throw new Error("name must be a non-empty string.");
  }

  if (radios.length < 2) {
    throw new Error("radios must include at least 2 options.");
  }

  const normalizedRadios = radios.map((item, index) => {
    const itemValue = item.value.trim();
    const itemLabel = item.label.trim();
    const itemDescription = item.description?.trim();

    if (!itemValue) {
      throw new Error(`radios[${index}].value must be non-empty.`);
    }

    if (!itemLabel) {
      throw new Error(`radios[${index}].label must be non-empty.`);
    }

    return {
      description: itemDescription,
      disabled: Boolean(item.disabled),
      label: itemLabel,
      value: itemValue,
    };
  });

  const itemValueSet = new Set(normalizedRadios.map((item) => item.value));

  if (itemValueSet.size !== normalizedRadios.length) {
    throw new Error("radios values must be unique.");
  }

  const isGroupDisabled = Boolean(disabled);

  const optionNodes: SetNode[] = normalizedRadios.map((item) => {
    const isItemDisabled = Boolean(item.disabled);
    const itemDescriptionId = item.description
      ? `${normalizedId}-${item.value}-description`
      : undefined;

    const fieldChildren: SetNode[] = [
      {
        kind: "element",
        tag: "label",
        attrs: { class: "label" },
        children: [
          {
            kind: "element",
            tag: "input",
            attrs: {
              "aria-describedby": itemDescriptionId,
              checked: normalizedValue === item.value,
              class: "radio",
              disabled: isItemDisabled,
              name: normalizedName,
              required:
                Boolean(required) && !isGroupDisabled && !isItemDisabled,
              type: "radio",
              value: item.value,
            },
            children: [],
          },
          {
            kind: "element",
            tag: "span",
            attrs: {},
            children: [{ kind: "text", value: item.label }],
          },
        ],
      },
    ];

    if (item.description) {
      fieldChildren.push({
        kind: "element",
        tag: "p",
        attrs: { class: "radio-description", id: itemDescriptionId },
        children: [{ kind: "text", value: item.description }],
      });
    }

    return {
      kind: "element",
      tag: "div",
      attrs: { class: "radio-field" },
      children: fieldChildren,
    };
  });

  const radiosNode: SetNode = {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-radios",
      "data-orientation": orientation,
      "data-size": size,
    },
    children: optionNodes,
  };

  return buildSetFieldset({
    children: serializeSetNode(radiosNode),
    description,
    disabled: isGroupDisabled,
    id: normalizedId,
    invalid,
    legend,
  });
}

/**
 * SSR renderer for the Set radios component.
 *
 * @param props - Radios component props.
 * @returns HTML string for a radios fieldset.
 */
export function renderSetRadios(props: SetRadiosProps): string {
  return serializeSetNode(buildSetRadios(props));
}

/** Declarative radios contract mirror for tooling, docs, and adapters. */
export const SET_RADIOS_SPEC: SetComponentSpec = {
  name: "radios",
  description: "Use `radios` to let users select one option from a short list.",
  output: { element: "fieldset", class: "set-fieldset" },
  content: { kind: "structured", prop: "radios" },
  props: {
    description: {
      description: "Helper text shown below the legend.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables every option in the group.",
      type: { kind: "boolean" },
    },
    id: {
      description:
        "Unique id used to associate the group with its descriptions.",
      required: true,
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the group as invalid.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    radios: {
      description: "Options shown in the group.",
      required: true,
      type: {
        kind: "array",
        itemShape: {
          description: {
            description: "Optional per-item helper text.",
            type: { kind: "string" },
          },
          disabled: {
            default: false,
            description: "Optional per-item disabled override.",
            type: { kind: "boolean" },
          },
          label: {
            description: "Radio option label.",
            required: true,
            type: { kind: "text" },
          },
          value: {
            description: "Submitted value and selection key.",
            required: true,
            type: { kind: "string" },
          },
        },
      },
    },
    legend: {
      description: "Group label.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Form field name shared by all options.",
      required: true,
      type: { kind: "string" },
    },
    orientation: {
      default: "vertical",
      description: "Layout direction.",
      type: { kind: "enum", values: ["vertical", "horizontal"] },
    },
    required: {
      default: false,
      description: "Requires a selection before submission.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    value: {
      description: "Currently selected value.",
      type: { kind: "string" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "host" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "host" },
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
        target: { on: "host" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "div.set-radios" },
        attribute: "data-orientation",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "orientation" },
      },
      {
        target: { on: "descendant", selector: "div.set-radios" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "radio" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "radio" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "name",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "name" },
      },
    ],
  },
};
