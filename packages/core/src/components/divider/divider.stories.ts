import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetDivider,
  SET_DIVIDER_SPEC,
  type SetDividerProps,
} from "./divider";

const meta = {
  argTypes: specToArgTypes(SET_DIVIDER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_DIVIDER_SPEC),
      },
    },
  },
  title: "Layout/Divider",
};

export default meta;

export const Default = {
  args: {
    id: "",
    orientation: "horizontal",
    tone: "default",
  } satisfies SetDividerProps,
  render: (args: SetDividerProps) => renderSetDivider(args),
};
