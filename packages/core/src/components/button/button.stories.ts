import { specToArgTypes, specToComponentDescription } from "../../spec";
import { SET_ICON_RECOMMENDED } from "../icon/icon";
import { renderSetInline } from "../inline/inline";
import {
  renderSetButton,
  SET_BUTTON_SPEC,
  type SetButtonProps,
} from "./button";

const baseArgTypes = specToArgTypes(SET_BUTTON_SPEC);

const iconArgType = {
  ...baseArgTypes.icon,
  control: { type: "select" as const },
  options: SET_ICON_RECOMMENDED,
};

const buttonArgTypes = {
  ...baseArgTypes,
  icon: iconArgType,
};

const meta = {
  argTypes: buttonArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_BUTTON_SPEC),
      },
    },
  },
  title: "Control/Button",
};

export default meta;

export const Button = {
  args: {
    appearance: "outline",
    controls: "",
    disabled: false,
    disclosure: false,
    form: "",
    haspopup: undefined,
    icon: undefined,
    iconMirrored: undefined,
    iconPlacement: "start",
    id: "",
    label: "Button",
    labelVisibility: "visible",
    name: "",
    size: "md",
    tone: "default",
    type: "button",
    value: "",
  } satisfies SetButtonProps,
  argTypes: buttonArgTypes,
  render: (args: SetButtonProps) =>
    renderSetButton({
      ...args,
      form: args.form || undefined,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
      name: args.name || undefined,
      value: args.value || undefined,
    }),
};

export const Icon = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetInline({
      gap: "xs",
      children: (["text", "outline", "solid"] as const)
        .map((appearance) =>
          renderSetButton({
            appearance,
            icon: "search",
            label: "Search",
            labelVisibility: "hidden",
            tone: "neutral",
          }),
        )
        .join(""),
    }),
};
