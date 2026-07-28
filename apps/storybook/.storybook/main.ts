import type { StorybookConfig } from "@storybook/web-components-vite";

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
    return viteConfig;
  },
};

export default config;
