import { specToArgTypes, specToComponentDescription } from "../../spec";
import { defineSetBanner, renderSetBanner } from "../banner/banner";
import { renderSetBox } from "../box/box";
import { renderSetButton } from "../button/button";
import { renderSetContainer } from "../container/container";
import { renderSetDivider } from "../divider/divider";
import { renderSetHeading } from "../heading/heading";
import { renderSetInline } from "../inline/inline";
import { renderSetLink } from "../link/link";
import { renderSetLogo } from "../logo/logo";
import { defineSetMenu, renderSetMenu } from "../menu/menu";
import { defineSetNav, renderSetNav } from "../nav/nav";
import { defineSetSidebar, renderSetSidebar } from "../sidebar/sidebar";
import { renderSetStack } from "../stack/stack";
import { renderSetPage, SET_PAGE_SPEC, type SetPageProps } from "./page";

defineSetBanner();
defineSetMenu();
defineSetNav();
defineSetSidebar();

const baseArgTypes = specToArgTypes(SET_PAGE_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(SET_PAGE_SPEC),
      },
    },
    padding: false,
  },
  title: "Structure/Page",
};

export default meta;

const simpleIcons = {
  gitHub: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/></svg>`,
  linkedIn: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/></svg>`,
  rss: `<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" fill="currentColor"/></svg>`,
};

export const Default = {
  args: {
    centerMain: false,
    headerBorder: "scroll",
    headerSize: "lg",
    id: "",
    stickyHeader: "always",
    banner: undefined,
    header: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "wide",
      children: renderSetBox({
        paddingBlock: "sm",
        paddingInline: "none",
        responsive: true,
        children: renderSetInline({
          gap: "sm",
          justify: "between",
          children: [
            `<a href="#">${renderSetLogo({
              label: "Monospaced",
              variant: "secondary",
            })}</a>`,
            renderSetNav({
              collapsible: "belowTablet",
              contentId: "default-content-id",
              expanderPosition: "end",
              items: [
                { current: true, href: "#", label: "About" },
                { href: "#", label: "Work" },
                { href: "#", label: "Blog" },
              ],
            }),
          ].join(""),
        }),
      }),
    }),
    children: renderSetContainer({
      children: renderSetBox({
        paddingBlock: "2xl",
        paddingInline: "none",
        children: '<div class="example-content"></div>',
      }),
    }),
    footer: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "wide",
      children: [
        renderSetDivider({ tone: "brand" }),
        renderSetBox({
          paddingBlock: "md",
          paddingInline: "none",
          responsive: true,
          children: renderSetInline({
            align: "end",
            gap: "sm",
            justify: "between",
            children: [
              renderSetStack({
                as: "ul",
                gap: "none",
                children: [
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.gitHub,
                    label: "GitHub",
                    tone: "neutral",
                  })}</li>`,
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.linkedIn,
                    label: "LinkedIn",
                    tone: "neutral",
                  })}</li>`,
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.rss,
                    label: "RSS feed",
                    tone: "neutral",
                  })}</li>`,
                ].join(""),
              }),
              renderSetInline({
                align: "end",
                gap: "lg",
                justify: "between",
                children: [
                  renderSetStack({
                    as: "ul",
                    gap: "none",
                    children: [
                      `<li>${renderSetLink({
                        href: "#",
                        label: "Privacy policy",
                        tone: "neutral",
                      })}</li>`,
                      `<li>${renderSetLink({
                        href: "#",
                        label: "Terms and conditions",
                        tone: "neutral",
                      })}</li>`,
                    ].join(""),
                  }),
                  `<a
                    href="#"
                    style="margin-block-end: var(--set-spacing-vertical-400)"
                  >${renderSetLogo({
                    label: "Monospaced",
                    variant: "graphic",
                  })}</a>`,
                ].join(""),
              }),
            ].join(""),
          }),
        }),
      ].join(""),
    }),
  } satisfies SetPageProps,
  render: (args: SetPageProps) => renderSetPage(args),
};

export const Alt = {
  args: {
    centerMain: true,
    header: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "none",
      children: renderSetBox({
        paddingBlock: "xs",
        paddingInline: "none",
        children: renderSetInline({
          gap: "sm",
          justify: "between",
          children: [
            renderSetInline({
              gap: "xs",
              children: [
                renderSetSidebar({
                  aboveNotebook: "overlay",
                  id: "alt-sidebar",
                  header: renderSetBox({
                    background: "panel",
                    paddingBlock: "none",
                    paddingInline: "sm",
                    children: `Header`,
                  }),
                  children: renderSetBox({
                    background: "panel",
                    paddingBlock: "xs",
                    paddingInline: "xs",
                    children: renderSetBox({
                      background: "panel",
                      border: true,
                      radius: "sm",
                      paddingBlock: "xs",
                      paddingInline: "xs",
                      children: `Content`,
                    }),
                  }),
                  footer: renderSetBox({
                    background: "panel",
                    paddingBlock: "none",
                    paddingInline: "sm",
                    children: `Footer`,
                  }),
                }),
                `<a href="#">${renderSetHeading({
                  size: "lg",
                  text: "App",
                })}</a>`,
              ].join(""),
            }),
            renderSetInline({
              align: "end",
              gap: "xs",
              children: [
                renderSetMenu({
                  align: "end",
                  id: "exportMenu",
                  items: [
                    { id: "hi-rese", label: "Hi-res" },
                    { id: "vector", label: "Vector" },
                    { id: "web", label: "Web" },
                  ],
                  triggerIcon: "download",
                  triggerLabel: "Export",
                  triggerLabelVisibility: "hiddenBelowTablet",
                  size: "sm",
                }),
                renderSetButton({
                  label: "16:9",
                  size: "sm",
                  tone: "neutral",
                }),
                renderSetButton({
                  icon: "swap",
                  appearance: "solid",
                  label: "Shuffle",
                  labelVisibility: "hiddenBelowTablet",
                  size: "sm",
                }),
                renderSetButton({
                  icon: "refresh",
                  appearance: "solid",
                  label: "Randomise",
                  labelVisibility: "hiddenBelowTablet",
                  size: "sm",
                }),
              ].join(""),
            }),
          ].join(""),
        }),
      }),
    }),
    children: renderSetContainer({
      gutter: "narrow",
      children: renderSetBox({
        paddingBlock: "2xl",
        paddingInline: "none",
        children: '<div class="example-content"></div>',
      }),
    }),
    footer: renderSetContainer({
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
              href="#"
              style="margin-block-end: var(--set-spacing-vertical-400)"
            >${renderSetLogo({
              label: "Monospaced",
              size: "sm",
              tone: "neutral",
              variant: "graphic",
            })}</a>`,
            renderSetInline({
              align: "end",
              as: "ul",
              gap: "sm",
              children: [
                `<li>${renderSetLink({
                  href: "#",
                  icon: simpleIcons.gitHub,
                  label: "View source",
                  size: "sm",
                  tone: "neutral",
                })}</li>`,
                `<li>${renderSetLink({
                  href: "#",
                  label: "About",
                  size: "sm",
                  tone: "neutral",
                })}</li>`,
                `<li>${renderSetLink({
                  href: "#",
                  label: "Monospaced",
                  size: "sm",
                  tone: "neutral",
                })}</li>`,
              ].join(""),
            }),
          ].join(""),
        }),
      }),
    }),
  } satisfies SetPageProps,
  render: (args: SetPageProps) => renderSetPage(args),
};

