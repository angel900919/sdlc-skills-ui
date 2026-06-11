---
name: improve-codebase-architecture
description: |-
  Brownfield architectural-friction analyzer and refactor designer. Walks existing code, finds shallow modules, tangled seams, and poor testability, then proposes ranked deepening opportunities — turning shallow modules into deep ones. Diagnoses and proposes only; it never writes the refactored code — the refactor is handed forward as a slice (chain repo) or a free-form task (bare repo). Persists candidates and the chosen design to .ai/refactors/. Grounds in .ai/context.md and ADRs when present, never blocking on them. Reached standalone or routed from /diagnose (its NO-SEAM post-mortem) and /health-audit (ARCHITECTURE-BLOCKS-FEATURE). Use for "/improve-codebase-architecture", "improve the architecture", "find refactoring opportunities", "spot deepening targets", "reduce coupling", or "modules feel shallow". Do NOT use for initial system design (/architect), per-feature implementation design (/design), bug root-causing (/diagnose), or running DDD domain-smell audits (/health-audit's tech-debt lens).
allowed-tools:
  - Read
  - Write
  - Edit
  - Agent
  - Glob
  - Grep
---

# improve-codebase-architecture — friction analyzer + refactor designer

The architecture vocabulary is load-bearing — **module · interface · depth · seam ·
adapter · leverage · locality** — defined in [`references/language.md`](references/language.md).
Use those words exactly; don't drift into "component", "service", "API", or "boundary".

<what-to-do>

Copy this checklist and tick as you go:

```
improve-codebase-architecture progress:
- [ ] Phase 0: Ground + scope (near-zero preconditions)
- [ ] Phase 1: Explore for friction (Explore sub-agent + the deletion test)
- [ ] Phase 2: Present ranked candidates → write .ai/refactors/<target>.md (proposed)
- [ ] Phase 3: Design the deepening (the design loop; optional design-it-twice)
- [ ] Phase 4: Hand forward (refactor slice / task — never write the code here)
- [ ] Hand-off: emit one verdict (PROPOSALS-READY / DEEPENING-ROUTED / RECORDED-AS-ADR / NO-FRICTION-FOUND)
```

### Phase 0 — Ground and scope

Near-zero preconditions, like `/diagnose` — it runs on a repo. Don't block on missing
upstream artifacts.

1. **Ground the language — if the files exist.** Skim `.ai/context.md` (domain glossary +
   entities) so deepened modules get named in the project's words, and any **ADRs**
   (`.ai/architecture/adr/`) near the code you'll touch so you don't re-litigate settled
   decisions. **Absent → note in one line and proceed**; never block, never create them.
2. **Seed candidates from `.ai/recon.md` if present** — `/explore`'s Section B (component
   decomposition) and the gaps section are the natural starting friction.
3. **Read the caller's finding if routed.** From `/diagnose` (a `NO-SEAM` post-mortem) or
   `/health-audit` (`ARCHITECTURE-BLOCKS-FEATURE` or a `health:architecture` `H-NNN`) →
   read that one finding; it is your starting friction.
4. **Detect the mode** (drives Phase 4): **chain repo** (`.ai/` tree) or **bare repo**
   (standalone). Pick a `<target>` slug for this session (kebab, names the friction area,
   e.g. `order-intake-deepening`).

### Phase 1 — Explore for friction

Use the **Agent tool with `subagent_type=Explore`** to walk the codebase (parent reads ≤5
files itself; the sub-agent does the breadth). Don't follow rigid heuristics — explore
organically and note where you feel friction:

- Understanding one concept forces bouncing between many small modules.
- A module is **shallow** — its interface is nearly as complex as its implementation.
- Pure functions extracted only for testability, while the real bugs hide in how they're
  called (no **locality**).
- Tightly-coupled modules leaking across their seams.
- Code untested, or hard to test through its current interface.

Apply the **deletion test** to anything you suspect is shallow: imagine deleting it — does
complexity *concentrate back* across N callers (it was earning its keep) or just *move*
(it was a pass-through)? "Concentrates" is the deepening signal. Full definitions and
principles: [`references/language.md`](references/language.md).

### Phase 2 — Present ranked candidates

A numbered list of deepening opportunities. For each: **Files** · **Problem** (why the
current shape causes friction) · **Solution** (plain English) · **Benefits** (in
**locality** + **leverage** + how tests improve). Use `context.md` vocabulary for the
domain and `language.md` vocabulary for the architecture ("the Order intake module", not
"the FooBarHandler"). **ADR conflicts:** surface a candidate that contradicts an ADR only
when the friction is real enough to warrant reopening it — mark it clearly, don't list
every refactor an ADR forbids.

