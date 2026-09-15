# Prototype → Shopify theme migration

Load when the task involves Shopify, Liquid, theme structure, or "getting
this live".

## Verification status of this file

**Nothing here has been verified against `shopify.dev` from this project.**
The network egress proxy in the working environment blocks `shopify.dev`,
so the structure below is written from general knowledge of Shopify's
Online Store 2.0 theme architecture, not from a reading of the current
docs.

Treat every structural claim as *to be confirmed*, and confirm it before
writing theme files — architecture details and platform requirements change
and this file has no update cadence. When an item is confirmed against the
live docs, rewrite it in observed voice and drop it from this warning.

Sources to check first: the theme architecture reference, the Shopify CLI
reference, and Theme Check, all under `shopify.dev/docs/storefronts/themes`.

## What does and does not carry over

**Carries over more or less directly**

- `styles.css` — becomes `assets/` CSS. The token layer, the motif, the
  depth scale and the component rules are all platform-independent.
- `brand/*.svg` — become theme assets or files uploaded in the admin.
- The visual system as a whole: layout, rhythm, type scale, colour.

**Must be rebuilt, not ported**

- `data/products.js`, `data/offers.js` — replaced by real Shopify products,
  variants, collections and price rules. Products, prices and stock come
  from the platform; they stop being files in this repo.
- `render-*.js` — the render functions become Liquid sections and snippets.
  The hash router disappears; Shopify routes by URL.
- `logic.js` cart functions — replaced by the Shopify cart (AJAX Cart API
  or a cart template). **Do not port the custom cart.** Checkout is
  Shopify-hosted and is not themeable on standard plans.
- Delivery estimation — currently example rules in `config.js`. Real rates
  belong in Shopify shipping settings. Keep any on-page estimate clearly
  labelled as an estimate, or drop it.

**Has no Shopify equivalent and needs a decision**

- The recipe → ingredient-package builder. This is the project's most
  distinctive feature and Shopify has no native concept for it. Options:
  a custom section driven by metafields, a bundles app, or keeping it as a
  custom front-end that adds multiple line items to the cart. **Raise this
  with the user before the migration starts** — it shapes the whole build.
- WhatsApp ordering. Fine to keep as a contact affordance; it must never
  present itself as an order confirmation.

## Expected theme structure — confirm before use

Roughly:

- `layout/theme.liquid` — the shell. Required.
- `templates/` — `index.json`, `product.json`, `collection.json`,
  `cart.json`, `page.json`, `404.json`, and so on. Online Store 2.0
  templates are JSON files that compose sections.
- `sections/` — each with a `{% schema %}` block declaring its settings and
  presets, which is what makes it editable in the theme editor.
- `snippets/` — reusable fragments (product card, price, badge).
- `assets/` — CSS, JS, images, fonts.
- `config/settings_schema.json` and `settings_data.json` — global theme
  settings.
- `locales/` — translations. The storefront is Spanish for Spain; put copy
  in locale files rather than hardcoding it in Liquid.

## Mapping the current sections

| Prototype | Becomes |
|---|---|
| hero offers carousel | a section with a blocks-based slide list |
| categories grid | a collection-list section |
| offers rail | a collection section filtered to a sale collection |
| popular products | a featured-collection section |
| recipes | custom section, depends on the decision above |
| country grid | collection list, or metafield-driven |
| trust strip + payments | a section with icon/text blocks |
| footer | `sections/footer.liquid` with link-list blocks |

Rule of thumb: anything the merchant should be able to reorder, retitle or
switch off becomes a **section with a schema**. Anything fixed becomes a
snippet. A theme where the merchant has to call a developer to change a
heading has failed its main job.

## Requirements that apply, and requirements that do not

The agreed goal is **one merchant's own store**, not distribution. So:

- Shopify **Theme Store** requirements do not apply. Do not spend effort on
  them, and do not claim the theme meets them.
- Shopify **App Store** requirements do not apply either; this is not an app.
- What does apply: the theme must work in the theme editor, pass Theme
  Check, be accessible, perform reasonably, and respect the store's
  policy pages and legal requirements for selling food in Spain.

Never state that Shopify has approved or will approve the store. Report
what was checked and what was not.

## Practical notes

- Develop against a development store, never the live store.
- `shopify theme dev` for local preview, `shopify theme check` for the
  linter, `shopify theme push` to upload — confirm command names against
  the current CLI reference.
- Push to an **unpublished** theme and preview it. Publishing is the
  user's decision and needs their explicit go-ahead.
- Never commit API keys, Admin API tokens, storefront tokens or the
  `.shopify/` auth state to this repository.
