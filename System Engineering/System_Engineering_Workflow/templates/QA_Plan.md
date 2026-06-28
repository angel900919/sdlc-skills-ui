---
Document: Quality Assurance Plan — <PROJECT NAME>
Document ID: QAP-<PROJECT_SLUG>-v0.1
Standard: ISO 9001:2015; ISO/IEC/IEEE 15288:2023 (QA process)
Status: Draft
Owner: <QA Lead (independent of the producing team)>
---

# Quality Assurance Plan

> The living plan for asking "are we **following the right process**, and can we prove it?" across all 12 stages — process-compliance audits, a peer-review/inspection cadence, defect-trend metrics, supplier quality, and a recorded **QA sign-off at every gate**.
>
> **QA (process) ≠ V&V (product).** QA audits that the test was *run per procedure and logged* — it does **not** run `TC-VER-*`/`TC-VAL-*`. **QA ≠ CM:** CM's FCA/PCA audit *configuration consistency*; QA audits *process compliance*. Cross-reference, don't re-run.
>
> Baselined at **SRR** with the functional baseline; re-opened only via a `CR-<nn>` (Stage 09). The QA Plan is itself a `CI-*`.
> Conventions: `QA-*` follows §2 grammar (`CR-*`/`CI-*` too) · `S1`–`S4` severity §5.1 (never a QA-only scale) · Inspection = review §4 · frontmatter §6 · folder layout §10. Delete this blockquote and every `(example — delete)` row before baselining.

---

## 1. QMS, independence & cadence (set at Stage 00)

| Field | Value |
|---|---|
| Applicable QMS | `<ISO 9001:2015 / AS9100 / IATF 16949 / ISO 13485 — TODO>` |
| QA role & independence | `<QA assigned outside the producing team — name/role; ISO 9001 cl. 9.2>` |
| `QA-*` finding series | `QA-01`, `QA-02`, … (uppercase, zero-padded, stable for life) |
| Audit calendar | `<cadence + dates — TODO>` |
| Peer-review / inspection cadence | `<every artifact reviewed before Baseline status — TODO>` |
| Supplier-quality clauses | `<flowed down in the agreement — TODO>` |

---

## 2. Process-compliance audit log (`QA-*`)

> Audit actual practice against the SEMP, this workflow, and ISO 9001 clauses (esp. 9.2 internal audit, 10.2 corrective action). Distinguish a **nonconformity** (a defined requirement is unmet) from an **observation** (improvement opportunity). Each nonconformity gets a corrective action with an owner + due date. A `QA-*` that needs a baselined artifact changed becomes a `CR-<nn>`.

| `QA-<nn>` | Audit scope (process / standard clause) | Observation | Nonconformity vs Observation | Severity (S1–S4) | Corrective action (`CR-<nn>` / owner) | Due | Status |
|---|---|---|---|---|---|---|---|
| QA-01 | _(example — delete)_ `<ISO 9001 cl. 9.2 — Stage 04 design review>` | `<no review minutes on file>` | Nonconformity | `<S2>` | `CR-12` / `<role>` | `<date>` | Open |
| QA-`<nn>` | `<TODO>` | `<TODO>` | `<N/C or Obs>` | | CR-TBD | | Open |

---

## 3. Peer-review / inspection cadence

> **No artifact reaches `Baseline (...)` status without review evidence.** A defect caught in review is 10–100× cheaper than one caught in test or the field. Inspection here = a structured form of method `I` (Conventions §4), not a fifth method.

| Artifact (`CI-<nn>`) | Review type (peer / walkthrough / inspection) | Held? (date) | Reviewers | Defects found | Actions closed? |
|---|---|---|---|---|---|
| `<CI-nn — e.g. SysRS>` | Inspection | `<date>` | `<names/roles>` | `<n>` | `<Y/N>` |
| `<TODO>` | `<TODO>` | — | | | |

---

## 4. Defect-trend metrics (trended, not snapshot)

