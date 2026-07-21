import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import { SET_TEXT_SPEC, type SetTextProps, renderSetText } from "./text";

function mountText(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

function renderAndGetText(content = "Body text"): HTMLElement {
  const root = mountText(renderSetText({ children: content }));
  return getByText(root, content);
}

describe("renderSetText", () => {
  it("renders span by default", () => {
    const text = renderAndGetText();

    expect(text.tagName).toBe("SPAN");
    expect(text.classList.contains("set-text")).toBe(true);
  });

  it("renders paragraph when as is p", () => {
    const root = mountText(renderSetText({ as: "p", children: "Body text" }));
    const text = getByText(root, "Body text");

    expect(text.tagName).toBe("P");
  });

  it.each(["xs", "sm", "md", "lg"] as const)('emits data-size="%s"', (size) => {
    const root = mountText(renderSetText({ children: "Body text", size }));
    const text = getByText(root, "Body text");

    expect(text.getAttribute("data-size")).toBe(size);
  });

  it("defaults to md size", () => {
    const text = renderAndGetText();
    expect(text.getAttribute("data-size")).toBe("md");
  });

  it("omits data-responsive by default and emits it when true", () => {
    const withoutResponsive = renderAndGetText();
    expect(withoutResponsive.hasAttribute("data-responsive")).toBe(false);

    const root = mountText(
      renderSetText({ children: "Body text", responsive: true }),
    );
    const withResponsive = getByText(root, "Body text");
    expect(withResponsive.hasAttribute("data-responsive")).toBe(true);
  });

  it("emits muted tone and omits default tone attr", () => {
    const mutedRoot = mountText(
      renderSetText({ children: "Body text", tone: "muted" }),
    );
    const muted = getByText(mutedRoot, "Body text");
    expect(muted.getAttribute("data-tone")).toBe("muted");

    const defaultRoot = mountText(
      renderSetText({ children: "Body text", tone: "default" }),
    );
    const defaultTone = getByText(defaultRoot, "Body text");
    expect(defaultTone.hasAttribute("data-tone")).toBe(false);
  });

  it('omits data-link-visited by default and emits "off" when disabled', () => {
    const withDefaultLinks = mountText(
      renderSetText({ children: 'Body text with <a href="/docs">link</a>.' }),
    );
    const defaultLinksText = getByText(withDefaultLinks, /Body text with/i);
    expect(defaultLinksText.hasAttribute("data-link-visited")).toBe(false);

    const withDisabledVisited = mountText(
      renderSetText({
        children: 'Body text with <a href="/docs">link</a>.',
        linkVisited: false,
      }),
    );
    const disabledVisitedText = getByText(
      withDisabledVisited,
      /Body text with/i,
    );
    expect(disabledVisitedText.getAttribute("data-link-visited")).toBe("off");
  });

  it("paragraph mode defaults monospaced to true", () => {
    const root = mountText(renderSetText({ as: "p", children: "Body text" }));
    const text = getByText(root, "Body text");

    expect(text.hasAttribute("data-monospaced")).toBe(true);
  });

  it("paragraph mode supports monospaced override", () => {
    const monospacedRoot = mountText(
      renderSetText({ as: "p", children: "Body text", monospaced: true }),
    );
    const monospaced = getByText(monospacedRoot, "Body text");
    expect(monospaced.hasAttribute("data-monospaced")).toBe(true);

    const unmonospacedRoot = mountText(
      renderSetText({ as: "p", children: "Body text", monospaced: false }),
    );
    const unmonospaced = getByText(unmonospacedRoot, "Body text");
    expect(unmonospaced.hasAttribute("data-monospaced")).toBe(false);
  });

  it("paragraph mode omits default align and emits non-default align", () => {
    const defaultAlignRoot = mountText(
      renderSetText({ as: "p", align: "start", children: "Body text" }),
    );
    const defaultAlign = getByText(defaultAlignRoot, "Body text");
    expect(defaultAlign.hasAttribute("data-align")).toBe(false);

    const nonDefaultAlignRoot = mountText(
      renderSetText({ as: "p", align: "end", children: "Body text" }),
    );
    const nonDefaultAlign = getByText(nonDefaultAlignRoot, "Body text");
    expect(nonDefaultAlign.getAttribute("data-align")).toBe("end");
  });

  it("ignores paragraph-only props when rendered as span", () => {
    const unsafeSpanProps = {
      as: "span",
      children: "Body text",
      // Runtime-guard test for non-typed callers.
      align: "end",
      monospaced: true,
    } as unknown as Parameters<typeof renderSetText>[0];

    const root = mountText(renderSetText(unsafeSpanProps));
    const text = getByText(root, "Body text");

    expect(text.hasAttribute("data-align")).toBe(false);
    expect(text.hasAttribute("data-monospaced")).toBe(false);
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountText(
      renderSetText({ children: "Body text", id: "my-text" }),
    );
    const text = getByText(root, "Body text");

    expect(text.id).toBe("my-text");
  });

  it("omits id when not provided", () => {
    const text = renderAndGetText();

    expect(text.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetText({ children: "Body text", id: "not valid" }),
    ).toThrow();
  });

  it("renders trusted inline HTML content", () => {
    const root = mountText(
      renderSetText({
        children:
          'Body text with <em>emphasis</em>, <strong>strength</strong>, and <a href="/docs">link</a>.',
      }),
    );

    expect(getByText(root, /Body text with/i)).toBeTruthy();
    expect(root.querySelector("em")?.textContent).toBe("emphasis");
    expect(root.querySelector("strong")?.textContent).toBe("strength");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/docs");
  });
});

describeSpecConsistency<SetTextProps>({
  baseProps: { children: "Body" },
  renderer: renderSetText,
  spec: SET_TEXT_SPEC,
});
