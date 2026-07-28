import deepmerge from "deepmerge";
import type { Element, Root } from "hast";
import type { Schema } from "hast-util-sanitize";
import rehypeColorChips from "rehype-color-chips";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

// Allowances for `rehype-highlight` (hljs class names) and
// `rehype-color-chips` (chip class + inline background-color style).
// Required for those plugins' output to survive sanitization.
export const sanitizeSchema: Schema = deepmerge(defaultSchema, {
  attributes: {
    code: ["className", /^language-./],
    span: [
      ["className", /(^hljs-.)|(gfm-color-chip)/],
      ["style", /^background-color./],
    ],
  },
  // `remark-gfm` already prefixes footnote IDs with `user-content-`; applying
  // the sanitize default again breaks the generated href/id pairs.
  clobberPrefix: "",
}) as Schema;

export const sanitizeInlineSchema: Schema = {
  ...sanitizeSchema,
  tagNames: ["a", "b", "br", "code", "cite", "del", "em", "i", "strong", "sup"],
};

// Make fenced code blocks keyboard-focusable so users can scroll overflowing code.
const rehypeAccessibleCodeBlocks = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName !== "pre") return;
    const code = node.children.find(
      (child): child is Element =>
        child.type === "element" && child.tagName === "code",
    );
    if (code) {
      code.properties = { ...(code.properties ?? {}), tabIndex: 0 };
    }
  });
};

export const processMarkdown = (markdown: string): string =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(rehypeColorChips)
      .use(rehypeHighlight)
      .use(rehypeAccessibleCodeBlocks)
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeStringify)
      .processSync(markdown),
  );

export const processMarkdownInline = (markdown: string): string =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, sanitizeInlineSchema)
      .use(rehypeStringify)
      .processSync(markdown),
  );
