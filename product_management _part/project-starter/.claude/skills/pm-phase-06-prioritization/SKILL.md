---
name: pm-phase-06-prioritization
description: Runs Phase 06 (Prioritization) of the framework-agnostic PM operating system — the decision aid that ranks opportunities (OPP-*) and solutions/bets (SOL-*) against a chosen outcome (OBJ/KR), defensibly. It filters-then-ranks — applies a categorical filter (strategy fit + the Responsible-Product floor), then a scoring model (RICE / ICE / WSJF·Cost-of-Delay / Weighted Scoring / Kano / MoSCoW / Value-vs-Effort / Opportunity Scoring) with explicit Confidence, runs a sensitivity check, and emits Prioritization_Matrix.md — a transparent, shared ranking with P0–P3 / MoSCoW labels, a recommendation, and a DEC-* log entry — that feeds the roadmap (P05) and PRD scope (P08). It owns no lifecycle gate (supporting phase); its output is reviewed inside G4 and G6. Conforms to ../../05_Conventions.md. Use when you need to rank or sequence initiatives, build a RICE/ICE/WSJF/weighted-scoring model, run a Kano or MoSCoW classification, cut an MVP scope line, decide what to build next, or defuse a HiPPO / stakeholder priority fight with evidence. Triggers on phrasings like "prioritize", "prioritization", "RICE", "ICE", "WSJF", "cost of delay", "Kano", "MoSCoW", "value vs effort", "weighted scoring", "opportunity scoring", "what should we build next", "rank the backlog", "cut scope / MVP line", "phase 6".
disable-model-invocation: true
user-invocable: true
---

# Phase 06 — Prioritization

<what-to-do>
This phase turns "everyone's favourite idea" into a **defensible, shared ranking** of opportunities and solutions against a named outcome. A framework here **structures the conversation; it does not make the decision** — you own the call and are accountable for it. **This is a supporting phase: it owns no lifecycle gate (`supporting — decision aid, no gate`).** You invoke it *inside* other phases — it feeds the **G4 Roadmap Commit** (P05) and the **G6 PRD scope** (P08), and its output is reviewed at those gates rather than at one of its own. This phase conforms to [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) for all IDs, gates, priority labels (P0–P3 / MoSCoW), severity, and framework citations; it never redefines them.

## Inputs (from prior phases)
- **P01 Strategy — `North_Star_and_OKRs.md` (`OBJ-*`/`KR-*`), the North Star (`MET-*`).** You prioritize *against an outcome*, never against "good ideas." If no OBJ/KR is named, **stop and resolve it first** — un-anchored prioritization is theatre. Fallback: ask which Objective this ranking serves; mark `OBJ-TBD`.
- **P04 Opportunity — `Opportunity_Solution_Tree.md` (`OPP-*`), `Opportunity_Assessment.md`.** The OST is the source of truth for candidates. **Prioritize the opportunity space before solutions** (rank `OPP-*`, then `SOL-*` under the chosen opportunity). Fallback: if no OST, score whatever candidates exist and flag `TODO: build OST`.
- **P05 Roadmap — `Roadmap.md` (`RMI-*`).** When re-prioritizing an existing Now/Next/Later, the roadmap items are the candidates. P06 ↔ P05 is a loop, not a one-way street.
- **P07 Solution — `SOL-*` bets, `Assumption_Map.md` (`ASM-*`).** Solutions to rank for build sequencing; low-confidence Impact often means an assumption to test first.
- **P12/P14 — `MET-*` reach/usage data, `Feedback_Log.md` (`FB-*`).** Real reach and demand evidence behind Reach/Impact scores. Fallback: never fabricate a reach number — mark `TODO: pull reach from analytics`.
- If a prior artifact is missing, proceed with what exists, mark the gap `TODO: <owed artifact>`, and **never invent** a reach, impact, or confidence figure to fill a cell.

## Step-by-step
Interview-driven: ask **one topic at a time**, convert each answer into the matrix, then move on. Reuse prior-phase facts; never re-ask what P01/P04 already settled. Use **AskUserQuestion** for finite choices. Show-back the matrix after each scoring round and have the human confirm before ranking.

