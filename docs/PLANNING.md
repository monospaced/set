# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Heading display sizes

#### What’s being added to or changed in Set

##### Tokens

Add type scale steps 1400 (180px), 1500 (240px) and 1600 (360px), each with size, line height and width. Type steps stay weightless: weight lives in the composites.
Add responsive-only composites `display-sm`, `display-md`, `display-lg` and `display-xl`: the `3xl` properties at baseline, and their caps on steps 1300 to 1600 at a new `desktop` typography size context (90em, where the fluid sizes reach their caps). Each is the two-step form of a fluid Heading size, whether or not anything consumes it yet.
Remove the `5xl` composites, static and responsive. Step 1200 keeps its type-step tokens and loses its composite.
Add named semantic weights `light` (300) and `thin` (100) for the display CSS to clamp against.
Add weight primitives 150 and 125 (116) for the display-sm and display-md composites, rounded like the rest of the scale, and width primitives for 87.5%, 85% and 82.5%.
wrfr mirrors mnsp. Its font has no condensed cut and bottoms out at weight 300, so its new width primitives are 100 and its new weight primitives are 300, like the rest of its scale.

##### Heading

Remove 5xl. Minor bump, since we're in 0.x. Existing 5xl becomes `display-sm`, or `4xl` if that doesn't work after an eyeball.
Add three fluid sizes: `display-sm` (48 to 120px), `display-md` (48 to 180px) and `display-lg` (48 to 240px). `responsive` is a no-op on display sizes.
On display sizes, width, weight and line height scale with the rendered size.
Static `4xl` moves to the `3xl` step, so it only differs from `3xl` with responsive on, where it steps up above the breakpoint. Responsive `4xl` on narrow takes the whole `3xl` composite (48px, weight 300, 95%), down from 62. Wide stays at 84.
Add `overflow-wrap: break-word`. `text-wrap: balance` is already there.

##### Container

Open question. `container-type: inline-size` lets the display sizes scale with their container, and Grid already sets it, but it also adds layout containment, which makes Container the containing block for `position: fixed` descendants. Check for those before deciding. Without it, `cqi` resolves against the viewport including gutters, and the character floor becomes 9 rather than 10. The work stands either way.

#### What's wrong now

- `5xl` is 5.25rem, and responsive `5xl` is 5.25rem on narrow screens, 7.5rem on wide ones. At 320, that fits 6 characters.
- Responsive `4xl` fits 8 characters at 320, so "Preferences" overflows.
- Responsive only ever scales up.

#### The floor

**48px (3rem, `3xl`), fitting at least 10 characters at 320** (288px of content once the 16px gutters are taken off). "MONOSPACED" fits.

#### Width, weight and line height follow the rendered size

One curve each, used by every display step, so a display heading at the floor looks like `3xl`:

| Property    | Curve                          | Range     |
| ----------- | ------------------------------ | --------- |
| Width       | 100% − 6.4 × ln(size ÷ 24px)   | 82.5–100% |
| Weight      | 300 × (size ÷ 48px)^−0.72      | 100–300   |
| Line height | 1.25 − 0.273 × ln(size ÷ 48px) | 1–1.25    |

The width curve matches Set's existing widths to within about half a percent from 28px to 120px, with `3xl` the furthest out (95.6% against 95%). The line height constant is 0.273 rather than the fitted 0.2728 so the curve lands fractionally under 1 at 120px; with 0.2728 floating point left it fractionally over, and the 6px round-up pushed 120 to 126.

The weight curve passes through Set's existing heading weights (300, 250, 200 at 48, 62, 84) to within one unit. A log curve can't, because the drop slows as size grows, so weight uses a power curve. It reaches the 100 floor at about 220px. Berkeley Mono's weight axis bottoms out at 100, so 100 is the floor.

