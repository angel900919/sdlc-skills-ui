---
Document: <Project> Decision Register
Document ID: DEC-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 15288:2023 (Decision Management); architecture decision records (ADR)
Status: Draft
Owner: <Lead Systems Engineer>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the Phase 05 decision register. Each `DEC-NN` is the head of an ADR (Architecture Decision
  Record) and links back to its `DM-NN` matrix and forward to the REQ(s) it serves.
- `DEC-NN` IS the ADR id (Conventions §2.3) — use the SAME two-digit sequence as the matching `DM-NN`
  in Decision_Matrices.md.
- The register is 5 columns (below). Keep each prose ADR body either inline under §2 or as a separate
  file `adr/DEC-NN-<slug>.md`.
- A baselined decision (at PDR/CDR) changes only through a `CR-NN` (Phase 09).
- All IDs (DEC-NN, DM-NN, REQ-*, RSK-NN) and statuses come from ../05_Conventions.md — cite, don't redefine.
-->

# <Project> — Decision Register

## 1. Register (5-column, ADR-linked)

| DEC-NN | Decision (→ DM-NN) | Choice | Sensitivity-robust? | Linked REQs / RSK |
|---|---|---|---|---|
| DEC-01 | <decision name> (DM-01) | <chosen alternative> | <Yes / Flips if <criterion>→40% (plausible? <y/n>)> | <REQ-NN, RSK-NN> |
| DEC-02 | <decision name> (DM-02) | <chosen alternative> | <Yes / No> | <REQ-NN> |
| DEC-03 | Comms protocol (DM-03) — example, delete | Protocol A (open standard) | Flips if Risk→40% (implausible) | REQ-INT-01, RSK-07 |
| DEC-NN | <decision name> (DM-NN) | <choice> | <…> | <REQ-NN> |

## 2. Architecture Decision Records (ADR bodies)

> One ADR per `DEC-NN`. Copy the block below for each. Status ∈ {Proposed, Accepted, Superseded}. A Superseded ADR points to the `DEC-NN` (and `CR-NN`) that replaced it.

### DEC-NN — <Decision title>

- **Status:** <Proposed | Accepted | Superseded by DEC-NN via CR-NN>
- **Date:** <YYYY-MM-DD>
- **Matrix:** [`Decision_Matrices.md` → DM-NN](./Decision_Matrices.md)
- **Context:** <What forces this decision? The problem, constraints, and the REQ(s)/MOE(s) at stake. Reference the Phase 04 alternatives this came from.>
- **Decision:** <The choice, stated plainly.>
- **Alternatives considered:** <Alt A, Alt B, Alt C — and the one-line reason each lost (point to the DM-NN scores).>
- **Consequences:** <Positive and negative results of the choice; what becomes easier, what becomes harder. Note any residual `RSK-NN` raised or `OPP-NN` captured.>
- **Linked REQs:** <REQ-NN, REQ-NN — at least one.>

### DEC-01 — Hosting topology (example — delete)

- **Status:** Accepted
- **Date:** 2026-01-15
- **Matrix:** [`Decision_Matrices.md` → DM-01](./Decision_Matrices.md)
- **Context:** The system must keep operating during backend outages (REQ-O-04). Phase 04 left hosting open: cloud / on-prem / hybrid-edge.
- **Decision:** Hybrid edge-cloud — local-first edge handles real-time control; cloud handles billing, fleet ops, and coordination.
- **Alternatives considered:** Public cloud (lost on offline operation, REQ-O-04); on-prem (lost on cost and single-site reliability).
- **Consequences:** + Offline-capable, lower WAN latency. − Higher operational complexity (two deploy targets); raises RSK-09 (edge fleet update reliability).
- **Linked REQs:** REQ-O-04, REQ-P-02.

### DEC-NN — <next decision>

- **Status:** <…>
- **Date:** <…>
- **Matrix:** [`Decision_Matrices.md` → DM-NN](./Decision_Matrices.md)
- **Context:** <…>
- **Decision:** <…>
- **Alternatives considered:** <…>
- **Consequences:** <…>
- **Linked REQs:** <…>

---

### Exit-gate self-check (gate: "Decisions traced" — delete once green)

- [ ] Register is 5-column and uses `DEC-NN` (same sequence as the matching `DM-NN`).
- [ ] Every decision links to ≥ 1 `REQ` and to its `DM-NN` matrix.
- [ ] Each row has an ADR body (Context → Decision → Status → Consequences), inline or under `adr/`.
- [ ] Sensitivity-robustness recorded per decision (matches `Decision_Matrices.md`).
- [ ] New risks/opportunities surfaced by any decision are pushed to the Risk register.
- [ ] No baselined decision edited in place — changes go through a `CR-NN` (Phase 09).
