import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_CHECKBOX_SPEC,
  type SetCheckboxProps,
  renderSetCheckbox,
} from "./checkbox";

function mountCheckbox(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetCheckbox", () => {
  it("renders checkbox with label", () => {
    const root = mountCheckbox(renderSetCheckbox({ label: "Subscribe" }));
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });
    const field = root.querySelector(".set-checkbox");

    expect(field).toBeTruthy();
    expect(field?.getAttribute("data-size")).toBe("md");
    expect(checkbox.getAttribute("type")).toBe("checkbox");
  });

  it("emits requested size variant", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        label: "Subscribe",
        size: "sm",
      }),
    );
    const field = root.querySelector(".set-checkbox");

    expect(field?.getAttribute("data-size")).toBe("sm");
  });

  it("emits checked/disabled/required attrs when true", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        checked: true,
        disabled: true,
        label: "Subscribe",
        required: true,
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.hasAttribute("checked")).toBe(true);
    expect(checkbox.hasAttribute("disabled")).toBe(true);
    expect(checkbox.hasAttribute("required")).toBe(true);
  });

  it("omits checked when checked is false", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        checked: false,
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.hasAttribute("checked")).toBe(false);
  });

  it("emits aria-invalid only when invalid is true", () => {
    const validRoot = mountCheckbox(renderSetCheckbox({ label: "Subscribe" }));
    const validCheckbox = getByRole(validRoot, "checkbox", {
      name: "Subscribe",
    });
    expect(validCheckbox.getAttribute("aria-invalid")).toBeNull();

    const invalidRoot = mountCheckbox(
      renderSetCheckbox({ invalid: true, label: "Subscribe" }),
    );
    const invalidCheckbox = getByRole(invalidRoot, "checkbox", {
      name: "Subscribe",
    });
    expect(invalidCheckbox.getAttribute("aria-invalid")).toBe("true");
  });

  it("suppresses aria-invalid when disabled is true", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        disabled: true,
        invalid: true,
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-invalid")).toBeNull();
  });

  it("emits name/value and omits empty values", () => {
    const withValuesRoot = mountCheckbox(
      renderSetCheckbox({
        label: "Subscribe",
        name: "subscribe",
        value: "yes",
      }),
    );
    const withValues = getByRole(withValuesRoot, "checkbox", {
      name: "Subscribe",
    });

    expect(withValues.getAttribute("name")).toBe("subscribe");
    expect(withValues.getAttribute("value")).toBe("yes");

    const withoutValuesRoot = mountCheckbox(
      renderSetCheckbox({ label: "Subscribe", name: "", value: "" }),
    );
    const withoutValues = getByRole(withoutValuesRoot, "checkbox", {
      name: "Subscribe",
    });

    expect(withoutValues.getAttribute("name")).toBeNull();
    expect(withoutValues.getAttribute("value")).toBeNull();
  });

  it("renders description and derives aria-describedby from id", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        description: "Optional helper text",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });
    const description = getByText(root, "Optional helper text");

    expect(checkbox.getAttribute("aria-describedby")).toBe(
      "subscribe-description",
    );
    expect(description.getAttribute("id")).toBe("subscribe-description");
  });

  it("trims description before render", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        description: "  Optional helper text  ",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const description = getByText(root, "Optional helper text");

    expect(description.getAttribute("id")).toBe("subscribe-description");
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        description: "   ",
        id: "subscribe",
        label: "Subscribe",
      }),
    );
    const checkbox = getByRole(root, "checkbox", { name: "Subscribe" });

    expect(checkbox.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("throws when description is provided without id", () => {
    expect(() =>
      renderSetCheckbox({
        description: "Optional helper text",
        label: "Subscribe",
      }),
    ).toThrow("id must be provided when description is provided.");
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetCheckbox({ id: "not valid", label: "Subscribe" }),
    ).toThrow();
  });

  it("escapes label and description text", () => {
    const root = mountCheckbox(
      renderSetCheckbox({
        description: `<img src=x onerror=alert(2)>`,
        id: "subscribe",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(
      getByRole(root, "checkbox", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });

  it("renders consumer-provided id on the underlying input", () => {
    const root = mountCheckbox(
      renderSetCheckbox({ id: "my-checkbox", label: "Label" }),
    );
    const input = root.querySelector("input.checkbox") as HTMLInputElement;

    expect(input.id).toBe("my-checkbox");
  });

  it("omits id when not provided", () => {
    const root = mountCheckbox(renderSetCheckbox({ label: "Label" }));
    const input = root.querySelector("input.checkbox") as HTMLInputElement;

    expect(input.hasAttribute("id")).toBe(false);
  });
});

describeSpecConsistency<SetCheckboxProps>({
  baseProps: { label: "Label" },
  renderer: renderSetCheckbox,
  spec: SET_CHECKBOX_SPEC,
});
