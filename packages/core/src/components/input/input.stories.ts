import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetInput, SET_INPUT_SPEC, type SetInputProps } from "./input";

const baseArgTypes = specToArgTypes(SET_INPUT_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    autocomplete: {
      ...baseArgTypes.autocomplete,
      control: { type: "text" },
    },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_INPUT_SPEC),
      },
    },
  },
  title: "Control/Input",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "input-id",
    inlineSize: "fit",
    invalid: false,
    label: "Label",
    name: "",
    pattern: "",
    readOnly: false,
    required: false,
    size: "md",
    spellcheck: false,
    type: "text",
    value: "Value",
  } satisfies SetInputProps,
  render: (args: SetInputProps) =>
    renderSetInput({
      ...args,
      id: args.id?.trim() || "storybook-fallback-input-id",
    }),
};
