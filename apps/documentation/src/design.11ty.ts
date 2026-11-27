import { renderSkillPage, skillDescription, skillTitle } from "./_shared/skill";

// Monospaced's visual brand identity, from the skills package's DESIGN.md.
const SLUG = "DESIGN.md";

export default class Design {
  data() {
    return {
      description: skillDescription(SLUG),
      layout: "base.11ty.ts",
      permalink: "/design/",
      title: skillTitle(SLUG),
    };
  }

  render(): string {
    // Its first paragraph is the strapline.
    return renderSkillPage(SLUG, { strapline: "lead" });
  }
}
