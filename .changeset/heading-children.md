---
"@monospaced/set-core": minor
---

Heading content is now `children` (was `text`) and renders as inline markup rather than escaped text, matching Text — so headings can carry links, e.g. `children: processMarkdownInline("A heading with [a link](/)")`. Links inside a heading pick up the prose link styles, and the new `linkVisited` prop (default `true`) turns visited-state styling off, as on Text. In React, `Heading` takes `ReactNode` children: `<Heading level={1}>Hello</Heading>`.

Breaking: rename `text:` to `children:` in `renderSetHeading`/`buildSetHeading` calls, and `<Heading text="…" />` to `<Heading>…</Heading>`. The content is no longer escaped — escape or sanitize untrusted strings before passing them in.
