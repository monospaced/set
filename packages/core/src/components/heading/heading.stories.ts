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
    id: "",
    level: undefined,
    opticalAlign: false,
    responsive: false,
    size: "md",
    text: "Heading",
  } satisfies SetHeadingProps,
  render: (args: SetHeadingProps) => renderSetHeading({ ...args }),
};