> From the Stage 08 defect log and Stage 10 incident log. Trend **across gates** — a single snapshot ("0 open defects today") hides whether escape rate is climbing. Severity uses `S1`–`S4`.

| Gate | Date | Defect density | Escape rate (post-gate / total) | Review effectiveness (% found pre-gate) | Rework | Trend (improving / decaying) |
|---|---|---|---|---|---|---|
| SRR | `<date>` | `<TODO>` | `<TODO>` | `<TODO>` | `<TODO>` | `<→>` |
| PDR | | | | | | |
| CDR | | | | | | |
| TRR | | | | | | |
| PRR | | | | | | `<zero open S1 required>` |
| ORR / GA | | | | | | |

---

## 5. Supplier-quality scorecard

> A supplier's process defect becomes yours. Require a QMS, incoming inspection, and a scorecard; flow QA clauses down in the agreement.

| Supplier | QMS confirmed? | Incoming-inspection criteria | On-time % | Defect rate | Nonconformity response | Score / status |
|---|---|---|---|---|---|---|
| `<supplier>` | `<Y/N — TODO>` | `<TODO>` | `<%>` | `<rate>` | `<TODO>` | `<TODO>` |

---

## 6. Per-gate QA sign-off

> QA produces a **recorded sign-off** at every gate: review cadence honoured, audits closed (or open with accepted risk), defect trends within bounds, supplier quality acceptable. QA can recommend **Hold** when process evidence is missing — a gate is a decision, not a formality.

| Gate | Date | Review cadence honoured? | Open `QA-*` findings | Defect trend in bounds? | Supplier quality OK? | Any artifact baselined w/o review evidence? | Sign-off (name) | Recommendation |
|---|---|---|---|---|---|---|---|---|
| MCR (01) | `<date>` | `<Y/N>` | `<count>` | n/a | n/a | `<Y/N>` | `<TODO>` | `<Proceed / Hold>` |
| SRR (02) | | `<every REQ SMART-reviewed?>` | | `<begin>` | | | | |
| PDR (04) | | `<design review held?>` | | | | | | |
| CDR (06) | | `<CI/CD gates running?>` | | | `<incoming inspection?>` | | | |
| TRR (07) | | `<V&V run per procedure?>` | | | | | | |
| PRR (08) | | `<test independence audited?>` | | `<zero open S1?>` | | | | |
| ORR / GA (10) | | `<runbook/SLO per procedure?>` | | `<incident trend OK?>` | | | | |
| DRR (11) | | `<disposal followed plan?>` | | | | | | |

---

## 7. Notes / change history

- `<YYYY-MM-DD>` — `<who>` — `<QA Plan baselined at SRR; cite CR-nn for any change to this baselined CI>`
- `TODO:` `<point to the V&V Plan (Stage 07/08) and the CM Plan (FCA/PCA) rather than duplicating them — QA audits process, not product or configuration>`

---

### References
- `05_Conventions.md` — §2 (`QA-*`/`CR-*`/`CI-*` IDs), §3 (gates & baselines), §4 (Inspection = review), §5 (`S1`–`S4` severity & priority), §6 (status & frontmatter), §8 (traceability spine), §9 (canonical citations), §10 (folder layout).
- `cross-cutting/Quality_Assurance.md` — owning thread (QA≠V&V, QA≠CM, audit/cadence/trend/supplier, gate sign-off).
- Sibling threads: `Configuration_Management.md` (FCA/PCA audit *configuration*, not *process*), `Security_Engineering.md` (shared `S1`–`S4`), `Risk_and_Opportunity_Management.md` (a residual QA finding → `RSK-*`).
- Standards: **ISO 9001:2015**, **ISO/IEC/IEEE 15288:2023** (QA + QM processes), **IEEE 1012-2016**, **INCOSE SE Handbook v5 (2023)**, **NASA/SP-2016-6105 Rev 2**; domain: AS9100 / IATF 16949 / ISO 13485.
