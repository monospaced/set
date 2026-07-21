import { getByRole, getByText, queryByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_RADIOS_SPEC,
  type SetRadiosProps,
  renderSetRadios,
} from "./radios";

function mountRadios(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetRadios", () => {
  const baseItems = [
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
  ];

  it("renders a fieldset with legend, radios wrapper, and options", () => {
    const root = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    );

    const fieldset = root.querySelector(".set-fieldset");
    const radios = root.querySelector(".set-radios");

    expect(fieldset?.getAttribute("id")).toBe("contact");
    expect(radios?.getAttribute("data-orientation")).toBe("vertical");
    expect(radios?.getAttribute("data-size")).toBe("md");
    expect(root.querySelectorAll(".radio-field")).toHaveLength(2);
    expect(getByText(root, "Contact Method").tagName).toBe("LEGEND");
    expect(getByRole(root, "radio", { name: "Email" })).toBeTruthy();
    expect(getByRole(root, "radio", { name: "SMS" })).toBeTruthy();
  });

  it("throws for invalid top-level props", () => {
    expect(() =>
      renderSetRadios({
        id: "   ",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    ).toThrow("id must be a non-empty string.");

    expect(() =>
      renderSetRadios({
        id: "not valid",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    ).toThrow(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );

    expect(() =>
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "   ",
        radios: baseItems,
      }),
    ).toThrow("name must be a non-empty string.");

    expect(() =>
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [{ label: "Only", value: "only" }],
      }),
    ).toThrow("radios must include at least 2 options.");
  });

  it("throws for invalid radio items", () => {
    expect(() =>
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [
          { label: "Email", value: "email" },
          { label: "SMS", value: "   " },
        ],
      }),
    ).toThrow("radios[1].value must be non-empty.");

    expect(() =>
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [
          { label: "Email", value: "email" },
          { label: "   ", value: "sms" },
        ],
      }),
    ).toThrow("radios[1].label must be non-empty.");

    expect(() =>
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [
          { label: "Email", value: "dup" },
          { label: "SMS", value: "dup" },
        ],
      }),
    ).toThrow("radios values must be unique.");
  });

  it("maps orientation to the .set-radios container", () => {
    const root = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        orientation: "horizontal",
        radios: baseItems,
      }),
    );

    expect(
      root.querySelector(".set-radios")?.getAttribute("data-orientation"),
    ).toBe("horizontal");
  });

  it("maps size to the .set-radios container", () => {
    const root = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
        size: "sm",
      }),
    );

    expect(root.querySelector(".set-radios")?.getAttribute("data-size")).toBe(
      "sm",
    );
  });

  it("maps selected value to checked radio and leaves unmatched values unchecked", () => {
    const selectedRoot = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
        value: "sms",
      }),
    );

    expect(
      getByRole(selectedRoot, "radio", { name: "SMS" }).hasAttribute("checked"),
    ).toBe(true);
    expect(
      getByRole(selectedRoot, "radio", { name: "Email" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);

    const unmatchedRoot = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
        value: "postal",
      }),
    );

    expect(
      getByRole(unmatchedRoot, "radio", { name: "Email" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);
    expect(
      getByRole(unmatchedRoot, "radio", { name: "SMS" }).hasAttribute(
        "checked",
      ),
    ).toBe(false);
  });

  it("wires group description to fieldset only", () => {
    const root = mountRadios(
      renderSetRadios({
        description: "Choose one.",
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    );

    const fieldset = root.querySelector("fieldset");
    const firstInput = getByRole(root, "radio", { name: "Email" });

    expect(fieldset?.getAttribute("aria-describedby")).toBe(
      "contact-description",
    );
    expect(firstInput.getAttribute("aria-describedby")).toBeNull();
    expect(getByText(root, "Choose one.").getAttribute("id")).toBe(
      "contact-description",
    );
  });

  it("wires per-item description to matching input only", () => {
    const root = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [
          { label: "Email", value: "email" },
          { description: "Text messages only.", label: "SMS", value: "sms" },
        ],
      }),
    );

    const smsInput = getByRole(root, "radio", { name: /SMS/ });
    const emailInput = getByRole(root, "radio", { name: "Email" });

    expect(smsInput.getAttribute("aria-describedby")).toBe(
      "contact-sms-description",
    );
    expect(emailInput.getAttribute("aria-describedby")).toBeNull();
    expect(getByText(root, "Text messages only.").getAttribute("id")).toBe(
      "contact-sms-description",
    );
    expect(
      getByRole(root, "radio", { name: /SMS/ })
        .closest("label")
        ?.querySelector(".radio-description"),
    ).toBeNull();
  });

  it("applies invalid to fieldset and suppresses it when disabled", () => {
    const invalidRoot = mountRadios(
      renderSetRadios({
        id: "contact",
        invalid: true,
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    );

    expect(
      invalidRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBe("true");

    const disabledRoot = mountRadios(
      renderSetRadios({
        disabled: true,
        id: "contact",
        invalid: true,
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    );

    expect(
      disabledRoot.querySelector("fieldset")?.getAttribute("aria-invalid"),
    ).toBeNull();
  });

  it("emits required on non-disabled radios only when enabled", () => {
    const requiredRoot = mountRadios(
      renderSetRadios({
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: [
          { disabled: true, label: "Email", value: "email" },
          { label: "SMS", value: "sms" },
          { label: "Phone", value: "phone" },
        ],
        required: true,
      }),
    );

    expect(
      getByRole(requiredRoot, "radio", { name: "Email" }).hasAttribute(
        "required",
      ),
    ).toBe(false);
    expect(
      getByRole(requiredRoot, "radio", { name: "SMS" }).hasAttribute(
        "required",
      ),
    ).toBe(true);
    expect(
      getByRole(requiredRoot, "radio", { name: "Phone" }).hasAttribute(
        "required",
      ),
    ).toBe(true);

    const groupDisabledRoot = mountRadios(
      renderSetRadios({
        disabled: true,
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
        required: true,
      }),
    );

    expect(
      getByRole(groupDisabledRoot, "radio", { name: "Email" }).hasAttribute(
        "required",
      ),
    ).toBe(false);
    expect(
      getByRole(groupDisabledRoot, "radio", { name: "SMS" }).hasAttribute(
        "required",
      ),
    ).toBe(false);
  });

  it("uses fieldset disabled inheritance without emitting disabled on every input", () => {
    const root = mountRadios(
      renderSetRadios({
        disabled: true,
        id: "contact",
        legend: "Contact Method",
        name: "contact",
        radios: baseItems,
      }),
    );

    expect(root.querySelector("fieldset")?.hasAttribute("disabled")).toBe(true);
    expect(
      getByRole(root, "radio", { name: "Email" }).hasAttribute("disabled"),
    ).toBe(false);
    expect(
      getByRole(root, "radio", { name: "SMS" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  it("escapes legend, labels, and descriptions", () => {
    const root = mountRadios(
      renderSetRadios({
        description: `<img src=x onerror=alert(2)>`,
        id: "contact",
        legend: `Contact <Method>`,
        name: "contact",
        radios: [
          { label: `<script>alert(1)</script>`, value: "email" },
          { description: `<b>desc</b>`, label: "SMS", value: "sms" },
        ],
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
    expect(
      getByRole(root, "radio", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<b>desc</b>`)).toBeTruthy();
    expect(queryByText(root, "alert(1)")).toBeNull();
  });
});

describeSpecConsistency<SetRadiosProps>({
  baseProps: {
    id: "r",
    legend: "Legend",
    name: "choice",
    radios: [
      { label: "A", value: "a" },
      { label: "B", value: "b" },
    ],
  },
  renderer: renderSetRadios,
  spec: SET_RADIOS_SPEC,
});
