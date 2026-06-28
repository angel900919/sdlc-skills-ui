---
name: se-phase-07-verification
description: Runs Phase 07 (Verification) of the domain-agnostic SE workflow — the "did we build it right?" half of V&V, proving the built system conforms to the SysRS spec. It is the AUTHORITATIVE step that finalises a verification method (Test / Inspection / Analysis / Demonstration) for every requirement (Phase 02 only seeds a default), assigns each a TC-VER-* case, names the verifying activity + tool + evidence home, and rolls coverage up to 100% by method. It produces Verification_Matrix.md and an integrity-level-driven V&V Plan (IEEE 1012), then drives the Test Readiness Review (TRR). Use when the user wants to build or finalise a verification matrix, assign or lock T/I/A/D methods, write a V&V plan, decide test vs inspect vs analyse vs demonstrate, plan unit/integration/system verification, wire in static-analysis/SAST/DAST conformance scans, prep for a TRR, map REQ→TC-VER, or asks "did we build it right". Triggers on phrasings like "verification matrix", "T I A D method assignment", "TC-VER", "V&V plan", "IEEE 1012", "did we build it right", "TRR / test readiness review", "REQ to test mapping", "phase 7 verification".
---

# Phase 07 — Verification

<what-to-do>

This phase proves the built system conforms to its `SysRS` spec — "did we build it **right**?" — by finalising a verification method for every requirement, producing `Verification_Matrix.md` (100% method coverage) and a `VnV_Plan.md`, and clearing the **TRR (Test Readiness Review)** gate. It is the AUTHORITATIVE T/I/A/D method-assignment step: Phase 02 only *seeds* a default; Phase 07 *settles* it. This skill conforms to [`../../05_Conventions.md`](../../05_Conventions.md) for all IDs, gates, methods, severity, baselines, and citations — it cites those, never redefines them.

## Inputs (from prior phases)
- **`Phase_02_Requirements/SysRS.md`** + `Traceability_Matrix.md` — every `REQ-<class>-<nn>`, its statement, MOP/TPM links, and the **seeded** T/I/A/D default. This is the primary input; pull all REQs. *Fallback if absent:* ask the user for the requirement list; you cannot verify what isn't specified — flag missing REQs as a TRR blocker.
- **`Phase_06_Integration/Integration_Plan.md`** — increments (`INC-<nn>`), the CI/CD pipeline, HIL/test rigs, and the **scan/tool table** that are the *executors* of verification. Reference it; do **not** re-author its tool table (Phase 06 owns the scan/tool table; Phase 07 references it — see `../se-phase-06-integration/`).
- **`Phase_04_Architecture/ICD.md`** — frozen interface rows (`ICD-<nn>`); interface REQs verify against these.
- **`Phase_03_Modeling/Requirements_Diagram.puml`** — placeholder `TC-VER-TBD` links get resolved to real IDs here.
- **`Phase_00_Agreement/SEMP.md` / Agreement** — acceptance terms and any mandated integrity/criticality level (drives the V&V Plan rigour and IV&V trigger).
- **Cross-cutting:** `TPM_Tracker.md`, `Hazard_Log.md`, `Threat_Model.md`, `Risk_Opportunity_Register.md` — safety/security/measurement REQs need method choices that match their criticality.

## Step-by-step
Interview **one topic at a time**. Reuse prior-phase facts; never re-ask what the SysRS already states. Use AskUserQuestion for the finite choices (method, integrity level). Mark anything unknown as `TODO: <who owes what>` — never invent thresholds, tools, or dates.

