---
"@monospaced/set-core": minor
---

Removes `Panel`. It was `Box` with a border, a larger radius, the panel background and a shadow, and the shadow lifted ordinary page sections off the page for no reason. Use `Box` with `border`, `radius` and `background: "panel"`; the surfaces that sit above the page have their own components, `Card`, `Menu` and `Sidebar`. The `--set-color-background-panel` token, Box's `background: "panel"` and Sidebar's inner panel stay.
