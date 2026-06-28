# Safety, Reliability, Maintainability & Availability (RAMS)

> The living thread that proves the system **won't hurt anyone** and **keeps working** — hazards are found, mitigated, and traced from concept to disposal, and reliability/availability/maintainability are *allocated as requirements*, not hoped for.

**Why it's first‑class:** safety and dependability are emergent properties of the *whole* system; they cannot be bolted on at the end or owned by a single phase. A hazard missed at Concept costs ~10× to mitigate at Verification and may be unfixable in Operations. So RAMS runs as a horizontal thread — alive in every stage, reviewed at every gate (see [Workflow Overview §1](../01_Workflow_Overview.md)) — and folds its evidence into a **safety case** at Phase 7 and the **PRR** gate.

---

## What it is & why it matters

RAMS bundles four coupled dependability attributes plus the safety discipline that ties them together:

- **Safety** — freedom from unacceptable risk of harm (to people, property, environment). Driven by *hazard analysis*: identify hazards, assess their risk, drive it to acceptable, and **prove** you did.
- **Reliability** — probability the system performs without failure for a stated time/mission (e.g. MTBF, failure rate λ). A `REQ-P-*` / `REQ-O-*` target.
- **Maintainability** — how quickly/cheaply a failure is restored (MTTR, mean time to repair, diagnosability). A `REQ-O-*` target.
- **Availability** — the fraction of time the system is up: `A = MTBF / (MTBF + MTTR)`. Falls out of the reliability + maintainability allocation; a `REQ-O-*` target.

**When do I need this thread? (the trigger.)** Activate RAMS in full when the system is **safety‑critical** (failure can cause injury, death, environmental or major property damage) **or regulated** under a functional‑safety regime (avionics, automotive, medical, industrial, rail, nuclear, energy). If neither holds, tailor it down to a reliability/availability allocation plus a lightweight hazard checklist — but **record that tailoring decision** ("tailored out: not safety‑critical, no regulatory regime"), never drop it silently. The AI must raise this at kickoff: *"Can a failure of this system hurt someone or breach a safety regulation?"* — and if yes, this thread is non‑negotiable.

---

## Standards anchor

Uses the canonical citations from [Conventions §9](../05_Conventions.md) — do not redefine, cite:

| Concern | Canonical citation (Conventions §9) |
|---|---|
| Functional safety — generic / industrial | **IEC 61508** (the umbrella standard; defines SIL 1–4) |
| Airborne software | **DO‑178C** (with DAL A–E objectives) |
| Automotive (road vehicles) | **ISO 26262** (ASIL A–D, derived via S×E×C) |
| Medical device software | **IEC 62304** (software safety classes A/B/C) |
| Hazard‑analysis techniques | **FMEA** (bottom‑up) and **FTA** (top‑down) — KB [04‑se‑tools](../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) |
| Bidirectional traceability obligation | **Conventions §8** — mandatory for DO‑178C / ISO 26262 / IEC 62304 |
| SE lifecycle frame | **ISO/IEC/IEEE 15288:2023**; **IEEE 1012‑2016** (V&V) |

> Integrity levels (SIL/DAL/ASIL/class) are the *risk‑based rigour dial*: the higher the level, the more analysis, independence, and verification each requirement demands. The exact level is **domain‑ and regulator‑set** — the AI must never invent it; it routes to research/regulator confirmation and marks `TODO: confirm integrity level`.

---

## The living artifact

The thread's spine is the **Hazard Log** — one continuously‑maintained register, the safety equivalent of the Risk Register.

