import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetInline } from "../inline/inline";
import {
  renderSetAvatar,
  SET_AVATAR_SPEC,
  type SetAvatarProps,
} from "./avatar";

const baseArgTypes = specToArgTypes(SET_AVATAR_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_AVATAR_SPEC),
      },
    },
  },
  title: "Graphic/Avatar",
};

export default meta;

export const Default = {
  args: {
    alt: "",
    ariaHidden: false,
    color: undefined,
    entity: "person",
    id: "",
    initials: "",
    name: "",
    size: "md",
    src: "",
  } satisfies SetAvatarProps,
  render: (args: SetAvatarProps) => {
    const normalizedArgs = { ...args };
    const normalizedInitials = args.initials?.trim().replace(/\s+/g, " ");

    if (
      normalizedInitials &&
      (normalizedInitials.length > 3 ||
        !/^[A-Za-z]{1,3}$/.test(normalizedInitials))
    ) {
      normalizedArgs.initials = undefined;
    }

    return renderSetAvatar(normalizedArgs);
  },
};

export const Color = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetInline({
      children: ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
        .map((color) =>
          renderSetAvatar({
            color: color as SetAvatarProps["color"],
            entity: "person",
            size: "md",
          }),
        )
        .join(""),
      gap: "xs",
    }),
};

export const Image = {
  parameters: { controls: { disable: true } },
  render: () => {
    return renderSetInline({
      children: `${renderSetAvatar({
        name: "Scott Boyle",
        size: "md",
        src: "https://res.cloudinary.com/monospaced/image/upload/v1784805602/avatar-monster_ovwcbf.png",
      })}${renderSetAvatar({
        entity: "organization",
        name: "Monospaced",
        size: "md",
        src: "https://res.cloudinary.com/monospaced/image/upload/v1784805600/avatar-brand_ueclr4.png",
      })}`,
      gap: "xs",
    });
  },
};

export const Interactive = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetInline({
      children: `<button>${renderSetAvatar({
        name: "Button",
        size: "md",
      })}</button><a href="#">${renderSetAvatar({
        name: "Link",
        size: "md",
      })}</a>`,
      gap: "xs",
    }),
};
