import {
  renderSetBox,
  renderSetContainer,
  renderSetHeading,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";

import type { NotFoundData } from "./_data/not-found";
import notFoundData from "./_data/not-found";

interface PageData {
  "not-found": NotFoundData;
}

export default class NotFound {
  data() {
    return {
      centerMain: true,
      eleventyExcludeFromCollections: true,
      layout: "base.11ty.ts",
      permalink: "/404.html",
      title: notFoundData.title,
    };
  }

  render(data: PageData): string {
    const notFound = data["not-found"];
    return renderSetContainer({
      children: renderSetBox({
        paddingInline: "none",
        responsive: true,
        children: renderSetStack({
          gap: "none",
          children: [
            renderSetHeading({
              align: "center",
              level: 1,
              responsive: true,
              size: "2xl",
              text: notFound.headline,
            }),
            renderSetText({
              align: "center",
              as: "p",
              children: notFound.message,
            }),
          ].join(""),
        }),
      }),
    });
  }
}
