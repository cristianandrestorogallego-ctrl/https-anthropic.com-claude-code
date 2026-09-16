# Administration and launch

Load when asked about admin access, the owner's login, publishing, or what
remains outstanding.

## How this store is administered

**Through Shopify Admin. There is no custom admin panel, and none should be
built.**

Once the storefront runs on Shopify, the platform already provides
authenticated, role-based administration. Building a parallel panel beside
it would duplicate Shopify's work, add an authentication surface nobody
needs, and create a second place where product data can disagree with the
first. The original brief allowed for a custom panel; the architecture
decision is that Shopify Admin fills that role.

The owner signs in at `admin.shopify.com` with their own Shopify account
and manages:

| Area | Where |
|---|---|
| Products, variants, prices, stock, images | Products |
| Categories and curated groups | Products → Collections |
| Orders, refunds, fulfilment | Orders |
| Discounts and offers | Discounts |
| Pages, navigation menus, blog | Online Store → Pages / Navigation |
| Visual theme settings, section order, copy | Online Store → Themes → Customize |
| Shipping zones, rates, delivery | Settings → Shipping and delivery |
| Payment methods | Settings → Payments |
| Taxes, legal and policy pages | Settings → Taxes / Policies |
| Staff access and permissions | Settings → Users and permissions |

Two access levels, never conflated:

- **Store owner / staff** — Shopify Admin. One owner account; additional
  people get staff accounts with only the permissions they need.
- **Customers** — the storefront's own customer accounts. These never
  reach admin functions.

## Rules for this project

- Never create default or shared passwords, and never put credentials in
  this repository or in chat.
- Never ask the user for a password. If something needs their
  authentication, describe the steps and let them perform it in their own
  session.
- Access to a store can only be granted by its owner, from
  Settings → Users and permissions. An agent cannot provision it.
- Development work uses a development store, not the live store.

## What the owner has to do — this cannot be done for them

These steps need the owner's own identity and payment details, so they are
theirs to perform:

1. Create the Shopify account and store, or provide access to an existing
   one, and choose a plan.
2. In Settings → Users and permissions, grant any collaborator or developer
   access that is needed.
3. Connect the domain.
4. Configure payment methods (card, and Bizum / PayPal if wanted) — this
   requires business and banking identity verification.
5. Complete the legal and tax details for selling food in Spain, and fill
   in the policy pages.

## Installing the theme (unpublished preview)

The theme lives at `outputs/maracuya/theme/` and is packaged to
`outputs/maracuya/maracuya-theme.zip`. Rebuild the zip with:

```
cd outputs/maracuya/theme
zip -rq ../maracuya-theme.zip assets config layout locales sections snippets templates -x '.*'
```

The owner installs it themselves, because the Admin API's `themeCreate`
takes a publicly reachable zip URL and this environment has none:

1. Shopify Admin → Online Store → Themes
2. "Add theme" → "Upload zip file" → pick `maracuya-theme.zip`
3. It lands in **Theme library**, unpublished. Use **Preview** — never
   **Publish** — unless the owner says to publish.

Never publish a theme, and never write to the MAIN theme's files, without
the owner's explicit instruction for that specific action.

## Launch checklist — status

**Store — exists**

- [x] Shopify store created: `yw4vyu-vf.myshopify.com`, Basic plan,
      EUR, Spain, timezone CEST. Still named "Mi tienda"; the live theme
      is Horizon.

**Blocked on the owner**

- [ ] Rename the store to MARACUYA mercado latino
- [ ] Domain
- [ ] Payment methods activated and verified
- [ ] Business, tax and invoicing details
- [ ] Real shipping zones and rates (the prototype's are examples)
- [ ] Policy pages: privacy, terms, returns, cookies — currently marked
      "pendiente" in the footer on purpose
- [ ] A real WhatsApp business number (`whatsapp.numberE164` is empty)
- [ ] Real product data: names, brands, prices, stock, allergens,
      ingredients, nutrition. Everything in the prototype is fictional.
- [ ] Product photography

**Build work**

- [x] The theme itself — `outputs/maracuya/theme/`, 38 files: layout,
      config, locales, 17 sections, 4 snippets, 10 templates, brand assets
- [x] Theme Check passing — `@shopify/theme-check-node` with
      `extends: theme-check:all` (86 checks): 0 errors, 0 warnings, 0 info
      across 39 files
- [ ] Upload the zip as an unpublished theme (owner's step, above)
- [ ] A decision on how the recipe package builder is implemented
- [ ] Accessibility and performance pass against the rendered theme —
      only static checks have run; nothing has been rendered by Shopify
- [ ] Test orders end to end

**Not to be claimed**

Do not describe the store as ready, compliant, or approved. Report what was
verified and what was not. Publishing to a live store happens only with the
user's explicit instruction.
