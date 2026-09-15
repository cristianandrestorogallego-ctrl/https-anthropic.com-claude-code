---
name: maracuya-storefront
description: Project skill for the MARACUYA mercado latino storefront in outputs/maracuya/prototype — a vanilla HTML/CSS/JS prototype, not yet a Shopify theme. Use when editing that storefront's markup, styles, data or render functions; when making visual or brand decisions about it; when asked how it gets administered or what is missing before it can go live on Shopify; or when planning the migration from the prototype to a Liquid theme. Carries the brand invariants, the architecture truth, the verification loop, and the launch and admin checklists so they are not re-derived or contradicted each session.
---

# MARACUYA mercado latino — project skill

**Internal skill.** It carries this project's specifics and is not for
distribution. No licence or attribution block applies.

## Architecture truth — read this before any Shopify claim

This project is a **standalone prototype in vanilla HTML, CSS and JS**,
living in `outputs/maracuya/prototype/` and published as a Claude Artifact.

It is **not a Shopify theme**. There is no Liquid, no `sections/`, no
`config/settings_schema.json`, no `templates/`. Nothing in this repository
is installable into a Shopify store as-is.

That distinction drives several rules:

- Never describe the current state as "a Shopify theme", "Shopify-ready",
  or "approved by Shopify". It is a design and behaviour prototype that a
  theme will later be built from.
- Requirements for the Shopify **Theme Store** (public distribution) do not
  apply. The agreed goal is a single merchant's own store. Only apply Theme
  Store rules if the user says distribution is the goal.
- The migration path is planned, not started. Read
  `references/shopify-migration.md` before doing or promising any of it.

## Brand invariants — these fire on every visual change

1. **The name carries no accent.** "MARACUYA", never "MARACUYÁ". This was
   changed deliberately across the logo outlines and all copy. The JS
   namespace `window.MARACUYA` was always unaccented and is unrelated.
2. **Fonts are pinned by the client's brand kit**: Georgia for display,
   Arial for body, both loaded from the system with no external font
   request. Do not substitute a "better" typeface. If typography needs to
   improve, improve scale, weight, tracking, measure and spacing — not the
   family. Raise a font change with the user as a brand decision.
3. **The logo SVGs in `brand/` are traced outlines from the official kit.**
   Edit them only by removing or moving existing path data. Never redraw a
   glyph, never substitute a font-rendered wordmark.
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
   grep -n 'rgba(255,248,236,' outputs/maracuya/prototype/styles.css
   ```

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
