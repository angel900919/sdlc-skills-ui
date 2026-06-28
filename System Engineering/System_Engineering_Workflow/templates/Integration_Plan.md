---
Document: Integration Plan — <PROJECT NAME>
Document ID: INTPLAN-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Implementation, Integration); IEEE 828; ISO 26262 / IEC 61508 / IEC 62304 / DO-178C (if safety-relevant)
Status: Draft            # Draft → In Review → Baseline (CDR-approved YYYY-MM-DD) → Superseded by vX.Y
Owner: Integration Lead
---

# Integration Plan — <PROJECT NAME>

> **Phase 06 deliverable.** Plans how implemented components are combined and tested into a working whole so a break is traceable to the piece just added, and freezes the interfaces. Exit gate: **CDR (Critical Design Review)** — ICDs frozen, product baseline set.
> All IDs (`INC-NN`, `ICD-NN`, `REQ-*`, `TC-VER-*`, `RSK-NN`, `HAZ-NN`), the gate ladder, T/I/A/D, S1–S4 severity, and baseline-status strings conform to [`../05_Conventions.md`](../05_Conventions.md) — that file is the contract; this template never redefines it.

<!-- HOW TO USE: Replace every <angle-bracket placeholder>. Resolve every TODO. Delete the rows/blocks marked "(example — delete)". Derive the increment count, dependencies, tiers, and tools from THIS project's artifacts (ICD.md, BDD.puml, SysRS.md) — do not copy a worked example's numbers. -->

System type: <software-only | hardware-only | hybrid>   <!-- decides whether §7 HIL applies -->
Lifecycle model: <Waterfall | V-Model | Spiral | Agile | Hybrid — from Phase_01 Project_Development_Plan.md>
Tiers in scope: <firmware · edge · cloud · mobile · web — from Tech_Stack_Rationale.md>

---

## 1. Strategy

| Field | Value |
|---|---|
| Chosen approach | <Incremental + CI/CD (default) · Top-Down with stubs · Bottom-Up with drivers · Big Bang · Hybrid> |
| Rationale | <why this fits the dominant risk — e.g. control-logic uncertainty → Top-Down; HW/infra is the long pole → Bottom-Up; want easiest fault isolation → Incremental + CI> |
| Lifecycle alignment | <how it sequences inside the chosen lifecycle model> |
| Placeholder approach | <stubs simulate below · drivers simulate above · mocks for peers — see §5> |

<!-- TODO: confirm the strategy with the user via a single finite-choice question; record the rationale, not just the pick. -->

---

## 2. Increment Order — Dependency-Weight Ranking

> Integrate the **most-depended-upon** components earliest so the highest-risk interactions surface while there is still schedule to fix them. Out-degree = how many other components depend on this one.

| Component | # dependents (out-degree) | Rank | Integrated in (INC-NN) |
|---|---|---|---|
| <Component A> | <n> | 1 | INC-01 |
| <Component B> | <n> | 2 | INC-02 |
| <Component C> | <n> | 3 | INC-0n |
| `<Auth Service>` *(example — delete)* | 6 | 1 | INC-01 |
| `<Telemetry Bus>` *(example — delete)* | 4 | 2 | INC-02 |

**Constraint-driven overrides:** <none | "INC-0X pulled earlier than its rank because of <vendor lead time / lab availability> — TODO: owner>

---

## 3. Increments (INC-NN)

> The increment **count is project-specific** — scale it to this system (a small project may have 3–4; a large one 9+). Do not force "5". One block per increment. Each exit criterion must be decidable by a CI job, dashboard, or HIL rig — "looks good" is not an exit criterion.

### INC-01 — <Goal: one end-to-end behaviour proven>

| Field | Value |
|---|---|
| Goal | <one end-to-end behaviour proven by this increment> |
| Components added | <BDD blocks integrated here> |
| Entry criteria | <prereqs: dependent INC-NN done · components built · the relevant ICD-NN frozen> |
| Exit criteria | <observable: REQ-F-NN verified via TC-VER-NN; ≥ <target>% pass; zero S1 defects> |
| Pass/Fail signal | <single metric or test ID — e.g. TC-VER-NN green> |
| Duration | <weeks, anchored to the Phase 01 schedule> |
| Tools | <CI job · HIL rig · contract-test tool — TODO if unknown> |

