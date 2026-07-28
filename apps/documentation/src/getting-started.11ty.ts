import { readFileSync } from "node:fs";

import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetProse,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

import type { GettingStartedData } from "./_data/getting-started";
import gettingStartedData from "./_data/getting-started";

const bodyMarkdown = readFileSync(
  new URL("./content/getting-started.md", import.meta.url),
  "utf8",
);

interface PageData {
  "getting-started": GettingStartedData;
}

export default class GettingStarted {
  data() {
    return {
      description: gettingStartedData.strapline,
      layout: "base.11ty.ts",
      permalink: "/getting-started/",
      title: gettingStartedData.title,
    };
  }

  render(data: PageData): string {
    const gettingStarted = data["getting-started"];

    return renderSetContainer({
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderSetGrid({
          children: [
            renderSetGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderSetStack({
                gap: "md",
                children: [
                  renderSetHeading({
                    level: 1,
                    responsive: true,
                    size: "2xl",
                    text: gettingStarted.title,
                  }),
                  renderSetText({
                    as: "p",
                    children: gettingStarted.strapline,
                    size: "lg",
                    responsive: true,
                  }),
                  renderSetDivider({ tone: "brand" }),
                ].join(""),
              }),
            }),
            renderSetGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderSetProse({
                children: processMarkdown(bodyMarkdown),
                hangingPunctuation: "notebook",
                responsive: true,
              }),
            }),
          ].join(""),
        }),
      }),
    });
  }
}
