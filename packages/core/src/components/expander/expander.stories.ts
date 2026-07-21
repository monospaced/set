import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  SET_EXPANDER_SPEC,
  type SetExpanderProps,
  renderSetExpander,
} from "./expander";

const meta = {
  argTypes: specToArgTypes(SET_EXPANDER_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_EXPANDER_SPEC),
      },
    },
  },
  title: "Control/Expander",
};

export default meta;

export const Default = {
  args: {
    controlsId: "",
    expanded: false,
    id: "",
    label: "Menu",
    size: "md",
  } satisfies SetExpanderProps,
  render: (args: SetExpanderProps) => {
    const html = renderSetExpander(args);

    queueMicrotask(() => {
      const button = document.querySelector(".sb-show-main .set-expander");

      if (!(button instanceof HTMLButtonElement)) return;

      button.onclick = () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", expanded ? "false" : "true");
      };
    });

    return html;
  },
};