**Write `.ai/refactors/<target>.md`** (`status: proposed`, schema in
[`../_shared/ai-schema.md`](../_shared/ai-schema.md)) so the analysis survives. Then ask:
*"Which of these would you like to design?"* — do **not** propose interfaces yet. If the
user stops here, emit `PROPOSALS-READY`. If exploration found nothing worth deepening,
write **no file** and emit `NO-FRICTION-FOUND`.

### Phase 3 — Design the deepening (the design loop)

Once the user picks a candidate, drop into a focused **design conversation** (collaborative,
not an interrogation). Walk the design tree together: constraints, the dependency category
([`references/deepening.md`](references/deepening.md)), the deepened interface, where the
**seam** sits, what hides behind it, and which tests survive (replace-don't-layer). The
audience is technical, so the real choices are fair game — plain-English questioning per
[`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions).

Side-effects happen inline as decisions crystallise (these + the routed slice are the only
writes):

- **Naming a deepened module after a concept not in `context.md`** → add the term to
  `.ai/context.md` (the glossary schema in `ai-schema.md`); create it lazily if absent.
- **User rejects the candidate with a load-bearing reason** → offer an **ADR**
  (`.ai/architecture/adr/NNNN-*.md`, shared counter, format in
  [`../architect/references/adr.md`](../architect/references/adr.md)) so future reviews
  don't re-suggest it. Only when a future explorer would actually need the reason — skip
  ephemeral ("not now") and self-evident ones. → `RECORDED-AS-ADR`.
- **User wants to explore alternative interfaces** → the **optional design-it-twice**
  sub-step: [`references/interface-design.md`](references/interface-design.md) (3+ parallel
  sub-agents, radically different interfaces, compared on depth/locality/seam).

Update the file to `status: designing` with the settled interface + test strategy.

### Phase 4 — Hand forward

The deepening becomes a **buildable refactor**, routed **source-aware** — the target
interface is the acceptance criteria and the replace-don't-layer plan is the test plan:

- **Chain repo** → a refactor slice via [`/to-issues`](../to-issues/SKILL.md)
  (`category: enhancement`), carried into the normal `/build` → `mtdd-*` loop.
- **Bare repo** → a free-form `tasks/<slug>.md` from
  [`../_build_share/task-template.md`](../_build_share/task-template.md) → the user's
  execute loop.

Set `status: routed` + `routed_ref`, then emit `DEEPENING-ROUTED`.

</what-to-do>

<supporting-info>

## Critical rules

- **Near-zero preconditions.** Ground in `.ai/context.md` + ADRs *if present*; warn and
  proceed if absent. Never block on, or create, upstream artifacts.
- **Proposal-only write boundary.** This skill **never writes the refactored code.** Its
  only writes are `.ai/refactors/<target>.md`, `context.md` glossary updates, and ADRs. The
  actual refactor is the routed slice/task — a separate implementation session.
- **Vocabulary discipline.** Use `language.md` terms exactly (module/interface/seam), not
  component/service/boundary. Consistent language is the point.
- **Deletion test is the shallowness detector.** A module that concentrates complexity when
  deleted is earning its keep; one that just moves it is a pass-through.
- **Two adapters = a real seam.** Don't introduce a port/seam unless something actually
  varies across it (typically production + test). A single-adapter seam is just indirection.
- **ADR restraint.** Record a rejection only when a future explorer would need the reason to
  avoid re-suggesting the same thing.
- **Altitude.** `/architect` owns macro/system shape (one-time HLD); this owns module-level
  deepening within it. `/health-audit` *detects + registers*; this *designs the refactor*.

## The `.ai/refactors/<target>.md` artifact

N-per-project, the durable record so the analysis survives and a session is re-enterable
(schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md)). `status` tracks the
lifecycle `proposed → designing → routed` (or `recorded`). **No `.human` mirror** — it's a
working/analysis artifact (like `research.md`); a seam/dependency diagram via the **mermaid
skill** is optional if the user wants one. `NO-FRICTION-FOUND` writes **no file**.

## Verdicts (advisory outcome labels)

Like `/diagnose`'s, not chain `READY-FOR-X` tokens. Emit exactly one as the last line:
`PROPOSALS-READY` · `DEEPENING-ROUTED` · `RECORDED-AS-ADR` · `NO-FRICTION-FOUND`.

On-demand, not a chain step.

</supporting-info>
