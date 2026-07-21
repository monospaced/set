import { type SetNode, serializeSetNode } from "@monospaced/set-core";
import {
  createElement,
  type DOMAttributes,
  Fragment,
  type ReactNode,
  type Ref,
} from "react";

/**
 * HTML-canonical attribute names React renames. `aria-*` / `data-*` are
 * pass-through. Small, hand-maintained; add entries when SSR-parity tests
 * or React dev warnings surface a miss.
 */
const ATTR_NAME_MAP: Readonly<Record<string, string>> = {
  autocomplete: "autoComplete",
  class: "className",
  for: "htmlFor",
  readonly: "readOnly",
  spellcheck: "spellCheck",
  srcset: "srcSet",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-width": "strokeWidth",
  tabindex: "tabIndex",
};

// Form-control tags. Caller event handlers route to these descendants
// rather than the wrapper so React's controlled-input checks fire on the
// right element.
const PRIMARY_CONTROL_TAGS = new Set(["input", "textarea", "select"]);

/**
 * Native attrs a Set React wrapper forwards to the root element:
 * React's `DOMAttributes` surface (event handlers, minus `children` and
 * `dangerouslySetInnerHTML`) plus `ref` and `autoFocus`. Everything else
 * (class, data-*, aria-*, id, href, disabled, …) is owned by core's SPEC.
 * The generic element-specialises event handler types.
 */
export type NativeAttrsFor<E extends Element> = Omit<
  DOMAttributes<E>,
  "children" | "dangerouslySetInnerHTML"
> & {
  ref?: Ref<E>;
  autoFocus?: boolean;
};

/**
 * Convert a Set IR attr record into React props. `false` is kept
 * for HTML boolean attrs (so React sees `checked={false}` as controlled,
 * not absent) but dropped for `data-*`/`aria-*` (matches SSR omit). `true`
 * on `data-*` becomes `""` so React renders the bare attribute.
 */
function toReactProps(
  attrs: Record<string, string | boolean | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    if (
      value === false &&
      (key.startsWith("data-") || key.startsWith("aria-"))
    ) {
      continue;
    }
    const reactKey = ATTR_NAME_MAP[key] ?? key;
    out[reactKey] = value === true && key.startsWith("data-") ? "" : value;
  }
  return out;
}

function collectPrimaryControls(node: SetNode): SetNode[] {
  const out: SetNode[] = [];
  const visit = (n: SetNode): void => {
    if (n.kind !== "element") return;
    if (PRIMARY_CONTROL_TAGS.has(n.tag)) out.push(n);
    for (const child of n.children) visit(child);
  };
  visit(node);
  return out;
}

type SplitExtras = {
  rootExtras: Record<string, unknown>;
  primaryFirstExtras: Record<string, unknown>;
  primaryRestExtras: Record<string, unknown>;
};

// `ref` stays on the wrapper; control extras route to every primary control;
// `autoFocus` lands on the first primary only.
function splitExtras(extras: Record<string, unknown>): SplitExtras {
  const rootExtras: Record<string, unknown> = {};
  const controlExtras: Record<string, unknown> = {};
  let autoFocus: unknown;
  for (const [key, value] of Object.entries(extras)) {
    if (value === undefined) continue;
    if (key === "ref") rootExtras[key] = value;
    else if (key === "autoFocus") autoFocus = value;
    else controlExtras[key] = value;
  }
  const primaryFirstExtras =
    autoFocus !== undefined
      ? { autoFocus, ...controlExtras }
      : { ...controlExtras };
  return { rootExtras, primaryFirstExtras, primaryRestExtras: controlExtras };
}

type RenderCtx = {
  slots: Record<string, ReactNode>;
  primaries: SetNode[];
  primaryFirstExtras: Record<string, unknown>;
  primaryRestExtras: Record<string, unknown>;
};

function extrasForNode(node: SetNode, ctx: RenderCtx): Record<string, unknown> {
  if (ctx.primaries.length === 0) return {};
  const idx = ctx.primaries.indexOf(node);
  if (idx === 0) return ctx.primaryFirstExtras;
  if (idx > 0) return ctx.primaryRestExtras;
  return {};
}

