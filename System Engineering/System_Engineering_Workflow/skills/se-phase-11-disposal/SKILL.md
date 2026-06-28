---
name: se-phase-11-disposal
description: Runs Phase 11 (Disposal & Retirement) of the AI-powered systems-engineering workflow — the final ISO/IEC/IEEE 15288 lifecycle stage that retires a system safely, lawfully, and without losing its knowledge. It plans the decommissioning sequence (the reverse-integration teardown), secure data sanitization per NIST SP 800-88 Rev. 1 (Clear / Purge / Destroy by media), environmental and recycling compliance (RoHS / WEEE / e-waste / hazardous-material handling), obsolescence and spares disposition, license and contract wind-down, end-of-support / end-of-life customer communications, and the knowledge archival plus lessons-learned that feed the Quality/Knowledge thread. It works for software end-of-life (deprecation, data migration, key/secret destruction, repo archival) and physical/hardware retirement (dismantling, recycling, graveyard-orbit/controlled-disposal). Produces Disposal_Plan.md and gates at the DRR (Decommissioning Readiness Review). Use this phase when the user wants to retire, decommission, sunset, end-of-life, or dispose of a system, plan a teardown, wipe or destroy data/media securely, recycle hardware, migrate users off a deprecated service, wind down licenses/contracts, archive a project for posterity, capture lessons learned, or run "phase 11 disposal". Triggers on phrasings like "disposal plan", "decommissioning plan", "retire / sunset / end-of-life this system", "data sanitization / secure wipe / NIST 800-88", "e-waste / RoHS / WEEE recycling", "obsolescence and spares disposition", "license and contract wind-down", "end-of-support communication", "knowledge archival / lessons learned", "decommissioning readiness review / DRR".
---

# Phase 11 — Disposal & Retirement

<what-to-do>

This phase retires the system safely, lawfully, and reversibly-enough — sequencing the decommissioning, sanitizing data per **NIST SP 800-88 Rev. 1**, meeting environmental obligations (RoHS/WEEE/e-waste), disposing of obsolescent assets and spares, winding down licenses and contracts, communicating end-of-support, and archiving knowledge plus lessons-learned so nothing valuable is lost. Its exit gate is the **DRR (Decommissioning Readiness Review)** — retirement plan, data-sanitization plan, environmental/regulatory clearance, and the knowledge-archival package are all approved before any irreversible teardown begins. This skill conforms to [`../../05_Conventions.md`](../../05_Conventions.md); it cites that file for every shared convention (IDs, gates, T/I/A/D, severity, baselines, status strings, standard citations) rather than redefining them.

## Inputs (from prior phases)

Read these first. If one is absent, note `TODO: <owed by phase NN>` and proceed with a placeholder — never invent the missing content.

- **Phase 00 `SEMP.md` / `Agreement_Register.md`** — disposal-authority, end-of-life clauses, data-ownership and data-return obligations, contractual termination/handback terms. *Fallback:* ask who holds retirement authority and what the contract says about data return and termination.
- **Phase 01 `OpsCon.md` / `Stakeholder_Mission.md`** — original stakeholders to notify at end-of-support, and any retirement scenario or end-state already envisioned. *Fallback:* re-derive the notify-list from the stakeholder register.
- **Phase 02 `SysRS.md`** — retention requirements (`REQ-O-*`), security/audit-log requirements (`REQ-SEC-*`), domain/regulatory constraints (`REQ-D-*`, `REQ-C-*`) that survive into disposal (e.g. mandated record-retention windows). *Fallback:* ask the regulatory record-retention obligations directly.
- **Phase 04 `Architecture_Description.md` / `ICD.md`** — the system decomposition and external interfaces; the teardown is the **reverse** of Phase-06 integration, so the blocks, `ICD-*` seams, and data stores tell you what must be unplugged and in what order. *Fallback:* sketch the top-level decomposition with the user.
- **Phase 06 `Integration_Plan.md`** — the integration increments (`INC-*`) and dependency order; reverse them to derive the decommissioning sequence. *Fallback:* derive teardown order from the architecture's dependency graph.
- **Phase 09 `Configuration_Management_Plan.md` / CI register** — the configuration items (`CI-*`), baselines, and repositories that must be archived or destroyed, and the final retirement is itself a controlled change (a `CR-*`). *Fallback:* enumerate CIs from the architecture and build recipe.
- **Phase 10 `Operations_Continuous_Validation.md`** — live SLOs, runbooks (`RB-*`), the user base, data volumes, dependent systems, and the operational record that informs the cutover and lessons-learned. *Fallback:* ask the current operational footprint (users, data stores, integrations, on-call).
- **Cross-cutting registers** — `Risk_Opportunity_Register.md` (disposal risks), `Hazard_Log.md` (decommissioning hazards — stored energy, hazardous materials), `Threat_Model.md` (data-at-rest exposure during teardown), `QA_Plan.md` (lessons-learned destination). *Fallback:* create stubs as you go.