### INC-02 — <Goal>

| Field | Value |
|---|---|
| Goal | <…> |
| Components added | <…> |
| Entry criteria | <…> |
| Exit criteria | <…> |
| Pass/Fail signal | <…> |
| Duration | <…> |
| Tools | <…> |

<!-- Copy the INC block per increment. -->

#### INC-0N — `<Boot + auth happy-path end-to-end>` *(example — delete)*

| Field | Value |
|---|---|
| Goal | Device boots, authenticates, and reaches READY end-to-end. |
| Components added | `<Bootloader>`, `<Auth Service>`, `<Session Manager>` |
| Entry criteria | INC-01 done; `ICD-03` frozen; auth module built. |
| Exit criteria | `REQ-F-02` verified via `TC-VER-02`; ≥ 95% pass; zero S1. |
| Pass/Fail signal | `TC-VER-02` green in CI |
| Duration | 2 weeks |
| Tools | GitHub Actions · contract-test runner |

---

## 4. Dependency Map (Data / Control / Temporal / Resource)

> Classify **every** edge by type — a *dependency* is one component's reliance on another. Keep this distinct from the interface taxonomy in §5: they fail differently (missing/incompatible *component* vs mismatched *boundary*).

| From (A) | To (B) | Type | Description of reliance |
|---|---|---|---|
| <Component A> | <Component B> | Data | <A produces data B consumes> |
| <Component C> | <Component D> | Control | <C's state/control flow gates D's behaviour> |
| <Component E> | <Component F> | Temporal | <E must init/boot/execute before F> |
| <Component G> | <Component H> | Resource | <G and H share a finite bus/bandwidth/power rail/DB lock/memory> |
| `<Meter>` | `<Billing>` | Data | `<Meter emits kWh readings Billing consumes>` *(example — delete)* |

<!-- Optionally render as a PlantUML dependency diagram and reference it here. Flag any cycle. -->

---

## 5. Interfaces & Stubs / Drivers / Mocks Coverage

> **Every `ICD-NN` from the Phase 04 inventory appears exactly once.** A missing seam is a guaranteed integration surprise at CDR. Tag each with its interface type and the placeholder used during integration; validate mocks against the ICD (generate from OpenAPI/Protobuf where possible; run contract tests in CI).

| ICD-NN | Interface type (HW / SW-API / HMI) | Seam (A ↔ B) | Placeholder (stub / driver / mock) | Tool | Replaced in (INC-NN) |
|---|---|---|---|---|---|
| ICD-01 | <HW / SW-API / HMI> | <A ↔ B> | <stub / driver / mock> | <tool> | INC-0N |
| ICD-02 | <…> | <…> | <…> | <…> | INC-0N |
| `ICD-03` | SW-API | `<Station ↔ CSMS>` | mock | `<WireMock from OpenAPI>` | INC-04 *(example — delete)* |

<!-- TODO: cross-check — list every ICD-NN in ICD.md vs every ICD-NN here; report any seam missing from this table or any row with no matching ICD. -->

---

## 6. CI/CD Pipelines (per tier)

> **Per tier, not one mega-pipeline** — firmware, edge OS, cloud, mobile, and web have different velocities. Reference the canonical CI/CD + static-scan tool table owned by this Phase 06 SKILL (single home); pin the category, let the project confirm the specific tool. SAST and SCA/SBOM stages must be present.

| Tier | Source repo + branch model | Build artifact | Ordered stages (test gate each) | Deploy target(s) | Rollout / rollback |
|---|---|---|---|---|---|
| <firmware> | <repo · trunk/GitFlow> | <.bin / OTA pkg> | build → unit → integration → SAST → SCA/SBOM → conformance → publish | <lab/HIL → staging → pilot → prod> | <OTA staged + rollback> |
| <cloud> | <repo · branch model> | <container image> | build → unit → contract → SAST → SCA/SBOM → publish → deploy | <staging → pre-prod → prod> | <blue-green / canary> |
| <mobile / web> | <repo · branch model> | <.apk / bundle> | build → unit → E2E UI → SAST → publish | <internal → pilot cohort → store> | <staged cohort> |

