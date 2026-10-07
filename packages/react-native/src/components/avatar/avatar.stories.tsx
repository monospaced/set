import { Pressable, View } from "react-native";

import { Avatar, type AvatarProps } from "./avatar";

/**
 * Mirrors core's `avatar.stories.ts`: same title, description and story
 * set (`Default`, `Color`, `Image`, `Interactive`), with argTypes in the
 * shape core derives from its SPEC. Core's `id` is omitted until a component
 * needs one (React Native has `id`, for accessibility relationships); `testID`
 * is a native standard. Accessibility props use React Native's
 * cross-platform `aria-*` names.
 */
const argTypes = {
  alt: {
    control: { type: "text" },
    description: "Accessible label for the avatar, overrides name.",
    table: { type: { summary: "string" } },
  },
  "aria-hidden": {
    control: { type: "boolean" },
    description: "Hides the avatar from assistive technology.",
    table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
  },
  color: {
    control: { type: "select" },
    options: ["neutral", "01", "02", "03", "04", "05", "06", "07", "08", "09"],
    description: "Background color swatch. Derived from name when omitted.",
    table: {
      type: { summary: "neutral | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09" },
    },
  },
  entity: {
    control: { type: "select" },
    options: ["bot", "organization", "person", "team"],
    description: "Type of subject the avatar represents.",
    table: {
      type: { summary: "bot | organization | person | team" },
      defaultValue: { summary: '"person"' },
    },
  },
  initials: {
    control: { type: "text" },
    description:
      "Initials to display. 1–3 alphabetic characters. Overrides name-derived initials.",
    table: { type: { summary: "string" } },
  },
  name: {
    control: { type: "text" },
    description: "Full name. Used for the label and to derive initials.",
    table: { type: { summary: "string" } },
  },
  size: {
    control: { type: "select" },
    options: ["xs", "sm", "md", "lg", "xl"],
    description: "Size variant.",
    table: {
      type: { summary: "xs | sm | md | lg | xl" },
      defaultValue: { summary: '"md"' },
    },
  },
  src: {
    control: { type: "text" },
    description: "Image source URL.",
    table: { type: { summary: "string" } },
  },
  testID: {
    control: false,
    description: "Test identifier.",
    table: { type: { summary: "string" } },
  },
};

const meta = {
  argTypes,
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Use `avatar` to visually represent a person, team, or entity.",
      },
    },
  },
  title: "Graphic/Avatar",
};

export default meta;

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={{ alignItems: "center", flexDirection: "row", gap: 6 }}>
    {children}
  </View>
);

export const Default = {
  args: {
    alt: "",
    "aria-hidden": false,
    color: undefined,
    entity: "person",
    initials: "",
    name: "",
    size: "md",
    src: "",
  } satisfies AvatarProps,
  render: (args: AvatarProps) => {
    // Invalid initials throw; render as absent while typing into the control.
    const initials = args.initials?.trim().replace(/\s+/g, " ");
    const valid = initials && /^[A-Za-z]{1,3}$/.test(initials);

    return <Avatar {...args} initials={valid ? initials : undefined} />;
  },
};

export const Color = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      {(["01", "02", "03", "04", "05", "06", "07", "08", "09"] as const).map(
        (color) => (
          <Avatar color={color} entity="person" key={color} size="md" />
        ),
      )}
    </Row>
  ),
};

export const Image = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <Avatar
        name="Scott Boyle"
        size="md"
        src="https://res.cloudinary.com/monospaced/image/upload/v1784805602/avatar-monster_ovwcbf.png"
      />
      <Avatar
        entity="organization"
        name="Monospaced"
        size="md"
        src="https://res.cloudinary.com/monospaced/image/upload/v1784805600/avatar-brand_ueclr4.png"
      />
    </Row>
  ),
};

export const Interactive = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Row>
      <Pressable aria-label="Button" role="button">
        <Avatar aria-hidden name="Button" size="md" />
      </Pressable>
      <Pressable aria-label="Link" role="link">
        <Avatar aria-hidden name="Link" size="md" />
      </Pressable>
    </Row>
  ),
};
