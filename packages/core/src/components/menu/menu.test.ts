import { getByRole } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { describeSpecConsistency } from "../../test/spec";
import {
  SET_MENU_EVENT_CHOOSE,
  SET_MENU_SPEC,
  SET_MENU_TAG_NAME,
  type SetMenuProps,
  defineSetMenu,
  renderSetMenu,
} from "./menu";

function mount(html: string): void {
  document.body.innerHTML = `<div class="set">${html}</div>`;
}

describe("renderSetMenu", () => {
  it("throws when items is not an array", () => {
    expect(() =>
      renderSetMenu({
        id: "foo",
        items: "bad" as unknown as [],
        triggerLabel: "Actions",
      }),
    ).toThrow("items must be an array.");
  });

  it("renders semantic menu markup inside host", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerIcon: "Download",
        triggerLabel: "Actions",
      }),
    );

    const host = document.body.querySelector(SET_MENU_TAG_NAME);
    const trigger = getByRole(document.body, "button", { name: "Actions" });
    const menu = document.body.querySelector('[role="menu"]');

    expect(host).not.toBeNull();
    expect(trigger.getAttribute("aria-controls")).toBe("foo-popup");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("id")).toBe("foo-button");
    expect(host?.hasAttribute("data-align")).toBe(false);
    expect(menu?.classList.contains("popup")).toBe(true);
    expect(menu?.getAttribute("aria-labelledby")).toBe("foo-button");
    expect(menu?.getAttribute("id")).toBe("foo-popup");
    expect(menu?.hasAttribute("hidden")).toBe(true);
  });

  it("omits data-align for default start alignment and emits end explicitly", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    expect(
      document.body
        .querySelector(SET_MENU_TAG_NAME)
        ?.hasAttribute("data-align"),
    ).toBe(false);

    mount(
      renderSetMenu({
        align: "end",
        id: "foo",
        items: [{ label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    expect(
      document.body
        .querySelector(SET_MENU_TAG_NAME)
        ?.getAttribute("data-align"),
    ).toBe("end");
  });

  it("always emits data-size on the host", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    const defaultHost = document.body.querySelector(SET_MENU_TAG_NAME);
    const defaultTrigger = getByRole(document.body, "button", {
      name: "Actions",
    });

    expect(defaultHost?.getAttribute("data-size")).toBe("md");
    expect(defaultTrigger.getAttribute("data-size")).toBe("md");

    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }],
        size: "sm",
        triggerLabel: "Actions",
      }),
    );

    const largeHost = document.body.querySelector(SET_MENU_TAG_NAME);
    const largeTrigger = getByRole(document.body, "button", {
      name: "Actions",
    });

    expect(largeHost?.getAttribute("data-size")).toBe("sm");
    expect(largeTrigger.getAttribute("data-size")).toBe("sm");
  });

  it("opens from trigger click and closes on Escape", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerIcon: "Download",
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.click();

    const firstItem = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(firstItem.getAttribute("tabindex")).toBe("-1");
    expect(document.activeElement).toBe(firstItem);

    firstItem.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
    );

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it.each([
    ["{Enter}", "Enter"],
    [" ", "Space"],
  ])("opens from trigger %s", async (key) => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const user = userEvent.setup();
    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.focus();
    await user.keyboard(key);

    expect(host.hasAttribute("data-open")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(
      getByRole(document.body, "menuitem", { name: "First action" }),
    );
  });

  it("opens from trigger ArrowDown and ArrowUp to first and last items", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.focus();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: "ArrowDown" }),
    );

    const firstItem = getByRole(document.body, "menuitem", {
      name: "First action",
    });
    expect(document.activeElement).toBe(firstItem);

    firstItem.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
    );

    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, key: "ArrowUp" }),
    );

    const secondItem = getByRole(document.body, "menuitem", {
      name: "Second action",
    });
    expect(
      document.body.querySelector(SET_MENU_TAG_NAME)?.hasAttribute("data-open"),
    ).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(secondItem);
  });

  it("closes on Shift+Tab from a menuitem", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.click();

    const firstItem = getByRole(document.body, "menuitem", {
      name: "First action",
    });

    expect(document.activeElement).toBe(firstItem);

    firstItem.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Tab",
        shiftKey: true,
      }),
    );

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes on Tab from a menuitem", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.click();

    const firstItem = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;

    firstItem.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Tab",
      }),
    );

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("keeps menuitems out of the page tab order", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.click();

    const firstItem = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;

    expect(firstItem.getAttribute("tabindex")).toBe("-1");
  });

  it("closes on Escape after focus has returned to the trigger", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ label: "First action" }, { label: "Second action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });

    trigger.click();

    trigger.focus();

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Escape",
      }),
    );

    expect(host.hasAttribute("data-open")).toBe(false);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it.each([
    ["{Enter}", "Enter"],
    [" ", "Space"],
  ])("activates a focused menuitem with %s", async (key) => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ id: "first", label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const user = userEvent.setup();
    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });
    const onChoose = vi.fn();

    host.addEventListener(SET_MENU_EVENT_CHOOSE, onChoose);

    trigger.click();
    const item = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;

    item.focus();
    await user.keyboard(key);

    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(host.hasAttribute("data-open")).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it("renders disabled items with aria-disabled and does not activate them", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ disabled: true, id: "first", label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });
    const onChoose = vi.fn();

    host.addEventListener(SET_MENU_EVENT_CHOOSE, onChoose);

    trigger.click();

    const item = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;

    expect(item.hasAttribute("disabled")).toBe(false);
    expect(item.getAttribute("aria-disabled")).toBe("true");

    item.focus();
    item.click();

    expect(document.activeElement).toBe(item);
    expect(onChoose).toHaveBeenCalledTimes(0);
    expect(host.hasAttribute("data-open")).toBe(true);
  });

  it("treats disabled items as focusable when the menu opens", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [
          { disabled: true, id: "first", label: "First action" },
          { id: "second", label: "Second action" },
        ],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    getByRole(document.body, "button", { name: "Actions" }).click();

    expect(document.activeElement).toBe(
      getByRole(document.body, "menuitem", { name: "First action" }),
    );
  });

  it("dispatches choose and closes on item click", () => {
    mount(
      renderSetMenu({
        id: "foo",
        items: [{ id: "first", label: "First action" }],
        triggerLabel: "Actions",
      }),
    );

    defineSetMenu();

    const host = document.body.querySelector(SET_MENU_TAG_NAME) as HTMLElement;
    const trigger = getByRole(document.body, "button", { name: "Actions" });
    const onChoose = vi.fn();

    host.addEventListener(SET_MENU_EVENT_CHOOSE, onChoose);

    trigger.click();

    const item = getByRole(document.body, "menuitem", {
      name: "First action",
    }) as HTMLButtonElement;
    item.click();

    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose.mock.calls[0]?.[0]?.detail).toEqual({
      id: "first",
      index: 0,
      label: "First action",
    });
    expect(host.hasAttribute("data-open")).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});

describeSpecConsistency<SetMenuProps>({
  baseProps: {
    id: "m",
    items: [{ label: "Item" }],
    triggerLabel: "Actions",
  },
  propOverrides: {
    triggerLabelVisibility: { triggerIcon: "menu" },
  },
  renderer: renderSetMenu,
  spec: SET_MENU_SPEC,
});