## Step-by-step

Interview the user **one topic at a time** — never dump every question at once. Convert each answer into `Disposal_Plan.md`, reuse prior-phase facts, and never re-ask what a prior artifact already states. Use **AskUserQuestion** for finite choices. Mark unknowns `TODO: <owed by whom, by when>`; never invent dates, volumes, costs, or sanitization outcomes.

1. **Read prior artifacts & set the retirement trigger and end-state.** Pull authority/contract terms (Phase 00), the architecture and integration order (Phases 04/06), CIs and baselines (Phase 09), and the live footprint (Phase 10). Default output: `<project>/Phase_11_Disposal/Disposal_Plan.md`. Confirm **why now** (obsolescence, EOL of a key dependency, business decision, replacement system, regulatory mandate) and the **target end-state** (fully gone · replaced by successor · partially retired / mothballed · sold/transferred). State assumptions you carry forward. The whole retirement is a controlled change — open it as a `CR-*` against the product baseline (Phase 09).

2. **System-type & disposal-mode triage.** *Topic: "What kind of retirement is this?"* Use **AskUserQuestion** to classify, because it routes every later step:
   - **Software / service EOL** — deprecation timeline, user/data migration, traffic drain, key/secret/credential destruction, cloud-resource teardown, repository archival, domain/cert release.
   - **Physical / hardware retirement** — dismantling, stored-energy and hazardous-material safing, recycling/scrapping, asset disposal, site restoration.
   - **Hybrid** — both, sequenced (software drained first, then hardware safed and recycled).
   - **Special-domain** — e.g. spacecraft (graveyard orbit vs. controlled re-entry — KB topic 02), nuclear (radiation containment), medical (device recall/return). Flag if a domain authority governs disposal.

3. **Decommissioning sequence (reverse-integration teardown).** *Topic: "In what order do we take it apart?"* Build the ordered teardown by **reversing the Phase-06 integration order** — last integrated, first removed — so dependents are detached before the things they depend on. Each step gets: trigger/precondition, action, owner, rollback point (the last step at which you can still abort), and a verification check (the system stays safe/observable mid-teardown). Identify **points of no return** explicitly (first irreversible destruction). For software, include traffic-drain and read-only-mode stages before deletion; for hardware, include de-energize / lockout-tagout / drain stages before disassembly.

4. **Data handling & secure sanitization (NIST SP 800-88 Rev. 1).** *Topic: "What happens to the data, per medium?"* For each data store / medium, decide the **disposal action** under SP 800-88:
   - **Clear** — logical sanitization (overwrite, factory reset) defeating simple, non-invasive recovery — reuse within the org.
   - **Purge** — cryptographic erase, block erase, or degauss defeating laboratory recovery — reuse outside the org / lower exposure.
   - **Destroy** — shred, disintegrate, incinerate, melt — highest assurance, no reuse.
   Choose the action from the **data's confidentiality / categorization**, not the medium alone, and **verify + document each** (the 800-88 sanitization-validation and the Certificate of Sanitization). Separately decide what must be **retained** (regulatory/legal-hold records → migrate to the archive before wipe) and what must be **returned** to the customer (per the Phase-00 contract). For cryptographic erase, plan **key destruction** as the controlling act. Record retention windows from `REQ-O-*`/`REQ-D-*`; never destroy data still under a retention or legal-hold obligation.

