---
name: pm-phase-02-market-research
description: Runs Phase 02 (Market & Competitive Research) of the framework-agnostic product-management workflow — the supporting skill that grounds strategy and the business case in market reality. It defines the market from the demand side (people + functional job, not your category), sizes it two ways (top-down for bounds + bottom-up for the defensible number, reconciled within ~15%), maps competitive alternatives starting with the status-quo / "do-nothing", builds buyer-grounded competitive intelligence (win/loss as the backbone, not scraped competitor websites), scans macro/weak-signal trends, and converts it all into deliberate positioning. Produces Market_Analysis.md (TAM/SAM/SOM), Competitive_Analysis.md (living battlecards), and Positioning_Brief.md (Dunford 5-component order) in 02_Market/. Conforms to ../../05_Conventions.md for IDs, gates, status, severity, and the traceability spine; never redefines them. Use when you need to size a market, build a competitive landscape or battlecards, run win/loss analysis, decide positioning or category, pressure-test TAM/SAM/SOM, or "do phase 2 market research". Triggers on phrasings like "market sizing", "TAM SAM SOM", "competitive analysis", "competitive intelligence", "battlecard", "win/loss analysis", "positioning", "category design", "Porter's five forces", "PESTEL", "who are our competitors", "how big is this market", "phase 2".
disable-model-invocation: true
user-invocable: true
---

# Phase 02 — Market & Competitive Research

<what-to-do>
This phase grounds the strategy (P01) and the business case (P04) in market reality so neither rests on a wish. It defines the market from the *demand side*, sizes it credibly, maps who/what the customer would use instead (including doing nothing), and turns that into deliberate positioning. **This is a supporting phase — it owns no lifecycle gate; its checkpoint is a review point _(supporting — review point, no gate)_**: P02 is invoked *inside* P01 and P04 and its output is consumed at **G1 Strategy Sign-off** and **G3 Opportunity Go/No-Go**, so the "done-when" below is its health check, not a hard gate. This phase conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, status strings, severity, and the §4 traceability spine; it never redefines them.

## Inputs (from prior phases)
- **Phase 01 — `Vision.md`, `Product_Strategy.md`, `North_Star_and_OKRs.md`.** The strategy's diagnosis + guiding policy set *which* market questions matter; the North Star tells you which value metric to size against. **Fallback:** if strategy is still draft, run P02 *to inform* it (P02 → P01) — capture the working strategic bet and refine after.
- **Phase 00 — `Product_Charter.md`, `Stakeholder_Map.md`.** Mandate, target segment, sponsor constraints, and tailoring profile scope the market definition. **Fallback:** ask for the target segment + the functional job in one question.
- **Phase 03 — `JTBD.md`, `Personas.md`, `Research_Insights.md`** *(if discovery has run)*. Real jobs and `INS-*` are the demand-side basis for market definition and need-curve sizing — reuse them, don't re-derive. **Fallback:** if no discovery yet, define the market from the best-known job *hypothesis* and mark it `TODO: validate in P03`.
- If a prior artifact is missing, proceed with what exists, mark the gap `TODO: <owed artifact>`, and **never fabricate a market number, a competitor claim, or a win/loss quote**.

## Step-by-step
Interview-driven: ask **one topic at a time**, convert each answer into the deliverable, **show it back** for confirmation, then move on. Reuse prior-phase facts; never re-ask what P00/P01/P03 already settled. Use **AskUserQuestion** for finite choices.

