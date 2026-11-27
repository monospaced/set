---
"@monospaced/set-tokens": minor
---

New layout tokens for the page header's block size: `layout.page.header.blockSize.current`, the size in effect, which `page` sets from its `headerSize`, and a step for each size, `sm`, `md` and `lg`, with `lg` growing from tablet. Custom CSS that must line up with the header, such as a sticky element below it, reads the `current` token instead of guessing the spacing step.
