---
Document: Sunset Decision — <PRODUCT/FEATURE/API_NAME>
Document ID: SUNSET-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 16 · Product Sunset & Retirement. Owning skill: pm-phase-16-sunset.
Conforms to ../05_Conventions.md (§2 gate G10 End-of-Life · §3 IDs DEC-*/RSK-* used here;
OPP/OBJ/KR/MET/FB/GX/PER referenced · §4 traceability spine · §6 frontmatter · §7 outcomes-over-outputs).
Companions: Deprecation_Plan.md (the how/when), Migration_Comms.md (the messages).
Framework anchor (§8 + Research Pack §17): 5D Sunset Strategy — this file is the DIAGNOSE + DECLARE record.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
NEVER invent a usage number, cost, contract term, or deletion obligation — mark it TODO: <owed, by whom>.
-->

# Sunset Decision — <PRODUCT/FEATURE/API_NAME>

## 1. Decision & scope
<!-- BLUF. State the call in two lines, then the scope precisely. The decision is a DEC-*; it does NOT mint a new ID type. -->
- **Verdict:** `<Sunset | Kill | Pivot (fix instead) | Persevere>` — logged as **DEC-<nn>** in `_threads/Decision_Log.md`.
- **What is retired:** `<whole product | feature | API/version | pricing tier | merge into <X>>`.
- **Retirement type:** `<Full product EOL | Feature removal | API/version deprecation | Pricing-tier sunset | Merge>`.
- **Lifecycle stage move:** `Decline → Retired` (update `_threads/Portfolio_View.md`). Product slug: `<product-slug>`.
- **One-line rationale:** <forward value/usage vs. cost no longer justifies it AND it misfits strategy — so we free capacity for <outcome>>.

