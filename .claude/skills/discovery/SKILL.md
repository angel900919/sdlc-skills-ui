---
name: discovery
disable-model-invocation: true
description: |-
  Pressure-tests whether a captured idea is worth building. Runs a Jobs-to-be-Done interview (problem, target user, JTBD, success metric, kill criteria, scope), optionally researching competitors and feasibility with sub-agents, then issues an advisory PROCEED / INVESTIGATE / KILL verdict the user can override on the record. Writes a structured discovery artifact under .ai/discovery/ and a plain-English .human/summaries/discovery.md with a validated diagram. Use when the user says "/discovery", "should we build this", "is this idea worth pursuing", "validate this idea", or after /intake. Do NOT use for: capturing a brand-new idea (/intake), domain modeling (/understand), stack selection (/anchor), or PRDs (/prd).
---

<what-to-do>

You decide whether an idea is worth building — and say so, with reasons. You interview the user about the **idea, not the implementation**, optionally research the space with sub-agents, write a structured machine artifact plus a plain-English human summary, and issue a gate verdict. The verdict is advisory: state it honestly with its reasons, and let the user override it on the record (never hide a problem to avoid a hard verdict).

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory-gate rule, tier dial) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/discovery/<slug>.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one or two questions at a time, propose a recommended answer, no jargon (say "the one job this does" not "the JTBD"), adapt to `technical_user` from `.ai/intake.md`. The framework terms (JTBD, kill criteria, metric) are for the *artifact*, not the question. If an answer is vague, push back before moving on.
2. **No technical questions.** No stack, framework, database, API, hosting, architecture. Those belong to `/anchor` / `/architect`. If the user volunteers tech details, capture them in References/Notes and steer back to the idea.
3. **Research before you ask, where you can.** For facts the user can't easily produce — competitors, existing tools, market size, regulatory landscape, feasibility — dispatch an `Explore`/`general-purpose` sub-agent to research independently, then present findings and ask the user to react. Don't interrogate the user for what research can surface. Record sources under References.
4. **Kill criteria must be falsifiable.** The user must state at least one observable condition that would make them walk away. Keep probing until they produce one — or name its absence as a risk in the verdict.
5. **Success metric is a number with a timeframe.** Reject "engagement", "satisfaction", "users love it". Force: metric + baseline + target + timeframe + how-measured.
6. **Target user is a specific person.** Reject "users", "everyone", "small businesses". Force a named person (real or composite) with role, context, and constraint.
7. **Deferred items are dated.** Without a `YYYY-MM-DD` revisit date, "deferred" silently becomes "abandoned".
8. **The gate is advisory.** Run the full analysis and issue `PROCEED | INVESTIGATE | KILL` with reasons. The user may continue past a negative verdict — set `verdict_overridden: true`, record their reason in the Decision section, and still write both artifacts. Never gatekeep by blocking; gatekeep by being honest.
9. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, run a condensed pass (problem, user, JTBD, one core metric, light scope) and lean toward PROCEED unless something is clearly broken. At `mvp`/`production`, run the full interview.
10. **Two artifacts, two registers.** `.ai/discovery/<slug>.md` is structured (frontmatter index + fixed sections, per the schema). `.human/summaries/discovery.md` is plain-English verdict + why + one validated diagram. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — the rejection list (discovery-as-marketing, vibes-metric, no kill criteria, tech leakage). Scan the draft against it before writing.

## Procedure

Copy this checklist:

```
discovery progress:
- [ ] Phase 0: Load .ai/intake.md (slug, tier) + .human/intake/idea.md + progress-tracker top 5
- [ ] Phase 1: Restate the idea in one sentence; confirm fidelity
- [ ] Phase 2: Research the space with sub-agents (competitors, feasibility) — present findings
- [ ] Phase 3: Problem validation (whose pain, today's coping, gap, frequency, cost)
- [ ] Phase 4: Jobs-to-be-Done framing
- [ ] Phase 5: Success metric (ONE number with timeframe)
- [ ] Phase 6: Kill criteria (≥1 falsifiable claim)
- [ ] Phase 7: Scope (v0.1 / deferred-with-dates / hard non-goals)
- [ ] Phase 8: Constraints + open questions + cost-of-delay + reversibility
- [ ] Phase 9: Read back; scan against anti-patterns; collect corrections
- [ ] Phase 10: Write .ai/discovery/<slug>.md + .human/summaries/discovery.md (validated diagram)
- [ ] Phase 11: Append progress-tracker; issue verdict (PROCEED | INVESTIGATE | KILL)
```

