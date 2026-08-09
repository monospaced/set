---
"@monospaced/set-core": patch
---

Fix length-by-length division in `calc()`, which only Chrome supports.
In Firefox and Safari the invalid declarations were dropped at
computed-value time: the alert lost the icon/title column gap
entirely, and prose ordered-list heading markers fell back to
inherited line-heights. The alert gap keeps its token-driven
heading-to-body ratio via `tan(atan2())`, which performs the division
in all engines, and the prose markers use the leading tokens directly
as length line-heights — equivalent on a `::before`, no division
needed. Marker leadings are also retuned for alignment while here:
the tenth-onwards `h2` marker now uses leading-900 at all widths, and
the responsive `h3` marker inherits its line-height from the base
rule.
