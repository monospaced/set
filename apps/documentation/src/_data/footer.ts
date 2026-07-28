/**
 * Footer field data, available as `data.footer.*`.
 */

export interface FooterLink {
  href: string;
  label: string;
}

const links: FooterLink[] = [
  {
    href: "https://github.com/monospaced/set",
    label: "GitHub",
  },
  {
    href: "https://monospaced.com",
    label: "Monospaced",
  },
];

export default { links };

export type FooterData = typeof import("./footer").default;
