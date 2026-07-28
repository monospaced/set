import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetIcon } from "../icon/icon";
import { renderSetLink, SET_LINK_SPEC, type SetLinkProps } from "./link";

const baseArgTypes = specToArgTypes(SET_LINK_SPEC);

const iconOptions = {
  "Set icon": renderSetIcon({ ariaHidden: true, name: "link" }),
  "Simple Icons": `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 0C8.688 0 6 2.688 6 6s2.688 6 6 6c4.64-.001 7.526 5.039 5.176 9.04h1.68A7.507 7.507 0 0 0 12 10.5 4.502 4.502 0 0 1 7.5 6c0-2.484 2.016-4.5 4.5-4.5s4.5 2.016 4.5 4.5H18c0-3.312-2.688-6-6-6Zm0 3a3 3 0 0 0 0 6c4 0 4-6 0-6Zm0 1.5A1.5 1.5 0 0 1 13.5 6v.002c-.002 1.336-1.617 2.003-2.561 1.058C9.995 6.115 10.664 4.5 12 4.5ZM7.5 15v1.5H9v6H4.5V24h15v-1.5H15v-6h1.5V15Zm3 1.5h3v6h-3zm-6 1.47c0 1.09.216 2.109.644 3.069h1.684A5.957 5.957 0 0 1 6 17.97Z"/></svg>`,
} as const;

const iconArgType = {
  ...baseArgTypes.icon,
  control: { type: "select" as const },
  description: [
    baseArgTypes.icon?.description,
    "Story-only: the control picks a sample icon string; consumer code can pass any trusted icon HTML.",
  ]
    .filter(Boolean)
    .join("\n\n"),
  mapping: iconOptions,
  options: Object.keys(iconOptions),
};

const meta = {
  argTypes: {
    ...baseArgTypes,
    icon: iconArgType,
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_LINK_SPEC),
      },
    },
  },
  title: "Navigation/Link",
};

export default meta;

export const Default = {
  args: {
    appearance: "text",
    current: undefined,
    download: undefined,
    href: "#",
    id: "",
    icon: undefined,
    iconPlacement: "start",
    label: "Link",
    labelVisibility: "visible",
    rel: "",
    size: "md",
    target: undefined,
    tone: "default",
    underline: false,
  } satisfies SetLinkProps,
  render: (args: SetLinkProps) => renderSetLink(args),
};