- **ID grammar:** `HAZ-<nn>` — uppercase, zero‑padded two‑digit, stable for life ([Conventions §2.4](../05_Conventions.md)). A hazard is never renumbered; closed hazards are kept with a `(closed)` note for the audit trail.
- **Hazard‑driven requirements:** every mitigation that the *system* must implement becomes a `REQ-SAF-<nn>` (safety behaviour) traced back to its `HAZ-*`. Reliability/availability/maintainability targets become `REQ-P-*` / `REQ-O-*` (per [Conventions §2.1](../05_Conventions.md) — "‑ilities" live under the closest class, tagged in the statement).
- **Where it lives:** `<project-slug>/_cross_cutting/Hazard_Log.md` (see [Conventions §10](../05_Conventions.md)); FMEA/FTA worksheets sit beside it; the rolled‑up **Safety Case** lands in `Phase_07_Verification/`.
- **Template:** [`../templates/Hazard_Log.md`](../templates/Hazard_Log.md) (blank, fill‑in) and `../templates/Safety_Case.md`.

**Hazard Log row (minimum columns):**

| Field | Meaning |
|---|---|
| `HAZ-<nn>` | Stable hazard ID |
| Hazard / hazardous event | What can go wrong (the unsafe state, not the cause alone) |
| Cause(s) | Failure mode(s) leading to it (links FMEA/FTA) |
| Effect / harm | Worst‑credible consequence |
| Severity × Likelihood | Pre‑mitigation risk (reuse [Conventions §5.3](../05_Conventions.md) 5×5 banding) → integrity level if domain demands |
| Mitigation → `REQ-SAF-*` | The control(s); each owed a requirement |
| Verification → `TC-VER-*` | How mitigation is proven (T/I/A/D) |
| Residual risk / status | Post‑mitigation band; Open / Mitigated / Closed / Accepted‑by |

---

## Lifecycle touchpoints

| Stage | What this thread does |
|---|---|
| **00 Agreement** | Capture safety/regulatory obligations as `REQ-C-*`/`REQ-D-*` constraints in the agreement; name the applicable standard + who certifies; budget for independent safety assessment. Set tailoring (safety‑critical? regulated?). |
| **01 Concept** | **FHA — Functional Hazard Analysis.** Identify hazards from functions in the OpsCon; seed `HAZ-*`; set safety goals; feed `MOE-*` (safety effectiveness). Feasibility must cover *certifiability*. |
| **02 Requirements** | Derive `REQ-SAF-*` from each `HAZ-*`; allocate reliability/availability/maintainability as `REQ-P-*`/`REQ-O-*` (MTBF/MTTR/availability targets) with MOP/TPM. Seed T/I/A/D method per safety REQ. |
| **03 Modeling** | Represent hazards/safety REQs in the Requirements diagram; model failure/degraded states in the State‑Machine diagram; use `derive`/`satisfy`/`verify` links so every `HAZ-*` traces to a block and a test. |
| **04 Architecture** | **PHA/SHA — Preliminary/System Hazard Analysis** on the chosen architecture: redundancy, fail‑safe/fail‑operational, partitioning, independence/common‑cause. Allocate reliability budget across blocks; freeze safety‑relevant interfaces in the ICD. Feeds **PDR**. |
| **05 Trade‑off** | Safety + availability are weighted criteria in `DM-*`; every architecture trade that touches a hazard records its safety impact in the `DEC-*` rationale. No option chosen on cost alone if it raises residual risk. |
| **06 Integration** | Order increments so safety functions integrate/test early; HIL/fault‑injection for safety‑relevant interfaces; verify no integration introduces a new common‑cause path. Feeds **CDR** (safety‑relevant ICDs frozen). |
| **07 Verification** | Execute `TC-VER-*` for every `REQ-SAF-*`; reliability demonstrated by analysis/test; **assemble the Safety Case** (claim → argument → evidence) for **TRR**. Confirm bidirectional `HAZ→REQ-SAF→TC-VER` traceability is complete. |
| **08 Validation** | Validate safety goals against real operational need (the OpsCon hazards), not just the spec; FAT/SAT include safety scenarios. **PRR** requires zero open S1 and an accepted Safety Case. |
| **09 Change/Config** | Every `CR-*` runs a **safety impact analysis**: does it touch a `HAZ-*`, a `REQ-SAF-*`, or a reliability allocation? If yes, re‑open the affected hazard and re‑verify. Hazard Log is a baselined CI. |
| **10 Operations** | **FRACAS** — Failure Reporting, Analysis & Corrective Action System: field failures feed back, update λ/MTBF/MTTR estimates vs. allocation, reopen hazards on new failure modes. Availability tracked as an `SLO-*`; safety runbooks `RB-*`. |
| **11 Disposal** | Decommissioning hazards (stored energy, hazardous materials, residual data‑safety); the Safety Case must cover safe shutdown/removal; archive the Hazard Log + FRACAS history as lessons learned. Feeds **DRR**. |

