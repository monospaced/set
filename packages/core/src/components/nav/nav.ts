import { type SetNode, serializeSetNode } from "../../helpers/node";
import { isValidHtmlId, normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import { renderSetExpander } from "../expander/expander";

export const SET_NAV_TAG_NAME = "set-nav";
export type SetNavCollapsible = "always" | "belowTablet";
export type SetNavExpanderPosition = "start" | "end";
export type SetNavSize = "sm" | "md";
const scrollLockAttr = "data-set-scroll-locked";

export interface SetNavItem {
  /** Emits `aria-current="page"` when true. @default false */
  current?: boolean;
  /** Link destination. */
  href: string;
  /** Link label (escaped before render). */
  label: string;
}

export interface SetNavProps {
  /** Collapsible nav behavior. Emits `data-collapsible` as a structural hook for runtime enhancement. */
  collapsible?: SetNavCollapsible;
  /** ID applied to `.content`; also used as expander `aria-controls`. Required when `collapsible` is set. */
  contentId?: string;
  /** Accessible label for the runtime expander button when `collapsible` is set. */
  expanderLabel?: string;
  /** Expander placement when collapsible. @default "start" */
  expanderPosition?: SetNavExpanderPosition;
  /** DOM id. */
  id?: string;
  /** Nav items rendered as semantic list links. */
  items: SetNavItem[];
  /** Accessible nav label. */
  label?: string;
  /** Size variant. @default "md" */
  size?: SetNavSize;
}

/**
 * Builds the IR tree for the Set nav component.
 *
 * @param props - Nav component props.
 * @returns IR node for a nav wrapper.
 */
export function buildSetNav({
  collapsible,
  contentId,
  expanderLabel,
  expanderPosition = "start",
  id,
  items,
  label,
  size = "md",
}: SetNavProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedExpanderLabel = expanderLabel?.trim() || undefined;
  const normalizedContentId = contentId?.trim();

  if (collapsible && !normalizedContentId) {
    throw new Error(
      "contentId must be a non-empty string when collapsible is set.",
    );
  }

  if (normalizedContentId && !isValidHtmlId(normalizedContentId)) {
    throw new Error(
      "contentId must start with a letter and contain only letters, numbers, '_', '-', or ':'.",
    );
  }

  const listItems: SetNode[] = items.map((item) => ({
    kind: "element",
    tag: "li",
    attrs: {},
    children: [
      {
        kind: "element",
        tag: "a",
        attrs: {
          "aria-current": item.current ? "page" : undefined,
          class: "item",
          href: item.href,
        },
        children: [{ kind: "text", value: item.label }],
      },
    ],
  }));

  return {
    kind: "element",
    tag: SET_NAV_TAG_NAME,
    attrs: {
      class: "set-nav",
      "data-collapsible": collapsible,
      "data-expander-label":
        collapsible && normalizedExpanderLabel
          ? normalizedExpanderLabel
          : undefined,
      "data-expander-position": collapsible ? expanderPosition : undefined,
      "data-size": size,
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "nav",
        attrs: {
          "aria-label": label || undefined,
          class: "nav",
        },
        children: [
          {
            kind: "element",
            tag: "div",
            attrs: {
              class: "content",
              id: normalizedContentId,
            },
            children: [
              {
                kind: "element",
                tag: "ul",
                attrs: { class: "list" },
                children: listItems,
              },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Set nav component.
 *
 * Emits semantic `nav > ul > li > a` markup inside a `set-nav` host. When
 * `collapsible` is provided, the renderer emits structural hooks only;
 * interactive expander/menu behavior is deferred to custom element upgrade.
 *
 * @param props - Nav component props.
 * @returns HTML string for a nav wrapper.
 */
export function renderSetNav(props: SetNavProps): string {
  return serializeSetNode(buildSetNav(props));
}

/**
 * Defines the `set-nav` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-nav` hosts upgrade
 * in place and receive collapsible runtime behavior when configured.
 */
export function defineSetNav(): void {
  if (customElements.get(SET_NAV_TAG_NAME)) return;

  class SetNavElement extends HTMLElement {
    #onClick?: (event: Event) => void;
    #mediaQueryList?: MediaQueryList;
    #onKeyDown?: (event: KeyboardEvent) => void;
    #onMediaQueryChange?: (event: MediaQueryListEvent) => void;

    connectedCallback(): void {
      this.#teardownClickListener();
      this.#teardownRuntimeListeners();
      this.#ensureExpander();
      this.#setupClickListener();
      this.#setupRuntimeListeners();
    }

    disconnectedCallback(): void {
      this.#setExpanded(false);
      this.#teardownClickListener();
      this.#teardownRuntimeListeners();
    }

    #getNav(): HTMLElement | null {
      if (!this.hasAttribute("data-collapsible")) return null;

      return this.querySelector<HTMLElement>(".nav");
    }

    #getExpanderButton(): HTMLButtonElement | null {
      return this.querySelector<HTMLButtonElement>(
        '[data-part="expander"] .set-expander',
      );
    }

    #ensureExpander(): void {
      const nav = this.#getNav();

      if (!nav) return;
      if (nav.querySelector('[data-part="expander"]')) return;

      const content = nav.querySelector<HTMLElement>(".content");

      if (!content) return;

      nav.insertAdjacentHTML(
        "afterbegin",
        `<div data-part="expander">${renderSetExpander({
          controlsId: content.id || undefined,
          label: this.getAttribute("data-expander-label") || undefined,
          size: this.getAttribute("data-size") === "sm" ? "md" : "lg",
        })}</div>`,
      );
    }

    #setExpanded(expanded: boolean): void {
      const button = this.#getExpanderButton();

      if (!button) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (isOpen === expanded) return;

      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      this.#setScrollLocked(expanded);
    }

    #setupClickListener(): void {
      this.#onClick = (event: Event) => {
        const target = event.target;

        if (!(target instanceof Element)) return;
        if (!target.closest('[data-part="expander"] .set-expander')) return;

        const button = this.#getExpanderButton();

        if (!button) return;

        this.#setExpanded(button.getAttribute("aria-expanded") !== "true");
      };

      this.addEventListener("click", this.#onClick);
    }

    #setupRuntimeListeners(): void {
      const nav = this.#getNav();
      const windowRef = this.ownerDocument.defaultView;

      if (!nav || !windowRef) return;

      this.#onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" && event.key !== "Esc") return;
        this.#setExpanded(false);
      };

      windowRef.addEventListener("keydown", this.#onKeyDown);

      if (this.getAttribute("data-collapsible") !== "belowTablet") return;
      if (typeof windowRef.matchMedia !== "function") return;

      const mediaQueryList = windowRef.matchMedia("(min-width: 48em)");

      this.#mediaQueryList = mediaQueryList;
      this.#onMediaQueryChange = (event: MediaQueryListEvent) => {
        if (!event.matches) return;
        this.#setExpanded(false);
      };

      mediaQueryList.addEventListener("change", this.#onMediaQueryChange);
    }

    #setScrollLocked(locked: boolean): void {
      const root = this.ownerDocument.documentElement;

      if (!root) return;

      if (locked) {
        root.setAttribute(scrollLockAttr, "");
        return;
      }

      root.removeAttribute(scrollLockAttr);
    }

    #teardownClickListener(): void {
      if (!this.#onClick) return;

      this.removeEventListener("click", this.#onClick);
      this.#onClick = undefined;
    }

    #teardownRuntimeListeners(): void {
      const windowRef = this.ownerDocument.defaultView;

      if (this.#onKeyDown && windowRef) {
        windowRef.removeEventListener("keydown", this.#onKeyDown);
      }

      if (this.#mediaQueryList && this.#onMediaQueryChange) {
        this.#mediaQueryList.removeEventListener(
          "change",
          this.#onMediaQueryChange,
        );
      }

      this.#onKeyDown = undefined;
      this.#onMediaQueryChange = undefined;
      this.#mediaQueryList = undefined;
    }
  }

  customElements.define(SET_NAV_TAG_NAME, SetNavElement);
}