5. **Environmental, recycling & hazardous-material disposition.** *Topic: "How do we dispose of the physical assets lawfully?"* (Skip the hardware-only parts for pure software, but keep cloud-carbon/resource-release in scope.) Capture: **RoHS** restricted-substance handling, **WEEE / e-waste** take-back and certified-recycler routing, batteries and hazardous materials (refrigerants, capacitors, radioactive sources), the **environmental-impact assessment**, and the **certified-recycler / disposal-vendor** with a **chain-of-custody / disposal certificate** for each asset class. For controlled domains, name the governing regime (e.g. space-debris mitigation, nuclear decommissioning, biohazard). Plan **site/asset restoration** to required condition.

6. **Obsolescence & spares disposition.** *Topic: "What do we do with the inventory, spares, and tooling?"* Decide for each: **redeploy** (move to another live system), **sell / transfer**, **donate**, **recycle**, or **destroy**. Capture remaining-warranty and DMSMS (Diminishing Manufacturing Sources & Material Shortages) context — obsolete parts that other systems still need may be worth harvesting/banking. Record the disposition owner and target date per asset class.

7. **License, contract & service wind-down.** *Topic: "What agreements must we close out?"* List software licenses (terminate / transfer / let lapse), SaaS and cloud subscriptions (cancel after data export — never before), support and maintenance contracts, third-party API/data agreements, domain names and TLS certificates (release/revoke), and any escrow. Sequence cancellations **after** the corresponding data export and after end-of-support so nothing the teardown still needs is cut early. Capture termination notice periods (from Phase-00 agreements) so notices go out on time.

8. **End-of-support / end-of-life communications.** *Topic: "Who must we tell, and when?"* Build the comms plan from the Phase-01 stakeholder/Phase-10 user base: the **EOL announcement** (sunset date, supported-until date, what stops working), the **migration path** to the successor (if any), data-export/portability instructions and deadline, support-channel close dates, and regulator/partner notifications with their **contractual notice periods**. Define the comms timeline working **backwards** from the sunset date. Mark each audience's required lead time as `TODO` if unknown — do not guess legal notice windows.

8a. **Successor handover (if replaced).** *Topic: "What does the replacement system inherit?"* If a successor exists, capture the data migration, user/account migration, the cutover/parallel-run window, and what the successor must inherit (configs, integrations, the archived knowledge package). This is the Phase-10 ↔ Phase-11 hinge: the successor's go-live often gates the predecessor's teardown.

9. **Knowledge archival & lessons-learned (feeds the Quality/Knowledge thread).** *Topic: "What knowledge do we preserve, and what did we learn?"* Define the **archive package**: the baselined artifacts to keep (SysRS, architecture, ICDs, decision register/`DEC-*`, V&V evidence, CM status-accounting, ops record), where it lives, its **retention period**, its access/integrity controls (so the archive itself is sanitization-exempt and tamper-evident), and the format (open/long-lived). Then run a **lessons-learned retrospective** across the whole lifecycle — what worked, what failed, what surprised us, what the next system should do differently — and route it to the **Quality/Knowledge thread** so the organisation actually reuses it. This is the disposal step most often skipped; make it a DRR exit criterion.

