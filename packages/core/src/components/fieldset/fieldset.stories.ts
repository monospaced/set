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
