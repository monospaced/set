import { getByRole, getByText, queryByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  renderSetHeading,
  SET_HEADING_SPEC,
  type SetHeadingProps,
} from "./heading";

function mountHeading(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetHeading", () => {
  it("renders span by default with md size and no responsive attr", () => {
    const root = mountHeading(renderSetHeading({ text: "Title" }));
    const text = getByText(root, "Title");

    expect(queryByRole(root, "heading")).toBeNull();
    expect(text.tagName).toBe("SPAN");
    expect(text.classList.contains("set-heading")).toBe(true);
    expect(text.getAttribute("data-size")).toBe("md");
    expect(text.hasAttribute("data-responsive")).toBe(false);
  });

  it("renders semantic heading role and level when level is provided", () => {
    const root = mountHeading(renderSetHeading({ text: "Title", level: 3 }));
    const heading = getByRole(root, "heading", { level: 3, name: "Title" });

    expect(heading).toBeTruthy();
  });

  it("omits data-align for default start align", () => {
    const root = mountHeading(
      renderSetHeading({ align: "start", text: "Title", level: 2 }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.hasAttribute("data-align")).toBe(false);
  });

  it("emits data-align for non-default align", () => {
    const root = mountHeading(
      renderSetHeading({ align: "end", text: "Title", level: 2 }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.getAttribute("data-align")).toBe("end");
  });

  it("emits data-size variant when provided", () => {
    const root = mountHeading(
      renderSetHeading({ text: "Title", level: 2, size: "2xl" }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.getAttribute("data-size")).toBe("2xl");
  });

  it("emits data-responsive when responsive is true", () => {
    const root = mountHeading(
      renderSetHeading({ text: "Title", level: 2, responsive: true }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.hasAttribute("data-responsive")).toBe(true);
  });

  it("emits data-optical-align when opticalAlign is true", () => {
    const root = mountHeading(
      renderSetHeading({ text: "Title", level: 2, opticalAlign: true }),
    );
    const heading = getByRole(root, "heading", { level: 2, name: "Title" });

    expect(heading.hasAttribute("data-optical-align")).toBe(true);
  });

  it("escapes heading text", () => {
    const root = mountHeading(
      renderSetHeading({
        text: `<script>alert("xss")</script>`,
        level: 2,
      }),
    );
    const heading = getByRole(root, "heading", {
      level: 2,
      name: `<script>alert("xss")</script>`,
    });

    expect(root.querySelector("script")).toBeNull();
    expect(heading.textContent).toBe(`<script>alert("xss")</script>`);
  });

  it("does not expose heading role in span mode", () => {
    const root = mountHeading(
      renderSetHeading({
        text: "Title",
      }),
    );

    expect(queryByRole(root, "heading")).toBeNull();
  });

  it("renders consumer-provided id on the host", () => {
    const root = mountHeading(
      renderSetHeading({ id: "my-heading", level: 2, text: "Heading" }),
    );
    const heading = root.querySelector(".set-heading") as HTMLElement;

    expect(heading.id).toBe("my-heading");
  });

  it("omits id when not provided", () => {
    const root = mountHeading(renderSetHeading({ level: 2, text: "Heading" }));
    const heading = root.querySelector(".set-heading") as HTMLElement;

    expect(heading.hasAttribute("id")).toBe(false);
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetHeading({ id: "not valid", level: 2, text: "Heading" }),
    ).toThrow();
  });
});

describeSpecConsistency<SetHeadingProps>({
  baseProps: { text: "Heading" },
  renderer: renderSetHeading,
  spec: SET_HEADING_SPEC,
});
