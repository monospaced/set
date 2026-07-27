import { create } from "storybook/theming";

const brand = {
  brandTarget: "_self" as const,
  brandTitle: "Set",
  brandUrl: "/",
};

const brandSvg = (textColor: string) =>
  `<svg width="70" height="14" viewBox="0 0 70 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.0199997 10.44H1.82C1.94 11.98 2.5 12.32 4.86 12.32C7.28 12.32 7.82 11.94 7.82 10.1C7.82 8.56 7.28 8.1 4.88 7.58C0.98 6.74 0.0999998 6.04 0.0999998 3.62C0.0999998 0.659999 0.96 -1.90735e-06 4.84 -1.90735e-06C8.42 -1.90735e-06 9.24 0.559998 9.34 3.08H7.54C7.46 1.94 6.96 1.7 4.86 1.7C2.44 1.7 1.92 2.04 1.92 3.64C1.92 4.9 2.46 5.3 4.9 5.84C8.78 6.68 9.62 7.42 9.62 10.1C9.62 13.3 8.74 14 4.7 14C0.84 14 -2.23517e-07 13.38 0.0199997 10.44ZM19.3122 11.06H21.0722C20.6322 13.48 19.9122 14 17.0722 14C13.2722 14 12.4322 13.02 12.4322 8.58C12.4322 4.16 13.2322 3.2 16.7722 3.2C20.5122 3.2 21.3322 4.32 21.2522 9.42H14.1522C14.2322 11.84 14.7522 12.36 17.0122 12.36C18.5322 12.36 18.9522 12.12 19.3122 11.06ZM14.1722 7.88H19.5322C19.4522 5.38 18.9522 4.82 16.8722 4.82C14.7322 4.82 14.2322 5.38 14.1722 7.88ZM24.2844 4.92L24.7244 3.4H27.0244V1.1L28.7644 0.359998V3.4H32.4044V4.92H28.7444V10.54C28.7444 12.02 29.0844 12.34 30.7044 12.34C31.2244 12.34 31.6244 12.3 32.8444 12.14V13.78C31.4244 13.96 30.9644 14 30.2644 14C27.5844 14 26.9844 13.4 26.9844 10.62V4.92H24.2844ZM48.3687 13.8V0.199999C49.7687 0.0599985 50.4487 0.0399988 51.8287 0.159998C56.1088 0.439998 57.4488 1.84 57.4488 7.14C57.4488 12.74 56.2888 13.96 50.9687 13.96C50.1887 13.96 49.8487 13.94 48.3687 13.8ZM50.2087 1.86V12.24C51.5487 12.32 51.9488 12.3 52.4687 12.28C55.0288 12.08 55.6087 11.2 55.6087 7.24C55.6087 3.24 54.9488 2.28 52.0087 1.92C51.4487 1.86 50.8687 1.82 50.2087 1.86ZM59.9809 10.44H61.7809C61.9009 11.98 62.4609 12.32 64.8209 12.32C67.2409 12.32 67.7809 11.94 67.7809 10.1C67.7809 8.56 67.2409 8.1 64.8409 7.58C60.9409 6.74 60.0609 6.04 60.0609 3.62C60.0609 0.659999 60.9209 -1.90735e-06 64.8009 -1.90735e-06C68.3809 -1.90735e-06 69.2009 0.559998 69.3009 3.08H67.5009C67.4209 1.94 66.9209 1.7 64.8209 1.7C62.4009 1.7 61.8809 2.04 61.8809 3.64C61.8809 4.9 62.4209 5.3 64.8609 5.84C68.7409 6.68 69.5809 7.42 69.5809 10.1C69.5809 13.3 68.7009 14 64.6609 14C60.8009 14 59.9609 13.38 59.9809 10.44Z" fill="${textColor}"/></svg>`;

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
