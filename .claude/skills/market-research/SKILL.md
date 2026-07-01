---
name: market-research
disable-model-invocation: true
description: |-
  Grounds a product's direction in market reality before the build/no-build call: defines the market demand-side (the buyer plus the job they're hiring it for, not a category), sizes it top-down AND bottom-up reconciled, maps the alternatives starting with the status-quo/do-nothing, builds buyer-grounded competitive intelligence, and turns it into Dunford-order positioning. The optional Stage-1 supporting skill; writes a structured .ai/market-research artifact plus a plain-English .human summary, tier-scaled, with an advisory health-check verdict the user can override on the record. Use when the user says "/market-research", "size the market", "TAM SAM SOM", "market sizing", "competitive analysis", "who are our competitors", "win/loss analysis", "battlecard", or "positioning". Do NOT use to validate the problem with users (/discovery), set direction or OKRs (/strategy), make the build go/no-go call (/opportunity), or choose the stack (/anchor).
---

<what-to-do>

You establish **who would buy this, how big the prize realistically is, what they'd use instead, and why we win** — and prove it with sourced evidence, not a spreadsheet of wishes. You reuse what `/strategy` and `/discovery` already found, interview the user one topic at a time to fill the gaps, optionally research sizing and competitors with sub-agents, write a structured machine artifact plus a plain-English human summary, and issue an advisory health-check verdict the user can override on the record.

