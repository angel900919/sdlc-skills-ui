---
name: se-phase-00-agreement
description: Runs Phase 00 (Agreement & Enablement) — the pre-Concept wrapper that establishes the deal and the means to execute it before any technical work starts. It interviews the user one topic at a time about the acquisition vehicle (RFP/SOW/contract), acceptance criteria, acquirer/supplier roles, the SE management approach (process, organization, tailoring, technical effort), and the project-enabling infrastructure (tools, QA, knowledge management, lifecycle-model management), then produces Agreement_Register.md, SEMP.md (Systems Engineering Management Plan), and Project_Enablement_Plan.md. Its exit gate is ATP (Authority to Proceed). Use it when the user wants to kick off a systems-engineering engagement, set up an agreement/contract register, write a SEMP, plan project enablement/infrastructure, capture acceptance criteria and acquirer/supplier roles, define SE tailoring, or run phase 0 / agreement / authority-to-proceed. Triggers on phrasings like "start an SE engagement", "phase 0 agreement", "write a SEMP", "set up the agreement register", "capture acceptance criteria", "authority to proceed / ATP", "project enablement plan", "who is the acquirer and supplier".
---

# Phase 00 — Agreement & Enablement

<what-to-do>

Establish the **deal** (acquirer/supplier agreement, acceptance criteria) and the **means to execute it** (SE management approach + enabling infrastructure) so the project is authorised before any concept work begins; produce `Agreement_Register.md`, `SEMP.md`, and `Project_Enablement_Plan.md`. The exit gate is **ATP — Authority to Proceed** (agreement signed; SEMP approved; funding & team authorised). This phase conforms in full to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, severities, baselines, status strings, and standard citations — it does not redefine them.

**When this phase applies.** Run it for *any* engagement that has an acquirer/supplier relationship or needs an authorised, funded start — external contracts, internal product charters, grants, hardware, software, or hybrid alike. For a tiny self-funded prototype you may **tailor it to Minimum-Viable** (a one-page charter + acceptance bar + provisional SEMP), but never skip it silently: an unauthorised, criteria-less start is the root cause of "built the wrong thing, with no budget left to fix it." It always precedes Phase 01 (Concept).

## Inputs (from prior phases)
Phase 00 is the **first** phase, so there are no prior-phase artifacts. Read these if they happen to exist; otherwise elicit from the user and flag the source:
- **Acquirer-supplied source documents** — RFP, RFQ, ITT, SOW, draft contract, MOU, or a one-line "we want to build X." If none exist, this is an *internal/self-funded* engagement: record the acquirer and supplier as the **same organization** and note it.
- Any pre-existing **organizational assets** — a corporate SE process, QMS, tool standards, an org Risk policy. These are **sourced from the acquiring org**; cite them and mark `Source: acquiring org` rather than re-authoring them here (keep org-procurement depth light per the 15288 scope note in [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) §3).
- If absolutely nothing is provided, proceed from a blank slate and mark every unknown as `TODO:`.

## Step-by-step
Interview **one topic at a time** (one assistant message per topic, not a wall of questions). Use `AskUserQuestion` for finite choices. Reuse every fact already given; never re-ask. Mark anything the user cannot answer as `TODO: <what is owed, by whom>` — never invent numbers, dates, or names.

1. **Engagement identity & output location** (one message, free text — group these because they are clearly related):
   - Project name (long form) and short **slug** (kebab-case; drives the output folder and every `Document ID` per Conventions §6).
   - One-line statement of what is being acquired/built and for whom.
   - Domain (e.g., automotive, medical, fintech, IoT, defense) and whether the system is **hardware / software / hybrid** — this drives tailoring.
   - Default `<output-dir>` = `./<slug>/Phase_00_Agreement/`. Confirm once and reuse for every later phase.
