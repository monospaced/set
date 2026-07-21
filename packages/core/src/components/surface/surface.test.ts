import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_SURFACE_SPEC,
  type SetSurfaceProps,
  renderSetSurface,
} from "./surface";

function mountSurface(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetSurface", () => {
  it("uses base surface class and default variant by default", () => {
    const root = mountSurface(renderSetSurface({ children: "<p>content</p>" }));
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.classList.contains("set-surface")).toBe(true);
    expect(surface.getAttribute("data-set-surface")).toBe("default");
  });

  it("renders brand surface variant attribute", () => {
    const root = mountSurface(
      renderSetSurface({
        children: "<p>content</p>",
        variant: "brand",
      }),
    );
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.classList.contains("set-surface")).toBe(true);
    expect(surface.getAttribute("data-set-surface")).toBe("brand");
  });

  it("renders inverse surface variant attribute", () => {
    const root = mountSurface(
      renderSetSurface({
        children: "<p>content</p>",
        variant: "inverse",
      }),
    );
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.classList.contains("set-surface")).toBe(true);
    expect(surface.getAttribute("data-set-surface")).toBe("inverse");
  });

  it("renders brand-inverse surface variant attribute", () => {
    const root = mountSurface(
      renderSetSurface({
        children: "<p>content</p>",
        variant: "brand-inverse",
      }),
    );
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.classList.contains("set-surface")).toBe(true);
    expect(surface.getAttribute("data-set-surface")).toBe("brand-inverse");
  });

  it("renders content theme attribute when contentTheme is provided", () => {
    const root = mountSurface(
      renderSetSurface({
        children: "<p>content</p>",
        contentTheme: "dark",
      }),
    );
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.getAttribute("data-set-content-theme")).toBe("dark");
  });

  it("omits content theme attribute when contentTheme is not provided", () => {
    const root = mountSurface(renderSetSurface({ children: "<p>content</p>" }));
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(surface.hasAttribute("data-set-content-theme")).toBe(false);
  });

  it("injects children HTML content", () => {
    const children = "<section><h2>Surface</h2><p>Body</p></section>";
    const root = mountSurface(renderSetSurface({ children }));
    const surface = root.querySelector(".set-surface") as HTMLElement;
    expect(getByText(surface, "Surface")).toBeTruthy();
    expect(getByText(surface, "Body")).toBeTruthy();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountSurface(
      renderSetSurface({ children: "<p>content</p>", id: "my-surface" }),
    );
    const surface = root.querySelector(".set-surface") as HTMLElement;

    expect(surface.id).toBe("my-surface");
  });

  it("omits id when not provided", () => {
    const root = mountSurface(renderSetSurface({ children: "<p>content</p>" }));
    const surface = root.querySelector(".set-surface") as HTMLElement;

    expect(surface.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetSurface({ children: "<p>content</p>", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetSurfaceProps>({
  baseProps: { children: "<p>content</p>" },
  renderer: renderSetSurface,
  spec: SET_SURFACE_SPEC,
});
