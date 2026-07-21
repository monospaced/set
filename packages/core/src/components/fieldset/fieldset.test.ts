import { getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_FIELDSET_SPEC,
  type SetFieldsetProps,
  renderSetFieldset,
} from "./fieldset";

function mountFieldset(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetFieldset", () => {
  it("renders fieldset with id, legend, class, and trusted children", () => {
    const root = mountFieldset(
      renderSetFieldset({
        children: '<div class="content">Body</div>',
        id: "contact",
        legend: "Legend",
      }),
    );

    const fieldset = root.querySelector("fieldset");

    expect(fieldset?.getAttribute("id")).toBe("contact");
    expect(fieldset?.classList.contains("set-fieldset")).toBe(true);
    expect(fieldset?.hasAttribute("data-inline-size")).toBe(false);
    expect(getByText(root, "Legend").tagName).toBe("LEGEND");
    expect(root.querySelector(".content")?.textContent).toBe("Body");
  });

  it("emits data-inline-size only when inlineSize is fit", () => {
    const root = mountFieldset(
      renderSetFieldset({
        id: "contact",
        inlineSize: "fit",
        legend: "Legend",
      }),
    );

    expect(
      root.querySelector("fieldset")?.getAttribute("data-inline-size"),
    ).toBe("fit");
  });

  it("wires group description to derived aria-describedby id", () => {
    const root = mountFieldset(
      renderSetFieldset({
        description: "Choose one.",
        id: "contact",
        legend: "Legend",
      }),
    );

    const fieldset = root.querySelector("fieldset");

    expect(fieldset?.getAttribute("aria-describedby")).toBe(
      "contact-description",
    );
    expect(getByText(root, "Choose one.").getAttribute("id")).toBe(
      "contact-description",
    );
  });

  it("emits aria-invalid only when invalid and not disabled", () => {
    const invalidRoot = mountFieldset(
      renderSetFieldset({
        id: "contact",
        invalid: true,
        legend: "Legend",
      }),
    );

    expect(
      invalidRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBe("true");

    const disabledRoot = mountFieldset(
      renderSetFieldset({
        disabled: true,
        id: "contact",
        invalid: true,
        legend: "Legend",
      }),
    );

    expect(
      disabledRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("allows omitted and empty children without throwing", () => {
    const omittedRoot = mountFieldset(
      renderSetFieldset({
        id: "contact",
        legend: "Legend",
      }),
    );

    const omittedFieldset = omittedRoot.querySelector(".set-fieldset");

    expect(omittedFieldset).toBeTruthy();
    expect(omittedFieldset?.innerHTML).toContain("<legend");

    const emptyRoot = mountFieldset(
      renderSetFieldset({
        children: "",
        id: "contact",
        legend: "Legend",
      }),
    );

    expect(emptyRoot.querySelector(".set-fieldset")?.innerHTML).toContain(
      "<legend",
    );
  });

  it("throws for empty or invalid id", () => {
    expect(() =>
      renderSetFieldset({
        id: "   ",
        legend: "Legend",
      }),
    ).toThrow("id must be a non-empty string.");

    expect(() =>
      renderSetFieldset({
        id: "not valid",
        legend: "Legend",
      }),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  });

  it("escapes legend and description content", () => {
    const root = mountFieldset(
      renderSetFieldset({
        description: `<img src=x onerror=alert(2)>`,
        id: "contact",
        legend: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByText(root, `<script>alert(1)</script>`)).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });
});

describeSpecConsistency<SetFieldsetProps>({
  baseProps: { id: "fs", legend: "Legend" },
  renderer: renderSetFieldset,
  spec: SET_FIELDSET_SPEC,
});