2. **Acquisition vehicle** (`AskUserQuestion`, single-select): *Formal contract* · *RFP/SOW response* · *Internal charter / self-funded* · *Grant / framework* · *Other*. Capture the document name/number and date. If internal, set acquirer = supplier and skip supplier-selection depth.
3. **Acquirer & supplier roles.** Free text: name the **acquirer** (who needs/pays for the system), the **supplier** (who delivers it), and any key sub-tier suppliers/partners. For each, capture the authorised point of contact and decision authority. Map to the 15288 **Acquisition** (acquirer) and **Supply** (supplier) processes.
4. **Scope of agreement & deliverable list.** What the supplier is obligated to deliver (the system + which SE artifacts), and explicitly what is **out of scope**. Push for 4–8 items each side. Tie each obligation to a future phase deliverable where known (e.g., "SysRS at SRR", "Verification evidence at TRR").
5. **Acceptance criteria.** Elicit the conditions under which the acquirer will **accept** the delivered system — the objective bar that Phase 08 Validation (PRR) will be measured against. For each, capture: criterion ID `AC-<nn>`, description, how it will be demonstrated (T/I/A/D per Conventions §4 — these are the same four codes used at acceptance), and the acceptance authority. Mark `TODO:` for any criterion the acquirer has not yet committed to a threshold on; do not invent thresholds.
6. **Commercial frame (light).** Free text and shallow on purpose: contract type (firm-fixed-price / cost-plus / T&M / internal budget), top-level milestones tied to **payment or funding release**, warranty/support period, IP/licensing stance, and any liquidated-damages or penalty terms. Anything procurement-heavy → mark `Source: acquiring org / contracts team` and stop; this phase frames it, it does not run procurement.
7. **Constraints carried from the agreement.** Capture imposed limits the agreement fixes — budget ceiling, mandated technology, mandated standards/regulations, delivery date. These become `REQ-C-<nn>` (Constraint) and `REQ-D-<nn>` (Domain) candidates in Phase 02 — record them now as "constraint seeds" so they are not lost (do **not** assign REQ IDs here; that is Phase 02's job).
8. **SE management approach — for the SEMP** (one topic at a time across these sub-questions):
   - **Organization & roles** — who is the lead SE / chief engineer, the technical review authority, and the discipline leads. A small RACI for the gate decisions is enough.
   - **Lifecycle model intent** — note the *likely* model (Waterfall / V-Model / Spiral / Agile / Hybrid) but record it as **provisional**; the binding choice is made in Phase 01 (MCR). Cross-reference, do not pre-empt.
   - **Technical effort & integration** — how the technical processes will be planned, assessed, and controlled; how the 8 cross-cutting threads will be run and reviewed at every gate.
   - **Tailoring** — use `AskUserQuestion` to set the artifact set: *Minimum-Viable* vs *Formal* (per the Tailoring Guide). Record every tailored-out artifact as `tailored out: <reason>` — Conventions §1 forbids silent skipping.
9. **Project enablement — for the Project_Enablement_Plan** (one topic at a time):
   - **Infrastructure & tools** — requirements mgmt, modeling/MBSE, code/CI-CD, test, observability, document/CM repository. Default to "TODO: confirm org standard" rather than inventing tool names.
   - **Quality management / QA** — which QMS applies (ISO 9001 if any), QA cadence, audit points (note FCA/PCA happen at PRR, owned by later phases).
   - **Knowledge management** — where artifacts live, naming/versioning per Conventions §6, lessons-learned capture (feeds Phase 11 Disposal).
   - **Lifecycle-model management** — who owns the chosen lifecycle model and how tailoring decisions are governed.
   - **Human-resource enablement (light)** — confirm the team is *authorised and funded* (an ATP precondition); portfolio/HR depth is **org-level, out of scope** — flag `Source: acquiring org`.
10. **Write `<output-dir>/Phase_00_Agreement/Agreement_Register.md`** — frontmatter per Conventions §6 (`Document ID: AGR-<SLUG>-v0.1`, `Status: Draft`), then the sections in *Deliverables & output shapes* below.
11. **Write `<output-dir>/Phase_00_Agreement/SEMP.md`** — frontmatter (`Document ID: SEMP-<SLUG>-v0.1`, `Standard: ISO/IEC/IEEE 15288:2023`), then its sections below.
12. **Write `<output-dir>/Phase_00_Agreement/Project_Enablement_Plan.md`** — frontmatter (`Document ID: PEP-<SLUG>-v0.1`), then its sections below.
13. **Seed the cross-cutting registers (stubs only).** Create `<output-dir>/_cross_cutting/` stubs flagged in the SEMP so later phases inherit them: `Risk_Opportunity_Register.md` (with any agreement-level `RSK-<nn>`/`OPP-<nn>`), `QA_Plan.md`. Do not populate fully — just open them so the threads are alive from Phase 00.
14. **Exit-gate (ATP) check.** Print the Exit-gate checklist below and ask the user to confirm each item. ATP is a real decision (*Proceed · Proceed-with-actions · Hold · Stop*), not a rubber stamp — if agreement/funding/team authorisation is unconfirmed, record **Proceed-with-actions** with owned `TODO:`s rather than declaring the gate passed.
15. **Done.** Print all three output paths and recommend the next step: invoke `se-phase-01-concept` to turn the authorised agreement into mission, stakeholders, OpsCon, and feasibility (toward MCR).

## Decision points
- **Internal vs external engagement.** *How to decide:* is there a distinct paying acquirer? If no (self-funded/internal product), acquirer = supplier; skip supplier-selection and most commercial terms, but still write acceptance criteria and a SEMP — they protect you from "built the wrong thing."
- **Contract type (light touch).** *How to decide:* firm-fixed-price when scope is stable and well understood; cost-plus/T&M when scope is uncertain or research-heavy. This frames risk ownership; deep negotiation is `Source: acquiring org / contracts team`.
- **Tailoring level — Minimum-Viable vs Formal.** *How to decide:* small/low-criticality → Minimum-Viable artifact set; safety-critical or regulated (DO-178C, ISO 26262, IEC 62304, IEC 61508) → Formal set with bidirectional traceability. Record the choice in the SEMP and the rationale.
- **What to write now vs. defer.** *How to decide:* if a fact binds the *deal or the means* (acceptance bar, funding, authority, mandated standard), capture it here; if it belongs to the *solution* (requirements, architecture, tests), record only a "seed" and cross-reference the owning phase.
- **Acceptance method per criterion (T/I/A/D).** *How to decide:* use the same four codes as Conventions §4 — **T** when there is a measurable threshold provable by exercising the system, **A** when it is provable by calculation/modelling/similarity, **I** when provable by examining an artifact/document, **D** when provable by operating and observing without instrumentation. Acceptance/UAT itself is a *validation* activity (Phase 08) even though it reuses these codes — so assign the code, but the test runs later.
- **ATP verdict.** *How to decide:* all three of {agreement signed, SEMP approved, team+funding authorised} true → Proceed. Any one in flight → Proceed-with-actions. A blocking gap (no funding, no signed agreement) → Hold/Stop. Record the verdict explicitly; an unrecorded gate is a failed gate.

## Rules
- **Conform to Conventions for everything shared** — IDs (`AC-<nn>` here; REQ/STK/RSK/OPP/TC as defined there), gate names, T/I/A/D, S1–S4 severity, baseline/status strings, document frontmatter, and the canonical standard citations in §9. Never restate or redefine them; cite the section.
- **One topic at a time.** Do not dump every section's questions in a single message. Group only when answers are obviously related (e.g., name + slug + domain).
- **Reuse prior facts; never re-ask.** Carry the slug, domain, acquirer/supplier names, and tailoring decision into every later phase.
- **Keep org-procurement and org-enabling depth light.** Frame Agreement + Organizational Project-Enabling, then point at the acquiring org for the heavy parts and tag them `Source: acquiring org`. This matches the 15288 scope boundary in Overview §3.
- **Mark unknowns, don't invent.** Every missing number/date/name is `TODO: <owed, by whom>`. No fabricated thresholds, budgets, or tool names.
- **Don't copy the worked example's numbers.** Read `../../worked_example/Phase_00_Agreement/` for *shape*, then write the user's real content.
- **Cross-reference, don't re-define.** Lifecycle-model choice → Phase 01; REQ classes → Phase 02; acceptance test execution → Phase 08; CM baselines → Phase 09. This phase only *frames* and *seeds* them.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Agreement_Register.md`, `SEMP.md`, `Project_Enablement_Plan.md`). Each file carries the Conventions §6 frontmatter block.

### `Agreement_Register.md` — required sections
1. **Engagement summary** — what is acquired, for whom, domain, hardware/software/hybrid.
2. **Acquisition vehicle** — type + document name/number/date (or "internal charter").
3. **Parties & roles** — table `Party | Role (Acquirer / Supplier / Sub-tier) | Authorised POC | Decision authority`.
4. **Scope of agreement** — *In scope* / *Out of scope* obligation lists; supplier deliverables mapped to future-phase artifacts where known.
5. **Acceptance criteria** — table `AC-<nn> | Criterion | Threshold | Accept method (T/I/A/D) | Acceptance authority | Status`. Unknown thresholds = `TODO:`.
6. **Commercial frame (light)** — contract type, payment/funding milestones, warranty/support, IP/licensing, penalties. Procurement-heavy rows tagged `Source: acquiring org`.
7. **Constraint seeds** — imposed budget/tech/standard/date limits → candidate `REQ-C-*` / `REQ-D-*` for Phase 02 (no IDs assigned yet).
8. **Open items / TODO register** — owed answers with owner + due.

### `SEMP.md` (Systems Engineering Management Plan) — required sections
1. **Purpose & scope** — what this SEMP governs; conformance to Conventions + 15288.
2. **SE process model** — the technical + technical-management processes used; how the 12 stages apply.
3. **Organization & roles** — lead SE / chief engineer, technical review authority, discipline leads; gate-decision RACI.
4. **Technical effort planning** — how planning, assessment & control, decision, risk, configuration, information, measurement, and QA are run (cross-reference the threads, don't re-author).
5. **Provisional lifecycle model** — likely model, marked *provisional → bound in Phase 01 (MCR)*.
6. **Tailoring** — Minimum-Viable vs Formal; table of `tailored out: <artifact> — <reason>`.
7. **Gate & baseline plan** — the ATP→…→DRR ladder (cite Conventions §3); which baselines (Requirements@SRR, Allocated@PDR, Product@CDR) this project will set.
8. **Cross-cutting thread plan** — one line per thread (Risk, CM, Safety/RAMS, Security, HSI, Measurement, Cost/Schedule, Quality) naming its register and review cadence.
9. **References** — standards + the cross-cutting files.

### Compact SEMP skeleton (copy, then fill)
```markdown
---
Document: Systems Engineering Management Plan — <Project>
Document ID: SEMP-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer / Chief Engineer
---
## 3. Organization & roles
| Role | Person | Gate-decision authority (RACI) |
|---|---|---|
| Lead SE / Chief Engineer | TODO | A on technical gates |
## 5. Provisional lifecycle model
<Hybrid | V-Model | …> — PROVISIONAL; bound in Phase 01 at MCR.
## 6. Tailoring — <Minimum-Viable | Formal>
- tailored out: <artifact> — <reason>
## 7. Gate & baseline plan
ATP → MCR → SRR → PDR → CDR → TRR → PRR → ORR → GA → DRR (Conventions §3).
Baselines: Requirements@SRR · Allocated@PDR · Product@CDR.
## 8. Cross-cutting thread plan
| Thread | Register | Review cadence |
|---|---|---|
| Risk & Opportunity | _cross_cutting/Risk_Opportunity_Register.md | every gate |
```

### `Project_Enablement_Plan.md` — required sections
1. **Infrastructure & tools** — table `Capability | Tool/Standard | Status (org-standard / TBD) | Source`.
2. **Quality management / QA** — applicable QMS, QA cadence, audit/FCA-PCA pointers (owned later).
3. **Knowledge management** — repository, naming/versioning (Conventions §6), lessons-learned capture (→ Phase 11).
4. **Lifecycle-model management** — owner of the model + tailoring governance.
5. **Human-resource & funding enablement (light)** — team authorised + funded (ATP precondition); portfolio/HR flagged `Source: acquiring org`.
6. **Enablement gaps / TODO** — missing infrastructure with owner + due.

### Compact skeleton (copy, then replace every value)
```markdown
---
Document: Agreement Register — <Project>
Document ID: AGR-<SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023
Status: Draft
Owner: Lead Systems Engineer
---
## 1. Engagement summary
<acquired thing> · for <acquirer> · domain <…> · <hardware|software|hybrid>
## 3. Parties & roles
| Party | Role | Authorised POC | Decision authority |
|---|---|---|---|
| <Org A> | Acquirer | TODO: name | Accepts deliverables, releases funding |
| <Org B> | Supplier | TODO: name | Delivers system + SE artifacts |
## 5. Acceptance criteria
| ID | Criterion | Threshold | Method | Authority | Status |
|---|---|---|---|---|---|
| AC-01 | <objective condition> | TODO: threshold owed by acquirer | T | <role> | Open |
## 7. Constraint seeds (→ Phase 02)
- Budget ceiling: TODO → candidate REQ-C · Mandated standard: <…> → candidate REQ-D
```
> The threshold/POC values above are **placeholders** — do not ship them; replace or mark `TODO:`.

## AI prompt pack
Copy-paste and fill the `<>` slots. (Pair with `../../prompts/` if present.)

- **ELICITATION —** "You are my INCOSE-certified lead SE running Phase 00. Ask me, **one topic at a time**, the questions needed to fill an Agreement Register, a SEMP, and a Project Enablement Plan for `<project>`, a `<hardware/software/hybrid>` system in `<domain>`. Start with the acquisition vehicle and acquirer/supplier roles. After each of my answers, reflect it back, mark anything I couldn't answer as `TODO:`, and move to the next topic. Do not invent numbers."
- **ACCEPTANCE-CRITERIA DRILL —** "From this scope/SOW `<paste>`, draft a table of acceptance criteria as `AC-<nn> | Criterion | Threshold | Accept method (T/I/A/D) | Authority`. Where the source gives no objective threshold, write `TODO: threshold owed by <party>` — never guess a number. Flag any criterion that is unmeasurable as written."
- **GENERATION —** "Using my answers above and the section shapes in this skill, draft `SEMP.md` with the Conventions §6 frontmatter (`Document ID: SEMP-<SLUG>-v0.1`, `Standard: ISO/IEC/IEEE 15288:2023`, `Status: Draft`). Record the lifecycle model as *provisional* and list tailored-out artifacts as `tailored out: <reason>`. Cross-reference the cross-cutting threads rather than re-defining them."
- **CRITIQUE / RED-TEAM —** "Act as the acquirer's review board challenging ATP. Attack this Agreement Register + SEMP: Are acceptance criteria objective and method-assigned, or vague? Is funding and team authorisation actually confirmed or assumed? Which obligations have no owning phase? What mandated standard or regulation is missing as a constraint seed? Where am I doing procurement depth that should be `Source: acquiring org`? List blocking gaps that should hold ATP."
- **TAILORING —** "Given a `<size/criticality>` `<domain>` project, recommend Minimum-Viable vs Formal artifact tailoring per the Tailoring Guide, justify it, and list which artifacts I may safely mark `tailored out` and why."

## Research & specialised-agent triggers
- **Web research — recommend when:** a **mandated domain standard/regulation** is named or implied (e.g., DO-178C, ISO 26262, IEC 62304, IEC 61508, FDA/CE, HIPAA, GDPR) and you must confirm its current edition and acceptance implications; the **contract type or acquisition framework** is unfamiliar (e.g., government FAR/DFARS, EU framework agreements) — look up the obligations it imposes, not legal advice; you need **comparable acceptance criteria** from similar systems to sanity-check the bar. Always use the canonical citation forms in Conventions §9, and confirm editions rather than trusting memory.
- **Specialised agent — spawn when:** a **contracts/procurement agent** is warranted to parse a long RFP/SOW into obligations and acceptance terms (keep its output framed, not authored, here); a **compliance/standards-mapping agent** to enumerate which standards a regulated domain pulls in and map them to constraint seeds; a **cost/funding-estimation agent** if a rough order-of-magnitude budget is needed to confirm the engagement is fundable before ATP. Hand each agent the slug, domain, and hardware/software/hybrid flag so its output threads into later phases.

## Cross-cutting hooks
Phase 00 **opens** the threads that the rest of the workflow keeps alive (Overview §1):
- **Risk & Opportunity** — capture agreement-level risks/opportunities as `RSK-<nn>`/`OPP-<nn>` and open the register. → [`../../cross-cutting/Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md).
- **Configuration Mgmt** — set the document repository, naming, and versioning so baselines (SRR/PDR/CDR) have a home. → [`../../cross-cutting/Configuration_Management.md`](../../cross-cutting/Configuration_Management.md).
- **Quality** — name the QMS and QA cadence in the Enablement Plan; open the QA stub. → [`../../cross-cutting/Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md).
- **Measurement (MOE/MOP/TPM)** — note any acquirer-level success measures that will seed MOEs in Phase 02. → [`../../cross-cutting/Measurement_MOE_MOP_TPM.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md).
- **Cost/Schedule** — fund/milestone frame feeds EVM and cost baselines later. → [`../../cross-cutting/Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md).
- **Safety/RAMS · Security · HSI** — if the domain is safety-critical, security-sensitive, or human-intensive, name the obligation in the SEMP so those threads start now, not mid-project. → [`../../cross-cutting/`](../../cross-cutting/).

## Standards anchor
Phase 00 realises the ISO/IEC/IEEE 15288:2023 **Agreement** processes (**Acquisition** — acquirer side; **Supply** — supplier side) and *frames* the **Organizational Project-Enabling** processes (Life-cycle Model Management, Infrastructure Management, Quality Management, Knowledge Management; Portfolio & Human-Resource Management are org-level and explicitly out of scope). The SEMP is a **Technical Management** artifact (Project Planning). Authorities: **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2** for SE management practice; **ISO 9001:2015** for quality; **ISO 31000:2018** for the risk thread it opens; **ISO 10007:2017** for the CM/versioning frame. Use the exact citation forms in [`../../05_Conventions.md`](../../05_Conventions.md) §9. Org-procurement depth is intentionally light and `Source: acquiring org` (Overview §3).

## Exit-gate checklist
ATP — Authority to Proceed (Conventions §3: "Agreement signed; SEMP approved; funding & team authorised"):
- [ ] Acquirer and supplier identified, with authorised POCs and decision authority.
- [ ] Acquisition vehicle recorded (contract/SOW/charter) with name/number/date.
- [ ] Scope of agreement (in/out) and supplier deliverable list captured.
- [ ] Acceptance criteria written with an accept method (T/I/A/D) and authority each; unknown thresholds explicitly `TODO:`.
- [ ] Constraint seeds (budget/tech/standard/date) recorded for Phase 02.
- [ ] **SEMP approved** — organization/roles, tailoring (Min-Viable/Formal), gate & baseline plan, thread plan all present.
- [ ] **Project Enablement Plan** — infrastructure/tools, QA/QMS, knowledge mgmt, lifecycle-model mgmt covered; org-sourced items flagged.
- [ ] **Funding and team authorised** (or a dated `TODO:` owned by a named party).
- [ ] Risk/Opportunity and QA register stubs opened.
- [ ] ATP verdict recorded: *Proceed · Proceed-with-actions · Hold · Stop* (with actions if not clean Proceed).

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Acceptance criteria are vague ("works well", "is reliable") | Skipped the objective-threshold + method drill | Give each `AC-<nn>` a threshold and a T/I/A/D accept method; mark missing thresholds `TODO:`, don't paper over. |
| Phase 00 turns into a procurement/legal exercise | Trying to *run* the Agreement group instead of *framing* it | Keep it light; tag procurement-heavy items `Source: acquiring org / contracts team` and stop. |
| Lifecycle model "decided" in Phase 00 | Pre-empting Phase 01's MCR decision | Record it as **provisional** in the SEMP; the binding choice is Phase 01. |
| Invented budget/dates/tool names in the SEMP | Filling blanks to look complete | Replace with `TODO: <owed, by whom>`; never fabricate numbers. |
| Artifacts silently dropped for a small project | Tailoring done informally | Record each as `tailored out: <reason>` (Conventions §1); never skip silently. |
| Threads (risk/CM/QA) start late, mid-project | No stubs opened at Phase 00 | Open the register stubs in step 13 so threads are alive from gate one. |
| ATP "passed" without funding/team confirmed | Treating the gate as a formality | Use the decision verdict; record Proceed-with-actions or Hold, not a blank pass. |
| Constraints lost between agreement and requirements | No handoff for imposed limits | Capture them as constraint seeds → `REQ-C-*`/`REQ-D-*` for Phase 02. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — the contract (IDs, gates incl. ATP, T/I/A/D, severity, baselines, status strings, §9 citations).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the 12-stage spine, V-model, and the 15288 four-process-group mapping (§3) that scopes this phase.
- KB: [`../../../Systems-Engineering-KB/topics/01-se-fundamentals/fundamentals.md`](../../../Systems-Engineering-KB/topics/01-se-fundamentals/fundamentals.md) (SE as integrator, lifecycle thinking), [`../../../Systems-Engineering-KB/topics/02-se-process-stages/fundamentals.md`](../../../Systems-Engineering-KB/topics/02-se-process-stages/fundamentals.md) (concept-to-disposal stages; feasibility/ConOps belong to Phase 01), [`../../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md`](../../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) (29148 document set, tools, V&V, ICDs).
- [`../../worked_example/Phase_00_Agreement/`](../../worked_example/) — worked Agreement/SEMP/Enablement set (read for *shape*, not numbers).
- Related phases: `se-phase-01-concept` (next — mission, OpsCon, feasibility, lifecycle-model binding at MCR); `se-phase-02-requirements` (consumes constraint seeds + acceptance criteria); `se-phase-08-validation` (executes acceptance criteria at PRR); `se-phase-09-change-config` (owns the baselines this SEMP plans).

</supporting-info>
