import { getByRole } from "@testing-library/dom";
import { describe, expect, it } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  applySetButtonActivity,
  renderSetButton,
  SET_BUTTON_SPEC,
  type SetButtonProps,
} from "./button";

function mount(html: string): void {
  document.body.innerHTML = `<div class="set">${html}</div>`;
}

describe("renderSetButton", () => {
  it("defaults to standard attrs", () => {
    mount(renderSetButton({ label: "Save" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("data-appearance")).toBe("outline");
    expect(button.getAttribute("data-size")).toBe("md");
    expect(button.getAttribute("data-tone")).toBeNull();
    expect(button.getAttribute("type")).toBe("button");
    expect(button.getAttribute("data-label-visibility")).toBeNull();
  });

  it("emits neutral tone only when provided", () => {
    mount(renderSetButton({ label: "Save", tone: "neutral" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("data-tone")).toBe("neutral");
  });

  it("supports submit type", () => {
    mount(renderSetButton({ label: "Save", type: "submit" }));
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("type")).toBe("submit");
  });

  it("emits non-empty form attrs and omits empty values", () => {
    mount(
      renderSetButton({
        form: "profile-form",
        label: "Save",
        name: "",
        value: "save",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Save" });

    expect(button.getAttribute("form")).toBe("profile-form");
    expect(button.getAttribute("name")).toBeNull();
    expect(button.getAttribute("value")).toBe("save");
  });

  it("supports disclosure semantics", () => {
    mount(
      renderSetButton({
        controls: "sidebar",
        disclosure: true,
        label: "Open sidebar",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.getAttribute("aria-controls")).toBe("sidebar");
  });

  it("supports haspopup", () => {
    mount(
      renderSetButton({
        haspopup: "menu",
        label: "Open menu",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Open menu" });

    expect(button.getAttribute("aria-haspopup")).toBe("menu");
  });

  it("ignores controls when disclosure is omitted", () => {
    mount(
      renderSetButton({
        controls: "sidebar",
        label: "Open sidebar",
      }),
    );
    const button = getByRole(document.body, "button", {
      name: "Open sidebar",
    });

    expect(button.getAttribute("aria-expanded")).toBeNull();
    expect(button.getAttribute("aria-controls")).toBeNull();
  });

  it("renders icon at start by default when icon is provided", () => {
    mount(
      renderSetButton({
        icon: "arrow-right",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.firstElementChild?.className).toBe("icon-wrapper");
    expect(button.querySelector(".icon-wrapper .set-icon")).toBeTruthy();
  });

  it("renders icon at end when iconPlacement is end", () => {
    mount(
      renderSetButton({
        icon: "arrow-right",
        iconPlacement: "end",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.lastElementChild?.className).toBe("icon-wrapper");
  });

  it("emits label visibility and mirrored attrs when provided", () => {
    mount(
      renderSetButton({
        icon: "arrow-right",
        iconMirrored: "rtl",
        label: "Continue",
        labelVisibility: "hiddenBelowTablet",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });
    const icon = button.querySelector("svg.set-icon");

    expect(button.getAttribute("data-label-visibility")).toBe(
      "hiddenBelowTablet",
    );
    expect(icon?.getAttribute("data-mirrored")).toBe("rtl");
  });

  it("supports always-hidden labels when icon is present", () => {
    mount(
      renderSetButton({
        icon: "arrow-right",
        label: "Continue",
        labelVisibility: "hidden",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.getAttribute("data-label-visibility")).toBe("hidden");
    expect(button.querySelector(".label")?.textContent).toBe("Continue");
  });

  it("treats empty icon string as omitted", () => {
    mount(
      renderSetButton({
        // @ts-expect-error empty string is not a SetIconName; exercises the
        // runtime "treat as omitted" path.
        icon: "",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });

    expect(button.getAttribute("data-label-visibility")).toBeNull();
    expect(button.querySelector(".icon-wrapper")).toBeNull();
  });

  it("throws when label is hidden but no icon is present", () => {
    expect(() =>
      renderSetButton({
        label: "Continue",
        labelVisibility: "hidden",
      }),
    ).toThrow("labelVisibility requires icon when label is not visible.");
  });

  it("renders button icon as decorative", () => {
    mount(
      renderSetButton({
        icon: "arrow-right",
        label: "Continue",
      }),
    );
    const button = getByRole(document.body, "button", { name: "Continue" });
    const icon = button.querySelector("svg.set-icon");

    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.getAttribute("role")).toBeNull();
    expect(icon?.querySelector("title")).toBeNull();
  });

  it("emits no activity affordance when activity is omitted", () => {
    mount(renderSetButton({ icon: "download", label: "Download" }));
    const button = getByRole(document.body, "button", { name: "Download" });

    expect(button.hasAttribute("data-activity")).toBe(false);
    expect(button.getAttribute("aria-disabled")).toBeNull();
    expect(button.querySelector(".set-spinner")).toBeNull();
    expect(button.querySelector(".status")).toBeNull();
  });

  it("primes the spinner and status but stays interactive when activity is idle", () => {
    mount(
      renderSetButton({
        activity: "idle",
        icon: "download",
        label: "Download",
      }),
    );
    const button = getByRole(document.body, "button");

    expect(button.getAttribute("data-activity")).toBe("idle");
    expect(button.getAttribute("aria-disabled")).toBeNull();

    expect(button.querySelector(".icon-wrapper .set-spinner")).toBeTruthy();
    expect(button.querySelector(".status")?.textContent).toBe(", busy");
  });

  it("shows the spinner and disables the button when activity is busy", () => {
    mount(
      renderSetButton({
        activity: "busy",
        icon: "download",
        label: "Download",
      }),
    );
    const button = getByRole(document.body, "button");

    expect(button.getAttribute("data-activity")).toBe("busy");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("disabled")).toBeNull();
    expect(button.querySelector(".icon-wrapper .set-icon")).toBeTruthy();
    expect(button.querySelector(".icon-wrapper .set-spinner")).toBeTruthy();
  });

  it("appends the status after the label so the busy name reads last", () => {
    mount(
      renderSetButton({
        activity: "busy",
        icon: "download",
        label: "Download",
      }),
    );
    const button = getByRole(document.body, "button");

    expect(button.lastElementChild?.className).toBe("status");
    expect(button.lastElementChild?.textContent).toBe(", busy");
  });

  it("overlays a centered spinner on an icon-less busy button", () => {
    mount(renderSetButton({ activity: "busy", label: "Saving" }));
    const button = getByRole(document.body, "button");

    expect(button.getAttribute("data-activity")).toBe("busy");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.querySelector(".icon-wrapper")).toBeNull();
    expect(button.querySelector(".spinner-overlay .set-spinner")).toBeTruthy();
    expect(button.querySelector(".label")?.textContent).toBe("Saving");
    expect(button.querySelector(".status")?.textContent).toBe(", busy");
  });

  it("primes the overlay spinner on an icon-less idle button", () => {
    mount(renderSetButton({ activity: "idle", label: "Saving" }));
    const button = getByRole(document.body, "button");

    expect(button.getAttribute("data-activity")).toBe("idle");
    expect(button.getAttribute("aria-disabled")).toBeNull();
    expect(button.querySelector(".spinner-overlay .set-spinner")).toBeTruthy();
  });

  describe("escaping", () => {
    it("escapes label content", () => {
      const html = renderSetButton({ label: "<script>alert(1)</script>" });

      expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(html).not.toContain("<script>");
    });
  });
});

describe("applySetButtonActivity", () => {
  it("applies busy attributes to a rendered button", () => {
    mount(renderSetButton({ activity: "idle", icon: "download", label: "X" }));
    const button = getByRole(document.body, "button");

    applySetButtonActivity(button, "busy");

    expect(button.getAttribute("data-activity")).toBe("busy");
    expect(button.getAttribute("aria-disabled")).toBe("true");
  });

  it("clears aria-disabled when returning to idle", () => {
    mount(renderSetButton({ activity: "busy", icon: "download", label: "X" }));
    const button = getByRole(document.body, "button");

    applySetButtonActivity(button, "idle");

    expect(button.getAttribute("data-activity")).toBe("idle");
    expect(button.hasAttribute("aria-disabled")).toBe(false);
  });

  it("removes the affordance attributes when cleared with null", () => {
    mount(renderSetButton({ activity: "busy", icon: "download", label: "X" }));
    const button = getByRole(document.body, "button");

    applySetButtonActivity(button, null);

    expect(button.hasAttribute("data-activity")).toBe(false);
    expect(button.hasAttribute("aria-disabled")).toBe(false);
  });

  it("matches what buildSetButton renders for the same state", () => {
    mount(renderSetButton({ activity: "idle", icon: "download", label: "X" }));
    const toggled = getByRole(document.body, "button");
    applySetButtonActivity(toggled, "busy");

    mount(renderSetButton({ activity: "busy", icon: "download", label: "X" }));
    const rendered = getByRole(document.body, "button");

    expect(toggled.getAttribute("data-activity")).toBe(
      rendered.getAttribute("data-activity"),
    );
    expect(toggled.getAttribute("aria-disabled")).toBe(
      rendered.getAttribute("aria-disabled"),
    );
  });
});

describeSpecConsistency<SetButtonProps>({
  baseProps: { label: "Label" },
  propOverrides: {
    labelVisibility: { icon: "arrow-right" },
  },
  renderer: renderSetButton,
  spec: SET_BUTTON_SPEC,
});
