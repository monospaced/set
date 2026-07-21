import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  type SetGridProps,
  renderSetGrid,
  renderSetGridItem,
} from "../grid/grid";
import { SET_CARD_SPEC, type SetCardProps, renderSetCard } from "./card";

const meta = {
  argTypes: specToArgTypes(SET_CARD_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_CARD_SPEC),
      },
    },
  },
  title: "Structure/Card",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    headingLevel: undefined,
    href: "#",
    id: "",
    note: "Note",
    surface: undefined,
    title: "Title",
  } satisfies SetCardProps,
  render: (args: SetCardProps) => renderSetCard(args),
};

export const Cards = {
  parameters: { controls: { disable: true } },
  args: {
    children: [
      renderSetGridItem({
        colSpan: 4,
        colSpanNarrow: 6,
        colSpanWide: 3,
        children: renderSetCard({
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          href: "#",
          note: "Note",
          title: "Title",
        }),
      }),
      renderSetGridItem({
        colSpan: 4,
        colSpanNarrow: 6,
        colSpanWide: 3,
        children: renderSetCard({
          description: "Description",
          href: "#",
          note: "Note",
          title: "Title",
        }),
      }),
    ].join(""),
    gap: "default",
  } satisfies SetGridProps,
  render: (args: SetGridProps) => renderSetGrid(args),
};
