/**
 * Intermediate representation for rendered markup.
 *
 * Core renderers produce a `SetNode` tree which can be either:
 * - serialized to an HTML string for SSR/Web Components, or
 * - walked by a framework adapter (e.g. React) to produce native elements.
 */
export type SetNode =
  | {
      kind: "element";
      tag: string;
      attrs: Record<string, string | boolean | undefined>;
      children: SetNode[];
    }
  | { kind: "text"; value: string }
  | { kind: "raw"; html: string };

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function serializeAttrs(
  record: Record<string, string | boolean | undefined>,
): string {
  return Object.entries(record)
    .flatMap(([key, value]) => {
      if (value === false || value == null) return [];
      if (value === true) return [key];
      return [`${key}="${escapeHtml(String(value))}"`];
    })
    .join(" ");
}

/** Serializes a `SetNode` tree to an HTML string. */
export function serializeSetNode(node: SetNode): string {
  if (node.kind === "text") return escapeHtml(node.value);
  if (node.kind === "raw") return node.html;
  const attrString = serializeAttrs(node.attrs);
  const open = attrString ? `<${node.tag} ${attrString}>` : `<${node.tag}>`;
  if (VOID_ELEMENTS.has(node.tag)) return open;
  const inner = node.children.map(serializeSetNode).join("");
  return `${open}${inner}</${node.tag}>`;
}
