import targets from "@monospaced/set-config/browserslist/lightningcss";
import type { StorybookConfig } from "@storybook/web-components-vite";
import { Features } from "lightningcss";

const config: StorybookConfig = {
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  features: {
    outline: false,
  },
  framework: "@storybook/web-components-vite",
  staticDirs: [{ from: "../../../packages/assets/src", to: "/set-assets" }],
  stories: ["../stories/**/*.mdx", "../../../packages/*/src/**/*.stories.ts"],
  viteFinal: async (viteConfig, { configType }) => {
    if (configType === "PRODUCTION") {
      viteConfig.base = "/storybook/";
    }
    // Flatten nesting as core's build does, so Storybook and the story tests
    // run on the CSS that ships rather than the source.
    viteConfig.css = {
      ...viteConfig.css,
      lightningcss: { include: Features.Nesting, targets },
      transformer: "lightningcss",
    };
    return viteConfig;
  },
};

export default config;
