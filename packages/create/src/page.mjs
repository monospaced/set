import {
  escapeHtml,
  renderSetBox,
  renderSetContainer,
  renderSetHeading,
  renderSetInline,
  renderSetLightswitch,
  renderSetPage,
  renderSetRoot,
  renderSetStack,
  renderSetText,
  SET_LIGHTSWITCH_STORAGE_KEY,
} from "@monospaced/set-core";

/*
 * Stamps a stored lightswitch override onto the root before its content
 * parses, so an overridden theme paints correctly on first load. Must be the
 * root's first child: earlier and the root doesn't exist yet, later and
 * content above it may already have painted in the wrong theme.
 */
export const themeBootstrap = `<script>try{var t=localStorage.getItem(${JSON.stringify(
  SET_LIGHTSWITCH_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.currentScript.closest(".set").setAttribute("data-set-theme",t)}catch(e){}</script>`;

/**
 * The starter page, built from Set components only and rendered with core at
 * generation time. The `prerender` variant writes the same composition as
 * `src/document.ts` and `src/pages/index.ts`.
 */
export function renderHelloPage({ brand, editHint, title }) {
  const header = renderSetContainer({
    maxInlineSize: "none",
    children: renderSetBox({
      background: "transparent",
      paddingBlock: "2xs",
      paddingInline: "none",
      children: renderSetInline({
        gap: "sm",
        justify: "between",
        children:
          renderSetHeading({ children: escapeHtml(title), size: "md" }) +
          renderSetLightswitch({ size: "sm" }),
      }),
    }),
  });

  const main = renderSetContainer({
    children: renderSetBox({
      paddingBlock: "lg",
      paddingInline: "none",
      responsive: true,
      children: renderSetStack({
        gap: "md",
        children:
          renderSetHeading({
            children: "Hello, world",
            level: 1,
            responsive: true,
            size: "xl",
          }) +
          renderSetText({
            as: "p",
            children: `Edit <code>${editHint}</code> to begin.`,
            responsive: true,
            size: "sm",
          }),
      }),
    }),
  });

  // Page always renders its footer region; the starter leaves it empty.
  const page = renderSetPage({
    children: main,
    footer: "",
    header,
    headerBorder: "always",
    headerSize: "sm",
  });

  return renderSetRoot({
    appOverscrollBehavior: "none",
    appRoot: true,
    brand,
    children: themeBootstrap + page,
  });
}