1. **Read inputs & confirm scope.** Load the SysRS REQ set and the Phase-02 seeded methods. Confirm the output path: `<output-dir>/<slug>/Phase_07_Verification/`. State the count of REQs to cover and which classes are present.
2. **Set the integrity / criticality level (V&V Plan driver).** *Topic 1.* Ask the system's integrity level per **IEEE 1012-2016** (or the domain equivalent — DAL for DO-178C, ASIL for ISO 26262, SIL for IEC 61508, software safety class A/B/C for IEC 62304). This single answer scales the whole plan: the depth of verification tasks, evidence rigour, independence, and whether **IV&V** is required. Reuse the criticality already recorded in Phase 00/02 if present.
3. **Finalise the T/I/A/D method per REQ (the authoritative pass).** *Topic 2, walked class-by-class (F, then U, P, O, SEC, INT, C, D, SAF).* For each REQ show its seeded method and **confirm or override** it using the cheatsheet below. Bind the choice to the requirement's *verifiability* (KB topic 06): the method is whatever actually **proves** the statement — Test for a measurable threshold you can exercise, Inspection for something provable by examining an artifact/doc/code without execution (this is where structured **Review** lives — see Decision points), Analysis for proof by calculation/model/simulation/similarity, Demonstration for operate-and-observe with no instrumentation. Combinations are allowed (`I + T`, `T + A`). Record *why* when you override the seed.
4. **Assign TC-VER IDs.** Sequentially `TC-VER-01`, `TC-VER-02`, … (Conventions §2.4). One TC per `T`-method REQ is the norm; an `I`-method topic may share one TC across a related set (e.g. one `TC-VER-30` for a TLS-config inspection). Every REQ must end with at least one `TC-VER-<nn>` — no `TC-VER-TBD` may survive this phase.
5. **Fill the verifying activity per REQ.** For each matrix row: **Method**, **Verifying Test/Activity** (short noun phrase + the TC-VER id), and **Tool** (a concrete named tool — `Saleae Logic 16`, `k6`, `OWASP ZAP`, `Yokogawa WT5000`, or `Manual + <named checklist>`; never bare "Manual"). Verification *level* (Unit→Integration→System) and *evidence location* are tracked in the V&V Plan and per-TC `result.md`, **not** as extra matrix columns (see Rules — the matrix is 5 columns).
6. **Map verification levels.** For software-heavy classes (F, P, SEC, INT) place each TC on the ladder **Unit → Integration → System**; hardware REQs usually land at System with HIL. Note the **Acceptance** column as the **verification→validation HINGE** — acceptance/UAT/FAT/SAT is a *validation* activity owned by **Phase 08**, not a verification method (Conventions §4). Name the hinge here; do not execute it here.
7. **Reference the continuous scans.** Add a short sub-section that *points to* Phase 06's scan/tool table (SAST/DAST/dependency/secrets/IaC/conformance) and states each scan's verification pass-criteria (e.g. "zero criticals"). Do not duplicate the table — cite `Phase_06_Integration/Integration_Plan.md`.
8. **Reviews & Inspections schedule.** Capture the gate ladder rows this phase touches using the canonical gate names/criteria from Conventions §3 (SRR, PDR, CDR, **TRR**, PRR) — pull dates from the project schedule; mark unknowns `TODO`. Do not restate gate pass-criteria text; cite Conventions §3.
9. **Run the coverage analysis.** Print: REQs total; verified by T / I / A / D; REQs with **no method** (must be 0); REQs with **no TC-VER** (must be 0); REQs whose tool is `TODO` (allowed but flagged). This rollup is what the TRR checks.
10. **State the necessary-but-not-sufficient caveat.** Add a one-line banner to the matrix: a 100%-covered verification matrix is **necessary but not sufficient** — it proves the spec is *covered*, not that the spec was *right* (that is Phase 08 Validation) and not that every test has *passed*. Coverage ≠ correctness ≠ validity.
11. **Write `Verification_Matrix.md` and `VnV_Plan.md`** to the shapes in *Deliverables*.
12. **Back-link the model.** With the user's confirmation, edit `Phase_03_Modeling/Requirements_Diagram.puml` to replace `TC-VER-TBD` with the real `<<verify>>` `TC-VER-<nn>` links.
13. **Check the TRR exit gate** (checklist below). If it passes, recommend `se-phase-08-validation`. If not, list the blockers as `TODO`s and hold.

