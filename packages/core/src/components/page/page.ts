import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetTheme } from "../root/root";
import type { SetSurfaceVariant } from "../surface/surface";

export type SetPageHeaderBackground = "default" | "panel" | "transparent";
export type SetPageHeaderBorder = "always" | "scroll";
export type SetPageHeaderSize = "sm" | "md" | "lg";
export type SetPageHeaderSticky = "always" | "belowNotebook";

export interface SetPageProps {
  /** Optional banner region markup rendered before the header. Caller sanitizes untrusted content. */
  banner?: string;
  /** Centers the main region within the page shell. Emits `data-center-main` only when true. @default false */
  centerMain?: boolean;
  /** Main region markup rendered inside the page-owned `<main>`. Caller sanitizes untrusted content. */
  children?: string;
  /** Header region markup. Caller sanitizes untrusted content. */
  header: string;
  /** Header background. @default "default" */
  headerBackground?: SetPageHeaderBackground;
  /** Bottom border on the header. `"scroll"` requires `headerSticky`. */
  headerBorder?: SetPageHeaderBorder;
  /** Theme lock for header content. */
  headerContentTheme?: SetTheme;
  /** Header size. Reserves a minimum block size on the header. @default "md" */
  headerSize?: SetPageHeaderSize;
  /** Sticky header behavior. Emits `data-header-sticky` when provided. */
  headerSticky?: SetPageHeaderSticky;
  /** Header surface context. */
  headerSurface?: SetSurfaceVariant;
  /** DOM id. */
  id?: string;
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
  headerBackground = "default",
  headerBorder,
  headerContentTheme,
  headerSize = "md",
  headerSticky,
  headerSurface,
  id,
}: SetPageProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  // A content theme only resolves against a surface on the same element.
  const resolvedHeaderSurface = headerContentTheme
    ? (headerSurface ?? "default")
    : headerSurface;
  const regionChildren: SetNode[] = [];

  if (banner) regionChildren.push({ kind: "raw", html: banner });

  regionChildren.push({
    kind: "element",
    tag: "header",
    attrs: {
      class: "header",
      "data-background":
        headerBackground === "default" ? undefined : headerBackground,
      "data-set-content-theme": headerContentTheme,
      "data-set-surface": resolvedHeaderSurface,
    },
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
      "data-header-sticky": headerSticky,
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
  category: "structure",
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
      description:
        "Header content. The header centres it vertically in its reserved block size.",
      required: true,
      type: { kind: "html" },
    },
    headerBackground: {
      default: "default",
      description:
        "Background of the header itself, so a sticky header is opaque over scrolled content. `'transparent'` for a see-through header on purpose, such as over a hero.",
      type: { kind: "enum", values: ["default", "panel", "transparent"] },
    },
    headerBorder: {
      description:
        "Bottom border on the header, in the header's own surface. `'always'` is persistent; `'scroll'` fades in only when a sticky header is stuck (browsers without `container-type: scroll-state` fall back to always-on).",
      type: { kind: "enum", values: ["always", "scroll"] },
    },
    headerContentTheme: {
      description:
        "Absolute theme lock for content rendered inside the header.",
      type: { kind: "enum", values: ["light", "dark"] },
    },
    headerSize: {
      default: "md",
      description:
        "Reserves a minimum block size on the header. `--set-layout-page-header-block-size-current` holds the size in effect, for anything that must line up with it, such as a sticky element below the header.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
    headerSticky: {
      description: "When the header stays stuck to the top of the viewport.",
      type: { kind: "enum", values: ["always", "belowNotebook"] },
    },
    headerSurface: {
      description:
        "Surface context of the header. Inherits the surrounding context when omitted.",
      type: {
        kind: "enum",
        values: [
          "default",
          "brandSubtle",
          "brand",
          "brandSecondary",
          "brandTertiary",
        ],
      },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
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
        attribute: "data-header-sticky",
        condition: { kind: "when-provided", prop: "headerSticky" },
        value: { kind: "prop", prop: "headerSticky" },
      },
      {
        target: { on: "descendant", selector: ":scope > .header" },
        attribute: "data-background",
        condition: {
          kind: "when-in",
          prop: "headerBackground",
          values: ["panel", "transparent"],
        },
        value: { kind: "prop", prop: "headerBackground" },
      },
      {
        target: { on: "descendant", selector: ":scope > .header" },
        attribute: "data-set-content-theme",
        condition: { kind: "when-provided", prop: "headerContentTheme" },
        value: { kind: "prop", prop: "headerContentTheme" },
      },
      {
        target: { on: "descendant", selector: ":scope > .header" },
        attribute: "data-set-surface",
        condition: {
          kind: "all",
          of: [
            { kind: "when-provided", prop: "headerContentTheme" },
            {
              kind: "not",
              of: { kind: "when-provided", prop: "headerSurface" },
            },
          ],
        },
        value: { kind: "literal", text: "default" },
      },
      {
        target: { on: "descendant", selector: ":scope > .header" },
        attribute: "data-set-surface",
        condition: { kind: "when-provided", prop: "headerSurface" },
        value: { kind: "prop", prop: "headerSurface" },
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
