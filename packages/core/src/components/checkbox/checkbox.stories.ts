import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetCheckbox,
  SET_CHECKBOX_SPEC,
  type SetCheckboxProps,
} from "./checkbox";

const baseArgTypes = specToArgTypes(SET_CHECKBOX_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_CHECKBOX_SPEC),
      },
    },
  },
  title: "Control/Checkbox",
};

export default meta;

export const Default = {
  args: {
    checked: false,
    description: "Description",
    disabled: false,
    id: "checkbox-id",
    invalid: false,
    label: "Label",
    name: "",
    required: false,
    size: "md",
    value: "",
  } satisfies SetCheckboxProps,
  render: (args: SetCheckboxProps) =>
    renderSetCheckbox({
      ...args,
      id: args.description?.trim()
        ? args.id?.trim() || "storybook-fallback-checkbox-id"
        : args.id?.trim() || undefined,
    }),
};

export const Indeterminate = {
  args: {
    ...Default.args,
    label: "Partially selected",
  } satisfies SetCheckboxProps,
  parameters: {
    docs: { disable: true },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const input = canvasElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;

    if (input) input.indeterminate = true;
  },
  render: Default.render,
};

export const Invalid = {
  args: {
    ...Default.args,
    description: "Accept the terms to continue.",
    invalid: true,
  } satisfies SetCheckboxProps,
  parameters: {
    docs: {
      description: {
        story:
          "When invalid, the description holds the error message. It is read with the control and styled as the error.",
      },
    },
  },
  render: (args: SetCheckboxProps) =>
    renderSetCheckbox({
      ...args,
      id: args.id?.trim() || "storybook-fallback-checkbox-id",
    }),
};
