import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";

export type SetPageHeaderBorder = "always" | "scroll";
export type SetPageHeaderSize = "sm" | "md" | "lg";
export type SetPageStickyHeader = "always" | "belowNotebook";

export interface SetPageProps {
  /** Optional banner region markup rendered before the header. Caller sanitizes untrusted content. */
  banner?: string;
  /** Centers the main region within the page shell. Emits `data-center-main` only when true. @default false */
  centerMain?: boolean;
  /** Main region markup rendered inside the page-owned `<main>`. Caller sanitizes untrusted content. */
  children?: string;
  /** Header region markup. Caller sanitizes untrusted content. */
  header: string;
  /** Bottom border on the header. `"scroll"` requires `stickyHeader`. */
  headerBorder?: SetPageHeaderBorder;
  /** Header size. Reserves a minimum block size on the header. @default "md" */
  headerSize?: SetPageHeaderSize;
  /** DOM id. */
  id?: string;
  /** Sticky header behavior. Emits `data-sticky-header` when provided. */
  stickyHeader?: SetPageStickyHeader;
  /** Footer region markup. Caller sanitizes untrusted content. */
  footer: string;
}

/**
 * Builds the IR tree for the Set page shell.
 *
 * @param props - Page shell props.
 * @returns IR node for a page wrapper.
 */
export function buildSetPage({
  banner,
  centerMain,
  children,
  footer,
  header,
  headerBorder,
  headerSize = "md",
  id,
  stickyHeader,
}: SetPageProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const regionChildren: SetNode[] = [];

  if (banner) regionChildren.push({ kind: "raw", html: banner });

  regionChildren.push({
    kind: "element",
    tag: "header",
    attrs: { class: "header" },
    children: [{ kind: "raw", html: header }],
  });

  regionChildren.push({
    kind: "element",
    tag: "main",
    attrs: { class: "main" },
    children: children ? [{ kind: "raw", html: children }] : [],
  });

  regionChildren.push({
    kind: "element",
    tag: "footer",
    attrs: { class: "footer" },
    children: [{ kind: "raw", html: footer }],
  });

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-page",
      "data-center-main": centerMain,
      "data-header-border": headerBorder,
      "data-header-size": headerSize,
      "data-sticky-header": stickyHeader,
      id: normalizedId,
    },
    children: regionChildren,
  };
}

/**
 * SSR renderer for the Set page shell.
 *
 * Emits a prescribed page structure with an optional banner region followed by
 * header, main, and footer content. The page shell owns the outer layout
 * wrapper and region elements so the internal page layout can evolve without
 * changing the consumer-facing region contract.
 *
 * @param props - Page shell props.
 * @returns HTML string for a page wrapper.
 */
export function renderSetPage(props: SetPageProps): string {
  return serializeSetNode(buildSetPage(props));
}

/** Declarative page contract mirror for tooling, docs, and adapters. */
export const SET_PAGE_SPEC: SetComponentSpec = {
  name: "page",
  description:
    "Use `page` as the primary layout for header, main, and footer regions.",
  output: { element: "div", class: "set-page" },
  content: {
    kind: "slots",
    slots: [
      { prop: "banner", kind: "html" },
      { prop: "header", kind: "html" },
      { prop: "children", kind: "html" },
      { prop: "footer", kind: "html" },
    ],
  },
  props: {
    banner: {
      description: "Banner rendered above the header.",
      type: { kind: "html" },
    },
    children: {
      description: "Main content of the page.",
      type: { kind: "html" },
    },
    centerMain: {
      default: false,
      description: "Centers the main region within the page shell.",
      type: { kind: "boolean" },
    },
    header: {
      description: "Header content.",
      required: true,
      type: { kind: "html" },
    },
    headerBorder: {
      description:
        "Bottom border on the header. `'always'` is persistent; `'scroll'` fades in only when a sticky header is stuck (browsers without `container-type: scroll-state` fall back to always-on).",
      type: { kind: "enum", values: ["always", "scroll"] },
    },
    headerSize: {
      default: "md",
      description:
        "Reserves a minimum block size on the header. `--set-page-header-block-size` is exposed to descendants so persistent panels can open below the header band.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    stickyHeader: {
      description: "When the header stays stuck to the top of the viewport.",
      type: { kind: "enum", values: ["always", "belowNotebook"] },
    },
    footer: {
      description: "Footer content.",
      required: true,
      type: { kind: "html" },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-center-main",
        condition: { kind: "when-truthy", prop: "centerMain" },
      },
      {
        target: { on: "host" },
        attribute: "data-header-border",
        condition: { kind: "when-provided", prop: "headerBorder" },
        value: { kind: "prop", prop: "headerBorder" },
      },
      {
        target: { on: "host" },
        attribute: "data-header-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "headerSize" },
      },
      {
        target: { on: "host" },
        attribute: "data-sticky-header",
        condition: { kind: "when-provided", prop: "stickyHeader" },
        value: { kind: "prop", prop: "stickyHeader" },
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
