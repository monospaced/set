import { describe, expect, it } from "vitest";

import { processMarkdown, processMarkdownInline } from "./index.js";

describe("processMarkdown", () => {
  it("preserves syntax-highlighting classes on fenced code", () => {
    const out = processMarkdown("```js\nconst x = 1;\n```");

    expect(out).toContain("hljs");
    expect(out).toContain("language-js");
  });

  it("preserves GFM footnote href/id pairs after sanitization", () => {
    const out = processMarkdown(
      "Text with footnote.[^1]\n\n[^1]: Footnote body",
    );

    expect(out).toContain('href="#user-content-fn-1"');
    expect(out).toContain('id="user-content-fn-1"');
    expect(out).toContain('href="#user-content-fnref-1"');
    expect(out).toContain('id="user-content-fnref-1"');
    expect(out).not.toContain("user-content-user-content-");
  });

  it("renders inline color references as color chips", () => {
    const out = processMarkdown("`#ff0000`");

    expect(out).toContain("gfm-color-chip");
  });

  it("sanitizes script tags", () => {
    const out = processMarkdown("<script>alert('xss')</script>");

    expect(out).not.toContain("<script>");
  });

  it("adds tabIndex to fenced code blocks for keyboard scroll a11y", () => {
    const out = processMarkdown("```\nfoo\n```");

    expect(out).toMatch(/<code[^>]*\btabindex="0"/);
  });

  it("does not add tabIndex to inline code", () => {
    const out = processMarkdown("a `inline` snippet");

    expect(out).not.toMatch(/<code[^>]*\btabindex/);
  });
});

describe("processMarkdownInline", () => {
  it("strips block-level elements like headings", () => {
    const out = processMarkdownInline("# Should not appear");

    expect(out).not.toContain("<h1");
  });
});
