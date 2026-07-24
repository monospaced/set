import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetLogo, SET_LOGO_SPEC, type SetLogoProps } from "./logo";

const meta = {
  argTypes: specToArgTypes(SET_LOGO_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_LOGO_SPEC),
      },
    },
  },
  title: "Graphic/Logo",
};

export default meta;

export const Default = {
  args: {
    id: "",
    label: "Monospaced",
    size: "md",
    tone: "default",
    variant: "primary",
  } satisfies SetLogoProps,
  render: (args: SetLogoProps) => renderSetLogo(args),
};