10. **Disposal risk, safety & security review.** *Topic: "What can go wrong during retirement?"* Score disposal-specific risks `RSK-*` (Likelihood×Impact per [`Conventions §5.3`](../../05_Conventions.md)): premature deletion of still-needed data, data leaking through improperly-sanitized media, a dependent system breaking when its dependency is removed, an environmental/regulatory violation, irrecoverable knowledge loss. Add decommissioning **hazards** to the `Hazard_Log.md` (stored energy, hazardous materials, lone-working teardown) and a **data-at-rest exposure** review to the `Threat_Model.md` (media in transit to the recycler is a live attack surface until Destroyed).

11. **DRR readiness assembly.** Assemble the gate package: decommissioning sequence with points-of-no-return, sanitization plan with per-medium actions + verification, environmental/recycler certificates planned, retention/legal-hold satisfied, license/contract wind-down sequenced, comms sent or scheduled, archive package staged, lessons-learned captured. Anything unfinished is a named `TODO` with an owner.

12. **Write the deliverable** (`Disposal_Plan.md`) using the shape in *Deliverables*. Apply the [`Conventions §6`](../../05_Conventions.md) frontmatter (`Status: Draft → In Review → Baseline (DRR-approved YYYY-MM-DD)`).

13. **Check the exit gate** (see *Exit-gate checklist*). If anything is `TODO`, name who owes it and by when — and **block the irreversible teardown steps** until their preconditions clear. This is the terminal phase; on DRR approval the system lifecycle closes. The lessons-learned package is the one output that flows **forward** — to the Quality/Knowledge thread and the next project's Phase 01.

## Decision points

- **Clear vs Purge vs Destroy (per medium)?** Drive it from the **data's confidentiality category**, not the medium. *Aid:* reuse inside the org → Clear; leaves the org or moderate sensitivity → Purge; high sensitivity / cannot guarantee custody → Destroy. When unsure, escalate one level. For encrypted media with well-managed keys, **cryptographic erase (key destruction)** is the efficient Purge.
- **Retain, return, or destroy the data?** *Aid:* under a retention/legal-hold window or regulatory record-keeping rule → retain (migrate to archive first). Owned by the customer per contract → return (export, confirm receipt) before wipe. Otherwise → sanitize per the categorization. **Never destroy first and check later.**
- **What's the point of no return?** *Aid:* the first step that destroys data or physically disassembles something un-rebuildable. Everything before it must be reversible (read-only mode, traffic drain, mothball) so a failed cutover can roll back.
- **Recycle, sell, redeploy, or destroy an asset?** *Aid:* still useful elsewhere and not data-bearing → redeploy/sell/donate; data-bearing → sanitize *then* dispose; hazardous/end-of-life → certified recycler/destroy. Chain-of-custody required for anything that ever held sensitive data.
- **When do we cancel each contract/license?** *Aid:* **after** the data it governs is exported and **after** end-of-support — sequence cancellations last. Respect contractual notice periods (from Phase 00).
- **Graveyard vs controlled disposal (special domains)?** *Aid:* for space/regulated systems the disposal *method* is set by the governing regime and mission class — cite it, don't choose freely (KB topic 02).
- **Is lessons-learned really done?** *Aid:* it's done when the retrospective is written, routed to the Quality/Knowledge thread, and actionable items have owners — not when a template is filled.

## Rules

