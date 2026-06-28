---
name: se-phase-01-concept
description: Runs Phase 01 (Concept) of the domain-agnostic SE workflow — the problem-space phase that decides what is being built, for whom, why, and whether it is feasible BEFORE any solution is specified. Interviews the user one topic at a time and produces Stakeholder_Mission.md, StRS.md (stakeholder needs SN-* and operational scenarios SCN-*), OpsCon.md (concept of operations), Feasibility_Study.md (technical/market/regulatory/economic), and Project_Development_Plan.md (lifecycle model, schedule, team, top risks), then checks the MCR / SRR-entry gate. Conforms to ../../../se-workflow/05_Conventions.md. Use when the user wants to start a new systems-engineering project, capture stakeholder needs, write a ConOps/OpsCon, run a feasibility study, build a stakeholder map / mission / influence-interest matrix, pick a lifecycle model (Waterfall / V-Model / Spiral / Agile / Hybrid), or prepare for a Mission Concept Review. Triggers on "start a new SE project", "phase 1 concept", "stakeholder needs / StRS", "write a ConOps / OpsCon", "run a feasibility study", "stakeholder map / mission statement", "pick a lifecycle model", "prep for MCR".
disable-model-invocation: true
user-invocable: true
---

# Phase 01 — Concept

<what-to-do>

This phase decides **what** is being built, **for whom**, **why**, and **whether it is feasible** — the PROBLEM space — and ends with stakeholder agreement, not a solution. Its exit gate is **MCR (Mission Concept Review) / SRR-entry**: mission, OpsCon, feasibility accepted and a lifecycle model chosen, per [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) §3. This skill conforms to that contract for all IDs, gates, severity, baselines, and citations — it cites them, it does not redefine them.

## Inputs (from prior phases)
- `../../<slug>/Phase_00_Agreement/Agreement_Register.md`, `SEMP.md`, `Project_Enablement_Plan.md` — for the agreed scope boundary, named acquirer/supplier, acceptance terms, and any funding/schedule constraints. **Fallback:** if Phase 00 was not run, ask for the project name, sponsor, and any contractual constraints inline and mark the formal agreement as `TODO: Agreement_Register owed from Phase 00`.
- Any existing business case, RFP/SOW, market study, or regulatory memo the user already has — read once, reuse facts, never re-ask what they already stated.

## Step-by-step

