import { getByRole, getByText } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_SWITCH_SPEC,
  type SetSwitchProps,
  renderSetSwitch,
} from "./switch";

function mountSwitch(html: string): HTMLElement {
  document.body.innerHTML = `<div class="set">${html}</div>`;
  return document.body.querySelector(".set") as HTMLElement;
}

describe("renderSetSwitch", () => {
  it("renders switch with label and default size", () => {
    const root = mountSwitch(renderSetSwitch({ label: "Notifications" }));
    const input = getByRole(root, "switch", { name: "Notifications" });
    const field = root.querySelector(".set-switch");

    expect(field?.getAttribute("data-size")).toBe("md");
    expect(input.getAttribute("type")).toBe("checkbox");
    expect(input.getAttribute("role")).toBe("switch");
  });

  it("emits checked and disabled attrs when true", () => {
    const root = mountSwitch(
      renderSetSwitch({
        checked: true,
        disabled: true,
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.hasAttribute("checked")).toBe(true);
    expect(input.hasAttribute("disabled")).toBe(true);
  });

  it("omits checked when checked is false", () => {
    const root = mountSwitch(
      renderSetSwitch({ checked: false, label: "Notifications" }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.hasAttribute("checked")).toBe(false);
  });

  it("emits size attribute for sm", () => {
    const root = mountSwitch(
      renderSetSwitch({ label: "Notifications", size: "sm" }),
    );
    const field = root.querySelector(".set-switch");

    expect(field?.getAttribute("data-size")).toBe("sm");
  });

  it("emits name/value and omits empty values", () => {
    const withValuesRoot = mountSwitch(
      renderSetSwitch({
        label: "Notifications",
        name: "notifications",
        value: "yes",
      }),
    );
    const withValues = getByRole(withValuesRoot, "switch", {
      name: "Notifications",
    });

    expect(withValues.getAttribute("name")).toBe("notifications");
    expect(withValues.getAttribute("value")).toBe("yes");

    const withoutValuesRoot = mountSwitch(
      renderSetSwitch({ label: "Notifications", name: "", value: "" }),
    );
    const withoutValues = getByRole(withoutValuesRoot, "switch", {
      name: "Notifications",
    });

    expect(withoutValues.getAttribute("name")).toBeNull();
    expect(withoutValues.getAttribute("value")).toBeNull();
  });

  it("renders description and derives aria-describedby from id", () => {
    const root = mountSwitch(
      renderSetSwitch({
        description: "Optional helper text",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });
    const description = getByText(root, "Optional helper text");

    expect(input.getAttribute("aria-describedby")).toBe(
      "notifications-description",
    );
    expect(description.getAttribute("id")).toBe("notifications-description");
  });

  it("trims description before render", () => {
    const root = mountSwitch(
      renderSetSwitch({
        description: "  Optional helper text  ",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const description = getByText(root, "Optional helper text");

    expect(description.getAttribute("id")).toBe("notifications-description");
  });

  it("omits description markup and aria-describedby when description is blank", () => {
    const root = mountSwitch(
      renderSetSwitch({
        description: "   ",
        id: "notifications",
        label: "Notifications",
      }),
    );
    const input = getByRole(root, "switch", { name: "Notifications" });

    expect(input.getAttribute("aria-describedby")).toBeNull();
    expect(root.querySelector(".description")).toBeNull();
  });

  it("throws when description is provided without id", () => {
    expect(() =>
      renderSetSwitch({
        description: "Optional helper text",
        label: "Notifications",
      }),
    ).toThrow("id must be provided when description is provided.");
  });

  it("throws on a syntactically invalid id", () => {
    expect(() =>
      renderSetSwitch({ id: "not valid", label: "Notifications" }),
    ).toThrow();
  });

  it("escapes label and description text", () => {
    const root = mountSwitch(
      renderSetSwitch({
        description: `<img src=x onerror=alert(2)>`,
        id: "notifications",
        label: `<script>alert(1)</script>`,
      }),
    );

    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("img")).toBeNull();
    expect(
      getByRole(root, "switch", { name: `<script>alert(1)</script>` }),
    ).toBeTruthy();
    expect(getByText(root, `<img src=x onerror=alert(2)>`)).toBeTruthy();
  });

  it("renders consumer-provided id on the inner input", () => {
    const root = mountSwitch(
      renderSetSwitch({ id: "my-switch", label: "Label" }),
    );
    const input = root.querySelector("input.switch") as HTMLInputElement;

    expect(input.id).toBe("my-switch");
  });

  it("omits id when not provided", () => {
    const root = mountSwitch(renderSetSwitch({ label: "Label" }));
    const input = root.querySelector("input.switch") as HTMLInputElement;

    expect(input.hasAttribute("id")).toBe(false);
  });
});

describeSpecConsistency<SetSwitchProps>({
  baseProps: { label: "Label" },
  renderer: renderSetSwitch,
  spec: SET_SWITCH_SPEC,
});