/** Declarative nav contract mirror for tooling, docs, and adapters. */
export const SET_NAV_SPEC: SetComponentSpec = {
  name: "nav",
  description: "Use `nav` to render a primary navigation list.",
  output: { element: SET_NAV_TAG_NAME, class: "set-nav" },
  content: { kind: "structured", prop: "items" },
  props: {
    items: {
      description: "Nav links shown in the list.",
      required: true,
      type: {
        kind: "array",
        itemShape: {
          current: {
            default: false,
            description: 'Emits `aria-current="page"` when true.',
            type: { kind: "boolean" },
          },
          href: {
            description: "Link destination.",
            required: true,
            type: { kind: "string" },
          },
          label: {
            description: "Link label.",
            required: true,
            type: { kind: "text" },
          },
        },
      },
    },
    label: {
      description: "Accessible label for the nav landmark.",
      type: { kind: "string" },
    },
    expanderLabel: {
      description: "Accessible label for the collapsible expander button.",
      type: { kind: "string" },
    },
    expanderPosition: {
      default: "start",
      description: "Where the expander sits within the composition.",
      type: { kind: "enum", values: ["start", "end"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    collapsible: {
      description: "When to collapse the nav behind an expander.",
      type: { kind: "enum", values: ["always", "belowTablet"] },
    },
    contentId: {
      description: "`id` for the collapsible content region.",
      requiredWhen: "`collapsible` is provided",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
  },
  events: {},
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
        attribute: "data-collapsible",
        condition: { kind: "when-provided", prop: "collapsible" },
        value: { kind: "prop", prop: "collapsible" },
      },
      {
        target: { on: "host" },
        attribute: "data-expander-position",
        condition: { kind: "when-provided", prop: "collapsible" },
        value: { kind: "prop", prop: "expanderPosition" },
      },
      {
        target: { on: "host" },
        attribute: "data-expander-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-provided", prop: "collapsible" },
            { kind: "when-non-empty", prop: "expanderLabel" },
          ],
        },
        value: { kind: "prop", prop: "expanderLabel" },
      },
      {
        target: { on: "descendant", selector: "nav" },
        attribute: "aria-label",
        condition: { kind: "when-non-empty", prop: "label" },
        value: { kind: "prop", prop: "label" },
      },
      {
        target: { on: "descendant", selector: "div.content" },
        attribute: "id",
        condition: { kind: "when-provided", prop: "contentId" },
        value: { kind: "prop", prop: "contentId" },
      },
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
    ],
  },
};
