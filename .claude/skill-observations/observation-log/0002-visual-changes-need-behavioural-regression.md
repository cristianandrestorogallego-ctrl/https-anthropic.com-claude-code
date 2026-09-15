---
id: 2
title: "A purely visual change can break behaviour through timing; screenshots and linters cannot see it"
status: open
type: open-source
skill: [impeccable, frontend-design, ui-ux-pro-max]
proposes_skill: []
siblings_checked: "design-implementation skills: impeccable, frontend-design, ui-ux-pro-max — shared; every skill that prescribes a verification loop for UI work inherits the gap, all three added"
area: "craft floor — Verify section; the batched inspection round"
date: 2026-09-15
session_context: "Adding depth, texture and motion to a storefront that was described as visually flat"
resolved:
resolution:
reference:
---

**Issue:** I made a large but strictly visual change — shadows, background
textures, a curved section divider, richer gradients on about forty tiles. No
markup semantics changed and no behavioural code was touched. Screenshots at
two breakpoints looked right, the mechanical design detector came back with
only false positives, and there were zero console and page errors. The change
looked fully verified.

The behavioural regression suite then failed one assertion: opening the
navigation menu no longer moved focus into it. Root cause was timing. The
overlay focused its first element on a hard-coded `setTimeout(…, 50)`, and the
panel's `visibility` was part of a CSS transition, so "visible" arrived partway
through the animation. The heavier stylesheet pushed the first style
recalculation past the 50ms mark, so `.focus()` was called while the panel was
still `visibility:hidden` — which fails silently, with no exception. Keyboard
and screen-reader users lose the menu entirely; every other signal stays green.

**Suggested improvement:** The craft floor's Verify list covers the rendered
result — contrast, spacing, type, motion, states — and the batched inspection
round is defined in terms of screenshots and defect scans. Neither can observe
this class. Add to the verification step: after any visual change, re-run the
project's behavioural tests, and treat focus management, overlay open/close and
keyboard traps as part of the check rather than as untouched code. Worth stating
the mechanism so the reason is memorable: CSS changes how long the browser takes
to reach a given state, and any code that depends on a fixed delay to reach that
state has a hidden coupling to the stylesheet's weight. Where such a timing
dependency is found, the fix is to wait for the observable condition rather than
tune the constant.

**Principle:** "I only changed how it looks" is a claim about intent, not about
the blast radius. Presentation and behaviour are coupled through time, and the
verification instruments for presentation — rendered captures, static analysis —
are blind to timing by construction, so they return green on exactly the
failures they cannot observe. Any change large enough to alter how long a
rendering step takes must be verified against behaviour too, and a fixed delay
standing in for a condition is the coupling to look for first.
