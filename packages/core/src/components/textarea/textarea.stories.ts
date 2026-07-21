import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_TEXTAREA_SPEC,
  type SetTextareaProps,
  renderSetTextarea,
} from "./textarea";

const baseArgTypes = specToArgTypes(SET_TEXTAREA_SPEC);

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
        component: specToComponentDescription(SET_TEXTAREA_SPEC),
      },
    },
  },
  title: "Control/Textarea",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "textarea-id",
    invalid: false,
    inlineSize: "fit",
    label: "Label",
    name: "",
    readOnly: false,
    required: false,
    resize: "vertical",
    rows: 2,
    size: "md",
    spellcheck: false,
    value: "Value",
  } satisfies SetTextareaProps,
  render: (args: SetTextareaProps) =>
    renderSetTextarea({
      ...args,
      id: args.id?.trim() || "storybook-fallback-textarea-id",
    }),
};
