import { create } from "storybook/theming";

const brand = {
  brandTarget: "_self" as const,
  brandTitle: "Set",
  brandUrl: "/",
};

const brandSvg = (textColor: string) =>
  `<svg height="14" width="67" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67 14"><path d="M0 10.44C-.02 13.38.82 14 4.68 14c4.04 0 4.92-.7 4.92-3.9 0-2.68-.84-3.42-4.72-4.26C2.44 5.3 1.9 4.9 1.9 3.64c0-1.6.52-1.94 2.94-1.94 2.1 0 2.6.24 2.68 1.38h1.8C9.22.56 8.4 0 4.82 0 .94 0 .08.66.08 3.62c0 2.42.88 3.12 4.78 3.96 2.4.52 2.94.98 2.94 2.52 0 1.84-.54 2.22-2.96 2.22-2.36 0-2.92-.34-3.04-1.88zm19.3.62c-.36 1.06-.78 1.3-2.3 1.3-2.26 0-2.78-.52-2.86-2.94h7.1c.08-5.1-.74-6.22-4.48-6.22-3.54 0-4.34.96-4.34 5.38 0 4.44.84 5.42 4.64 5.42 2.84 0 3.56-.52 4-2.94zm-5.14-3.18c.06-2.5.56-3.06 2.7-3.06 2.08 0 2.58.56 2.66 3.06zm10.12-2.96h2.7v5.7c0 2.78.6 3.38 3.28 3.38.7 0 1.16-.04 2.58-.22v-1.64c-1.22.16-1.62.2-2.14.2-1.62 0-1.96-.32-1.96-1.8V4.92h3.66V3.4h-3.64V.36l-1.74.74v2.3h-2.3zm20.7 8.88c1.48.14 1.82.16 2.6.16 5.32 0 6.48-1.22 6.48-6.82 0-5.3-1.34-6.7-5.62-6.98-1.38-.12-2.06-.1-3.46.04zm1.84-11.94c.66-.04 1.24 0 1.8.06 2.94.36 3.6 1.32 3.6 5.32 0 3.96-.58 4.84-3.14 5.04-.52.02-.92.04-2.26-.04zm9.78 8.58c-.02 2.94.82 3.56 4.68 3.56 4.04 0 4.92-.7 4.92-3.9 0-2.68-.84-3.42-4.72-4.26-2.44-.54-2.98-.94-2.98-2.2 0-1.6.52-1.94 2.94-1.94 2.1 0 2.6.24 2.68 1.38h1.8C65.82.56 65 0 61.42 0c-3.88 0-4.74.66-4.74 3.62 0 2.42.88 3.12 4.78 3.96 2.4.52 2.94.98 2.94 2.52 0 1.84-.54 2.22-2.96 2.22-2.36 0-2.92-.34-3.04-1.88z" fill="${textColor}"/></svg>`;

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
