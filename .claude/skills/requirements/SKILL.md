---
name: requirements
disable-model-invocation: true
description: |-
  Turns validated needs into a baselined, testable set of system-level requirements before the build: elicits and classifies them (functional / quality / constraint), writes each one SMART with a stable ID (EARS as a fallback), traces every requirement up to a need and forward to a verification method, prioritises them, and names the handful of measures that say the system works. The optional systems-track Stage-2 skill; per-feature /prd traces up to it. Writes a structured .ai/requirements artifact plus a plain-English .human summary, tier-scaled, with an advisory verdict the user can override on the record. Use when the user says "/requirements", "write the requirements", "system requirements", "SyRS", "SMART check", "EARS", "prioritise requirements", "traceability matrix", or "define the measures". Do NOT use for per-feature scope or stories (/prd), domain modeling (/understand), architecture (/architect), the stack (/anchor), or idea validation (/discovery).
---

<what-to-do>

You turn validated needs into a **baselined, testable set of system-level requirements** — each one a SMART statement with a stable ID, traced up to a need and forward to a way to check it, so the architecture, the features, and the tests all derive from the same contract. You reuse what `/understand` and `/discovery` already found, interview the user one topic at a time to fill the gaps, write a structured machine artifact plus a plain-English human summary, and issue an advisory verdict the user can override on the record.

This is an **optional systems-track Stage-2 skill** — it runs for a systems-engineering project after `/understand` (which carries the concept and needs) and before/around `/architect` and `/feature-map`: the architecture is designed to *satisfy* these requirements, and each per-feature `/prd` traces **up** to them. It is optional — a straightforward software product goes straight from `/understand`/`/feature-map` to per-feature `/prd` and never needs a system requirements layer.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory-gate rule, tier dial, talking-to-the-human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/requirements/<slug>.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one or two questions at a time, propose a recommended answer, no jargon (say "what the system must do, worded so you could check it", not "SMART requirement"; "which need this comes from", not "traceability"; "how you'd confirm it's met", not "verification method"). Adapt to `technical_user` from `.ai/intake.md`. The framework terms live in the *artifact*, not the questions.
2. **Requirements, not design or features.** A requirement states **what must be true**, never how to build it (`/architect`, `/design`) and never a per-feature slice (`/prd`, `/feature-map`). If the user hands you a solution, capture the need behind it and steer back. No stack, no components, no schema here.
3. **Every requirement is SMART and has a stable ID.** Specific (one behaviour), Measurable (a number, threshold, or observable event), Achievable, Relevant (traces to a need), Testable. Assign a zero-padded `REQ-NN` — **stable for life, never renumbered**. EARS is a fallback phrasing when a plain SMART sentence is hard; then SMART-check the result. Split double-barrelled requirements (any "…and…"); replace vague verbs ("support/handle/fast/robust") with a measurable verb + number + condition.
4. **Trace up to a need and forward to a check.** Every requirement derives from a need — a `/discovery` JTBD, a `/understand` behaviour or invariant, or a `/strategy` outcome — **no orphan requirements**; and every need should be covered by ≥1 requirement (flag uncovered needs). Seed a verification method per requirement (**test** for a threshold · **inspect** for a document/code/review item · **analyze** for a model/calculation · **demo** for observe-the-behaviour) — a *seed only*; `/qa` and `/test-strategy` are authoritative.
5. **Classify lightly and prioritise.** Three buckets: **functional** (what it does) · **quality** (how well — performance, reliability, security, usability) · **constraint** (imposed limits — budget, mandated tech, regulation/domain standard). Don't file a quality attribute as functional. Priority is **must / should / could**; must = the system can't function without it.
6. **Name the measures that say it works.** A short set: mission-level measures that ladder to the `/strategy` North Star or `/discovery` success metric (they feed `/measure`), plus per-requirement measurable thresholds where a requirement carries real risk. Light at `prototype`; fuller with thresholds at `production`. A requirement set with nothing measurable is a wish list.
7. **Never invent.** Every threshold, number, or cited standard is sourced or a `TODO:` with an owner — never fabricated. Reuse the needs and stakeholders from `/understand`/`/discovery`; never re-ask what they settled. A blank with an owner is honest; a made-up number propagates into every downstream gate.
8. **The gate is advisory.** Run the full SMART + coverage analysis and issue `BASELINED | NEEDS-REFINEMENT | BLOCKED-ON-CONCEPT` with reasons. The user may continue past a negative verdict — set `verdict_overridden: true`, record their reason in the Decision section, and still write both artifacts. Gatekeep by being honest, never by blocking.
9. **Tier dial.** Read `predicted_tier` from `.ai/intake.md` (or the locked `project_tier` from `.ai/anchor.md`). At `prototype`, write a short numbered SMART list (the functional requirements + the top quality/constraint ones), each traced and prioritised; verification seeds optional. At `mvp`, full three-bucket classification + verification seeds + a light measures set. At `production`, add a bidirectional coverage check (need↔requirement both ways), measures with thresholds, and a peer-review note.
10. **Responsible-product floor — always on, even at prototype.** Capture at least the security / privacy / safety requirements the scope implies (a `quality` or `constraint` requirement each). Never tailored out.
11. **Two artifacts, two registers.** `.ai/requirements/<slug>.md` is structured (frontmatter index + fixed sections, per the schema). `.human/summaries/requirements.md` is plain-English: the baseline state in one sentence, the requirement count by bucket, the *why* in 3–6 bullets, and one validated diagram (a requirements-to-needs traceability map or a modes/states diagram) via the **mermaid skill**. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — the rejection list (non-SMART requirement, double-barrelled, orphan requirement, uncovered need, quality-as-functional, solution-as-requirement, invented threshold). Scan the draft against it before writing.

