---
name: se-phase-06-integration
description: Runs Phase 06 (Integration) of the domain-agnostic SE workflow. It plans how built parts come together without late surprises: picks an integration strategy (Incremental + CI as default; Top-Down, Bottom-Up, Big Bang, or Hybrid as alternatives), orders increments by DEPENDENCY WEIGHT, defines numbered increments (INC-NN) with entry/exit criteria tied to REQ and TC-VER, classifies each dependency (Data/Control/Temporal/Resource) and each interface type (HW / SW-API / HMI), maps every ICD-NN to a stub/driver/mock, sets the canonical CI/CD and static-scan tool pipelines per tier, and stands up Hardware-in-the-Loop rigs for safety-relevant and physical-measurement requirements. It produces Integration_Plan.md and drives the system to its CDR exit gate (ICDs frozen, product baseline set). Use when the user wants to write an integration plan, choose an integration strategy, order increments, enumerate stubs and drivers, map dependencies and interfaces, design CI/CD pipelines, plan HIL rigs, freeze ICDs, or prep for a CDR. Triggers on phrasings like "integration plan", "incremental integration", "order the increments", "CI/CD pipeline plan", "HIL rig", "stubs and drivers", "dependency map", "freeze interfaces", "prep for CDR", "phase 6 integration".
---

# Phase 06 — Integration

<what-to-do>

This phase plans how the implemented components are combined and tested into a working whole — choosing the integration order and method so a break is traceable to the piece just added, and freezing the interfaces — and it ends at its exit gate **CDR (Critical Design Review)** where ICDs are frozen and the product baseline is set. It realises the ISO/IEC/IEEE 15288:2023 **Implementation** and **Integration** processes and conforms in all IDs, gates, methods, severities, and naming to [`../../05_Conventions.md`](../../05_Conventions.md) — cite that file; do not redefine its conventions here.

## Inputs (from prior phases)

Read these first; if one is absent, mark a `TODO:` and proceed with what exists (do not invent content):

- **`Phase_04_Architecture/ICD.md`** — the interface inventory. Every `ICD-NN` becomes an integration seam and must appear in the stubs/drivers/mocks coverage table. (Fallback: if no ICD exists, the gate cannot pass — flag CDR blocked.)
- **`Phase_04_Architecture/Architecture_Description.md`** + **`Tech_Stack_Rationale.md`** — what is being integrated and on which tiers (firmware / edge / cloud / mobile / web).
- **`Phase_03_Modeling/BDD.puml` + `IBD_*.puml`** — block decomposition and the data/control flows that reveal dependencies.
- **`Phase_02_Requirements/SysRS.md`** + **`Traceability_Matrix.md`** — the `REQ-*` and seeded `TC-VER-*` that gate each increment's exit criteria; the `TPM-*` margins integration must protect.
- **`Phase_01_Concept/Project_Development_Plan.md`** — the chosen lifecycle model and schedule increments are anchored to.
- **`Phase_05_Tradeoff/Decision_Register.md`** — `DEC-NN` choices (build vs buy, vendor firmware) that drive what is real vs stubbed.
- **`_cross_cutting/Risk_Opportunity_Register.md`**, **`Hazard_Log.md`** — integration risks (`RSK-NN`) and safety hazards (`HAZ-NN`) that gate HIL scope and CDR.

## Step-by-step

Interview **one topic at a time**. Reuse facts already captured in prior phases; never re-ask what the ICD, BDD, or SysRS already states. Use `AskUserQuestion` for finite choices. Mark every unknown number as `TODO: <who owes it>` — never invent thresholds.

1. **Confirm scope and output path.** Default output: `<output-dir>/<slug>/Phase_06_Integration/Integration_Plan.md`. Confirm whether the system is **software-only, hardware-only, or hybrid** (this decides whether HIL applies). Pull the tier list from the Tech Stack Rationale.

2. **Pick the integration strategy** (one `AskUserQuestion`). Capture choice **+ rationale**:
   - **Incremental + CI/CD** *(Recommended; KB lowest-risk, easiest fault isolation)* — add one component/group at a time end-to-end, automated on every commit; needs a test harness.
   - **Top-Down with stubs** — start at control/decision logic, simulate everything below with **stubs**; validates architecture early, exercises low-level modules late.
   - **Bottom-Up with drivers** — start at lowest modules (drivers, sensors, utilities), simulate callers above with **drivers**; good when hardware/infra is the long pole, but system-level behaviour shows up late.
   - **Big Bang** *(rarely advised)* — integrate all at once; only for tiny projects with mature components (it destroys fault isolation — the Boeing 787 failure mode).
   - **Hybrid** — top-down for software, bottom-up for hardware; the common default for embedded/HIL systems.

