import { View } from "react-native";

import { ICON_NAMES } from "../icon/icon";
import { Button, type ButtonProps } from "./button";

/**
 * Mirrors core's `button.stories.ts`: same title, description and primary
 * story, with argTypes in the shape core derives from its SPEC so the two
 * tables read side by side. Props core has and this component does not
 * (`activity`, `controls`, `disclosure`, `form`, `haspopup`, `name`, `type`,
 * `value`) are the gap list.
 */
const argTypes = {
  "aria-label": {
    control: { type: "text" },
    description: "Overrides the accessible name; defaults to `label`.",
    table: { type: { summary: "string" } },
  },
  appearance: {
    control: { type: "select" },
    options: ["outline", "solid", "text"],
    description: "Visual appearance.",
    table: {
      type: { summary: "outline | solid | text" },
      defaultValue: { summary: '"outline"' },
    },
  },
  disabled: {
    control: { type: "boolean" },
    description: "Prevents interaction.",
    table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
  },
  icon: {
    control: { type: "select" },
    options: ICON_NAMES,
    description:
      "Icon shown alongside the label.\n\nRequired when `labelVisibility` is hidden or hiddenBelowTablet.",
    table: { type: { summary: "iconName" } },
  },
  iconMirrored: {
    control: { type: "select" },
    options: ["always", "rtl"],
    description:
      "Mirrors the icon horizontally.\n\nIgnored when `icon` is omitted.",
    table: { type: { summary: "always | rtl" } },
  },
  iconPlacement: {
    control: { type: "select" },
    options: ["start", "end"],
    description:
      "Where the icon sits relative to the label.\n\nIgnored when `icon` is omitted.",
    table: {
      type: { summary: "start | end" },
      defaultValue: { summary: '"start"' },
    },
  },
  label: {
    control: { type: "text" },
    description: "Accessible label.",
    type: { required: true },
    table: { type: { summary: "text" } },
  },
  labelVisibility: {
    control: { type: "select" },
    options: ["visible", "hidden", "hiddenBelowTablet"],
    description: "How the label is shown. Hidden values require an icon.",
    table: {
      type: { summary: "visible | hidden | hiddenBelowTablet" },
      defaultValue: { summary: '"visible"' },
    },
  },
  onPress: {
    action: "press",
    control: false,
    description: "Called when the button is pressed.",
    table: { category: "events", type: { summary: "(event) => void" } },
  },
  size: {
    control: { type: "select" },
    options: ["sm", "md", "lg"],
    description: "Size variant.",
    table: {
      type: { summary: "sm | md | lg" },
      defaultValue: { summary: '"md"' },
    },
  },
  testID: {
    control: false,
    description: "Test identifier.",
    table: { type: { summary: "string" } },
  },
  tone: {
    control: { type: "select" },
    options: ["default", "neutral"],
    description: "Semantic tone.",
    table: {
      type: { summary: "default | neutral" },
      defaultValue: { summary: '"default"' },
    },
  },
};

const meta = {
  argTypes,
  component: Button,
  parameters: {
    docs: {
      description: {
        component: "Use `button` to let users trigger actions.",
      },
    },
  },
  title: "Control/Button",
};

export default meta;

export const Button_ = {
  args: {
    "aria-label": "",
    appearance: "outline",
    disabled: false,
    icon: undefined,
    iconMirrored: undefined,
    iconPlacement: "start",
    label: "Button",
    labelVisibility: "visible",
    size: "md",
    tone: "default",
  } satisfies ButtonProps,
  render: (args: ButtonProps) => (
    <Button
      {...args}
      aria-label={args["aria-label"] || undefined}
      labelVisibility={args.icon ? args.labelVisibility : "visible"}
    />
  ),
};

export const Icon = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View style={{ alignItems: "center", flexDirection: "row", gap: 6 }}>
      {(["text", "outline", "solid"] as const).map((appearance) => (
        <Button
          appearance={appearance}
          icon="search"
          key={appearance}
          label="Search"
          labelVisibility="hidden"
          tone="neutral"
        />
      ))}
    </View>
  ),
};
