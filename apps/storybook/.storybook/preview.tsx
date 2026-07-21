import "@measured/set-assets/fonts.css";
import "../../../packages/core/src/styles.css";
import "./docs.css";
import "./examples.css";

import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/web-components-vite";

import { renderSetRoot } from "../../../packages/core/src/components/root/root";
import { renderSetSurface } from "../../../packages/core/src/components/surface/surface";
import { darkTheme, lightTheme } from "./themes";

const decodeHtmlEntities = (source: string): string =>
  source
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

const formatSourceForDocs = async (source: string): Promise<string> => {
  const decoded = decodeHtmlEntities(source);
  const prettier = await import("prettier/standalone");
  const prettierHtml = await import("prettier/plugins/html");

  return await prettier.format(decoded, {
    parser: "html",
    plugins: [prettierHtml],
  });
};

const getResolvedTheme = (theme?: "light" | "dark") =>
  theme ?? getSystemTheme();

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const padding =
        typeof context.parameters.padding !== "undefined"
          ? context.parameters.padding
          : "1.75rem 1.25rem";

      const resolvedTheme = getResolvedTheme(context.globals.theme);
      const storyHtml = String(Story());
      const withRoot = context.parameters?.withRoot !== false;
      const withSurface = context.parameters?.withSurface !== false;

      if (!withRoot) return storyHtml;

      if (!withSurface) {
        return renderSetRoot({
          brand: context.globals.brand,
          children: storyHtml,
          dir: context.globals.direction,
          theme: resolvedTheme,
        });
      }

      return renderSetRoot({
        brand: context.globals.brand,
        children: renderSetSurface({
          children: `
            <div style="padding: ${padding}">
              ${storyHtml}
            </div>
          `,
          variant: context.globals.surface,
        }),
        dir: context.globals.direction,
        theme: resolvedTheme,
      });
    },
  ],
  globalTypes: {
    brand: {
      description: "Brand",
      defaultValue: "mnsp",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { title: "measured", value: "mnsp" },
          { title: "wireframe", value: "wrfr" },
        ],
      },
    },
    theme: {
      description: "Theme",
      defaultValue: undefined,
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { title: "auto", value: undefined },
          { title: "light", value: "light" },
          { title: "dark", value: "dark" },
        ],
      },
    },
    surface: {
      description: "Surface",
      defaultValue: "default",
      toolbar: {
        title: "Surface",
        icon: "stacked",
        items: [
          { title: "default", value: "default" },
          { title: "brand", value: "brand" },
          { title: "inverse", value: "inverse" },
          { title: "brand-inverse", value: "brand-inverse" },
        ],
      },
    },
    direction: {
      description: "Direction",
      defaultValue: undefined,
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { title: "inherit", value: undefined },
          { title: "ltr", value: "ltr" },
          { title: "rtl", value: "rtl" },
        ],
      },
    },
  },
  parameters: {
    a11y: {
      options: {
        rules: { region: { enabled: false } },
        runOnly: {
          type: "tag",
          values: [
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "wcag22aa",
            "best-practice",
          ],
        },
      },
      test: "error",
    },
    backgrounds: {
      disable: true,
      grid: { disable: true },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories includePrimary={false} />
        </>
      ),
      source: {
        excludeDecorators: true,
        transform: (source: string) => formatSourceForDocs(source),
      },
      theme: getSystemTheme() === "dark" ? darkTheme : lightTheme,
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Introduction", "*"],
      },
    },
    withRoot: true,
    withSurface: true,
  },
  tags: ["autodocs"],
};

export default preview;
