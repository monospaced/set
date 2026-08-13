---
"@monospaced/set-core": minor
---

Add three typographic props: `linkVisited` on prose (matching text —
disable visited-link styling with `data-link-visited="off"`),
`opticalAlign` on heading (restored from calibrate — pulls the
heading into the margin by one side bearing so left sidebearing-heavy
glyphs align optically with the content edge, scaling with the
heading's own size via the em-based metric token), and `monospaced`
on text and prose (overrides `--set-word-spacing` to the monospaced
metric for all rendered content).
