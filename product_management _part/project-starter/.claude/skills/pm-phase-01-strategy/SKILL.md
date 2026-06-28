---
name: pm-phase-01-strategy
description: Runs Phase 01 (Product Strategy & Vision) — the set-the-direction phase where a PM decides where the product is going and why it will win, then proves the strategy is real (not fluff) before anyone scopes a roadmap. Interviews the user one topic at a time to produce Vision.md (an outcome-driven future), Product_Strategy.md (a Rumelt kernel — diagnosis → guiding policy → coherent actions, plus explicit non-goals), and North_Star_and_OKRs.md (one value-exchange North Star with input metrics, and 1–3 Objectives with measurable Key Results, OBJ-*/KR-*/MET-*). Its exit gate is G1 Strategy Sign-off (verdicts Persevere / Persevere-with-actions / Pivot / Hold / Kill). Conforms to ../../05_Conventions.md. Use when the user is starting a product, resetting direction, writing a vision or strategy, picking a North Star, or setting OKRs. Triggers on "set the product strategy", "write the vision", "what's our strategy", "diagnose where we'll win", "pick a North Star metric", "set OKRs / objectives and key results", "what are we NOT doing", "product strategy stack", "is our strategy fluff", "phase 1 strategy", "run G1", "sign off the strategy". Do NOT use to size the market (that is pm-phase-02-market-research), to validate the problem with customers (pm-phase-03-discovery), or to commit a roadmap (pm-phase-05-roadmap).
disable-model-invocation: true
user-invocable: true
---

# Phase 01 — Product Strategy & Vision

<what-to-do>

Decide **where this product is going and why it will win**, and prove the strategy is a *real choice* — a diagnosis, a guiding policy, and coherent actions — not a list of goals or a vision word-soup. The job is to give every downstream phase a **frozen strategic context** so the roadmap (P05), opportunities (P04), and bets (P07) all derive from the same north. Produce `Vision.md`, `Product_Strategy.md`, and `North_Star_and_OKRs.md`. The exit gate is **G1 · Strategy Sign-off** — verdicts **Persevere / Persevere-with-actions / Pivot / Hold / Kill** ([Conventions §2](../../../pm-workflow/05_Conventions.md)). This phase conforms in full to **Conventions** for the gate ladder (§2), IDs (§3), the traceability spine (§4), severity (§5), frontmatter/status (§6), and the outcomes-over-outputs prime directive (§7) — it never redefines them. See the dual-track / double-diamond context in [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md): strategy sits at the very top of the problem space, before discovery and delivery run in parallel beneath it.

**When this phase applies.** Run it once the charter is agreed (G0) and before committing a roadmap. A new product runs it in full; a new feature inside an existing product does **not** restart here — it inherits this strategy and re-enters at P03/P04. If the company strategy shifts, or evidence from the measure-learn loop (P12–P15) invalidates the bet, **re-open this phase** rather than patching the roadmap. Tailor depth per the [Tailoring Guide](../../../pm-workflow/04_Tailoring_Guide.md): Solo/Lean may collapse Vision + Strategy into one page, but the **North Star and at least one OKR are mandatory at every profile** — a strategy with no measurable outcome is theatre.

## Inputs (from prior phases)
Read these from the charter first; if any is absent, **elicit it and flag the source as a `TODO:` — never fabricate**.
- **Mandate, target segment, sponsor, success definition** (P00 `Product_Charter.md`). *Missing → route back to `pm-phase-00-charter`; you cannot set strategy without a mandate.*
- **Operating cadence + decision rights** (P00 `Operating_Model.md`) — tells you who signs off G1 and how.
- **Stakeholder map** (P00 `Stakeholder_Map.md`, `STK-*`) — who must approve, who to consult (RACI: exactly one Accountable).
- **Market/competitive read** (P02, if it exists) — TAM/SAM/SOM, positioning. *Missing → fine; flag the diagnosis as evidence-light and queue P02. Do not invent a market number.*
- **Company / portfolio strategy** — this product's strategy must cohere with the level above it (Product Strategy Stack). *Missing → `TODO:` + recommend confirming with the sponsor.*

