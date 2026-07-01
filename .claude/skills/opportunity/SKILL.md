---
name: opportunity
disable-model-invocation: true
description: |-
  Makes the deep build/no-build call on a validated problem: synthesizes the problem evidence, strategy-fit, and market sizing into an opportunity framed as a customer need (not a solution), sized top-down and bottom-up, with the four big risks plus ethics and a lean business case, then issues an advisory PERSEVERE / PIVOT / KILL verdict the user can override on the record. The optional Stage-1 exit gate; writes a structured .ai/opportunity artifact plus a plain-English .human summary, tier-scaled. Use when the user says "/opportunity", "is this worth building", "should we commit to this", "go/no-go", "size the opportunity", "opportunity solution tree", or "name the four big risks". Do NOT use to validate the problem with users (/discovery), set direction or OKRs (/strategy), size the market alone (/market-research), or choose the stack (/anchor).
---

<what-to-do>

You decide **whether this is the right problem to commit to now** — and prove it with evidence, not enthusiasm: a sized, four-risks-plus-ethics, strategy-fit opportunity, or an honest **PIVOT / KILL** that banks the learning cheaply. You synthesize the evidence already gathered (`/discovery`, plus `/strategy` and `/market-research` if they ran), interview the user one topic at a time to fill the gaps, optionally research sizing with sub-agents, write a structured machine artifact plus a plain-English human summary, and issue an advisory verdict the user can override on the record.

This is the **optional Stage-1 exit gate** — the deep go/no-go that runs after `/discovery` once real evaluation has been done, to stop the wrong build *before* it enters engineering (discovery is cheap; delivery is expensive). It is optional: on the lean path `/discovery`'s own verdict is the lighter "worth building?" gate; run `/opportunity` when the bet is big enough to deserve sizing, risk-rating, and a business case. A pre-approved or obvious utility skips it.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory-gate rule, tier dial, talking-to-the-human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/opportunity/<slug>.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one or two questions at a time, propose a recommended answer, no jargon (say "the one need behind this", not "the opportunity node"; "the risk we're least sure about", not "the highest-importance, lowest-evidence assumption"). Adapt to `technical_user` from `.ai/intake.md`. The framework terms live in the *artifact*, not the questions.
2. **Assess an opportunity, not a solution.** Frame it as a customer need/pain/desire in their words. The litmus test: if only one implementation could address it, it's a solution masquerading as an opportunity — reframe one level up until 2–3 candidate solutions genuinely fit. No stack or architecture here (that's `/anchor`/`/architect`).
3. **Build on validated evidence — never assess on air.** Read `.ai/discovery/<slug>.md` for the validated problem; read `.ai/strategy/<slug>.md` (if present) for the outcome it must serve and `.ai/market-research/<slug>.md` (if present) for sizing. If the problem isn't validated (no discovery, or discovery said KILL), say so and recommend `/discovery` first — you cannot size a problem no one has confirmed.
4. **Size both ways or not at all.** Top-down **AND** bottom-up, reconciled with stated assumptions; the gap between them is itself an insight. Top-down-only is the #1 red flag, and TAM is a ceiling, never revenue. Sizing *ranks* the bet — it does not forecast it.
5. **Name and rate the four big risks + ethics.** value/desirability · usability · feasibility · business-viability · **ethics**. Rate each by importance × evidence; the highest-importance, lowest-evidence one is what gets tested first — not the easiest. An untested ethics risk is a PIVOT or KILL, not a footnote.
6. **Lean business case — ranges, not false precision.** Value, cost, net at low/expected/high, plus what breaks the case. Prefer reversible (two-way-door) bets and decide them fast; reserve a fuller case for one-way doors. Always state the cost of **not** doing it.
7. **Never invent.** Every missing market figure, cost, or baseline is a `TODO:` with an owner, or a flagged assumption — never a fabricated number. A blank with an owner is honest; a made-up figure propagates into every downstream gate.
8. **The gate is advisory, and PIVOT/KILL are wins.** Run the full analysis and issue `PERSEVERE | PIVOT | KILL` with reasons and what would change the call. The cheapest failed build is the one this gate stopped — if nothing is ever parked, you're rubber-stamping. The user may continue past a negative verdict — set `verdict_overridden: true`, record their reason in the Decision section, and still write both artifacts. Gatekeep by being honest, never by blocking.
9. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, run a one-page pass (opportunity, back-of-envelope sizing, the single top risk, strategy-fit, a call) and lean toward `PERSEVERE` unless viability or ethics is clearly broken. At `mvp`/`production`, run full both-ways sizing, the full risk table, and sensitivity.
10. **Responsible-product floor — always on, even at prototype.** Ethics is a first-class risk here (privacy / fairness / safety / misuse); re-check the floor against this opportunity's scope. Never tailored out.
11. **AI drafts and red-teams; the human decides.** Draft the assessment, sizing, and case and attack them yourself (is it a disguised solution? sized top-down-only? TAM-as-forecast? ethics unrated? strategy drift?), but the user owns the sizing assumptions, the risk ratings, and the go/no-go — and is accountable for the bet.
12. **Two artifacts, two registers.** `.ai/opportunity/<slug>.md` is structured (frontmatter index + fixed sections, per the schema). `.human/summaries/opportunity.md` is plain-English: the verdict in one sentence, the why in 3–6 bullets, and one validated diagram (the opportunity-solution-tree or the four-risks map) via the **mermaid skill**. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — the rejection list (solution-as-opportunity, top-down-only sizing, TAM-as-forecast, ethics omitted, rubber-stamp gate, invented numbers). Scan the draft against it before writing.

