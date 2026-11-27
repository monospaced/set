import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetFigure,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetImage,
  renderSetProse,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

import type { BuiltWithSetData, OneShot } from "./_data/built-with-set";
import builtWithSetData from "./_data/built-with-set";

interface PageData {
  "built-with-set": BuiltWithSetData;
}

// Each experiment is a figure, as on the Brand page: the screenshot, linking
// to the page, captioned with how it was made. Screenshots are 16:9 at 1440.
const renderOneShot = (oneShot: OneShot): string => {
  const href = `/built-with-set/${oneShot.slug}/`;
  const note = oneShot.note ? ` (${oneShot.note})` : "";

  return renderSetFigure({
    caption: `<a href="${href}">${oneShot.name}</a>: agent one-shot in <a href="/set-${oneShot.mode}/">${oneShot.mode} mode</a>${note}, refined by hand.`,
    children: `<a href="${href}">${renderSetImage({
      alt: oneShot.alt,
      height: 810,
      src: oneShot.src,
      width: 1440,
    })}</a>`,
  });
};

export default class BuiltWithSet {
  data() {
    return {
      description: builtWithSetData.strapline,
      layout: "base.11ty.ts",
      permalink: "/built-with-set/",
      title: builtWithSetData.title,
    };
  }

  render(data: PageData): string {
    const page = data["built-with-set"];

    return renderSetContainer({
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "lg",
        paddingInline: "none",
        responsive: true,
        children: renderSetGrid({
          responsiveRowGap: "md",
          children: [
            renderSetGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderSetStack({
                gap: "md",
                children: [
                  renderSetHeading({
                    children: page.title,
                    level: 1,
                    responsive: true,
                    size: "2xl",
                  }),
                  renderSetText({
                    as: "p",
                    children: page.strapline,
                    responsive: true,
                    size: "lg",
                  }),
                  renderSetDivider({ tone: "brand" }),
                ].join(""),
              }),
            }),
            renderSetGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderSetProse({
                children: processMarkdown(page.body),
                hangingPunctuation: "notebook",
                responsive: true,
              }),
            }),
            renderSetGridItem({
              colStart: 2,
              colSpan: 10,
              children: `<div style="max-inline-size: 80rem">${renderSetStack({
                gap: "xl",
                children: page.oneShots.map(renderOneShot).join(""),
              })}</div>`,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
