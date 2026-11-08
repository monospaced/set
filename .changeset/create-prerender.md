---
"@monospaced/create-set": minor
---

Add the `prerender` variant (`--variant prerender`): pages are render functions in `src/pages`, prerendered to static HTML at build time by a Vite plugin, with one shared head in `src/document.ts` and per-page title and description. Both variants now discover pages by folder, so adding a page is adding a folder with an `index.html`.
