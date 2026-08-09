import { create } from "storybook/theming";

const brand = {
  brandTarget: "_self" as const,
  brandTitle: "Set System",
  brandUrl: "/",
};

const brandSvg = (textColor: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="116.6" height="30"><path d="M1.2 18.75c-.02 2.94.82 3.56 4.68 3.56 4.04 0 4.92-.7 4.92-3.9 0-2.68-.84-3.42-4.72-4.26-2.44-.54-2.98-.94-2.98-2.2 0-1.6.52-1.94 2.94-1.94 2.1 0 2.6.24 2.68 1.38h1.8c-.1-2.52-.92-3.08-4.5-3.08-3.88 0-4.74.66-4.74 3.62 0 2.42.88 3.12 4.78 3.96 2.4.52 2.94.98 2.94 2.52 0 1.84-.54 2.22-2.96 2.22-2.36 0-2.92-.34-3.04-1.88zm19.3.62c-.36 1.06-.78 1.3-2.3 1.3-2.26 0-2.78-.52-2.86-2.94h7.1c.08-5.1-.74-6.22-4.48-6.22-3.54 0-4.34.96-4.34 5.38 0 4.44.84 5.42 4.64 5.42 2.84 0 3.56-.52 4-2.94zm-5.14-3.18c.06-2.5.56-3.06 2.7-3.06 2.08 0 2.58.56 2.66 3.06zm10.12-2.96h2.7v5.7c0 2.78.6 3.38 3.28 3.38.7 0 1.16-.04 2.58-.22v-1.64c-1.22.16-1.62.2-2.14.2-1.62 0-1.96-.32-1.96-1.8v-5.62h3.66v-1.52h-3.64V8.67l-1.74.74v2.3h-2.3zm20.32 5.52c-.02 2.94.82 3.56 4.68 3.56 4.04 0 4.92-.7 4.92-3.9 0-2.68-.84-3.42-4.72-4.26-2.44-.54-2.98-.94-2.98-2.2 0-1.6.52-1.94 2.94-1.94 2.1 0 2.6.24 2.68 1.38h1.8c-.1-2.52-.92-3.08-4.5-3.08-3.88 0-4.74.66-4.74 3.62 0 2.42.88 3.12 4.78 3.96 2.4.52 2.94.98 2.94 2.52 0 1.84-.54 2.22-2.96 2.22-2.36 0-2.92-.34-3.04-1.88zm14.54 7.76h1.8l5.16-14.8h-1.84l-2.76 8.12h-.08l-2.84-8.12H57.9l3.46 9.66h.8zm9.98-7.36c-.02 2.6.74 3.16 4.24 3.16 3.52 0 4.3-.52 4.3-2.96 0-2.32-.74-2.9-4.1-3.38-2.08-.3-2.54-.56-2.54-1.54 0-1.06.44-1.28 2.4-1.28 1.76 0 2.18.2 2.28 1.14h1.74c-.1-2.28-.82-2.78-4.04-2.78-3.38 0-4.14.5-4.14 2.84 0 2.2.7 2.8 3.88 3.2 2.24.26 2.74.6 2.74 1.74s-.44 1.4-2.44 1.4c-2.02 0-2.48-.28-2.56-1.54zm11.76-5.92h2.7v5.7c0 2.78.6 3.38 3.28 3.38.7 0 1.16-.04 2.58-.22v-1.64c-1.22.16-1.62.2-2.14.2-1.62 0-1.96-.32-1.96-1.8v-5.62h3.66v-1.52h-3.64V8.67l-1.74.74v2.3h-2.3zm19.02 6.14c-.36 1.06-.78 1.3-2.3 1.3-2.26 0-2.78-.52-2.86-2.94h7.1c.08-5.1-.74-6.22-4.48-6.22-3.54 0-4.34.96-4.34 5.38 0 4.44.84 5.42 4.64 5.42 2.84 0 3.56-.52 4-2.94zm-5.14-3.18c.06-2.5.56-3.06 2.7-3.06 2.08 0 2.58.56 2.66 3.06zm9.56 5.92h1.7v-5.34c0-2.84.28-3.62 1.36-3.62.96 0 1.24.6 1.22 2.78l-.02 6.18h1.7v-5.34c0-2.84.3-3.62 1.34-3.62.94 0 1.18.6 1.18 2.78v6.18h1.7v-6.18c0-3.48-.48-4.42-2.32-4.42-1.1 0-1.54.34-2 1.56h-.1c-.28-1.22-.7-1.56-1.94-1.56-1.26 0-1.72.34-2.2 1.56h-.1v-1.36h-1.52z" fill="${textColor}"/></svg>`;

const fonts = {
  fontBase: "'Berkeley Mono', ui-monospaced, monospace",
  fontCode: "'Berkeley Mono', ui-monospaced, monospace",
};

export const lightTheme = create({
  base: "light",
  ...brand,
  ...fonts,
  brandImage: `data:image/svg+xml;utf8,${encodeURIComponent(brandSvg("#000000"))}`,

  // mnsp light-mode tokens
  colorPrimary: "#007c7c", // brand-primary
  colorSecondary: "#007c7c",

  appBg: "#f8fbfb", // background-default
  appContentBg: "#ffffff", // background-panel
  appHoverBg: "#f1f4f4", // background-subtle
  appPreviewBg: "#f8fbfb",
  appBorderColor: "#e2e4e4", // border-subtle
  appBorderRadius: 5,

  textColor: "#0e0f0f", // foreground-prose
  textMutedColor: "#646766", // foreground-muted-text
  textInverseColor: "#f8fbfb", // foreground-contrast

  barTextColor: "#646766",
  barHoverColor: "#0e0f0f",
  barSelectedColor: "#007c7c",
  barBg: "#ffffff",

  buttonBg: "#ffffff",
  buttonBorder: "#e2e4e4",

  booleanBg: "#f1f4f4",
  booleanSelectedBg: "#ffffff",

  inputBg: "#ffffff",
  inputBorder: "#e2e4e4",
  inputTextColor: "#0b0c0c", // foreground-default
  inputBorderRadius: 5,
});

export const darkTheme = create({
  base: "dark",
  ...brand,
  ...fonts,
  brandImage: `data:image/svg+xml;utf8,${encodeURIComponent(brandSvg("#ffffff"))}`,

  // mnsp dark-mode tokens
  colorPrimary: "#3ba9a9", // brand-primary (dark)
  colorSecondary: "#3ba9a9",

  appBg: "#0e0f0f", // background-default (dark)
  appContentBg: "#181a1a", // background-subtle (dark)
  appHoverBg: "#181a1a",
  appPreviewBg: "#181a1a",
  appBorderColor: "#222424", // border-subtle (dark)
  appBorderRadius: 5,

  textColor: "#e2e4e4", // foreground-prose (dark)
  textMutedColor: "#888b8a", // foreground-muted-text (dark)
  textInverseColor: "#0e0f0f", // foreground-contrast (dark)

  barTextColor: "#888b8a",
  barHoverColor: "#e2e4e4",
  barSelectedColor: "#3ba9a9",
  barBg: "#181a1a",

  buttonBg: "#0b0c0c", // background-panel (dark)
  buttonBorder: "#222424",

  booleanBg: "#0e0f0f",
  booleanSelectedBg: "#0b0c0c",

  inputBg: "#0b0c0c",
  inputBorder: "#222424",
  inputTextColor: "#f1f4f4", // foreground-default (dark)
  inputBorderRadius: 5,
});