- **Conform to Conventions for everything shared.** IDs (`RSK-*`, `CI-*`, `CR-*`, `RB-*`, `REQ-*`), gates, severity, baselines, status strings, and standard citations come from [`../../05_Conventions.md`](../../05_Conventions.md) — cite, never redefine.
- **One topic at a time.** Ask this phase's questions conversationally; convert answers into the plan; reuse prior-phase facts; never re-ask.
- **Retire reversibly until the point of no return; then irreversibly with sign-off.** Every irreversible step (deletion, destruction, disassembly) is gated by DRR approval and a verified precondition.
- **Sanitize by data categorization, not by medium**, and **verify + certify every sanitization** (NIST SP 800-88 — Certificate of Sanitization). No "we formatted it" without validation.
- **Retention/legal-hold beats deletion.** Never sanitize data still under a retention obligation; migrate it to the archive first.
- **Cancel contracts/subscriptions last** — after export, after end-of-support. Never cut a service the teardown still needs.
- **Capture knowledge before you destroy it.** Lessons-learned and the archive package are DRR exit criteria, not optional nice-to-haves — this is the gap Phase 11 exists to close ("concept-to-disposal").
- **Don't copy the worked example's numbers blindly.** Calibrate retention windows, volumes, vendors, and timelines to the actual project.
- **Cross-reference, don't re-define.** Teardown order → reverse Phase 06; CIs/baselines → Phase 09; risk scoring → Risk thread; gates/status strings → Conventions.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank version lives in [`../../templates/`](../../templates/). The deliverable carries the [`Conventions §6`](../../05_Conventions.md) frontmatter (`Document ID: DISP-<PROJECT_SLUG>-vX.Y`, `Standard: ISO/IEC/IEEE 15288:2023 (Disposal) + NIST SP 800-88 Rev. 1`).

### `Disposal_Plan.md`

```markdown
1.  Purpose, Scope & Retirement Trigger — why now, target end-state, disposal mode (SW EOL / HW / hybrid / special-domain), retirement CR-NN
2.  Authority & Stakeholders — disposal authority (from SEMP), contract EOL/handback terms, notify-list
3.  Decommissioning Sequence — ordered teardown (reverse of Phase-06 INC-*): step · precondition · action · owner · rollback point · verification; POINTS OF NO RETURN flagged
4.  Data Handling & Sanitization (NIST SP 800-88) — per-store table: media · data categorization · action (Clear/Purge/Destroy) · method · verification · Certificate ref; retention & legal-hold list; customer-return list; key-destruction plan
5.  Environmental & Recycling — RoHS/WEEE/e-waste routing, hazardous-material handling, env-impact assessment, certified recycler + chain-of-custody/disposal certificate per asset class, site restoration
6.  Obsolescence & Spares Disposition — per asset class: redeploy/sell/donate/recycle/destroy · owner · date; DMSMS notes
7.  License, Contract & Service Wind-Down — license/SaaS/cloud/support/domain/cert close-out, sequenced AFTER export, with notice periods
8.  End-of-Support / EOL Communications — audience · message · channel · send-date (backwards from sunset); migration path; data-export deadline
8a. Successor Handover (if any) — data/user migration, cutover/parallel-run, what the successor inherits
9.  Knowledge Archival & Lessons-Learned — archive package contents · location · retention · access/integrity controls; lessons-learned retrospective → Quality/Knowledge thread
10. Disposal Risk / Safety / Security — RSK-* (L×I), new Hazard_Log entries, data-at-rest exposure review
11. DRR Readiness — gate package summary + outstanding TODOs with owners/dates
```

**Sanitization table row (§4):**

```markdown
| Store/Media | Data categorization | Action (Clear/Purge/Destroy) | Method | Verification | Cert ref | Retention/Hold? |
```

**Decommissioning step row (§3):**

```markdown
| Seq | Precondition | Action | Owner | Reverses INC-NN | Rollback point? | Verify | Point of no return? |
```

## AI prompt pack

**Elicitation (scope & mode):**
> "Interview me one topic at a time to scope this system's retirement. Start with the trigger (why retire now) and the target end-state (gone / replaced / mothballed / transferred), then classify the disposal mode (software EOL / hardware / hybrid / special-domain). Reuse what the OpsCon, Architecture, CM plan, and Operations doc already say — don't re-ask. Flag anything you can't ground as `TODO: <owed by>`."

**Generation (decommissioning sequence):**
> "From the Phase-06 `Integration_Plan.md` increments (`INC-*`) and the Phase-04 architecture, draft the decommissioning sequence as the REVERSE-integration teardown: last-integrated removed first. For each step give precondition, action, owner, which `INC-*` it reverses, the rollback point, the mid-teardown verification, and flag the first POINT OF NO RETURN. Add traffic-drain/read-only stages (software) or de-energize/lockout-tagout stages (hardware) before any destruction."

