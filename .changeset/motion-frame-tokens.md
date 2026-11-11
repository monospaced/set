---
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
"@monospaced/set-config": minor
---

Frame periods for stepped graphic motion: `motion.frame.fast`, `default`, `slow` and `tick` are 83.333, 125, 166.667 and 333.333ms, the periods of a 24fps clock drawn on twos, threes, fours and eights. Generative and bitmap graphics throttle their redraws to one of them so a page shares one cadence. In wrfr they are 0, as that brand has no motion: a period of 0 means draw the composed still and stop.
