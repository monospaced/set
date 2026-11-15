import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetFieldset,
  SET_FIELDSET_SPEC,
  type SetFieldsetProps,
} from "./fieldset";

const baseArgTypes = specToArgTypes(SET_FIELDSET_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_FIELDSET_SPEC),
      },
    },
  },
  title: "Control/Fieldset",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    description: "Description",
    disabled: false,
    id: "fieldset-id",
    inlineSize: "fit",
    invalid: false,
    legend: "Legend",
  } satisfies SetFieldsetProps,
  render: (args: SetFieldsetProps) =>
    renderSetFieldset({
      ...args,
      id: args.id?.trim() || "storybook-fallback-fieldset-id",
    }),
};

export const Invalid = {
  args: {
    ...Default.args,
    description: "Choose at least one option.",
    invalid: true,
  } satisfies SetFieldsetProps,
  parameters: {
    docs: {
      description: {
        story:
          "When invalid, the description holds the error message. It is read with the group and styled as the error.",
      },
    },
  },
  render: (args: SetFieldsetProps) =>
    renderSetFieldset({
      ...args,
      id: args.id?.trim() || "storybook-fallback-fieldset-id",
    }),
};
