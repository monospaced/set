import { serializeSetNode, type SetNode } from "../../helpers/node";
import { isValidHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetControlSize } from "../../types";
import {
  buildSetButton,
  type SetButtonLabelVisibility,
  type SetButtonPlacement,
} from "../button/button";
import type { SetIconMirrorMode, SetIconName } from "../icon/icon";

export const SET_MENU_TAG_NAME = "set-menu";
export const SET_MENU_EVENT_CHOOSE = "set-menu-choose";
export type SetMenuAlign = "start" | "end";

export interface SetMenuItem {
  /** Disables selection for this item. */
  disabled?: boolean;
  /** Optional authored identifier surfaced in the choose event payload. */
  id?: string;
  /** Visible item label text. Escaped before render. */
  label: string;
}

export interface SetMenuProps {
  /** Popup alignment relative to the trigger. @default "start" */
  align?: SetMenuAlign;
  /** DOM id applied to the host. Trigger and popup ids are derived as `${id}-button` and `${id}-popup`. */
  id: string;
  /** Action items rendered inside the popup menu. */
  items: SetMenuItem[];
  /** Control size applied to the host and composed trigger button. @default "md" */
  size?: SetControlSize;
  /** Icon name for the trigger button. */
  triggerIcon?: SetIconName;
  /** Icon mirroring mode for the trigger button icon. */
  triggerIconMirrored?: SetIconMirrorMode;
  /** Icon placement within the trigger button. @default "start" */
  triggerIconPlacement?: SetButtonPlacement;
  /** Accessible and visible trigger label text. Escaped before render. */
  triggerLabel: string;
  /** Trigger label visibility treatment. @default "visible" */
  triggerLabelVisibility?: SetButtonLabelVisibility;
}

/**
 * Builds the IR tree for the Set menu component.
 *
 * @param props - Menu component props.
 * @returns IR node for a `set-menu` host.
 */
export function buildSetMenu({
  align = "start",
  id,
  items,
  size = "md",
  triggerIcon,
  triggerIconMirrored,
  triggerIconPlacement,
  triggerLabel,
  triggerLabelVisibility,
}: SetMenuProps): SetNode {
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error("id must be a non-empty string.");
  }

  if (!isValidHtmlId(normalizedId)) {
    throw new Error(
      "id must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  if (!Array.isArray(items)) {
    throw new Error("items must be an array.");
  }

  const triggerId = `${normalizedId}-button`;
  const menuId = `${normalizedId}-popup`;

  const itemNodes: SetNode[] = items.map((item) => ({
    kind: "element",
    tag: "button",
    attrs: {
      "aria-disabled": item.disabled ? "true" : undefined,
      "data-item-id": item.id || undefined,
      role: "menuitem",
      tabindex: "-1",
      type: "button",
    },
    children: [{ kind: "text", value: item.label }],
  }));

  return {
    kind: "element",
    tag: SET_MENU_TAG_NAME,
    attrs: {
      class: "set-menu",
      "data-align": align === "start" ? undefined : align,
      "data-size": size,
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "div",
        attrs: { "data-part": "trigger" },
        children: [
          buildSetButton({
            appearance: "outline",
            controls: menuId,
            disclosure: true,
            haspopup: "menu",
            icon: triggerIcon,
            iconMirrored: triggerIconMirrored,
            iconPlacement: triggerIconPlacement,
            id: triggerId,
            label: triggerLabel,
            labelVisibility: triggerLabelVisibility,
            size,
            tone: "neutral",
            type: "button",
          }),
        ],
      },
      {
        kind: "element",
        tag: "div",
        attrs: {
          "aria-labelledby": triggerId,
          class: "popup",
          hidden: true,
          id: menuId,
          role: "menu",
        },
        children: itemNodes,
      },
    ],
  };
}

/**
 * SSR renderer for the Set menu component.
 *
 * Emits a `set-menu` host containing a trigger button and a semantic
 * `role="menu"` menu of button actions. Interactive open/close, focus
 * management, and choose events are deferred to custom element upgrade.
 *
 * @param props - Menu component props.
 * @returns HTML string for a `set-menu` host.
 */
export function renderSetMenu(props: SetMenuProps): string {
  return serializeSetNode(buildSetMenu(props));
}

/**
 * Defines the `set-menu` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-menu` hosts upgrade
 * in place and receive menu interaction behavior.
 */