## Procedure

Copy this checklist:

```
opportunity progress:
- [ ] Phase 0: Load .ai/intake.md (slug, tier, technical_user) + .ai/discovery/<slug>.md + .ai/strategy/<slug>.md if present + .ai/market-research/<slug>.md if present + progress-tracker top 5
- [ ] Phase 1: Anchor to the outcome — which North Star/OKR this serves (or surface the no-fit)
- [ ] Phase 2: Frame the opportunity as a need (not a solution); place it on the solution tree (2–3 candidate solutions)
- [ ] Phase 3: Size it — top-down AND bottom-up, reconciled
- [ ] Phase 4: Four big risks + ethics — rate importance × evidence; mark the one tested first
- [ ] Phase 5: Lean business case — ranges + sensitivity + cost of NOT doing it; two-way/one-way door
- [ ] Phase 6: Responsible-product floor + strategy-fit check
- [ ] Phase 7: Read back; red-team; scan against anti-patterns; collect corrections
- [ ] Phase 8: Write .ai/opportunity/<slug>.md + .human/summaries/opportunity.md (validated diagram)
- [ ] Phase 9: Append progress-tracker; issue verdict + hand off
```

### Phase 0 — Load context
Read `.ai/intake.md` for `slug`, `predicted_tier`, `technical_user`. Read `.ai/discovery/<slug>.md` for the validated problem (JTBD, success metric, kill criteria). Load `.ai/strategy/<slug>.md` if present (the North Star/OKRs + diagnosis this must fit) and `.ai/market-research/<slug>.md` if present (sizing inputs) — warn and proceed if absent, never require strategy or research. Read `.ai/progress-tracker.md` top 5. If discovery is absent or was KILLed, flag that there's no validated problem to assess and recommend `/discovery <slug>` first.

### Phase 1 — Anchor to the outcome
Confirm which North Star / OKR (from `.ai/strategy`) this opportunity serves. If it serves none, surface the strategy-fit gap now — a no-fit opportunity is a likely PIVOT or KILL regardless of size. If no strategy was set, anchor to `/discovery`'s success metric instead.

### Phases 2–6 — The assessment
Ask one or two plain questions at a time; pull from [references/question-bank.md](references/question-bank.md) when stuck. Enforce rules 2–6. For each round, restate the answer in your own words and confirm. Frame the need before any solution (rule 2); size both ways (rule 4); rate all five risks (rule 5). Where a figure is unknown, dispatch an `Explore`/`general-purpose` sub-agent or `/research-report` to research it, present findings, and keep the figure at `TODO:` until confirmed — never invent.

### Phase 7 — Read back & red-team
Assemble the draft. Attack it as a skeptical review board (rule 11) and scan against [references/anti-patterns.md](references/anti-patterns.md); strip rejection-class symptoms. Read it back: *"Where did I get this wrong, and what would change the call?"* The user's judgment is the source of truth on the go/no-go.

### Phase 8 — Write both artifacts
1. **`.ai/opportunity/<slug>.md`** — structured, per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Fill the frontmatter index (`verdict`, `outcome_fit`, `sized`, `top_risk`, `reversibility`) and the fixed sections.
2. **`.human/summaries/opportunity.md`** — plain-English mirror: the verdict in one sentence, the *why* in 3–6 bullets, and **one validated diagram** via the **mermaid skill** (the opportunity-solution-tree or the four-risks map). Link back to the `.ai` artifact.

### Phase 9 — Verdict
Append a progress-tracker entry on `PERSEVERE`/`PIVOT` (skip on `KILL` — the artifact records it). Then issue exactly one:

- **PERSEVERE** — sized both ways, four risks + ethics named, viability addressed, strategy-fit, a clear call. Carry any load-bearing assumptions to test first. Hand off: *"Next: `/understand <slug>` to define it (at `prototype`, where `/understand` may be skipped, go straight to `/feature-map`)."*
- **PIVOT: \<what changes\>** — evidence says change the segment or problem (loop to `/discovery`) or the strategy-fit fails (loop to `/strategy`). Name the dimension and the skill that owns it. Still write the artifact.
- **KILL: \<rationale\>** — viability / desirability / strategy-fit fails, or an ethics risk has no mitigation. Park it with what would reopen it. Still write the artifact — the kill/park memo is the cheapest, most valuable output here.

If the user overrides a negative verdict, set `verdict_overridden: true`, record their reason, and route onward anyway.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). The sizing, risk ratings, and value metric written to `.ai/opportunity/<slug>.md` feed forward: `/feature-map` turns the chosen opportunity's candidate solutions into features (its sizing informs Now/Next/Later), and `/measure` evaluates the value metric against post-ship actuals. Read by: `/feature-map` (candidate solutions → features, priority), `/measure` (value metric, business-case expectations).

## Elicitation & rejection references
- Question bank (per-phase prompts, accept/reject examples): [references/question-bank.md](references/question-bank.md)
- Anti-patterns (rejection list to scan against before writing): [references/anti-patterns.md](references/anti-patterns.md)

## Slugging
Reuse the slug from `.ai/intake.md` / `.ai/discovery`. If none, kebab-case the idea (≤30 chars), describing the idea not the user.

</supporting-info>