3. **Order the increments by DEPENDENCY WEIGHT** *(the KB's top sequencing heuristic — do this before defining increment internals)*. Count, for each component, how many other components depend on it (its out-degree in the dependency graph). **Integrate the most-depended-upon components earliest** so the highest-risk interactions surface while there is still schedule to fix them. Record the ranking; it justifies the increment order. Ask the user only to confirm or override edge cases.

4. **Define numbered increments `INC-NN`** (per Conventions §2.3). The increment **count is project-specific** — the worked example has **9**, a small project may have 3–4; do not force "5". Each `INC-NN` carries: Goal (one end-to-end behaviour proven) · Components added (from BDD) · Entry criteria (dependent increments done, components built, the relevant `ICD-NN` frozen) · Exit criteria (observable/automated — e.g. `REQ-F-04` verified via `TC-VER-04`, ≥ target pass rate, **zero S1** defects) · Pass/Fail signal (one metric or test ID) · Duration (anchored to the Phase 01 schedule) · Tools (CI job, HIL rig). Ask increment-by-increment, not all at once.

5. **Build the dependency map and classify each edge** (Conventions/KB four types — a *dependency* is a reliance of one component on another):
   - **Data** — A produces data B consumes.
   - **Control** — A's state/control flow gates B's behaviour.
   - **Temporal (timing)** — A must initialise/boot/execute before B.
   - **Resource** — A and B share a finite resource (bus, bandwidth, power rail, DB lock, memory).
   Render as a table and/or a PlantUML dependency diagram. Keep this **distinct from the interface taxonomy** in step 6 — they fail differently (missing/incompatible *component* vs mismatched *boundary*).

6. **Classify every interface by type and map each `ICD-NN` to a stub/driver/mock.** Tag each seam with its **interface type** — **Hardware** (connectors, voltage levels, signal types), **Software/API** (APIs, data formats, protocols), or **Human-Machine (HMI)** (UI elements, displays, controls). Then build the coverage table: for **every** `ICD-NN` in the Phase 04 inventory, give the placeholder needed during integration — **stub** (top-down: simulates what's *below*), **driver** (bottom-up: simulates what's *above*), or **mock** (peer-to-peer) — the tool that provides it, and **when it is replaced** by the real component. Validate mocks against the ICD (generate from OpenAPI/Protobuf where possible; run contract tests in CI).

7. **Design the CI/CD pipelines — per tier, not one mega-pipeline** (firmware, edge OS, cloud services, mobile, web have different velocities). For each tier capture: source repo + branch model (trunk / GitFlow); build artifact (`.bin`/`.deb`/`.apk`/container image/OTA package); ordered stages with a test gate at each (build → unit → integration/contract → static-scan/SAST → conformance → publish → deploy); deploy target per environment (lab/HIL → staging → pre-prod → pilot → prod); rollout + rollback strategy (blue-green / canary / staged cohort / OTA with rollback). Use the **canonical CI/CD + static-scan tool table** in this file's supporting-info (this is the table's single home — Phase 07 references it). Pin tool **categories**; let the user confirm the specific tool.

8. **Stand up Hardware-in-the-Loop (HIL) rigs** *(hybrid/hardware only)*. For each rig: Purpose (what it exercises — sensor injection, load/power simulation, network attenuation, emulator) · DUT · Stimuli sources · Measurement instruments · Automation harness (Python rig / dSPACE / NI VeriStand / Speedgoat) · `REQ-*` covered · Coverage target (% of physical-measurement REQs). **HIL is non-optional** for any `REQ-P-*`/`REQ-O-*`/`REQ-SAF-*` that needs physical measurement; for safety-relevant rigs anchor the rig's rigor to the applicable functional-safety standard (ISO 26262 / IEC 61508 / IEC 62304 / DO-178C — see Standards anchor). Stand the rig up in Increment 1, not near launch.

9. **CDR readiness section.** Catalog: `ICD-NN` frozen at this CDR (each as `Status: Baseline (CDR-approved <date>)` per Conventions §6) · HIL coverage achieved vs target · open critical risks (`RSK-NN`) and hazards (`HAZ-NN`) that block CDR · `TPM-*` margins at integration · sign-off list. Freezing ICDs here establishes the **product baseline** (Conventions §3).

