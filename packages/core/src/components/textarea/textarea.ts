import { serializeSetNode, type SetNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize, SetInlineSize } from "../../types";

export type SetTextareaResize = "vertical" | "none";

export interface SetTextareaProps {
  /** Autocomplete hint; `false` emits `autocomplete="off"`. */
  autocomplete?: string | false;
  /** Helper text rendered after the textarea (reused as validation guidance when `invalid`). */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Textarea id; used for `textarea[id]` and `label[for]`. */
  id: string;
  /** Invalid state. Ignored when `disabled` or `readOnly`. @default false */
  invalid?: boolean;
  /** Label text content (escaped before render). */
  label: string;
  /** Field name attribute. */
  name?: string;
  /** Read-only state. Ignored when `disabled`. @default false */
  readOnly?: boolean;
  /** Required state. @default false */
  required?: boolean;
  /** Resize behavior. @default "vertical" */
  resize?: SetTextareaResize;
  /** Number of visible text rows. Must be an integer >= 2. @default 2 */
  rows?: number;
  /** Size variant. @default "md" */
  size?: SetControlSize;
  /** Spellcheck behavior. Omitted by default. */
  spellcheck?: boolean;
  /** Current value. */
  value?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: SetInlineSize;
}

/**
 * Builds the IR tree for the Set textarea component.
 *
 * @param props - Textarea component props.
 * @returns IR node for a labeled textarea field wrapper.
 */
export function buildSetTextarea({
  autocomplete,
  description,
  disabled,
  id,
  invalid,
  label,
  name,
  readOnly,
  required,
  resize = "vertical",
  rows = 2,
  size = "md",
  spellcheck,
  value,
  inlineSize = "full",
}: SetTextareaProps): SetNode {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedAutocomplete =
    autocomplete === false ? false : autocomplete?.trim();
  const normalizedName = name?.trim();
  const normalizedValue = value;

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!Number.isInteger(rows) || rows < 2) {
    throw new Error("rows must be an integer greater than or equal to 2.");
  }

  const descriptionId = normalizedDescription
    ? `${normalizedId}-description`
    : undefined;

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
      tag: "textarea",
      attrs: {
        "aria-describedby": descriptionId,
        "aria-invalid": isInvalid ? "true" : undefined,
        autocomplete:
          normalizedAutocomplete === false
            ? "off"
            : normalizedAutocomplete || undefined,
        class: "textarea",
        disabled: isDisabled,
        id: normalizedId,
        name: normalizedName || undefined,
        readonly: isReadOnly,
        required: Boolean(required),
        rows: String(rows),
        spellcheck: spellcheck === undefined ? undefined : String(spellcheck),
      },
      children: [{ kind: "text", value: normalizedValue || "" }],
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
      class: "set-textarea",
      "data-resize": resize === "none" ? "none" : undefined,
      "data-size": size,
      "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Set textarea component.
 *
 * @param props - Textarea component props.
 * @returns HTML string for a labeled textarea field wrapper.
 */
export function renderSetTextarea(props: SetTextareaProps): string {
  return serializeSetNode(buildSetTextarea(props));
}

/** Declarative textarea contract mirror for tooling, docs, and adapters. */
export const SET_TEXTAREA_SPEC: SetComponentSpec = {
  name: "textarea",
  description: "Use `textarea` to collect multiple lines of text from users.",
  output: { element: "div", class: "set-textarea" },
  content: {
    kind: "slots",
    slots: [
      { prop: "label", kind: "text" },
      { prop: "value", kind: "text" },
      { prop: "description", kind: "text" },
    ],
  },
  props: {
    autocomplete: {
      description: "Browser autocomplete hint. Pass `false` to disable.",
      type: {
        kind: "union",
        variants: [{ kind: "string" }, { kind: "boolean" }],
      },
    },
    description: {
      description:
        "Helper text shown below the textarea; also used for validation guidance.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the textarea.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` used to associate the textarea with its label.",
      required: true,
      type: { kind: "string" },
    },
    invalid: {
      default: false,
      description: "Marks the textarea as invalid.",
      ignoredWhen: "`disabled` is true or `readOnly` is true",
      type: { kind: "boolean" },
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
    readOnly: {
      default: false,
      description: "Prevents editing while keeping the value visible.",
      ignoredWhen: "`disabled` is true",
      type: { kind: "boolean" },
    },
    required: {
      default: false,
      description: "Requires a value before submission.",
      type: { kind: "boolean" },
    },
    resize: {
      default: "vertical",
      description: "How the user can resize the textarea.",
      type: { kind: "enum", values: ["vertical", "none"] },
    },
    rows: {
      default: 2,
      description: "Number of visible rows.",
      type: { kind: "number", min: 2, max: 10, integer: true },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    spellcheck: {
      description: "Whether the browser checks spelling.",
      type: { kind: "boolean" },
    },
    value: {
      description: "Current value.",
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "How the textarea fills its container.",
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
        target: { on: "host" },
        attribute: "data-resize",
        condition: { kind: "when-equals", prop: "resize", to: "none" },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "descendant", selector: "label" },
        attribute: "for",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "textarea" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "rows",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "rows" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "prop", prop: "name" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "required",
        condition: { kind: "when-truthy", prop: "required" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
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
        target: { on: "descendant", selector: "textarea" },
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
        target: { on: "descendant", selector: "textarea" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "textarea" },
        attribute: "spellcheck",
        condition: { kind: "when-provided", prop: "spellcheck" },
        value: { kind: "prop", prop: "spellcheck" },
      },
    ],
  },
};
