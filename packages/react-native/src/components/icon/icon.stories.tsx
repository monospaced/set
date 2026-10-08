import { Icon, ICON_NAMES, type IconProps } from "./icon";

/**
 * Mirrors core's `icon.stories.ts`. Core's `id` has no job here; `testID`
 * is a native addition.
 */
const argTypes = {
  "aria-hidden": {
    control: { type: "boolean" },
    description:
      "Hides the icon from assistive technology. Decorative by default; set to false for a labelled icon (then `title` is required).",
    table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
  },
  mirrored: {
    control: { type: "select" },
    options: ["always", "rtl"],
    description: "Mirrors the icon horizontally.",
    table: { type: { summary: "always | rtl" } },
  },
  name: {
    control: { type: "select" },
    options: ICON_NAMES,
    description: "Set icon name.",
    type: { required: true },
    table: { type: { summary: "iconName" } },
  },
  size: {
    control: { type: "select" },
    options: ["2xs", "xs", "sm", "md", "lg", "fill"],
    description: "Size variant.",
    table: {
      type: { summary: "2xs | xs | sm | md | lg | fill" },
      defaultValue: { summary: '"md"' },
    },
  },
  testID: {
    control: false,
    description: "Test identifier.",
    table: { type: { summary: "string" } },
  },
  title: {
    control: { type: "text" },
    description:
      "Accessible title announced by assistive technology.\n\nRequired when `aria-hidden` is false.",
    table: { type: { summary: "string" } },
  },
};

const meta = {
  argTypes,
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          "Use `icon` to render a Set icon.\n\nThe registry is `@monospaced/set-icons`, the same geometry core renders.",
      },
    },
  },
  title: "Graphic/Icon",
};

export default meta;

export const Default = {
  args: {
    "aria-hidden": true,
    mirrored: undefined,
    name: "setting-1",
    size: "md",
    title: "Title",
  } satisfies IconProps,
  render: (args: IconProps) => (
    <Icon
      {...args}
      name={args.name || ICON_NAMES[0]!}
      title={
        args["aria-hidden"] === false && !args.title?.trim()
          ? "Storybook fallback title"
          : args.title
      }
    />
  ),
};
