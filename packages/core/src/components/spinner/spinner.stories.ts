import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_SPINNER_SPEC,
  type SetSpinnerProps,
  renderSetSpinner,
} from "./spinner";

const meta = {
  argTypes: specToArgTypes(SET_SPINNER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_SPINNER_SPEC),
      },
    },
  },
  title: "Status/Spinner",
};

export default meta;

export const Default = {
  args: {
    id: "",
    label: "",
    size: "md",
    tone: "default",
  } satisfies SetSpinnerProps,
  render: (args: SetSpinnerProps) => renderSetSpinner({ ...args }),
};
