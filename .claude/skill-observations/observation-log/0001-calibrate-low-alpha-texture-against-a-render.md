---
id: 1
title: "Low-alpha decorative texture must be calibrated against a render, never reasoned"
status: open
type: open-source
skill: [impeccable, frontend-design, ui-ux-pro-max]
proposes_skill: []
siblings_checked: "design-implementation skills: impeccable, frontend-design, ui-ux-pro-max — shared; any skill that directs a texture/overlay value inherits the same failure, all three added"
area: "craft floor — Depth section; texture and overlay values"
date: 2026-09-15
session_context: "Adding a seed-pattern brand motif to a storefront's tinted sections to fix a flat-looking page"
resolved:
resolution:
reference:
---

**Issue:** I introduced a repeating seed texture as a background motif and chose the
alphas by reasoning about what would read as "subtle" — rgba at .07 over cream, .10
over the deep brand colour, and .16–.22 for the seeds inside illustration tiles. Every
one of those was roughly double what the design could carry. In the render the texture
did not read as texture at all; it read as polka dots, and it actively damaged three
surfaces at once (tinted sections, the deep sections, and every product tile). Nothing
in the CSS looked wrong while writing it. The defect existed only in the rendered
result, and only a screenshot surfaced it.

**Suggested improvement:** The craft floor's Depth section covers shadows (offset plus
soft blur, no zero-offset halos) but says nothing about textures and overlays, which
fail in a different and less recoverable way. Add a rule: any decorative texture,
noise, grain or pattern overlay is a calibrated value, not a chosen one — ship the
first pass at roughly half the alpha that seems right, then confirm or raise it in the
batched inspection round. The asymmetry is the reason: a texture that is too subtle is
invisible and costs nothing, while one that is too strong reads as a pattern competing
with the content and makes the surface look cheaper than the flat version it replaced.
Worth naming explicitly that reasoning about alpha does not substitute for looking,
because the value that feels right in source is consistently too high.

**Principle:** Values whose whole purpose is to sit below conscious perception cannot
be specified by reasoning, because the author evaluates them in source where they are
fully legible rather than in the render where they must nearly disappear. For any such
value, bias the first guess toward the harmless failure and calibrate against the
rendered artefact — and prefer the direction whose error is invisibility over the
direction whose error is damage.
