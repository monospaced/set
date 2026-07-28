// Reads tdesign-icons-svg source SVGs and emits a typed icon registry
// consumed by packages/core/src/components/icon/icon.ts.
//
// Filters applied:
//   - `-filled.svg`   (duotone/filled variants — we ship line only)
//   - `logo-*`        (brand marks)
//   - `numbers-*`, `letters-*` (typographic glyphs, not iconography)
//
// The generated module is checked in so consumers don't have to run this at
// install-time. Re-run with `pnpm --filter @monospaced/set-core icons:generate`
// when tdesign-icons-svg is upgraded.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = resolve(
  __dirname,
  "..",
  "node_modules",
  "tdesign-icons-svg",
  "src",
);
const OUT_FILE = resolve(
  __dirname,
  "..",
  "src",
  "components",
  "icon",
  "icons.generated.ts",
);

const EXCLUDE_PREFIXES = ["logo-", "numbers-", "letters-"];
const EXCLUDE_SUFFIX = "-filled.svg";

// Attributes we drop from every element:
//   - `id`         — collides across multiple icon instances on a page
//   - `class`      — TDesign adds `t-icon t-icon-<name>`, we set our own class
//   - `clip-path`  — refs `#clip0_*` defs that don't exist in the source
//                    (dead reference; would only add DOM noise)
const DROP_ATTRS = new Set(["id", "class", "clip-path"]);

// Per-path attribute values that are uniform across the entire catalog and
// so are hoisted to the root <svg> in icon.ts. Any path with these exact
// values has the attribute stripped here to keep the bundle small; any path
// that overrides one keeps its per-path attr and wins via CSS specificity /
// SVG attribute cascade.
const HOISTED_ATTRS = {
  stroke: "currentColor",
  "stroke-width": "2",
};

/** @typedef {{ tag: string; attrs: Record<string, string>; children?: IconNode[] }} IconNode */

/**
 * Extremely small XML tokenizer tailored to TDesign's SVG output.
 * TDesign SVGs are single-line, use paired open/close tags (never
 * self-closing), and use double-quoted attribute values. This keeps the
 * script dependency-free.
 */
function parseChildren(source, start = 0) {
  /** @type {IconNode[]} */
  const nodes = [];
  let i = start;

  while (i < source.length) {
    // skip whitespace
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    if (source[i] !== "<") {
      throw new Error(`Unexpected char at ${i}: ${source.slice(i, i + 30)}`);
    }

    // Close tag → end of current children list
    if (source[i + 1] === "/") {
      return { nodes, end: i };
    }

    // Read open tag
    const openEnd = source.indexOf(">", i);
    if (openEnd === -1) throw new Error("Unterminated tag");
    const rawOpen = source.slice(i + 1, openEnd);
    const isSelfClosing = rawOpen.endsWith("/");
    const openBody = isSelfClosing ? rawOpen.slice(0, -1).trim() : rawOpen;

    // First token is the tag name
    const spaceIdx = openBody.search(/\s/);
    const tag = spaceIdx === -1 ? openBody : openBody.slice(0, spaceIdx);
    const attrString = spaceIdx === -1 ? "" : openBody.slice(spaceIdx + 1);
    const attrs = parseAttrs(attrString);

    i = openEnd + 1;

    /** @type {IconNode} */
    const node = { tag, attrs };

    if (!isSelfClosing) {
      const { nodes: kids, end } = parseChildren(source, i);
      if (kids.length > 0) node.children = kids;
      // consume close tag </tag>
      const closeEnd = source.indexOf(">", end);
      if (closeEnd === -1) throw new Error(`Unterminated close for <${tag}>`);
      i = closeEnd + 1;
    }

    nodes.push(node);
  }

  return { nodes, end: i };
}

function parseAttrs(str) {
  /** @type {Record<string, string>} */
  const attrs = {};
  const re = /([a-zA-Z_:][\w:.-]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

/**
 * Extract the top-level children of the root <svg>, cleaned up:
 *   - normalise `view-box` → `viewBox` (TDesign ships an XML-invalid form)
 *   - strip attributes in DROP_ATTRS
 *   - drop nodes with `fill="transparent"` and no stroke — TDesign ships
 *     these as duplicate hit-area paths alongside every stroked shape;
 *     they render nothing in decorative icons and add ~18% to the bundle
 *   - drop empty children arrays
 */
function extractChildren(svgSource) {
  const { nodes } = parseChildren(svgSource);
  if (nodes.length !== 1 || nodes[0].tag !== "svg") {
    throw new Error("Expected a single <svg> root");
  }
  const svgChildren = nodes[0].children ?? [];
  return svgChildren.map(cleanNode).filter(pruneEmpty);
}

function isInvisibleFillNode(node) {
  return node.attrs.fill === "transparent" && !("stroke" in node.attrs);
}

function pruneEmpty(node) {
  if (isInvisibleFillNode(node)) return false;
  if (node.children) {
    node.children = node.children.filter(pruneEmpty);
    if (node.children.length === 0) delete node.children;
  }
  // Group nodes with no attrs and no children serve no purpose after pruning.
  if (
    node.tag === "g" &&
    Object.keys(node.attrs).length === 0 &&
    !node.children
  ) {
    return false;
  }
  return true;
}

function cleanNode(node) {
  /** @type {Record<string, string>} */
  const attrs = {};
  for (const [key, value] of Object.entries(node.attrs)) {
    if (DROP_ATTRS.has(key)) continue;
    if (HOISTED_ATTRS[key] === value) continue;
    const outKey = key === "view-box" ? "viewBox" : key;
    attrs[outKey] = value;
  }
  const out = { tag: node.tag, attrs };
  if (node.children) out.children = node.children.map(cleanNode);
  return out;
}

function shouldInclude(filename) {
  if (!filename.endsWith(".svg")) return false;
  if (filename.endsWith(EXCLUDE_SUFFIX)) return false;
  if (EXCLUDE_PREFIXES.some((p) => filename.startsWith(p))) return false;
  return true;
}

function toName(filename) {
  return filename.slice(0, -".svg".length);
}

function main() {
  const files = readdirSync(SRC_DIR).filter(shouldInclude).sort();

  /** @type {Record<string, IconNode[]>} */
  const registry = {};
  for (const file of files) {
    const svg = readFileSync(join(SRC_DIR, file), "utf8");
    registry[toName(file)] = extractChildren(svg);
  }

  const body = JSON.stringify(registry, null, 2);
  const contents = `// Generated by scripts/generate-icons.mjs — do not edit directly.
// Regenerate with \`pnpm --filter @monospaced/set-core icons:generate\`.

export interface TdesignIconNode {
  tag: string;
  attrs: Record<string, string>;
  children?: TdesignIconNode[];
}

export const TDESIGN_ICONS: Record<string, TdesignIconNode[]> = ${body};
`;

  writeFileSync(OUT_FILE, contents);
  console.log(
    `Wrote ${Object.keys(registry).length} icons → ${OUT_FILE.replace(process.cwd() + "/", "")}`,
  );
}

main();
