import {
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

/** Escapes a value for an HTML attribute or text node. */
export const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/*
 * Stamps a stored lightswitch override onto the root before its content
 * parses, so an overridden theme paints correctly on first load. Must be the
 * root's first child: earlier and the root doesn't exist yet, later and
 * content above it may already have painted in the wrong theme.
 */
const themeBootstrap = `<script>try{var t=localStorage.getItem(${JSON.stringify(
  SET_LIGHTSWITCH_STORAGE_KEY,
)});if(t==="light"||t==="dark")document.currentScript.closest(".set").setAttribute("data-set-theme",t)}catch(e){}</script>`;

/**
 * The hello-world page: Root → Page with a header, a heading, a paragraph and
 * a Lightswitch, built from Set components only. Rendered with core at
 * generation time, so the markup is always what the installed core expects.
 */
export function renderHelloPage({ title }) {
  const safeTitle = escapeHtml(title);

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
          renderSetHeading({ children: safeTitle, size: "md" }) +
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
            children: "Edit <code>index.html</code> to begin.",
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
    children: themeBootstrap + page,
  });
}
