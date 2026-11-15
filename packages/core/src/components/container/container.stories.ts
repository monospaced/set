import {
  specToArgTypes,
  specToComponentDescription,
  specToStoryTitle,
} from "../../spec";
import {
  renderSetContainer,
  SET_CONTAINER_SPEC,
  type SetContainerProps,
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
  title: specToStoryTitle(SET_CONTAINER_SPEC),
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
