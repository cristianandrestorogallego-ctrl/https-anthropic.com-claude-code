# Design system — MARACUYA storefront

Load before editing `styles.css` or any render function that emits markup.

## Palette (from the client's official brand kit)

| Token | Light | Role |
|---|---|---|
| `--bg` | `#FFF8EC` | page ground, cream |
| `--surface` | `#FFFFFF` | cards, panels |
| `--surface-alt` | `#F7EEDD` | tinted sections |
| `--primary` | `#4B204F` | brand purple |
| `--accent` | `#F4C542` | brand yellow |
| `--leaf` | `#456B50` | recipe / package green |
| `--ink` | `#302536` | body text |

Dark mode is a real supported theme, declared twice — once under
`@media (prefers-color-scheme: dark)` guarded with
`:root:not([data-theme="light"])`, once under `:root[data-theme="dark"]`.
**Both blocks must be edited together.** A token added to one and not the
other produces a bug that only appears under one theme.

In dark mode `--primary` inverts to a *light* purple `#B978BE` and
`--on-primary` becomes dark. Anything painted on `--primary` must use
`--on-primary` / `--on-primary-soft`, never a literal cream.

Brand rule inherited from the kit: **never cream text on the yellow.** Use
`--on-accent` (purple) on any accent-filled surface.

## The motif — a halved passion fruit

The logo is a passion fruit cut in half: a dome, a lit pulp centre, seeds,
a cream rind. Before this was applied the site read flat, because it used
none of its own geometry. Three expressions, all built from existing hues:

1. **Seeds as ground texture** — `.section-alt`, `.section-deep`,
   `.page-hero` and the promo strip carry a `::before` of five offset
   radial pips per 210×180 cell, at `--seed-ink` / `--seed-cream`.
2. **The tile treatment** — every `.tile-*` is a cross-section: seeds over
   a pulp highlight off-centre, a rind darkening at the opposite rim, and
   an `::after` inset ring. Categories supply only two hues
   (`--tile-a`, `--tile-b`); the layering is shared.
3. **The rind arc** — `.section-deep::after` is a dome that overlaps
   upward into the preceding section, so deep bands meet the page on a
   curve rather than a rectangular cut. This is what gives the scroll its
   rhythm; do not flatten it back into a straight edge.

**Texture alpha is calibrated, never reasoned.** The first pass of these
seeds shipped at roughly double the workable alpha and read as polka dots
in the render while looking correct in the source. Any new texture, grain
or overlay starts at about half the value that feels right and is confirmed
against a screenshot. Too subtle costs nothing; too strong damages the
surface.

## Depth

`--shadow-sm` → `--shadow-card` → `--shadow-card-hover` → `--shadow-md` →
`--shadow-lg`. Every step carries an offset and a soft blur; no zero-offset
coloured halos, no hard block shadows.

Cards (`.product-card`, `.recipe-card`) lift 4px on hover with
`--shadow-card-hover` and a `--border-strong` edge, eased with
`--ease-out`. All motion sits behind
`@media (prefers-reduced-motion: no-preference)`.

## Conventions this codebase holds to

- **Icons are drawn SVG** from `ICONS` in `icons.js`, one stroke weight.
  No emoji, ever, standing in for an icon.
- **Flags are hand-coded SVG** in `FLAGS`, not emoji — emoji flags do not
  render on Windows and several Android builds.
- **No eyebrow / kicker above a heading.** Section headers carry a
  descriptive subtitle *below* the `h2` instead (`.section-subtitle`).
- **Browser surfaces are themed**: `::selection`, scrollbar thumb and
  track, `caret-color`, focus ring. Do not let them fall back to defaults.
- **Full-bleed overlays need `visibility`, not just `transform`.** The
  mega-menu and cart drawer hide with `transform:translateX(100%)` *and*
  `visibility:hidden`, because their `vw`-based width does not account for
  the scrollbar gutter and a transform alone leaves a ~15px sliver painted
  on every page.
- **Focus survives re-render.** `render()` replaces innerHTML wholesale, so
  `withFocusPreserved()` restores focus by element **id**, not by node
  reference. Any new interactive control that triggers a re-render needs a
  stable `id` or focus is lost on click.
- **No false affordances.** `syncRailNav()` hides the offers-rail arrows
  when the rail cannot scroll. Apply the same logic to any new control.

## Type

Georgia display, Arial body — pinned, see SKILL.md. Scale runs from
`.72rem` badges to a `clamp(1.75rem, 3.6vw, 2.7rem)` section heading and a
`clamp(2.2rem, 5.5vw, 3.6rem)` hero. Display sizes carry negative tracking
(`-.018em` to `-.022em`); body copy is capped near 52–60ch.
