# Administration and launch

Load when asked about admin access, the owner's login, or publishing. For
what remains outstanding, the file is `references/pendientes.md`.

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

**The theme is not in the store any more** — as of 16 Oct 2026 `themes`
returns only Horizon (`MAIN`). If it is ever wanted back, the owner
installs it himself, because the Admin API's `themeCreate` takes a publicly
reachable zip URL and this environment has none:

1. Shopify Admin → Online Store → Themes
2. "Add theme" → "Upload zip file" → pick `maracuya-theme.zip`
3. It lands in **Theme library**, unpublished. Use **Preview** — never
   **Publish** — unless the owner says to publish.

Never publish a theme, and never write to the MAIN theme's files, without
the owner's explicit instruction for that specific action.

## Launch checklist — moved

**The live checklist is `references/pendientes.md`.** Read it there; do not
keep a second copy here, because two copies drift and the stale one gets
quoted. What used to sit in this spot was already wrong by October 2026: it
said the store was named "Mi tienda", that shipping rates were still
examples, and that the MARACUYA theme was waiting to be uploaded.

What belongs here instead is the division of labour, which has not changed:

**Only the owner can do these** — they need his identity, his bank details
or his gestor:

- The domain, and pointing it at Vercel (never at Shopify).
- Payment methods, with business and banking verification.
- Business, tax and invoicing details, including whether shipping carries
  21 % VAT in Spain. **That is a gestor's answer, not ours.**
- The NIF/CIF on the Sendcloud sender address.
- Real product data: prices, stock, allergens, ingredients, provenance.
- Product photography.
- Publishing anything.

**These are build work, and they are mine to do when asked**: wiring the
Storefront API so the app stops shipping a generated catalogue copy, the
privacy notice, the Brevo list and its Vercel variable, the frozen-goods
data behind `QUE_FALTA_CONGELADOS`, and the unsupported "Devoluciones en
14 días" line in the footer.

## Not to be claimed

Do not describe the store as ready, compliant, or approved. Report what was
verified and what was not. Publishing to a live store happens only with the
user's explicit instruction.