10. **Assemble `Integration_Plan.md`** using the deliverable skeleton below.

11. **Run the exit-gate checklist** (below). If anything fails, record the gap as a `TODO:` with an owner; do not declare CDR passed.

12. **Done.** Print the plan path. Recommend the next phase: `se-phase-07-verification` — turn each `REQ` into a T/I/A/D verification and prove the integrated system meets the SysRS.

## Decision points

- **Which strategy?** Decide on the dominant risk: control-logic uncertainty → Top-Down; hardware/infra is the long pole → Bottom-Up; want easiest fault isolation and can afford a harness → Incremental + CI (default); embedded with both → Hybrid. Big Bang only for tiny, mature-component systems.
- **What order?** Always default to **dependency-weight descending** (step 3). Override only when a hard external constraint (vendor lead time, lab availability) forces a later component earlier — record the override reason.
- **Real vs placeholder per seam?** If the real component is built and its `ICD-NN` is frozen → integrate real. Otherwise stub/driver/mock and set the replacement increment. Never leave an `ICD-NN` with no entry.
- **HIL or not for a given REQ?** If verification needs a *physical* measurement or a safety behaviour observed on real hardware → HIL rig required; if provable by analysis/inspection/sim → defer to Phase 07 method assignment.
- **Freeze the ICD now?** An interface is freezable when both sides have agreed the contract and contract tests exist. Freeze at CDR; after CDR it changes only via a `CR-NN` (Phase 09).

## Rules

- **Conform to Conventions for everything shared.** IDs (`INC-NN`, `ICD-NN`, `REQ-*`, `TC-VER-*`, `RSK-NN`, `HAZ-NN`), the gate ladder, T/I/A/D, S1–S4 severity, and baseline-status strings are defined in [`../../05_Conventions.md`](../../05_Conventions.md). Cross-reference it; never restate or fork it.
- **Interview one topic at a time.** Strategy, then order, then increments (one by one), then dependencies, then interfaces/seams, then CI/CD, then HIL. Never dump a wall of questions.
- **Reuse prior-phase facts; never re-ask.** The ICD, BDD, SysRS already hold the seams, blocks, and REQs — read them.
- **Don't copy the worked example's numbers.** The 9 increments, the EVCN tiers, and the named tools are *illustrative*. Derive this project's increment count, dependencies, and tools from this project's artifacts.
- **No skipped seams.** Every `ICD-NN` from Phase 04 must appear exactly once in the stubs/drivers/mocks coverage table. A missing seam is a guaranteed integration surprise at CDR.
- **Increments must be observable.** Each exit criterion must be decidable by a CI job, dashboard, or HIL rig. "Looks good" is not an exit criterion.
- **Keep dependency-type and interface-type taxonomies separate.** Data/Control/Temporal/Resource describes *reliance*; HW/SW-API/HMI describes the *boundary*. Tag both.
- **Own the CI/CD + static-scan table here.** Later phases (especially Phase 07) cite this file rather than re-listing tools.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

**`Integration_Plan.md`** — blank version in [`../../templates/`](../../templates/). Required sections:

```markdown
---
Document: Integration Plan — <Project>
Document ID: INTPLAN-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Implementation, Integration); IEEE 828; ISO 26262/IEC 61508 (if safety-relevant)
Status: Draft            # → Baseline (CDR-approved YYYY-MM-DD) once the gate passes
Owner: Integration Lead
---

## 1. Strategy
Chosen approach + rationale; lifecycle model it aligns with.

## 2. Increment Order — Dependency-Weight Ranking
Component | # dependents (out-degree) | Rank | Integrated in
Justifies the increment sequence; note any constraint-driven overrides.

## 3. Increments (INC-NN)        <!-- count is project-specific; scale it -->
One block per increment (template below).

## 4. Dependency Map (Data / Control / Temporal / Resource)
Table and/or PlantUML; each edge classified.

## 5. Interfaces & Stubs / Drivers / Mocks Coverage
EVERY ICD-NN, with interface type (HW / SW-API / HMI) and placeholder.

## 6. CI/CD Pipelines (per tier)
One row per tier; reference the canonical tool table.

## 7. HIL Rigs            <!-- hybrid/hardware only -->
One block per rig.

## 8. Integration Risks & Mitigations
RSK-NN with mitigation; pre-empt the Boeing-787 failure modes.

## 9. CDR Readiness
Frozen ICD-NN list, HIL coverage vs target, open RSK/HAZ, TPM margins, sign-off.
```

