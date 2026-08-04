import { specToArgTypes, specToComponentDescription } from "../../spec";
import { SET_ICON_NAMES } from "../icon/icon";
import {
  defineSetMenu,
  renderSetMenu,
  SET_MENU_SPEC,
  type SetMenuProps,
} from "./menu";

defineSetMenu();

const baseArgTypes = specToArgTypes(SET_MENU_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    items: { ...baseArgTypes.items, control: false },
    triggerIcon: {
      ...baseArgTypes.triggerIcon,
      control: { type: "select" as const },
      options: SET_ICON_NAMES,
    },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_MENU_SPEC),
      },
    },
  },
  title: "Control/Menu",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    id: "menu-id",
    items: [
      { id: "first", label: "Item one" },
      { id: "second", label: "Item two" },
      { id: "third", label: "Item three" },
      { disabled: true, id: "fourth", label: "Item four" },
    ],
    size: "md",
    triggerIcon: undefined,
    triggerIconMirrored: undefined,
    triggerIconPlacement: "start",
    triggerLabel: "Label",
    triggerLabelVisibility: "visible",
  } satisfies SetMenuProps,
  decorators: [
    (Story: () => string) =>
      `<div style="min-block-size: 12rem">${Story()}</div>`,
  ],
  render: (args: SetMenuProps) =>
    renderSetMenu({
      ...args,
      id: args.id || "storybook-fallback-menu-id",
    }),
};
