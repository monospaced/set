import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetStack } from "../stack/stack";
import {
  SET_BANNER_SPEC,
  type SetBannerProps,
  defineSetBanner,
  renderSetBanner,
} from "./banner";

defineSetBanner();

const baseArgTypes = specToArgTypes(SET_BANNER_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_BANNER_SPEC),
      },
    },
  },
  title: "Status/Banner",
};

export default meta;

export const Default = {
  args: {
    actionHref: "#",
    actionLabel: "Action link",
    dismissible: true,
    dismissibleLabel: "Dismiss banner",
    id: "",
    message: `Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.`,
    tone: undefined,
  } satisfies SetBannerProps,
  render: (args: SetBannerProps) => {
    const hasAction = Boolean(
      args.actionHref?.trim() && args.actionLabel?.trim(),
    );
    return renderSetBanner({
      ...args,
      actionHref: hasAction ? args.actionHref : undefined,
      actionLabel: hasAction ? args.actionLabel : undefined,
    });
  },
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetStack({
      children: [
        renderSetBanner({
          message: "Default",
        }),
        renderSetBanner({
          message: "Info",
          tone: "info",
        }),
        renderSetBanner({
          message: "Success",
          tone: "success",
        }),
        renderSetBanner({
          message: "Warning",
          tone: "warning",
        }),
        renderSetBanner({
          message: "Error",
          tone: "error",
        }),
      ].join(""),
    }),
};
