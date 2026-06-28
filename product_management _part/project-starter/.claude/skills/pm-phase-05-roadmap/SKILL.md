---
name: pm-phase-05-roadmap
description: Runs Phase 05 (Product Roadmap) — turns validated opportunities and strategy/OKRs into an outcome-based Now/Next/Later roadmap (a decision system, not a feature Gantt) and a Now-horizon Release Plan, then commits it at the gate. Interviews the user one topic at a time to shape outcome swimlanes, place each roadmap item (RMI-*) under an OBJ/KR and an OPP-*, set confidence/decision-dates that decay across horizons, surface dependencies (DEP-*), and build per-audience views. Produces Roadmap.md (Now/Next/Later, Living) and Release_Plan.md. Its exit gate is G4 · Roadmap Commit with decisions Persevere / Persevere-with-actions / Pivot / Hold / Kill. Conforms to ../../05_Conventions.md. Use when you need to plan what to build over a horizon, communicate intent to stakeholders, or sequence committed bets against outcomes. Triggers on "build the roadmap", "now next later", "roadmap commit", "outcome-based roadmap", "what are we building this quarter", "release plan", "sequence the bets", "G4", "phase 5 / P05".
disable-model-invocation: true
user-invocable: true
---

# Phase 05 — Product Roadmap

<what-to-do>

Turn the **strategy (P01)** and the **validated, sized opportunities (P04)** into a **roadmap of outcomes over a horizon** — a *communication and decision* artifact, not a delivery contract — plus a **Release Plan** for the committed Now slice. You leave with an agreed **Now/Next/Later** roadmap where every committed bet traces to an `OBJ/KR` and an `OPP-*`, confidence and specificity *decay* as the horizon lengthens, and stakeholders understand it as **intent, not a promise of dates**. The exit gate is **G4 · Roadmap Commit** — decision one of *Persevere · Persevere-with-actions · Pivot · Hold · Kill* ([Conventions §2](../../../pm-workflow/05_Conventions.md)). This phase conforms in full to Conventions — gate ladder **§2**, IDs (`RMI-*`) **§3**, the traceability spine **§4**, frontmatter/status **§6**, outcomes-over-outputs **§7** — and never redefines them.

The 2026 shift this phase enforces: a roadmap is a **decision system** — each bet names a *problem, segment, confidence, assumptions, and a decision date*. AI has compressed shipping, so **product judgment is the scarce resource**: "AI can make a team look productive while building the wrong things." Faster delivery *raises* the discovery bar, it doesn't lower the planning bar. Dated, timeline, feature-Gantt roadmaps fail harder than ever — replace annual lock-in with **adaptive, multi-cadence planning**.

## Inputs (from prior phases)
Read these from the product folder if present; otherwise elicit and **flag the source**. Never fabricate to fill a blank — mark `TODO: <owed — by whom — by when>`.
- **`North_Star_and_OKRs.md`** (pm-phase-01-strategy) — the `OBJ-*`/`KR-*` the roadmap is organised around, and the North Star (`MET-*`). **If missing → the roadmap has no outcomes to swim-lane against; send it back to pm-phase-01-strategy.**
- **`Opportunity_Solution_Tree.md` + `Opportunity_Assessment.md` + `Business_Case.md`** (pm-phase-04-opportunity) — the `OPP-*` nodes (sized, four-risks-rated) that committed bets must trace to. No `OPP-*` behind an item ⇒ it is a feature wish, not a roadmap entry.
- **`Prioritization_Matrix.md`** (pm-phase-06-prioritization, *supporting*) — the RICE/WSJF/Kano ranking that *informs* sequencing. If absent, invoke pm-phase-06-prioritization inline before committing the Now order.
- **`Product_Strategy.md` / Positioning** (P01/P02) — guardrails for what's in vs. deliberately out.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic — never a wall of questions). Use `AskUserQuestion` for finite choices. **Show-back** every captured item before moving on. Reuse facts already given; never re-ask. Mark unknowns `TODO:`; never invent a date, score, capacity number, or confidence.