1. **Confirm scope & output path.** Default `<product-slug>/02_Market/`. Confirm B2B vs B2C, product stage (0→1 / scale), and the tailoring depth (desk-only / formal study — [Tailoring Guide](../../04_Tailoring_Guide.md) P02 row).
2. **Define the market from the demand side (topic 1).** People + the functional **job**, *not* your product category or a demographic. Reuse P03 `JTBD.md` if present. Show back the one-sentence market definition before any sizing — a wrong definition poisons every number after it.
3. **Size TAM/SAM/SOM two ways (topic 2).** **Top-down** for the outer bound, **bottom-up** (accounts × ACV, or users × ARPU) for the number you defend; reconcile within ~15% and explain any gap. Log every sizing assumption explicitly; the riskiest become `ASM-*` to test in P07 and feed P04's business case. **AskUserQuestion:** which data sources do you have (analyst reports, CRM, usage, public filings)?
4. **Map competitive alternatives (topic 3).** **Start with the status quo / "do nothing"** — ~40% of B2B deals are lost to *no decision*, so it is your first competitor. Then direct, indirect, and non-consumption. No phantom competitors (ones no buyer actually evaluates).
5. **Build CI from buyers, not websites (topic 4).** **Win/loss is the backbone of CI** — interview won/lost buyers within ~14 days, because ~85% of CRM-logged loss reasons are wrong and buyer vs. seller explanations align only ~15%. Use the tiered model: live interviews for strategic deals + AI-moderated for the long tail + surveys for trends. Output **living battlecards tied to decisions**, not a quarterly deck refreshed off competitor sites.
6. **Scan macro & weak signals (topic 5, conditional).** PESTEL + AI weak-signal trend detection (treat AI hits as ~70–85% precision that degrades with horizon — a human validates each). Run **Porter's Five Forces** only for structural / capital-intensive / regulated industries (update it for ecosystems & co-opetition).
7. **Write the Positioning Brief (topic 6).** Follow the **Dunford order**: competitive alternatives → unique attributes → value (the attributes enable) → best-fit segment → market category. Decide **positioning-first vs category design** as a *sequencing* choice and record it as a `DEC-*`.
8. **Synthesize & wire the spine.** Tie every CI finding to a decision; surface market gaps / underserved segments as candidate `OPP-*` for P04's Opportunity Solution Tree; log durable findings as `INS-*` (shared with the P03 insight repo); raise market/competitive `RSK-*`; record market-definition, positioning, and category `DEC-*`.
9. **Run the health check** (done-when checklist below). If sizing is one-method-only, CI is website-sourced, or positioning starts from the category you *want*, it is not done.
10. **Done.** Print all output paths and hand off: feed `pm-phase-01-strategy` (positioning + market grounding for the Rumelt diagnosis) and `pm-phase-04-opportunity` (sizing + alternatives for the business case). If discovery is thin, recommend `pm-phase-03-discovery` next.

## Decision points
- **Define the market by category or by demand?** *How to decide:* by the functional **job** + the buyer, never by your product type or a demographic. If you can't name the job in the customer's words, loop back to `pm-phase-03-discovery` first.
- **Positioning-first or category design?** *How to decide:* category design only for genuine reframers inventing a new category with the budget to evangelise it; for most $5M–$75M firms, **position within an existing category first** — category design is the rare exception, not the default.
- **Porter's Five Forces or JTBD/Dunford-led?** *How to decide:* Porter for structural, capital-intensive, or regulated industries; JTBD market definition + Dunford positioning for software where the real alternatives are the status quo and non-consumption.
- **How much rigour?** *How to decide:* tie to the tailoring profile — Lean = desk research only; Standard = a focused market study + win/loss; Enterprise = formal sizing + continuous CI program. Record the choice; a tailored-out depth is noted in the charter.

