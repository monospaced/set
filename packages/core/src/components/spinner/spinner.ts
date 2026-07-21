import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetSpinnerSize =
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "fill";
export type SetSpinnerTone = "default" | "brand";

export interface SetSpinnerProps {
  /** DOM id. */
  id?: string;
  /** Accessible status label. */
  label?: string;
  /** Size variant. @default "md" */
  size?: SetSpinnerSize;
  /** Tone variant. @default "default" */
  tone?: SetSpinnerTone;
}

/**
 * Builds the IR tree for the Set spinner component.
 *
 * @param props - Spinner component props.
 * @returns IR node for a spinner element.
 */
export function buildSetSpinner({
  id,
  label,
  size = "md",
  tone = "default",
}: SetSpinnerProps = {}): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const children: SetNode[] = [
    {
      kind: "element",
      tag: "svg",
      attrs: {
        "aria-hidden": "true",
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 544 544",
      },
      children: [
        {
          kind: "element",
          tag: "circle",
          attrs: {
            class: "circle-lg",
            cx: "272",
            cy: "272",
            fill: "none",
            r: "208",
            stroke: "currentColor",
            "stroke-width": "32",
          },
          children: [],
        },
        {
          kind: "element",
          tag: "circle",
          attrs: {
            class: "circle-sm",
            cx: "125",
            cy: "419",
            fill: "currentColor",
            r: "64",
          },
          children: [],
        },
      ],
    },
  ];

  if (label) {
    children.push({
      kind: "element",
      tag: "span",
      attrs: { class: "visually-hidden" },
      children: [{ kind: "text", value: label }],
    });
  }

  return {
    kind: "element",
    tag: "span",
    attrs: {
      class: "set-spinner",
      "data-size": size,
      "data-tone": tone === "brand" ? "brand" : undefined,
      id: normalizedId,
      role: label ? "status" : undefined,
    },
    children,
  };
}

/**
 * SSR renderer for the Set spinner component.
 *
 * @param props - Spinner component props.
 * @returns HTML string for a spinner element.
 */
export function renderSetSpinner(props: SetSpinnerProps = {}): string {
  return serializeSetNode(buildSetSpinner(props));
}

/** Declarative spinner contract mirror for tooling, docs, and adapters. */
export const SET_SPINNER_SPEC: SetComponentSpec = {
  name: "spinner",
  description: "Use `spinner` to indicate loading or in-progress state.",
  output: { element: "span", class: "set-spinner" },
  content: { kind: "text", prop: "label" },
  props: {
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    label: {
      description: "Accessible status label announced to assistive tech.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: {
        kind: "enum",
        values: ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "fill"],
      },
    },
    tone: {
      default: "default",
      description: "Semantic tone.",
      type: { kind: "enum", values: ["default", "brand"] },
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
        attribute: "data-tone",
        condition: { kind: "when-equals", prop: "tone", to: "brand" },
        value: { kind: "literal", text: "brand" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: { kind: "when-non-empty", prop: "label" },
        value: { kind: "literal", text: "status" },
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
