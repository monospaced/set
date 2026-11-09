---
"@monospaced/set-config": minor
---

The Stylelint preset sets `reportNeedlessDisables: true`. A `stylelint-disable` comment that suppresses nothing now fails, so inline Baseline justifications are removed the moment the data makes them unnecessary. Consumers with stale disables of their own will see them reported.
