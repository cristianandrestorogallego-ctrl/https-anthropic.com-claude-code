---
id: 3
title: "A shorter-indented search string is a substring of its deeper-indented twin"
status: open
type: open-source
skill: []
proposes_skill: [structured-source-editing]
siblings_checked: "no family registry exists yet; the finding is tool-agnostic and belongs to whichever skill owns programmatic source editing — proposed rather than filed against an existing skill"
area: "programmatic edits to indented source (CSS, YAML, JSON, nested config)"
date: 2026-09-16
session_context: "Editing a stylesheet whose design tokens are declared three times — once for light, twice for dark — at two different indent depths"
resolved:
resolution:
reference:
---

**Issue:** A stylesheet declared the same token block three times: once at two-space
indent for the light theme, once at four-space indent inside a media query, and once
at two-space indent under an attribute selector. Editing them with
`str.replace(old, new)` where `old` began with the two-space indent silently matched
inside the four-space line as well, because `"  --x:1;"` is a substring of
`"    --x:1;"`. Three separate consequences in one session, all silent: a duplicated
declaration inserted at the wrong indent; an assertion tripping on a count of 2 where
1 was expected; and, worst, an edit that stripped a line's trailing semicolon and
merged two custom properties into one malformed declaration — which does not raise a
CSS parse error, it just makes every later `var()` of that property resolve to
nothing.

**Suggested improvement:** When editing structured, indented source programmatically,
match on **whole lines** — compare `line.strip()` against the target and rebuild the
line with its own original indent — rather than on substrings that happen to start at
a chosen depth. Assert the expected number of matches before writing, and never write
if the count differs. Where a trailing delimiter matters, rebuild the line rather than
using `rstrip` on a character the language needs. The general rule worth stating: an
occurrence count is the cheap guard, but it only fires when the count is wrong — it
cannot catch a replacement that matched the right number of times in the wrong places,
so anchoring has to be correct by construction rather than validated after the fact.

**Principle:** In any indented format, a pattern written at one nesting depth is a
proper substring of the same pattern at a deeper one, so "search for this text" and
"search for this line" are different queries that agree on flat files and diverge
exactly where the file has structure. Choosing the substring form is choosing a
matcher whose failure mode is silent duplication at the wrong scope — and the formats
where this matters most, stylesheets and config, are also the ones that accept
malformed output without raising.
