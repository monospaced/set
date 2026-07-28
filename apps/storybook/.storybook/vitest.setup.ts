import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/web-components-vite";
import { beforeAll } from "vitest";

import * as previewAnnotations from "./preview";

const annotations = setProjectAnnotations([
  a11yAddonAnnotations,
  previewAnnotations,
]);

beforeAll(annotations.beforeAll);