Interview the user **one topic at a time** — never dump every topic's questions in one message. Use `AskUserQuestion` for finite choices. Reuse Phase 00 facts and earlier answers; mark anything unknown as `TODO: <what's owed>` and never invent numbers.

1. **Project identity** (group these — they are one topic): long-form name + kebab-case `<slug>` (used for the output folder), domain (e.g., automotive, medical, fintech, IoT, defense), and the target initial-release horizon (today is `[today's date]`). Confirm `<output-dir>` (default `./systems-engineering/<slug>/`) and create `<output-dir>/Phase_01_Concept/`.
2. **Mission candidate.** Ask for a one-line "what good does this system do, and for whom?" Refine into a 1–3 sentence mission; show it back for confirm/edit. This realises 15288 **Business/Mission Analysis** and 29148 **BRS** (Business/Mission Requirements) content.
3. **Stakeholders.** Use `AskUserQuestion` to offer a preset list for the domain (see *Stakeholder preset library*) or start from scratch. For each stakeholder collect, in free text: role, primary concerns, **influence** (Low/Med/High), **interest** (Low/Med/High). Assign `STK-01`, `STK-02`, … Loop until the user says "done"; aim for 5–10. Build the influence/interest 2×2 from the captured levels — do not re-ask the levels for the matrix.
4. **Stakeholder needs → StRS (PROBLEM space).** This is the heart of the phase. Topic by topic per stakeholder (or per concern cluster), turn raw wants into **needs**, not solutions: a need says *what outcome is required*, never *how to build it*. Assign `SN-01`, `SN-02`, … Each `SN` carries: statement (outcome), originating `STK-*`, priority (High/Med/Low/N-A per Conventions §5.2), and a candidate **MOE** note (the effectiveness it would be measured by — the MOE itself is numbered in Phase 02). Keep these solution-free; if the user states a solution ("use AES-256"), record it as a candidate constraint and re-derive the underlying need ("data at rest must be protected to <regulation> level").
5. **Operational scenarios → OpsCon.** Ask the user to walk through how the system is **used** in its environment: nominal mission threads, degraded/off-nominal modes, maintenance, and the operational environment (who, where, when, under what conditions). Capture each as `SCN-01`, `SCN-02`, … with actors, trigger, main flow, and success outcome. These scenarios are the source every later design decision is checked against. Trace each `SCN-*` to the `SN-*` it exercises.
6. **Feasibility study — the gate of this phase.** Ask one dimension at a time and record a verdict (Go / Conditional-Go / No-Go) plus evidence or a `TODO` for each:
   - **Technical** — can it be built with available/maturing technology? (Note any low-TRL items as risks.)
   - **Market / operational** — is there real demand/need, and will it be adopted?
   - **Regulatory / legal** — what standards, certifications, and laws apply (capture as candidate `C`/`D` constraints for Phase 02)?
   - **Economic** — rough order-of-magnitude cost vs. benefit; is it worth building? (Full estimation is Phase 05 — here it is ROM only.)
   Roll the four into one overall recommendation. A No-Go on any non-waivable dimension **blocks MCR**.
7. **Lifecycle model.** Use `AskUserQuestion` (single-select, `Hybrid` recommended for most mixed systems). Offer **all four base models plus Hybrid** (see *Lifecycle model decision aid*): Waterfall, V-Model, **Spiral**, Agile, Hybrid (V + Agile). Capture *which track of the system uses which model* in a `Track | Model | Rationale` table. **SAFe is a scaling framework recorded only as a note inside Hybrid for large orgs — never list it as a peer base model** (Conventions / Overview §7).
8. **Top risks (seed the living register).** Collect 4–6 concept-stage risks. For each: `RSK-01`, … description, likelihood (1–5), impact (1–5), band (per Conventions §5.3), mitigation. Flag that this register is **handed to and reviewed at every gate** by the Risk thread — it is not a one-shot. Capture any upside as `OPP-*`.
9. **Schedule.** Ask for the milestone breakdown over the user's horizon. **Anchor only to gates this phase can see** — MCR (end of Concept) and the next stage's **SRR**; mention PDR/CDR as forward markers only. **Do not key the schedule to TRR/PRR** (those belong to Phases 07/08 and must not be invented here).
10. **Team structure.** Ask headcount per discipline relevant to the domain (e.g., Hardware, Firmware, Software/Cloud, Mobile/Web, Systems & V&V, Safety/Security, Compliance, PM). Produce a totaled table. Use `TODO:` for roles not yet staffed.
11. **Governance.** Confirm the gate this phase owns (MCR) and the next gate (SRR), CCB/review cadence, and any safety/security/privacy review triggers. Defer full CM/CCB mechanics to Phase 09 — reference it, don't redefine it.
12. **Write the five deliverables** into `<output-dir>/Phase_01_Concept/` with Conventions §6 frontmatter (`Status: Draft`): `Stakeholder_Mission.md`, `StRS.md`, `OpsCon.md`, `Feasibility_Study.md`, `Project_Development_Plan.md`. Blank versions live in [`../../../se-workflow/templates/`](../../../se-workflow/templates/).
13. **Exit-gate check.** Print the *Exit-gate checklist* and ask the user to confirm each item; if all pass, the artifacts may move to `In Review` toward MCR sign-off.
14. **Done.** Print all five output paths and recommend the next phase: invoke `se-phase-02-requirements` to **derive** the solution-space `SysRS` (REQ-*) from the signed-off `SN-*`/`SCN-*`, carrying forward MOE candidates into MOE/MOP.

## Decision points

- **Need vs. solution (every SN).** *How to decide:* if the statement names a technology, mechanism, or design, it is a solution — rewrite it as the outcome it serves and move the technology to a candidate constraint. Problem-space first; the solution is Phase 02's job.
- **Feasibility verdict per dimension.** *How to decide:* Go = evidence exists; Conditional-Go = feasible if a named risk is retired (log the `RSK-*`); No-Go = a hard blocker. Any non-waivable No-Go stops the phase at MCR.
- **Which lifecycle model.** *How to decide:* stable requirements + costly late change → Waterfall; test rigour at every level / safety-critical → V-Model; high uncertainty/risk to retire early → **Spiral**; rapidly evolving scope + frequent feedback → Agile; mixed hardware/software → Hybrid (V on safety-critical tracks, Agile elsewhere). Different tracks may pick different models.
- **OpsCon scenario coverage.** *How to decide:* you have enough `SCN-*` when every high-priority `SN-*` is exercised by at least one nominal scenario and the top off-nominal/maintenance threads are covered.

## Rules

- Conform to [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) for **all** IDs (`STK-`, `SN-`, `SCN-`, `RSK-`/`OPP-`), gates (MCR/SRR), severity/priority, baselines, document frontmatter, and standard citations. When in doubt, cite Conventions — never restate or fork it here.
- **One topic at a time.** Group only tightly-related fields (e.g., name + slug + domain). Never present a wall of questions.
- **Problem space only.** Produce needs and scenarios, not requirements or architecture. The `SN→derive→REQ` step happens in Phase 02 — cross-reference it, don't pre-empt it.
- **Reuse, never re-ask.** Pull stakeholders, slug, domain, and constraints from Phase 00 and earlier answers.
- **Mark unknowns as `TODO: <owed>`; never invent numbers** (cost, dates, headcount, TRL).
- **Don't copy the worked example's content blindly** — match its *shape*, adapt every value to the user's project.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank fill-in versions of all five live in [`../../../se-workflow/templates/`](../../../se-workflow/templates/). Each carries Conventions §6 frontmatter (`Document`, `Document ID`, `Standard`, `Status`, `Owner`).

### `Stakeholder_Mission.md`
1. **Mission** — 1–3 sentence callout (`>`).
2. **Stakeholders** — `STK-ID | Stakeholder | Role | Primary Concerns | Influence | Interest` (6 columns — fixed; do not drift to 4 or 5).
3. **Influence/Interest Matrix** — ASCII 2×2 (High-Influence × High-Interest top-left), built from the captured levels.
4. **Lifecycle Stage Map** — `Lifecycle Stage | Activity | Lead Stakeholder` over the five formal stages (Concept → Development → Production → Operations & Maintenance → Disposal).

### `StRS.md` (ISO/IEC/IEEE 29148 — Stakeholder Requirements Specification; PROBLEM space)
```markdown
## 1. Purpose & scope
## 2. Stakeholders        <!-- references STK-* from Stakeholder_Mission.md -->
## 3. Stakeholder needs
| ID | Need (outcome, solution-free) | Originating STK | Priority | Candidate MOE |
|----|-------------------------------|-----------------|----------|---------------|
| SN-01 | The system shall enable ... | STK-01 | High | <effectiveness measure> |
## 4. Constraints & assumptions   <!-- candidate C-/D- constraints, feed Phase 02 -->
## 5. Needs-to-scenario trace      <!-- SN-* ↔ SCN-* -->
```

### `OpsCon.md` (ISO/IEC/IEEE 29148 — Operational Concept / ConOps)
```markdown
## 1. Operational overview        <!-- mission, users, environment -->
## 2. Operational scenarios
### SCN-01 — <name>
- Actors: ... | Trigger: ... | Main flow: ... | Success outcome: ...
- Exercises needs: SN-0x, SN-0y
## 3. Modes & conditions          <!-- nominal / degraded / maintenance -->
## 4. Operational environment & constraints
```

### `Feasibility_Study.md`
```markdown
## 1. Technical feasibility   — verdict (Go/Conditional/No-Go) + evidence; low-TRL → RSK-*
## 2. Market / operational    — demand & adoption verdict + evidence
## 3. Regulatory / legal      — applicable standards & certs (→ candidate C-/D-)
## 4. Economic                — ROM cost vs benefit (full estimate deferred to Phase 05)
## 5. Overall recommendation  — Go / Conditional-Go / No-Go + conditions
```

### `Project_Development_Plan.md`
1. **Lifecycle Model** — `Track | Model | Rationale` (SAFe only as a Hybrid note).
2. **Schedule** — `Milestone | Target | Gate` keyed to **MCR then SRR** (PDR/CDR as forward markers; no TRR/PRR).
3. **Team Structure** — `Group | Headcount | Responsibility` + Total row.
4. **Risks & Opportunities** — `ID | Description | Likelihood (1–5) | Impact (1–5) | Band | Mitigation` (seeds the living Risk register).
5. **Governance** — gates owned (MCR→SRR), review cadence, safety/security/privacy triggers.

## AI prompt pack

- **ELICITATION (needs, solution-free):** "Act as an INCOSE systems engineer running 15288 Stakeholder Needs definition for `<project>` in `<domain>`. Interview me ONE stakeholder at a time. For each, extract outcome-based needs — if I state a technology, reframe it as the need it serves. Number them SN-01… with originating STK, priority, and a candidate effectiveness measure."
- **ELICITATION (OpsCon):** "Walk me through a day in the life of `<system>`: nominal mission, one degraded mode, and one maintenance event. For each, capture actors, trigger, main flow, success outcome as SCN-01… and tell me which SN-* it exercises."
- **GENERATION (draft a deliverable):** "From these SN-* and SCN-*, draft `Feasibility_Study.md` covering technical, market/operational, regulatory, and economic feasibility, with a Go/Conditional/No-Go verdict and evidence per dimension. Flag every unsupported claim as `TODO:`; invent no numbers."
- **CRITIQUE / RED-TEAM:** "Challenge this Concept package. Where am I (a) smuggling a solution into a need, (b) missing a stakeholder who could veto or delay, (c) claiming feasibility without evidence, (d) leaving an off-nominal scenario uncovered? List the top gaps and the cheapest way to close each before MCR."
- **GATE CHALLENGE:** "Play the MCR board. Given mission, OpsCon, feasibility, and the chosen lifecycle model, decide Proceed / Proceed-with-actions / Hold / Stop and justify it. Do not rubber-stamp."

## Research & specialised-agent triggers

- **WEB RESEARCH when:** the domain has standards/regulations you must enumerate for feasibility (e.g., medical → IEC 62304/ISO 13485/FDA; automotive → ISO 26262; air → DO-178C; payments → PCI-DSS); you need market-size / adoption / comparable-system data for market feasibility; or you need current TRL/technology-maturity evidence for technical feasibility. Look up the **canonical citations in Conventions §9** rather than guessing versions.
- **SPECIALISED AGENT when:** (a) a **regulatory-research agent** to map the full applicable-standards landscape for a regulated domain; (b) a **market/competitive-analysis agent** for demand and comparable-system benchmarking; (c) a **cost-estimation agent** for ROM economic feasibility (hand off to Phase 05 COCOMO/LCC for depth); (d) a **safety/security pre-screen agent** when the OpsCon reveals hazard or threat surface, to seed the Safety/RAMS and Security threads early.

## Cross-cutting hooks

This phase **seeds** several of the 8 threads (see [`../../../se-workflow/cross-cutting/`](../../../se-workflow/cross-cutting/)) and consumes none yet:
- **Risk & Opportunity** — feeds: creates the living `RSK-*`/`OPP-*` register reviewed at every gate. → [`../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md`](../../../se-workflow/cross-cutting/Risk_and_Opportunity_Management.md)
- **Measurement (MOE/MOP/TPM)** — feeds: each `SN-*` carries a candidate MOE that Phase 02 numbers as `MOE-*`.
- **Safety/RAMS** & **Security** — feeds: off-nominal `SCN-*` and regulatory feasibility seed the hazard log and threat model.
- **Cost/Schedule** — feeds: ROM economic feasibility + schedule are the first cost/schedule baseline inputs (full EVM later).
- **HSI** — feeds: human-centred `SN-*`/`SCN-*` (operators, maintainers) seed Human Systems Integration.
- **Configuration Mgmt** & **Quality** — consumes the Phase 00 SEMP cadence; this phase's artifacts become the first items placed under draft control.

## Standards anchor

| Realises (15288:2023) | Invokes |
|---|---|
| **Business or Mission Analysis** process | ISO/IEC/IEEE **29148:2018** — **BRS** (mission/business) |
| **Stakeholder Needs & Requirements Definition** process | ISO/IEC/IEEE **29148:2018** — **StRS** + **OpsCon** |

Anchored to **ISO/IEC/IEEE 15288:2023**, the **INCOSE SE Handbook v5 (2023)**, and **NASA/SP-2016-6105 Rev 2** (Concept-stage / MCR practice). Use the exact citation forms in Conventions §9; IEEE 830 is superseded by 29148 — do not cite it.

## Exit-gate checklist

Gate: **MCR (Mission Concept Review) → SRR-entry** (Conventions §3).
- [ ] Mission statement reviewed and approved by stakeholders.
- [ ] ≥ 5 stakeholders captured with `STK-*`, influence, and interest.
- [ ] `StRS.md` complete — every `SN-*` is solution-free, prioritised, and traced to an originating `STK-*`.
- [ ] `OpsCon.md` complete — every high-priority `SN-*` is exercised by ≥ 1 `SCN-*`; top off-nominal/maintenance threads covered.
- [ ] `Feasibility_Study.md` complete — all four dimensions verdicted; **no non-waivable No-Go**.
- [ ] Lifecycle model chosen and justified per track (Spiral available; SAFe only as a Hybrid note).
- [ ] Top 4+ risks logged as `RSK-*` with likelihood/impact/band, handed to the Risk thread.
- [ ] Schedule anchored to MCR→SRR (no invented TRR/PRR dates).

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Needs read like a spec ("use OAuth2", "AES-256"). | Solution smuggled into the problem space. | Reframe as the outcome; move the tech to a candidate `C-` constraint for Phase 02. |
| No feasibility study; phase "ends" anyway. | Treated MCR as a formality. | Feasibility is the **gate** of Concept — verdict all four dimensions before declaring done. |
| OpsCon reduced to one-line use-case cells. | Scenarios captured as table cells, not flows. | Write `SCN-*` with actors/trigger/flow/outcome; trace to `SN-*`. |
| Spiral never offered for a high-risk project. | Selector dropped Spiral. | Offer all four base models + Hybrid via `AskUserQuestion`. |
| "Agile / SAFe" listed as one model. | Conflated base model with scaling framework. | Agile is a base model; SAFe is a Hybrid-only scaling note. |
| Schedule keyed to TRR/PRR. | Over-reached into later phases. | Anchor to MCR→SRR only; PDR/CDR as forward markers. |
| CDR pinned to a quarter here. | Inventing downstream gate dates. | CDR is owned by Phase 06 — reference, don't schedule. |
| Stakeholder table column count drifts. | Restated shape inconsistently. | Use the fixed 6-column shape above everywhere. |
| Invented cost/headcount/dates. | Filled gaps to look complete. | Use `TODO: <owed>`; never fabricate numbers. |

## References
- [`../../../se-workflow/05_Conventions.md`](../../../se-workflow/05_Conventions.md) — IDs, gates (MCR/SRR), severity, baselines, citations (the contract).
- [`../../../se-workflow/01_Workflow_Overview.md`](../../../se-workflow/01_Workflow_Overview.md) — §5 problem vs. solution space, §7 lifecycle-model selector.
- KB: [`../../../Systems-Engineering-KB/topics/01-se-fundamentals/fundamentals.md`](../../../Systems-Engineering-KB/topics/01-se-fundamentals/fundamentals.md) · [`02-se-process-stages`](../../../Systems-Engineering-KB/topics/02-se-process-stages/fundamentals.md) (feasibility = gate of Concept; ConOps) · [`03-lifecycle-models`](../../../Systems-Engineering-KB/topics/03-lifecycle-models/fundamentals.md) (4 models + blends).
- Worked example: [`../../worked_example/Phase_01_Concept/`](../../worked_example/Phase_01_Concept/) — structural reference (adapt, don't copy values).
- Related phases: `se-phase-00-agreement` (inputs) · `se-phase-02-requirements` (derives `SN→REQ`, numbers `MOE`).

</supporting-info>
