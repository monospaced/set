import { type SetNode, serializeSetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetAlign } from "../../types";

export type SetGridGap = "default" | "expanded" | "none";
export type SetGridTrack = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface SetGridProps {
  /** Trusted inner HTML (typically grid items). */
  children?: string;
  /** Gap behavior. @default "default" */
  gap?: SetGridGap;
  /** DOM id. */
  id?: string;
}

export interface SetGridItemProps {
  /** Trusted inner HTML. */
  children?: string;
  /** Align-self. */
  align?: SetAlign;
  /** Column span at default container threshold. */
  colSpan?: SetGridTrack;
  /** Column span at narrow container threshold. */
  colSpanNarrow?: SetGridTrack;
  /** Column span at wide container threshold. Effect is only visible above the wide breakpoint. */
  colSpanWide?: SetGridTrack;
  /** Column start at default container threshold. */
  colStart?: SetGridTrack;
  /** Column start at narrow container threshold. */
  colStartNarrow?: SetGridTrack;
  /** Column start at wide container threshold. Effect is only visible above the wide breakpoint. */
  colStartWide?: SetGridTrack;
  /** DOM id. */
  id?: string;
  /** Justify-self. */
  justify?: SetAlign;
  /** Row span at default container threshold. */
  rowSpan?: SetGridTrack;
  /** Row span at narrow container threshold. */
  rowSpanNarrow?: SetGridTrack;
  /** Row span at wide container threshold. Effect is only visible above the wide breakpoint. */
  rowSpanWide?: SetGridTrack;
  /** Row start at default container threshold. */
  rowStart?: SetGridTrack;
  /** Row start at narrow container threshold. */
  rowStartNarrow?: SetGridTrack;
  /** Row start at wide container threshold. Effect is only visible above the wide breakpoint. */
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
}: SetGridProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);

  return {
    kind: "element",
    tag: "div",
    attrs: {
      class: "set-grid",
      "data-gap": gap === "default" ? undefined : gap,
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
  description: "Use `grid` to lay out content in a 12-column responsive grid.",
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
      description: "Columns spanned at the default breakpoint.",
      type: gridTrackType,
    },
    colStart: {
      description: "Starting column at the default breakpoint.",
      type: gridTrackType,
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    rowSpan: {
      description: "Rows spanned at the default breakpoint.",
      type: gridTrackType,
    },
    rowSpanNarrow: {
      description: "Rows spanned at the narrow breakpoint.",
      type: gridTrackType,
    },
    rowSpanWide: {
      description:
        "Rows spanned at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      type: gridTrackType,
    },
    rowStart: {
      description: "Starting row at the default breakpoint.",
      type: gridTrackType,
    },
    rowStartNarrow: {
      description: "Starting row at the narrow breakpoint.",
      type: gridTrackType,
    },
    rowStartWide: {
      description:
        "Starting row at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      type: gridTrackType,
    },
    colSpanNarrow: {
      description: "Columns spanned at the narrow breakpoint.",
      type: gridTrackType,
    },
    colStartNarrow: {
      description: "Starting column at the narrow breakpoint.",
      type: gridTrackType,
    },
    colSpanWide: {
      description:
        "Columns spanned at the wide breakpoint. Effect is only visible above the wide breakpoint.",
      type: gridTrackType,
    },
    colStartWide: {
      description:
        "Starting column at the wide breakpoint. Effect is only visible above the wide breakpoint.",
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