## Step-by-step
Interview **one topic at a time** (one assistant message per topic — never a wall of questions). Use `AskUserQuestion` for finite choices. **Reflect each answer back** before moving on. **Reuse every fact already in the charter; never re-ask.** Mark anything unknown as `TODO: <what is owed — by whom — by when>` — never invent a metric, a market size, a quote, or a date. Run the steps in order; later steps derive from earlier ones.

1. **Context & output location** (group these — they're related): confirm slug, mandate, target segment, sponsor, and success definition carried from P00; set `<output-dir>` = `./<slug>/01_Strategy/`. If the mandate is missing, route back to `pm-phase-00-charter` before proceeding.
2. **Vision — the world once you've won.** Elicit a 3–10yr aspirational, outcome-driven future for the *customer* (work backwards from their better life), not a feature list. Steel-man it: would a customer recognise their life as better? Reflect back; capture in `Vision.md`.
3. **Diagnosis (Rumelt kernel, part 1).** Name the **single most important obstacle or insight** — the crux that, if cracked, makes winning possible. A strategy with no honest diagnosis is fluff. Ground it in evidence; where it rests on a guess, log an `ASM-*` and flag for P02/P03.
4. **Guiding policy + coherent actions (Rumelt kernel, parts 2–3).** Elicit the overall approach to the diagnosis, then the few coherent, mutually-reinforcing actions that enact it. Check the Product Strategy Stack cascade: mission → company strategy → **product strategy** → roadmap → goals each derives from the one above.
5. **Non-goals — what we're explicitly NOT doing.** `AskUserQuestion` to force the strategic trade-offs (segments, problems, channels, business models we decline). Strategy *is* choice; an empty non-goals list means no real strategy was made.
6. **North Star Metric.** `AskUserQuestion` over candidates → pick **one value-exchange metric** (realized customer value, a leading indicator of revenue, in your sphere of influence) — never a vanity metric (DAU, registered users, raw revenue). Name **2–4 input metrics** beneath it (metric tree). Tag the North Star as a `MET-*`.
7. **Objectives & Key Results.** Define **1–3 Objectives** (`OBJ-*`) with measurable **Key Results** (`KR-*`) that express *outcomes, not outputs*. OKRs **measure** the strategy; they are not the strategy. Each KR should move the North Star or an input metric.
8. **Responsible-product floor + strategic risks.** Re-check the privacy / accessibility / safety / ethics floor against this strategy's scope (non-negotiable, [Conventions §10](../../../pm-workflow/05_Conventions.md)); log strategic risks as `RSK-*` and material bets as `ASM-*`.
9. **Write the artifacts** to `<output-dir>` with **Conventions §6** frontmatter (`Status: Draft`): `Vision.md`, `Product_Strategy.md`, `North_Star_and_OKRs.md`. Append `DEC-*`/`RSK-*`/`MET-*` to `_threads/Decision_Log.md` and `_threads/Risk_Register.md`.
10. **Exit-gate (G1) check + hand-off.** Print the Exit-gate checklist; secure leadership sign-off; record the verdict (**Persevere / Persevere-with-actions / Pivot / Hold / Kill**) in the gate log + `Decision_Log.md` (`DEC-*`) — an unrecorded gate is a failed gate. On Persevere, recommend `pm-phase-02-market-research` to ground the diagnosis and `pm-phase-03-discovery` to validate the problem space.

## Decision points
- **Vision vs. strategy.** *How to decide:* if the statement could be on a poster and commits you to nothing, it's a vision (keep it, but it isn't strategy). Strategy names a diagnosis and forecloses options. Don't ship one labelled as the other.
- **North Star choice.** *How to decide:* pick the metric that goes **up only when a customer got real value** and that *leads* revenue. If it can rise while customers churn, it's a vanity star — reject it. Pair it with guardrails so growth isn't bought with harm.
- **OKRs vs. strategy.** *How to decide:* OKRs are the measurement/execution layer — they quantify whether the strategy is working. If your "strategy" is just a list of KRs, you've skipped the diagnosis; go back to step 3.
- **G1 verdict.** *How to decide:* all boxes checked + leadership signed → **Persevere**. Minor gaps with named owners + dates → **Persevere-with-actions**. The evidence says the diagnosis/segment/bet is wrong → **Pivot** (loop to the phase that owns that call). A blocking gap (no sponsor sign-off, no measurable outcome) → **Hold**. The strategy can't be made coherent or the opportunity isn't worth pursuing → **Kill**. A PM who never says Pivot or Kill is running theatre.