This is an **optional Stage-1 supporting skill**. It grounds the strategy's diagnosis and the opportunity's business case in market reality so neither rests on a wish — it runs after `/strategy` (or standalone) and feeds `/opportunity`. **It owns no build gate:** its verdict is a health check on the research quality plus a carrier for any market-viability signal; the go/no-go itself lives in `/opportunity` and `/discovery`, never here. It is optional — a user with an obvious utility or a pre-approved build skips it.

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, advisory-gate rule, tier dial, talking-to-the-human) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/market-research/<slug>.md` schema) before writing.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one or two questions at a time, propose a recommended answer, no jargon (say "who'd buy this and the job they're hiring it to do", not "demand-side market definition"; "the biggest number you could actually defend", not "SOM"; "what they'd use instead — including just carrying on as they are", not "competitive alternatives"). Adapt to `technical_user` from `.ai/intake.md`. The framework terms live in the *artifact*, not the questions.
2. **Define the market from the demand side.** People + the functional **job**, in the customer's words — never your product category or a demographic. Reuse `.ai/discovery`'s JTBD if it ran; if not, size from the best-known job *hypothesis* and flag it `ASM:` to validate in `/discovery`. A wrong market definition poisons every number after it — show back the one-sentence definition before you size anything.
3. **Size both ways or not at all.** Top-down for the outer bound **AND** bottom-up (accounts × ACV, or users × revenue-each) for the number you defend; reconcile within ~15% and explain any gap — the gap is itself an insight. The **SOM is the defensible bottom-up number**; never "capture 1% of a $X B market", and TAM is a ceiling, never revenue. Sizing *ranks* the bet, it does not forecast it.
4. **Alternatives start with the status quo / do-nothing.** ~40% of B2B deals are lost to *no decision*, so the customer's current workaround is your first competitor; then direct, indirect, and non-consumption. No phantom competitors — only ones a real buyer actually evaluates.
5. **Competitive intelligence from buyers, not websites.** Win/loss is the backbone — ~85% of CRM-logged loss reasons are the seller's story, not the buyer's. Output living battlecards each tied to a **decision**, not a scraped competitor deck. At `prototype`, desk research is acceptable — say so and flag it as not buyer-validated; never fabricate a win/loss quote to look rigorous.
6. **Positioning follows the Dunford order.** Alternatives → unique attributes (capabilities, not adjectives) → the value they enable (in the buyer's terms) → best-fit segment → market category. Positioning-first vs category-design is a *sequencing* choice — record it with why; category design is the rare exception, not the default. Never start from the tagline or category you *want*.
7. **Never invent.** Every market number, competitor capability, or win/loss quote is sourced or a `TODO:` with an owner — never a fabricated figure. Separate fact from inference; triangulate ≥2 sources per claim. A blank with an owner is honest; a made-up number propagates into every downstream gate.
8. **The verdict is advisory and this skill owns no build gate.** Run the full analysis and issue `MARKET-GROUNDED | THIN-EVIDENCE | MARKET-RISK` with reasons. The user may continue past a negative verdict — set `verdict_overridden: true`, record their reason in the Decision section, and still write both artifacts. Surface viability/pivot signals for `/opportunity` and `/discovery`; never bury them, never block.
9. **Tier dial.** Read `predicted_tier` from `.ai/intake.md`. At `prototype`, run a one-page pass (demand-side definition + back-of-envelope both-ways sizing + the status quo + top alternatives + a one-line positioning; desk-only CI, flagged). At `mvp`/`production`, run full both-ways sizing with sensitivity, win/loss-grounded CI, and a macro/PESTEL scan; add Porter's Five Forces only for structural, capital-intensive, or regulated markets.
10. **Responsible-product floor — always on, even at prototype.** Competitive claims must be truthful and non-deceptive; data sourcing must be lawful (no ToS-violating scraping or privacy breach); label AI-generated research where applicable. Never tailored out.
11. **AI accelerates, the human decides.** Draft the sizing math, synthesize transcripts/reviews, and draft battlecards — then attack them yourself (defined by category not job? sized top-down-only? status quo missing? CI scraped not buyer-grounded? positioning tagline-first?). But the user owns the market definition, the category choice, validating AI-surfaced trends, and pressure-testing every sizing assumption.
12. **Two artifacts, two registers.** `.ai/market-research/<slug>.md` is structured (frontmatter index + fixed sections, per the schema). `.human/summaries/market-research.md` is plain-English: the takeaway in one sentence, the *why* in 3–6 bullets, and one validated diagram (the market map, the TAM/SAM/SOM funnel, or the positioning 2×2) via the **mermaid skill**. Diagrams go in `.human/` only.

**Backstopped by** [references/anti-patterns.md](references/anti-patterns.md) — the rejection list (top-down-only sizing, category-side market definition, phantom competitors, missing status quo, website-scraped CI, tagline-first positioning, invented numbers). Scan the draft against it before writing.

## Procedure

Copy this checklist:

```
market-research progress:
- [ ] Phase 0: Load .ai/intake.md (slug, tier, technical_user) + .ai/strategy/<slug>.md if present + .ai/discovery/<slug>.md if present (reuse JTBD) + progress-tracker top 5
- [ ] Phase 1: Define the market demand-side — people + functional job; show back the one-sentence definition
- [ ] Phase 2: Size TAM/SAM/SOM two ways — top-down AND bottom-up, reconciled; log riskiest assumptions
- [ ] Phase 3: Map alternatives — status quo / do-nothing first, then direct / indirect / non-consumption
- [ ] Phase 4: Competitive intelligence — buyer-grounded (win/loss) or honestly desk-only at prototype; each card ties to a decision
- [ ] Phase 5: Macro / weak-signal scan (conditional) — PESTEL; Porter only if structural/regulated; human-validate AI trends
- [ ] Phase 6: Positioning — Dunford order; record positioning-first vs category-design and why
- [ ] Phase 7: Responsible-product floor + surface any market-viability signal (Kill/Pivot for the downstream gates)
- [ ] Phase 8: Read back; red-team; scan against anti-patterns; collect corrections
- [ ] Phase 9: Write .ai/market-research/<slug>.md + .human/summaries/market-research.md (validated diagram)
- [ ] Phase 10: Append progress-tracker; issue verdict + hand off
```

### Phase 0 — Load context
Read `.ai/intake.md` for `slug`, `predicted_tier`, `technical_user`. Load `.ai/strategy/<slug>.md` if present (the diagnosis + North Star this research must ground) and `.ai/discovery/<slug>.md` if present (reuse its validated JTBD — don't re-derive the job) — warn and proceed if either is absent, never require them. Read `.ai/progress-tracker.md` top 5. If neither strategy nor discovery exists, ask the user for the idea and the target buyer directly and slug it yourself.

### Phase 1 — Define the market (demand-side)
People + the functional job (rule 2). Reuse discovery's JTBD if present; else capture a job *hypothesis* and flag it `ASM:`. Show the one-sentence market definition back and confirm it before any sizing.

### Phases 2–6 — The research
Ask one or two plain questions at a time; pull from [references/question-bank.md](references/question-bank.md) when stuck. Enforce rules 3–6: size both ways and reconcile (Phase 2); list the status quo first (Phase 3); ground CI in buyers or flag desk-only (Phase 4); scan macro signals only where they change the bet (Phase 5); run the Dunford order for positioning (Phase 6). For any figure the user can't produce, dispatch an `Explore`/`general-purpose` sub-agent or `/research-report` to research it, present findings, and keep it `TODO:` until confirmed — never invent.

### Phase 7 — Floor + signals
Run the responsible-product floor check (rule 10). Then surface any market-viability signal explicitly: a market that fails a viability floor is a **Kill** signal for `/opportunity`; a market definition the evidence contradicts is a **Pivot** back to `/discovery`. Name the signal and the gate that owns it — don't bury it.

### Phase 8 — Read back & red-team
Assemble the draft. Attack it as a skeptical review board (rule 11) and scan against [references/anti-patterns.md](references/anti-patterns.md); strip rejection-class symptoms. Read it back: *"Where did I get the market wrong, and what would change the number?"* The user's judgment is the source of truth.

### Phase 9 — Write both artifacts
1. **`.ai/market-research/<slug>.md`** — structured, per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Fill the frontmatter index (`verdict`, `market`, `som`, `sizing_reconciled`, `top_alternative`, `positioning_choice`) and the fixed sections.
2. **`.human/summaries/market-research.md`** — plain-English mirror: the takeaway in one sentence, the *why* in 3–6 bullets, and **one validated diagram** via the **mermaid skill** (the market map, the TAM/SAM/SOM funnel, or the positioning 2×2). Link back to the `.ai` artifact.

### Phase 10 — Verdict
Append a progress-tracker entry on a success/refine verdict. Then issue exactly one:

- **MARKET-GROUNDED** — sized both ways and reconciled, alternatives start with the status quo, CI is buyer-grounded (or honestly desk-only at prototype), positioning follows the Dunford order. Hand off: *"Next: `/opportunity <slug>` to make the sized go/no-go — or `/discovery <slug>` first if the problem isn't validated yet."*
- **THIN-EVIDENCE: \<what\>** — sizing is single-method or unreconciled, CI is website-only past prototype, or a load-bearing assumption is unvalidated. Name what to research/interview and who owns it. Still write the artifact with the gap flagged.
- **MARKET-RISK: \<what\>** — the evidence surfaces a viability-floor failure (a Kill signal for `/opportunity`) or a market definition the evidence contradicts (a Pivot back to `/discovery`). Name the signal and the gate that owns it. Still write the artifact.

If the user overrides a negative verdict, set `verdict_overridden: true`, record their reason, and route onward anyway.

</what-to-do>

<supporting-info>

## Output artifacts
Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md). The sizing and alternatives written to `.ai/market-research/<slug>.md` feed forward: `/opportunity` consumes the SOM and the alternatives for its business case and opportunity-solution-tree. Read by: `/opportunity` (sizing + alternatives). (`/strategy` runs before this skill, so it does not read the artifact; if research contradicts a strategic bet, surface it as a `MARKET-RISK` signal and the user can re-run `/strategy`.)

## Elicitation & rejection references
- Question bank (per-phase prompts, accept/reject examples): [references/question-bank.md](references/question-bank.md)
- Anti-patterns (rejection list to scan against before writing): [references/anti-patterns.md](references/anti-patterns.md)

## Research
For sizing (TAM/SAM/SOM), the competitive landscape, and positioning, prefer `/research-report` (it cross-checks every figure against ≥2 sources and writes a cited report to `reports/`); `WebSearch` or an `Explore`/`general-purpose` sub-agent is the always-valid fallback. Use research to *produce the evidence behind a claim* — never to invent the claim. Interview won/lost buyers for the highest-value, least-scrapable input; keep every unsourced figure at `TODO:`.

## Slugging
Reuse the slug from `.ai/intake.md` / `.ai/strategy` / `.ai/discovery`. If none, kebab-case the idea (≤30 chars), describing the idea not the user.

</supporting-info>
