import type {
  SetComponentSpec,
  SetComponentSpecProp,
  SetSpecPropType,
} from "@monospaced/set-core";
import * as core from "@monospaced/set-core";
import { act, type ComponentType, createElement, type Ref } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import * as adapter from "../index";

// -----------------------------------------------------------------------------
// SSR-parity sweep.
//
// For every SET_*_SPEC, render the generated React wrapper with a
// SPEC-synthesized fixture and assert the DOM matches `renderSet*`.
// Catches walker regressions and SSR drift; grows with core automatically.
// -----------------------------------------------------------------------------

function pascal(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase() + p.slice(1))
    .join("");
}

function toElement(html: string): Element {
  const container = document.createElement("div");
  container.innerHTML = html;
  const child = container.firstElementChild;
  if (!child) throw new Error(`No element in html: ${html}`);
  return child;
}

/**
 * React 19 hoists resource-preload `<link>` tags into the output when it
 * encounters `<img src>` and similar. Core doesn't emit these hints —
 * they're outside the component's rendered DOM — so strip them before
 * comparing.
 */
function stripReactPreloadHints(html: string): string {
  return html.replace(/<link\b[^>]*\brel="preload"[^>]*\/?>/gi, "");
}

type Audience = "core" | "react";

/**
 * Synthesize a minimum-valid value for a SPEC prop type. For `html`-kind
 * props, core and React need different shapes: core takes a trusted raw
 * HTML string; React takes a ReactNode that renders the equivalent.
 */
function synthesize(
  type: SetSpecPropType,
  propName: string,
  audience: Audience,
  options: {
    minArrayLength?: number;
    uniqueItemFields?: ReadonlyArray<string>;
  } = {},
): unknown {
  switch (type.kind) {
    case "string":
      if (propName === "id" || propName.endsWith("Id")) return "set-test-id";
      return "x";
    case "text":
      return "x";
    case "html":
      return audience === "core"
        ? "<span>x</span>"
        : createElement("span", null, "x");
    case "boolean":
      return true;
    case "number":
      return type.min ?? 0;
    case "enum":
      return type.values[0]!;
    case "iconName":
      return "swap";
    case "array": {
      const count = Math.max(1, options.minArrayLength ?? 1);
      const unique = new Set(options.uniqueItemFields ?? []);
      const items: Array<Record<string, unknown>> = [];
      for (let i = 0; i < count; i++) {
        const item: Record<string, unknown> = {};
        for (const [k, p] of Object.entries(type.itemShape)) {
          if (p.required || p.default === undefined) {
            const value = synthesize(p.type, k, audience);
            item[k] = unique.has(k) ? `${value}-${i}` : value;
          }
        }
        items.push(item);
      }
      return items;
    }
    case "union":
      return synthesize(type.variants[0]!, propName, audience);
  }
}

/** Per-component overrides to satisfy runtime validation core performs. */
const FIXTURE_OVERRIDES: Record<
  string,
  {
    minArrayLength?: Partial<Record<string, number>>;
    uniqueItemFields?: Partial<Record<string, ReadonlyArray<string>>>;
    extra?: (audience: Audience) => Record<string, unknown>;
  }
> = {
  radios: {
    // Core rejects <2 options and requires unique values across items.
    minArrayLength: { radios: 2 },
    uniqueItemFields: { radios: ["value"] },
  },
};

/** Build a minimal required-props-only fixture for a SPEC. */
function fixtureFor(
  spec: SetComponentSpec,
  audience: Audience,
): Record<string, unknown> {
  const override = FIXTURE_OVERRIDES[spec.name];
  const out: Record<string, unknown> = {};
  for (const [name, prop] of Object.entries(spec.props) as Array<
    [string, SetComponentSpecProp]
  >) {
    if (!prop.required) continue;
    out[name] = synthesize(prop.type, name, audience, {
      minArrayLength: override?.minArrayLength?.[name],
      uniqueItemFields: override?.uniqueItemFields?.[name],
    });
  }
  if (override?.extra) Object.assign(out, override.extra(audience));
  return out;
}

const adapterRegistry = adapter as unknown as Record<
  string,
  ComponentType<Record<string, unknown>>
>;
const coreRegistry = core as unknown as Record<
  string,
  (props: Record<string, unknown>) => string
>;

const specs: ReadonlyArray<SetComponentSpec> = Object.entries(core)
  .filter(([key]) => key.startsWith("SET_") && key.endsWith("_SPEC"))
  .map(([, value]) => value as SetComponentSpec)
  .sort((a, b) => a.name.localeCompare(b.name));

