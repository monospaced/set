import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_SWITCH_SPEC,
  type SetSwitchProps,
  renderSetSwitch,
} from "./switch";

const baseArgTypes = specToArgTypes(SET_SWITCH_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_SWITCH_SPEC),
      },
    },
  },
  title: "Control/Switch",
};

export default meta;

export const Default = {
  args: {
    checked: true,
    description: "Description",
    disabled: false,
    id: "switch-id",
    label: "Label",
    name: "",
    size: "md",
    value: "",
  } satisfies SetSwitchProps,
  render: (args: SetSwitchProps) =>
    renderSetSwitch({
      ...args,
      id: args.description?.trim()
        ? args.id?.trim() || "storybook-fallback-switch-id"
        : args.id?.trim() || undefined,
    }),
};
