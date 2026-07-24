import { isValidHtmlId } from "../../helpers/string";
import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetIcon,
  SET_ICON_RECOMMENDED,
  SET_ICON_SPEC,
  type SetIconProps,
} from "./icon";

const baseArgTypes = specToArgTypes(SET_ICON_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    name: {
      ...baseArgTypes.name,
      control: { type: "select" },
      options: SET_ICON_RECOMMENDED,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_ICON_SPEC)}\n\nName control uses a recommended icon subset; component supports all available icon names at https://lucide.dev/icons/.`,
      },
    },
  },
  title: "Graphic/Icon",
};

export default meta;

export const Default = {
  args: {
    ariaHidden: true,
    id: "icon-id",
    mirrored: undefined,
    name: "settings",
    size: "md",
    title: "Title",
  },
  render: (args: SetIconProps) => {
    const normalizedArgs = { ...args };

    if (!normalizedArgs.name) {
      normalizedArgs.name = SET_ICON_RECOMMENDED[0];
    }
    if (args.ariaHidden === false) {
      if (!args.title?.trim()) {
        normalizedArgs.title = "Storybook fallback title";
      }
      if (!args.id?.trim() || !isValidHtmlId(args.id.trim())) {
        normalizedArgs.id = "storybook-fallback-icon-id";
      }
    }

    return renderSetIcon(normalizedArgs);
  },
};