**Increment block (`INC-NN`):**

```markdown
### INC-NN — <Goal>
| Field | Value |
|---|---|
| Goal | <one end-to-end behaviour proven> |
| Components added | <BDD blocks> |
| Entry criteria | <prereqs incl. dependent INC-NN done + frozen ICD-NN> |
| Exit criteria | <observable: REQ-F-04 verified via TC-VER-04; ≥ <target>% pass; zero S1> |
| Pass/Fail signal | <single metric or test ID> |
| Duration | <weeks, anchored to Phase 01 schedule> |
| Tools | <CI job, HIL rig, contract-test tool> |
```

**Interface & stubs/drivers/mocks coverage table (one row per `ICD-NN`):**

| ICD-NN | Interface type (HW / SW-API / HMI) | Seam (A ↔ B) | Placeholder (stub/driver/mock) | Tool | Replaced in |
|---|---|---|---|---|---|

**HIL rig block:**

```markdown
### HIL-N — <Purpose>
| Field | Value |
|---|---|
| DUT | <device under test> |
| Stimuli | <load bank / signal gen / simulator> |
| Measurement | <scope / logic analyzer / calibrated meter> |
| Automation | <Python harness / dSPACE / NI VeriStand / Speedgoat> |
| REQs covered | <REQ-P-01, REQ-SAF-02, …> |
| Safety rigor | <ISO 26262 ASIL-x / IEC 61508 SIL-y / n-a> |
| Target coverage | <% of physical-measurement REQs> |
```

## Canonical CI/CD + static-scan tool table

> **Single home.** This table is owned by Phase 06; Phase 07 and later **reference** it rather than re-listing. Pin the *category* per stage; the project confirms the specific tool. Domain-agnostic — pick the row that fits your tier.

| Stage | Trigger | Tool categories (examples) | Failure action |
|---|---|---|---|
| **Build** | Every commit | GitHub Actions · GitLab CI · Jenkins · Azure DevOps | Block PR. |
| **Unit test** | Every commit | PyTest · Cargo test · JUnit · Vitest · GoogleTest | Block PR. |
| **Integration / contract** | Every commit | Postman+Newman · Pact · Schemathesis · REST Assured · Testcontainers | Block PR. |
| **Static analysis / SAST** | Every commit | SonarQube · Semgrep · CodeQL · Coverity · clang-tidy/clippy | Block PR on critical findings. |
| **SCA / supply-chain (SBOM)** | Every commit | Snyk · Dependabot · Trivy · Grype · `syft`(SBOM) | Block on critical CVE; emit SBOM (feeds Security thread). |
| **Conformance** | Nightly | Domain suite (e.g. protocol conformance tool) | Page on regression. |
| **Load / performance** | Pre-release | k6 · JMeter · Locust · Gatling | Block release if TPM/SLO regressed. |
| **HIL smoke** | Per increment | CI agent tagged `hil-*` driving the rig | Block firmware merge. |
| **E2E UI** | Pre-release | Playwright · Cypress · Maestro | Block release. |
| **Deploy → staging** | Merge to main | Argo CD · Helm · Terraform (IaC) | Auto-revert on health-check fail. |
| **Deploy → pilot/prod** | Manual approval | Argo CD with staged cohorts | Auto-rollback on metric regression; manual runbook for prod. |

## Integration strategy decision aid

| Strategy | Best for | Placeholder needed | Fault isolation / risk |
|---|---|---|---|
| **Incremental + CI** | Most modern systems | Either, by plan | Easy / Low |
| **Top-Down + stubs** | Validate control logic/architecture early | Stubs (simulate below) | Moderate / Medium |
| **Bottom-Up + drivers** | Hardware/infra is the long pole | Drivers (simulate above) | Moderate / Medium |
| **Big Bang** | Tiny project, mature components | None | Poor / High |
| **Hybrid** | Embedded with HIL | Stubs + drivers + HIL | Mixed |

## AI prompt pack