---

## Method / activities

1. **FHA (Concept, Stage 01).** Walk each system function; ask "what if it fails / is lost / misbehaves / activates inadvertently?" Record hazards as `HAZ-*`, assess worst‑credible severity, set safety goals.
2. **PHA → SHA (Design, Stages 04–06).** Refine concept hazards against the *actual* architecture. Use **FTA** (top‑down: undesired top event → AND/OR gates → basic causes) to find combinations and common‑cause failures; use **FMEA** (bottom‑up: each component failure mode → local → system effect) to ensure no single point of failure is missed. The two are complementary — FTA finds *cut sets*, FMEA finds *coverage gaps*.
3. **RAM allocation.** Set a top availability target, then allocate MTBF (reliability) and MTTR (maintainability) budgets across blocks so `A = MTBF/(MTBF+MTTR)` meets it. Each becomes a `REQ-P-*`/`REQ-O-*` with a MOP and, if gate‑critical, a TPM tracked through 06–10.
4. **Mitigation → requirement → verification.** Every accepted mitigation becomes a `REQ-SAF-*`, assigned a T/I/A/D method, traced forward to a `TC-VER-*` and backward to its `HAZ-*` (bidirectional, per Conventions §8).
5. **Safety Case (Stage 07).** A structured argument — *Claim* (system is acceptably safe) → *Argument* (every hazard mitigated to residual‑acceptable) → *Evidence* (analyses, test reports, traceability). Folded into TRR and accepted at **PRR**.
6. **FRACAS (Stage 10).** Closed‑loop field feedback: report → analyse root cause → corrective action → verify → update Hazard Log + reliability estimates.

---

## Gate‑review questions

- **MCR (01):** Is there an FHA? Are safety goals defined? Is the system **certifiable** under the named regime, and is that in the feasibility study?
- **SRR (02):** Does every `HAZ-*` trace to at least one `REQ-SAF-*`? Are availability/MTBF/MTTR allocated as testable `REQ-P-*/O-*` with thresholds (no adjectives)?
- **PDR (04):** Has PHA/SHA been run on *this* architecture? Any single point of failure or common‑cause path? Is the reliability budget allocated across blocks and within margin?
- **CDR (06):** Are safety‑relevant ICDs frozen? Do integration increments test safety functions early? Is HIL/fault‑injection planned for every safety interface?
- **TRR (07):** Is the Safety Case assembled with evidence? Is `HAZ→REQ-SAF→TC-VER` traceability 100% and **bidirectional**? Any safety REQ with no verification method?
- **PRR (08):** Zero open S1 hazards? Residual risk accepted *by name*? Reliability/availability demonstrated ≥ target? Safety Case signed by the independent assessor?
- **ORR/GA (10):** Is FRACAS live? Are availability SLOs and safety runbooks in place? Is there a path to re‑open a hazard on a field failure?
- **DRR (11):** Are decommissioning hazards analysed and mitigated? Does the Safety Case cover safe disposal?

---

## AI prompt pack

**1 — Run an FHA from the function list (Stage 01):**
```
Act as a safety engineer. Here is the OpsCon function list for <system>: <paste>.
For each function, identify hazards using the guidewords lost / erroneous / inadvertent /
degraded / late. Output a Hazard Log table with columns: HAZ-<nn>, function, hazard,
worst-credible effect, severity (S1–S4), candidate mitigation. Do not invent integrity
levels — flag where a regulator must set them as TODO.
```