## Rules
- **Conform to Conventions, don't redefine.** Gate G1 (§2), `OBJ-*`/`KR-*`/`MET-*`/`DEC-*`/`RSK-*`/`ASM-*` IDs (§3), the traceability spine (§4), frontmatter + Draft→In Review→Approved status (§6). Cite the section; never restate the rule.
- **Outcomes over outputs (§7).** Vision, strategy, and OKRs all express *customer/business outcomes*. No feature names in a North Star; no output-counting in a KR.
- **AI accelerates, human decides.** The AI drafts the narrative, the PR-FAQ, the OKR tree, and the competitive synthesis; the **human owns the diagnosis, the non-goals, the bet, the trade-offs, and the ethics** — and is accountable. *Amplify your thinking, don't abdicate it.*
- **Never invent.** Every missing market size, metric baseline, or customer claim is a `TODO:` or an `ASM-*` with an owner. A blank with an owner is honest; a fabricated figure is a defect that propagates into every downstream gate.
- **Distribution is the new bottleneck (2026).** As building gets cheap, the strategy must answer *how customers will find and adopt this*, not just what it does. A strategy silent on distribution is incomplete.
- **One topic at a time; reuse prior facts.** `AskUserQuestion` for finite choices (non-goals, North Star candidate). Carry the slug, segment, and sponsor from P00 into every artifact.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank templates live in [`../../templates/`](../../../pm-workflow/templates/). Each file opens with the **Conventions §6** frontmatter block (`Status: Draft`).

- **`Vision.md`** ([template](../../../pm-workflow/templates/Vision.md)) — the 3–10yr outcome-driven future from the customer's POV (work-backwards). Optional PR-FAQ framing for clarity.
- **★ `Product_Strategy.md`** ([template](../../../pm-workflow/templates/Product_Strategy.md)) — the Rumelt kernel: **Diagnosis → Guiding Policy → Coherent Actions**, the Product Strategy Stack alignment, and explicit **non-goals**.
- **★ `North_Star_and_OKRs.md`** ([template](../../../pm-workflow/templates/North_Star_and_OKRs.md)) — one North Star (`MET-*`) + 2–4 input metrics; 1–3 `OBJ-*` with measurable `KR-*`.

### `Product_Strategy.md` skeleton (copy, then replace every value)
```markdown
---
Document: Product Strategy — <Product>
Document ID: STRAT-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## 1. Diagnosis — the single most important obstacle/insight
<the crux; evidence or ASM-nn where it's a bet>
## 2. Guiding policy — our overall approach to the diagnosis
<the chosen direction; what makes us able to win here>
## 3. Coherent actions — the few mutually-reinforcing moves
- <action 1> · <action 2> · <action 3>  (each enacts the policy)
## 4. Strategy Stack alignment
Mission → Company strategy → **This product strategy** → Roadmap → Goals  (each derives from the one above)
## 5. Non-goals — what we are explicitly NOT doing
- <segment / problem / channel / model we decline> — <why>
## 6. Distribution — how customers will find & adopt this
<the go-to-market thesis; TODO: confirm via P02 if evidence-light>
## 7. Strategic risks & assumptions
RSK-nn <risk> · ASM-nn <load-bearing bet → test in P02/P03>
```

### `North_Star_and_OKRs.md` skeleton
```markdown
---
Document: North Star & OKRs — <Product>
Document ID: NSOKR-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## North Star (MET-01): <value-exchange metric>  — baseline: TODO  | guardrails: <no harm to …>
Input metrics: <MET-02> · <MET-03> · <MET-04>   (the levers that move the star)
## OBJ-01: <qualitative outcome>
- KR-01: <from X to Y by date — an outcome, not a shipped feature>
- KR-02: <…>
## OBJ-02: <…>
```
> Every value above is a **placeholder** — replace it or mark `TODO:`. No baseline is invented.

## AI prompt pack
Copy-paste and fill the `<>` slots. Mark prompts needing live/external data with 🔎 (web research or a customer — never trust memory for market size or customer claims).

