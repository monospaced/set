import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_EXPANDER_SPEC,
  type SetExpanderProps,
  renderSetExpander,
} from "./expander";

function mount(html: string): void {
  document.body.innerHTML = `<div class="set">${html}</div>`;
}

describe("renderSetExpander", () => {
  it("renders defaults", () => {
    mount(renderSetExpander());
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("aria-controls")).toBeNull();
  });

  it("renders controls, expanded state, and size when provided", () => {
    mount(
      renderSetExpander({
        controlsId: "menu-content",
        expanded: true,
        label: "Open navigation",
        size: "sm",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open navigation",
    });

    expect(button.getAttribute("aria-controls")).toBe("menu-content");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-size")).toBe("sm");
  });

  it("renders the lg size when provided", () => {
    mount(renderSetExpander({ label: "Open menu", size: "lg" }));
    const button = getByRole(document.body, "button", { name: "Open menu" });

    expect(button.getAttribute("data-size")).toBe("lg");
  });

  it("normalizes an empty label to the default", () => {
    mount(renderSetExpander({ label: "" }));
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button).not.toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    mount(renderSetExpander({ id: "my-expander" }));
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button.id).toBe("my-expander");
  });

  it("omits id when not provided", () => {
    mount(renderSetExpander());
    const button = getByRole(document.body, "button", { name: "Menu" });

    expect(button.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetExpander({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetExpanderProps>({
  baseProps: {},
  renderer: renderSetExpander,
  spec: SET_EXPANDER_SPEC,
});