**Generation (sanitization plan):**
> "Draft the §4 sanitization table per data store under NIST SP 800-88 Rev. 1. For each store choose Clear / Purge / Destroy from the data's confidentiality categorization (not the medium), name the method (overwrite / crypto-erase / degauss / shred), the verification step, and the Certificate-of-Sanitization reference. Separately list data under retention/legal-hold (migrate to archive, do NOT destroy) and customer-owned data to return. Invent no retention windows — mark unknowns `TODO`."

**Critique / red-team:**
> "Red-team this disposal plan. Where could we (a) destroy data still under a retention or legal-hold obligation, (b) leave recoverable data on media sent to a recycler, (c) cancel a contract/subscription before its data is exported, (d) break a dependent system by removing its dependency too early, (e) lose institutional knowledge because lessons-learned wasn't captured, or (f) cross a point-of-no-return before DRR sign-off? List each as a finding with a severity (S1–S4) and a fix."

**Critique (regulatory completeness):**
> "Given the domain (<domain>), list every disposal-relevant regulation and standard we must satisfy — data sanitization, e-waste/RoHS/WEEE, record-retention, sector-specific decommissioning (space-debris / nuclear / medical-device return) — and map each to a step in this plan. Flag any obligation the plan doesn't yet cover."

## Research & specialised-agent triggers

- **Web research — sanitization & security standards:** confirm current NIST SP 800-88 Rev. 1 method/media guidance and whether a sector mandates more (e.g. DoD 5220.22-M legacy expectations, IEEE 2883-2022 sanitization, FIPS crypto-erase requirements) before fixing the Clear/Purge/Destroy choices. Use **Context7 MCP** for any cloud-provider data-deletion / key-destruction API or CLI specifics (e.g. how a given cloud guarantees crypto-shredding of a managed-key store, resource-teardown order).
- **Web research — environmental & e-waste regulation:** look up the governing **RoHS/WEEE** (EU) or local e-waste regime, battery/hazardous-material rules, and certified-recycler accreditation (R2 / e-Stewards) for the deployment region. For special domains, look up space-debris mitigation guidelines (graveyard orbit vs controlled re-entry), nuclear decommissioning, or medical-device recall/return rules.
- **Web research — record-retention law:** for the retention/legal-hold list, look up the statutory record-retention windows the domain imposes (financial, health, safety-critical evidence) so nothing is destroyed early.
- **Specialised agent — data-discovery / sanitization-inventory agent:** spawn one to crawl the CM register and architecture, enumerate every data-bearing store/medium (including caches, backups, logs, secrets stores), and produce the §4 sanitization table draft — backups and forgotten secret stores are the classic miss.
- **Specialised agent — dependency-blast-radius agent:** spawn one to walk the traceability matrix and ICDs and list every external system that depends on this one, so the teardown order detaches dependents before dependencies and the EOL comms reach every consumer.

## Cross-cutting hooks

This phase consumes most threads and **feeds the Quality/Knowledge thread** with the lessons-learned that close the lifecycle ([`../../01_Workflow_Overview.md §1`](../../01_Workflow_Overview.md)).

