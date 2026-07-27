import { serializeSetNode, type SetNode } from "../../helpers/node";
import { normalizeOptionalHtmlId } from "../../helpers/string";
import type { SetComponentSpec } from "../../spec";
import type { SetInlineSize, SetStatusTone } from "../../types";
import { renderSetButton } from "../button/button";
import { buildSetIcon } from "../icon/icon";

export const SET_ALERT_TAG_NAME = "set-alert";
export const SET_ALERT_EVENT_BEFORE_DISMISS = "set-alert-before-dismiss";
export const SET_ALERT_EVENT_DISMISS = "set-alert-dismiss";

const dismissibleLabelDefault = "Dismiss alert";

export type SetAlertSize = "sm" | "md";

export interface SetAlertProps {
  /** Whether the runtime custom element should inject a dismiss control. @default false */
  dismissible?: boolean;
  /** Accessible label for the runtime dismiss control. Ignored when not dismissible. @default "Dismiss alert" */
  dismissibleLabel?: string;
  /** DOM id. */
  id?: string;
  /** Inline-size behavior. @default "full" */
  inlineSize?: SetInlineSize;
  /** Alert body text (escaped before render). */
  message: string;
  /** Size variant. @default "md" */
  size?: SetAlertSize;
  /** Semantic message intent. */
  tone?: SetStatusTone;
  /** Optional short heading/title text (escaped before render). */
  title?: string;
}

function createDismissButtonElement(
  dismissibleLabel: string,
  document: Document,
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-part", "close");
  wrapper.innerHTML = renderSetButton({
    appearance: "text",
    icon: "close",
    label: dismissibleLabel,
    labelVisibility: "hidden",
    size: "sm",
    tone: "neutral",
  });
  return wrapper;
}

function getAlertIconName(tone?: SetStatusTone): string {
  switch (tone) {
    case "success":
      return "check-circle";
    case "warning":
      return "error-triangle";
    case "error":
      return "error-circle";
    case "info":
    default:
      return "info-circle";
  }
}

function getAlertRole(tone?: SetStatusTone): "status" | "alert" {
  return tone === "warning" || tone === "error" ? "alert" : "status";
}

/**
 * Builds the IR tree for the Set alert component.
 *
 * @param props - Alert component props.
 * @returns IR node for a `set-alert` host.
 */
export function buildSetAlert({
  dismissible,
  dismissibleLabel = dismissibleLabelDefault,
  id,
  inlineSize = "full",
  message,
  size = "md",
  tone,
  title,
}: SetAlertProps): SetNode {
  const normalizedId = normalizeOptionalHtmlId(id);
  const normalizedDismissibleLabel =
    dismissibleLabel.trim() === "" ? dismissibleLabelDefault : dismissibleLabel;

  const contentChildren: SetNode[] = [];
  if (title) {
    contentChildren.push({
      kind: "element",
      tag: "p",
      attrs: { class: "title" },
      children: [{ kind: "text", value: title }],
    });
  }
  contentChildren.push({
    kind: "element",
    tag: "p",
    attrs: { class: "message" },
    children: [{ kind: "text", value: message }],
  });

  return {
    kind: "element",
    tag: SET_ALERT_TAG_NAME,
    attrs: {
      class: "set-alert",
      "data-dismissible": dismissible,
      "data-dismissible-label": dismissible
        ? normalizedDismissibleLabel
        : undefined,
      "data-inline-size": inlineSize === "fit" ? "fit" : undefined,
      "data-size": size,
      "data-tone": tone || undefined,
      id: normalizedId,
      role: getAlertRole(tone),
    },
    children: [
      {
        kind: "element",
        tag: "div",
        attrs: { class: "icon-wrapper" },
        children: [
          buildSetIcon({
            ariaHidden: true,
            name: getAlertIconName(tone),
            size,
          }),
        ],
      },
      {
        kind: "element",
        tag: "div",
        attrs: { class: "content" },
        children: contentChildren,
      },
    ],
  };
}

/**
 * SSR renderer for the Set alert component.
 *
 * Emits meaningful light-DOM HTML inside a `set-alert` host. When
 * `dismissible` is true, runtime hydration may add a dismiss button and remove
 * the host element when that control is activated, subject to the cancelable
 * before-dismiss event.
 *
 * @param props - Alert component props.
 * @returns HTML string for a `set-alert` host.
 */
