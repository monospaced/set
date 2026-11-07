import { expect, test } from "vitest";

import {
  toPackageName,
  toTitle,
  validatePackageName,
} from "../src/answers.mjs";

test("a directory becomes a package name", () => {
  expect(toPackageName("./My Site/")).toBe("my-site");
  expect(toPackageName("../sites/Set_Demo")).toBe("set_demo");
  expect(toPackageName("--")).toBe("set-app");
});

test("a package name becomes a title", () => {
  expect(toTitle("my-site")).toBe("My Site");
  expect(toTitle("@acme/marketing.site")).toBe("Marketing Site");
});

test("package names are validated", () => {
  expect(validatePackageName("my-site")).toBeUndefined();
  expect(validatePackageName("@acme/my-site")).toBeUndefined();
  expect(validatePackageName("My Site")).toMatch(/lowercase/);
});
