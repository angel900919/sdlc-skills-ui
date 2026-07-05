---
name: context-gap-scanner
description: >-
  Surfaces what is missing from context before acting on a task — absent or stub
  memory files, unstated invariants, undefined terms, tribal knowledge, and a
  missing verification target — then fills each gap or marks it [needs human].
  Use before writing code on an unfamiliar area, when a task feels under-specified,
  when about to act on an assumption, or when a fresh session is resuming cold.
---

# Context Gap Scanner

<!-- Guide 02 §9 (demand-driven context: let the agent fail, name the gap, curate it back).
     Judgment stays in prose; the probe script only gathers cheap, deterministic signals. -->

## ⚠️ Must-not-miss (stays in the body — agents skip reference files)
- **Do not act on an unstated assumption.** A gap is cheapest to fill *now*, before the build is wrong. If a load-bearing fact is missing, **read it, ask, or mark `[needs human]` — never invent it.**
- **No verification target ⇒ do not start coding.** This is the most common missing gap. Find the test/build/screenshot/`TEST:` line that will prove the work, or create one first.

## Workflow (before you act on a task)
1. Gather cheap signals — run the probe (reports missing/stub memory files, open `[needs human]`/`TODO` markers, and whether the current spec names a verification target):
   !`bash .ai/skills/context-gap-scanner/scripts/context_probe.sh`
2. **Classify every gap** by type — `clean` · `stale` · `missing` · `tribal` (see `references/gap-taxonomy.md`).
3. **Resolve each, cheapest first:** read the file → grep the codebase → ask the user → or mark `[needs human]` in `.ai/plans/<slug>/`. Prioritize by `severity × frequency`.
4. **Gate before coding:** confirm you hold a verification target and the three required `.ai/` files are real (not stubs).
5. **Curate the answer back** — when a human resolves a gap, write it into `.ai/` (a `coding-standards` rule, an `architecture` invariant, or a decision trace) so the next session never re-hits it.

## Deeper material (loaded on demand)
- The four gap types, how to tell them apart, prioritization, and the fill-and-feed-back loop → `references/gap-taxonomy.md`

*Pairs with the [`/3-research`](../../commands/3-research.md) command (goal-blind fact-finding) and the memory system in [`../../`](../../). Source: [`guides/02_context-engineering.md`](../../../guides/02_context-engineering.md) §9.*
