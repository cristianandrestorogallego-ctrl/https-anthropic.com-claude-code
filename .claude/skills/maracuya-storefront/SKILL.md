---
name: maracuya-storefront
description: Pointer to the MARACUYA mercado latino project memory, which lives in a different repository. Use whenever MARACUYA comes up — the Latin-American grocery for Spain, its web, its Shopify store, its shipping, its brand — and before quoting any figure about its catalogue or doing any work on it. Says which repository is the live web, how to attach it, and the few rules that hold even before the full memory is loaded.
---

# MARACUYA mercado latino — where the memory lives

**Internal skill.** No licence or attribution block applies.

## The full memory is not in this repository

It is in **`cristianandrestorogallego-ctrl/maracuya-mercado-latino`**, branch
`main`, at `.claude/skills/maracuya-storefront/`. That repository **is the
live web** — what lands on its `main` is what the user sees. Attach it before
doing anything:

```
add_repo(owner: "cristianandrestorogallego-ctrl", repo: "maracuya-mercado-latino")
git clone --depth 1 https://github.com/cristianandrestorogallego-ctrl/maracuya-mercado-latino /home/user/maracuya-mercado-latino
register_repo_root(... directory: "/home/user/maracuya-mercado-latino")
```

Then its skill loads and carries everything: the architecture truth, the
brand invariants, the verification loop, the two-writer protocol, the
pending-items checklist and the Shopify state.

## What this repository actually holds

`outputs/maracuya/` — none of it is the live web:

| | |
|---|---|
| `theme/` | The Shopify Liquid theme. Finished and verified, parked, not installed |
| `prototype/` | The original vanilla JS design study. Historical |
| `app/` | **A stale copy of the web.** 30 hand-written products, 7 categories, 8 countries |

**`app/` is the trap.** The live web has **172 products, 10 categories, 15
countries**. A session once read `app/` and told the user his web had 30; he
sees 172 and he was right. Never quote a catalogue figure from `app/`, and
never do design work there — it does not reach the user.

The two do agree on `src/lib/envio.ts`. If you change shipping in one, change
it in both.

## The rules that hold even before the full memory loads

1. **"MARACUYA", never "MARACUYÁ".** No accent, deliberately. The old names
   "Tienda Macondo" and "Mi tienda" are dead.
2. **Invent no commercial substance.** No reviews, ratings, certifications,
   stock figures, delivery guarantees or health claims. Allergens are the
   sharp edge: "sin gluten" is a legal claim, not copy. Unknown product data
   stays pending until a supplier's sheet says otherwise.
3. **Publish nothing to production** — no domain change, no theme publish, no
   service contracted — without the user's express authorisation.
4. **Every product in Shopify has one unit of stock** and a provisional price
   of 1,99 €. A test purchase consumes that unit; it ends by cancelling the
   order with restock ticked. The full list of traps is in the other repo.
5. **Two Claude Code projects write to that repository's `main`.** Fetch
   before starting, work on a branch, never force-push or rewrite history.
