import { processMarkdownInline } from "@monospaced/set-markdown";

import { specToArgTypes, specToComponentDescription } from "../../spec";
import { renderSetText, SET_TEXT_SPEC, type SetTextProps } from "./text";

const baseArgTypes = specToArgTypes(SET_TEXT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_TEXT_SPEC),
      },
    },
  },
  title: "Typographic/Text",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    as: "span",
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/">Ut enim ad minim</a>, nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    id: "",
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies SetTextProps,
  render: (args: SetTextProps) => renderSetText({ ...args }),
};

export const Markup = {
  args: {
    as: "p",
    align: "start",
    children: processMarkdownInline(
      "_Emphasis_, `code`, ~~deleted~~, **bold**, and <sup>superscript</sup>. Here’s a link to [a website](https://monospaced.com).",
    ),
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies SetTextProps,
  render: (args: SetTextProps) => renderSetText({ ...args }),
};
