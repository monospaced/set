import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetBox } from "../box/box";
import {
  defineSetSidebar,
  renderSetSidebar,
  SET_SIDEBAR_SPEC,
  type SetSidebarProps,
} from "./sidebar";

defineSetSidebar();

const baseArgTypes = specToArgTypes(SET_SIDEBAR_SPEC);

const meta = {
  argTypes: baseArgTypes,
  decorators: [
    (Story: () => string) =>
      `<div style="min-block-size: 12rem">${Story()}</div>`,
  ],
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_SIDEBAR_SPEC),
      },
    },
    padding: "1rem",
  },
  title: "Structure/Sidebar",
};

export default meta;

export const Default = {
  args: {
    aboveNotebook: "persistent",
    buttonSize: "md",
    collapseLabel: "Collapse sidebar",
    id: "sidebar-id",
    surface: undefined,
    triggerLabel: "Open sidebar",
    header: renderSetBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Header</span>`,
    }),
    children: `<div class="example-content"></div>`,
  } satisfies SetSidebarProps,
  render: (args: SetSidebarProps) =>
    renderSetSidebar({
      ...args,
      id: args.id?.trim() || "storybook-fallback-sidebar-id",
    }),
};

export const Footer = {
  args: {
    aboveNotebook: "overlay",
    buttonSize: "md",
    id: "footer-sidebar-id",
    header: renderSetBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Header</span>`,
    }),
    children: `<div class="example-content"></div>`,
    footer: renderSetBox({
      paddingBlock: "none",
      paddingInline: "xs",
      children: `<span>Footer</span>`,
    }),
  } satisfies SetSidebarProps,
  render: (args: SetSidebarProps) =>
    renderSetSidebar({
      ...args,
      id: args.id?.trim() || "storybook-fallback-sidebar-id",
    }),
};