- **Elicitation —** "We are planning integration for `<system>`. From `ICD.md`, `BDD.puml`, and `SysRS.md` I have these components and seams: `<paste>`. Ask me, one topic at a time, the questions you need to (a) choose a strategy, (b) order increments by dependency weight, and (c) decide real-vs-placeholder per ICD. Do not ask about things the artifacts already answer."
- **Dependency-weight ordering —** "Here is the component-to-component dependency list (each tagged Data/Control/Temporal/Resource): `<paste>`. Compute each component's out-degree (how many depend on it), rank descending, and propose an increment order that integrates the most-depended-upon components earliest. Flag any cycle."
- **Generation —** "Draft `Integration_Plan.md` per the Phase 06 skeleton. Use `INC-NN` IDs, classify every dependency edge (Data/Control/Temporal/Resource), tag every interface (HW/SW-API/HMI), and produce a coverage table with one row per ICD-NN mapping to a stub/driver/mock and its replacement increment. Reference the canonical CI/CD tool table; do not copy the worked example's numbers."
- **Coverage check (GENERATION) —** "Cross-check: list every ICD-NN in `ICD.md`, then every ICD-NN in my stubs/drivers/mocks table. Report any ICD-NN missing from the coverage table or any table row with no matching ICD."
- **Critique / red-team —** "Red-team this integration plan. Where will a Boeing-787-style failure hide — a mismatched data standard at an interface, a vendor component that won't meet its ICD, a big-bang seam with no fault isolation, a HIL rig deferred to launch, or an exit criterion that isn't machine-decidable? For each, name the ICD-NN/INC-NN and the fix."
- **CDR readiness challenge —** "Act as the CDR chair. Given this plan, is the product baseline really freezable? Check: every ICD-NN frozen, HIL coverage vs target, any open S1/critical RSK/HAZ, TPM margins. List blockers and a Proceed / Proceed-with-actions / Hold recommendation."

## Research & specialised-agent triggers

- **Recommend WEB RESEARCH when:** a domain conformance suite or interface standard is in play (find the current named conformance tool and version, e.g. a protocol test suite); a vendor/COTS component's interface contract or firmware capability must be confirmed against its datasheet; you need the current capability/limits of a CI/CD or HIL platform (dSPACE, NI VeriStand, Speedgoat, Argo CD); or a safety standard's HIL/integration-test expectations apply (ISO 26262, IEC 61508, IEC 62304, DO-178C). Use Context7 MCP for CI/CD-tool and SDK/API documentation.
- **Spawn a SPECIALISED AGENT when:** generating contract tests/mocks from an OpenAPI or Protobuf schema (code-generation agent); computing dependency out-degree and detecting cycles across a large component graph (analysis agent); or scaffolding per-tier pipeline YAML from the canonical tool table (CI-config agent). For safety-relevant HIL, recommend a safety-engineering reviewer.

## Cross-cutting hooks

This phase **consumes and feeds** these of the 8 threads (link each thread file in [`../../cross-cutting/`](../../cross-cutting/)):

- **Configuration Mgmt** *(feeds)* — freezing ICDs at CDR sets the **product baseline**; every post-CDR interface change routes through `CR-NN` (Phase 09). IEEE 828. → `Configuration_Management.md`.
- **Risk & Opportunity** *(feeds/consumes)* — integration risks (`RSK-NN`: vendor firmware regression, cert slip, network variability) are logged and reviewed at CDR. → [`../../cross-cutting/Risk_and_Opportunity_Management.md`](../../cross-cutting/Risk_and_Opportunity_Management.md).
- **Safety / RAMS** *(consumes)* — `HAZ-NN` set the rigor and coverage of safety-relevant HIL rigs; open critical hazards block CDR. → [`../../cross-cutting/Safety_RAMS_Engineering.md`](../../cross-cutting/Safety_RAMS_Engineering.md).
- **Security** *(feeds)* — the SCA/SBOM pipeline stage emits the SBOM and gates on CVEs, feeding the threat model / supply-chain controls. → [`../../cross-cutting/Security_Engineering.md`](../../cross-cutting/Security_Engineering.md).
- **Measurement (MOE/MOP/TPM)** *(feeds)* — increment exit criteria and HIL results update `TPM-*` margins reported at CDR. → [`../../cross-cutting/Measurement_MOE_MOP_TPM.md`](../../cross-cutting/Measurement_MOE_MOP_TPM.md).
- **Cost/Schedule** *(consumes)* — increment durations and HIL rig lead-times feed the schedule/EVM; HIL is a budget line. → [`../../cross-cutting/Cost_Schedule_EVM.md`](../../cross-cutting/Cost_Schedule_EVM.md).
- **Quality** *(feeds)* — CI gates (pass-rate, static-scan, contract tests) are the quality evidence reviewed at CDR. → [`../../cross-cutting/Quality_Assurance.md`](../../cross-cutting/Quality_Assurance.md).
- **HSI** *(consumes)* — HMI interface seams are integrated and verified for the human-facing tiers.

