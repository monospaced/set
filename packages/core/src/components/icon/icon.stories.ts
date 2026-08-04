import { isValidHtmlId } from "../../helpers/string";
import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  renderSetIcon,
  SET_ICON_NAMES,
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
      options: SET_ICON_NAMES,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(SET_ICON_SPEC)}\n\nFor new icons, add a [TDesign](https://tdesign.tencent.com/icons) name in \`icons-tdesign.ts\` (or a custom icon in \`icons-custom.ts\`) and run \`icons:generate\`.`,
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
    name: "setting-1",
    size: "md",
    title: "Title",
  },
  render: (args: SetIconProps) => {
    const normalizedArgs = { ...args };

    if (!normalizedArgs.name) {
      normalizedArgs.name = SET_ICON_NAMES[0];
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
