import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { SET_PROSE_SPEC, type SetProseProps, renderSetProse } from "./prose";

function mountProse(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetProse", () => {
  it("renders a prose div wrapper", () => {
    const root = mountProse(renderSetProse({ children: "Hello world" }));
    const prose = getByText(root, "Hello world");

    expect(prose.tagName).toBe("DIV");
    expect(prose.classList.contains("set-prose")).toBe(true);
  });

  it("omits default align and emits non-default align", () => {
    const defaultRoot = mountProse(
      renderSetProse({ align: "start", children: "Body" }),
    );
    const defaultProse = getByText(defaultRoot, "Body");
    expect(defaultProse.hasAttribute("data-align")).toBe(false);

    const centeredRoot = mountProse(
      renderSetProse({ align: "center", children: "Body" }),
    );
    const centeredProse = getByText(centeredRoot, "Body");
    expect(centeredProse.getAttribute("data-align")).toBe("center");
  });

  it("omits hanging punctuation by default and emits enum values", () => {
    const defaultRoot = mountProse(renderSetProse({ children: "Body" }));
    const defaultProse = getByText(defaultRoot, "Body");
    expect(defaultProse.hasAttribute("data-hanging-punctuation")).toBe(false);

    const alwaysRoot = mountProse(
      renderSetProse({ children: "Body", hangingPunctuation: "always" }),
    );
    const alwaysProse = getByText(alwaysRoot, "Body");
    expect(alwaysProse.getAttribute("data-hanging-punctuation")).toBe("always");

    const notebookRoot = mountProse(
      renderSetProse({ children: "Body", hangingPunctuation: "notebook" }),
    );
    const notebookProse = getByText(notebookRoot, "Body");
    expect(notebookProse.getAttribute("data-hanging-punctuation")).toBe(
      "notebook",
    );
  });

  it("emits measured by default and omits responsive by default", () => {
    const root = mountProse(renderSetProse({ children: "Body" }));
    const prose = getByText(root, "Body");
    expect(prose.hasAttribute("data-measured")).toBe(true);
    expect(prose.hasAttribute("data-responsive")).toBe(false);

    const explicitRoot = mountProse(
      renderSetProse({ children: "Body", measured: false, responsive: true }),
    );
    const explicitProse = getByText(explicitRoot, "Body");
    expect(explicitProse.hasAttribute("data-measured")).toBe(false);
    expect(explicitProse.hasAttribute("data-responsive")).toBe(true);
  });

  it("renders trusted HTML content", () => {
    const root = mountProse(
      renderSetProse({
        children:
          '<p>Lorem ipsum <em>dolor</em> sit amet, <a href="/docs">docs</a>.</p>',
      }),
    );

    expect(root.querySelector("p")?.textContent).toContain("Lorem ipsum");
    expect(root.querySelector("em")?.textContent).toBe("dolor");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });

  it("allows empty or whitespace children without throwing", () => {
    const emptyRoot = mountProse(renderSetProse({ children: "" }));
    const emptyProse = emptyRoot.querySelector(".set-prose");
    expect(emptyProse).toBeTruthy();
    expect(emptyProse?.innerHTML).toBe("");

    const whitespaceRoot = mountProse(renderSetProse({ children: "   " }));
    const whitespaceProse = whitespaceRoot.querySelector(".set-prose");
    expect(whitespaceProse).toBeTruthy();
    expect(whitespaceProse?.innerHTML).toBe("   ");
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountProse(
      renderSetProse({ children: "<p>Body</p>", id: "my-prose" }),
    );
    const prose = root.querySelector(".set-prose") as HTMLElement;

    expect(prose.id).toBe("my-prose");
  });

  it("omits id when not provided", () => {
    const root = mountProse(renderSetProse({ children: "<p>Body</p>" }));
    const prose = root.querySelector(".set-prose") as HTMLElement;

    expect(prose.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetProse({ children: "<p>Body</p>", id: "not valid" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetProseProps>({
  baseProps: { children: "<p>Body</p>" },
  renderer: renderSetProse,
  spec: SET_PROSE_SPEC,
});
