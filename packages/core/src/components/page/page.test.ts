import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetPage, SET_PAGE_SPEC, type SetPageProps } from "./page";

function mountPage(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetPage", () => {
  it("renders the page shell with prescribed regions", () => {
    const root = mountPage(
      renderSetPage({
        banner: '<div class="page-banner">Banner</div>',
        children: "Main",
        centerMain: true,
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );
    const page = root.querySelector(".set-page") as HTMLElement;

    expect(page.tagName).toBe("DIV");
    expect(page.className).toBe("set-page");
    expect(page.hasAttribute("data-center-main")).toBe(true);
    expect(page.hasAttribute("data-header-border")).toBe(false);
    expect(page.getAttribute("data-header-size")).toBe("md");
    expect(page.hasAttribute("data-sticky-header")).toBe(false);
    expect(page.firstElementChild?.className).toBe("page-banner");
    expect(page.querySelector("header")?.textContent).toBe("Header");
    expect(page.querySelector(".main")?.textContent).toBe("Main");
    expect(page.querySelector("footer")?.textContent).toBe("Footer");
  });

  it("renders trusted main HTML without escaping", () => {
    const root = mountPage(
      renderSetPage({
        banner: '<a href="/banner">Banner</a>',
        children: "<p>Main <em>body</em></p>",
        footer: '<a href="/footer">Footer</a>',
        header: '<a href="/header">Header</a>',
      }),
    );
    const page = root.querySelector(".set-page") as HTMLElement;

    expect(page.querySelector(".main em")?.textContent).toBe("body");
    expect(page.firstElementChild?.getAttribute("href")).toBe("/banner");
    expect(page.querySelector("header a")?.getAttribute("href")).toBe(
      "/header",
    );
    expect(page.querySelector("footer a")?.getAttribute("href")).toBe(
      "/footer",
    );
  });

  it("omits data-center-main when centerMain is false", () => {
    const root = mountPage(
      renderSetPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(
      root.querySelector(".set-page")?.hasAttribute("data-center-main"),
    ).toBe(false);
  });

  it("omits banner content when banner is not provided", () => {
    const root = mountPage(
      renderSetPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );

    expect(root.querySelector(".set-page")?.firstElementChild?.tagName).toBe(
      "HEADER",
    );
  });

  it("emits data-header-border when provided", () => {
    const root = mountPage(
      renderSetPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        headerBorder: "scroll",
      }),
    );

    expect(
      root.querySelector(".set-page")?.getAttribute("data-header-border"),
    ).toBe("scroll");
  });

  it("emits data-sticky-header when provided", () => {
    const root = mountPage(
      renderSetPage({
        children: "Main",
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        stickyHeader: "always",
      }),
    );

    expect(
      root.querySelector(".set-page")?.getAttribute("data-sticky-header"),
    ).toBe("always");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPage(
      renderSetPage({
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        id: "my-page",
      }),
    );
    const page = root.querySelector(".set-page") as HTMLElement;

    expect(page.id).toBe("my-page");
  });

  it("omits id when not provided", () => {
    const root = mountPage(
      renderSetPage({
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
      }),
    );
    const page = root.querySelector(".set-page") as HTMLElement;

    expect(page.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetPage({
        footer: "<div>Footer</div>",
        header: "<div>Header</div>",
        id: "not valid",
      }),
    ).toThrow();
  });
});

describeSpecConsistency<SetPageProps>({
  baseProps: { footer: "<div>F</div>", header: "<div>H</div>" },
  renderer: renderSetPage,
  spec: SET_PAGE_SPEC,
});