### Phase 0 — Load context
Read `.ai/intake.md` for `slug`, `predicted_tier`, `technical_user`, `uplift_signals`. Read `.human/intake/idea.md` for the captured idea. Read `.ai/progress-tracker.md` top 5 (create from the stub in [`../_shared/conventions.md`](../_shared/conventions.md) if absent). If no intake exists, ask the user for the idea directly and slug it yourself.

### Phase 1 — Restate
Restate the idea in **one sentence**; ask "did I capture it?" Don't proceed until confirmed.

### Phase 2 — Research the space
Dispatch a sub-agent (Explore or general-purpose) to research, in parallel where possible: existing tools/competitors and how they fall short, rough market/audience signal, any regulatory landscape, and feasibility red flags. Present findings in plain English and the build/buy/ignore read:
- An existing tool already covers ≥80% → tell the user; a feature request may beat a new build.
- Apply this as **information**, not a veto — the user decides.

### Phases 3–8 — The interview
Ask one or two plain questions at a time. Pull from [references/question-bank.md](references/question-bank.md) when stuck. Enforce rules 4–7. For each round, restate the answer in your own words and confirm. At `prototype` tier, condense (see rule 9).

### Phase 9 — Read back
Assemble the draft. Scan against [references/anti-patterns.md](references/anti-patterns.md); strip rejection-class symptoms. Read it back: *"Where did I misrepresent you?"* Edit for fidelity — the user's idea is the source of truth.

### Phase 10 — Write both artifacts
1. **`.ai/discovery/<slug>.md`** — structured, per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Fill the frontmatter index (verdict, tier_signal, jtbd, entities, success_metric, reversibility) and the fixed sections. Populate `entities` with the candidate domain nouns — `/understand` will model these.
2. **`.human/summaries/discovery.md`** — plain-English mirror: the verdict in one sentence, the *why* in 3–6 bullets, the risks, and **one validated diagram** via the **mermaid skill** (a problem/JTBD map or the v0.1 scope as a flow). Link back to the `.ai` artifact.

### Phase 11 — Verdict
Append a progress-tracker entry on `PROCEED`/`INVESTIGATE` (skip on `KILL` — the artifact records it). Then issue exactly one:

- **PROCEED** — JTBD sharp, metric measurable, kill criterion falsifiable, scope concrete. Hand off: *"Next: `/understand <slug>` to sharpen domain language and capture the rules that must always hold."*
- **INVESTIGATE: \<specific next step\>** — a specific unknown must be answered first (e.g. "interview 5 users about their current flow"). Name it.
- **KILL: \<rationale\>** — not ready, or build/buy/ignore rejected it. Still write the artifact (the reasoning has value); set `status` accordingly.

If the user overrides a negative verdict, set `verdict_overridden: true`, record their reason, and route onward anyway.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). The success metric and kill criteria written to `.ai/discovery/<slug>.md` are not theater: `/measure` evaluates them against real post-ship actuals and reports back to `.ai/outcomes.md`. Read by: `/understand` (entities, scope), `/feature-map` (scope, JTBD), `/measure` (metric, kill criteria).

## Elicitation & rejection references
- Question bank (per-round prompts, accept/reject examples): [references/question-bank.md](references/question-bank.md)
- Anti-patterns (rejection list to scan against before writing): [references/anti-patterns.md](references/anti-patterns.md)

## Slugging
Reuse the slug from `.ai/intake.md`. If none, kebab-case the idea (≤30 chars), describing the idea not the user: `freelancer-invoicing`, `ci-slack-alerts`, `running-club-rsvp`.

</supporting-info>
