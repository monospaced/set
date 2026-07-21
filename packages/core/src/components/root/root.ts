import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetBrand = "mnsp" | "wrfr";
export type SetDirection = "ltr" | "rtl";
export type SetAppOverscrollBehavior = "none";
export type SetTheme = "light" | "dark";

export interface SetRootProps {
  /** Marks this root as the owning app root; emits `data-app-root` when true. @default false */
  appRoot?: boolean;
  /** Opts into `overscroll-behavior: none` integration hooks; emits `data-app-overscroll-behavior="none"`. */
  appOverscrollBehavior?: SetAppOverscrollBehavior;
  /** Brand variant applied to the root wrapper. @default "mnsp" */
  brand?: SetBrand;
  /** Inner HTML content. Caller sanitizes untrusted content. */
  children: string;
  /** Optional explicit text direction. */
  dir?: SetDirection;
  /** DOM id. */
  id?: string;
  /** Optional BCP47 language tag (e.g. `en-GB`). */
  lang?: string;
  /** Optional explicit theme variant. */
  theme?: SetTheme;
}

/**
 * Builds the IR tree for the Set root component.
 *
 * @param props - Root component props.
 * @returns IR node for the Set root component.
 */
export function buildSetRoot({
  appOverscrollBehavior,
  appRoot,
  brand = "mnsp",
  children,
  dir,
  id,
  lang,
  theme,
}: SetRootProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set",
      "data-app-root": appRoot,
      "data-app-overscroll-behavior":
        appOverscrollBehavior === "none" ? "none" : undefined,
      "data-set-brand": brand,
      "data-set-theme": theme,
      id: normalizedId,
      lang: lang === "" ? undefined : lang,
      dir,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set root component.
 *
 * Emits a `<div>` with the Set root class, required `data-set-brand`,
 * optional `data-set-theme`, and optional `dir`/`lang` attributes, then injects
 * the provided HTML content inside.
 *
 * @param props - Root component props.
 * @returns HTML string for the Set root component.
 */
export function renderSetRoot(props: SetRootProps): string {
  return serializeSetNode(buildSetRoot(props));
}

/** Declarative root contract mirror for tooling, docs, and adapters. */
export const SET_ROOT_SPEC: SetComponentSpec = {
  name: "root",
  description: "Mandatory top-level `root` wrapper for the Set system.",
  output: { element: "div", class: "set" },
  content: { kind: "html", prop: "children" },
  props: {
    appOverscrollBehavior: {
      description: "Disables overscroll bounce for app-shell integrations.",
      type: { kind: "enum", values: ["none"] },
    },
    appRoot: {
      default: false,
      description: "Marks this wrapper as the app root.",
      type: { kind: "boolean" },
    },
    brand: {
      default: "mnsp",
      description: "Brand identity applied to the wrapper.",
      type: { kind: "enum", values: ["mnsp", "wrfr"] },
    },
    children: {
      description: "Content rendered inside the root.",
      required: true,
      type: { kind: "html" },
    },
    dir: {
      description: "Text direction.",
      type: { kind: "enum", values: ["ltr", "rtl"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    lang: {
      description: "BCP47 language tag (e.g. `en-GB`).",
      type: { kind: "string" },
    },
    theme: {
      description: "Colour theme.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-app-overscroll-behavior",
        condition: {
          kind: "when-equals",
          prop: "appOverscrollBehavior",
          to: "none",
        },
        value: { kind: "literal", text: "none" },
      },
      {
        target: { on: "host" },
        attribute: "data-app-root",
        condition: { kind: "when-truthy", prop: "appRoot" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-brand",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "brand" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-theme",
        condition: { kind: "when-provided", prop: "theme" },
        value: { kind: "prop", prop: "theme" },
      },
      {
        target: { on: "host" },
        attribute: "dir",
        condition: { kind: "when-provided", prop: "dir" },
        value: { kind: "prop", prop: "dir" },
      },
      {
        target: { on: "host" },
        attribute: "lang",
        condition: { kind: "when-non-empty", prop: "lang" },
        value: { kind: "prop", prop: "lang" },
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