## Standards anchor

Phase 06 realises the ISO/IEC/IEEE **15288:2023 Implementation** and **Integration** technical processes (per [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) §3). It invokes **IEEE 828** (configuration/interface management — the ICD freeze at CDR establishes the product baseline) and, for safety-relevant integration and HIL, the applicable functional-safety standard: **ISO 26262** (automotive), **IEC 61508** (general functional safety), **IEC 62304** (medical software), or **DO-178C** (airborne software). Use the exact citation forms in [`../../05_Conventions.md`](../../05_Conventions.md) §9.

## Exit-gate checklist

Clear **CDR** only when all pass:

- [ ] Integration strategy chosen and justified against the dominant risk.
- [ ] Increments ordered by **dependency weight** (ranking recorded; overrides explained).
- [ ] Increments (`INC-NN`) defined — count derived from *this* project — each with observable entry/exit criteria, Pass/Fail signal, and duration.
- [ ] Every dependency edge classified **Data / Control / Temporal / Resource**.
- [ ] **Every `ICD-NN`** from Phase 04 appears exactly once in the stubs/drivers/mocks coverage table, each tagged **HW / SW-API / HMI** with a replacement increment.
- [ ] CI/CD pipeline defined **per tier**, referencing the canonical tool table; static-scan/SAST and SCA/SBOM stages present.
- [ ] HIL rig exists for every `REQ-P/O/SAF-*` needing physical measurement; safety rigor anchored to the applicable standard.
- [ ] All `ICD-NN` frozen → `Status: Baseline (CDR-approved <date>)`; **product baseline** set.
- [ ] No open **S1** defect, critical `RSK-NN`, or critical `HAZ-NN` blocks CDR; `TPM-*` margins reported.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Late integration disaster (Boeing 787 pattern). | Big-bang strategy or no ICD freeze. | Switch to Incremental + CI; freeze ICDs at CDR. |
| Increment order surfaces high-risk seams last. | Ordered by convenience, not dependency weight. | Re-rank by out-degree; integrate most-depended-upon first. |
| Mocks drift from the real interface. | Hand-written mocks not validated against the ICD. | Generate from OpenAPI/Protobuf; run contract tests in CI. |
| An interface fails at CDR nobody planned for. | An `ICD-NN` missing from the coverage table. | Enforce "every ICD-NN appears once"; run the coverage-check prompt. |
| All integration problems treated alike. | Dependency vs interface conflated. | Tag Data/Control/Temporal/Resource *and* HW/SW-API/HMI separately. |
| HIL rig only used near launch. | Rig was an afterthought; not budgeted. | Stand up HIL in Increment 1; budget rig time per increment. |
| Everything blocked on the slowest pipeline. | One mega-pipeline across tiers. | Split CI/CD per tier (firmware/cloud/mobile cadence differs). |
| Copied "5 increments" / EVCN tiers into a new project. | Treated the worked example as a template. | Derive count, tiers, and tools from this project's artifacts. |

## References

- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (`INC-NN`, `ICD-NN`), gate ladder, baselines, severity, citations (**the contract**).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — V-model pairing (06 Integration ↔ verification), 15288 process map.
- KB: [`../../../Systems-Engineering-KB/topics/15-integration-strategies/fundamentals.md`](../../../Systems-Engineering-KB/topics/15-integration-strategies/fundamentals.md) — strategies, stub/driver distinction, 4 dependency types, 3 interface types, dependency-weight heuristic, Boeing 787 case.
- [`../../worked_example/Phase_06_Integration/Integration_Plan.md`](../../worked_example/) — worked EVCN with **9** increments, dependency map, per-tier CI, HIL rigs (illustrative — do not copy its numbers).
- Related phases: `se-phase-04-architecture` (ICD source), `se-phase-05-tradeoff` (build/buy decisions), `se-phase-07-verification` (next; references this file's CI/CD table), `se-phase-09-change-config` (post-CDR ICD changes).

</supporting-info>
