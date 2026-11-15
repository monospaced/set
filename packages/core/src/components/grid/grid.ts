import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";

export type SetGridGap = "default" | "expanded" | "none";
export type SetGridResponsiveRowGap = "md" | "lg" | "xl";
export type SetGridTrack = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface SetGridProps {
  /** Trusted inner HTML (typically grid items). */
  children?: string;
  /** Gap behavior. @default "default" */
  gap?: SetGridGap;
  /** DOM id. */
  id?: string;
  /** Responsive row gap. Overrides the row axis of `gap`. */
  responsiveRowGap?: SetGridResponsiveRowGap;
}

export interface SetGridItemProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Align-self. */
  align?: SetAlign;
  /** Column span when the grid's container is at its default width. */
  colSpan?: SetGridTrack;
  /** Column span when the grid's container is narrow. */
  colSpanNarrow?: SetGridTrack;
  /** Column span when the grid's container is wide. */
  colSpanWide?: SetGridTrack;
  /** Column start when the grid's container is at its default width. */
  colStart?: SetGridTrack;
  /** Column start when the grid's container is narrow. */
  colStartNarrow?: SetGridTrack;
  /** Column start when the grid's container is wide. */
  colStartWide?: SetGridTrack;
  /** DOM id. */
  id?: string;
  /** Justify-self. */
  justify?: SetAlign;
  /** Row span when the grid's container is at its default width. */
  rowSpan?: SetGridTrack;
  /** Row span when the grid's container is narrow. */
  rowSpanNarrow?: SetGridTrack;
  /** Row span when the grid's container is wide. */
  rowSpanWide?: SetGridTrack;
  /** Row start when the grid's container is at its default width. */
  rowStart?: SetGridTrack;
  /** Row start when the grid's container is narrow. */
  rowStartNarrow?: SetGridTrack;
  /** Row start when the grid's container is wide. */
  rowStartWide?: SetGridTrack;
}

const validateGridTrack = (
  value: SetGridTrack | undefined,
): string | undefined => {
  if (value === undefined) return undefined;

  return String(value);
};

/**
 * Builds the IR tree for the Set grid component.
 *
 * @param props - Grid component props.
 * @returns IR node for a grid wrapper.
 */
export function buildSetGrid({
  children,
  gap = "default",
  id,
  responsiveRowGap,
}: SetGridProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-grid",
      "data-gap": gap === "default" ? undefined : gap,
      "data-responsive-row-gap": responsiveRowGap,
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "div",
        attrs: { class: "grid" },
        children: children ? [{ kind: "raw", html: children }] : [],
      },
    ],
  };
}

/**
 * SSR renderer for the Set grid component.
 *
 * @param props - Grid component props.
 * @returns HTML string for a grid wrapper.
 */
export function renderSetGrid(props: SetGridProps): string {
  return serializeSetNode(buildSetGrid(props));
}

/**
 * Builds the IR tree for the Set grid-item component.
 *
 * @param props - Grid-item component props.
 * @returns IR node for a grid item.
 */
export function buildSetGridItem({
  align,
  children,
  colSpan,
  colSpanNarrow,
  colSpanWide,
  colStart,
  colStartNarrow,
  colStartWide,
  id,
  justify,
  rowSpan,
  rowSpanNarrow,
  rowSpanWide,
  rowStart,
  rowStartNarrow,
  rowStartWide,
}: SetGridItemProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-grid-item",
      "data-align": align,
      "data-justify": justify,
      "data-col-span-narrow": validateGridTrack(colSpanNarrow),
      "data-col-start-narrow": validateGridTrack(colStartNarrow),
      "data-col-span": validateGridTrack(colSpan),
      "data-col-start": validateGridTrack(colStart),
      "data-col-span-wide": validateGridTrack(colSpanWide),
      "data-col-start-wide": validateGridTrack(colStartWide),
      "data-row-span-narrow": validateGridTrack(rowSpanNarrow),
      "data-row-start-narrow": validateGridTrack(rowStartNarrow),
      "data-row-span": validateGridTrack(rowSpan),
      "data-row-start": validateGridTrack(rowStart),
      "data-row-span-wide": validateGridTrack(rowSpanWide),
      "data-row-start-wide": validateGridTrack(rowStartWide),
      id: normalizedId,
    },
    children: children ? [{ kind: "raw", html: children }] : [],
  };
}

/**
 * SSR renderer for the Set grid-item component.
 *
 * @param props - Grid-item component props.
 * @returns HTML string for a grid item.
 */
export function renderSetGridItem(props: SetGridItemProps): string {
  return serializeSetNode(buildSetGridItem(props));
}

