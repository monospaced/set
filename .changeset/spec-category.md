---
"@monospaced/set-core": minor
---

Every component SPEC declares a `category`, one of `control`, `environment`, `graphic`, `layout`, `navigation`, `status`, `structure` or `typographic`, so the grouping Storybook shows travels with the published package. `SET_COMPONENT_CATEGORIES` lists them and `specToStoryTitle` derives the `Category/Name` title Storybook now reads from the SPEC.

Grid and GridItem describe their span and start tiers as container widths rather than breakpoints, since the tiers are container queries on the parent, and Grid says it responds to its container.