<!-- TODO: name the specific tool per stage per the Phase 06 canonical table; confirm with the user. -->

---

## 7. HIL Rigs            <!-- hybrid / hardware only; delete this whole section for software-only systems -->

> **Non-optional** for any `REQ-P-*` / `REQ-O-*` / `REQ-SAF-*` needing physical measurement. Stand the rig up in Increment 1, not near launch. Anchor safety-relevant rig rigor to the applicable functional-safety standard.

### HIL-1 — <Purpose: what it exercises — sensor injection / load-power sim / network attenuation / emulator>

| Field | Value |
|---|---|
| DUT | <device under test> |
| Stimuli | <load bank / signal generator / simulator> |
| Measurement | <scope / logic analyzer / calibrated meter> |
| Automation | <Python harness / dSPACE / NI VeriStand / Speedgoat> |
| REQs covered | <REQ-P-NN, REQ-SAF-NN, …> |
| Safety rigor | <ISO 26262 ASIL-x / IEC 61508 SIL-y / IEC 62304 Class C / DO-178C DAL-z / n-a> |
| Target coverage | <% of physical-measurement REQs — TODO: confirm target> |

<!-- Copy the HIL block per rig. -->

---

## 8. Integration Risks & Mitigations

> Pre-empt the Boeing-787 failure modes: mismatched data standard at an interface, a vendor component that won't meet its ICD, a big-bang seam with no fault isolation, a HIL rig deferred to launch, an exit criterion that isn't machine-decidable. Score per Conventions §5.3 (`Likelihood × Impact`).

| RSK-NN | Risk | L×I | Affected ICD-NN / INC-NN | Mitigation | Owner |
|---|---|---|---|---|---|
| RSK-NN | <integration risk> | <L×I> | <ICD-NN / INC-NN> | <mitigation> | <owner — TODO> |
| `RSK-07` | `<Vendor firmware regression>` | 4×3 | `ICD-05 / INC-03` | `<pin version; contract test in CI>` | `<Integration Lead>` *(example — delete)* |

---

## 9. CDR Readiness

> Freezing ICDs here establishes the **product baseline** (Conventions §3). Clear CDR only when the exit-gate checklist (in the Phase 06 SKILL) fully passes.

**ICD-NN frozen at this CDR** (each → `Status: Baseline (CDR-approved <date>)`):

| ICD-NN | Seam | Frozen? | Baseline date |
|---|---|---|---|
| ICD-01 | <A ↔ B> | <yes / TODO> | <YYYY-MM-DD / TODO> |

- **HIL coverage achieved vs target:** <X% / target Y% — TODO if unknown>
- **Open critical risks blocking CDR:** <RSK-NN list | none>
- **Open critical hazards blocking CDR:** <HAZ-NN list | none>
- **TPM margins at integration:** <link to TPM_Tracker.md; summarise margins>
- **Open S1 defects:** <count — must be 0 to pass>

**Sign-off:**

| Role | Name | Decision (Proceed / Proceed-with-actions / Hold / Re-baseline / Stop) | Date |
|---|---|---|---|
| Integration Lead | <name — TODO> | <decision — TODO> | <YYYY-MM-DD> |
| CDR Chair | <name — TODO> | <decision — TODO> | <YYYY-MM-DD> |

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (§2), gates incl. CDR (§3), baselines (§3), T/I/A/D (§4), severity (§5), citations (§9). **The contract.**
- [`../skills/se-phase-06-integration/SKILL.md`](../skills/se-phase-06-integration/SKILL.md) — full method, the canonical CI/CD + static-scan tool table, and the exit-gate checklist.
- Inputs: `Phase_04_Architecture/ICD.md` · `Architecture_Description.md` · `Tech_Stack_Rationale.md` · `Phase_03_Modeling/BDD.puml` + `IBD_*.puml` · `Phase_02_Requirements/SysRS.md` + `Traceability_Matrix.md` · `Phase_05_Tradeoff/Decision_Register.md`.
