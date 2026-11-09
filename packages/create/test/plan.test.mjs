import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

import { expect, test } from "vitest";

import { plan } from "../src/plan.mjs";

const answers = {
  brand: "mnsp",
  description: "My Site, built with Set.",
  name: "my-site",
  title: "My Site",
};

const html = plan({ ...answers, variant: "html" });
const prerender = plan({ ...answers, variant: "prerender" });
const react = plan({ ...answers, variant: "react" });

test("the same answers always give the same html project", () => {
  expect(html).toMatchSnapshot();
});

test("the same answers always give the same prerender project", () => {
  expect(prerender).toMatchSnapshot();
});

test("the same answers always give the same react project", () => {
  expect(react).toMatchSnapshot();
});

test("title and description are escaped in HTML", () => {
  const page = plan({
    ...answers,
    description: 'Tom & Jerry <"cat">',
    title: "A & B",
    variant: "html",
  })["index.html"];

  expect(page).toContain("<title>A &amp; B</title>");
  expect(page).toContain('content="Tom &amp; Jerry &lt;&quot;cat&quot;&gt;"');
  expect(page).not.toContain('<"cat">');
});

test("the brand picks the stylesheet and the root's brand in every variant", () => {
  for (const variant of ["html", "prerender", "react"]) {
    const files = plan({ ...answers, brand: "wrfr", variant });
    const entry = files["src/main.ts"] ?? files["src/main.tsx"];

    expect(entry, variant).toContain('"@monospaced/set-core/styles/wrfr.css"');
    expect(
      files["index.html"] +
        (files["src/site.ts"] ?? "") +
        (files["src/App.tsx"] ?? ""),
      variant,
    ).toMatch(/data-set-brand="wrfr"|brand: "wrfr"|brand="wrfr"/);
  }
});

test("the prerender starter renders the same document as the html starter", async () => {
  // Written under node_modules so Node resolves @monospaced/set-core from the
  // package, and so nothing else (git, Prettier, ESLint) sees the files.
  const dir = join(
    import.meta.dirname,
    "../node_modules/.cache/create-set-test",
  );
  rmSync(dir, { force: true, recursive: true });
  for (const path of [
    "src/document.ts",
    "src/pages.ts",
    "src/pages/index.ts",
    "src/site.ts",
  ]) {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), prerender[path]);
  }

  const { renderDocument } = await import(
    pathToFileURL(join(dir, "src/document.ts")).href
  );
  const { pages } = await import(pathToFileURL(join(dir, "src/pages.ts")).href);
  const rendered = await renderDocument(pages["/"], "/");

  // The html starter carries an editing comment and names its own file in
  // the hint; everything else must match byte for byte.
  const expected = html["index.html"]
    .replace(/^\s*<!--.*-->\n/m, "")
    .replace("<code>index.html</code>", "<code>src/pages/index.ts</code>");

  expect(rendered).toBe(expected);
});
