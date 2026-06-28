---
name: pm-phase-07-solution-design
description: Runs Phase 07 (Solution Discovery & Design) — turns a validated opportunity (OPP-*) and committed roadmap item (RMI-*) into one or more de-risked solution bets (SOL-*) by mapping assumptions across the five risk types, testing the riskiest first with prototypes/experiments, and proving the solution is desirable, usable, feasible, viable, and ethical. Produces Assumption_Map.md, Prototype_Plan.md, Usability_Test_Plan.md, and Solution_Validation.md. Conforms to ../../05_Conventions.md. Use when you need to design and validate a solution before writing a PRD — generate solution options, run assumption mapping / the four big risks, plan a prototype or usability test, record validation evidence, or reach G5 Solution Validated. Triggers on phrasings like "design the solution", "map our assumptions", "test the riskiest assumption", "plan a prototype", "run a usability test", "is this desirable/usable/feasible/viable", "de-risk this bet", "validate the solution", "phase 7", "G5 solution validated".
disable-model-invocation: true
user-invocable: true
---

# Phase 07 — Solution Discovery & Design

<what-to-do>

Take a **validated opportunity** (`OPP-*`) and a **committed roadmap item** (`RMI-*`) and find a solution that is **desirable, usable, feasible, viable — and ethical** — *before* anyone writes a PRD or a line of production code. Diverge to **2–3 solution options** (`SOL-*`), surface every load-bearing **assumption** (`ASM-*`) across the five risk types, **test the riskiest first** with the cheapest prototype or experiment that produces learning, and record the evidence so a failed assumption triggers a **Pivot, not a cover-up**. The exit gate is **G5 · Solution Validated** ([`../../05_Conventions.md`](../../05_Conventions.md) §2). This is the *Develop* diamond of the dual-track loop ([`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) §2): discovery is cheap, delivery is expensive — spend the cheap money here. Conform to Conventions for IDs, gates, status, severity, and the traceability spine — cite the section, never redefine it.

> **Problem-before-solution guard (non-negotiable):** if the opportunity isn't validated (no `OPP-*` traced to `INS-*`/`JOB-*` at **G2/G3**), **stop and route back** to pm-phase-04-opportunity. You cannot de-risk a solution to a problem you haven't proven.

## Inputs (from prior phases)
Read these from the project folder ([Conventions §9](../../05_Conventions.md)) first; if one is missing, elicit + flag the source, and if a **gating** input is absent, stop and route back. **Cross-reference by ID — never re-describe** (Conventions §4).
- **Chosen opportunity + desired outcome** (`OPP-*` → `OBJ/KR`) — from **P04/G3** (pm-phase-04-opportunity). **If missing → STOP.** No validated problem = nothing to solve.
- **The four-big-risks first cut** sketched at G3 — refine it here into testable `ASM-*`; don't re-litigate the go/no-go.
- **Roadmap commitment** (`RMI-*` in *Now*) — from **P05/G4** (pm-phase-05-roadmap). If absent, confirm this bet is actually committed before spending build cycles.
- **Prioritization rationale** — from pm-phase-06-prioritization (supporting); reuse the score, don't re-run it.
- **JTBD / personas / insights** (`JOB-*`/`PER-*`/`INS-*`) — from **P03/G2** (pm-phase-03-discovery); every desirability claim traces to one of these.
- **North Star + OKRs** (`OBJ/KR`, `MET-*`) — from pm-phase-01-strategy; the solution must move a named outcome.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic — never a wall of questions). Use `AskUserQuestion` for finite choices. **Reuse every fact already on file; never re-ask.** Reflect each answer back before moving on. Mark anything unknown as `TODO: <what is owed — by whom — by when>` — **never invent** a quote, a test result, a metric, or a feasibility verdict.

1. **Identity & output location** (one message, free text — related): confirm the project **slug**, the `OPP-*` being solved + its outcome (`OBJ/KR`), and the default `<output-dir>` = `./<slug>/07_Solution/`.
2. **Diverge — generate solution options.** Co-author **2–3** candidate `SOL-*` for the opportunity (Design Thinking ideate). If only one approach exists, it's a *solution masquerading as an opportunity* — push back. Each `SOL-*` is a leaf on the Opportunity Solution Tree under its `OPP-*`.
3. **Converge — choose the candidate(s) to de-risk.** `AskUserQuestion` over the options against the outcome + prioritization rationale; log the choice as `DEC-*`. Carrying 2 forward into a test is fine — falling in love with one before evidence is not.
4. **Map assumptions across the five risk types** (`ASM-*`): **Desirability/Value · Usability · Feasibility · Business-Viability · Ethical** (Torres's fifth). Plot each on importance × evidence (Assumptions Mapping). Tag the `OPP-*`/`SOL-*` it belongs to.
5. **Find the riskiest.** The cells to test are **high-importance × low-evidence** — the *most dangerous*, not the easiest or the most fun. Rank them.
6. **Design the test for each riskiest `ASM-*`** (`EXP-*`, Test Card: hypothesis · test · metric · pass/fail threshold). Pick the **cheapest method that yields the learning** — interview, fake-door, concierge/Wizard-of-Oz, prototype. Write `Prototype_Plan.md` at the **lowest fidelity that answers the question** ("prototype-as-spec" — go hi-fi only for the final desirability/usability proof).
7. **Plan usability** (`Usability_Test_Plan.md`): tasks, success criteria (task time / completion — HEART), participant recruit, and the **accessibility floor (WCAG 2.2 AA)** baked in, not bolted on.
8. **Run & record validation** in `Solution_Validation.md`: evidence per risk type, what passed, what failed. A failed assumption is a **finding** — it triggers a **Pivot** (back to step 2 or to pm-phase-04-opportunity), never a quiet edit.
9. **Define the MVP / first slice** — the *smallest* thing that delivers the outcome **and** produces learning; record what's explicitly out.
10. **Responsible-product check** (the non-negotiable floor): the ethical `ASM-*`, privacy-by-design, accessibility sign-off; log new `RSK-*` (severity per §5.3).
11. **Write the artifacts** to `<output-dir>` with Conventions §6 frontmatter; update the OST (new `SOL-*`/`ASM-*` leaves → `Living`), the decision log (`DEC-*`), the risk register (`RSK-*`), and any new `MET-*` the bet will move.
12. **Exit-gate (G5) check.** Print the Exit-gate checklist; confirm each item. Record the verdict — **Persevere / Persevere-with-actions / Pivot / Hold / Kill** ([Conventions §2](../../05_Conventions.md)) — in `_threads/Decision_Log.md` and the `WORKFLOW.md` gate log.
13. **Done.** Print all output paths; recommend next: **P08 · Requirements & PRD** (pm-phase-08-prd) on Persevere — the validated `SOL-*` + MVP scope become its input. On Pivot, name the phase to loop back to.

## Decision points
- **Which assumption to test first?** *How to decide:* highest **importance × lowest evidence** — the bet that, if wrong, kills the solution. Easy-but-safe tests are theatre (research anti-pattern: testing the easiest, not the riskiest).
- **Prototype fidelity?** *How to decide:* the **lowest fidelity that answers the open question**. Paper/clickable for flow & desirability; hi-fi only when usability or final desirability is the thing being measured (SVPG: hi-fi prototype ≠ shipped product).
- **One solution or several?** *How to decide:* always start with **2–3** and compare; converge on evidence, not on the first idea.
- **Build a slice or just test?** *How to decide:* if reversible (two-way door), run the cheapest test and move; if irreversible/expensive (one-way door), demand stronger evidence before committing.
- **Pivot vs. persevere on a failed assumption?** *How to decide:* the evidence decides, not the sunk cost. A disconfirmed load-bearing assumption is a **Pivot/Kill** win, not a setback.
- **Where's the MVP line?** *How to decide:* the smallest scope that both moves the `OBJ/KR` and teaches you something; everything else is *Next/Later*.

## Rules
- **Conform to Conventions, never redefine** — IDs (`SOL-`/`ASM-`/`EXP-`/`DEC-`/`RSK-`/`MET-`) §3–§4, gate ladder + decision vocabulary §2, severity §5, frontmatter/status §6, the traceability spine §4. Cite the section.
- **Problem before solution.** Refuse to de-risk a solution without a validated `OPP-*` traced to evidence.
- **Outcomes over outputs** (§7): the solution exists to move an `OBJ/KR`, not to ship a feature.
- **Test the riskiest first**, across **all five** risk types — ethics is a first-class assumption, not an afterthought.
- **Evidence over opinion.** Every desirability claim traces to a customer; the loudest voice doesn't win. Never invent results → `TODO:`.
- **AI accelerates, human decides** (§11): AI drafts options, assumptions, and test plans and red-teams the conclusion; the human owns the bet, the trade-offs, and the gate. Guard against synthetic confidence.
- **Pivot and Kill are valid outcomes** — the cheapest failed build is the one G5 stopped.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
All files carry the Conventions §6 frontmatter block. Blank templates live in [`../../templates/`](../../templates/).
- **`Assumption_Map.md`** ★ gating — every `ASM-*` across the five risk types, plotted importance × evidence, riskiest flagged, each with a planned test.
- **`Prototype_Plan.md`** — what we're prototyping, fidelity + why, the question it answers, the metric/threshold.
- **`Usability_Test_Plan.md`** — tasks, success criteria (HEART task-success/time), recruit, accessibility (WCAG 2.2 AA) checks.
- **`Solution_Validation.md`** ★ gating — the evidence ledger: per risk type, what was tested, the result, the decision it drove.

### `Assumption_Map.md` skeleton (copy, then replace every value)
```markdown
---
Document: Assumption Map — <Opportunity / Solution>
Document ID: ASM-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## Solutions under test
| SOL | Description | OPP served | Outcome (OBJ/KR) |
|-----|-------------|-----------|------------------|
| SOL-01 | <one line> | OPP-__ | OBJ-__/KR-__ |
## Assumptions (importance × evidence)
| ASM | Risk type (Desirability/Usability/Feasibility/Viability/Ethical) | Statement | Importance (H/M/L) | Evidence (H/M/L) | Riskiest? | Test (EXP-) |
|-----|---------|-----------|--------|----------|-----------|-------------|
| ASM-01 | Desirability | <customers will…> | H | L | ✅ | EXP-01 |
| ASM-02 | Feasibility | TODO: confirm with eng — by <date> | H | L | ✅ | EXP-02 |
```

### `Solution_Validation.md` skeleton
```markdown
---
Document: Solution Validation — <Solution>
Document ID: VAL-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
| Risk type | ASM tested | Method (EXP-) | Result (pass/fail + evidence) | Decision |
|-----------|-----------|---------------|-------------------------------|----------|
| Desirability | ASM-01 | EXP-01 prototype, n=5 | <quote/metric> | Persevere |
| Ethical | ASM-05 | DPIA review | TODO: legal sign-off | Hold (DEC-__) |
**MVP / first slice:** <smallest scope that moves OBJ/KR and teaches us X>  ·  **Out of scope:** <…>
```
> Skeleton values are **placeholders** — replace them or mark `TODO:`; never ship the example rows.

## AI prompt pack
Copy-paste and fill the `<>` slots. Mark research-needing prompts 🔎.
- **ELICIT —** "You are my AI-PM partner running Phase 07 for `<feature>`. Interview me **one topic at a time** toward an `Assumption_Map` + `Solution_Validation`. Start from `OPP-<n>` and its outcome, generate **2–3** `SOL-*` options, then walk assumptions → riskiest → test design. Reflect each answer back, mark gaps `TODO:`, and **refuse to de-risk a solution if the opportunity isn't validated**. Invent nothing."
- **GENERATE (options) —** "For `OPP-<n>` (outcome `<OBJ/KR>`, jobs `<JOB-*>`), propose **3 distinct** solution approaches as `SOL-nn | description | how it serves the outcome | biggest risk`. No single 'obvious' answer — give me genuinely different bets to compare."
- **GENERATE (assumptions) —** "List the load-bearing assumptions behind `SOL-<n>` as `ASM-nn | risk type (Desirability/Usability/Feasibility/Viability/Ethical) | statement | importance | evidence`. Force at least one **Ethical** and one **Viability** assumption. Then rank by importance×(1−evidence) and name the cheapest test for the top 3."
- **CRITIQUE / RED-TEAM —** "Act as a skeptical product trio. Attack this assumption map: are we testing the *riskiest* assumptions or the easiest? Is there only one solution where there should be options? Any desirability claim resting on zero customer evidence? Any prototype hi-fi where lo-fi would do? Is the MVP actually minimal? List blocking gaps that should force a **Pivot/Hold**."
- **GATE (G5) —** "Run the G5 Solution Validated review on this `Solution_Validation`. For each of the five risks, is there evidence (not opinion)? Did any failed assumption get quietly edited instead of triggering a Pivot? Is the MVP the smallest learning slice? Recommend **Persevere / Persevere-with-actions / Pivot / Hold / Kill** with the evidence."

## Research & specialised-agent triggers
Conforms to [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md).
- **Talk to a customer** when any desirability/usability `ASM-*` is high-importance/low-evidence — recruit 5 in-segment, run story-based interviews or moderated usability tests this week; capture as `INS-*` and link the `ASM-*`. Never validate desirability from the conference room.
- **Spawn a research-synthesis agent** when prototype/usability sessions produce more raw notes than you can read — delegate *synthesis*, then verify themes against the raw quotes (guard against synthetic confidence).
- **Web research / Context7 🔎** for *feasibility* assumptions that depend on a library, SDK, API, or cloud service (route through Context7 docs MCP first), and for the **WCAG version** and **EU AI Act / EU Accessibility Act** status before you fix an accessibility/compliance target — these are fast-moving; label "verify current".

## Cross-cutting hooks
Phase 07 advances these threads (reviewed at **G5** — the every-gate six-thread block in [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md)):
- **Continuous Discovery** (heaviest) — usability tests + interviews feed `INS-*`; `SOL-*`/`ASM-*` extend the OST → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).
- **Metrics & Experimentation** — every `ASM-*` gets a test card + threshold; the bet names a `MET-*` → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Responsible Product** — the ethical assumption, privacy-by-design, WCAG accessibility floor; new `RSK-*` → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholder Management** — a working prototype now beats a spec for buy-in (2026 shift); log the bet decision `DEC-*` → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Product Operations** — artifacts in the source of truth; test cadence repeatable → [`../../cross-cutting/Product_Operations.md`](../../cross-cutting/Product_Operations.md).
- **Portfolio & Lifecycle** *(multi-product)* — confirm this bet still fits the portfolio → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md).

## Frameworks anchor
Pinned in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); cards in [`../../frameworks/`](../../frameworks/):
- **Assumption Mapping / The Four Big Risks** (Cagan/SVPG) — value/usability/feasibility/viability, importance × evidence.
- **Five Types of Assumptions** (Torres) — adds **Ethical** as the fifth.
- **Lean Startup** (Ries) — Build-Measure-Learn, test cards, pivot/persevere.
- **Design Thinking / Double Diamond** — ideate (diverge) then prototype/test (converge).
- **Opportunity Solution Tree** (Torres) — `SOL-*`/`ASM-*` as leaves under the `OPP-*`.
- **Prototype-as-Spec / High-fidelity prototypes** (SVPG) · **HEART** (Google, usability metrics) · **Strategyzer Test Cards**.

## Exit-gate checklist
**G5 — Solution Validated** *(owner: P07)* — verbatim from [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md); the six-thread *every-gate* review runs first. Decide **Persevere / Persevere-with-actions / Pivot / Hold / Kill**.
- [ ] Riskiest assumptions (`ASM-*`) listed and the **most dangerous** ones tested (not the easiest).
- [ ] Evidence the solution is **desirable** (customers want it), **usable** (they can use it — usability tested), **feasible** (eng confirms), **viable** (business/legal works) — and **ethical**.
- [ ] Prototype/test results recorded in `Solution_Validation.md`; failed assumptions triggered a Pivot, not a cover-up.
- [ ] MVP / first-slice scope is the smallest thing that delivers the outcome and produces learning.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Tested the easy assumption, not the dangerous one | Comfort / theatre | Rank by importance×(1−evidence); test the riskiest first (SVPG Four Big Risks). |
| One solution carried forward unchallenged | Fell in love with the first idea | Generate 2–3 `SOL-*` and compare on evidence (research anti-pattern: one solution per opportunity). |
| Only four risks considered | Ethics treated as a launch-day checkbox | Map the **Ethical** assumption as the fifth type (Torres). |
| Usability never tested | "It's obvious how to use it" | A G5 item — run a moderated usability test; bake in WCAG 2.2 AA. |
| Hi-fi build masquerading as a prototype | Sunk effort, slow learning | Lowest fidelity that answers the question; hi-fi ≠ shipped (SVPG). |
| Failed assumption quietly edited | Wanting a green gate | Log it in `Solution_Validation.md`; a disconfirmed bet triggers a **Pivot**. |
| Solution validated once, then frozen | Treating discovery as a phase | The OST/assumption map is `Living`; keep testing as the bet evolves. |
| MVP that's neither minimal nor viable | Scope creep / fear of shipping small | Smallest slice that moves the `OBJ/KR` and teaches something. |
| AI-generated options/results accepted as truth | Synthetic confidence | AI drafts and red-teams; humans own the bet and verify against real evidence (§11). |
| Building before the problem is validated | Skipped G2/G3 | Problem-before-solution guard — route back to pm-phase-04-opportunity. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (gate ladder + decision vocab §2, IDs §3, traceability spine §4, severity §5, frontmatter/status §6, outcomes-over-outputs §7, AI-assisted/human-led §11).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — dual-track / double-diamond context (the *Develop* diamond) + the gate ladder.
- **2026 research grounding** ([`../../reference/2026_Research_Pack.md`](../../reference/2026_Research_Pack.md) §5, §8, §18–§20): SVPG **Four Big Risks** https://www.svpg.com/four-big-risks/ · Torres **Five Types of Assumptions** https://www.producttalk.org/2023/10/five-types-of-assumptions/ · Strategyzer **Assumptions Mapping** https://www.strategyzer.com/library/how-assumptions-mapping-can-focus-your-teams-on-running-experiments-that-matter · SVPG **High-fidelity prototypes** https://www.svpg.com/high-fidelity-prototypes/ · Torres **Opportunity Solution Trees** https://www.producttalk.org/opportunity-solution-trees/ · prototyping-overtakes-spec & AI-assisted PM https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management · WCAG 2.2 https://www.w3.org/TR/WCAG22/
- **Related skills:** pm-phase-04-opportunity (upstream — the `OPP-*` this de-risks) · pm-phase-05-roadmap + pm-phase-06-prioritization (the committed/ranked bet) · pm-phase-03-discovery (the `INS-*`/`JOB-*` evidence) · pm-phase-08-prd (downstream — the validated `SOL-*` + MVP scope it specifies).
- **Curriculum:** [`../../../PM_Final_WF/02-product-design-playbook.md`](../../../PM_Final_WF/02-product-design-playbook.md) — the product-design playbook this phase operationalises.

</supporting-info>
