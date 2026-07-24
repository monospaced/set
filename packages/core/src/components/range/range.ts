import { serializeSetNode, type SetNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize, SetInlineSize } from "../../types";

export const SET_RANGE_TAG_NAME = "set-range";

export interface SetRangeProps {
  /** Helper text rendered after the range. */
  description?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
  /** Range id; used for input/output/label wiring. */
  id: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: SetInlineSize;
  /** Label text content (escaped before render). */
  label: string;
  /** Maximum value. */
  max?: number;
  /** Minimum value. */
  min?: number;
  /** Field name. */
  name?: string;
  /** Size variant. @default "md" */
  size?: SetControlSize;
  /** Step value. */
  step?: number;
  /** Current value. */
  value?: number;
}

/**
 * Builds the IR tree for the Set range component.
 *
 * @param props - Range component props.
 * @returns IR node for a `set-range` host.
 */
export function buildSetRange({
  description,
  disabled,
  id,
  inlineSize = "full",
  label,
  max,
  min,
  name,
  size = "md",
  step,
  value,
}: SetRangeProps): SetNode {
  const normalizedId = id.trim();
  const normalizedDescription = description?.trim();
  const normalizedName = name?.trim();

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

  const children: SetNode[] = [
    {
      kind: "element",
      tag: "div",
      attrs: { class: "label-wrapper" },
      children: [
        {
          kind: "element",
          tag: "label",
          attrs: { class: "label", for: normalizedId },
          children: [{ kind: "text", value: label }],
        },
        {
          kind: "element",
          tag: "output",
          attrs: { class: "output", for: normalizedId },
          children:
            value != null ? [{ kind: "text", value: String(value) }] : [],
        },
      ],
    },
    {
      kind: "element",
      tag: "input",
      attrs: {
        "aria-describedby": descriptionId,
        class: "range",
        disabled: Boolean(disabled),
        id: normalizedId,
        max: max != null ? String(max) : undefined,
        min: min != null ? String(min) : undefined,
        name: normalizedName || undefined,
        step: step != null ? String(step) : undefined,
        type: "range",
        value: value != null ? String(value) : undefined,
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
    tag: SET_RANGE_TAG_NAME,
    attrs: {
      class: "set-range",
      "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
      "data-size": size,
    },
    children,
  };
}

/**
 * SSR renderer for the Set range component.
 *
 * Emits semantic range markup inside a `set-range` host. The runtime custom
 * element hydrates the `.output` element from the current input value.
 *
 * @param props - Range component props.
 * @returns HTML string for a `set-range` host.
 */
export function renderSetRange(props: SetRangeProps): string {
  return serializeSetNode(buildSetRange(props));
}

/**
 * Defines the `set-range` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-range` hosts
 * upgrade in place and keep `.output` synchronized with the current value.
 */
export function defineSetRange(): void {
  if (customElements.get(SET_RANGE_TAG_NAME)) return;

  class SetRangeElement extends HTMLElement {
    #inputWithValueSync: HTMLInputElement | undefined;

    #onInput = (event: Event) => {
      const target = event.target;

      if (!(target instanceof HTMLInputElement)) return;
      if (!target.matches(".range")) return;

      this.#syncOutput();
    };

    connectedCallback(): void {
      this.removeEventListener("input", this.#onInput);
      this.#installValueSync();
      this.#syncOutput();
      this.addEventListener("input", this.#onInput);
    }

    disconnectedCallback(): void {
      this.removeEventListener("input", this.#onInput);
      this.#removeValueSync();
    }

    #syncOutput(): void {
      const input = this.querySelector<HTMLInputElement>(".range");
      const output = this.querySelector<HTMLOutputElement>(".output");

      if (!input || !output) return;

      this.#setOutputText(output, input.value);
    }

    #setOutputText(output: HTMLOutputElement, value: string): void {
      const child = output.firstChild;

      if (
        child?.nodeType === Node.TEXT_NODE &&
        output.childNodes.length === 1
      ) {
        if (child.nodeValue !== value) child.nodeValue = value;
        return;
      }

      if (output.textContent !== value) output.textContent = value;
    }

    // Programmatic `input.value = x` (controlled frameworks, scripts) does
    // not fire an `input` event, so the output wouldn't track it. Override
    // the instance's `value` accessor to sync the output on set, restoring
    // the prototype behaviour on disconnect.
    #installValueSync(): void {
      const input = this.querySelector<HTMLInputElement>(".range");
      if (!input || input === this.#inputWithValueSync) return;

      this.#removeValueSync();

      const descriptor = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      );
      if (!descriptor?.get || !descriptor.set) return;

      const getValue = descriptor.get;
      const setValue = descriptor.set;
      const syncOutput = () => this.#syncOutput();
      Object.defineProperty(input, "value", {
        configurable: true,
        enumerable: descriptor.enumerable,
        get(): string {
          return getValue.call(this) as string;
        },
        set(value: string): void {
          setValue.call(this, value);
          syncOutput();
        },
      });

      this.#inputWithValueSync = input;
    }

    #removeValueSync(): void {
      if (!this.#inputWithValueSync) return;
      delete (this.#inputWithValueSync as { value?: string }).value;
      this.#inputWithValueSync = undefined;
    }
  }

  customElements.define(SET_RANGE_TAG_NAME, SetRangeElement);
}

/** Declarative range contract mirror for tooling, docs, and adapters. */
export const SET_RANGE_SPEC: SetComponentSpec = {
  name: "range",
  description: "Use `range` to let users pick a numeric value along a scale.",
  output: { element: SET_RANGE_TAG_NAME, class: "set-range" },
  content: { kind: "text", prop: "label" },
  props: {
    description: {
      description: "Helper text shown below the range.",
      type: { kind: "string" },
    },
    disabled: {
      default: false,
      description: "Disables the range.",
      type: { kind: "boolean" },
    },
    id: {
      description: "`id` used to associate the input with its label.",
      required: true,
      type: { kind: "string" },
    },
    inlineSize: {
      default: "full",
      description: "How the range fills its container.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    label: {
      description: "Label text.",
      required: true,
      type: { kind: "text" },
    },
    max: {
      description: "Maximum value.",
      type: { kind: "number" },
    },
    min: {
      description: "Minimum value.",
      type: { kind: "number" },
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
    step: {
      description: "Granularity of value changes.",
      type: { kind: "number" },
    },
    value: {
      description: "Current value.",
      type: { kind: "number" },
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
        target: { on: "descendant", selector: "input" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "range" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "range" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "aria-describedby",
        condition: { kind: "when-non-empty", prop: "description" },
        value: { kind: "template", pattern: "{id}-description" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "disabled",
        condition: { kind: "when-truthy", prop: "disabled" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "min",
        condition: { kind: "when-provided", prop: "min" },
        value: { kind: "template", pattern: "{min}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "max",
        condition: { kind: "when-provided", prop: "max" },
        value: { kind: "template", pattern: "{max}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "step",
        condition: { kind: "when-provided", prop: "step" },
        value: { kind: "template", pattern: "{step}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "value",
        condition: { kind: "when-provided", prop: "value" },
        value: { kind: "template", pattern: "{value}" },
      },
      {
        target: { on: "descendant", selector: "input" },
        attribute: "name",
        condition: { kind: "when-non-empty", prop: "name" },
        value: { kind: "template", pattern: "{name}" },
      },
    ],
  },
};
