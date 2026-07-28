import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { renderSetBox, SET_BOX_SPEC, type SetBoxProps } from "./box";

function mountBox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetBox", () => {
  it("renders a div.box with the default contract", () => {
    const root = mountBox(renderSetBox({ children: "Body" }));
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.tagName).toBe("DIV");
    expect(box.className).toBe("set-box");
    expect(box.textContent).toBe("Body");
    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding-block")).toBe("md");
    expect(box.getAttribute("data-padding-inline")).toBe("md");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-responsive")).toBe(false);
    expect(box.hasAttribute("data-set-surface")).toBe(false);
  });

  it("renders trusted child HTML without escaping", () => {
    const root = mountBox(
      renderSetBox({
        children: '<p>Lorem <em>ipsum</em> <a href="/docs">docs</a></p>',
      }),
    );

    expect(root.querySelector(".set-box p")?.textContent).toContain("Lorem");
    expect(root.querySelector(".set-box em")?.textContent).toBe("ipsum");
    expect(root.querySelector(".set-box a")?.getAttribute("href")).toBe(
      "/docs",
    );
  });

  it("supports omitted or empty children", () => {
    const omitted = mountBox(renderSetBox({}));
    const empty = mountBox(renderSetBox({ children: "" }));

    expect(omitted.querySelector(".set-box")?.innerHTML).toBe("");
    expect(empty.querySelector(".set-box")?.innerHTML).toBe("");
  });

  it("emits requested variant attributes", () => {
    const root = mountBox(
      renderSetBox({
        background: "panel",
        border: true,
        children: "Body",
        paddingBlock: "xl",
        paddingInline: "sm",
        radius: "md",
        responsive: true,
        surface: "brand",
      }),
    );
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.getAttribute("data-background")).toBe("panel");
    expect(box.hasAttribute("data-border")).toBe(true);
    expect(box.getAttribute("data-padding-block")).toBe("xl");
    expect(box.getAttribute("data-padding-inline")).toBe("sm");
    expect(box.getAttribute("data-radius")).toBe("md");
    expect(box.hasAttribute("data-responsive")).toBe(true);
    expect(box.getAttribute("data-set-surface")).toBe("brand");
  });

  it("omits optional attrs when their variants are unset", () => {
    const root = mountBox(
      renderSetBox({
        background: "default",
        border: false,
        children: "Body",
        paddingBlock: "sm",
        paddingInline: "xs",
      }),
    );
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.hasAttribute("data-background")).toBe(false);
    expect(box.hasAttribute("data-border")).toBe(false);
    expect(box.getAttribute("data-padding-block")).toBe("sm");
    expect(box.getAttribute("data-padding-inline")).toBe("xs");
    expect(box.hasAttribute("data-radius")).toBe(false);
    expect(box.hasAttribute("data-responsive")).toBe(false);
    expect(box.hasAttribute("data-set-surface")).toBe(false);
  });

  it("supports none for both padding axes", () => {
    const root = mountBox(
      renderSetBox({
        children: "Body",
        paddingBlock: "none",
        paddingInline: "none",
      }),
    );
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.getAttribute("data-padding-block")).toBe("none");
    expect(box.getAttribute("data-padding-inline")).toBe("none");
  });

  it("supports 2xs and 2xl padding values", () => {
    const compactRoot = mountBox(
      renderSetBox({
        children: "Body",
        paddingBlock: "2xs",
        paddingInline: "2xs",
      }),
    );
    const compact = compactRoot.querySelector(".set-box") as HTMLElement;

    expect(compact.getAttribute("data-padding-block")).toBe("2xs");
    expect(compact.getAttribute("data-padding-inline")).toBe("2xs");

    const spaciousRoot = mountBox(
      renderSetBox({
        children: "Body",
        paddingBlock: "2xl",
        paddingInline: "2xl",
      }),
    );
    const spacious = spaciousRoot.querySelector(".set-box") as HTMLElement;

    expect(spacious.getAttribute("data-padding-block")).toBe("2xl");
    expect(spacious.getAttribute("data-padding-inline")).toBe("2xl");
  });

  it("emits transparent background when requested", () => {
    const root = mountBox(
      renderSetBox({
        background: "transparent",
        children: "Body",
      }),
    );
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.getAttribute("data-background")).toBe("transparent");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountBox(renderSetBox({ children: "Body", id: "my-box" }));
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.id).toBe("my-box");
  });

  it("omits id when not provided", () => {
    const root = mountBox(renderSetBox({ children: "Body" }));
    const box = root.querySelector(".set-box") as HTMLElement;

    expect(box.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() => renderSetBox({ children: "Body", id: "not valid" })).toThrow();
  });
});

describeSpecConsistency<SetBoxProps>({
  baseProps: {},
  renderer: renderSetBox,
  spec: SET_BOX_SPEC,
});
