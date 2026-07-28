import { renderSkillPage, skillDescription, skillTitle } from "./_shared/skill";

const SLUG = "custom-with-tokens";

export default class CustomWithTokens {
  data() {
    return {
      description: skillDescription(SLUG),
      layout: "base.11ty.ts",
      permalink: `/${SLUG}/`,
      title: skillTitle(SLUG),
    };
  }

  render(): string {
    return renderSkillPage(SLUG);
  }
}
