import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetDetails,
  SET_DETAILS_SPEC,
  type SetDetailsProps,
} from "./details";

const baseArgTypes = specToArgTypes(SET_DETAILS_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_DETAILS_SPEC),
      },
    },
  },
  title: "Structure/Details",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    id: "",
    inlineSize: "fit",
    open: false,
    summary: "Summary",
  } satisfies SetDetailsProps,
  render: (args: SetDetailsProps) => renderSetDetails({ ...args }),
};
