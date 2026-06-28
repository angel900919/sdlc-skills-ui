---
name: pm-phase-16-sunset
description: Runs Phase 16 (Product Sunset & Retirement) — the deliberate, multi-month process of retiring a product, feature, API, or pricing tier responsibly instead of letting it rot or killing it abruptly. It interviews the user one topic at a time to diagnose the case (usage/value vs. cost and strategic fit), set sunk cost aside with a pre-mortem and exit criteria, decide the retirement type, identify affected segments and give them a viable migration destination, size the sunset runway (estimate, then double it), build a 5-7-touchpoint multi-channel comms plan, and handle the data/legal lifecycle (GDPR retention/erasure, contracts, SLAs) — then produces Sunset_Decision.md, Deprecation_Plan.md, and Migration_Comms.md, logs the DEC-*, and runs a post-sunset retrospective that feeds new OPP-* back to discovery. Its exit gate is G10 End-of-Life. Conforms to ../../05_Conventions.md. Use it when the user wants to sunset/retire/deprecate/EOL a product or feature, kill a low-usage feature, deprecate an API, retire a pricing plan, plan a migration off a product, or run phase 16 / G10. Triggers on phrasings like "sunset this product/feature", "should we kill <feature>", "deprecate our API / v1", "end-of-life plan", "retire / wind down <product>", "migrate customers off X", "phase 16 / G10 / EOL", "this has low usage, should we remove it", "portfolio rationalization / decline stage".
disable-model-invocation: true
user-invocable: true
---

# Phase 16 — Product Sunset & Retirement

<what-to-do>

Retire a product, feature, API, or pricing tier **responsibly** — justify the decision on value/usage vs. cost and strategic fit (sunk cost set aside), give affected customers a viable destination, communicate transparently across a real runway, and meet data, legal, and contractual obligations — so the retirement frees capacity for higher-outcome bets without burning customer trust. Produce `Sunset_Decision.md`, `Deprecation_Plan.md`, and `Migration_Comms.md`, log the decision as a `DEC-*`, and run a post-sunset retrospective. The exit gate is **G10 — End-of-Life** (retirement justified; migration, comms, data, and legal handled; sunset approved). This phase conforms in full to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, severities, status strings, the traceability spine, and the §8 framework citations — it does not redefine them.

**When this phase applies.** Run it for any planned retirement: a whole product reaching Decline, a feature removal, an API/version deprecation, a pricing-plan/tier sunset, or a merge into another product. Sunset is a **deliberate multi-month process** (Research Pack §17), not a switch-flip — distinguish the *sunset runway* (still supported, migration open) from the *deprecation/EOL date* (off). P16 does not own a new ID type: the sunset call is a `DEC-*` and obligations are `RSK-*` (Conventions §3.3, Portfolio/Lifecycle thread). A feature retired mid-life does **not** restart the lifecycle — re-enter here directly.

## Inputs (from prior phases)
Read these if they exist; otherwise elicit and flag the source as `TODO:` — never invent usage, cost, or contract facts.
- **Usage & cost evidence** — `KPI_Scorecard.md` / `MET-*` from `pm-phase-12-analytics`; declining engagement, low reach, high maintenance/infra/support cost. *Fallback:* if usage isn't instrumented, you cannot kill on a number you don't have — recommend `pm-phase-12-analytics` first.
- **Growth & feedback signals** — exhausted `GX-*` from `pm-phase-15-growth`; declining/negative `FB-*` from `pm-phase-14-feedback`. *Fallback:* if growth was never genuinely attempted, the problem may be discoverability, not value (see Decision points).
- **The original bet** — `Business_Case.md` / `OPP-*` / `OBJ/KR` from `pm-phase-04-opportunity` and `pm-phase-01-strategy`: compare the outcome it was meant to produce against what it produces now, and against the current strategy.
- **Stakeholders, ops & floor** — `Stakeholder_Map.md` (`STK-*`), `Operating_Model.md`, and the responsible-product floor from `pm-phase-00-charter`; the `Portfolio_View.md` thread. *Fallback:* if no portfolio view exists, sketch a quick one (lifecycle stage per product) before deciding.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, not a wall of questions). Use `AskUserQuestion` for finite choices. **Show back** each answer before advancing. Reuse every fact already given; never re-ask. Mark anything unknown as `TODO: <owed, by whom>` — never invent a usage number, cost, contract term, or deletion obligation.