## Decision points
- **Which of T / I / A / D?** Decide by *how the requirement is provable* (KB topic 06 verifiability), not by class habit. Measurable threshold you can exercise → **T**. Provable by examining an artifact/doc/code with no execution → **I**. Provable by calculation/model/simulation/similarity (often when a real test is infeasible or destructive — uptime SLA, fatigue life, extreme load) → **A**. Provable by operating and observing, no instrumentation needed → **D**. When two genuinely apply, record a combination.
- **Is "Review" a fifth method?** **No.** Per Conventions §4, a structured **Review** (requirements/design/code/test-case review, peer review, walkthrough) is a *form of Inspection* — code `I`, with the review minutes as evidence. Never invent an `R` code.
- **Is acceptance / UAT a verification method?** **No** — it is the verification→validation **hinge**, a validation activity owned by **Phase 08** (even though it reuses T/D mechanics). Name it on the levels ladder here; do not assign it a TC-VER or count it toward this phase's coverage.
- **Do we need IV&V?** Decide from step 2's integrity level: **high-criticality** (IEEE 1012 high integrity level; DAL A/B, ASIL C/D, SIL 3/4, IEC 62304 Class C, or any safety/regulated system in the Hazard Log) → require **Independent V&V** with organisational independence and a separate evidence trail; lower levels → in-team verification with peer review is sufficient. Record the call in the V&V Plan.
- **One TC or many for an `I` topic?** Group a coherent inspection set under one TC; split when the artifacts, tools, or sign-offs differ.

## Rules
- **Conform to `../../05_Conventions.md`** for every ID, gate, method code, severity, baseline, and standard citation. If anything here seems to disagree, Conventions wins — fix here.
- **The verification matrix is exactly 5 columns:** `Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool`. **Status** and **evidence path** are *not* matrix columns — Status is rolled up in the Coverage Summary and per-TC `result.md`; evidence lives under the fixed folder name **`verification-evidence/`** (one convention, aligned with the corrected worked example). Do not reintroduce `Status`/`Evidence` columns or an `evidence/` tree.
- **100% method coverage or it fails TRR.** A single REQ with no method or no TC-VER is a stop-the-line condition.
- **Phase 07 is authoritative for methods; Phase 02 only seeds.** When you override a seeded method, record the reason.
- **Name the tool.** Bare "Manual" is invalid; use `Manual + <named checklist/standard>`.
- **One topic at a time** in the interview; never dump the whole question wall.
- **Cross-reference, don't duplicate:** cite Phase 06 for the scan/tool stack, Conventions §3 for gate criteria, Phase 08 for acceptance/validation. Do **not** copy the worked example's REQ ids, tool names, thresholds, or `TC-VER-NN` numbers — they are illustrative, not your project's.
- **Verification ≠ validity ≠ pass.** Keep the necessary-but-not-sufficient caveat visible.

</what-to-do>

<supporting-info>

## Deliverables & output shapes
Blank versions live in [`../../templates/`](../../templates/) (`Verification_Matrix.md`, `VnV_Plan.md`).

### 1. `Verification_Matrix.md`
Frontmatter per Conventions §6 (`Document ID: VM-<PROJECT_SLUG>-vX.Y`, `Standard: IEEE 1012-2016`, status string). Then:
1. **Banner** — the verification question + the *necessary-but-not-sufficient* caveat + method legend (`T/I/A/D`).
2. **§1 Per-Requirement Verification** — the 5-column table:
   ```markdown
   | Req ID | Statement (abbrev.) | Method | Verifying Test/Activity | Tool |
   |---|---|---|---|---|
   | REQ-F-01 | <abbrev threshold> | T | TC-VER-01 — <activity> | <named tool> |
   | REQ-SEC-01 | <crypto/cert> | I + T | TC-VER-30 — inspect config + test enforcement | <tool> + <tool> |
   | REQ-O-01 | <availability ≥ X%> | A | TC-VER-24 — rolling SLA report | <query/tool> |
   ```
