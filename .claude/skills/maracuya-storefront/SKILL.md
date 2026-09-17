---
name: maracuya-storefront
description: Project skill for MARACUYA mercado latino, which lives in three codebases under outputs/maracuya — app (React + TanStack Start, the one under active development), theme (a verified Shopify Liquid theme, parked) and prototype (the original vanilla JS study). Use when editing any of them, when making visual or brand decisions, when asked which one is current or how they differ, when asked how the store is administered or what is missing before launch, or when planning work between them. Carries the architecture truth, the two competing design systems and which applies where, the brand invariants, the verification loop and the launch checklist, so none of it is re-derived or contradicted each session.
---

# MARACUYA mercado latino — project skill

**Internal skill.** It carries this project's specifics and is not for
distribution. No licence or attribution block applies.

## Architecture truth — three codebases, read before any claim

`outputs/maracuya/` holds three separate things. Confusing them is the
failure mode this section exists to prevent.

| Directory | What it is | Status |
|---|---|---|
| `app/` | React + TanStack Start + Vite + Tailwind v4 + shadcn/ui | **Active. Work here unless told otherwise.** |
| `theme/` | Shopify Online Store 2.0 theme, Liquid | Finished and verified; parked, not installed |
| `prototype/` | Vanilla HTML/CSS/JS single page | Historical. The original design study |

**`app/` is where development happens.** It began as a Lovable project the
user preferred over the prototype. Their Lovable access has lapsed, so the
app was made independent of Lovable: its own `vite.config.ts` replaces
`@lovable.dev/vite-tanstack-config`, and nothing under `src/` references
Lovable. Do not reintroduce that dependency, and do not assume the Lovable
MCP server or `lovable.dev` is reachable — the egress proxy blocks both.
A read-only clone of the user's GitHub mirror may sit at
`/home/user/maracuya-mercado-latino`; it is a source of assets, not the
place to work.

**`app/` is not a Shopify theme and cannot be uploaded to Shopify.** It is
React. Selling through it would mean wiring the Shopify Storefront API and
hosting it separately. The user was told this and chose React anyway.
`theme/` is the thing Shopify installs, and it is complete: run
`@shopify/theme-check-node` with `extends: theme-check:all` and it passes
0/0/0. It has never been uploaded to a store.

Never describe any of this as "approved by Shopify", "Shopify-ready" or
live. Nothing has been published, and nothing has been written to the
user's store.

## Brand invariants — these fire on every visual change

1. **The name carries no accent.** "MARACUYA", never "MARACUYÁ". This was
   changed deliberately across the logo outlines and all copy. The JS
   namespace `window.MARACUYA` was always unaccented and is unrelated.
2. **Two design systems exist, and they disagree. Match the one you are
   editing; never merge them without the user's say-so.**

   | | `app/` (active) | `theme/` and `prototype/` |
   |---|---|---|
   | Ground | Cream `oklch(0.977 0.014 88)` | Cream `#FFF8EC` |
   | Primary | Green `selva` `oklch(0.27 0.06 158)` | Purple `#4B204F` |
   | Accent | `maracuya` `oklch(0.82 0.16 82)` | `#F4C542` |
   | Display | Fraunces (Google Fonts) | Georgia |
   | Body | Outfit (Google Fonts) | Arial |
   | Motif | Photography | Drawn passion-fruit seeds and rind arc |

   The user chose the green system by preferring it on sight. Do not
   "restore" the purple one in `app/`, and do not push green into `theme/`
   unless asked. A font or palette change is a brand decision: raise it,
   do not make it.
3. **The logo SVGs are traced outlines from the official kit** — in
   `prototype/brand/`, `theme/assets/` and `app/src/assets/`. Edit them
   only by removing or moving existing path data. Never redraw a glyph,
   never substitute a font-rendered wordmark.
4. **Never invent commercial substance.** No reviews, ratings, certifications,
   real brand names, stock figures, delivery guarantees or health claims.
   Product brands in the catalogue are fictional on purpose, to avoid
   trademark and impersonation risk — keep them fictional even when copying
   the layout of a reference site that uses real ones. Unknown product data
   uses the `PENDING` sentinel and renders as "pendiente de confirmar".
5. **Everything on the site is a demonstration** and says so. The demo
   notices in the header strip and footer are load-bearing, not decoration.

## The verification loop — do not skip, do not extend

Work in bounded passes: build the whole change, inspect once in a batched
round covering desktop and mobile together, fix everything that round shows
in one batch, confirm with at most one more round, then stop.

In `app/` the gates are the project's own, and all three must pass before
a change is done:

```bash
cd outputs/maracuya/app
bun run build        # compiles, and regenerates src/routeTree.gen.ts
bunx tsc --noEmit    # tsconfig is strict; this catches what the build does not
bun run lint         # prettier is enforced; `bun run format` fixes it
```

`react-refresh/only-export-components` warnings are inherent to shadcn's
pattern — they are expected, and are not errors. Chromium for screenshots
is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; pass
`executablePath` and `args: ['--no-proxy-server']` or Playwright tries to
download a build it cannot reach. Google Fonts is blocked by the proxy, so
Fraunces and Outfit fall back to their local stacks in screenshots taken
here — that is the environment, not a bug.

Before calling any visual change done:

1. Screenshot desktop (1280) and mobile (390) in the same run.
2. Confirm zero `pageerror` and zero console errors.
3. Confirm no horizontal scroll at 390px.
4. Run the functional regression (menu focus handling, recipe package
   maths, cart, variants, filters) — a visual change that breaks the
   package calculator is a failed change.
5. Check that new colour pairs meet WCAG AA, **in both themes**. The
   recurring bug in this project is hardcoded cream text on `var(--primary)`:
   it passes in light mode and drops to about 3:1 in dark mode, where
   `--primary` becomes a light purple. Use `--on-primary-soft`, never a
   literal `rgba(255,248,236,…)`, on any surface painted with `--primary`.
   This check catches it:

   ```bash
   grep -n 'rgba(255,248,236,' outputs/maracuya/prototype/styles.css \
                               outputs/maracuya/theme/assets/maracuya.css
   ```

   This trap is specific to the purple codebases. `app/` states every
   colour as an oklch token pair in `src/styles.css`; check those instead.

   Every hit must sit on a hardcoded dark ground (the hero scrim, a
   `rgba(0,0,0,…)` overlay), not on `var(--primary)`.

## Reference files — load on the stated trigger

- `references/design-system.md` — tokens, the passion-fruit motif, depth
  scale, component conventions and the traps this codebase has already hit.
  **Load before editing `styles.css` or any render function that emits
  markup.**
- `references/shopify-migration.md` — how each prototype piece maps to a
  Liquid theme, what has to change, and what cannot carry over.
  **Load when the task involves Shopify, Liquid, theme structure, or
  "getting this live".**
- `references/admin-and-launch.md` — how the store is administered, what
  the owner manages where, and what is still missing before launch.
  **Load when asked about admin access, the owner's login, publishing, or
  what remains outstanding.**

## Before you hand work back

Re-read this file's brand invariants against what you just produced, and
confirm each of the five holds. Rules written down are not reliably
followed during a long build; this re-read is the step that catches the
drift. Then state plainly what you verified and what you could not.