1. **Confirm the outcome & output path (topic 1).** Name the single `OBJ-*`/`KR-*` this ranking serves and the decision type (what-to-discover vs. what-to-build vs. what-to-sequence). Default output `<product-slug>/06_Prioritization/Prioritization_Matrix.md`.
2. **Assemble the candidate set (topic 2).** Pull `OPP-*` from the OST (or `SOL-*`/`RMI-*` for solution/roadmap ranking). Compare **at one level** — opportunities vs. opportunities, *not* an opportunity against a feature. Confirm the list with the user; don't silently add or drop.
3. **Filter, then rank (topic 3).** First apply a **categorical filter** — drop anything that fails strategy fit **or** the non-negotiable Responsible-Product floor (privacy / accessibility / security / ethics). Filtered-out items are recorded with a reason, not deleted. Only survivors get scored. (Filter-then-rank beats one mega-formula.)
4. **Choose the scoring model with the user (topic 4).** Use **AskUserQuestion** — match the framework to the decision and team maturity (see the chooser in Decision points). Default to **RICE** for general initiative ranking; offer **ICE** (fast/early), **WSJF / Cost of Delay** (timing-critical sequencing), **Weighted Scoring** (many stakeholders, auditable), **Kano** (satisfaction strategy), **MoSCoW** (fixed-deadline MVP scoping), **Value-vs-Effort** (quick triage), **Opportunity Scoring** (under-served outcomes). Pairing a categorical model (Kano/MoSCoW) *with* a scoring model is encouraged.
5. **Score each candidate — invest in the estimates, not the formula (topic 5).** Garbage in, garbage out. For each cell demand a **derivable** basis ("why a Reach of 8k and not 800?") citing the source — `MET-*` usage, `FB-*` volume, `INS-*` evidence. **Make Confidence explicit** (high/med/low or %); a low-confidence Impact is a flag to run discovery (P03) or an experiment (`EXP-*`), not to guess louder. No high score without verifiable evidence.
6. **Compute, rank, and assign labels (topic 6).** Show the arithmetic (RICE = R×I×C÷E; WSJF = CoD÷job-size). Rank, then assign **P0–P3 / MoSCoW** per Conventions §5.2. Top-N *priority* stack-ranking is endorsed; people stack-ranking is not.
7. **Sensitivity check (mandatory).** Re-run with the most uncertain input swung ±1 band (or re-weight the heaviest criterion). Record whether the top of the list **flips**. A ranking that survives is robust; one that flips on a single soft estimate is *fragile* — say so and tighten that estimate before deciding.
8. **Decide and log.** State the recommendation in plain language, the trade-off, and the ask (BLUF for stakeholders). Record the call as a `DEC-*` in `_threads/Decision_Log.md` and a `MET-*` link for the chosen bet. **Pivot and Kill are valid outcomes** — a candidate can rank to "Won't / kill."
9. **Done.** Print the output path and route the result: into `pm-phase-05-roadmap` (Now/Next/Later) and/or `pm-phase-08-prd` (MVP scope line). Note the **re-prioritization cadence** (blank-slate re-run; re-run Kano every ~12–18 months as delighters decay to table-stakes).

## Decision points
- **Which framework?** *How to decide:* reach data + many comparable bets → **RICE**; early/fast, little data → **ICE**; timing / cost-of-delay dominates → **WSJF** (but see the platform-bias caveat); many stakeholders need an auditable trail → **Weighted Scoring**; you're shaping a satisfaction strategy → **Kano**; you're cutting an MVP against a fixed date → **MoSCoW**; you just need a fast triage → **Value-vs-Effort 2×2**. If two frameworks disagree, *that disagreement is the insight* — investigate, don't average.
- **Opportunities or solutions first?** *How to decide:* if the problem isn't chosen yet, rank `OPP-*` (prioritize the opportunity space). Only rank `SOL-*` once the opportunity is committed. Mixing the two levels is the most common error.
- **Score it, or kill it outright?** *How to decide:* a candidate that fails the strategy filter or the Responsible-Product floor is removed *before* scoring — don't let a high RICE score launder an item that shouldn't ship at all.
- **Trust the number, or test first?** *How to decide:* if the rank rests on a low-confidence Impact/Reach, the right next move is an `EXP-*` or 3–5 discovery interviews, not a committed build. Confidence is the cheapest place to be honest.
- **WSJF for everything?** *How to decide:* no. WSJF/CoD is gameable and biased against platform/enablement work — use it for genuinely time-critical sequencing, not as the house default.

