import { specToArgTypes, specToComponentDescription } from "../../spec";
import { SET_BOX_SPEC, type SetBoxProps, renderSetBox } from "./box";

const baseArgTypes = specToArgTypes(SET_BOX_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_BOX_SPEC),
      },
    },
  },
  title: "Layout/Box",
};

export default meta;

export const Default = {
  args: {
    background: "default",
    border: true,
    children: '<div class="example-content"></div>',
    id: "",
    paddingBlock: "md",
    paddingInline: "md",
    radius: undefined,
    responsive: false,
    surface: undefined,
  } satisfies SetBoxProps,
  render: (args: SetBoxProps) => renderSetBox(args),
};