| Size        | 48    | 62    | 84  | 120 | 180   | 240 | 360   |
| ----------- | ----- | ----- | --- | --- | ----- | --- | ----- |
| Width       | 95.6% | 93.9% | 92% | 90% | 87.5% | 85% | 82.5% |
| Weight      | 300   | 249   | 200 | 154 | 115   | 100 | 100   |
| Line height | 1.25  | 1.18  | 1.1 | 1   | 1     | 1   | 1     |

#### New scale steps and composites (tokens)

| Step          | Size           | Line height | Width | Weight | Composite (desktop) |
| ------------- | -------------- | ----------- | ----- | ------ | ------------------- |
| 1300 (exists) | 7.5rem (120)   | 1           | 90%   | 150    | `display-sm`        |
| 1400          | 11.25rem (180) | 1           | 87.5% | 116    | `display-md`        |
| 1500          | 15rem (240)    | 1           | 85%   | 100    | `display-lg`        |
| 1600          | 22.5rem (360)  | 1           | 82.5% | 100    | `display-xl`        |

- [x] Add steps 1400, 1500 and 1600 (size, line height, width), published as type-step tokens
- [x] Add weight primitives 150 and 125 (116), and width primitives for 87.5%, 85% and 82.5%
- [x] Add semantic weights `light` (300) and `thin` (100)
- [x] Remove the `5xl` composites, static and responsive
- [x] Add responsive-only `display-sm` to `display-xl` composites: `3xl` at baseline, the cap at a new `desktop` typography size context. No static display composites: a static one can't say what the size does below its cap
- [x] `display-xl` (1600) is for loose and free modes only. Heading doesn't use it.
- [x] Repeat in wrfr

The comps went above 240 only for giant short words in bold condensed type (Hello, LULL, 394, 68%). That's voice type, which loose and free modes set with their own cuts. Display-style headings sat at 140–240.

Each composite is the two-step form of a fluid Heading size: `3xl` until desktop, then the cap. Heading is one consumer, and scales between the two fluidly instead; the composite documents how the size should behave without container queries.

#### Heading display sizes (fluid)

Each runs in a straight line from the floor at 288px of content to its cap at 1376px (a wide container at 1440, minus 32px gutters).

| Size         | Cap | Fluid value          | 288 | 352 | 704 | 1216 | 1376 | Characters      |
| ------------ | --- | -------------------- | --- | --- | --- | ---- | ---- | --------------- |
| `display-sm` | 120 | 1.809rem + 6.62cqi   | 48  | 52  | 76  | 109  | 120  | ≥10 (20 at cap) |
| `display-md` | 180 | 0.816rem + 12.13cqi  | 48  | 56  | 98  | 161  | 180  | ≥10 (14 at cap) |
| `display-lg` | 240 | −0.176rem + 17.65cqi | 48  | 59  | 121 | 212  | 240  | ≥10 (10 at cap) |

When size changes in a straight line with width, the character count only moves in one direction, so "at least 10" holds at every width. The counts count characters with no spaces. Set's default word spacing is negative, so lines with spaces fit slightly more.

The offsets and rates above are not tokens. The CSS derives the line from tokens instead: floor and cap from type steps, the two content widths from the baseline breakpoint minus two default gutters and the wide container max width minus two wide gutters. This table is the test oracle.

- [x] Remove `5xl`. `display-sm` replaces it.
- [x] Add `display-sm`, `display-md` and `display-lg` to Heading
- [x] Token descriptions give the character guarantee, for example "Fits at least 10 characters at any width."