describe("generated React wrappers match core SSR DOM", () => {
  for (const spec of specs) {
    const Pascal = pascal(spec.name);
    const Wrapper = adapterRegistry[Pascal];
    const renderCore = coreRegistry[`renderSet${Pascal}`];
    const hasWrapper = typeof Wrapper === "function";
    const hasRenderer = typeof renderCore === "function";

    it(spec.name, () => {
      expect(hasWrapper).toBe(true);
      expect(hasRenderer).toBe(true);
      if (!hasWrapper || !hasRenderer) return;

      const coreHtml = renderCore(fixtureFor(spec, "core"));
      const reactHtml = stripReactPreloadHints(
        renderToStaticMarkup(<Wrapper {...fixtureFor(spec, "react")} />),
      );
      const coreEl = toElement(coreHtml);
      const reactEl = toElement(reactHtml);
      if (!reactEl.isEqualNode(coreEl)) {
        throw new Error(
          `${spec.name} DOM mismatch\n  core:  ${coreHtml}\n  react: ${reactHtml}`,
        );
      }
    });
  }
});

// -----------------------------------------------------------------------------
// Custom-element upgrade.
//
// For every `set-*` host, mount the wrapper client-side and assert
// `customElements.get(tagName)` resolves — exercises the `defineSet*()`
// useEffect layer.
// -----------------------------------------------------------------------------

function customElementTagOf(spec: SetComponentSpec): string | undefined {
  const element = spec.output.element;
  if (typeof element !== "string") return undefined;
  if (!element.startsWith("set-")) return undefined;
  return element;
}

async function mountWrapper<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  props: P,
): Promise<{ container: HTMLElement; unmount: () => Promise<void> }> {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<Component {...props} />);
  });
  return {
    container,
    async unmount() {
      await act(async () => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("generated React wrappers register custom elements on mount", () => {
  for (const spec of specs) {
    const tagName = customElementTagOf(spec);
    if (!tagName) continue;
    const Pascal = pascal(spec.name);
    const Wrapper = adapterRegistry[Pascal];

    it(spec.name, async () => {
      const { unmount } = await mountWrapper(
        Wrapper,
        fixtureFor(spec, "react"),
      );
      try {
        expect(customElements.get(tagName)).toBeTypeOf("function");
      } finally {
        await unmount();
      }
    });
  }
});

// -----------------------------------------------------------------------------
// Custom events + ref merge.
//
// For every SPEC with events, mount with mock `on<Action>` handlers and a
// caller callback ref. Dispatch each event on the host, assert the handler
// fired; assert the caller ref received the host (merged-ref pattern).
// -----------------------------------------------------------------------------

describe("generated React wrappers wire custom events + caller refs", () => {
  for (const spec of specs) {
    const tagName = customElementTagOf(spec);
    if (!tagName) continue;
    const events = Object.entries(spec.events);
    if (events.length === 0) continue;
    const Pascal = pascal(spec.name);
    const Wrapper = adapterRegistry[Pascal];

    it(spec.name, async () => {
      const handlers = new Map<string, ReturnType<typeof vi.fn>>();
      const handlerProps: Record<string, unknown> = {};
      for (const [eventName] of events) {
        const action = eventName.slice(`set-${spec.name}-`.length);
        const handlerProp = `on${pascal(action)}`;
        const mock = vi.fn();
        handlers.set(eventName, mock);
        handlerProps[handlerProp] = mock;
      }
      let capturedRef: Element | null = null;
      handlerProps.ref = ((node: Element | null) => {
        capturedRef = node;
      }) as Ref<Element>;

      const { container, unmount } = await mountWrapper(Wrapper, {
        ...fixtureFor(spec, "react"),
        ...handlerProps,
      });
      try {
        const host = container.querySelector(tagName);
        if (!(host instanceof HTMLElement)) {
          throw new Error(`${spec.name}: host <${tagName}> not found`);
        }
        expect(capturedRef).toBe(host);

        for (const [eventName, mock] of handlers) {
          await act(async () => {
            host.dispatchEvent(
              new CustomEvent(eventName, {
                bubbles: true,
                cancelable: true,
                detail: {},
              }),
            );
          });
          expect(mock, `handler for ${eventName}`).toHaveBeenCalledOnce();
        }
      } finally {
        await unmount();
      }
    });
  }
});
