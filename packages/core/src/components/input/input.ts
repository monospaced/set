import { type SetNode, serializeSetNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize, SetInlineSize } from "../../types";

export type SetInputType =
  | "text"
  | "email"
  | "password"
  | "tel"
  | "url"
  | "numeric";

export interface SetInputProps {
  /** Autocomplete hint; `false` emits `autocomplete="off"`. */
  autocomplete?: string | false;
  /** Helper text rendered after the input (reused as validation guidance when `invalid`). */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Input id; used for `input[id]` and `label[for]`. */
  id: string;
  /** Invalid state. Ignored when `disabled` or `readOnly`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Field name attribute. */
  name?: string;
  /** Pattern attribute. */
  pattern?: string;
  /** Read-only state. Ignored when `disabled`. @default false */
  readOnly?: boolean;
  /** Required state. @default false */
  required?: boolean;
  /** Size variant. @default "md" */
  size?: SetControlSize;
  /** Spellcheck behavior. Defaults to `false` for `type="numeric"` unless explicit. */
  spellcheck?: boolean;
  /** Input type; `numeric` maps to `type="text"` with `inputmode="numeric"`. @default "text" */
  type?: SetInputType;
  /** Current value. */
  value?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: SetInlineSize;
}

/**
 * Builds the IR tree for the Set input component.
 *
 * @param props - Input component props.
 * @returns IR node for a labeled input field wrapper.
 */
export function buildSetInput({
  autocomplete,
  description,
  disabled,
  id,
  invalid,
  label,
  name,
  pattern,
  readOnly,
  required,
  size = "md",
  spellcheck,
  type = "text",
  value,
  inlineSize = "full",
}: SetInputProps): SetNode {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedAutocomplete =
    autocomplete === false ? false : autocomplete?.trim();
  const normalizedName = name?.trim();
  const normalizedPattern = pattern?.trim();
  // Preserve the field value exactly as provided. Leading/trailing spaces can
  // be meaningful user input, and adapters use `""` to keep cleared fields
  // controlled.
  const normalizedValue = value;

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

  const isNumeric = type === "numeric";
  const resolvedType = isNumeric ? "text" : type;
  const resolvedPattern =
    normalizedPattern || (isNumeric ? "^[0-9]*$" : undefined);
  const resolvedSpellcheck =
    spellcheck === undefined && isNumeric ? false : spellcheck;
  const isDisabled = Boolean(disabled);
  const isReadOnly = !isDisabled && Boolean(readOnly);
  const isInvalid = !isDisabled && !isReadOnly && Boolean(invalid);

  const children: SetNode[] = [
    {
      kind: "element",
      tag: "label",
      attrs: { class: "label", for: normalizedId },
      children: [{ kind: "text", value: label }],
    },
    {
      kind: "element",
      tag: "input",
      attrs: {
        "aria-describedby": descriptionId,
        "aria-invalid": isInvalid ? "true" : undefined,
        autocomplete:
          normalizedAutocomplete === false
            ? "off"
            : normalizedAutocomplete || undefined,
        class: "input",
        disabled: isDisabled,
        id: normalizedId,
        inputmode: isNumeric ? "numeric" : undefined,
        name: normalizedName || undefined,
        pattern: resolvedPattern,
        readonly: isReadOnly,
        required: Boolean(required),
        spellcheck:
          resolvedSpellcheck === undefined
            ? undefined
            : String(resolvedSpellcheck),
        type: resolvedType,
        value: normalizedValue,
      },
      children: [],
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
    attrs: {
      class: "set-input",
      "data-size": size,
      "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Set input component.
 *
 * @param props - Input component props.
 * @returns HTML string for a labeled input field wrapper.
 */
export function renderSetInput(props: SetInputProps): string {
  return serializeSetNode(buildSetInput(props));
}

/** Declarative input contract mirror for tooling, docs, and adapters. */
export const SET_INPUT_SPEC: SetComponentSpec = {
  name: "input",
  description: "Use `input` to collect a single line of text from users.",
  output: { element: "div", class: "set-input" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "description", kind: "text" },
    ],
  },
  props: {
    autocomplete: {
      description: "Autocomplete hint. Pass `false` to disable autocomplete.",
      type: {
        kind: "union",
        variants: [{ kind: "string" }, { kind: "boolean" }],
      },
    },
    description: {
      description:
        "Helper text shown below the input; also used for validation guidance.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Prevents interaction.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` linking the label to the input.",
      required: true,
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the input as invalid.",
      ignoredWhen: "`disabled` is true or `readOnly` is true",
      type: { kind: "boolean" },
    },
    label: {
      description: "Label shown above the input.",
      required: true,
      type: { kind: "text" },
    },
    name: {
      description: "Name submitted with the form.",
      type: { kind: "string" },
    },
    pattern: {
      description: "Regex pattern the value must match.",
      type: { kind: "string" },
    },
    readOnly: {
      default: false,
      description: "Makes the input read-only.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    required: {
      default: false,
      description: "Marks the input as required.",
      type: { kind: "boolean" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    spellcheck: {
      description: "Enables browser spellchecking.",
      type: { kind: "boolean" },
    },
    type: {
      default: "text",
      description: "Input type.",
      type: {
        kind: "enum",
        values: ["text", "email", "password", "tel", "url", "numeric"],
      },
    },
    value: {
      description: "Current value.",
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "Whether the field fills its container or shrinks to fit.",
      type: { kind: "enum", values: ["full", "fit"] },
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
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
      {
        target: { on: "descendant", selector: "label" },
        attribute: "for",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "input" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
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
        condition: { kind: "when-provided", prop: "value" },
        value: { kind: "prop", prop: "value" },
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
        attribute: "readonly",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "readOnly" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
          ],
        },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-invalid",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "invalid" },
            { kind: "not", of: { kind: "when-truthy", prop: "disabled" } },
            { kind: "not", of: { kind: "when-truthy", prop: "readOnly" } },
          ],
        },
        value: { kind: "literal", text: "true" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "inputmode",
        condition: { kind: "when-equals", prop: "type", to: "numeric" },
        value: { kind: "literal", text: "numeric" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "when-equals", prop: "type", to: "numeric" },
        value: { kind: "literal", text: "text" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "when-not-in", prop: "type", values: ["numeric"] },
        value: { kind: "prop", prop: "type" },
      },
    ],
  },
};
