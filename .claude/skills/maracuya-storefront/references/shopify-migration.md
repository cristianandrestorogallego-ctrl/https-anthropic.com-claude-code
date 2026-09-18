# Prototype → Shopify theme migration

Load when the task involves Shopify, Liquid, theme structure, or "getting
this live".

## Verification status of this file

Direct HTTP to `shopify.dev` is blocked by the environment's egress proxy,
but the **Shopify MCP server reaches the docs**: use
`mcp__Shopify__search_docs_chunks` for Liquid and theme architecture, and
`mcp__Shopify__graphql_schema` for the Admin API. Use them instead of
recalling Liquid from memory — a wrong object name fails silently at
render time, with no error anywhere.

Confirmed against the docs while building the theme:

- Theme directory structure; only `layout/theme.liquid` is strictly
  required, and no template type is required — but a page type with no
  matching template cannot render.
- JSON templates set their layout with a `"layout"` attribute; Liquid
  templates use the `{% layout %}` tag.
- Legacy `templates/customers/*` are deprecated and must be left out, so
  the store gets the current customer-accounts experience.
- `{% form 'product', product %}` with `name="quantity"` and
  `{{ form | payment_button }}`.
- Cart form: `action="{{ routes.cart_url }}" method="post"`, with
  `name="checkout"`, `name="updates[]"` and `item.url_to_remove`.
- `{% paginate %}` and the `paginate` object: `pages`, `parts`,
  `current_page`, `previous`, `next`; `part.is_link`, `part.title`,
  `part.url`.
- `{% form 'storefront_password' %}` and `{% form 'customer' %}` with
  `contact[tags]` for the password page.
- `gift_card` object fields, and that `gift_card.liquid` cannot be JSON.
- `blog.previous_article` / `blog.next_article`.

Two traps found the hard way, both silent:

- **`| t:` takes one filter, not a chain.** `{{ 'k' | t: tags: x | join: ', ' }}`
  joins the *translated string*, not `x`. Build the argument with
  `{%- assign -%}` first.
- **`format_code` is not in the docs.** Filters that only appear in Dawn are
  not a specification. If the docs do not name it, do not use it.

## Linting the theme

`@shopify/theme-check-node` is the real gate and it runs offline:

```
npm install --no-audit --no-fund --prefix ./tc @shopify/theme-check-node
```

then call `themeCheckRun(root, configPath)` with a config of
`extends: theme-check:all` (86 checks). It caught a parser-blocking
`script_tag` that the Shopify docs themselves recommend. Run it before
every commit that touches the theme; the static reference sweep in
`outputs/maracuya/tools/verify_theme.py` complements it but does not replace it.

## Updating the uploaded theme without recreating it

`themeCreate` only makes a new theme, and the MCP server blocks theme
deletion, so incremental changes go through `themeFilesUpsert` on the
unpublished theme. There is no `THEME` staged-upload resource; use `FILE`.

1. `stagedUploadsCreate` with `resource: FILE`, one entry per file, the
   right `mimeType` (`text/plain` for `.liquid`, `text/css`, `font/woff2`).
2. POST each file to the returned target with every parameter as a form
   field, in the order given, and the file last. A 201 means it landed.
3. `themeFilesUpsert(themeId:, files: [{filename, body: {type: URL,
   value: <resourceUrl>}}])`. The `URL` body type is what keeps 65 KB of
   CSS out of the conversation — `TEXT` and `BASE64` also work but the
   content has to be transcribed exactly, which is how transcription bugs
   get in.
4. The mutation returns `upsertedThemeFiles: []` even on success; it is
   asynchronous. Verify by querying `theme(id:) { files(filenames: [...])
   { nodes { filename size updatedAt } } }` and matching the sizes.

Staged upload targets expire after a day, so do the POST right away.

## Self-hosted fonts

Fraunces and Outfit come from npm, not Google: `npm pack
@fontsource-variable/fraunces @fontsource-variable/outfit`, then take
`files/fraunces-latin-opsz-normal.woff2` (67 KB, carries the optical-size
axis the display face needs) and `files/outfit-latin-wght-normal.woff2`
(32 KB). Google Fonts is blocked by the egress proxy anyway.

The `@font-face` rules live in the `<style>` block in `layout/theme.liquid`,
not in `maracuya.css`, so the stylesheet stays static and the fonts can be
addressed with `asset_url`. Preload with the Liquid filter, never a hand
written tag — `{{ 'x.woff2' | asset_url | preload_tag: as: 'font', type:
'font/woff2' }}`. Theme-check's `AssetPreload` fails the hand written one,
and Shopify turns the filter into a `Link` header for Early Hints.

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
