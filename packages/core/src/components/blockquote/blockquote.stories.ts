import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_BLOCKQUOTE_SPEC,
  type SetBlockquoteProps,
  renderSetBlockquote,
} from "./blockquote";

const baseArgTypes = specToArgTypes(SET_BLOCKQUOTE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_BLOCKQUOTE_SPEC),
      },
    },
  },
  title: "Typographic/Blockquote",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    attribution: `<a href="http://www.germandesigners.net/designers/hans_peter_schmoller">Hans P. Schmoller</a>, in <cite>Book Design Today</cite>, <cite>Printing Review</cite>, Spring 1951`,
    id: "",
    measured: true,
    quote:
      "One more attribute the modern typographer must have: the capacity for taking great pains with seemingly unimportant detail. To him, one typographical point must be as important as one inch, and he must harden his heart against the accusation of being too fussy.",
    responsive: false,
    size: "md",
  } satisfies SetBlockquoteProps,
  render: (args: SetBlockquoteProps) => renderSetBlockquote(args),
};