3. **§2 Verification Levels** — Unit→Integration→System per major class, with the **Acceptance** cell labelled "→ Phase 08 (validation hinge)".
4. **§3 Continuous Scans** — a pointer to Phase 06's scan table + per-scan pass-criteria (no duplicated table).
5. **§4 Reviews & Inspections** — gate rows (SRR/PDR/CDR/**TRR**/PRR) with dates; criteria cited from Conventions §3.
6. **§5 Coverage Summary** — totals + by-method counts + the two zero-must-pass rows.
7. **§6 Evidence Archive** — the `verification-evidence/` convention (below) and the per-TC `result.md`.
8. **§7 TRR Readiness** — the exit-gate checklist.

### 2. `VnV_Plan.md` (IEEE 1012-2016)
1. **Integrity level** + the standard/scheme it maps to (DAL/ASIL/SIL/IEC 62304 class) and the rationale.
2. **V&V tasks scaled to that level** (planning, requirements V&V, design V&V, implementation/test V&V, acceptance support).
3. **Independence / IV&V decision** — required-or-not + the independence basis, per the IV&V trigger above.
4. **Roles, environments, entry/exit criteria** per V&V activity; tie test environments to Phase 06's CI/CD + HIL.
5. **Method summary** — how each T/I/A/D class is executed and where evidence lands.
6. **Anomaly handling** — defects route to Phase 08 severity (`S1`–`S4`, Conventions §5.1) and to Phase 09 change control.

### Evidence archive convention (the ONE convention)
```
Phase_07_Verification/
├── Verification_Matrix.md
├── VnV_Plan.md
└── verification-evidence/
    ├── TC-VER-01/  ├─ <capture/log/report files>  └─ result.md
    ├── TC-VER-02/  └─ ...
```
Each `verification-evidence/TC-VER-<nn>/result.md` is a 1-pager: setup, observation, measured value vs threshold, pass/fail, evidence-file list, executor sign-off.

## Method choice cheatsheet
| REQ pattern | Default method | Why |
|---|---|---|
| "shall respond within N ms / N kW / N RPS" | **T** | Direct measurement against a threshold. |
| "shall achieve ≥ N% availability / MTBF / MTTR" | **A** | Long-window or statistical proof; direct test infeasible. |
| "shall comply with `<standard/reg>`" | **I** | Document/audit/SAQ inspection (a structured Review). |
| "shall use AES-256 / TLS 1.3 / signed firmware" | **I + T** | Inspect the spec/config, test the enforcement. |
| "shall support N concurrent sessions / users" | **T** | Load test. |
| "shall display in EN/ES/FR" | **I** | Per-locale UI inspection. |
| "shall meet ADA reach / physical dimension" | **I** | Physical measurement vs spec. |
| "shall survive extreme/destructive condition" | **A** | Model/simulation/similarity (test would destroy the article). |
| "shall behave correctly when operated" (no metric) | **D** | Operate-and-observe demonstration. |

## AI prompt pack
- **ELICITATION (per-class method confirmation):** "Here are the `REQ-<class>-*` requirements from the SysRS with their Phase-02 seeded T/I/A/D methods: `<list>`. For each, ask me whether the seeded method actually *proves* the statement given how it's verifiable; propose a better method (or combination) where the seed is weak, and tell me what evidence each would produce. Go one class at a time."
- **GENERATION (draft the matrix):** "From this REQ set + my confirmed methods, draft `Verification_Matrix.md` to the Phase-07 shape: 5-column per-REQ table, sequential `TC-VER-<nn>` ids, named tools, the Unit→Integration→System levels with the Acceptance cell marked as the Phase-08 hinge, a coverage summary, and the necessary-but-not-sufficient banner. Leave any unknown tool/threshold as `TODO`."
- **GENERATION (V&V Plan):** "Given integrity level `<IEEE 1012 level / DAL / ASIL / SIL>`, draft `VnV_Plan.md`: scale the V&V tasks to that level, state whether IV&V is required and the independence basis, and map each T/I/A/D class to an environment from the Phase-06 integration plan."
- **CRITIQUE / RED-TEAM:** "Red-team this verification matrix. Find: (1) REQs where the method can't actually prove the threshold; (2) compliance REQs lazily marked `T` that should be `I`; (3) 'Manual' tools with no named checklist; (4) any acceptance/UAT smuggled in as a verification TC (it belongs to Phase 08); (5) coverage that's 100% on paper but where tests would never exercise the worst case. List each as a TRR blocker."
- **CRITIQUE (independence check):** "For a `<high-criticality>` system, audit whether this V&V plan's independence is real per IEEE 1012 — is the verifier organisationally independent of the implementer, and is the evidence trail separate?"