export function renderSetAlert(props: SetAlertProps): string {
  return serializeSetNode(buildSetAlert(props));
}

/**
 * Defines the `set-alert` custom element runtime.
 *
 * Safe to call multiple times. Existing SSR-rendered `set-alert` hosts will
 * upgrade in place and, when dismissible, receive an interactive dismiss
 * control in light DOM.
 *
 * Class declaration is nested so importing this module in environments
 * without an `HTMLElement` global (Node-based tooling like the adapter
 * codegen) doesn't throw at load time.
 */
export function defineSetAlert(): void {
  if (customElements.get(SET_ALERT_TAG_NAME)) return;

  class SetAlertElement extends HTMLElement {
    #onClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) return;
      if (!target.closest('[data-part="close"]')) return;

      const beforeDismissEvent = new CustomEvent(
        SET_ALERT_EVENT_BEFORE_DISMISS,
        {
          bubbles: true,
          cancelable: true,
        },
      );

      if (!this.dispatchEvent(beforeDismissEvent)) return;

      this.dispatchEvent(
        new CustomEvent(SET_ALERT_EVENT_DISMISS, {
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

  customElements.define(SET_ALERT_TAG_NAME, SetAlertElement);
}

/** Declarative alert contract mirror for tooling, docs, and adapters. */
export const SET_ALERT_SPEC: SetComponentSpec = {
  name: "alert",
  description: "Use `alert` to surface short, important messages.",
  output: {
    element: SET_ALERT_TAG_NAME,
    class: "set-alert",
  },
  content: {
    kind: "slots",
    slots: [
      { prop: "title", kind: "text" },
      { prop: "message", kind: "text" },
    ],
  },
  props: {
    dismissible: {
      default: false,
      description: "Shows a dismiss control that removes the alert.",
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
    inlineSize: {
      default: "full",
      description: "Whether the alert fills its container or shrinks to fit.",
      type: { kind: "enum", values: ["full", "fit"] },
    },
    message: {
      description: "Body text of the alert.",
      required: true,
      type: { kind: "text" },
    },
    size: {
      default: "md",
      description: "Size variant.",
      type: { kind: "enum", values: ["sm", "md"] },
    },
    title: {
      description: "Bold text above the message.",
      type: { kind: "text" },
    },
    tone: {
      description: "Semantic tone.",
      type: { kind: "enum", values: ["info", "success", "warning", "error"] },
    },
  },
  events: {
    [SET_ALERT_EVENT_BEFORE_DISMISS]: {
      bubbles: true,
      cancelable: true,
      description:
        "Fired before the alert is removed by a dismiss action. Call `preventDefault()` to keep the alert mounted.",
    },
    [SET_ALERT_EVENT_DISMISS]: {
      bubbles: true,
      description:
        "Fired after the alert has been removed by an allowed dismiss action.",
    },
  },
  rules: {
    attributes: [
      {
        target: { on: "host" },
        attribute: "data-tone",
        condition: { kind: "when-provided", prop: "tone" },
        value: { kind: "prop", prop: "tone" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: {
          kind: "when-in",
          prop: "tone",
          values: ["warning", "error"],
        },
        value: { kind: "literal", text: "alert" },
      },
      {
        target: { on: "host" },
        attribute: "role",
        condition: {
          kind: "not",
          of: {
            kind: "when-in",
            prop: "tone",
            values: ["warning", "error"],
          },
        },
        value: { kind: "literal", text: "status" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible",
        condition: { kind: "when-truthy", prop: "dismissible" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "dismissible" },
            { kind: "when-non-empty", prop: "dismissibleLabel" },
          ],
        },
        value: { kind: "prop", prop: "dismissibleLabel" },
      },
      {
        target: { on: "host" },
        attribute: "data-dismissible-label",
        condition: {
          kind: "all",
          of: [
            { kind: "when-truthy", prop: "dismissible" },
            {
              kind: "not",
              of: { kind: "when-non-empty", prop: "dismissibleLabel" },
            },
          ],
        },
        value: { kind: "literal", text: dismissibleLabelDefault },
      },
      {
        target: { on: "host" },
        attribute: "data-inline-size",
        condition: { kind: "when-equals", prop: "inlineSize", to: "fit" },
        value: { kind: "literal", text: "fit" },
      },
      {
        target: { on: "host" },
        attribute: "data-size",
        condition: { kind: "always" },
        value: { kind: "prop", prop: "size" },
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
