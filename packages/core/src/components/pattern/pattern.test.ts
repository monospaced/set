import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetPattern,
  SET_PATTERN_SPEC,
  type SetPatternProps,
} from "./pattern";

function mountPattern(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetPattern", () => {
  it("renders the settled default root contract", () => {
    const root = mountPattern(renderSetPattern());
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern).toBeTruthy();
    expect(pattern.tagName).toBe("DIV");
    expect(pattern.className).toBe("set-pattern");
    expect(pattern.getAttribute("data-size")).toBe("md");
    expect(pattern.hasAttribute("data-tone")).toBe(false);
    expect(pattern.getAttribute("data-variant")).toBe("tile");
    expect(pattern.innerHTML).toBe("");
  });

  it("emits explicit variant, size, and tone values", () => {
    const root = mountPattern(
      renderSetPattern({
        size: "fill",
        tone: "support",
        variant: "tileLight",
      }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-size")).toBe("fill");
    expect(pattern.getAttribute("data-tone")).toBe("support");
    expect(pattern.getAttribute("data-variant")).toBe("tileLight");
  });

  it("emits the subtle tone value", () => {
    const root = mountPattern(renderSetPattern({ tone: "subtle" }));
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.getAttribute("data-tone")).toBe("subtle");
  });

  it("renders trusted child HTML inside the root", () => {
    const root = mountPattern(
      renderSetPattern({
        children: '<div class="content">Pattern content</div>',
      }),
    );
    const pattern = root.querySelector(".set-pattern") as HTMLElement;
    const content = pattern.querySelector(".content") as HTMLElement;

    expect(content).toBeTruthy();
    expect(content.textContent).toBe("Pattern content");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountPattern(renderSetPattern({ id: "my-pattern" }));
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.id).toBe("my-pattern");
  });

  it("omits id when not provided", () => {
    const root = mountPattern(renderSetPattern());
    const pattern = root.querySelector(".set-pattern") as HTMLElement;

    expect(pattern.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetPattern({ id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetPatternProps>({
  baseProps: {},
  renderer: renderSetPattern,
  spec: SET_PATTERN_SPEC,
});