## Research & specialised-agent triggers
- **Recommend WEB RESEARCH when:** the domain mandates a specific integrity/assurance scheme (DO-178C DAL objectives, ISO 26262 ASIL V&V work-products, IEC 62304 class tables, IEC 61508 SIL techniques) — look up the *current* objective/work-product set; a named conformance suite exists (OCPP/OCA, ISO 15118, OpenADR, USB-IF, Bluetooth SIG, FCC/CE EMC) — confirm the latest test-tool and version; or a regulator requires a specific verification artifact (FDA, FAA, UL/IEC test reports).
- **Spawn a SPECIALISED AGENT when:** (a) **safety/RAMS** — a hazard-analysis/reliability agent to confirm safety REQs map to adequate verification rigour and FRACAS; (b) **security** — a threat-model agent to confirm `REQ-SEC-*` and threats (`THR-*`) have matching verification and the scan set is sufficient; (c) **test-data/environment** — an agent to stand up and sanity-check the HIL/CI environment named in Phase 06 before TRR; (d) **standards-conformance** — an agent to map REQs to a named conformance suite's test cases.

## Cross-cutting hooks
Links live under [`../../cross-cutting/`](../../cross-cutting/).
- **Measurement (MOE/MOP/TPM)** — *consumes & feeds.* Each `MOP`/`TPM` must have a verifying TC-VER; verification results update `TPM_Tracker.md` margins, which feed TRR readiness. → `Measurement_MOE_MOP_TPM.md`.
- **Safety / RAMS** — *consumes.* Every open `HAZ-<nn>` mitigation expressed as a `REQ-SAF-*` must be verified (often `T`/`A`/`D` plus an inspection of the safety case); drives the IV&V decision. → `Safety_RAMS_Engineering.md`.
- **Security** — *consumes.* `REQ-SEC-*` and `THR-<nn>` controls verified via the Phase-06 scan stack + targeted TC-VER. → `Security_Engineering.md`.
- **Risk & Opportunity** — *feeds.* Any REQ that can't be verified before TRR, or a failed verification, raises/updates a `RSK-<nn>`. → `Risk_and_Opportunity_Management.md`.
- **Configuration Mgmt** — *consumes & feeds.* Verifies against the **product baseline** frozen at CDR; the matrix + V&V plan are themselves CIs under Phase-09 control. → `Configuration_Management.md`.
- **Quality** — *feeds.* TRR is a quality gate; coverage and evidence completeness feed `QA_Plan.md`. → `Quality_Assurance.md`.
- **Cost/Schedule** — *consumes.* Verification effort/environment cost and TRR date feed the schedule.

## Standards anchor
This phase realises the **ISO/IEC/IEEE 15288:2023 Verification** technical process. It is governed by **IEEE 1012-2016** (V&V — integrity levels, V&V tasks, independence/IV&V), draws its verifiability and SMART/method theory from **ISO/IEC/IEEE 29148:2018** (requirements) and the four-method T/I/A/D set codified in **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2**. Test documentation that the verification produces follows **ISO/IEC/IEEE 29119-3:2021** (IEEE 829 superseded). Domain integrity schemes — DO-178C, ISO 26262, IEC 62304, IEC 61508 — scale the V&V Plan when invoked. Use the exact citation forms from [`../../05_Conventions.md`](../../05_Conventions.md) §9.