- **Quality (incl. Knowledge mgmt)** *(feeds)* — the lessons-learned retrospective and the archived baseline package are routed here so the next project reuses them; disposal certificates and sanitization records are auditable quality evidence (ISO 9001). → [`../../cross-cutting/Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md).
- **Security** *(consumes)* — data-at-rest exposure during teardown is a live attack surface; key/secret/credential destruction and the sanitization plan are security-owned; media in transit to a recycler is in the `Threat_Model.md`. → [`../../cross-cutting/Security_Engineering.md`](../../cross-cutting/Security_Engineering.md).
- **Safety/RAMS** *(consumes)* — decommissioning hazards (stored energy, hazardous materials, lone-working teardown) go in the `Hazard_Log.md`; safe-state sequencing (de-energize, lockout-tagout) is RAMS-driven. → [`../../cross-cutting/Safety_RAMS_Engineering.md`](../../cross-cutting/Safety_RAMS_Engineering.md).
- **Risk & Opportunity** *(consumes/feeds)* — disposal risks (premature deletion, data leak, dependent breakage, regulatory violation) score `RSK-*`; salvage/redeploy value is an `OPP-*`. → [`../../cross-cutting/Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md).
- **Configuration Mgmt** *(consumes)* — the retirement is a `CR-*`; CIs are archived or destroyed; final status accounting records the system as retired/superseded. → [`../../cross-cutting/Configuration_Management.md`](../../cross-cutting/Configuration_Management.md).
- **Cost/Schedule** *(feeds)* — decommissioning cost, recycler fees, and salvage recovery feed life-cycle cost (LCC/TCO) closure and the EVM final actuals. → [`../../cross-cutting/Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md).
- **HSI** *(consumes)* — staff redeployment/reskilling, end-user migration support, and decommissioning-crew procedures and training. → [`../../cross-cutting/Human_Systems_Integration.md`](../../cross-cutting/Human_Systems_Integration.md).
- **Measurement (MOE/MOP/TPM)** *(feeds)* — final TPM actuals and whether MOEs were met over life close out the `TPM_Tracker.md` and seed the lessons-learned. → [`../../cross-cutting/Measurement_MOE_MOP_TPM.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md).

## Standards anchor

This phase realises the ISO/IEC/IEEE 15288:2023 **Disposal** process (Technical-process group; see [`../../01_Workflow_Overview.md §3`](../../01_Workflow_Overview.md)), the terminal stage of the SE lifecycle (KB topic 02). It invokes the canonical citations from [`Conventions §9`](../../05_Conventions.md):

| Concern | Canonical citation |
|---|---|
| SE lifecycle (Disposal process) | **ISO/IEC/IEEE 15288:2023** |
| Secure media sanitization | **NIST SP 800-88 Rev. 1** (Clear / Purge / Destroy; Certificate of Sanitization) |
| Decommissioning reviews & practice | **NASA/SP-2016-6105 Rev 2** (Decommissioning Review / DR), **INCOSE SE Handbook v5 (2023)** (Disposal process) |
| Security controls (media protection, sanitization) | **NIST SP 800-53 Rev. 5** (MP family), **ISO/IEC 27001:2022** |
| Quality / records | **ISO 9001:2015** |
| Environmental / e-waste (domain) | RoHS, WEEE / regional e-waste regime, certified-recycler accreditation (R2 / e-Stewards) |
| Special-domain disposal | space-debris mitigation (graveyard orbit / controlled re-entry), nuclear decommissioning, medical-device recall/return (as applicable) |

## Exit-gate checklist

Gate: **DRR (Decommissioning Readiness Review)** — *"Passes when: retirement plan, data sanitization, environmental & archival approved."* ([`Conventions §3`](../../05_Conventions.md)).

