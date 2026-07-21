import {
  specToArgTypes,
  specToComponentDescription,
  specToPropsTable,
} from "../../spec";
import {
  SET_GRID_ITEM_SPEC,
  SET_GRID_SPEC,
  type SetGridItemProps,
  type SetGridProps,
  renderSetGrid,
  renderSetGridItem,
} from "./grid";

const gridArgTypes = specToArgTypes(SET_GRID_SPEC);
const gridItemArgTypes = specToArgTypes(SET_GRID_ITEM_SPEC);
const gridPropsTable = specToPropsTable(SET_GRID_SPEC);

const meta = {
  argTypes: gridItemArgTypes,
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_GRID_ITEM_SPEC)}\n\nDocs controls drive the first \`grid-item\` in the primary story. See \`Grid\` story below for parent \`grid\` component props.`,
      },
    },
    padding: 0,
  },
  title: "Layout/Grid",
};

export default meta;

export const Default = {
  args: {
    colSpan: 4,
    colSpanNarrow: 6,
    colSpanWide: 3,
    id: "",
  } satisfies SetGridItemProps,
  render: (args: SetGridItemProps) =>
    renderSetGrid({
      children: [
        renderSetGridItem({
          ...args,
          children: `<div class="example-content-item"></div>`,
        }),
        Array.from({ length: 11 })
          .map(() =>
            renderSetGridItem({
              colSpan: 4,
              colSpanNarrow: 6,
              colSpanWide: 3,
              children: `<div class="example-content-grid"></div>`,
            }),
          )
          .join(""),
      ].join(""),
    }),
};

export const Grid = {
  argTypes: gridArgTypes,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `${specToComponentDescription(SET_GRID_SPEC)}\n\n${gridPropsTable}`,
      },
    },
  },
  render: (args: SetGridProps) =>
    renderSetGrid({
      ...args,
      children: Array.from({ length: 12 })
        .map(() =>
          renderSetGridItem({
            colSpan: 4,
            colSpanNarrow: 6,
            colSpanWide: 3,
            children: `<div class="example-content"></div>`,
          }),
        )
        .join(""),
    }),
};