## Rules
- **Conform to [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md)** for every ID (`OPP-*`, `SOL-*`, `RMI-*`, `OBJ/KR-*`, `MET-*`, `DEC-*`, `RSK-*`), priority labels (P0–P3 / MoSCoW), and framework citations. Cite; never restate or drift.
- **Outcomes over outputs.** Rank problems/opportunities against an `OBJ/KR`, not a feature backlog against gut feel (Conventions §7). The output of this phase is a *decision*, not a longer backlog.
- **Strategy-first, not framework-first.** The framework structures the debate; strategy and judgement make the call. If you'll ignore the score, don't compute it ("the spreadsheet decided" is an anti-pattern).
- **AI accelerates, the human decides.** AI clusters feedback, drafts Reach/Impact, and proposes scores; the human owns the outcome it scores against, **validates the estimates aren't hallucinated**, and makes the strategic/ethical/relationship calls. AI changes the *inputs* to prioritization, never the *logic*.
- **Evidence over opinion; Confidence is explicit.** Every score traces to `MET-*`/`FB-*`/`INS-*`. A bare number is theatre.
- **Responsible-Product floor is a filter, not a tradeable score.** A high-scoring bet that fails privacy/accessibility/ethics cannot rank up — raise an `RSK-*` instead.
- **Pivot & Kill are valid.** "Won't do / kill / shelve" is a legitimate, valuable outcome. Set sunk cost aside.
- **Keep it transparent and shared.** The matrix is a living, visible artifact — opacity is how HiPPO wins.
</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../../pm-workflow/templates/) (`Prioritization_Matrix.md`). It carries the standard frontmatter from Conventions §6. It is a **`Living`** artifact — re-run on a cadence, bump the minor version each time.

