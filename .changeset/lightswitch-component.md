---
"@monospaced/set-core": minor
---

Add the lightswitch component.

`lightswitch` (Control/Lightswitch) is a two-state light/dark theme toggle
implementing the approach from Lea Verou's writing on dark mode
toggles: the control shows two states (the resolved theme) but
persists three. No stored value means the system preference is
followed; a stored `light`/`dark` in localStorage (exported constant
`SET_LIGHTSWITCH_STORAGE_KEY`, `set-theme`) overrides it. Activation
targets the opposite of the current resolved theme — and when that
target equals the system preference the override is cleared rather
than stored, so a choice matching the system is never silently
pinned. Storage is only evaluated on interaction; a system preference
change never rewrites a stored override.

The component is self-contained (no button component dependency):
an icon-only toggle button rendering both actions — a moon to switch
to dark, a sun to switch to light — with CSS showing the one opposing
the resolved theme, driven by `data-set-theme` on the Set root and
falling back to `prefers-color-scheme`. The control is therefore
correct before (and without) JavaScript. The `set-lightswitch` custom
element runtime (registered via `defineSetComponents()` or
`defineSetLightswitch()`) only persists the choice, applies it by setting
or removing `data-set-theme` on the closest Set root, and emits
`set-lightswitch-change` after each activation. Spec, CSS, tests, story,
and a generated React wrapper (with `onChange`) are included.

Adds the `moon` and `sunny` TDesign icons to the icon catalog.
