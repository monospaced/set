import { describe, expect, it } from "vitest";

import * as core from "../index";
import { type SetComponentSpec, specToStoryTitle } from "../spec";

// Storybook needs string-literal titles, so the stories can't call
// specToStoryTitle themselves. This keeps the literals honest: every story
// file's title must be what its SPEC's category and name produce.
const stories = import.meta.glob<{ default: { title: string } }>(
  "../components/*/*.stories.ts",
  { eager: true },
);

describe("story titles follow the SPEC", () => {
  for (const [path, module] of Object.entries(stories)) {
    const folder = path.split("/").at(-2) ?? "";
    const specName = `SET_${folder.toUpperCase().replaceAll("-", "_")}_SPEC`;
    const spec = (core as Record<string, unknown>)[specName] as
      SetComponentSpec | undefined;

    it(`${folder} is titled from ${specName}`, () => {
      expect(spec, `${specName} is exported from core`).toBeDefined();
      expect(module.default.title).toBe(specToStoryTitle(spec!));
    });
  }
});