- **ELICIT —** "You are my principal PM running Phase 01 (Strategy). Interview me **one topic at a time** to fill a Vision, a Rumelt-kernel Product Strategy, and a North Star + OKRs for `<product>` serving `<segment>` (mandate from the charter: `<…>`). Start with the **vision** (the customer's better future), then the **diagnosis** (the one obstacle that decides whether we win). Reflect each answer back, mark unknowns `TODO:`, and never invent a market number or a customer claim."
- **GENERATE —** "Given my diagnosis `<…>`, guiding policy `<…>`, and segment `<…>`, draft (a) a Product Strategy Stack alignment, (b) 3 candidate **North Star** metrics with the input-metric tree under each, and (c) 1–3 Objectives with measurable Key Results that move those metrics. Flag any figure I haven't supplied as `TODO:` — do not fabricate baselines."
- **CRITIQUE / RED-TEAM —** "Act as the leadership review board challenging G1. Attack this strategy: Is there a *real* diagnosis or just goals and adjectives (Rumelt fluff test)? Is the North Star a **value-exchange** metric or a vanity metric that can rise while customers churn? Are the OKRs outcomes or disguised output? Is there an explicit non-goals list, or does this try to do everything? Is distribution addressed? List the gaps that should force Persevere-with-actions, Pivot, or Kill."
- **GATE —** "Run the G1 · Strategy Sign-off checklist against `Vision.md`, `Product_Strategy.md`, and `North_Star_and_OKRs.md`. For each criterion return Pass / TODO(owner·date) / Waived(rationale). Then recommend a verdict — Persevere / Persevere-with-actions / Pivot / Hold / Kill — with the evidence, and the next command."

## Research & specialised-agent triggers
See the cross-phase guide [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md). For this phase:
- **Talk to a customer** when the diagnosis asserts a need/pain the customer hasn't confirmed — the answer is a customer, not the conference room. Queue `pm-phase-03-discovery`; log the load-bearing claim as an `ASM-*` and hold the dependent strategy line at `TODO:` until validated.
- **🔎 Web research** when the diagnosis or distribution thesis rests on market size, category trends, or competitive moves — recommend `pm-phase-02-market-research` (TAM/SAM/SOM, positioning); cite each source, never guess a figure. (Library/SDK/tool questions go through the Context7 docs MCP first.)
- **Spawn a specialised agent** for **competitive/market synthesis** (parse many reports into a positioning grid) or **OKR-tree drafting** from the strategy — then verify its output yourself; the agent drafts, you own the bet.

## Cross-cutting hooks
This phase **seeds** three of the six threads (reviewed at every gate; [Conventions §10](../../../pm-workflow/05_Conventions.md)):
- [`../../cross-cutting/Stakeholder_Management.md`](../../../pm-workflow/cross-cutting/Stakeholder_Management.md) — G1 sign-off, the strategic-context narrative for empowered teams, and the first `DEC-*` entries (lead with BLUF: outcome → trade-off → ask).
- [`../../cross-cutting/Metrics_and_Experimentation.md`](../../../pm-workflow/cross-cutting/Metrics_and_Experimentation.md) — **owns** the North Star + input-metric tree and the `OBJ-*`/`KR-*` stack that P12 will instrument.
- [`../../cross-cutting/Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md) — the privacy/accessibility/safety/ethics floor and North Star **guardrails** so growth isn't bought with harm.
It **feeds** [`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md) (the strategy frames which opportunities matter) and [`../../cross-cutting/Portfolio_Management.md`](../../../pm-workflow/cross-cutting/Portfolio_Management.md) (coherence with company/portfolio strategy).

## Frameworks anchor
Full cards in [`../../frameworks/`](../../../pm-workflow/frameworks/); pinned to phases in [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md). For P01: **Product Strategy Stack** (Mehta — structure the cascade), **Good Strategy / Bad Strategy** (Rumelt — diagnosis → guiding policy → coherent action; the fluff test), **OKRs** (Doerr/Grove — measure the strategy), **North Star Metric + metric tree** (Amplitude), **Working Backwards / PR-FAQ** (Amazon — force clarity on value), **Business Model / Lean Canvas** (Osterwalder/Maurya — viability sketch), **Escaping the Build Trap** (Perri — outcomes over outputs). *A framework pressure-tests the call you can defend; it doesn't make the call ([Frameworks Map §3](../../../pm-workflow/03_Frameworks_Map.md)).*

