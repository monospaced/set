import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_DIVIDER_SPEC,
  type SetDividerProps,
  renderSetDivider,
} from "./divider";

function mountDivider(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetDivider", () => {
  it("renders horizontal divider markup by default", () => {
    const root = mountDivider(renderSetDivider());
    const divider = root.querySelector(".set-divider") as HTMLElement;

    expect(divider).toBeTruthy();
    expect(divider.tagName).toBe("HR");
    expect(divider.classList.contains("set-divider")).toBe(true);
    expect(divider.hasAttribute("role")).toBe(false);
    expect(divider.hasAttribute("aria-orientation")).toBe(false);
    expect(divider.hasAttribute("data-tone")).toBe(false);
  });

  it("renders vertical divider semantics when orientation is vertical", () => {
    const root = mountDivider(renderSetDivider({ orientation: "vertical" }));
    const divider = root.querySelector(".set-divider") as HTMLElement;

    expect(divider.tagName).toBe("SPAN");
    expect(divider.getAttribute("role")).toBe("separator");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("emits data-tone only for non-default tone values", () => {
    const subtleRoot = mountDivider(renderSetDivider({ tone: "subtle" }));
    const subtle = subtleRoot.querySelector(".set-divider") as HTMLElement;
    expect(subtle.getAttribute("data-tone")).toBe("subtle");

    const brandRoot = mountDivider(renderSetDivider({ tone: "brand" }));
    const brand = brandRoot.querySelector(".set-divider") as HTMLElement;
    expect(brand.getAttribute("data-tone")).toBe("brand");

    const defaultRoot = mountDivider(renderSetDivider({ tone: "default" }));
    const defaultTone = defaultRoot.querySelector(
      ".set-divider",
    ) as HTMLElement;
    expect(defaultTone.hasAttribute("data-tone")).toBe(false);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountDivider(renderSetDivider({ id: "my-divider" }));
    const divider = root.querySelector(".set-divider") as HTMLElement;

    expect(divider.id).toBe("my-divider");
  });

  it("omits id when not provided", () => {
    const root = mountDivider(renderSetDivider());
    const divider = root.querySelector(".set-divider") as HTMLElement;

    expect(divider.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetDivider({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetDividerProps>({
  baseProps: {},
  renderer: renderSetDivider,
  spec: SET_DIVIDER_SPEC,
});
