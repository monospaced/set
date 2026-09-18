import { processMarkdownInline } from "@monospaced/set-markdown";

import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetHeading,
  SET_HEADING_SPEC,
  type SetHeadingProps,
} from "./heading";

const baseArgTypes = specToArgTypes(SET_HEADING_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_HEADING_SPEC),
      },
    },
  },
  title: "Typographic/Heading",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    children: processMarkdownInline(
      "Heading with [link](https://monospaced.com)",
    ),
    id: "",
    level: undefined,
    linkVisited: true,
    opticalAlign: false,
    responsive: false,
    size: "md",
  } satisfies SetHeadingProps,
  render: (args: SetHeadingProps) => renderSetHeading({ ...args }),
};
