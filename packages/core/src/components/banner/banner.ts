import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetStatusTone } from "../../types";
import { renderSetButton } from "../button/button";
import { buildSetLink } from "../link/link";

export const SET_BANNER_TAG_NAME = "set-banner";
export const SET_BANNER_EVENT_BEFORE_DISMISS = "set-banner-before-dismiss";
export const SET_BANNER_EVENT_DISMISS = "set-banner-dismiss";

const dismissibleLabelDefault = "Dismiss banner";

export interface SetBannerProps {
  /** URL for an optional secondary link action rendered inline within the message.
   * Must be provided together with `actionLabel`. */
  actionHref?: string;
  /** Text label for an optional secondary link action rendered inline within the message.
   * Must be provided together with `actionHref`. */
  actionLabel?: string;
  /** Whether the runtime custom element should inject a dismiss control. @default true */
  dismissible?: boolean;
  /** Accessible label for the runtime dismiss control. Ignored when not dismissible.
   * @default "Dismiss banner" */
  dismissibleLabel?: string;
  /** DOM id. */
  id?: string;
  /** Banner body text (escaped before render). */
  message: string;
  /** Semantic message intent. */
  tone?: SetStatusTone;
}

function createDismissButtonElement(
  dismissibleLabel: string,
  document: Document,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-part", "close");
  wrapper.innerHTML = renderSetButton({
    appearance: "text",
    icon: "X",
    label: dismissibleLabel,
    labelVisibility: "hidden",
    size: "sm",
    tone: "neutral",
  });
  return wrapper;
}

/**
 * Builds the IR tree for the Set banner component.
 *
 * @param props - Banner component props.
 * @returns IR node for a `set-banner` host.
 */
export function buildSetBanner({
  actionHref,
  actionLabel,
  dismissible = true,
  dismissibleLabel = dismissibleLabelDefault,
  id,
  message,
  tone,
}: SetBannerProps): SetNode {
  if (Boolean(actionHref) !== Boolean(actionLabel)) {
    throw new Error("actionHref and actionLabel must be provided together.");
  }

  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === "" ? dismissibleLabelDefault : dismissibleLabel;

  const messageChildren: SetNode[] = [{ kind: "text", value: message }];

  if (actionHref && actionLabel) {
    messageChildren.push({ kind: "text", value: " " });
    messageChildren.push(
      buildSetLink({
        href: actionHref,
        label: actionLabel,
        underline: true,
      }),
    );
  }

  return {
    kind: "element",
    tag: SET_BANNER_TAG_NAME,
    attrs: {
      class: "set-banner",
      "data-set-content-theme": "dark",
      "data-set-surface": "default",
      "data-dismissible": dismissible,
      "data-dismissible-label": dismissible
        ? normalizedDismissibleLabel
        : undefined,
      "data-tone": tone || undefined,
      id: normalizedId,
    },
    children: [
      {
        kind: "element",
        tag: "p",
        attrs: { class: "message" },
        children: messageChildren,
      },
    ],
  };
}

/**
 * SSR renderer for the Set banner component.
 *
 * Emits meaningful light-DOM HTML inside a `set-banner` host. When
 * `dismissible` is true, runtime hydration may add a dismiss button and remove
 * the host element when that control is activated, subject to the cancelable
 * before-dismiss event.
 *
 * @param props - Banner component props.
 * @returns HTML string for a `set-banner` host.
 */
export function renderSetBanner(props: SetBannerProps): string {
  return serializeSetNode(buildSetBanner(props));
}

/**
 * Defines the `set-banner` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-banner` hosts will
 * upgrade in place and, when dismissible, receive an interactive dismiss
 * control in light DOM.
 */
export function defineSetBanner(): void {
  if (customElements.get(SET_BANNER_TAG_NAME)) return;

  class SetBannerElement extends HTMLElement {
    #onClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!target.closest('[data-part="close"]')) return;

      const beforeDismissEvent = new CustomEvent(
        SET_BANNER_EVENT_BEFORE_DISMISS,
        {
          bubbles: true,
          cancelable: true,
        },
      );

      if (!this.dispatchEvent(beforeDismissEvent)) return;

      this.dispatchEvent(
        new CustomEvent(SET_BANNER_EVENT_DISMISS, {
          bubbles: true,
        }),
      );
      this.remove();
    };

    connectedCallback(): void {
      this.removeEventListener("click", this.#onClick);

      if (!this.hasAttribute("data-dismissible")) return;

      this.#ensureDismissControl();
      this.addEventListener("click", this.#onClick);
    }

    disconnectedCallback(): void {
      this.removeEventListener("click", this.#onClick);
    }

    #ensureDismissControl(): void {
      if (this.querySelector('[data-part="close"]')) return;

      this.append(
        createDismissButtonElement(
          this.getAttribute("data-dismissible-label") ??
            dismissibleLabelDefault,
          this.ownerDocument,
        ),
      );
    }
  }

  customElements.define(SET_BANNER_TAG_NAME, SetBannerElement);
}

/** Declarative banner contract mirror for tooling, docs, and adapters. */
export const SET_BANNER_SPEC: SetComponentSpec = {
  name: "banner",
  description: "Use `banner` to display a prominent site-wide message.",
  output: { element: SET_BANNER_TAG_NAME, class: "set-banner" },
  content: { kind: "text", prop: "message" },
  props: {
    actionHref: {
      description:
        "URL for an inline link action rendered after the `message`.",
      requiredWhen: "`actionLabel` is provided",
      type: { kind: "string" },
    },
    actionLabel: {
      description:
        "Text label for an inline link action rendered after the `message`.",
      requiredWhen: "`actionHref` is provided",
      type: { kind: "text" },
    },
    dismissible: {
      default: true,
      description: "Shows a dismiss control that removes the banner.",
      type: { kind: "boolean" },
    },
    dismissibleLabel: {
      default: dismissibleLabelDefault,
      description: "Accessible label for the dismiss control.",
      ignoredWhen: "`dismissible` is false",
      type: { kind: "string" },
    },
    id: {
      description: "DOM id.",
      type: { kind: "string" },
    },
    message: {
      description: "Body text of the banner.",
      required: true,
      type: { kind: "text" },
    },
    tone: {
      description: "Semantic tone.",
      type: {
        kind: "enum",
        values: ["info", "success", "warning", "error"],
      },
    },
  },
  events: {
    [SET_BANNER_EVENT_BEFORE_DISMISS]: {
      bubbles: true,
      cancelable: true,
      description:
        "Fired before the banner is removed by a dismiss action. Call `preventDefault()` to keep the banner mounted.",
    },
    [SET_BANNER_EVENT_DISMISS]: {
      bubbles: true,
      description:
        "Fired after the banner has been removed by an allowed dismiss action.",
    },
  },
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-set-content-theme",
        condition: { kind: "always" },
        value: { kind: "literal", text: "dark" },
      },
      {
        target: { on: "host" },
        attribute: "data-set-surface",
        condition: { kind: "always" },
        value: { kind: "literal", text: "default" },
      },
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-provided", prop: "tone" },
        value: { kind: "prop", prop: "tone" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible",
        condition: { kind: "when-truthy", prop: "dismissible" },
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