## Exit-gate checklist — TRR (Test Readiness Review)
- [ ] **100%** of REQs have a finalised T/I/A/D method (zero unassigned).
- [ ] **100%** of REQs have at least one `TC-VER-<nn>` (zero `TC-VER-TBD`).
- [ ] Every method choice is justified against the requirement's verifiability; overrides of the Phase-02 seed are noted.
- [ ] Every tool is named (no bare "Manual"); unknowns flagged `TODO`.
- [ ] `VnV_Plan.md` exists; integrity level set; IV&V decision recorded.
- [ ] Test environment + data ready (per Phase 06 CI/CD + HIL); a tool dry-run done, not just naming.
- [ ] Continuous scans (Phase 06 stack) configured and passing their stated criteria.
- [ ] `verification-evidence/` structure created; per-TC `result.md` stubbed.
- [ ] Acceptance/UAT/FAT/SAT explicitly deferred to Phase 08 (not counted here).
- [ ] All blocking defects fixed; test team trained.
- [ ] Necessary-but-not-sufficient caveat stated; gate decision recorded (Proceed / Proceed-with-actions / Hold / Re-baseline / Stop).

## Common pitfalls
| Symptom | Cause | Fix |
|---|---|---|
| Some REQs have no method. | Skipped a class in the interview. | Loop back; 100% method coverage is mandatory before TRR. |
| All compliance REQs marked `T`. | Default-method bias. | Most compliance is `I` (audit/SAQ/structured review), sometimes `I + T`. |
| "Review" written as a 5th method code. | Treating review as separate from inspection. | Code it `I`; review minutes are the evidence (Conventions §4). |
| Acceptance/UAT given a `TC-VER`. | Confusing the V→V hinge with verification. | Move to Phase 08; mark the Acceptance cell as the hinge only. |
| Matrix grew Status/Evidence columns + `evidence/` tree. | Reverting to the old shape. | Keep 5 columns; Status in Coverage Summary; evidence under `verification-evidence/`. |
| 100% covered but a test would never hit the worst case. | Coverage mistaken for sufficiency. | Apply the necessary-but-not-sufficient caveat; red-team the cases. |
| Bare "Manual" tool. | Tool not actually identified. | Name the checklist/standard the inspection runs against. |
| High-criticality system, in-team verifier. | IV&V trigger missed. | Require independent V&V per the integrity level (IEEE 1012). |
| Re-listed Phase 06's scan table. | Duplicating shared conventions. | Reference Phase 06; state only pass-criteria here. |

## References
- [`../../05_Conventions.md`](../../05_Conventions.md) — IDs (§2), gates incl. TRR (§3), **T/I/A/D (§4)**, severity (§5), baselines (§3), citations (§9).
- [`../../01_Workflow_Overview.md`](../../01_Workflow_Overview.md) — the V-model pairing (Phase 02 ↔ 07), 15288 process map.
- KB: [`16-verification-validation-methods/fundamentals.md`](../../../Systems-Engineering-KB/topics/16-verification-validation-methods/fundamentals.md) — inspection/review, testing levels, acceptance hinge, FAT/SAT. KB: [`06-verifying-requirements/fundamentals.md`](../../../Systems-Engineering-KB/topics/06-verifying-requirements/fundamentals.md) — verifiability, SMART, the four methods, peer review/walkthrough.
- Worked example: `../../worked_example/Phase_07_Verification/Verification_Matrix.md` (illustrative shape — do not copy its numbers/tools).
- Related phases: `../se-phase-02-requirements/` (seeds methods, MOP/TPM), `../se-phase-06-integration/` (owns the scan/tool stack + environments), `../se-phase-08-validation/` (owns acceptance/UAT/FAT/SAT — the validation hinge), `../se-phase-09-change-config/` (anomaly routing, baselines).

</supporting-info>
