# Prompt: Research → Plan → Implement (three fresh contexts)

_For understanding-heavy work (refactors, legacy changes). Each phase refuses the next phase's job.
Run each in a fresh session (`/clear` between)._

## 1. Research (writes no code)
> You do NOT know what we're building yet — do not guess. Investigate [area]. Report only
> facts with `file:line` citations: components, call sites, invariants, blast radius. If you
> can't cite it, don't assert it. Write findings to `.ai/plans/[name]-research.md`.

**→ Human checkpoint: validate the research against reality before planning. Highest-leverage moment.**

## 2. Plan (paint-by-numbers, no invention)
> Using the research doc, write a plan with exact signatures, ordering constraints, and a test
> per vertical slice. Precise enough that review checks conformance, not creativity. Write to
> `.ai/plans/NNN-[name].md`.

## 3. Implement (invents nothing)
> Implement `.ai/plans/NNN-[name].md` exactly. If a decision is missing, stop and ask.
> Verify each slice's test before moving on.
