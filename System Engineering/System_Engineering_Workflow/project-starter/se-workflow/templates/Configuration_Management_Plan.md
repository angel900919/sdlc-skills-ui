---
Document: Configuration Management Plan — <PROJECT NAME>
Document ID: CMP-<PROJECT_SLUG>-v0.1
Standard: ISO 10007:2017 (+ EIA-649 / IEEE 828); ISO/IEC/IEEE 15288:2023 (Configuration & Information Management)
Status: Draft
Owner: <role — e.g. Configuration Manager>
---

# Configuration Management Plan — <PROJECT NAME>

> Blank template. Replace every `<ANGLE-BRACKET>` placeholder, resolve every `TODO:`, and delete every row marked `(example — delete)`. Conforms to [`../05_Conventions.md`](../05_Conventions.md) — cite shared conventions (IDs, gates, baselines, status strings, citations); do not redefine them.
>
> This plan defines the **four ISO 10007 CM functions** — identification, baseline management, status accounting, audits. **Change control itself is NOT re-authored here** — §4 points to [`Change_Management_Plan.md`](Change_Management_Plan.md) for the 6-step process.

---

## 1. Purpose & Scope

**Purpose.** <CM policy — keep every baseline identified, accounted for, and auditable so no one ever asks "which version is current?" without an answer.>

**Authority.** Configuration authority derives from <Phase-00 `SEMP.md` §… — who owns CM and document control>. TODO: confirm if SEMP absent.

**Scope.** <Which products, baselines, and repositories fall under configuration control.>

## 2. Configuration Identification (CM Function 1)

The **CI register** — every controlled unit gets a `CI-NN` ([`Conventions §2.3`](../05_Conventions.md)), an owner, a type, a controlling baseline, and a version scheme.

**Version & ID schemes**
- Documents: doc `vMAJOR.MINOR`.
- Build / config recipe: semver `MAJOR.MINOR.PATCH` (breaking / feature / fix — [`Conventions §6`](../05_Conventions.md)).
- Change-request series: `CR-NN`. Configuration items: `CI-NN`.

**CI register**

| CI | Item name | Type (doc / sw build / hw asm / model / dataset) | Owner | Controlling baseline (Functional/Allocated/Product) | Version |
|---|---|---|---|---|---|
| `CI-01` | <e.g. System Requirements Spec> | doc | <role> | Functional@SRR | <vX.Y> |
| `CI-02` | <e.g. Interface Control Document> | doc | <role> | Allocated@PDR | <vX.Y> |
| `CI-03` | <e.g. Build/config recipe> | sw build | <role> | Product@CDR | <semver X.Y.Z> |
| `CI-NN` | <add all controlled items: caches, datasets, models, firmware, IaC, secrets manifests> | <type> | <owner> | <baseline> | <version> |
| `CI-07` | Payment-service container image | sw build | Platform Lead | Product@CDR | 2.4.1 | *(example — delete)* |

> *Decision aid:* if losing track of its version would cause a defect, integration break, or audit finding, make it a `CI-NN`. Don't forget backups, logs, and secret stores.

## 3. Baseline Management (CM Function 2)

The three baselines from [`Conventions §3`](../05_Conventions.md). A baselined artifact's status string is exactly `Baseline (<GATE>-approved YYYY-MM-DD)` ([`Conventions §6`](../05_Conventions.md)).

| Baseline | Established at | Contains | Current version | Status |
|---|---|---|---|---|
| **Functional / Requirements** | SRR | StRS, SysRS, MOE/MOP set | <vX.Y> | TODO: `Draft` / `Baseline (SRR-approved YYYY-MM-DD)` |
| **Allocated** | PDR | Architecture, REQ→block allocation, ICD draft | <vX.Y> | TODO: `…` |
| **Product** | CDR | Frozen ICDs, detailed design, build/config recipe | <vX.Y> | TODO: `…` |

**CI → baseline roll-up:** <which `CI-NN`s roll into each baseline — reference §2>.

## 4. Configuration Change Control (CM Function 3 — pointer, not a copy)

Change control runs through the **6-step process** in [`Change_Management_Plan.md`](Change_Management_Plan.md) (Submit → Initial-Review feasibility gate → Impact Analysis → CCB → Implement & V&V → Document/Notify), with change classes A/B/C/D and the 5-question impact analysis defined there. **This plan does not duplicate those steps** — every approved change re-baselines its affected CIs (§3) and is recorded in status accounting (§5) and in [`CR_Log.md`](CR_Log.md).

## 5. Configuration Status Accounting (CM Function 4a)

The **CM ledger** answers "which version of every CI is current, and what changed since the last gate?"

| CI | Current version | Controlling baseline | Open CRs | Closed CRs | Status |
|---|---|---|---|---|---|
| `CI-01` | <vX.Y> | Functional@SRR | <CR-NN, …> | <CR-NN, …> | <Baseline / In Review> |
| `CI-NN` | <…> | <…> | <…> | <…> | <…> |
| `CI-01` | v1.1 | Functional@SRR | CR-014 | CR-002, CR-009 | Baseline (SRR-approved 2026-02-10) | *(example — delete)* |

- **Report cadence:** <e.g. per CCB / monthly / per gate>. TODO: confirm.
- **Report owner:** <role>. TODO: confirm.
- **Where it lives:** <repo path / tool>. TODO.

## 6. Configuration Audits (FCA + PCA at PRR)

Both audits run at **PRR** ([`Conventions §3`](../05_Conventions.md)). Each discrepancy becomes a `CR-NN`.

| Audit | Question it answers | Verifies | Owner | Entry criteria | Discrepancy path |
|---|---|---|---|---|---|
| **FCA** (Functional Configuration Audit) | *Did we build it to spec?* | Achieved performance meets the requirements/functional baseline; every `REQ-*` has closed V&V evidence (`TC-VER-*` / `TC-VAL-*`) | <role> | <V&V complete; matrix at 100% coverage> | each finding → `CR-NN` |
| **PCA** (Physical Configuration Audit) | *Does as-built match as-documented?* | The as-built product matches its product-baseline docs (build recipe, ICDs, BOM, design docs) | <role> | <product baseline frozen; build manifest available> | each finding → `CR-NN` |

> *Aid:* functional shortfall (doesn't meet a `REQ-*`) → **FCA**. As-built ≠ as-documented (wrong part, stale ICD) → **PCA**.

## 7. Tooling & Repositories

| Concern | Tool / location | Notes |
|---|---|---|
| Version control + baseline tags | <Git + `baseline-vX.Y` tags> | TODO: select |
| CI register / status-accounting ledger | <tool / repo path> | TODO |
| Document control | <Confluence / repo> | TODO |
| Immutable / regulator exports | <location> | TODO: if regulated |

## 8. Standards Anchor

| Concern | Canonical citation ([`Conventions §9`](../05_Conventions.md)) |
|---|---|
| Configuration management | **ISO 10007:2017** (+ EIA-649 / **IEEE 828**) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** |
| Quality / audit basis (FCA/PCA) | **ISO 9001:2015** |
| Domain change/config clauses (as applicable) | <DO-178C §SCM · ISO 26262 Part 8 · IEC 62304 §8 — keep only what applies> |

---

*Gate this plan supports:* **Baselines current** ([`Conventions §1`](../05_Conventions.md)). All open items are named `TODO`s with an owner and due date.
