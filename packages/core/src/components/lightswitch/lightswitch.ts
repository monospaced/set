import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import { buildSetIcon, type SetIconName } from "../icon/icon";
import type { SetTheme } from "../root/root";

export const SET_LIGHTSWITCH_TAG_NAME = "set-lightswitch";
export const SET_LIGHTSWITCH_EVENT_CHANGE = "set-lightswitch-change";
export const SET_LIGHTSWITCH_STORAGE_KEY = "set-theme";

const labelDarkDefault = "Switch to dark theme";
const labelLightDefault = "Switch to light theme";

export type SetLightswitchAppearance = "outline" | "solid" | "text";
export type SetLightswitchSize = "sm" | "md" | "lg";

function oppositeTheme(theme: SetTheme): SetTheme {
  return theme === "dark" ? "light" : "dark";
}

function themeIconName(target: SetTheme): SetIconName {
  return target === "dark" ? "moon" : "sunny";
}

export interface SetLightswitchProps {
  /** Structural style of the toggle button. @default "text" */
  appearance?: SetLightswitchAppearance;
  /** DOM id. */
  id?: string;
  /** Accessible label of the switch-to-dark action. @default "Switch to dark theme" */
  labelDark?: string;
  /** Accessible label of the switch-to-light action. @default "Switch to light theme" */
  labelLight?: string;
  /** Size variant. @default "md" */
  size?: SetLightswitchSize;
}

function buildOption(target: SetTheme, label: string): SetNode {
  return {
    kind: "element",
    tag: "span",
    attrs: { class: "option", "data-option": target },
    children: [
      {
        kind: "element",
        tag: "span",
        attrs: { class: "icon-wrapper" },
        children: [
          buildSetIcon({
            ariaHidden: true,
            name: themeIconName(target),
            size: "fill",
          }),
        ],
      },
      {
        kind: "element",
        tag: "span",
        attrs: { class: "label" },
        children: [{ kind: "text", value: label }],
      },
    ],
  };
}

/**
 * Builds the IR tree for the Set lightswitch component.
 *
 * @param props - Lightswitch component props.
 * @returns IR node for a `set-lightswitch` host.
 */
export function buildSetLightswitch({
  appearance = "text",
  id,
  labelDark = labelDarkDefault,
  labelLight = labelLightDefault,
  size = "md",
}: SetLightswitchProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedLabelDark =
    labelDark.trim() === "" ? labelDarkDefault : labelDark;
  const normalizedLabelLight =
    labelLight.trim() === "" ? labelLightDefault : labelLight;

  return {
    kind: "element",
    tag: SET_LIGHTSWITCH_TAG_NAME,
    attrs: {
      class: "set-lightswitch",
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "button",
        attrs: {
          class: "toggle",
          "data-appearance": appearance,
          "data-size": size,
          type: "button",
        },
        children: [
          buildOption("dark", normalizedLabelDark),
          buildOption("light", normalizedLabelLight),
        ],
      },
    ],
  };
}

/**
 * SSR renderer for the Set lightswitch component.
 *
 * Emits an icon-only theme toggle button inside a `set-lightswitch` host. Both
 * actions (switch to dark, switch to light) are rendered; CSS shows the one
 * opposing the resolved theme, driven by `data-set-theme` on the Set root and
 * falling back to `prefers-color-scheme`, so the control is correct before —
 * and without — the runtime.
 *
 * @param props - Lightswitch component props.
 * @returns HTML string for a `set-lightswitch` host.
 */
export function renderSetLightswitch(props: SetLightswitchProps): string {
  return serializeSetNode(buildSetLightswitch(props));
}

/**
 * Defines the `set-lightswitch` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-lightswitch` hosts will
 * upgrade in place.
 *
 * The toggle shows two states but persists three: no stored value follows the
 * system preference, a stored `"light"`/`"dark"` (localStorage
 * `SET_LIGHTSWITCH_STORAGE_KEY`) overrides it. Activation targets the opposite of
 * the current resolved theme; when the target equals the system preference
 * the override is cleared instead of stored, so a value matching the system
 * is never pinned. Storage is only evaluated on user interaction — a system
 * preference change never rewrites the stored value. The theme is applied by
 * setting or removing `data-set-theme` on the closest Set root; the control's
 * face follows via CSS.
 */
