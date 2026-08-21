import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetFigure,
  SET_FIGURE_SPEC,
  type SetFigureProps,
} from "./figure";

function mountFigure(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetFigure", () => {
  it("renders the default figure contract", () => {
    const root = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );
    const figure = root.querySelector(".set-figure") as HTMLElement;

    expect(figure.tagName).toBe("FIGURE");
    expect(figure.className).toBe("set-figure");
    expect(figure.hasAttribute("data-align")).toBe(false);
    expect(figure.querySelector("img")?.getAttribute("src")).toBe("/image.jpg");
    expect(figure.querySelector("figcaption.figcaption")).toBeTruthy();
    expect(
      figure.querySelector("figcaption.figcaption > span.set-text")
        ?.textContent,
    ).toBe("Caption");
    expect(
      figure
        .querySelector("figcaption.figcaption > span.set-text")
        ?.getAttribute("data-size"),
    ).toBe("sm");
  });

  it("emits non-default align attributes", () => {
    const root = mountFigure(
      renderSetFigure({
        align: "center",
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
      }),
    );

    expect(root.querySelector(".set-figure")?.getAttribute("data-align")).toBe(
      "center",
    );
  });

  it("renders trusted HTML for caption and children", () => {
    const root = mountFigure(
      renderSetFigure({
        caption: 'See the <a href="/docs">documentation</a>.',
        children: '<picture><img src="/image.jpg" alt="Alt" /></picture>',
      }),
    );

    expect(
      root
        .querySelector(".set-figure figcaption.figcaption a")
        ?.getAttribute("href"),
    ).toBe("/docs");
    expect(root.querySelector(".set-figure picture img")).toBeTruthy();
  });

  it("passes responsive through to the caption text", () => {
    const root = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/image.jpg" alt="Alt" />',
        responsive: true,
      }),
    );

    expect(
      root
        .querySelector(".set-figure figcaption.figcaption > span.set-text")
        ?.hasAttribute("data-responsive"),
    ).toBe(true);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/i.jpg" alt="" />',
        id: "my-figure",
      }),
    );
    const figure = root.querySelector(".set-figure") as HTMLElement;

    expect(figure.id).toBe("my-figure");
  });

  it("omits id when not provided", () => {
    const root = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/i.jpg" alt="" />',
      }),
    );
    const figure = root.querySelector(".set-figure") as HTMLElement;

    expect(figure.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/i.jpg" alt="" />',
        id: "not valid",
      }),
    ).toThrow();
  });

  it("emits data-inline-size only when inlineSize is fit", () => {
    const fitRoot = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/i.jpg" alt="" />',
        inlineSize: "fit",
      }),
    );
    expect(
      (fitRoot.querySelector(".set-figure") as HTMLElement).getAttribute(
        "data-inline-size",
      ),
    ).toBe("fit");

    const defaultRoot = mountFigure(
      renderSetFigure({
        caption: "Caption",
        children: '<img src="/i.jpg" alt="" />',
      }),
    );
    expect(
      (defaultRoot.querySelector(".set-figure") as HTMLElement).hasAttribute(
        "data-inline-size",
      ),
    ).toBe(false);
  });
});

describeSpecConsistency<SetFigureProps>({
  baseProps: { caption: "Caption", children: '<img src="/i.jpg" alt="" />' },
  renderer: renderSetFigure,
  spec: SET_FIGURE_SPEC,
});