### `Prioritization_Matrix.md` — the ranking (one model, optionally paired with Kano/MoSCoW)
```markdown
---
Document: Prioritization Matrix — <Product>
Document ID: PRIOR-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM name/role>
Updated: <YYYY-MM-DD>
---

## Outcome we are prioritizing against
**Objective:** OBJ-01 — <outcome> · **Key Result:** KR-01 — <measurable> · North Star: MET-01

## Filter (categorical — applied before scoring)
| Candidate | Strategy fit? | Responsible-Product floor? | Kept / Reason dropped |
|---|---|---|---|
| OPP-04 | Yes | Pass | Kept |
| OPP-09 | No (off-strategy) | — | Dropped: not in this OBJ |

## Ranking — RICE (model chosen with the user)
| ID | Candidate | Reach (src) | Impact (src) | Confidence | Effort | **RICE** | Label |
|---|---|---|---|---|---|---|---|
| OPP-04 | <opportunity> | 8k/qtr (MET-03) | 2.0 (INS-07) | 80% | 4 | **3200** | P0 / Must |
| OPP-11 | <opportunity> | 1k/qtr (MET-03) | 1.5 (est.) | 50% | 2 | **375** | P2 / Could |

RICE = (Reach × Impact × Confidence) ÷ Effort. Confidence is explicit; low-confidence rows flag `TODO: validate via EXP/discovery`.

## Sensitivity
- Swing OPP-04 Confidence 80%→50%: rank **holds** (robust).
- Swing OPP-11 Impact 1.5→3.0: would jump to P1 — **fragile**; tighten estimate before committing.

## Recommendation (BLUF)
**Do OPP-04 now** (P0); defer OPP-11 pending an experiment. Trade-off: <what we are NOT doing>. Ask: <decision needed from whom>.
Logged as DEC-06 in `_threads/Decision_Log.md`. Chosen bet carries MET-01. Re-prioritize: <date / cadence>.
```
> For a **Kano** pass, add a classification column (Basic / Performance / Delighter / Indifferent) and date it (delighters decay). For **MoSCoW**, the Label column *is* the deliverable (Must→P0, Should→P1, Could→P2, Won't→out-of-scope, recorded).

## AI prompt pack
- **ELICIT —** "From `04_Opportunity/Opportunity_Solution_Tree.md`, list the `OPP-*` under outcome `<OBJ-01>`. For each, draft a Reach (cite a `MET-*`/`FB-*` source or mark TODO), an Impact band, an explicit Confidence, and a rough Effort. Do **not** invent a reach number — flag any unsourced cell as `TODO: pull from analytics`. Ask me to confirm the candidate list before scoring."
- **GENERATE —** "Build a RICE matrix for these candidates at the inputs above. Compute (R×I×C)÷E, rank, and assign P0–P3 / MoSCoW labels. Then run sensitivity on the lowest-confidence input (±1 band) and tell me whether the top of the ranking flips."
- **CRITIQUE / RED-TEAM —** "Challenge this prioritization at the `G4`/`G6` review: (1) is anything scored against gut instead of an `OBJ/KR`? (2) which Confidence values are optimism, not evidence? (3) recompute every RICE/WSJF score independently and flag arithmetic errors. (4) does the ranking flip under a *plausible* re-estimate I dismissed? (5) is a high-scoring item quietly failing the Responsible-Product floor? (6) is WSJF making everything 'urgent' and starving platform work?"
- **GATE —** "Acting as the gate reviewer, confirm: each kept candidate ties to an `OBJ/KR` and an `OPP-*`; every score cites a source or a `TODO`; sensitivity is present; the recommendation names the trade-off and is logged as a `DEC-*`. List what's missing as `TODO: <owner>`."

## Research & specialised-agent triggers
Follow [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md): the AI proposes, you approve, findings are cited and traced.
- **Talk to a customer (Part A)** when a Reach/Impact/Confidence rests on a guessed need — 3–5 discovery interviews this week beat a louder estimate; log `INS-*` → trace to the `OPP-*` you're scoring.
- **Web research (Part B)** when you need an external benchmark to sanity-check an Impact assumption (e.g. typical conversion lift) — never adopt a single fabricated number; get a sourced range.
- **Spawn an agent** — a **calculation/verification agent** to independently recompute RICE/ICE/WSJF and run ±20% sensitivity (catch spreadsheet errors); a **research-synthesis agent** to cluster a large `FB-*` pile into candidate `OPP-*` before ranking (you verify themes against raw quotes); an **adversarial-reviewer agent** to refute the ranking before the real G4/G6 review.

## Cross-cutting hooks
This phase is the arena where the threads collide; it conforms to [`../../cross-cutting/`](../../../pm-workflow/cross-cutting/):
- **Stakeholder Management** — prioritization is where HiPPO and political battles happen; a **transparent, shared matrix + Weighted Scoring + a `DEC-*` log** is how you defuse them with evidence (BLUF the recommendation). → [`../../cross-cutting/Stakeholder_Management.md`](../../../pm-workflow/cross-cutting/Stakeholder_Management.md)
- **Continuous Discovery** — *consumes* `INS-*` as the basis for Confidence; a low-confidence top item *feeds back* a discovery request. → [`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md)
- **Metrics & Experimentation** — *consumes* `MET-*` reach/impact data; the chosen bet *must* carry a `MET-*`, and a soft Impact estimate seeds an `EXP-*`. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../../pm-workflow/cross-cutting/Metrics_and_Experimentation.md)
- **Responsible Product** — supplies the **non-negotiable floor** used as a pre-scoring filter; a bet that fails it raises an `RSK-*` rather than ranking up. → [`../../cross-cutting/Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md)
- **Product Ops** — owns the **re-prioritization cadence** and keeps the matrix a living, single-source artifact; tooling lives here. → [`../../cross-cutting/Product_Operations.md`](../../../pm-workflow/cross-cutting/Product_Operations.md)
- **Portfolio** *(multi-product)* — cross-product sequencing and resource allocation when ranking spans more than one product. → [`../../cross-cutting/Portfolio_Management.md`](../../../pm-workflow/cross-cutting/Portfolio_Management.md)

## Frameworks anchor
The prioritization frameworks pinned to this phase (Conventions §8; full cards in [`../../frameworks/`](../../../pm-workflow/frameworks/), map in [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md)):
**RICE** (Intercom — Reach×Impact×Confidence÷Effort) · **ICE** (lightweight triage) · **WSJF / Cost of Delay** (Reinertsen / SAFe — time-critical sequencing) · **Weighted Scoring** (many stakeholders, auditable) · **Kano** (Noriaki Kano — basic/performance/delighter) · **MoSCoW** (MVP scoping) · **Value-vs-Effort 2×2** · **Opportunity Scoring** (Ulwick / ODI — under-served outcomes). Each has a documented failure mode — link the card, don't re-derive it here.

## Exit-gate checklist
**P06 owns no lifecycle gate — it is a supporting decision aid.** There is no P06 block in [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md); this is a **health check / done-when** list, and the output is then carried into **G4 Roadmap Commit** (P05) and **G6 PRD Approved** (P08), where it is reviewed.
- [ ] Ranking is anchored to a named `OBJ-*`/`KR-*` (not "good ideas").
- [ ] Candidates compared **at one level** (opportunities vs. opportunities, or solutions vs. solutions).
- [ ] Categorical **filter applied before scoring**; dropped items recorded with a reason; Responsible-Product floor enforced.
- [ ] A model chosen *with* the user and matched to the decision; every score has a **derivable, cited** basis (or a `TODO`).
- [ ] **Confidence is explicit** on every row; low-confidence items flagged for discovery/experiment.
- [ ] **Sensitivity run**; fragile (flipping) rankings called out and tightened.
- [ ] Priority labels (P0–P3 / MoSCoW) assigned; recommendation states the trade-off (BLUF) and is logged as a `DEC-*`.
- [ ] Chosen bet carries a `MET-*`; re-prioritization cadence noted; no fabricated reach/impact numbers.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| "The spreadsheet decided." | Framework used to make, not structure, the call. | The score informs; you decide and own it. If you'll override it, don't compute it. |
| HiPPO wins, dressed up with a framework. | Opaque scoring, post-hoc justification. | Make the matrix transparent + shared; use Weighted Scoring with named stakeholders; log the `DEC-*`. |
| False precision (RICE = 3247.8). | Treating soft estimates as exact truth. | Invest in the *estimates*, not decimal places; make Confidence explicit; run sensitivity. |
| AI score taken as objective truth. | Pasting AI output without verification. | AI changes inputs, not logic — recompute, verify estimates aren't hallucinated, human owns the call. |
| Prioritizing a feature backlog. | Output thinking; skipping the opportunity space. | Rank `OPP-*` against an `OBJ/KR` first; solutions only after the problem is chosen. |
| Everything is "urgent." | Dogmatic WSJF / Cost of Delay. | Use WSJF only for genuinely time-critical work; protect platform/enablement bets. |
| Kano done once, never revisited. | One-and-done classification. | Re-run Kano every ~12–18 months — delighters decay to table-stakes. |
| Mismatched candidates tie or dominate. | Opportunity scored against a feature. | Compare at one abstraction level; sharpen score gaps. |
| Failed bet kept alive. | Sunk-cost continuation. | Pivot/Kill is a valid outcome; set sunk cost aside and re-rank blank-slate. |

## References
- [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) — IDs, gate ladder, priority labels (P0–P3 / MoSCoW, §5.2), traceability spine, framework citations (§8), outcomes-over-outputs (§7).
- [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md) — dual-track / double-diamond placement; P06 as a Plan/Define supporting phase feeding P05/P08.
- [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md) — RICE/ICE/WSJF/Kano/MoSCoW pinned to P06; framework anti-patterns.
- Intercom — RICE (a structuring tool, not a hard rule): https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- SVPG / Cagan — prioritize the *opportunity* space, strategy-first: https://www.svpg.com/changing-how-you-decide-which-problems-to-solve/ · https://www.svpg.com/the-opportunity-backlog/
- SAFe — WSJF / Cost of Delay (and its platform-bias caveat): https://framework.scaledagile.com/wsjf
- Product School — Kano model (and category drift): https://productschool.com/blog/product-fundamentals/kano-model
- Productboard — AI-assisted roadmap prioritization (inputs, not the decision): https://www.productboard.com/blog/using-ai-for-product-roadmap-prioritization/
- Related phases: **pm-phase-01-strategy** (supplies the `OBJ/KR` to rank against), **pm-phase-04-opportunity** (supplies the `OPP-*` candidates / OST), **pm-phase-05-roadmap** (consumes the ranking into Now/Next/Later), **pm-phase-08-prd** (consumes the MVP scope line), **pm-phase-13-experimentation** (resolves low-confidence Impact estimates).
- Curriculum cross-ref: [`../../../PM_Final_WF/03-product-development-playbook.md`](../../../PM_Final_WF/03-product-development-playbook.md) — legacy prioritization treatment (RICE/MoSCoW); superseded by this skill where they disagree.

</supporting-info>
