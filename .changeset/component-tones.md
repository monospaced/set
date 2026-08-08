---
"@monospaced/set-core": minor
"@monospaced/set-system": minor
"@monospaced/set-tokens": minor
---

Give each status component its own tone vocabulary.

The shared `SetStatusTone` union forced alert, banner, and badge to accept
tones that made no sense for them (a persistent site-wide "success" banner;
an "info" state on a badge). Each component now declares the tones it can
honestly express:

- `SetAlertTone` — `info | success | warning | error` (unchanged set; alert
  keeps its per-tone icon and ARIA role mapping)
- `SetBannerTone` — `info | warning | error`
- `SetBadgeTone` — `success | warning | error | pending | live | notification`

The new badge `notification` tone names the attention-signal use the
`floating` prop was built for (unread counts). It reads the `intent.info`
tokens: informational salience, not alarm.

BREAKING: `SetStatusTone` is removed. Banner no longer accepts
`tone: "success"`; badge no longer accepts `tone: "info"`.

BREAKING: the `status` token group is renamed `intent`, and `error` is
renamed `danger` within it (`--set-color-status-*` → `--set-color-intent-*`,
with `--set-color-status-error-*` becoming `--set-color-intent-danger-*`).
The group names the communicative purpose of deploying a color, not a state
of the world — its members were never all statuses (`info` and `danger` are
broader roles), and the purpose framing leaves room for future non-status
intents. Component tones keep naming meanings; intent tokens name the
color's role.

The untoned alert default now renders a `sticky-note` icon (new in the
curated icon set) instead of sharing `info-circle` with the `info` tone —
the neutral "note/aside" voice and the informational severity claim are
visually distinct.

New `intent.pending` and `intent.live` color tokens (default + subtle) in
both brands and themes; in the monochrome `wrfr` brand they match the
existing intents. All `mnsp` light-theme intent defaults now sit uniformly
at step `800` (info and danger were `1000`), and the light avatar ramps
shift to `900/1000/1100` — no avatar slot shares an exact hex with any
intent token.

The mnsp avatar palette swaps `blue` for `violet` (slots 04-06; same
steps), becoming `rose`/`violet`/`orange`. Fallback avatars mark accounts
that have not chosen an image, so hues must not read as avatar-adjacent
signals: blue sat one step from both the notification azure and violet,
and is earmarked for `ai`. `orange` harmonizes with the unpersonalized
state (identity pending), `rose` and `violet` stay inert.
