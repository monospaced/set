import {
  renderSetBox,
  renderSetContainer,
  renderSetDivider,
  renderSetGrid,
  renderSetGridItem,
  renderSetHeading,
  renderSetInline,
  renderSetLink,
  renderSetLogo,
  renderSetPage,
  renderSetProse,
  renderSetRoot,
  renderSetSidebar,
  renderSetStack,
  renderSetText,
} from "@monospaced/set-core";

import type { FooterData, FooterLink } from "../_data/footer";
import type { NavData, NavEntry, NavItem } from "../_data/nav";
import type { SiteData } from "../_data/site";

export interface PageData {
  centerMain?: boolean;
  content?: string;
  /** Per-page meta description; falls back to the site description. */
  description?: string;
  footer: FooterData;
  nav: NavData;
  /** Eleventy-supplied current page data. */
  page?: { url?: string };
  prose?: boolean;
  site: SiteData;
  title?: string;
}

// One social-share card for every page; OG/Twitter require an absolute URL.
const OG_IMAGE =
  "https://res.cloudinary.com/monospaced/image/upload/v1785247152/bg-brand-OG_wyxxvg.png";

const renderNavLink = (item: NavItem, currentUrl?: string): string =>
  renderSetLink({
    current: item.href === currentUrl ? "page" : undefined,
    href: item.href,
    label: item.label,
    tone: "neutral",
  });

// A group is introduced by a muted, non-link label above its links.
const renderSidebarItems = (entries: NavEntry[], currentUrl?: string): string =>
  entries
    .map((entry) =>
      "items" in entry
        ? [
            renderSetText({
              as: "p",
              children: entry.label,
              size: "sm",
              tone: "muted",
            }),
            ...entry.items.map((item) => renderNavLink(item, currentUrl)),
          ].join("")
        : renderNavLink(entry, currentUrl),
    )
    .join("");

const buildSidebar = (
  nav: NavData,
  site: SiteData,
  currentUrl?: string,
): string =>
  renderSetSidebar({
    aboveNotebook: "persistent",
    buttonSize: "sm",
    children: renderSetBox({
      background: "panel",
      paddingBlock: "sm",
      paddingInline: "md",
      children: renderSetStack({
        gap: "xs",
        children: renderSidebarItems(nav.sidebar, currentUrl),
      }),
    }),
    header: renderSetBox({
      paddingBlock: "none",
      paddingInline: "sm",
      children: `<a href="/">
        ${renderSetHeading({ text: site.title, size: "md" })}
      </a>`,
    }),
    id: "docs-sidebar",
  });

const buildHeader = (
  nav: NavData,
  site: SiteData,
  currentUrl?: string,
): string => {
  const logo = `<a
    href="/"
    style="display: block; margin-block: var(--set-spacing-vertical-250)"
  >${renderSetHeading({ text: site.title, size: "md" })}</a>`;
  const sidebar = buildSidebar(nav, site, currentUrl);

  return renderSetBox({
    background: "panel",
    paddingBlock: "none",
    paddingInline: "none",
    children: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "2xs",
        paddingInline: "none",
        background: "transparent",
        children: renderSetInline({
          gap: "sm",
          children: [sidebar, logo].join(""),
        }),
      }),
    }),
  });
};

const renderFooterLinks = (items: FooterLink[]): string =>
  items
    .map(
      ({ href, label }) =>
        `<li>${renderSetLink({
          href,
          label,
          tone: "neutral",
        })}</li>`,
    )
    .join("");

const buildFooter = (footer: FooterData, site: SiteData): string =>
  [
    renderSetDivider({ tone: "subtle" }),
    renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "xs",
        paddingInline: "none",
        children: renderSetInline({
          align: "end",
          gap: "xs",
          justify: "between",
          children: [
            `<a
              href="https://monospaced.com"
              style="margin-block-end: var(--set-spacing-vertical-400)"
            >${renderSetLogo({
              label: site.organization,
              size: "sm",
              tone: "neutral",
              variant: "graphic",
            })}</a>`,
            renderSetInline({
              align: "end",
              as: "ul",
              gap: "sm",
              children: renderFooterLinks(footer.links),
            }),
          ].join(""),
        }),
      }),
    }),
  ].join("");

const renderBasePage = (data: PageData): string => {
  const { footer, site, nav } = data;
  const mainContent = data.prose
    ? renderSetContainer({
        maxInlineSize: "none",
        children: renderSetBox({
          paddingBlock: "lg",
          paddingInline: "none",
          responsive: true,
          children: renderSetGrid({
            children: renderSetGridItem({
              colStart: 2,
              colSpan: 11,
              children: renderSetProse({
                children: data.content ?? "",
                hangingPunctuation: "notebook",
                responsive: true,
              }),
            }),
          }),
        }),
      })
    : (data.content ?? "");

  const page = renderSetPage({
    centerMain: data.centerMain,
    children: mainContent,
    footer: buildFooter(footer, site),
    header: buildHeader(nav, site, data.page?.url),
    headerBorder: "always",
    headerSize: "sm",
    stickyHeader: "always",
  });

  const root = renderSetRoot({
    appOverscrollBehavior: "none",
    appRoot: true,
    children: page,
  });

  const title = data.title ? `${data.title} | ${site.title}` : site.title;
  const description = data.description ?? site.description;
  const canonical = `${site.url}${data.page?.url ?? "/"}`;
  const attr = (value: string): string =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f8fbfb">
<title>${attr(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${attr(site.title)}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(canonical)}">
<meta property="og:image" content="${attr(OG_IMAGE)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
<meta name="twitter:image" content="${attr(OG_IMAGE)}">
<link href="/assets/favicons/apple-touch-icon.png" rel="apple-touch-icon">
<link href="/assets/favicons/favicon.ico" rel="icon" sizes="32x32">
<link href="/assets/favicons/favicon.svg" rel="icon" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/assets/fonts/Berkeley Mono Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/fonts.css">
<link rel="stylesheet" href="/assets/set-core.css">
<link rel="stylesheet" href="/assets/styles/docs.css">
</head>
<body class="docs">${root}<script type="module">
import { defineSetComponents } from "/assets/set-core.js";
defineSetComponents();
</script></body>
</html>`;
};

export default class Base {
  render(data: PageData): string {
    return renderBasePage(data);
  }
}
