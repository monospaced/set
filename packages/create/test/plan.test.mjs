import { expect, test } from "vitest";

import { plan } from "../src/plan.mjs";

const answers = {
  description: "My Site, built with Set.",
  name: "my-site",
  title: "My Site",
};

test("the same answers always give the same project", () => {
  expect(plan(answers)).toMatchSnapshot();
});

test("every file ends with a single newline", () => {
  for (const [path, content] of Object.entries(plan(answers))) {
    expect(content, path).toMatch(/[^\n]\n$/);
  }
});

test("title and description are escaped in HTML", () => {
  const html = plan({
    ...answers,
    description: 'Tom & Jerry <"cat">',
    title: "A & B",
  })["index.html"];

  expect(html).toContain("<title>A &amp; B</title>");
  expect(html).toContain('content="Tom &amp; Jerry &lt;&quot;cat&quot;&gt;"');
  expect(html).not.toContain('<"cat">');
});
