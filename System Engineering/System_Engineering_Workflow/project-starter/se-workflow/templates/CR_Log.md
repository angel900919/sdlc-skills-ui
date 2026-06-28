---
Document: Change Request Log — <PROJECT NAME>
Document ID: CRLOG-<PROJECT_SLUG>-v0.1
Standard: ISO 10007:2017 (+ EIA-649 / IEEE 828); ISO/IEC/IEEE 15288:2023 (Configuration & Information Management)
Status: Draft
Owner: <role — e.g. Configuration Manager>
---

# Change Request Log — <PROJECT NAME>

> Blank template. The living ledger of every `CR-NN` raised against a baselined CI. Append a row per CR; never delete a row (retire a withdrawn CR with `Withdrawn` status). Replace `<ANGLE-BRACKET>` placeholders and delete the row marked `(example — delete)`.
>
> Conforms to [`../05_Conventions.md`](../05_Conventions.md): IDs `CR-NN` / `CI-NN` ([§2](../05_Conventions.md)), severity `S1–S4` ([§5.1](../05_Conventions.md)), classes A/B/C/D and the 6-step process from [`Change_Management_Plan.md`](Change_Management_Plan.md). Impact-analysis details live in `IA-NN`; this is the index.

---

## Status legend

`Submitted` → `Initial-Review` → `Impact-Analysis` → `CCB` → `Approved` / `Rejected` / `Deferred` / `Rework` → `Implementing` → `Verified` → `Closed` · (`Withdrawn`)

## Change Request Ledger

| CR | Title | Class (A/B/C/D) | Sev (S1–S4) | IA link | CCB decision | Affected CIs | Re-baselined to | Status |
|---|---|---|---|---|---|---|---|---|
| `CR-NN` | <short title> | <A\|B\|C\|D> | <S1–S4> | <IA-NN> | <Approve\|Reject\|Defer\|Rework> | <CI-NN, …> | <doc vX.Y / semver X.Y.Z> | <see legend> |
| `CR-01` | <…> | <…> | <…> | <IA-01> | <…> | <…> | <…> | <…> |
| `CR-014` | Migrate external interface to v2 | A | S2 | IA-014 | Approve (conditions) | CI-01, CI-02 | SysRS v1.1; ICD-03 v1.1 | Closed | *(example — delete)* |

## Notes & conventions

- **One row per CR.** Open the row at Submission; fill `IA link`, `Class`, and `Sev` after Impact Analysis; fill `CCB decision` after the board; fill `Affected CIs` and `Re-baselined to` at Implementation; set `Closed` after V&V + re-baseline.
- **Placeholders, never blanks.** A not-yet-assigned link is `IA-TBD` / `CI-TBD` ([`Conventions §2`](../05_Conventions.md)) — never an empty cell.
- **Class is a routing label, not a version key.** The `Re-baselined to` column is set by breaking/feature/fix, not by the class letter ([`Change_Management_Plan.md` §6](Change_Management_Plan.md)).
- **D-class audit.** Emergency CRs (class D) carry retroactive `IA-NN` and post-hoc CCB minutes within 5 business days; flag them for the <quarterly> D-class audit.
- **Cross-reference.** Per-CI current versions and open/closed CR roll-up live in the status-accounting ledger ([`Configuration_Management_Plan.md` §5](Configuration_Management_Plan.md)).