## Rules
- **Conform to [`../../05_Conventions.md`](../../05_Conventions.md)** for every ID (`OPP-*`, `INS-*`, `ASM-*`, `RSK-*`, `DEC-*`), the gate ladder, status strings, and severity. Cite shared conventions; never restate or drift them.
- **One topic at a time, show back each artifact.** Market definition → sizing → alternatives → CI → scan → positioning. Never dump a wall of questions.
- **Outcomes over outputs.** CI exists to **change a decision**, not to fill a deck or a filed competitor library. A battlecard nobody acts on is theatre.
- **AI accelerates, the human decides.** AI synthesizes transcripts/tickets/reviews, runs AI-moderated long-tail win/loss, drafts battlecards, and does first-pass TAM/SAM math. The human owns the market definition, the category choice, validating AI-surfaced trends, the strategic interviews, and pressure-testing every sizing assumption.
- **Proprietary buyer insight beats scraped public CI.** In 2026 GenAI commoditizes public competitive scraping; the durable advantage is win/loss and churn insight an LLM can't scrape. Invest there.
- **Never invent.** No market number, competitor capability, or win/loss quote without a source → `TODO:` + a recommendation to research or interview.
- **Pivot & Kill are valid here too.** A market that fails a viability floor is a **Kill** signal feeding G3; a market definition the evidence contradicts is a **Pivot** back to P03 — surface both, don't bury them.
</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Market_Analysis.md`, `Competitive_Analysis.md`, `Positioning_Brief.md`). All carry the standard frontmatter from Conventions §6.

### 1. `Market_Analysis.md` — demand-side definition + dual-method sizing
```markdown
---
Document: Market Analysis — <Product>
Document ID: MKT-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PM>
Updated: <YYYY-MM-DD>
---
## Market definition (demand-side)
People: <segment/buyer> · Functional job: <job, in customer words> (← JOB-?? / P03)
Boundary: in-scope <…> / out-of-scope <…>

## Sizing — two methods, reconciled
| Layer | Top-down | Bottom-up | Reconciled (±15%?) | Key assumptions (ASM-?) |
|---|---|---|---|---|
| TAM | <$, source> | <accounts×ACV / users×ARPU> | <number> | <…> |
| SAM | … | … | … | <serviceable segment logic> |
| SOM | … | … | <the number we defend> | <reach × win-rate, near-term> |

## Macro / weak-signal scan (PESTEL; AI signals validated)
- <trend> — signal source, precision/horizon caveat, so-what for the bet.

