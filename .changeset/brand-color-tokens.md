---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Color primitive rebalance and translucent subtle backgrounds.
Deepen every mnsp hue's 300 step for clearer separation from 200;
retarget the mnsp `alpha.brand` primitives from the legacy Measured
blue to brand cyan (`#007c7c`); add an `alpha.black.02` primitive to
both brands and alias the light-theme `background.subtle` to it, so
subtle surfaces tint whatever they sit on instead of pinning to an
opaque ramp step.