**2 — Allocate reliability/availability as requirements (Stage 02):**
```
Top-level availability target is <e.g. 99.9%>. Given these blocks <list> in <series/parallel/
redundant> configuration, allocate an MTBF and MTTR budget per block so the system meets the
target using A = MTBF/(MTBF+MTTR). Express each as a REQ-O-/REQ-P- statement with a measurable
threshold and a MOP. Show the math; state every assumption explicitly.
```

**3 — FMEA + FTA cross‑check (Stages 04–06):**
```
For hazard <HAZ-nn>, build (a) an FTA from the top event down to basic causes with AND/OR gates
and the minimal cut sets, and (b) an FMEA for the involved components. Then reconcile: list any
failure mode in the FMEA that is missing from the FTA, and any single point of failure. Recommend
mitigations and the REQ-SAF-* each would create.
```

**4 — Red‑team the Safety Case (critique, Stage 07/PRR):**
```
You are a hostile independent safety assessor at PRR. Attack this Safety Case: <paste claim,
argument, evidence + Hazard Log>. Find: hazards with weak or missing evidence, mitigations
asserted but never verified (satisfy without verify), broken backward traceability, optimistic
severity/likelihood scoring, and unstated common-cause assumptions. Rank findings by severity and
say which would block the gate.
```

---

## Common pitfalls

- **Treating safety as a phase, not a thread.** "We'll do the hazard analysis before release" — by then the architecture is frozen and mitigations are 10× more expensive. Start the FHA at Concept.
- **`satisfy` mistaken for `verify`.** A design *claiming* to mitigate a hazard is an assertion, not proof ([Conventions §7](../05_Conventions.md)). Every `REQ-SAF-*` needs a `TC-VER-*`.
- **Broken backward traceability.** Forward `HAZ→REQ→test` is built; the backward direction (test→…→hazard) is neglected — yet it's *mandatory* for DO‑178C/ISO 26262/IEC 62304 (Conventions §8) and is what proves no hazard was forgotten.
- **Inventing the integrity level.** SIL/DAL/ASIL/class is regulator‑ and analysis‑set. Guessing it is a correctness failure — route to research, mark `TODO`.
- **Allocating availability without maintainability.** A high‑MTBF design with a 3‑day MTTR can still miss the availability target. Allocate both; availability is the *ratio*.
- **FMEA without FTA (or vice‑versa).** FMEA alone misses multi‑failure cut sets and common cause; FTA alone misses single‑point coverage. Use both.
- **Closing hazards at release and forgetting FRACAS.** Field failures reveal failure modes no analysis predicted. Without a closed loop, the Hazard Log goes stale and the safety case decays.
- **No safety impact analysis on changes.** A `CR-*` that quietly touches a `REQ-SAF-*` can invalidate the safety case. Every change is screened against the Hazard Log in Stage 09.

---

## References

- [Conventions](../05_Conventions.md) — §2.1 (`SAF`/`P`/`O` classes), §2.4 (`HAZ-<nn>`), §5 (severity), §7 (satisfy vs verify), §8 (bidirectional traceability), §9 (standard citations), §10 (folder layout).
- [Workflow Overview](../01_Workflow_Overview.md) — the 12‑stage spine, the V‑model, cross‑cutting threads.
- [AI Systems Engineer Protocol §7](../02_AI_Systems_Engineer_Protocol.md) — keeping threads alive; §4 — "security/safety later" challenge.
- [Skills Audit Report Part D](../00_Skills_Audit_Report.md) — the [high] gap this thread closes (FHA→PHA/SHA, hazard log, RAM allocation, FRACAS, safety case).
- KB: [04‑se‑tools‑techniques](../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) — FMEA/FTA, risk management, V&V.
- Standards: **IEC 61508**, **DO‑178C**, **ISO 26262**, **IEC 62304**, **ISO/IEC/IEEE 15288:2023**, **IEEE 1012‑2016** (cite via Conventions §9).
- Sibling threads: [`Risk_and_Opportunity_Management.md`](Risk_and_Opportunity_Management.md), [`Security_Engineering.md`](Security_Engineering.md).
- Template: [`../templates/Hazard_Log.md`](../templates/Hazard_Log.md).
