# Quality Assurance — the cross-cutting thread

> A **living** discipline that asks "are we **following the right process**, and can we prove it?" across all 12 stages — through process-compliance audits, a peer-review/inspection cadence, defect-trend metrics, supplier quality, and a recorded **QA sign-off at every gate**. QA is about the *process*; V&V is about the *product*.

**Why first-class:** the audit ([`00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) Part D) called for **Quality Assurance (ISO 9001 / 15288 QM)** to be promoted to a thread, and the [AI Protocol §7](../02_AI_Systems_Engineer_Protocol.md) already names the QA thread-update step ("process-compliance and review cadence honoured; QA sign-off recorded"). QA earns thread status because *every other thread can be individually correct while the system still fails* — if the process that produced them was skipped, undocumented, or unaudited. QA is the **meta-discipline**: it doesn't test the antenna, it checks that the team *ran* the verification it claimed to run, *reviewed* the design it claimed to review, and *recorded* the evidence. A single missing review or unrun audit silently weakens every gate decision downstream, so the cost of letting process compliance lapse compounds across stages — exactly why it cannot live in one phase.

---

## What it is & why it matters

Quality Assurance (QA) is the set of **planned, systematic activities** that give confidence the system is being built *the right way* — i.e. that the defined processes, standards, and conventions are actually being followed and that there is **objective evidence** of it. It answers four standing questions:

| # | QA activity | Question it answers |
|---|---|---|
| 1 | **Process-compliance audits** | *Are we doing what our plans/standards say?* (SEMP, this workflow, ISO 9001 clauses — audited, with findings logged) |
| 2 | **Peer-review / inspection cadence** | *Is every artifact reviewed before it's baselined?* (review coverage, defects-found-in-review, action closure) |
| 3 | **Defect-trend metrics** | *Is quality improving or decaying?* (defect density, escape rate, review effectiveness, rework — trended, not snapshot) |
| 4 | **Supplier quality** | *Do our suppliers' processes meet our quality bar?* (supplier QMS, incoming inspection, supplier scorecards) |

…all rolled up into a **QA sign-off recorded at every gate**.

**QA (process) ≠ V&V (product).** This is the load-bearing distinction of the thread:

| | **QA — Quality Assurance** | **V&V — Verification & Validation** |
|---|---|---|
| Asks | "Are we **following the right process**?" | "Does the **product** meet spec (V) / need (Val)?" |
| Object | The *process* and its evidence | The *system/artifact* itself |
| Defect found | A *process* gap (review skipped, step undocumented) | A *product* defect (`S1`–`S4`, fails a `REQ-*`) |
| Style | **Proactive / preventive** (audit the way of working) | **Reactive / detective** (run tests against the built thing) |
| Owned by | This QA thread; sign-off at every gate | Stage 07 (verify) & Stage 08 (validate) |

QA does **not** run `TC-VER-*`/`TC-VAL-*` — it *audits that they were run, recorded, and traced*. The classic phrasing: **V&V tests the antenna; QA checks that the antenna test was performed per procedure and the result was logged.** Likewise **QA ≠ Configuration Management**: CM's FCA/PCA at PRR audit *configuration consistency* (as-built = as-documented, every `REQ-*` verified — see [`Configuration_Management.md`](Configuration_Management.md)); QA audits *process compliance* (was the procedure followed, the review held, the standard met). QA witnesses and signs off at gates; it does not own a baseline. It matters because process defects are invisible to product testing — a perfectly passing test suite says nothing about whether the requirements were peer-reviewed or the design walkthrough ever happened.

---

## Standards anchor

Use the canonical citations from [`05_Conventions.md` §9](../05_Conventions.md) — do not restate or re-version them here:

| Concern | Canonical citation (per §9) |
|---|---|
| Quality management system (primary) | **ISO 9001:2015** — process approach, PDCA, internal audit (cl. 9.2), management review (cl. 9.3), nonconformity & corrective action (cl. 10.2) |
| SE lifecycle — Quality Assurance & Quality Management processes | **ISO/IEC/IEEE 15288:2023** (Technical-Management group: QA process; Organizational Project-Enabling group: Quality Management process) |
| V&V process QA audits against | **IEEE 1012-2016** (the V&V this thread checks for compliance, never replaces) |
| Review / inspection method basis | Formal inspection (Fagan-style) — a structured form of **Inspection (`I`)** per [§4](../05_Conventions.md), not a fifth method |
| Practitioner handbooks | **INCOSE SE Handbook v5 (2023)** (Quality Assurance & Quality Management processes), **NASA/SP-2016-6105 Rev 2** |
| Domain QMS (as applicable) | AS9100 (aerospace) · IATF 16949 (automotive) · ISO 13485 (medical devices) — sector specializations of ISO 9001 |

> **ISO 15288 separates two processes:** *Quality Management* is organizational (the QMS, framed in Stage 00); *Quality Assurance* is project-level (apply the QMS, audit compliance, sign off gates) — this thread operates the **QA** process and routes the QM policy from Stage 00. Defect *severity* reuses the project `S1`–`S4` taxonomy ([§5.1](../05_Conventions.md)); **do not** invent a QA-only severity scheme.

---

## The living artifact

The thread is operated through the **`QA_Plan.md`** (surfaced in `_cross_cutting/` per [`05_Conventions.md` §10](../05_Conventions.md)), plus a continuously-updated **audit log**, **review-cadence record**, and **defect-trend dashboard** that this thread keeps alive across all stages.

- **ID grammar:** a quality finding / nonconformity is **`QA-<nn>`** — uppercase, hyphenated, zero-padded two-digit sequence (`QA-01`, never `QA-1`), **stable for the life of the project** (retire with a `(deprecated)` note, never renumber), following the [`§2`](../05_Conventions.md) identifier rules. A finding whose corrective action is not yet assigned links to `CR-TBD` until raised ([§2.4](../05_Conventions.md) placeholder rule). A `QA-*` that requires changing a baselined artifact becomes a `CR-<nn>` (Stage 09).
- **Defect severity** reuses **`S1`–`S4`** ([§5.1](../05_Conventions.md)); finding priority uses High/Medium/Low ([§5.2](../05_Conventions.md)) — never a QA-only scale.
- **Grammar of an audit-finding row:** `QA-<nn> | audit scope (process / standard clause) | observation | nonconformity vs. observation | severity (S1–S4) | corrective action (CR-<nn> / owner) | due | status`.
- **Grammar of a review-cadence row:** `artifact (CI-<nn>) | review type (peer / walkthrough / inspection) | held? (date) | reviewers | defects found | actions closed?`.
- **Where it lives:** `_cross_cutting/QA_Plan.md` in the project instance (per [§10](../05_Conventions.md)); the defect-trend metrics feed from Stage 08's defect log and Stage 10's incident log. The `QA_Plan` is itself a `CI-*`.
- **Template:** [`../templates/QA_Plan.md`](../templates/QA_Plan.md) (blank: `QA-*` audit-finding table, review-cadence schedule, defect-trend metric stubs, supplier-quality scorecard, per-gate QA sign-off block).
- **Status & versioning:** carries the standard frontmatter ([§6](../05_Conventions.md)); the QA Plan is baselined at **SRR** with the functional baseline and re-opened only via a `CR-<nn>` (Stage 09).

---

## Lifecycle touchpoints

QA is alive in every stage; at each it audits compliance, checks the review cadence, trends defects, and prepares the gate sign-off (loop step 7 of the [AI Protocol §7](../02_AI_Systems_Engineer_Protocol.md): *"process-compliance and review cadence honoured; QA sign-off recorded"*).

| Stage | What the QA thread does |
|---|---|
| **00 Agreement** | Establish the QMS in the SEMP: which QMS applies (**ISO 9001** if any, AS9100/IATF 16949/ISO 13485 for domain), QA roles & independence, review cadence, audit schedule, the `QA-*` finding series. Capture supplier-quality clauses in the agreement. QA Plan stub created. |
| **01 Concept** | Audit that problem-space artifacts (`Stakeholder_Mission`, `StRS`, `OpsCon`, `Feasibility_Study`) were peer-reviewed before MCR; check the lifecycle-model choice is recorded with rationale. First process-compliance spot-check. |
| **02 Requirements** | Audit that every `REQ-*` passed SMART **review** (Inspection per §4), elicitation method recorded, traceability complete; QA Plan **baselined at SRR**. Review-effectiveness metric begins (defects found in requirements review). |
| **03 Modeling** | Audit model-coverage process: were the 7 diagrams reviewed, orphans checked, coverage matrices kept current? Inspection cadence on `.puml` artifacts. |
| **04 Architecture & Design** | Audit the architecture/design review (was a structured design review held before PDR?); check `DEC-*` rationale exists; confirm ICD-draft review evidence. QA sign-off gates PDR. |
| **05 Trade-off & Decision** | Audit that every `DEC-*` has a documented basis, that `DM-*` arithmetic was independently checked (the audit's P0 finding — *recompute, don't trust*), and sensitivity analysis was actually performed. |
| **06 Integration** | Audit CI/CD quality gates exist and run; review cadence on increment artifacts (`INC-*`); confirm supplier-delivered components passed incoming inspection. QA sign-off gates CDR. |
| **07 Verification** | **Audit that V&V was performed *per procedure*** — every `TC-VER-*` run, evidence logged, method (T/I/A/D) matched, no coverage gap papered over. QA checks the *process*, Stage 07 owns the *result*. QA sign-off gates TRR. |
| **08 Validation** | Audit test independence and that **Actual-Result / Pass-Fail** fields are filled; defect-trend metrics (density, escape rate, rework) trended toward PRR; confirm zero open `S1`. QA sign-off gates PRR. |
| **09 Change & Config** | Audit that every change followed the CCB process; nonconformities (`QA-*`) needing a baseline change are raised as `CR-*`; corrective-action closure tracked. QA and CM run side-by-side (process vs. configuration). |
| **10 Operations & Continuous Validation** | Trend operational defects/incidents (`S1`–`S4`); audit that runbooks (`RB-*`) and SLO-breach responses follow procedure; periodic QMS surveillance audit; feed escapes back as corrective actions. QA sign-off gates ORR. |
| **11 Disposal** | Audit that the disposal process (sanitization, environmental, archival) follows plan; capture lessons-learned and QMS-improvement actions for the knowledge base. QA sign-off gates DRR. |

---

## Method / activities

1. **Plan the QMS & cadence (Stage 00).** Name the applicable QMS (ISO 9001 / domain), assign QA with **independence** from the producing team, and schedule the audit calendar and review cadence. Define the `QA-*` finding series and the gate sign-off block.
2. **Run process-compliance audits.** On a defined cadence and before each gate, audit the team's actual practice against the SEMP / this workflow / ISO 9001 clauses. Record each gap as a `QA-<nn>` finding — distinguish a **nonconformity** (a defined requirement is unmet) from an **observation** (improvement opportunity). Each nonconformity gets a **corrective action** with an owner and due date (ISO 9001 cl. 10.2).
3. **Enforce the peer-review / inspection cadence.** Require every artifact to be peer-reviewed (Inspection per §4) **before it is baselined** — no artifact reaches `Baseline (...)` status without review evidence. Track review coverage, defects-found-in-review, and action closure. *Heuristic:* a defect caught in review is 10–100× cheaper than one caught in test or the field.
4. **Trend defect metrics.** From the Stage 08 defect log and Stage 10 incident log, trend **defect density**, **escape rate** (defects found post-gate / total), **review effectiveness** (% found before vs. after the relevant gate), and **rework**. Trend over time — a single snapshot hides whether quality is decaying.
5. **Manage supplier quality.** For each supplier, confirm a QMS, define incoming-inspection criteria, and keep a scorecard (on-time, defect rate, nonconformity response). Flow QA requirements down into the supply agreement (Stage 00).
6. **Sign off at every gate.** Produce a recorded **QA sign-off** at each gate: review cadence honoured, audits closed (or open with accepted risk), defect trends within bounds, supplier quality acceptable. QA can recommend **Hold** when process evidence is missing — a gate is a decision, not a formality ([Overview §6](../01_Workflow_Overview.md)).
7. **Close the loop (corrective action / PDCA).** Drive every `QA-*` finding to closure; feed systemic findings into management review (ISO 9001 cl. 9.3) and the lessons-learned that reach Disposal. Plan-Do-Check-Act, continuously.

---

## Gate-review questions

Ask these of the QA thread at each gate (full ladder in [`05_Conventions.md` §3](../05_Conventions.md)); QA produces a recorded **sign-off** at every gate.

- **ATP (00):** Is the QMS named, QA assigned with **independence**, the audit calendar and review cadence defined, the `QA-*` series and supplier-quality clauses in place?
- **MCR (01):** Were problem-space artifacts peer-reviewed before sign-off? Is the lifecycle-model choice recorded with rationale? Any open process nonconformity?
- **SRR (02):** Did every `REQ-*` pass a recorded SMART **review**? Is the QA Plan baselined? Is review-effectiveness being measured from here on?
- **PDR (04):** Was a structured **design review** held with evidence? Does every `DEC-*` have a documented basis? Any open `QA-*` nonconformity blocking sign-off?
- **CDR (06):** Are CI/CD quality gates running? Did supplier-delivered items pass incoming inspection? Is the increment review cadence honoured?
- **TRR (07):** Can QA confirm the V&V **process** was followed — every `TC-VER-*` run per procedure, evidence logged, method matched, no coverage gap hidden? (QA audits the process; Stage 07 owns the result.)
- **PRR (08):** Are defect trends within bounds (density, escape rate, rework)? Is test independence audited and Actual-Result/Pass-Fail recorded? **Zero open `S1`?** Are all `QA-*` corrective actions closed or risk-accepted?
- **ORR / GA (10):** Is the operational defect/incident trend acceptable? Do runbook/SLO responses follow procedure? Is the QMS surveillance audit current?
- **DRR (11):** Did disposal follow plan? Are lessons-learned and QMS-improvement actions captured?
- **Every gate:** Is there a **recorded QA sign-off**? Any artifact baselined **without** review evidence? Any `QA-*` finding overdue or silently closed without corrective action?

---

## AI prompt pack

Copy-paste; replace bracketed slots. Keep the AI on the conventions — make it cite `QA-*`/`CR-*`/`CI-*` IDs and the `S1`–`S4` severity, never invent a QA-only scale, and never conflate process (QA) with product (V&V).

**1 — Process-compliance audit:**
> "Act as an independent QA auditor. Audit this stage's artifacts `[paste]` against the SEMP, this workflow, and **ISO 9001:2015** (esp. cl. 9.2 internal audit, 10.2 corrective action). For each gap, output a `QA-<nn>` finding per `05_Conventions.md §2`: scope, observation, classify **nonconformity vs. observation**, severity (`S1`–`S4` per §5.1), and a corrective action with owner+due. Do not test the product — check only whether the *process* was followed and evidenced. List anything baselined without review evidence."

**2 — Review-cadence & defect-trend report:**
> "From this review log and defect log `[paste]`, build the QA dashboard: review coverage (% of `CI-*` peer-reviewed before baseline), defects-found-in-review, **review effectiveness** (% found pre-gate), defect density, escape rate, and rework — **trended over the gates so far**, not a snapshot. Flag any decaying trend and any artifact at `Baseline (...)` status with no review record. Use `S1`–`S4` for severity."

**3 — Draft the QA Plan:**
> "Draft `QA_Plan.md` per the template: the QMS (ISO 9001 / domain), QA independence, the process-audit calendar, the peer-review/inspection cadence, defect-trend metrics, supplier-quality scorecards, and a per-gate QA sign-off block. Point to the V&V Plan (Stage 07/08) and Configuration Management Plan (FCA/PCA) rather than duplicating them — QA audits *process*, not *product* or *configuration*. Use the §6 frontmatter and mark every unknown `TODO: <owed by>`."

**4 — Critique / red-team (adversarial):**
> "Red-team this QA discipline `[paste]`. Find where QA has silently become V&V (auditing the product instead of the process), where a gate was signed off without review evidence, where a `QA-*` finding was closed with no corrective action, where defect metrics are a snapshot hiding a decaying trend, and where supplier quality is asserted but unevidenced. Check QA isn't duplicating CM's FCA/PCA. Cite IDs; assume the team marked itself compliant."

---

## Common pitfalls

- **Conflating QA with V&V.** The load-bearing error: QA audits the *process* ("was the test run per procedure and logged?"), V&V tests the *product* ("does it meet spec?"). A green test suite says nothing about whether the design was ever reviewed. Keep the records and the questions distinct.
- **QA without independence.** A team auditing its own compliance rubber-stamps. ISO 9001 cl. 9.2 requires auditors not audit their own work — assign QA outside the producing team.
- **Review cadence skipped under schedule pressure.** The first thing cut when late, the most expensive omission. Make "peer-reviewed with evidence" a hard precondition for `Baseline (...)` status — no review, no baseline.
- **Snapshot metrics instead of trends.** "0 open defects today" hides that escape rate is climbing. Trend density, escape rate, review effectiveness, and rework *across gates*.
- **Findings logged but never closed.** A `QA-*` with no corrective action, owner, or due date is theatre. Drive every nonconformity to closure (ISO 9001 cl. 10.2); track overdue actions at every gate.
- **Ignoring supplier quality.** A supplier's process defect becomes yours. Require a supplier QMS, incoming inspection, and a scorecard; flow QA clauses down in the agreement.
- **Duplicating CM's FCA/PCA.** QA audits *process compliance*; CM's FCA/PCA at PRR audit *configuration consistency* (as-built = as-documented). Cross-reference, don't re-run.
- **Treating the gate sign-off as a formality.** QA sign-off is a decision input. When review/audit evidence is missing, QA recommends **Hold** — it does not sign to keep the schedule.

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — **the contract**: §2 IDs (`QA-*` follows the §2 grammar; `CR-*`/`CI-*`), §3 gates & baselines, §4 T/I/A/D (Inspection = review), §5 `S1`–`S4` severity & priority, §6 status & frontmatter, §8 traceability spine, **§9 canonical citations**, §10 folder layout.
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — the 12-stage spine, V-model, 15288 mapping (Quality Management / Quality Assurance processes), the 8 cross-cutting threads; §6 "a gate is a decision, not a formality."
- [`../02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) — per-stage loop; thread-update step 7 (Quality: "process-compliance and review cadence honoured; QA sign-off recorded").
- [`../00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) — Part A (per-stage findings, incl. the P0 "recompute, don't trust" arithmetic gap QA guards), Part D origin of this thread ("**Quality Assurance (ISO 9001 / 15288 QM)**").
- Sibling threads: [`Configuration_Management.md`](Configuration_Management.md) (FCA/PCA audit *configuration*, not *process* — QA ≠ CM), [`Security_Engineering.md`](Security_Engineering.md) (shared `S1`–`S4` taxonomy), Risk & Opportunity Management (a residual QA finding can become an `RSK-*`).
- Operated-by stages: [`../skills/se-phase-00-agreement/SKILL.md`](../skills/se-phase-00-agreement/SKILL.md) (QMS framing, QA cadence), [`../skills/se-phase-07-verification/SKILL.md`](../skills/se-phase-07-verification/SKILL.md) & [`../skills/se-phase-08-validation/SKILL.md`](../skills/se-phase-08-validation/SKILL.md) (the V&V whose *process* QA audits).
- Template: [`../templates/QA_Plan.md`](../templates/QA_Plan.md) (blank, fill-in).
- KB: [`Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md`](../../Systems-Engineering-KB/topics/04-se-tools-techniques/fundamentals.md) — V&V via "testing, simulation, and **reviews**"; the verification-vs-validation distinction QA layers process audit on top of.
- Standards (canonical forms in §9): **ISO 9001:2015** · **ISO/IEC/IEEE 15288:2023** (QA + QM processes) · **IEEE 1012-2016** · **INCOSE SE Handbook v5 (2023)** · **NASA/SP-2016-6105 Rev 2** · domain: AS9100 / IATF 16949 / ISO 13485.