1. **Confirm inputs & frame the horizon.** Verify the OKRs and at least one validated `OPP-*` exist. `AskUserQuestion` to choose the roadmap shape (Now/Next/Later · outcome-themed · GIST) and the review cadence (default: living artifact, re-reviewed monthly/quarterly — *not* annual).
2. **Define outcome swimlanes.** Organise lanes by **objective/outcome (`OBJ/KR`), not team or feature**. One lane per outcome the roadmap is moving. Confirm coverage: every active `OBJ/KR` has a lane or an explicit "not now".
3. **Place each bet as an `RMI-*`.** For every candidate, capture it as a roadmap item: which `OPP-*` it addresses, which `OBJ/KR` it moves, the **horizon** (Now/Next/Later), **confidence**, and — for Now — the candidate `MET-*` it will move. Show-back each `RMI-*` row.
4. **Make it a decision system, not a wish list.** For each Now/Next bet record: *problem · segment · confidence · riskiest assumption · decision date* (when we'll commit/drop). This is what separates a 2026 roadmap from a backlog with dates.
5. **Set the confidence/specificity gradient.** Now = committed, specific, capacity-checked. Next = directional, prioritised, not promised. Later = themes/outcomes only — **do not over-specify Later like Now**.
6. **Sanity-check capacity & surface dependencies.** Pressure-test the Now slice against real team capacity; do not plan at 100%. Surface cross-team/tech dependencies as `DEP-*` (owned in pm-phase-10-delivery) so they're visible now.
7. **Build the Release Plan (Now horizon).** Translate committed Now `RMI-*` into a `Release_Plan.md`: release slices, sequence, dependencies, and the outcome/`MET-*` each release is accountable for. Use story-mapping to find a coherent releasable slice (handoff to pm-phase-09-stories).
8. **Make per-audience views.** One roadmap, multiple lenses: exec (outcomes + bets, BLUF), team (slices + dependencies), customer/sales (themes only, **no dates**). One roadmap for one audience is an anti-pattern.
9. **Run G4 & log the decision.** Walk the Exit-gate checklist; review the six threads; `AskUserQuestion` for *Persevere / Persevere-with-actions / Pivot / Hold / Kill*. Write the decision to `_threads/Decision_Log.md` (`DEC-*`) and `WORKFLOW.md`. Write artifacts to `05_Roadmap/` with Conventions §6 frontmatter (Status: **Living**).
10. **Done.** Print every output path and the recorded gate decision, then recommend the next step: on **Persevere** invoke **pm-phase-07-solution-design** (de-risk the top Now bet) and/or **pm-phase-08-prd** for an already-validated change; if sequencing is contested, loop through **pm-phase-06-prioritization**; on **Pivot** loop back to the phase that owns the changed decision (often **pm-phase-04-opportunity**).

## Decision points
- **Now/Next/Later horizon boundaries.** *How to decide:* by **confidence and commitment**, not calendar — Now = we're building it; Next = we intend to, pending discovery/capacity; Later = a problem we care about, no solution committed. Confidence *must* visibly decrease Now→Later.
- **Swimlanes by outcome vs. team/feature.** *How to decide:* always outcome/`OBJ-KR`. A lane named "Platform team Q3" is a feature factory in disguise; a lane named "Cut time-to-first-value" forces every bet to justify the outcome it moves.
- **What earns a roadmap slot.** *How to decide:* an `RMI-*` enters only with a tracing `OPP-*` (evidence) + an `OBJ/KR` (outcome). No opportunity, no slot — re-route to discovery (pm-phase-03 / pm-phase-04).
- **Roadmap vs. Release Plan.** *How to decide:* the roadmap is **intent over a horizon** (outcomes, themes, confidence); the Release Plan is the **committed delivery view of Now only** (slices, sequence, `DEP-*`). Don't let the Release Plan's specificity leak into Next/Later.
- **Agent/API user class (2026).** *How to decide:* if the product serves agents/automations as well as humans, give them a roadmap lane and their own success metrics (task-success rate, human-intervention rate, API reliability) — don't leave the agent user class invisible.
- **G4 decision.** *How to decide:* all Now items traced + capacity-sane + stakeholders aligned on intent-not-contract → **Persevere**. Minor gaps with owners/dates → **Persevere-with-actions**. Evidence says the bet/sequence/segment is wrong → **Pivot** (loop to the owning phase). Blocking misalignment or untraceable Now items → **Hold**. The whole initiative no longer clears strategy/viability → **Kill**.

## Rules
- **Conform to Conventions, never redefine** — gate **§2**, IDs `RMI-*`/`OPP-*`/`OBJ-KR`/`MET-*`/`DEP-*`/`DEC-*` **§3**, spine **§4**, frontmatter/status **§6**. The roadmap, OST, and KPI scorecard are **`Living`** artifacts (§6) — never "Approved-and-frozen".
- **Outcomes over outputs (§7).** Roadmaps express outcomes, not a feature calendar. A dated Gantt of features is the build trap, not a roadmap. 54% of teams still ship output-as-success — don't be them.
- **AI accelerates, the human decides.** AI may cluster feedback/tickets, summarise signals, and draft lanes — but **never auto-prioritise by counting requests**, and a human validates every AI confidence score and owns the bet, the trade-offs, and stakeholder trust.
- **Never invent** (Conventions §11). Unknown capacity, dates, scores → `TODO:` + a recommendation to research or interview, not a plausible number.
- **Pivot & Kill are valid roadmap outcomes.** Re-sequencing, dropping a Later theme, or killing a bet that lost its evidence is the roadmap doing its job — a roadmap that only ever adds is theatre.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank templates live in [`../../templates/`](../../../pm-workflow/templates/). Each file carries the **Conventions §6** frontmatter and is written under `05_Roadmap/`.

### `Roadmap.md` (★ primary, **Living**) — required shape
Outcome swimlanes × Now/Next/Later, each cell a decision-system `RMI-*`.
```markdown
---
Document: Product Roadmap — <Product>
Document ID: ROADMAP-<PRODUCT_SLUG>-v1.0
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## How to read this
Outcomes, not a feature calendar. Confidence decreases left→right. Now = committed;
Next = directional; Later = themes only. This is intent, **not a contract of dates**.

## Outcome: <OBJ-01 / KR-01 — e.g. "Cut time-to-first-value to <1 day">
| Horizon | RMI | Bet (problem it solves) | OPP | Confidence | Decision date | Moves (MET) |
|---|---|---|---|---|---|---|
| Now   | RMI-01 | <bet> for <segment> | OPP-03 | High   | committed   | MET-02 |
| Next  | RMI-02 | <bet> for <segment> | OPP-05 | Medium | <YYYY-MM-DD> | MET-TBD |
| Later | RMI-03 | <theme/outcome only> | OPP-07 | Low    | —           | —      |

## Agent/API user lane (if applicable)
| Horizon | RMI | Bet | Confidence | Moves (MET: task-success / intervention / API reliability) |

## Deliberately NOT now
- <theme> — <why parked> (revisit <trigger>)
## Dependencies & open risks
- DEP-01 <cross-team/tech dependency> · RSK-0n <risk> (→ Risk_Register)
```

### `Release_Plan.md` (committed-Now delivery view) — required fields
Release slices in sequence for the **Now** horizon only · the `RMI-*`/`OPP-*` each slice serves · the outcome/`MET-*` it's accountable for · `DEP-*` and rollout notes · feeds story-mapping in pm-phase-09-stories. Frontmatter: `Document ID: RELEASE-<SLUG>-v1.0`, `Status: Living`.

> Placeholders above are **shape, not content** — replace every value or mark `TODO:`. Don't ship example IDs.

## AI prompt pack
Copy-paste and fill the `<>` slots. (🔎 = needs current web research / Context7 / a specialist.)
- **ELICIT —** "You are my AI-PM partner running Phase 05. Ask me, **one topic at a time**, what I need to build a Now/Next/Later roadmap for `<product>`: the outcome swimlanes from my OKRs, which `OPP-*` each bet traces to, confidence + decision date per bet, capacity, and dependencies. Reflect each answer back, mark unknowns `TODO:`, and never invent a date or capacity number."
- **GENERATE —** "Using my answers and this skill's shape, draft `Roadmap.md` with Conventions §6 frontmatter (`ROADMAP-<SLUG>-v1.0`, Status: Living). Organise lanes by `OBJ/KR`; make every Now `RMI-*` trace to an `OPP-*` and a `MET-*`; decay specificity Now→Later; add a 'Deliberately NOT now' section. Mark every gap `TODO:`."
- **CRITIQUE (adversarial) —** "Act as a hostile reviewer at G4. Attack this roadmap: which 'Now' item has no `OPP-*` or `OBJ/KR` behind it? Where is this a dated feature Gantt wearing a Now/Next/Later costume? Is Later over-specified? Is capacity assumed at 100%? Is the agent/API user class missing? Return a table: finding | severity (S1–S4) | location | fix, then the one question this roadmap can't answer."
- **GATE —** "Run the G4 Roadmap Commit checklist below as a real review, then the six-thread review. Recommend *Persevere / Persevere-with-actions / Pivot / Hold / Kill* with the evidence, and draft the `DEC-*` log row."

## Research & specialised-agent triggers
Use the consolidated playbook in [`../../prompts/research-and-agents.md`](../../../pm-workflow/prompts/research-and-agents.md). For this phase:
- **Talk to a customer (Part A)** before promoting a Next/Later bet into Now — fresh discovery confirms the `OPP-*` still holds. Faster shipping raises the discovery bar; never let a guessed need enter the Now horizon.
- **Web research (Part B) 🔎** for a *capacity/velocity benchmark* or *competitor roadmap signal* — sanity-check, don't copy; cite source + date.
- **Research-synthesis agent (Part C)** to cluster a pile of feedback/tickets into candidate themes — then **you verify the themes against raw quotes and make the prioritisation call**. AI surfaces signals; it does **not** auto-prioritise by request count or unvalidated confidence scores.
- **Adversarial-reviewer agent** at G4 to red-team the roadmap before the real review.

## Cross-cutting hooks
This phase **feeds and is reviewed against** the six threads ([`../../cross-cutting/`](../../../pm-workflow/cross-cutting/)) — cite, don't re-author:
- **Stakeholder Mgmt & Comms** — the roadmap *is* the alignment artifact; build per-audience BLUF views; sell it as intent-not-contract. Prototyping now beats spec-writing for exec buy-in.
- **Continuous Discovery** — Later/Next stay directional so discovery can still change them; the OST keeps feeding new `OPP-*`. → [`../../cross-cutting/Continuous_Discovery.md`](../../../pm-workflow/cross-cutting/Continuous_Discovery.md).
- **Metrics, Analytics & Experimentation** — every Now `RMI-*` carries a `MET-*`; no committed bet without a metric it moves.
- **Product Ops** — the roadmap lives in the source of truth on a review cadence (adaptive multi-cadence, not annual lock).
- **Responsible Product** — the privacy/accessibility/safety **floor** applies to every Now bet; new `RSK-*` logged; agent/automation bets carry oversight. → [`../../cross-cutting/Responsible_Product.md`](../../../pm-workflow/cross-cutting/Responsible_Product.md).
- **Portfolio** *(multi-product)* — sequence this roadmap against portfolio resource allocation and each product's lifecycle stage.

## Frameworks anchor
Cards in [`../../frameworks/`](../../../pm-workflow/frameworks/); pinned in [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md) (canonical attributions: [Conventions §8](../../../pm-workflow/05_Conventions.md)).
- **Now/Next/Later** (Janna Bastow / ProdPad) — the default roadmap shape.
- **Outcome-based / theme-based roadmap** — lanes are outcomes, not features.
- **Opportunity Solution Tree** (Teresa Torres) — the upstream OST extends into Now/Next/Later.
- **GIST Planning** (Itamar Gilad) — Goals / Ideas / Step-projects / Tasks, for adaptive multi-cadence.
- **User Story Mapping** (Jeff Patton) — bridge roadmap → releasable slices (→ pm-phase-09-stories).
- **RICE / WSJF / ICE** (via pm-phase-06-prioritization) — *inform* sequencing; never launder a HiPPO call.

## Exit-gate checklist
**G4 · Roadmap Commit** — run the *every-gate six-thread review* first ([`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md)), then this block verbatim. Record the decision in `_threads/Decision_Log.md` (`DEC-*`) — an unrecorded gate is a failed gate.
- [ ] Roadmap is **Now/Next/Later** (or themes/outcomes), **not** a dated feature Gantt.
- [ ] Every Now item ties to an `OBJ/KR` and an `OPP-*`; uncertainty communicated (confidence decreases Now→Later).
- [ ] Capacity sanity-checked against the team; dependencies (`DEP-*`) surfaced.
- [ ] Stakeholders understand it's a statement of **intent and outcomes**, not a contract of dates.
> **Pivot/Hold/Kill when:** a Now item has no `OPP-*` behind it · the sequence ignores cost-of-delay · capacity is assumed at 100% · the roadmap is a Gantt in disguise · stakeholders read it as a date promise. The cheapest re-plan is the one this gate forces before build.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Timeline / Gantt of dated features | Treating the roadmap as a delivery plan | Switch to Now/Next/Later tied to outcomes ([Frameworks Map §3](../../../pm-workflow/03_Frameworks_Map.md)) |
| Roadmap promised to sales by date | Roadmap-as-contract | Communicate **intent + confidence**; dates only inside the committed Release Plan |
| Output = success (features/velocity shipped) | Output-over-outcome (still 54% of teams) | Every `RMI-*` carries a `MET-*`/`OBJ-KR`; "done" = a moved metric (§7) |
| Big-bang annual plan locked for a year | Annual planning ritual | Adaptive multi-cadence; roadmap is **Living**, reviewed monthly/quarterly |
| Prioritised by HiPPO or vote/request count | No evidence-based ranking (incl. naive AI clustering) | RICE/WSJF + discovery via pm-phase-06; AI collates signals, human decides |
| "Later" specified like "Now" | False precision past the cone of uncertainty | Themes/outcomes only in Later; specificity decays with horizon |
| One roadmap, one audience | No per-stakeholder views | Exec / team / customer lenses off one source of truth |
| Agent/API user class ignored | Two-stream (human + agent) shift missed | Give agents a lane + their own metrics (task-success, intervention, API reliability) |
| "We shipped fast, so we're winning" | AI compressed building; judgment skipped | Faster shipping **raises** the discovery bar — re-validate the bet, not the velocity |

## References
- **Conventions** — [`../../05_Conventions.md`](../../../pm-workflow/05_Conventions.md) (§2 gates/decisions, §3 IDs, §4 spine, §6 frontmatter/Living, §7 outcomes-over-outputs, §8 framework attributions, §11 AI-led/human-decides).
- **Workflow Overview** — [`../../01_Workflow_Overview.md`](../../../pm-workflow/01_Workflow_Overview.md) (dual-track / double-diamond; where P05 sits).
- **Gate criteria** — [`../../checklists/gate-reviews.md`](../../../pm-workflow/checklists/gate-reviews.md) (G4) · **Frameworks** — [`../../03_Frameworks_Map.md`](../../../pm-workflow/03_Frameworks_Map.md).
- **2026 research** — Now/Next/Later origin: https://www.prodpad.com/blog/invented-now-next-later-roadmap/ · outcome-based roadmaps: https://www.prodpad.com/blog/outcome-based-roadmaps/ · OST roadmaps (Torres): https://www.producttalk.org/product-roadmaps/ · better roadmaps (Bastow/Lenny): https://www.lennysnewsletter.com/p/building-better-roadmaps-janna-bastow · GIST planning (Gilad): https://itamargilad.com/gist-framework/ · story mapping (Patton): https://jpattonassociates.com/story-mapping/ · AI's impact on PM judgment: https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management
- **Related phases** — pm-phase-01-strategy (OKRs in), pm-phase-04-opportunity (`OPP-*` in), pm-phase-06-prioritization (sequencing aid), pm-phase-07-solution-design & pm-phase-08-prd (next), pm-phase-09-stories (release slices), pm-phase-10-delivery (`DEP-*`).
- **Curriculum** — [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) (strategy-is-not-a-roadmap; outcomes vs. outputs).

</supporting-info>