export const Banner = {
  args: {
    centerMain: false,
    headerBorder: "scroll",
    headerSize: "lg",
    stickyHeader: "always",
    banner: renderSetBanner({
      actionHref: "#",
      actionLabel: "Action link",
      message:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.",
    }),
    header: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "wide",
      children: renderSetBox({
        paddingBlock: "sm",
        paddingInline: "none",
        responsive: true,
        children: renderSetInline({
          gap: "sm",
          justify: "between",
          children: [
            `<a href="#">${renderSetLogo({
              label: "Monospaced",
              variant: "secondary",
            })}</a>`,
            renderSetNav({
              collapsible: "belowTablet",
              contentId: "banner-content-id",
              expanderPosition: "end",
              items: [
                { current: true, href: "#", label: "About" },
                { href: "#", label: "Work" },
                { href: "#", label: "Blog" },
              ],
            }),
          ].join(""),
        }),
      }),
    }),
    children: renderSetContainer({
      children: renderSetBox({
        paddingBlock: "2xl",
        paddingInline: "none",
        children: '<div class="example-content"></div>',
      }),
    }),
    footer: renderSetContainer({
      gutter: "narrow",
      maxInlineSize: "wide",
      children: [
        renderSetDivider({ tone: "brand" }),
        renderSetBox({
          paddingBlock: "md",
          paddingInline: "none",
          responsive: true,
          children: renderSetInline({
            align: "end",
            gap: "sm",
            justify: "between",
            children: [
              renderSetStack({
                as: "ul",
                gap: "none",
                children: [
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.gitHub,
                    label: "GitHub",
                    tone: "neutral",
                  })}</li>`,
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.linkedIn,
                    label: "LinkedIn",
                    tone: "neutral",
                  })}</li>`,
                  `<li>${renderSetLink({
                    href: "#",
                    icon: simpleIcons.rss,
                    label: "RSS feed",
                    tone: "neutral",
                  })}</li>`,
                ].join(""),
              }),
              renderSetInline({
                align: "end",
                gap: "lg",
                justify: "between",
                children: [
                  renderSetStack({
                    as: "ul",
                    gap: "none",
                    children: [
                      `<li>${renderSetLink({
                        href: "#",
                        label: "Privacy policy",
                        tone: "neutral",
                      })}</li>`,
                      `<li>${renderSetLink({
                        href: "#",
                        label: "Terms and conditions",
                        tone: "neutral",
                      })}</li>`,
                    ].join(""),
                  }),
                  `<a
                    href="#"
                    style="margin-block-end: var(--set-spacing-vertical-400)"
                  >${renderSetLogo({
                    label: "Monospaced",
                    variant: "graphic",
                  })}</a>`,
                ].join(""),
              }),
            ].join(""),
          }),
        }),
      ].join(""),
    }),
  } satisfies SetPageProps,
  render: (args: SetPageProps) => renderSetPage(args),
};
