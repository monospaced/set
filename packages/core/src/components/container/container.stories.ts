import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_CONTAINER_SPEC,
  type SetContainerProps,
  renderSetContainer,
} from "./container";

const baseArgTypes = specToArgTypes(SET_CONTAINER_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_CONTAINER_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Container",
};

export default meta;

export const Default = {
  args: {
    children: `<div class="example-content"></div>`,
    gutter: "default",
    id: "",
    maxInlineSize: "default",
  } satisfies SetContainerProps,
  render: (args: SetContainerProps) => renderSetContainer(args),
};