- [ ] Retirement trigger, target end-state, and disposal mode documented; retirement opened as a `CR-*` against the product baseline.
- [ ] Decommissioning sequence is the **reverse** of Phase-06 integration; each step has owner, rollback point, verification; **points of no return** flagged.
- [ ] §4 sanitization table complete — every data store/medium has a Clear/Purge/Destroy action chosen by **data categorization**, a method, a verification step, and a Certificate-of-Sanitization reference.
- [ ] Retention / legal-hold data identified and **migrated to the archive before any wipe**; customer-owned data return path defined.
- [ ] Key/secret/credential destruction planned (incl. backups, caches, logs, secrets stores).
- [ ] Environmental plan complete — RoHS/WEEE/e-waste routing, hazardous materials, certified recycler + chain-of-custody/disposal certificate per asset class; site restoration defined. (Cloud-resource teardown + carbon for pure software.)
- [ ] Obsolescence & spares disposition decided per asset class with owner + date.
- [ ] License/contract/service wind-down sequenced **after** export and end-of-support, with notice periods honoured.
- [ ] EOL communications scheduled backwards from the sunset date; migration path and data-export deadline published.
- [ ] Successor handover (if any) defined; predecessor teardown gated on successor go-live.
- [ ] **Knowledge archive package staged** (contents, location, retention, integrity controls) **and lessons-learned retrospective written and routed to the Quality/Knowledge thread.**
- [ ] Disposal `RSK-*` scored; decommissioning hazards in `Hazard_Log.md`; data-at-rest exposure in `Threat_Model.md`.
- [ ] `Disposal_Plan.md` carries Conventions frontmatter; all open items are named `TODO`s with owners/dates; no irreversible step proceeds before its precondition clears.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Data recoverable from a "wiped" disk sent to recycling. | Quick-format mistaken for sanitization; no verification. | Apply NIST 800-88 Clear/Purge/Destroy by categorization; **verify + certify** each (Certificate of Sanitization). |
| Records needed for an audit/lawsuit were deleted. | Retention/legal-hold not checked before wipe. | Identify retention/hold data first; migrate to archive **before** any destruction; never destroy-then-check. |
| A still-live system broke when its dependency was removed. | Teardown not ordered by dependency; dependents not detached first. | Reverse the Phase-06 integration order; run the blast-radius agent; detach dependents before dependencies. |
| Cloud bill kept running / data lost on cancel. | Subscription cancelled before data export, or never cancelled. | Export first, cancel last; sequence contract/service wind-down after export and end-of-support. |
| Users blindsided by the shutdown. | EOL comms late or missing notice periods. | Build the comms timeline backwards from the sunset date; honour contractual notice windows. |
| Everything the team learned is lost the day the system dies. | Lessons-learned and archival treated as optional. | Make the archive package + lessons-learned a hard DRR exit criterion; route to the Quality/Knowledge thread. |
| Teardown injured someone / released a hazardous substance. | Decommissioning hazards not analysed. | Add de-energize/lockout-tagout and hazardous-material steps; log hazards in `Hazard_Log.md`. |
| Crossed a point-of-no-return, then the cutover failed. | No reversible staging before irreversible steps. | Stage read-only/traffic-drain/mothball before destruction; gate every irreversible step on DRR approval. |
| Plan ignored the governing disposal regime (space/nuclear/medical). | Disposal method chosen freely instead of per regulation. | Identify the domain authority; cite its mandated method (e.g. graveyard orbit vs controlled re-entry). |

## References

- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`RSK-*`, `CI-*`, `CR-*`, `RB-*`), the **DRR** gate, severity, baselines/status strings, and the **NIST SP 800-88 / 15288 / NASA / ISO 9001** citations. **The contract.**
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the 12-stage spine; 15288 Disposal mapping; the operations-loop→DRR gate flow; the 8 threads.
- KB: [`Systems-Engineering-KB/topics/02-se-process-stages/fundamentals.md`](../../../Systems-Engineering-KB/topics/02-se-process-stages/fundamentals.md) — the Disposal stage (decommission, environmental impact, recycling) and the graveyard-orbit vs controlled-re-entry example.
- KB: [`Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md`](../../../Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md) — retirement as a controlled change (CR → impact analysis → CCB) and the configuration-management framing the teardown runs under.
- [`../../worked_example/Phase_11_Disposal/`](../../worked_example/Phase_11_Disposal/) — fully worked Disposal Plan (EV Charging Station Network) — *calibrate, don't copy its numbers.*
- Related phases: `se-phase-00-agreement` (EOL/handback terms), `se-phase-04-architecture` (decomposition + ICDs), `se-phase-06-integration` (the integration order to reverse), `se-phase-09-change-config` (the retirement CR, CIs, baselines, final status accounting), `se-phase-10-operations` (live footprint, runbooks, the ops record that feeds lessons-learned).

</supporting-info>
