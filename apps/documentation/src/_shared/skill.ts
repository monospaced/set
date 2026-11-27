/**
 * Shared template for pages rendered from the `@monospaced/set-skills`
 * package, which is the source of truth: each page renders a skill's
 * `SKILL.md`, or the package's `DESIGN.md`, verbatim (YAML frontmatter
 * stripped) and takes its title from the markdown's own H1, so the docs never
 * restate that content.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetProse,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";
import { processMarkdown } from "@monospaced/set-markdown";

const require = createRequire(import.meta.url);

// The skills package maps `./*` → `./src/*` via its exports, so the `src/`
// layout stays an implementation detail. `DESIGN.md` is exported from the
// package root.
const resolveSkill = (slug: string): string =>
  slug === "DESIGN.md"
    ? require.resolve("@monospaced/set-skills/DESIGN.md")
    : require.resolve(`@monospaced/set-skills/${slug}/SKILL.md`);

const readSkill = (slug: string): string =>
  readFileSync(resolveSkill(slug), "utf8");

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
  // The value may be a quoted YAML scalar.
  return match[1].replace(/^(["'])(.*)\1$/, "$2");
};

/** First `# ` heading of the skill body — used as the page title. */
export const skillTitle = (slug: string): string => {
  const heading = /^#\s+(.+?)\s*$/m.exec(stripFrontmatter(readSkill(slug)));
  if (!heading) {
    throw new Error(`Skill "${slug}" has no level-1 heading.`);
  }
  return heading[1];
};

const stripHeading = (markdown: string): string =>
  markdown.replace(/^#\s+.+\r?\n+/m, "");

/** The body's first paragraph, rendered to inline HTML, and the body without it. */
const splitLead = (body: string): { lead: string; rest: string } => {
  const match = /^([^\n#][^\n]*)\r?\n+/.exec(body.trimStart());
  if (!match) return { lead: "", rest: body };
  const lead = processMarkdown(match[1]).replace(/^<p>|<\/p>\s*$/g, "");
  return { lead, rest: body.trimStart().slice(match[0].length) };
};

/**
 * The page opens like the Brand and foundations pages: heading, strapline,
 * brand divider, body. The strapline is the frontmatter `description`, which
 * is what an agent reads to decide whether to load a skill, so it says what
 * the page is for and when it applies; or, for a document whose first
 * paragraph already does that job, that paragraph, lifted out of the body.
 */
export const renderSkillPage = (
  slug: string,
  { strapline = "description" }: { strapline?: "description" | "lead" } = {},
): string => {
  const markdown = stripHeading(stripFrontmatter(readSkill(slug)));
  const { lead, rest } =
    strapline === "lead"
      ? splitLead(markdown)
      : { lead: skillDescription(slug), rest: markdown };
  const body = renderSetStack({
    gap: "lg",
    children: [
      renderSetStack({
        gap: "md",
        children: [
          renderSetHeading({
            children: skillTitle(slug),
            level: 1,
            responsive: true,
            size: "2xl",
          }),
          renderSetText({
            as: "p",
            children: lead,
            responsive: true,
            size: "lg",
          }),
          renderSetDivider({ tone: "brand" }),
        ].join(""),
      }),
      renderSetProse({
        children: processMarkdown(rest),
        hangingPunctuation: "notebook",
        responsive: true,
      }),
    ].join(""),
  });

  return renderSetContainer({
    maxInlineSize: "none",
    children: renderSetBox({
      paddingBlock: "lg",
      paddingInline: "none",
      responsive: true,
      children: renderSetGrid({
        children: renderSetGridItem({
          colStart: 2,
          colSpan: 11,
          children: body,
        }),
      }),
    }),
  });
};
