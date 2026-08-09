import "@monospaced/set-assets/fonts.css";
import "../../../packages/core/src/styles.css";
import "./docs.css";
import "./examples.css";

import {
  Controls,
  Description,
  DocsContainer,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/web-components-vite";
import { type ComponentProps, useEffect, useState } from "react";

import {
  SET_LIGHTSWITCH_EVENT_CHANGE,
  SET_LIGHTSWITCH_STORAGE_KEY,
} from "../../../packages/core/src/components/lightswitch/lightswitch";
import { renderSetRoot } from "../../../packages/core/src/components/root/root";
import { renderSetSurface } from "../../../packages/core/src/components/surface/surface";
import { isValidHtmlId } from "../../../packages/core/src/helpers/string";
import { darkTheme, lightTheme } from "./themes";

/* Every component validates its `id` prop and throws on syntactically
   invalid input, which would crash the story while typing into the id
   control. Render invalid ids as "no id" instead; renderers treat
   empty/whitespace as absent themselves. Mutates context.args in place:
   passing overridden args to Story() does not reach the story's render
   function. */
const sanitizeStoryArgs = (args: Record<string, unknown>): void => {
  const { id } = args;

  if (typeof id !== "string") return;

  const trimmed = id.trim();

  if (trimmed && !isValidHtmlId(trimmed)) {
    args.id = undefined;
  }
};

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

// A toolbar pin always wins; unpinned ("auto") previews show what this
// visitor would really see — the stored lightswitch override, else the
// system preference — matching the chrome and docs resolution.
const getResolvedTheme = (theme?: "light" | "dark") =>
  theme ?? getStoredTheme() ?? getSystemTheme();

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

// A stored lightswitch override beats the system preference, matching the
// manager chrome (manager.ts) and the pre-paint stamps in the head files.
const getStoredTheme = (): "light" | "dark" | undefined => {
  try {
    const value = window.localStorage.getItem(SET_LIGHTSWITCH_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : undefined;
  } catch {
    return undefined;
  }
};

const resolveDocsTheme = () =>
  (getStoredTheme() ?? getSystemTheme()) === "dark" ? darkTheme : lightTheme;

/* Decorators only run at render, so already-rendered story roots would hold
   a stale theme after the lightswitch preference changes. Rather than force
   a re-render — which rebuilds story DOM and restarts autoplaying media —
   the decorator marks roots it themed by "auto" resolution and this patches
   their `data-set-theme` in place; pinned and withTheme: false roots are
   never touched. Storage events are filtered to the lightswitch key because
   the manager writes its own UI state (e.g. `lastViewedStoryIds`) on every
   navigation, and those events reach this iframe too. */
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const patchAutoRoots = () => {
    const next = getStoredTheme() ?? getSystemTheme();
    for (const root of document.querySelectorAll(
      '[data-storybook-theme-source="auto"] > .set',
    )) {
      root.setAttribute("data-set-theme", next);
    }
  };

  window.addEventListener("storage", (event) => {
    if (event.key === SET_LIGHTSWITCH_STORAGE_KEY || event.key === null) {
      patchAutoRoots();
    }
  });
  window.addEventListener(SET_LIGHTSWITCH_EVENT_CHANGE, patchAutoRoots);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", patchAutoRoots);
}

/* Docs pages are themed through this container so the docs chrome (title,
   args table, source blocks) re-themes live, unlike the static `docs.theme`
   parameter which is captured once at boot. `storage` covers lightswitch
   toggles in other same-origin documents (the docs site, another tab), the
   lightswitch change event covers a toggle inside this very iframe, and the
   media listener covers system flips while no override is stored. Also
   re-stamps `data-set-theme` on <html> so the pre-paint CSS in
   preview-head.html stays in agreement. */
const ThemedDocsContainer = ({
  children,
  ...props
}: ComponentProps<typeof DocsContainer>) => {
  const [theme, setTheme] = useState(resolveDocsTheme);

  useEffect(() => {
    const apply = () => {
      const stored = getStoredTheme();
      if (stored) {
        document.documentElement.setAttribute("data-set-theme", stored);
      } else {
        document.documentElement.removeAttribute("data-set-theme");
      }
      setTheme(resolveDocsTheme());
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === SET_LIGHTSWITCH_STORAGE_KEY || event.key === null) {
        apply();
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("storage", onStorage);
    window.addEventListener(SET_LIGHTSWITCH_EVENT_CHANGE, apply);
    media.addEventListener("change", apply);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SET_LIGHTSWITCH_EVENT_CHANGE, apply);
      media.removeEventListener("change", apply);
    };
  }, []);

  return (
    <DocsContainer {...props} theme={theme}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const padding =
        typeof context.parameters.padding !== "undefined"
          ? context.parameters.padding
          : "1.75rem 1.25rem";

      const resolvedTheme = getResolvedTheme(context.globals.theme);
      sanitizeStoryArgs(context.args);
      const storyHtml = String(Story());
      const withRoot = context.parameters?.withRoot !== false;
      const withSurface = context.parameters?.withSurface !== false;
      const withTheme = context.parameters?.withTheme !== false;

      // Marks roots whose theme came from "auto" resolution (no toolbar pin)
      // so the module-level patcher above can retheme them in place.
      const wrapAutoThemed = (rootHtml: string): string =>
        withTheme && !context.globals.theme
          ? `<div data-storybook-theme-source="auto">${rootHtml}</div>`
          : rootHtml;

      if (!withRoot) return storyHtml;

      if (!withSurface) {
        return wrapAutoThemed(
          renderSetRoot({
            brand: context.globals.brand,
            children: storyHtml,
            dir: context.globals.direction,
            theme: withTheme ? resolvedTheme : undefined,
          }),
        );
      }

      return wrapAutoThemed(
        renderSetRoot({
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
          theme: withTheme ? resolvedTheme : undefined,
        }),
      );
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
          { title: "monospaced", value: "mnsp" },
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
      container: ThemedDocsContainer,
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
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Introduction", "*"],
      },
    },
    withRoot: true,
    withSurface: true,
    withTheme: true,
  },
  tags: ["autodocs"],
};

export default preview;