## Surfaced for downstream
Candidate opportunities → OPP-?? (P04) · Market risks → RSK-?? · Decisions → DEC-??
```

### 2. `Positioning_Brief.md` — Dunford 5-component order
```markdown
---
Document: Positioning Brief — <Product>
Document ID: POS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: <PM/PMM>
Updated: <YYYY-MM-DD>
---
1. Competitive alternatives — what the buyer uses instead (incl. **status quo / do-nothing**).
2. Unique attributes — what only we have (capabilities, not adjectives).
3. Value — the value those attributes enable, in the buyer's terms (→ MET-?? where measurable).
4. Best-fit customers — the segment that cares most about that value.
5. Market category — the frame that makes the value obvious. Sequencing: positioning-first / category-design (DEC-??, with why).
```

### 3. `Competitive_Analysis.md` (Status: **Living**)
Battlecards (one per real competitor + the status-quo card), each: where they win / where we win, buyer-validated traps, objection handling, and the **decision each card informs**. Sourced from win/loss (`INS-*`), CRM-triggered and continuously updated — never a quarterly website scrape. Separate **facts from inference**; triangulate ≥2 sources per claim.

## AI prompt pack
- **ELICIT —** "From `00_Charter/Product_Charter.md` and `03_Discovery/JTBD.md`, propose a demand-side market definition (segment + functional job, not category). List the assumptions it rests on and ask me to confirm before we size anything."
- **GENERATE —** "Build TAM/SAM/SOM two ways: top-down from <analyst sources> and bottom-up from <accounts×ACV / users×ARPU>. Reconcile within 15%, flag each assumption as `ASM-??`, and refuse to produce a 'capture 1% of $X B' number. Then draft the status-quo-first list of competitive alternatives."
- **CRITIQUE / RED-TEAM —** "Challenge this market research: (1) is the market defined by a job or by our category? (2) is sizing single-method or unreconciled? (3) are any competitors 'phantoms' no buyer evaluates, and is the status quo missing? (4) which CI claims are scraped/asserted vs buyer-validated? (5) does the positioning start from the category we *want* rather than the alternatives? (6) which AI-surfaced trend is unvalidated?"
- **GATE / HANDOFF —** "Check P02 against its done-when list. Confirm SOM is defensible bottom-up, win/loss-grounded battlecards exist, positioning follows the Dunford order, and candidate `OPP-*`/`RSK-*`/`DEC-*` are surfaced for P01/P04. List what's still `TODO` with an owner before G1/G3."

## Research & specialised-agent triggers
Reference [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md) for the standing protocol and the **research-execution ladder**.
- **Execute with `/research-report`** (the workhorse): for market sizing (TAM/SAM/SOM), the competitive landscape, and positioning, run `/research-report` — use its **Decision-brief** mode for the positioning/category call — to produce a cited report in `reports/` that grounds `Market_Analysis.md` / `Competitive_Analysis.md` / `Positioning_Brief.md` (it cross-checks every figure against ≥2 sources). Escalate a full landscape sweep to the `researc_agent` CLI; plain `WebSearch` is the always-valid fallback.
- **Interview a customer/buyer when:** sizing assumptions are unvalidated, or — always — for **win/loss on strategic deals** (live, within ~14 days of the decision). This is the highest-value, least-scrapable input in the phase.
- **Web research when:** you need analyst TAM figures (Gartner/Forrester/IDC/Statista) for top-down bounds, current competitor pricing/packaging, regulatory/PESTEL shifts, or comparable-company sizing for calibration. Cite sources; separate fact from inference.
- **Spawn a specialised agent when:** a **CI/win-loss synthesis agent** to run AI-moderated long-tail interviews and cluster reasons; a **market-intel agent** to triangulate sizing across sources; a **trend-scanning agent** for weak-signal detection (human validates every hit). Use agents to *produce the evidence behind a claim*, never to invent the claim. MCP connectors can make CI queryable by the LLM as a live source.

## Cross-cutting hooks
P02 seeds and feeds these threads (full method in [`../../cross-cutting/`](../../cross-cutting/)):
- **Continuous Discovery** *(seeds heavily)* — win/loss is continuous CI; market scanning never closes; findings become `INS-*`/`OPP-*` feeding P03/P04. → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md)
- **Stakeholder Management** *(feeds)* — the positioning brief aligns exec/GTM/sales; lead with BLUF; a prototype can beat a market deck for buy-in. → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md)
- **Metrics & Experimentation** *(light feed)* — market-share / category metrics and weak-signal precision become `MET-*`; sizing assumptions become testable `ASM-*`. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md)
- **Product Ops** *(feeds)* — battlecards + CI live in the source of truth, CRM-triggered, not a stale shared drive. → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md)
- **Responsible Product** *(floor — non-negotiable)* — competitive claims must be truthful and non-deceptive; data sourcing must respect privacy/ToS (no improper scraping); if AI is used in research outputs, honor **EU AI Act Art. 50** transparency (label AI-generated content, from Aug 2026). → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md)
- **Portfolio** *(multi-product)* — this bet's competitive position relative to sibling products and the portfolio's market coverage. → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md)

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/).
- **TAM/SAM/SOM** with top-down + bottom-up reconciliation (the defensible number is bottom-up).
- **JTBD market definition / need-curve sizing** (Tony Ulwick / Strategyn) — demand-side market boundaries.
- **Positioning — *Obviously Awesome*** (April Dunford), the 5-component order.
- **Win/Loss analysis** 4-step (Clozd) — the backbone of CI; interview within ~14 days.
- **Porter's Five Forces** — structural/capital-intensive industries only; update for ecosystems/co-opetition.
- **PESTEL + AI weak-signal scanning**; **category design vs positioning** as a sequencing decision.

## Exit-gate checklist
**No hard gate — this is a supporting phase _(supporting — review point, no gate)_.** Use this as a **done-when / health check** before P02's output is consumed at **G1** (Strategy Sign-off) and **G3** (Opportunity Go/No-Go); the six-thread *every-gate* review still applies at those gates ([`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)).
- [ ] Market is defined **demand-side** (segment + functional job), not by product category or demographic.
- [ ] TAM/SAM/SOM sized **two ways and reconciled** (~15%); **SOM is the defensible bottom-up number**; no "capture 1% of $X B".
- [ ] Every sizing assumption stated; riskiest flagged as `ASM-*` for P04/P07.
- [ ] Competitive alternatives **start with the status quo / do-nothing**; no phantom competitors.
- [ ] CI is **buyer-grounded** (win/loss-led), facts separated from inference, ≥2 sources per claim; battlecards tie to decisions and are **Living**.
- [ ] AI-surfaced trends **human-validated**; precision/horizon caveats recorded.
- [ ] Positioning follows the **Dunford order**; positioning-first vs category recorded as `DEC-*`.
- [ ] Candidate `OPP-*` surfaced for P04, `RSK-*` raised, `INS-*` shared with P03, `DEC-*` logged; no decision rests on zero evidence.
- [ ] Responsible-product floor met (truthful claims, lawful data sourcing, AI-transparency where applicable).

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| "We'll capture 1% of a $50 B TAM." | Top-down-only, TAM-as-forecast. | Size bottom-up (reach × win-rate); reconcile to top-down; defend the SOM. |
| Market defined as "the X category." | Supply-side / category framing. | Redefine demand-side by the functional job + buyer; loop to P03 if the job is unclear. |
| Battlecards from competitor websites, refreshed quarterly. | CI treated as a filing exercise. | Make win/loss the backbone; CRM-triggered, living, tied to decisions. |
| Loss reasons taken from the CRM field. | Seller's story, not the buyer's (~85% wrong). | Interview won/lost buyers within ~14 days; reconcile buyer vs seller view. |
| Status quo / "do nothing" absent from competitors. | Only direct rivals counted. | List status quo first (~40% of B2B losses); add non-consumption. |
| Positioning starts from the category we want. | Tagline-first, aspiration-led. | Run the Dunford order: alternatives → attributes → value → segment → category. |
| AI-surfaced trend taken as fact. | Output treated as truth, not draft. | Human-validate each signal; record precision/horizon; cite the source. |
| CI deck filed and never used. | Output over outcome. | Tie every card to a decision; if it changes nothing, cut it. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`OPP/INS/ASM/RSK/DEC-*`), gate ladder, status, severity, §4 spine, §8 canonical citations.
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — supporting-phase placement; P02 feeds P01/P04 inside the discovery track.
- April Dunford — positioning quickstart: https://www.aprildunford.com/post/a-quickstart-guide-to-positioning
- Clozd — win/loss analysis & 2026 B2B CI strategy: https://www.clozd.com/guides/win-loss-analysis · https://www.clozd.com/blog/b2b-competitive-intelligence-strategy-2026
- thrv — JTBD market sizing: https://www.thrv.com/blog/how-to-size-a-market · Ulwick — JTBD market definition: https://www.marketingjournal.org/how-to-define-your-market-using-jobs-to-be-done-anthony-ulwick/
- HG Insights — TAM/SAM/SOM guide: https://hginsights.com/2025/03/07/tam-sam-som-the-complete-guide-to-market-sizing/ · Category vs positioning: https://www.pitchkitchen.com/blog/category-design-vs-positioning-which-does-your-b2b-company-need
- Related phases: `pm-phase-01-strategy` (consumes positioning + market grounding), `pm-phase-04-opportunity` (consumes sizing + alternatives for the business case), `pm-phase-03-discovery` (supplies/validates the demand-side jobs), `pm-phase-11-launch-gtm` (reuses positioning for GTM).
- Curriculum: [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) — strategy/market grounding context.

</supporting-info>