/** Declarative grid contract mirror for tooling, docs, and adapters. */
export const SET_GRID_SPEC: SetComponentSpec = {
  name: "grid",
  category: "layout",
  description:
    "Use `grid` to lay out content in a 12-column grid that responds to its container.",
  output: { element: "div", class: "set-grid" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "`grid-item` components rendered inside the grid.",
      type: { kind: "html" },
    },
    gap: {
      default: "default",
      description: "Space between the `grid-item` components.",
      type: { kind: "enum", values: ["default", "expanded", "none"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    responsiveRowGap: {
      description: "Responsive row gap. Overrides the row axis of `gap`.",
      type: { kind: "enum", values: ["md", "lg", "xl"] },
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-gap",
        condition: {
          kind: "when-in",
          prop: "gap",
          values: ["expanded", "none"],
        },
        value: { kind: "prop", prop: "gap" },
      },
      {
        target: { on: "host" },
        attribute: "data-responsive-row-gap",
        condition: {
          kind: "when-in",
          prop: "responsiveRowGap",
          values: ["md", "lg", "xl"],
        },
        value: { kind: "prop", prop: "responsiveRowGap" },
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

const gridTrackType = {
  kind: "number",
  min: 1,
  max: 12,
  integer: true,
} as const;

/** Declarative grid-item contract mirror for tooling, docs, and adapters. */
export const SET_GRID_ITEM_SPEC: SetComponentSpec = {
  name: "grid-item",
  category: "layout",
  description: "Use `grid-item` to place content within a `grid` layout.",
  output: { element: "div", class: "set-grid-item" },
  content: { kind: "html", prop: "children" },
  props: {
    children: {
      description: "Content rendered inside the grid item.",
      type: { kind: "html" },
    },
    align: {
      description: "Block-axis alignment within the grid cell.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    justify: {
      description: "Inline-axis alignment within the grid cell.",
      type: { kind: "enum", values: ["start", "center", "end"] },
    },
    colSpan: {
      description:
        "Columns spanned when the grid's container is at its default width.",
      type: gridTrackType,
    },
    colStart: {
      description:
        "Starting column when the grid's container is at its default width.",
      type: gridTrackType,
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    rowSpan: {
      description:
        "Rows spanned when the grid's container is at its default width.",
      type: gridTrackType,
    },
    rowSpanNarrow: {
      description: "Rows spanned when the grid's container is narrow.",
      type: gridTrackType,
    },
    rowSpanWide: {
      description: "Rows spanned when the grid's container is wide.",
      type: gridTrackType,
    },
    rowStart: {
      description:
        "Starting row when the grid's container is at its default width.",
      type: gridTrackType,
    },
    rowStartNarrow: {
      description: "Starting row when the grid's container is narrow.",
      type: gridTrackType,
    },
    rowStartWide: {
      description: "Starting row when the grid's container is wide.",
      type: gridTrackType,
    },
    colSpanNarrow: {
      description: "Columns spanned when the grid's container is narrow.",
      type: gridTrackType,
    },
    colStartNarrow: {
      description: "Starting column when the grid's container is narrow.",
      type: gridTrackType,
    },
    colSpanWide: {
      description: "Columns spanned when the grid's container is wide.",
      type: gridTrackType,
    },
    colStartWide: {
      description: "Starting column when the grid's container is wide.",
      type: gridTrackType,
    },
  },
  events: {},
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: { kind: "when-provided", prop: "align" },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "data-justify",
        condition: { kind: "when-provided", prop: "justify" },
        value: { kind: "prop", prop: "justify" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-span",
        condition: { kind: "when-provided", prop: "colSpan" },
        value: { kind: "prop", prop: "colSpan" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-start",
        condition: { kind: "when-provided", prop: "colStart" },
        value: { kind: "prop", prop: "colStart" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-span-narrow",
        condition: { kind: "when-provided", prop: "colSpanNarrow" },
        value: { kind: "prop", prop: "colSpanNarrow" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-start-narrow",
        condition: { kind: "when-provided", prop: "colStartNarrow" },
        value: { kind: "prop", prop: "colStartNarrow" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-span-wide",
        condition: { kind: "when-provided", prop: "colSpanWide" },
        value: { kind: "prop", prop: "colSpanWide" },
      },
      {
        target: { on: "host" },
        attribute: "data-col-start-wide",
        condition: { kind: "when-provided", prop: "colStartWide" },
        value: { kind: "prop", prop: "colStartWide" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-span",
        condition: { kind: "when-provided", prop: "rowSpan" },
        value: { kind: "prop", prop: "rowSpan" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-start",
        condition: { kind: "when-provided", prop: "rowStart" },
        value: { kind: "prop", prop: "rowStart" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-span-narrow",
        condition: { kind: "when-provided", prop: "rowSpanNarrow" },
        value: { kind: "prop", prop: "rowSpanNarrow" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-start-narrow",
        condition: { kind: "when-provided", prop: "rowStartNarrow" },
        value: { kind: "prop", prop: "rowStartNarrow" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-span-wide",
        condition: { kind: "when-provided", prop: "rowSpanWide" },
        value: { kind: "prop", prop: "rowSpanWide" },
      },
      {
        target: { on: "host" },
        attribute: "data-row-start-wide",
        condition: { kind: "when-provided", prop: "rowStartWide" },
        value: { kind: "prop", prop: "rowStartWide" },
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
