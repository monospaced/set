import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetContainerGutter = "default" | "narrow" | "none";
export type SetContainerMaxInlineSize = "default" | "wide" | "none";

export interface SetContainerProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Inline gutter behavior. @default "default" */
  gutter?: SetContainerGutter;
  /** DOM id. */
  id?: string;
  /** Max-inline-size behavior. Effect is only visible on wider viewports. @default "default" */
  maxInlineSize?: SetContainerMaxInlineSize;
}

/**
 * Builds the IR tree for the Set container component.
 *
 * @param props - Container component props.
 * @returns IR node for a container wrapper.
 */
export function buildSetContainer({
  children,
  gutter = "default",
  id,
  maxInlineSize = "default",
}: SetContainerProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-container",
      "data-gutter": gutter === "default" ? undefined : gutter,
      "data-max-inline-size":
        maxInlineSize === "default" ? undefined : maxInlineSize,
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set container component.
 *
 * @param props - Container component props.
 * @returns HTML string for a container wrapper.
 */
export function renderSetContainer(props: SetContainerProps): string {
  return serializeSetNode(buildSetContainer(props));
}

/** Declarative container contract mirror for tooling, docs, and adapters. */
export const SET_CONTAINER_SPEC: SetComponentSpec = {
  name: "container",
  description: "Use `container` to wrap page-level content.",
  output: { element: "div", class: "set-container" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the container.",
      type: { kind: "html" },
    },
    gutter: {
      default: "default",
      description: "Horizontal gutter width.",
      type: { kind: "enum", values: ["default", "narrow", "none"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    maxInlineSize: {
      default: "default",
      description:
        "Maximum content width. Effect is only visible in wider viewports.",
      type: { kind: "enum", values: ["default", "wide", "none"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-max-inline-size",
        condition: {
          kind: "when-in",
          prop: "maxInlineSize",
          values: ["wide", "none"],
        },
        value: { kind: "prop", prop: "maxInlineSize" },
      },
      {
        target: { on: "host" },
        attribute: "data-gutter",
        condition: {
          kind: "when-in",
          prop: "gutter",
          values: ["narrow", "none"],
        },
        value: { kind: "prop", prop: "gutter" },
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