export function defineSetMenu(): void {
  if (customElements.get(SET_MENU_TAG_NAME)) return;

  class SetMenuElement extends HTMLElement {
    #onClick?: (event: Event) => void;
    #onDocumentClick?: (event: Event) => void;
    #onFocusOut?: (event: FocusEvent) => void;
    #onKeyDown?: (event: KeyboardEvent) => void;

    connectedCallback(): void {
      this.#teardownListeners();
      this.#close(false);
      this.#setupListeners();
    }

    disconnectedCallback(): void {
      this.#teardownListeners();
    }

    #getTriggerButton(): HTMLButtonElement | null {
      return this.querySelector<HTMLButtonElement>(
        '[data-part="trigger"] .set-button',
      );
    }

    #getMenu(): HTMLElement | null {
      return this.querySelector<HTMLElement>('[role="menu"]');
    }

    #getMenuItems(): HTMLButtonElement[] {
      return Array.from(
        this.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
      );
    }

    #isMenuItemDisabled(item: HTMLButtonElement): boolean {
      return item.getAttribute("aria-disabled") === "true";
    }

    #isOpen(): boolean {
      return this.hasAttribute("data-open");
    }

    #setFocusedItem(index: number): void {
      const items = this.#getMenuItems();

      if (items.length === 0) return;

      const normalizedIndex =
        ((index % items.length) + items.length) % items.length;

      items[normalizedIndex]?.focus();
    }

    #open(focusIndex = 0): void {
      const menu = this.#getMenu();
      const trigger = this.#getTriggerButton();

      if (!menu || !trigger) return;

      menu.hidden = false;
      this.setAttribute("data-open", "");
      trigger.setAttribute("aria-expanded", "true");
      this.#setFocusedItem(focusIndex);
    }

    #close(restoreTriggerFocus = false): void {
      const menu = this.#getMenu();
      const trigger = this.#getTriggerButton();

      if (!menu || !trigger) return;

      menu.hidden = true;
      this.removeAttribute("data-open");
      trigger.setAttribute("aria-expanded", "false");

      if (restoreTriggerFocus) {
        trigger.focus();
      }
    }

    #choose(item: HTMLButtonElement): void {
      const allItems = Array.from(
        this.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
      );
      const index = allItems.indexOf(item);

      this.dispatchEvent(
        new CustomEvent(SET_MENU_EVENT_CHOOSE, {
          bubbles: true,
          detail: {
            id: item.getAttribute("data-item-id") || undefined,
            index,
            label: item.textContent || "",
          },
        }),
      );
    }

    #setupListeners(): void {
      this.#onClick = (event: Event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest('[data-part="trigger"] .set-button')) {
          if (this.#isOpen()) {
            this.#close();
            return;
          }

          this.#open(0);
          return;
        }

        const menuItem = target.closest<HTMLButtonElement>('[role="menuitem"]');

        if (menuItem && this.contains(menuItem)) {
          if (!this.#isMenuItemDisabled(menuItem)) {
            this.#choose(menuItem);
            this.#close(true);
          }
          return;
        }
      };

      this.#onDocumentClick = (event: Event) => {
        const target = event.target;

        if (!(target instanceof Node)) return;

        if (this.#isOpen() && !this.contains(target)) {
          this.#close();
        }
      };

      this.#onKeyDown = (event: KeyboardEvent) => {
        const trigger = this.#getTriggerButton();
        const menu = this.#getMenu();

        if (!trigger || !menu) return;

        if ((event.key === "Escape" || event.key === "Esc") && this.#isOpen()) {
          event.preventDefault();
          this.#close(true);
          return;
        }

        const activeElement = this.ownerDocument.activeElement;
        const items = this.#getMenuItems();
        const currentIndex = items.indexOf(activeElement as HTMLButtonElement);

        if (activeElement === trigger) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.#open(0);
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            this.#open(0);
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            this.#open(items.length - 1);
          }

          return;
        }

        if (!menu.contains(activeElement)) return;

        if (
          activeElement instanceof HTMLButtonElement &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();

          if (!this.#isMenuItemDisabled(activeElement)) {
            this.#choose(activeElement);
            this.#close(true);
          }

          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          this.#setFocusedItem(currentIndex + 1);
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          this.#setFocusedItem(currentIndex - 1);
        }

        if (event.key === "Home") {
          event.preventDefault();
          this.#setFocusedItem(0);
        }

        if (event.key === "End") {
          event.preventDefault();
          this.#setFocusedItem(items.length - 1);
        }

        if (event.key === "Tab") {
          this.#close(false);
        }
      };

      this.#onFocusOut = (event: FocusEvent) => {
        const nextTarget = event.relatedTarget;

        if (!(nextTarget instanceof Node)) {
          this.#close();
          return;
        }

        if (!this.contains(nextTarget)) {
          this.#close();
        }
      };

      this.addEventListener("click", this.#onClick);
      this.addEventListener("keydown", this.#onKeyDown);
      this.addEventListener("focusout", this.#onFocusOut);
      this.ownerDocument.addEventListener("click", this.#onDocumentClick);
    }

    #teardownListeners(): void {
      if (this.#onClick) {
        this.removeEventListener("click", this.#onClick);
      }

      if (this.#onDocumentClick) {
        this.ownerDocument.removeEventListener("click", this.#onDocumentClick);
      }

      if (this.#onKeyDown) {
        this.removeEventListener("keydown", this.#onKeyDown);
      }

      if (this.#onFocusOut) {
        this.removeEventListener("focusout", this.#onFocusOut);
      }

      this.#onClick = undefined;
      this.#onDocumentClick = undefined;
      this.#onFocusOut = undefined;
      this.#onKeyDown = undefined;
    }
  }

  customElements.define(SET_MENU_TAG_NAME, SetMenuElement);
}

/** Declarative menu contract mirror for tooling, docs, and adapters. */
export const SET_MENU_SPEC: SetComponentSpec = {
  name: "menu",
  description: "Use `menu` to show a list of actions from a trigger button.",
  output: {
    element: SET_MENU_TAG_NAME,
    class: "set-menu",
  },
  content: {
    kind: "structured",
    prop: "items",
  },
  props: {
    align: {
      default: "start",
      description: "Popup alignment relative to the trigger.",
      type: { kind: "enum", values: ["start", "end"] },
    },
    id: {
      description:
        "DOM id applied to the host. Trigger and popup ids are derived as `${id}-button` and `${id}-popup`.",
      required: true,
      type: { kind: "string" },
    },
    items: {
      description: "Action items listed inside the popup.",
      required: true,
      type: {
        kind: "array",
        itemShape: {
          disabled: {
            default: false,
            description: "Disables selection for this item.",
            type: { kind: "boolean" },
          },
          id: {
            description:
              "Optional authored identifier surfaced in the choose event payload.",
            type: { kind: "string" },
          },
          label: {
            description: "Visible item label text.",
            required: true,
            type: { kind: "text" },
          },
        },
      },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    triggerIcon: {
      description: "Icon name for the trigger button.",
      type: { kind: "iconName" },
    },
    triggerIconMirrored: {
      description: "Icon mirroring mode for the trigger button icon.",
      type: { kind: "enum", values: ["always", "rtl"] },
    },
    triggerIconPlacement: {
      default: "start",
      description: "Icon placement within the trigger button.",
      type: { kind: "enum", values: ["start", "end"] },
    },
    triggerLabel: {
      description: "Accessible and visible trigger label text.",
      required: true,
      type: { kind: "text" },
    },
    triggerLabelVisibility: {
      default: "visible",
      description: "Trigger label visibility treatment.",
      type: {
        kind: "enum",
        values: ["visible", "hidden", "hiddenBelowTablet"],
      },
    },
  },
  events: {
    [SET_MENU_EVENT_CHOOSE]: {
      bubbles: true,
      description: "Fired when a menu item is activated.",
      detail: "{ id?: string; index: number; label: string }",
    },
  },
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "host" },
        attribute: "data-align",
        condition: { kind: "when-equals", prop: "align", to: "end" },
        value: { kind: "prop", prop: "align" },
      },
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}" },
      },
      {
        target: {
          on: "descendant",
          selector: 'div[data-part="trigger"] button',
        },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}-button" },
      },
      {
        target: { on: "descendant", selector: "div.popup" },
        attribute: "id",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}-popup" },
      },
      {
        target: { on: "descendant", selector: "div.popup" },
        attribute: "aria-labelledby",
        condition: { kind: "always" },
        value: { kind: "template", pattern: "{id}-button" },
      },
      {
        target: { on: "descendant", selector: "div.popup" },
        attribute: "role",
        condition: { kind: "always" },
        value: { kind: "literal", text: "menu" },
      },
      {
        target: { on: "descendant", selector: "div.popup" },
        attribute: "hidden",
        condition: { kind: "always" },
      },
    ],
  },
};
