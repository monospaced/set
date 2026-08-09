import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  defineSetLightswitch,
  renderSetLightswitch,
  SET_LIGHTSWITCH_SPEC,
  type SetLightswitchProps,
} from "./lightswitch";

defineSetLightswitch();

const meta = {
  argTypes: specToArgTypes(SET_LIGHTSWITCH_SPEC),
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_LIGHTSWITCH_SPEC)}\n\nToolbar theme is ignored on this page; use the \`lightswitch\` instead.`,
      },
    },
    withTheme: false,
  },
  title: "Control/Lightswitch",
};

export default meta;

export const Lightswitch = {
  args: {
    appearance: "text",
    id: "",
    labelDark: "Switch to dark theme",
    labelLight: "Switch to light theme",
    size: "md",
  } satisfies SetLightswitchProps,
  render: (args: SetLightswitchProps) =>
    renderSetLightswitch({
      ...args,
      labelDark: args.labelDark || undefined,
      labelLight: args.labelLight || undefined,
    }),
};
