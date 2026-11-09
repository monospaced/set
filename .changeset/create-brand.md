---
"@monospaced/create-set": minor
---

Add a brand prompt and `--brand mnsp|wrfr` (default `mnsp`). The project imports that brand's stylesheet from core, `styles/mnsp.css` or `styles/wrfr.css`, rather than both, and sets `brand` on `Root` in every variant. Generated code and the CLI escape text with core's `escapeHtml`.