function buildElementProps(
  node: Extract<SetNode, { kind: "element" }>,
  extras: Record<string, unknown>,
  ctx: RenderCtx,
): { props: Record<string, unknown>; children: ReactNode[] | null } {
  const props: Record<string, unknown> = {
    ...toReactProps(node.attrs),
    ...extras,
  };
  // React's `<textarea>` takes content via `defaultValue` / `value`, not
  // children. Core emits SSR content as a text child; preserve controlled
  // `value` when the wrapper supplied one, otherwise use the child as the
  // uncontrolled initial value.
  if (node.tag === "textarea" && node.children.length > 0) {
    const content = node.children
      .map((child) => (child.kind === "text" ? child.value : ""))
      .join("");
    if (!("value" in props) && content.length > 0) props.defaultValue = content;
    return { props, children: null };
  }
  const hasUnmatchedRaw = node.children.some(
    (child) => child.kind === "raw" && !(child.html in ctx.slots),
  );
  if (hasUnmatchedRaw) {
    // React forbids mixing `dangerouslySetInnerHTML` with `children`, so when
    // any child is unmatched raw HTML we serialize every sibling into a
    // single HTML string. Wrappers must avoid placing slot sentinels
    // alongside unrelated raw HTML siblings.
    props.dangerouslySetInnerHTML = {
      __html: node.children.map(serializeSetNode).join(""),
    };
    return { props, children: null };
  }
  const children = node.children.map((child, index) => {
    if (child.kind === "raw" && child.html in ctx.slots) {
      return createElement(Fragment, { key: index }, ctx.slots[child.html]);
    }
    return renderNode(child, index, ctx);
  });
  return { props, children };
}

function renderNode(
  node: SetNode,
  key: number | undefined,
  ctx: RenderCtx,
): ReactNode {
  if (node.kind === "text") {
    if (node.value in ctx.slots) {
      return createElement(Fragment, { key }, ctx.slots[node.value]);
    }
    return node.value;
  }
  if (node.kind === "raw") {
    if (node.html in ctx.slots) {
      return createElement(Fragment, { key }, ctx.slots[node.html]);
    }
    // Raw nodes should be handled by the parent element. If a raw node
    // appears at the top level, wrap it in a fragment-like span.
    return createElement("span", {
      key,
      dangerouslySetInnerHTML: { __html: node.html },
    });
  }
  const { props, children } = buildElementProps(
    node,
    extrasForNode(node, ctx),
    ctx,
  );
  if (key !== undefined) props.key = key;
  return children === null
    ? createElement(node.tag, props)
    : createElement(node.tag, props, ...children);
}

/**
 * Render a Set IR tree as React elements. `rootExtras` holds caller
 * passthrough props (event handlers, `ref`, `autoFocus`); these route to
 * the inner form control when the tree contains one (see `splitExtras`),
 * otherwise they land on the root. `slots` substitutes named sentinel
 * children with ReactNodes (e.g. `Page`).
 */
export function reactify(
  node: SetNode,
  rootExtras: Record<string, unknown> = {},
  slots: Record<string, ReactNode> = {},
): ReactNode {
  if (node.kind !== "element") {
    const ctx: RenderCtx = {
      slots,
      primaries: [],
      primaryFirstExtras: {},
      primaryRestExtras: {},
    };
    return createElement(Fragment, null, renderNode(node, undefined, ctx));
  }
  const primaries = collectPrimaryControls(node);
  const split: SplitExtras =
    primaries.length > 0
      ? splitExtras(rootExtras)
      : {
          rootExtras,
          primaryFirstExtras: {},
          primaryRestExtras: {},
        };
  const ctx: RenderCtx = {
    slots,
    primaries,
    primaryFirstExtras: split.primaryFirstExtras,
    primaryRestExtras: split.primaryRestExtras,
  };
  const { props, children } = buildElementProps(node, split.rootExtras, ctx);
  return children === null
    ? createElement(node.tag, props)
    : createElement(node.tag, props, ...children);
}

/**
 * Picks the subset of caller props the adapter forwards through reactify:
 * `ref`, `autoFocus`, controlled `value`, and any `on*` event handler.
 */
export function pickNativeExtras(
  source: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    if (
      key === "ref" ||
      key === "autoFocus" ||
      key === "value" ||
      key.startsWith("on")
    ) {
      out[key] = value;
    }
  }
  return out;
}
