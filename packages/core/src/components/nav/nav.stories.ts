import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  defineSetNav,
  renderSetNav,
  SET_NAV_SPEC,
  type SetNavItem,
  type SetNavProps,
} from "./nav";

defineSetNav();

const baseArgTypes = specToArgTypes(SET_NAV_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_NAV_SPEC),
      },
    },
    padding: "1.125rem 1rem",
  },
  title: "Navigation/Nav",
};

const items: SetNavItem[] = [
  { href: "#", label: "About" },
  { href: "#", label: "Work" },
  { current: true, href: "#", label: "Blog" },
];

export default meta;

export const Default = {
  args: {
    collapsible: undefined,
    contentId: "content-id",
    expanderLabel: "",
    expanderPosition: "start",
    id: "",
    items,
    label: "",
    size: "md",
  } satisfies SetNavProps,
  decorators: [
    (Story: () => string) =>
      `<div style="min-block-size: 12rem">${Story()}</div>`,
  ],
  render: (args: SetNavProps) =>
    renderSetNav({
      ...args,
      contentId: args.collapsible
        ? args.contentId?.trim() || "storybook-fallback-content-id"
        : args.contentId,
    }),
};