```css
/* Sketch: names are illustrative, every raw value has a token in the real thing */
.set-heading[data-size^="display-"] {
  --floor: var(--set-typography-type-step-1000-font-size);
  --min-content: calc(
    var(--set-breakpoint-baseline) - 2 *
      var(--set-layout-container-gutter-default)
  );
  --max-content: calc(
    var(--set-layout-container-max-width-wide) - 2 *
      var(--set-layout-container-gutter-wide)
  );
  /* tan(atan2(a, b)) gives a / b as a number */
  --progress: clamp(
    0,
    tan(
      atan2(
        100cqi - var(--min-content),
        var(--max-content) - var(--min-content)
      )
    ),
    1
  );
  --size: calc(var(--floor) + (var(--cap) - var(--floor)) * var(--progress));
  --ratio: tan(atan2(var(--size), var(--floor)));
  font-size: var(--size);
  font-stretch: clamp(
    var(--set-typography-type-step-1600-font-stretch),
    calc(
      (
          100 - 6.4 *
            log(
              tan(
                atan2(
                  var(--size),
                  var(--set-typography-type-step-500-font-size)
                )
              )
            )
        ) *
        1%
    ),
    100%
  );
  font-weight: clamp(
    var(--set-typography-font-weight-thin),
    calc(var(--set-typography-font-weight-light) * pow(var(--ratio), -0.72)),
    var(--set-typography-font-weight-light)
  );
  /* stylelint-disable-next-line plugin/use-baseline -- round() keeps the 6px line grid; degrades to an unrounded line height */
  line-height: round(
    up,
    calc(
      var(--size) *
        clamp(
          var(--set-typography-type-step-1600-line-height),
          calc(1.25 - 0.273 * log(var(--ratio))),
          var(--set-typography-type-step-1000-line-height)
        )
    ),
    var(--set-spacing-vertical-400)
  );
  overflow-wrap: break-word;
}

.set-heading[data-size="display-sm"] {
  --cap: var(--set-typography-type-step-1300-font-size);
}
.set-heading[data-size="display-md"] {
  --cap: var(--set-typography-type-step-1400-font-size);
}
.set-heading[data-size="display-lg"] {
  --cap: var(--set-typography-type-step-1500-font-size);
}
```

- `log()`, `pow()`, `tan()`, `atan2()`, `cqi` and `container-type` pass the repo's Baseline lint. `round()` does not, so it carries a justified disable. Checked against the repo Stylelint config.
- The gutter token is 1rem on narrow and 2rem from 48em. The sketch names a wide gutter token for the max content width; if there isn't one, check whether the live gutter token gives the table's values or the breakpoint tokens are needed instead.
- If the maths is too clever for Set, step width, weight and line height at the container breakpoints instead.

**`cqi` needs a size container.** See Container above. Without one, `cqi` falls back to the small viewport width, gutters included, and the numbers above shift: the floor becomes 9 characters.

**Measured in Chromium 158, with the shipped CSS and Berkeley Mono, inside a padded `container-type: inline-size` box.** Sizes land on the table within a pixel at 320, 384, 1280 and 1440, and the caps are exact: 120, 180 and 240 at weights 155, 116 and 100, widths 89.5%, 87% and 85.25%, line heights 120, 180 and 240. At 768 they run large (76.8, 100.8 and 124.8 against 76, 98 and 121) because the live gutter token is 2rem there, which pulls the derived minimum content width down to 256. "MONOSPACED" fits at every width and size; the tightest is display-lg at 768, at 10.1 characters. Berkeley Mono advances 0.583em per character at 95.5% width and 0.545em at 85.25%, close to the assumed line. Making the mid-range exact would take a static pair of content-width tokens (18rem and 86rem) in place of the gutter derivation.

**Checked in Chrome 156.** The original offset-and-rate sketch gives every size in the table above to the pixel, inside a padded `container-type: inline-size` box. The fluid widths come out within 0.5% of the table: 89.5% at 120, 87% at 180 and 85.25% at 240, because the table rounds to Set's values. The static tokens keep the rounded values and the fluid curves stay approximate.

#### Responsive t-shirt sizes

Responsive still steps up one size on wide, but never goes above the 48px floor on narrow. Only `4xl` changes:

| Responsive | Narrow                             | Wide           |
| ---------- | ---------------------------------- | -------------- |
| `3xl`      | 48                                 | 62 (unchanged) |
| `4xl`      | 48, whole `3xl` composite (was 62) | 84 (unchanged) |

- [x] Responsive `4xl` on narrow: the `3xl` composite (3rem, weight 300, 95%), down from 3.875rem
- [x] Static `4xl`: the `3xl` composite too, so `4xl` only grows with responsive on
- [x] Smaller sizes need no change: they're already 48 or less on narrow

#### Overflow safety net

- [x] Heading gets `overflow-wrap: break-word`. This is the only thing that stops a long capitalised word overflowing in Chrome.

### Checks before finalising

- [x] Advance per character. The counts assume about 0.6em at 100% width and about 0.45em at 60%, varying in a straight line between them. Measure Berkeley Mono at 82.5–95.6%.
- [x] Every display size at 320, 384, 768, 1280 and 1440, with "MONOSPACED", against the fluid table
- [ ] Weight 100 at 240 and above, and 115 at 180, by eye
- [ ] Existing 5xl usages (Poster story, skills examples) as `display-sm`, by eye
- [x] mnsp and wrfr: new display steps and composites

## Next

What we could be working on next.

## Later

Everything we could attempt given sufficient time and resources.

### Sibling surface deltas

Let `brandSecondary` and `brandTertiary` emit only what differs from `brand` instead of a full token set: widen the brand selectors in the resolver to match all three, and add a per-context opt-out of full emission in the pipeline. Roughly 60% of the generated CSS growth from the surface family.

### Contrast audit

A `system:audit` script that checks every surface's foreground tokens against its page, panel and subtle backgrounds at the bands the default surface establishes, so tuning a primitive can't silently break a surface.

### Icon weight

Consider 80% icon opacity when paired with text.

### Semantic color evolution

- rose = favorite
- blue = ai
- chartreuse = highlight

### Component evolution

#### Factory

- `Control/Listbox` (JS required, selection semantics)
- `Control/Select` (native select with thin styling)
- `Control/Form` (if it becomes a real stateful runtime abstraction)
- `Control/Tag` (delete, remove, select)
- `Status/Progress` (updating)
- `Status/Skeleton` (resolve to loaded)
- `Status/Toast` (dismissible, timer)
- `Structure/Accordion` (JS for exclusive)
- `Structure/Breadcrumb` (JS responsive)
- `Structure/Code` (copy to clipboard)
- `Structure/Tabs` (JS required, a11y)

#### Size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button, Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.
- Lightswitch with size lg is the same as size md if appearance is outline or solid.

### Version documentation

Post first release, serve the latest release at `/`, `main` at `/next/*`, and pinned older releases at `/v0.x/*`. Each release publishes an immutable static archive proxied from the main site via `_redirects`; until then the docs (and bundled Storybook) stay a single rolling tier built from `main`.

### Stylelint 18 and TypeScript 7

Waiting on upstream.

- **Stylelint 18:** needs `stylelint-declaration-strict-value`, `stylelint-plugin-logical-css` and `stylelint-plugin-use-baseline` to accept it.
- **TypeScript 7:** needs `typescript-eslint` to support it.

### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension`/`$duration` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics
  - consider extracting `resolveAllContextPermutations` into a single module-level call shared by `prepare-sd-contexts.mjs` and `prepare-json-output.mjs` — eliminates duplicate resolution and stage drift risk. May be obsolete if SD's native consumption removes the per-stage iteration entirely.

### Vue framework adapter

Validate that the `packages/adapter` SPEC walker and emitter generalises by authoring a second emitter alongside `src/react`. A small archetype floor (Button, Banner, Page, Menu — pass-through + slotted + CE + events).

### iOS / Android token emit targets

Speculative. Style Dictionary ships built-in iOS Swift, Android XML, and Compose formats; adding them potentially an SD platform extension on top of the existing CSS pipeline.