## 2. Diagnosis — value/usage vs. cost (the evidence)
<!-- A value-vs-cost metric tree. Usage analytics make a candidate OBJECTIVE, not AUTOMATIC.
Do NOT kill on a single low-usage number — rule out discoverability/onboarding/usability FIRST (a hidden feature isn't a worthless one). -->

**Value / usage** (pull from `12_Analytics/KPI_Scorecard.md`, `MET-*`)
| MET | What it measures | Trend (last <n> periods) | Reach (segment %) | Source |
|---|---|---|---|---|
| MET-<nn> | <active users / adoption / NRR contribution> | <↓ declining / flat / —> | <%> | <KPI_Scorecard or TODO:> |
| MET-<nn> | <task success / retention> | <…> | <%> | <… or TODO:> |

**Cost to keep** (be honest about *forward* cost — sunk cost is excluded, see §3)
| Cost driver | Estimate / period | Source |
|---|---|---|
| Maintenance / eng time | <e.g. $/qtr or FTE-weeks> | <TODO: owner> |
| Infra / licensing | <…> | <TODO:> |
| Support / ops load | <ticket volume, $/qtr> | <TODO:> |
| Opportunity cost | <the higher-outcome bet this blocks> | <link OPP-/RMI-> |

**Strategic fit** — compare to the original bet
- Original bet: `04_Opportunity/Business_Case.md` → **OPP-<nn>**, intended outcome **OBJ-<nn>/KR-<nn>**.
- Outcome then vs. now: <what it was meant to produce> → <what it produces today>.
- Fit with current strategy (`01_Strategy/Product_Strategy.md`): <aligned? cannibalized? superseded?>.

**Context ruled out** (the anti-"kill-on-one-number" check)
- [ ] Discoverability / onboarding investigated — low usage is *not* just a findability problem. <evidence / TODO:>
- [ ] Usability investigated — not a fixable UX defect. <evidence / TODO:>
- [ ] Growth genuinely attempted — exhausted `GX-*` from `15_Growth/`; not a never-marketed feature. <link / TODO:>
- [ ] Feedback signal reviewed — declining/negative `FB-*` from `14_Feedback/`. <link / TODO:>
<!-- If any box is NO, the right verdict may be Pivot (loop to pm-phase-15-growth / pm-phase-07-solution-design), not Sunset. -->

**Portfolio screen** (a screen, NOT a strategy)
- BCG / GE-McKinsey 9-box placement: <Dog / Question Mark / …> — <one line; do NOT reflexively dump "Dogs">.

## 3. Sunk cost set aside & exit criteria (the discipline)
<!-- Beat escalation of commitment (Staw 1976). Name what you're deliberately ignoring, then the pre-defined criteria. -->
- **Sunk cost explicitly set aside:** <$ / years / reputation we've already spent — these do NOT count toward the decision>.
- **The decision is made on FORWARD value-vs-cost only**, per §2.
- **Exit criteria (pre-mortem) — retire when ALL true:**
  1. <usage/reach below <threshold> for <duration> AND no viable growth lever left>
  2. <forward cost > forward value by <margin>>
  3. <strategic misfit: <reason>>
  4. <a viable destination exists for affected users (see §4)>
- **Reversal / Pivot trigger** (what would change the call): <e.g. a named enterprise renewal depends on it; a discoverability fix lifts usage >X%>.

## 4. Affected segments & destination (an exit WITH a door)
<!-- Give a viable DESTINATION, not just an exit. Triage high-touch / high-value accounts for hands-on help. -->
| Segment (PER-* / account tier) | # affected | Dependence | Destination offered | Migration effort | Touch |
|---|---|---|---|---|---|
| PER-<nn> / <self-serve> | <n / TODO:> | <low/med/high> | <alternative · export · migration path> | <low/med/high> | self-serve |
| PER-<nn> / <high-value> | <n / TODO:> | high | <named alternative + assisted migration> | high | **high-touch** |
| <Agent/API consumers> | <n / TODO:> | <…> | <new endpoint · `Sunset`/`Deprecation` headers · SDK> | <…> | <…> |

- Comms & migration mechanics are detailed in **Deprecation_Plan.md** and **Migration_Comms.md**.

## 5. Capacity & outcome freed (outcomes over outputs, §7)
<!-- Sunset is portfolio hygiene, not failure. Account for what the freed capacity will fund. -->
- Capacity freed: <FTEs / eng-weeks / infra $ / qtr>.
- Reallocated to: <OPP-<nn> / RMI-<nn> / OBJ-<nn>> — the outcome this retirement funds.
- North-star / portfolio effect: <expected MET-<nn> impact, if any>.

## 6. Risks & obligations (RSK-*)
<!-- Every data / legal / contractual exposure is an RSK-* in _threads/Risk_Register.md. Detailed handling → Deprecation_Plan.md §Data & legal. -->
| RSK | Exposure | Likelihood × Impact (§5.3) | Owner | Mitigation |
|---|---|---|---|---|
| RSK-<nn> | <data retention/erasure obligation (GDPR/CCPA)> | <L×I> | <Privacy/Legal> | <automated deletion incl. backups/test/dev> |
| RSK-<nn> | <contract / SLA commitment> | <L×I> | <Legal/Sales> | <honor through <date> / negotiate exit> |
| RSK-<nn> | <customer-trust / churn-spillover> | <L×I> | <PM> | <runway + transparent comms + destination> |

## 7. Gate — G10 · End-of-Life
<!-- Run it as a real decision. An unrecorded gate is a failed gate. Verbatim criteria: ../checklists/gate-reviews.md (that file wins). -->
- **Decision:** `<Persevere | Persevere-with-actions | Pivot | Hold | Kill>` — recorded as **DEC-<nn>** in `_threads/Decision_Log.md`.
- Checklist (each: Met / `TODO:` owner+date / Waived):
  - [ ] Retirement justified (value/usage vs. cost + strategic shift) — sunk cost explicitly set aside.
  - [ ] Affected segments identified; **migration path / alternative** offered; comms timeline set.
  - [ ] Data handled: retention, export, and **deletion/erasure** obligations met (GDPR/CCPA; automated; backups/test/dev in scope).
  - [ ] Contracts/SLAs/legal checked; Support · Sales · Finance · Legal informed.
  - [ ] Knowledge captured (what we learned); decision logged (`DEC-*`).
- Six-thread review (every gate): stakeholders/decisions logged · discovery debrief captured · metric evidence current · ops artifacts in source of truth · responsible-product (data-deletion) floor met · portfolio placement updated.

## 8. Debrief seed (5D · Debrief — post-EOL retrospective)
<!-- A sunset is a learning event. New opportunities/insights re-enter the loop at pm-phase-03-discovery / pm-phase-04-opportunity. -->
- What we learned: <…>.
- New `OPP-<nn>` / `INS-<nn>` to feed back: <…> → `03_Discovery/` / `04_Opportunity/`.

---
*Owning skill:* **pm-phase-16-sunset** · *Companions:* **Deprecation_Plan.md** (timeline + data/legal) · **Migration_Comms.md** (per-segment messages) ·
*Conventions:* ../05_Conventions.md