## Procedure

Copy this checklist:

```
requirements progress:
- [ ] Phase 0: Load .ai/intake.md (slug, tier, technical_user) + .ai/understanding/<slug>.md (needs, behaviours, invariants) + .ai/discovery/<slug>.md (JTBD, success metric) + .ai/strategy/<slug>.md if present + .ai/anchor.md (tier, constraints) + progress-tracker top 5
- [ ] Phase 1: Elicit & surface — gather needs; probe the classes needs-work misses (quality: performance/reliability/security; implicit; regulatory/domain)
- [ ] Phase 2: Write each requirement SMART with a stable REQ-NN; classify functional/quality/constraint; split double-barrelled; kill vague verbs
- [ ] Phase 3: Trace — each requirement up to a need; flag uncovered needs; seed a verification method per requirement
- [ ] Phase 4: Prioritise must/should/could; surface conflicts (flag, don't auto-resolve; priority is the tie-breaker)
- [ ] Phase 5: Measures — mission-level measures laddering to the North Star / success metric + per-requirement thresholds where risk warrants
- [ ] Phase 6: Responsible-product floor + modes/states (if the system has them)
- [ ] Phase 7: SMART + coverage pass; read back; scan against anti-patterns; collect corrections
- [ ] Phase 8: Write .ai/requirements/<slug>.md + .human/summaries/requirements.md (validated diagram)
- [ ] Phase 9: Append progress-tracker; issue verdict + hand off
```

### Phase 0 — Load context
Read `.ai/intake.md` for `slug`, `predicted_tier`, `technical_user`. Load `.ai/understanding/<slug>.md` (behaviours + invariants = the needs to derive from), `.ai/discovery/<slug>.md` (JTBD, success metric, kill criteria), `.ai/strategy/<slug>.md` if present (the North Star to ladder measures to), and `.ai/anchor.md` if present (the locked tier + any constraints). Read `.ai/progress-tracker.md` top 5. **If no understanding and no discovery exist, there are no validated needs to derive from — issue `BLOCKED-ON-CONCEPT` and route to `/understand` (or `/discovery`) first.**

