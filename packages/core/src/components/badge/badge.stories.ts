import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetAvatar } from "../avatar/avatar";
import { renderSetInline } from "../inline/inline";
import { renderSetStack } from "../stack/stack";
import { renderSetBadge, SET_BADGE_SPEC, type SetBadgeProps } from "./badge";

const baseArgTypes = specToArgTypes(SET_BADGE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    floating: { ...baseArgTypes.floating, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_BADGE_SPEC),
      },
    },
  },
  title: "Status/Badge",
};

export default meta;

export const Default = {
  args: {
    floating: false,
    id: "",
    label: "Badge",
    size: "md",
    tone: undefined,
  } satisfies SetBadgeProps,
  render: (args: SetBadgeProps) => renderSetBadge(args),
};

export const Floating = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetInline({
      children: `<button>${renderSetAvatar({
        entity: "person",
        name: "button",
        size: "lg",
      })}${renderSetBadge({
        floating: true,
        label: "1",
        tone: "info",
      })}</button><a href="#">${renderSetAvatar({
        entity: "person",
        name: "link",
        size: "lg",
      })}${renderSetBadge({
        floating: true,
        label: "1",
        tone: "info",
      })}</a>
      <button>${renderSetAvatar({
        entity: "person",
        name: "button",
        size: "md",
      })}${renderSetBadge({
        floating: true,
        label: "1",
        size: "sm",
        tone: "info",
      })}</button><a href="#">${renderSetAvatar({
        entity: "person",
        name: "link",
        size: "md",
      })}${renderSetBadge({
        floating: true,
        label: "1",
        size: "sm",
        tone: "info",
      })}</a>`,
      gap: "sm",
    }),
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetStack({
      children: [
        renderSetBadge({ label: "Default" }),
        renderSetBadge({ label: "Info", tone: "info" }),
        renderSetBadge({ label: "Success", tone: "success" }),
        renderSetBadge({ label: "Warning", tone: "warning" }),
        renderSetBadge({ label: "Error", tone: "error" }),
      ].join(""),
      gap: "sm",
    }),
};
