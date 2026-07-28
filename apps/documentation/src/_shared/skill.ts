/**
 * Shared template for skill pages. The `@monospaced/set-skills`
 * package is the source of truth: each page renders its `SKILL.md` body
 * verbatim (YAML frontmatter stripped) and takes its title from the
 * markdown's own H1, so the docs never restate skill content.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import {
  renderSetBox,
  renderSetContainer,
  renderSetGrid,
  renderSetGridItem,
  renderSetProse,
} from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

const require = createRequire(import.meta.url);

// The skills package maps `./*` → `./src/*` via its exports, so the `src/`
// layout stays an implementation detail.
const readSkill = (slug: string): string =>
  readFileSync(
    require.resolve(`@monospaced/set-skills/${slug}/SKILL.md`),
    "utf8",
  );

const stripFrontmatter = (markdown: string): string =>
  markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");

const frontmatter = (markdown: string): string => {
  const block = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(markdown);
  return block ? block[1] : "";
};

/** `description:` from the skill's YAML frontmatter — page meta description. */
export const skillDescription = (slug: string): string => {
  const match = /^description:\s*(.+?)\s*$/m.exec(frontmatter(readSkill(slug)));
  if (!match) {
    throw new Error(`Skill "${slug}" has no frontmatter description.`);
  }
  return match[1];
};

/** First `# ` heading of the skill body — used as the page title. */
export const skillTitle = (slug: string): string => {
  const heading = /^#\s+(.+?)\s*$/m.exec(stripFrontmatter(readSkill(slug)));
  if (!heading) {
    throw new Error(`Skill "${slug}" has no level-1 heading.`);
  }
  return heading[1];
};

export const renderSkillPage = (slug: string): string =>
  renderSetContainer({
    maxInlineSize: "none",
    children: renderSetBox({
      paddingBlock: "lg",
      paddingInline: "none",
      responsive: true,
      children: renderSetGrid({
        children: renderSetGridItem({
          colStart: 2,
          colSpan: 11,
          children: renderSetProse({
            children: processMarkdown(stripFrontmatter(readSkill(slug))),
            hangingPunctuation: "notebook",
            responsive: true,
          }),
        }),
      }),
    }),
  });