### Phases 1–6 — Build the requirement set
Ask one or two plain questions at a time; pull from [references/question-bank.md](references/question-bank.md) when stuck. Enforce rules 2–6: capture the need not the solution (Phase 1); write each requirement SMART with a stable ID and light classification (Phase 2); trace every one to a need and seed a check, flagging uncovered needs (Phase 3); prioritise and surface conflicts without auto-resolving (Phase 4); name the measures that ladder to the outcome (Phase 5); run the responsible-product floor (Phase 6). For any threshold the user can't produce, dispatch an `Explore`/`general-purpose` sub-agent or `/research-report` (e.g. a realistic latency/reliability benchmark, or a cited standard clause) and keep it `TODO:` until confirmed — never invent.

### Phase 7 — SMART & coverage pass, read back
Run the checks: every requirement passes all five SMART letters; no double-barrelled or vague-verb statements; every requirement traces to a need; every need is covered. Scan against [references/anti-patterns.md](references/anti-patterns.md); strip rejection-class symptoms. Read the set back in plain English — *"does this capture what the system must do, and did I miss a need?"* — and collect corrections.

### Phase 8 — Write both artifacts
1. **`.ai/requirements/<slug>.md`** — structured, per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Fill the frontmatter index (`verdict`, `req_count`, `must_count`, `coverage`, `verification_seeded`) and the fixed sections (the requirements table by bucket, traceability, measures).
2. **`.human/summaries/requirements.md`** — plain-English mirror: the baseline state in one sentence, the count by bucket, the *why* in 3–6 bullets, and **one validated diagram** via the **mermaid skill** (a requirements-to-needs traceability map or a modes/states diagram). Link back to the `.ai` artifact.

### Phase 9 — Verdict
Append a progress-tracker entry on a success/refine verdict. Then issue exactly one:

- **BASELINED** — every requirement is SMART, classified, prioritised, traced to a need, and verification-seeded; every need is covered; measures ladder to the outcome. Hand off: *"Next: `/architect <slug>` to design a system that satisfies these — or `/feature-map <slug>` to decompose them into features; each `/prd` then traces up to these REQ IDs."*
- **NEEDS-REFINEMENT: \<what\>** — a requirement fails a SMART letter, is double-barrelled, or a need is uncovered. Name the requirement (or need) and what to fix. Still write the artifact with the gap flagged.
- **BLOCKED-ON-CONCEPT: \<what\>** — no validated needs to derive from (no understanding/discovery). Route to `/understand` (or `/discovery`). Write a stub only if the user supplied a thin concept inline; mark `TODO: needs owed`.

If the user overrides a negative verdict, set `verdict_overridden: true`, record their reason, and route onward anyway.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). The requirements written to `.ai/requirements/<slug>.md` are the system contract the build derives from. The **wired consumer today is `/prd`**, which carries a `traces_to: [REQ-NN, ...]` line up to these REQ IDs. `/architect` (design to satisfy them), `/feature-map` (decompose them into features), and `/measure` (evaluate the measures against actuals) consume the set by hand until that read-wiring lands — a tracked follow-up. Read by: `/prd` (trace-up target).

## Elicitation & rejection references
- Question bank (per-phase prompts, accept/reject examples): [references/question-bank.md](references/question-bank.md)
- Anti-patterns (rejection list to scan against before writing): [references/anti-patterns.md](references/anti-patterns.md)

## Verification method is a seed
The per-requirement T/I/A/D-style method (test / inspect / analyze / demo) is a *seed* to make the requirement testable, not the test plan. `/test-strategy` and `/qa` own the authoritative verification — they may change the method. State the seed; don't over-invest.

## Slugging
Reuse the slug from `.ai/intake.md` / `.ai/understanding`. If none, kebab-case the idea (≤30 chars), describing the idea not the user.

</supporting-info>
