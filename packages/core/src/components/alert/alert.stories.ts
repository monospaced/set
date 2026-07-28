import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetStack } from "../stack/stack";
import {
  defineSetAlert,
  renderSetAlert,
  SET_ALERT_SPEC,
  type SetAlertProps,
} from "./alert";

defineSetAlert();

const baseArgTypes = specToArgTypes(SET_ALERT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_ALERT_SPEC),
      },
    },
  },
  title: "Status/Alert",
};

export default meta;

export const Default = {
  args: {
    dismissible: false,
    dismissibleLabel: "Dissmiss alert",
    id: "",
    inlineSize: "fit",
    message: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do.",
    title: "",
    size: "md",
    tone: undefined,
  } satisfies SetAlertProps,
  render: (args: SetAlertProps) => renderSetAlert(args),
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderSetStack({
      children: [
        renderSetAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet.",
          title: "Default",
        }),
        renderSetAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet.",
          title: "Info",
          tone: "info",
        }),
        renderSetAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet.",
          title: "Success",
          tone: "success",
        }),
        renderSetAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet.",
          title: "Warning",
          tone: "warning",
        }),
        renderSetAlert({
          inlineSize: "fit",
          message: "Lorem ipsum dolor sit amet.",
          title: "Error",
          tone: "error",
        }),
      ].join(""),
    }),
};
