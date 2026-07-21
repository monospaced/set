/**
 * Navigation field data, available as `data.nav.*`.
 *
 * A sidebar entry is either a flat link (`NavItem`) or a group
 * (`NavGroup`, rendered as a muted label above its links).
 */

export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  items: NavItem[];
  label: string;
}

export type NavEntry = NavGroup | NavItem;

const sidebar: NavEntry[] = [
  { href: "/getting-started/", label: "Getting started" },
  { href: "/storybook/", label: "Storybook" },
  {
    items: [
      { href: "/breakpoint/", label: "Breakpoint" },
      { href: "/color/", label: "Color" },
      { href: "/effect/", label: "Effect" },
      { href: "/layout/", label: "Layout" },
      { href: "/motion/", label: "Motion" },
      { href: "/radius/", label: "Radius" },
      { href: "/spacing/", label: "Spacing" },
      { href: "/typography/", label: "Typography" },
    ],
    label: "Foundations",
  },
  {
    items: [
      { href: "/compose-first/", label: "Compose first" },
      { href: "/custom-with-tokens/", label: "Custom with tokens" },
    ],
    label: "Skills",
  },
];

export default { sidebar };

export type NavData = typeof import("./nav").default;