1. **Scope & output location** (one message): what exactly is being retired (whole product / feature / API or version / pricing tier / merge); confirm the **slug**; set product `stage = sunset`. Default `<output-dir>` = `./<slug>/16_Sunset/`.
2. **Diagnose the case** (5D *Diagnose*): pull usage (`MET-*`), cost, and strategic fit; compare to the original `Business_Case`/`OPP-*`. **Do not kill on a single low-usage number** — investigate discoverability, onboarding, and usability context first (a hidden feature isn't a worthless one). Usage analytics make candidates *objective*, not *automatic*.
3. **Sunk-cost / pre-mortem check** (the decision): explicitly set the sunk cost aside (escalation of commitment, Staw 1976) and name the **exit criteria** that justify retirement *or* a Pivot. Decide the verdict — Kill/Sunset is the usual outcome here, but Pivot (fix discoverability, re-home the feature) and even Persevere are valid.
4. **Retirement type** (`AskUserQuestion`, single-select): *Full product EOL* · *Feature removal* · *API / version deprecation* · *Pricing-tier sunset* · *Merge into another product*. Screen the portfolio with BCG / GE-McKinsey 9-box, but treat them as screens, **not** a strategy that reflexively dumps "Dogs."
5. **Affected segments & destination** (`PER-*`/segments): identify who depends on this and give a **viable destination, not just an exit** — an alternative, a migration path, an export. Triage high-touch / high-value accounts for hands-on help.
6. **Sunset runway & timeline**: distinguish runway (supported, migration open) from the EOL date; **estimate the window, then double it.** Maintain quality and support *during* the runway (cutting support the day you announce is the classic trust-killer). For APIs, use standardized `Sunset`/`Deprecation` HTTP headers and a generous, dev-friendly window.
7. **Comms plan** (the single biggest determinant of a clean sunset): **5-7 touchpoints, multi-channel**, transparent about *why / timeline / migration path*. Tailor per segment; BLUF for execs and internal teams. Avoid the abrupt 30-day notice.
8. **Data & legal lifecycle**: retention, **export**, and **deletion/erasure** (GDPR/CCPA storage-limitation; the EDPB 2025 audit expects *automated* deletion + data *classification*, with test/dev/backup in scope). Check contracts/SLAs; brief Support, Sales, Finance, and Legal. Log each obligation as `RSK-*`.
9. **Write the three deliverables** with Conventions §6 frontmatter: `Sunset_Decision.md` (`SUNSET-<SLUG>-v0.1`), `Deprecation_Plan.md` (`DEPREC-<SLUG>-v0.1`), `Migration_Comms.md` (`MIGCOMMS-<SLUG>-v0.1`).
10. **Log & thread**: record the call as `DEC-*` in `_threads/Decision_Log.md`; update `_threads/Portfolio_View.md` (lifecycle stage → retired).
11. **Exit-gate (G10) check.** Print the checklist below and run it as a real decision (*Persevere · Persevere-with-actions · Pivot · Hold · Kill*). Unconfirmed migration/data/legal items → **Persevere-with-actions** with owned `TODO:`s, not a blank pass.
12. **Debrief (5D *Debrief*).** Run a post-sunset retrospective: what we learned, freed capacity, and any new `OPP-*`/`INS-*` to feed back into `pm-phase-03-discovery` / `pm-phase-04-opportunity`. Print all output paths.

## Decision points
- **Sunset vs. fix-discoverability (Pivot).** *How to decide:* if usage is low, diagnose *why* first — poor discoverability/onboarding/usability means **fix it** (loop to `pm-phase-15-growth` / `pm-phase-07-solution-design`); genuine low value-vs-cost **and** strategic misfit means sunset.
- **Retirement type.** *How to decide:* a self-contained capability nobody depends on → feature removal; a contract/integration surface → API deprecation (longer runway, headers); a commercial SKU → pricing-tier sunset with grandfathering options; a redundant product → merge.
- **Runway length & phasing.** *How to decide:* drive it from contractual obligations, migration complexity, and segment dependence; estimate, then double. Phased feature-by-feature sunset for complex products; a clean cut only for trivial, low-dependence cases — never an abrupt kill for developer-facing surfaces.
- **G10 verdict.** *How to decide:* justified + migration + comms + data + legal all handled → Persevere. Items in flight with owners → Persevere-with-actions. Unmet erasure/contractual obligation → Hold. Diagnosis says the problem is fixable → Pivot. Record the verdict; an unrecorded gate is a failed gate.

## Rules
- **Conform to Conventions for everything shared** — `DEC-*` and `RSK-*` are used here; `OPP/OBJ/KR/MET/FB/GX/STK/PER` are *referenced*, owned by their phases. Never restate or redefine gates, IDs, status strings, or §8 citations — cite the section.
- **Outcomes over outputs.** Retire output that no longer produces an outcome, and account for the **outcome the freed capacity will fund** (Conventions §7). Sunset is portfolio hygiene, not failure admission.
- **AI accelerates; the human decides.** AI merges fragmented portfolio data, runs "what-if" scenarios, drafts comms and migration guides, and triages accounts — the human owns the kill decision, customer trust, and **data-deletion accountability**. *Strategy first, AI second.*
- **One topic at a time; reuse prior facts; never re-ask.** Carry slug, stage, segments, and the original bet through every step.
- **Mark unknowns, don't invent.** Every missing usage figure, cost, contract term, or deletion obligation is `TODO: <owed, by whom>`.
- **Pivot and Kill are valid — and so is Persevere.** Killing on a single low-usage number without diagnosis, or escalating commitment to a dying bet, both fail the gate. The cheapest sunset is the clean one; the most valuable Pivot is the feature you fixed instead of killed.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Sunset_Decision.md`, `Deprecation_Plan.md`, `Migration_Comms.md`). Each carries the Conventions §6 frontmatter block.

### `Sunset_Decision.md` — required sections
1. **Decision & scope** — what's retired, retirement type, the `DEC-*` id, verdict (Sunset/Kill/Pivot/Persevere).
2. **Diagnosis** — usage (`MET-*`), cost, strategic fit vs. the original `OPP-*`/`Business_Case`; discoverability/usability ruled out.
3. **Sunk-cost & exit criteria** — what was explicitly set aside; the criteria that justify the call (pre-mortem).
4. **Affected segments & destination** — who's impacted (`PER-*`); the migration path / alternative offered.
5. **Capacity & outcome freed** — what the team does next (the outcome the retirement funds).
6. **Risks & obligations** — `RSK-*` for data/legal/contractual exposure.

### `Deprecation_Plan.md` skeleton (copy, then replace every value)
```markdown
---
Document: Deprecation Plan — <Product/Feature/API>
Document ID: DEPREC-<SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---
## Timeline (runway → EOL — estimate, then double)
| Phase | Date | What changes | Support level |
|---|---|---|---|
| Announce | <YYYY-MM-DD> | banner + email + docs; `Deprecation` header (API) | Full |
| Runway | <…> | migration open; high-touch triage | Full |
| Read-only / wind-down | <…> | new sign-ups off; `Sunset: <date>` header | Maintained |
| EOL | <YYYY-MM-DD> | access off; export window closes | — |
## Migration & data
Destination: <alternative/path> · Export: <format, window> · Deletion: <retention → automated erasure; backups/test in scope> → RSK-01
## Legal & teams
Contracts/SLAs checked: <…> · Informed: Support · Sales · Finance · Legal/Privacy
```
> Dates/levels above are **placeholders** — replace or mark `TODO:`; never ship them.

## AI prompt pack
Copy-paste and fill the `<>` slots. (Pair with [`../../prompts/`](../../prompts/).)
- **ELICIT —** "You are my AI product manager running Phase 16. Ask me, **one topic at a time**, what's needed to decide and plan the sunset of `<product/feature/API>`: scope, usage/cost diagnosis, sunk-cost/exit criteria, retirement type, affected segments + destination, runway, comms, and the data/legal lifecycle. Reflect each answer back, mark gaps as `TODO:`, and don't invent usage, cost, or contract facts."
- **GENERATE —** "Using my answers and the section shapes in this skill, draft `Sunset_Decision.md`, `Deprecation_Plan.md`, and a 5-7-touchpoint `Migration_Comms.md` with Conventions §6 frontmatter. Make the comms transparent (why / timeline / migration path), tailor per segment, give a viable destination (not just an exit), and include data export + automated-deletion steps. Log the call as a `DEC-*`."
- **CRITIQUE / RED-TEAM —** "Act as a skeptical portfolio reviewer and a privacy counsel attacking G10. Is the kill diagnosed (or is low usage really a discoverability problem)? Is sunk cost driving this (escalation of commitment)? Is the runway realistic (did we double the estimate)? Are we cutting support the moment we announce? Is there a real migration destination? Are erasure obligations *automated* and is test/dev/backup data in scope (EDPB)? List blocking gaps that should Hold or Pivot the gate."
- **GATE —** "Run G10 as a real decision, not a rubber stamp. Walk the Exit-gate checklist + the six-thread review; mark each item Met / `TODO:` (owner+date) / Waived. Then recommend one of *Persevere · Persevere-with-actions · Pivot · Hold · Kill* with the evidence, and name the next command."

## Research & specialised-agent triggers
See [`../../prompts/research-and-agents.md`](../../prompts/research-and-agents.md) for the standing playbook.
- **Customer interview — recommend when:** high-touch / high-value accounts depend on what's retiring — talk to them about migration friction and the destination *before* announcing; don't infer impact from a dashboard alone.
- **Web research — recommend when:** confirming current **data-erasure/retention obligations** (GDPR storage limitation, CCPA, the EDPB 2025 erasure framework, sector rules) or **API deprecation conventions** (`Sunset`/`Deprecation` headers). Confirm editions; never trust memory on compliance.
- **Specialised agent — spawn when:** a **portfolio-data agent** to merge ERP/CRM/analytics/support into one value-vs-cost view and detect overlap/cannibalization; a **comms agent** to draft per-segment touchpoints + migration guides; a **data-classification/deletion agent** to enumerate what must be exported vs. erased (incl. backups/test/dev) and seed `RSK-*`. Hand each the slug, scope, and affected segments.

## Cross-cutting hooks
Phase 16 lives in the Portfolio thread but exercises five of the six (Conventions §10):
- **Portfolio & Lifecycle** *(this is P16's home thread)* — move the product to Decline→Retired; reallocate freed capacity by strategic value, not lobbying. → [`../../cross-cutting/Portfolio_Management.md`](../../cross-cutting/Portfolio_Management.md).
- **Responsible Product** — the **data-deletion floor**: lawful retention, export, automated erasure (incl. backups/test/dev). Non-negotiable. → [`../../cross-cutting/Responsible_Product.md`](../../cross-cutting/Responsible_Product.md).
- **Stakeholders & Communication** — comms is the single biggest determinant of a clean sunset; brief Support/Sales/Finance/Legal; log `DEC-*`. → [`../../cross-cutting/Stakeholder_Management.md`](../../cross-cutting/Stakeholder_Management.md).
- **Metrics & Experimentation** — usage/cost `MET-*` make candidates objective; investigate context before acting. → [`../../cross-cutting/Metrics_and_Experimentation.md`](../../cross-cutting/Metrics_and_Experimentation.md).
- **Continuous Discovery** — the debrief feeds new `OPP-*`/`INS-*` back to discovery; a sunset is a learning event. → [`../../cross-cutting/Continuous_Discovery.md`](../../cross-cutting/Continuous_Discovery.md).

## Frameworks anchor
Pinned to P16 in [`../../03_Frameworks_Map.md`](../../03_Frameworks_Map.md); full cards in [`../../frameworks/`](../../frameworks/):
- **Product Life Cycle — Decline stage** — the lifecycle frame for retirement decisions.
- **5D Sunset Strategy** — Diagnose → Design → Declare → Deliver → Debrief.
- **ProductPlan 10-step EOL checklist** + phased feature-sunset sequence.
- **BCG Growth-Share Matrix / GE-McKinsey 9-box** — portfolio *screens only*, not a strategy.
- **Pre-mortem & explicit exit criteria** — to beat sunk cost / escalation of commitment (Staw 1976).
- **`Sunset` / `Deprecation` HTTP headers** — the standard for API/version deprecation runways.

## Exit-gate checklist
G10 — End-of-Life (copied verbatim from [`../../checklists/gate-reviews.md`](../../checklists/gate-reviews.md); if they ever disagree, that file wins):
- [ ] Retirement justified (low value/usage vs. cost, strategic shift) — sunk cost explicitly set aside.
- [ ] Affected customers/segments identified; **migration path** or alternative offered; comms timeline set.
- [ ] Data handled responsibly: retention, export, and **deletion/erasure** obligations met (GDPR/CCPA where applicable).
- [ ] Contracts/SLAs/legal commitments checked; internal teams (Support, Sales, Finance) informed.
- [ ] Knowledge captured (what we learned); the decision logged (`DEC-*`).

> Plus the **every-gate six-thread review** (gate-reviews.md): stakeholders/decisions logged · discovery debrief captured · metric evidence current · ops artifacts in the source of truth · responsible-product (data-deletion) floor met · portfolio placement updated. Record the verdict: *Persevere · Persevere-with-actions · Pivot · Hold · Kill*.

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Killing on a single low-usage number | No diagnosis of discoverability/usability | Investigate context first; low usage of a hidden feature may be a Pivot (fix it), not a kill. |
| Sunk-cost / "we've invested too much to stop" | Escalation of commitment (Staw 1976) | Set sunk cost aside explicitly; decide on *forward* value-vs-cost and exit criteria; a pre-mortem. |
| Abrupt 30-day deprecation (esp. developer-facing) | Treating sunset as a switch-flip | Deliberate multi-month runway; estimate then double; `Sunset`/`Deprecation` headers for APIs. |
| Support/quality cut the moment sunset is announced | "It's dying, why invest" | Maintain quality + support **through** the runway; trust erodes faster than features build it. |
| Customers given an exit but no destination | Forgetting the migration path | Offer a viable alternative/export/migration; triage high-touch accounts personally. |
| Shutdown treated as the finish line; data ignored | Manual-only or no deletion plan | Plan retention/export/**automated erasure** (EDPB-audited gap); include backups/test/dev; `RSK-*`. |
| Reflexively dumping portfolio "Dogs" | BCG matrix as a complete strategy | Use BCG/9-box as a screen; decide on outcome value, strategic fit, and customer cost. |
| Annual/quarterly-only review via static sheets | Portfolio decisioning treated as an event | Make lifecycle review continuous (AI-augmented value/risk/capacity scoring); revisit between cycles. |
| No retrospective after EOL | Sunset seen as cleanup, not learning | Run the 5D Debrief; feed new `OPP-*`/`INS-*` back to discovery. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (G10, `DEC-*`/`RSK-*`, status strings, frontmatter, §8 citations, the traceability spine).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the lifecycle map (§6: Maturity/Decline/Retire = 15-16) and the continuous loop (§4) that feeds sunset candidates.
- 2026 research (Portfolio & Sunset): ProductPlan EOL guide — https://www.productplan.com/learn/how-to-end-of-life-product · NextSprints strategic deprecation — https://nextsprints.com/blog/sunset-product-feature-end-of-life-best-practices-strategic-deprecation · Product School *sunsetting a product* — https://productschool.com/blog/product-fundamentals/sunsetting-product · Asana *sunk-cost fallacy* — https://asana.com/resources/sunk-cost-fallacy · Nordic APIs *deprecate APIs (Sunset headers)* — https://nordicapis.com/how-to-smartly-sunset-and-deprecate-apis/ · GDPR storage limitation / erasure — https://www.legiscope.com/blog/storage-limitation.html
- 2026 research (Stakeholders / AI-native / Responsible hooks): SVPG *how to kill innovation* — https://www.svpg.com/how-to-kill-innovation/ · Lenny Rachitsky, *how AI will impact PM* — https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management · GDPR Art. 25 (privacy by design) — https://gdpr-info.eu/art-25-gdpr/
- Curriculum: [`../../../PM_Final_WF/01-product-strategy-playbook.md`](../../../PM_Final_WF/01-product-strategy-playbook.md) — product lifecycle / portfolio context behind the retirement call.
- Related phases: `pm-phase-12-analytics` (usage/cost evidence), `pm-phase-15-growth` (exhausted growth → candidate), `pm-phase-14-feedback` (declining signal), `pm-phase-04-opportunity` / `pm-phase-01-strategy` (the original bet & strategic fit), `pm-phase-03-discovery` (where the debrief's new `OPP-*` re-enter the loop).

</supporting-info>