## Exit-gate checklist
**G1 · Strategy Sign-off** ([`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md) — verdicts Persevere / Persevere-with-actions / Pivot / Hold / Kill). The six-thread review runs first; then all must be true:
- [ ] Vision is outcome-driven (a world-once-you've-won, not a feature list) and stakeholder-approved.
- [ ] Strategy passes the Rumelt test: a real **diagnosis**, a **guiding policy**, and **coherent actions** — not a list of goals/fluff.
- [ ] One **North Star Metric** (a value-exchange metric, not vanity) with 2–4 input metrics named.
- [ ] 1–3 **Objectives** with measurable **Key Results** (`OBJ-*`/`KR-*`); they express outcomes, not outputs.
- [ ] Explicit **what we're NOT doing** (the strategic trade-offs).
- [ ] Leadership signed off; strategy is coherent with any portfolio/company strategy.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| "Strategy" is a list of goals/values | No diagnosis — OKRs or aspirations dressed as strategy | Run the Rumelt kernel (steps 3–4): name the one obstacle, then the policy + actions. |
| Vision and strategy conflated | A poster slogan labelled "strategy" | Separate the artifacts (Decision point 1): vision = future; strategy = the hard choices. |
| OKRs treated *as* the strategy | Skipped the diagnosis; jumped to metrics | OKRs **measure** the strategy; write the strategy first (step 4), then derive OKRs (step 7). |
| Vanity North Star (DAU, signups, raw revenue) | Picked an easy-to-move number, not realized value | Choose a **value-exchange** metric that leads revenue, with guardrails (step 6). |
| No non-goals — strategy tries to do everything | Avoiding the trade-off conversation | Force explicit non-goals (step 5); strategy *is* choice. |
| Date-locked Gantt of features handed down as "the plan" | Feature-factory reflex; output over outcome | Defer to P05 Now/Next/Later tied to outcomes; strategy gives context, not a feature calendar. |
| Features handed to teams without strategic context | Treating teams as output machines | Give empowered teams **problems + strategic context**, not a feature list (product operating model). |
| Strategy silent on distribution | 2026 shift missed — building is cheap, adoption isn't | Add the distribution thesis (skeleton §6); flag for P02 if evidence-light. |
| Invented market size / customer claim in the diagnosis | Answered an external/customer question from the room | `TODO:` + route to P02 (web) or P03 (customer); log an `ASM-*`. |
| Pasting AI-drafted strategy in without owning it | Abdicating judgment to the model | AI drafts; the human owns diagnosis, non-goals, bet, ethics — *amplify, don't abdicate*. |

## References
- [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) — the contract (§2 gate ladder incl. G1, §3 IDs, §4 traceability spine, §6 frontmatter/status, §7 outcomes-over-outputs, §8 canonical citations, §10 threads).
- [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md) — the spine, double-diamond / dual-track context, and where strategy sits.
- [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md) · [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md) · [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md).
- 2026 research (grounding the shifts + anti-patterns): Product Strategy Stack — https://www.ravi-mehta.com/product-strategy-stack/ · Product Operating Model — https://www.svpg.com/the-product-operating-model-an-introduction/ · Cagan's new standard for product in the age of AI — https://visitmy.website/2026/04/24/marty-cagans-new-standard-for-product-in-the-age-of-ai/ · North Star framework — https://amplitude.com/blog/product-north-star-metric · OKRs vs strategy — https://www.antmurphy.me/newsletter/okrs-strategy · Working Backwards PR-FAQ — https://workingbackwards.com/concepts/working-backwards-pr-faq-process/
- Curriculum: [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) · [`../../../PM_Final_WF/01-product-strategy-summary.md`](../../../PM_Final_WF/01-product-strategy-summary.md).
- Related phases: **pm-phase-00-charter** (prior — the mandate this strategy serves) · **pm-phase-02-market-research** (grounds the diagnosis) · **pm-phase-03-discovery** (validates the problem space) · **pm-phase-05-roadmap** (turns this strategy into outcomes over a horizon).

</supporting-info>