export function defineSetLightswitch(): void {
  if (customElements.get(SET_LIGHTSWITCH_TAG_NAME)) return;

  class SetLightswitchElement extends HTMLElement {
    #onClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!target.closest("button")) return;

      const next = oppositeTheme(this.#resolvedTheme());

      if (next === this.#systemTheme()) {
        this.#clearStoredTheme();
      } else {
        this.#storeTheme(next);
      }

      this.#applyTheme();

      this.dispatchEvent(
        new CustomEvent(SET_LIGHTSWITCH_EVENT_CHANGE, {
          bubbles: true,
          detail: { stored: Boolean(this.#storedTheme()), theme: next },
        }),
      );
    };

    connectedCallback(): void {
      this.removeEventListener("click", this.#onClick);
      this.addEventListener("click", this.#onClick);

      if (this.#storedTheme()) {
        this.#applyTheme();
      }
    }

    disconnectedCallback(): void {
      this.removeEventListener("click", this.#onClick);
    }

    #storage(): Storage | undefined {
      try {
        return this.ownerDocument.defaultView?.localStorage;
      } catch {
        return undefined;
      }
    }

    #storedTheme(): SetTheme | undefined {
      try {
        const value = this.#storage()?.getItem(SET_LIGHTSWITCH_STORAGE_KEY);
        return value === "light" || value === "dark" ? value : undefined;
      } catch {
        return undefined;
      }
    }

    #storeTheme(theme: SetTheme): void {
      try {
        this.#storage()?.setItem(SET_LIGHTSWITCH_STORAGE_KEY, theme);
      } catch {
        /* storage unavailable — theme still applies for this page */
      }
    }

    #clearStoredTheme(): void {
      try {
        this.#storage()?.removeItem(SET_LIGHTSWITCH_STORAGE_KEY);
      } catch {
        /* storage unavailable — nothing to clear */
      }
    }

    #systemTheme(): SetTheme {
      const windowRef = this.ownerDocument.defaultView;
      if (!windowRef || typeof windowRef.matchMedia !== "function") {
        return "light";
      }
      return windowRef.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    #root(): Element | null {
      return this.closest(".set");
    }

    #rootTheme(): SetTheme | undefined {
      const value = this.#root()?.getAttribute("data-set-theme");
      return value === "light" || value === "dark" ? value : undefined;
    }

    #resolvedTheme(): SetTheme {
      return this.#storedTheme() ?? this.#rootTheme() ?? this.#systemTheme();
    }

    #applyTheme(): void {
      const root = this.#root();
      if (!root) return;

      const stored = this.#storedTheme();
      if (stored) {
        root.setAttribute("data-set-theme", stored);
      } else {
        root.removeAttribute("data-set-theme");
      }
    }
  }

  customElements.define(SET_LIGHTSWITCH_TAG_NAME, SetLightswitchElement);
}

/** Declarative lightswitch contract mirror for tooling, docs, and adapters. */
export const SET_LIGHTSWITCH_SPEC: SetComponentSpec = {
  name: "lightswitch",
  description:
    "Use `lightswitch` to let users toggle between light and dark themes.",
  output: { element: SET_LIGHTSWITCH_TAG_NAME, class: "set-lightswitch" },
  content: { kind: "none" },
  props: {
    appearance: {
      default: "text",
      description: "Visual appearance of the toggle button.",
      type: { kind: "enum", values: ["outline", "solid", "text"] },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    labelDark: {
      default: labelDarkDefault,
      description: "Accessible label of the switch-to-dark action.",
      type: { kind: "string" },
    },
    labelLight: {
      default: labelLightDefault,
      description: "Accessible label of the switch-to-light action.",
      type: { kind: "string" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md", "lg"] },
    },
  },
  events: {
    [SET_LIGHTSWITCH_EVENT_CHANGE]: {
      bubbles: true,
      description:
        "Fired after activation applies a theme. `detail.theme` is the theme switched to; `detail.stored` is false when the change cleared the override to follow the system preference again.",
    },
  },
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "id",
        condition: { kind: "when-non-empty", prop: "id" },
        value: { kind: "prop", prop: "id" },
      },
      {
        target: { on: "descendant", selector: "button" },
        attribute: "class",
        condition: { kind: "always" },
        value: { kind: "literal", text: "toggle" },
      },
      {
        target: { on: "descendant", selector: "button" },
        attribute: "data-appearance",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "appearance" },
      },
      {
        target: { on: "descendant", selector: "button" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
      },
      {
        target: { on: "descendant", selector: "button" },
        attribute: "type",
        condition: { kind: "always" },
        value: { kind: "literal", text: "button" },
      },
    ],
  },
};
