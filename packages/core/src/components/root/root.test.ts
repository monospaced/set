import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetRoot, SET_ROOT_SPEC, type SetRootProps } from "./root";

function mountRoot(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetRoot", () => {
  it("renders root class and default data-set-brand when brand is omitted", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));
    expect(root.classList.contains("set")).toBe(true);
    expect(root.getAttribute("data-set-brand")).toBe("mnsp");
  });

  it("does not render data-app-root by default", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("data-app-root")).toBe(false);
  });

  it("renders data-app-root when appRoot is true", () => {
    const root = mountRoot(
      renderSetRoot({
        appRoot: true,
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-root")).toBe(true);
  });

  it("does not render data-app-root when appRoot is false", () => {
    const root = mountRoot(
      renderSetRoot({
        appRoot: false,
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-root")).toBe(false);
  });

  it("does not render data-app-overscroll-behavior when behavior is omitted", () => {
    const root = mountRoot(
      renderSetRoot({
        children: "<p>content</p>",
      }),
    );
    expect(root.hasAttribute("data-app-overscroll-behavior")).toBe(false);
  });

  it('renders data-app-overscroll-behavior when behavior is "none"', () => {
    const root = mountRoot(
      renderSetRoot({
        appOverscrollBehavior: "none",
        children: "<p>content</p>",
      }),
    );
    expect(root.getAttribute("data-app-overscroll-behavior")).toBe("none");
  });

  it("applies explicit brand attribute", () => {
    const root = mountRoot(
      renderSetRoot({
        brand: "wrfr",
        children: "<p>content</p>",
      }),
    );
    expect(root.getAttribute("data-set-brand")).toBe("wrfr");
  });

  it("renders theme attribute when provided", () => {
    const root = mountRoot(
      renderSetRoot({
        children: "<p>content</p>",
        theme: "dark",
      }),
    );
    expect(root.getAttribute("data-set-theme")).toBe("dark");
  });

  it("does not render theme attribute when omitted", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("data-set-theme")).toBe(false);
  });

  it("renders dir when provided", () => {
    const root = mountRoot(
      renderSetRoot({
        children: "<p>content</p>",
        dir: "rtl",
      }),
    );
    expect(root.getAttribute("dir")).toBe("rtl");
  });

  it("does not render dir when omitted", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("dir")).toBe(false);
  });

  it("renders lang when provided", () => {
    const root = mountRoot(
      renderSetRoot({
        children: "<p>content</p>",
        lang: "en-GB",
      }),
    );
    expect(root.getAttribute("lang")).toBe("en-GB");
  });

  it("does not render lang when omitted", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));
    expect(root.hasAttribute("lang")).toBe(false);
  });

  it("does not render lang when provided as an empty string", () => {
    const root = mountRoot(
      renderSetRoot({
        children: "<p>content</p>",
        lang: "",
      }),
    );
    expect(root.hasAttribute("lang")).toBe(false);
  });

  it("injects children HTML content", () => {
    const children = "<section><h1>Title</h1><p>Body</p></section>";
    const root = mountRoot(renderSetRoot({ children }));

    expect(getByText(root, "Title")).toBeTruthy();
    expect(getByText(root, "Body")).toBeTruthy();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountRoot(
      renderSetRoot({ children: "<p>content</p>", id: "my-root" }),
    );

    expect(root.id).toBe("my-root");
  });

  it("omits id when not provided", () => {
    const root = mountRoot(renderSetRoot({ children: "<p>content</p>" }));

    expect(root.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetRoot({ children: "<p>content</p>", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetRootProps>({
  baseProps: { children: "<p>content</p>" },
  renderer: renderSetRoot,
  spec: SET_ROOT_SPEC,
});
