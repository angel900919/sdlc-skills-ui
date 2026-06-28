---
Document: System Requirements Specification — <Project Name>
Document ID: SyRS-<PROJECT_SLUG>-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (SyRS)
Status: Draft
Owner: Lead Systems Engineer
---

# System Requirements Specification — <Project Name>

> **How to use this template.** Replace every `<ANGLE-BRACKET placeholder>`, resolve every
> `TODO:` marker, and delete the rows/blocks marked `(example — delete)`. This is the
> **solution-space** spec: every `REQ-*` must derive from a stakeholder need `SN-<nn>`
> (Phase 01 StRS). All IDs, classes, gates, T/I/A/D method codes, priority, and status strings
> follow [../05_Conventions.md](../05_Conventions.md) — do not redefine them here.
> Tailor depth per the SEMP level: a Minimum-Viable instance may fold §4–§7 into one
> "Quality Requirements" table — record the fold as "tailored: <reason>".

---

## 1. Introduction

### 1.1 Purpose
<TODO: one paragraph — what this SyRS specifies and for whom.>

### 1.2 Scope
<TODO: what is in scope / out of scope for this system.>

### 1.3 Definitions, Acronyms & Abbreviations
| Term | Definition |
|------|------------|
| <TERM> | <definition> |
| _SyRS_ | _System Requirements Specification (example — delete)_ |

### 1.4 References
- [../05_Conventions.md](../05_Conventions.md) — IDs, classes, gates, T/I/A/D, priority, status.
- `Phase_01_Concept/StRS.md` — stakeholder needs `SN-<nn>` (the parent of every REQ).
- `Phase_01_Concept/OpsCon.md` — operational scenarios `SCN-<nn>`, modes/states context.
- ISO/IEC/IEEE 29148:2018 — Requirements engineering.
- <TODO: domain/regulatory standards cited by any REQ-D-*, with verified edition + clause.>

---

## 2. System Overview
<TODO: tiers / decomposition, top-level behaviour, and operational context. This seeds the
Phase 03 BDD. Keep solution-level; the problem framing lives in Phase 01.>

---

## 3. Functional Requirements  (REQ-F-*)

> Template per requirement (ISO/IEC/IEEE 29148 §5):
> *"The `<subject>` shall `<action>` `<measurable condition/threshold>` `<under defined conditions/context>`."*
> One observable behaviour per REQ — split any "…and…" into two. SMART-check every row.

| ID | Statement | Source | SN | Priority | Method | MOP |
|----|-----------|--------|----|----------|--------|-----|
| REQ-F-<nn> | The <subject> shall <action> <threshold> <under conditions>. | <STK-nn / SN-nn / doc> | SN-<nn> | <High/Medium/Low/N-A> | <T/I/A/D> | MOP-<nn> |
| REQ-F-01 | _The system shall <do X> within <N> <units> when <trigger>. (example — delete)_ | _SN-01_ | _SN-01_ | _High_ | _T_ | _MOP-01_ |

---

## 4. Usability Requirements  (REQ-U-*)

| ID | Statement | Source | SN | Priority | Method | MOP |
|----|-----------|--------|----|----------|--------|-----|
| REQ-U-<nn> | The <subject> shall <UX target: task time / accessibility / language / learnability>. | <SN-nn> | SN-<nn> | <priority> | <T/I/A/D> | MOP-<nn> |

---

## 5. Performance Requirements  (REQ-P-*)

> Latency, throughput, capacity, accuracy, energy. Quality-attribute "-ilities" (scalability,
> maintainability, portability) are written here and **tagged** with the attribute in the statement.

| ID | Statement | Source | SN | Priority | Method | MOP |
|----|-----------|--------|----|----------|--------|-----|
| REQ-P-<nn> | The <subject> shall <metric> <threshold> <unit> <under load/conditions>. | <SN-nn> | SN-<nn> | <priority> | <T/I/A/D> | MOP-<nn> |

---

## 6. System Interfaces  (REQ-INT-*)

> High-level external I/O — protocols, ports, ICD seams. The **full ICD is Phase 04**; this
> section only fixes the interface obligations the requirements impose.

| ID | Statement | Source | SN | Priority | Method | MOP |
|----|-----------|--------|----|----------|--------|-----|
| REQ-INT-<nn> | The <subject> shall <expose/consume> <interface> via <protocol/port> conforming to <spec>. | <SN-nn> | SN-<nn> | <priority> | <T/I/A/D> | MOP-<nn> |

---

## 7. System Operations

### 7.1 Operational / Reliability Requirements  (REQ-O-*)
> Uptime, MTBF/MTTR, availability, OTA, offline operation, data retention.

| ID | Statement | Source | SN | Priority | Method | MOP |
|----|-----------|--------|----|----------|--------|-----|
| REQ-O-<nn> | The <subject> shall <achieve availability/MTBF/retention> <threshold> <under conditions>. | <SN-nn> | SN-<nn> | <priority> | <T/I/A/D> | MOP-<nn> |

### 7.2 Security Requirements  (REQ-SEC-*)
> AuthN/AuthZ, crypto, audit, supply-chain, compliance. Consume `THR-<nn>` from the threat
> model where one exists; cite ISO/IEC 27001:2022 / NIST SP 800-53 Rev. 5 for control selection.

| ID | Statement | Source | SN | THR | Priority | Method | MOP |
|----|-----------|--------|----|-----|----------|--------|-----|
| REQ-SEC-<nn> | The <subject> shall <enforce control> <to standard/threshold>. | <SN-nn> | SN-<nn> | THR-<nn> | <priority> | <T/I/A/D> | MOP-<nn> |

---

## 8. Constraints & Domain Requirements

### 8.1 Constraints  (REQ-C-*)
> General imposed limits — budget ceiling, mandated tech, schedule. (Problem **and** solution space.)

| ID | Statement | Source | Priority | Method |
|----|-----------|--------|----------|--------|
| REQ-C-<nn> | The <project/system> shall <not exceed / use only> <imposed limit>. | <STK-nn / contract / SEMP> | <priority> | <T/I/A/D> |

### 8.2 Domain Requirements  (REQ-D-*)
> Industry-vertical standards (UL, IEC, DO, ISO). Each **must** cite a verified edition + clause +
> acceptance criteria. Recommend web research to confirm the current edition.

| ID | Statement | Standard (edition + clause) | Source | Priority | Method |
|----|-----------|-----------------------------|--------|----------|--------|
| REQ-D-<nn> | The <subject> shall comply with <standard clause> for <scope>. | <e.g. IEC 62304:2006+A1:2015 §5.x> | <SN-nn / regulation> | <priority> | <I/A/T/D> |

### 8.3 Safety Requirements  (REQ-SAF-*) — *only if a Safety/RAMS thread exists*
> Hazard-mitigating behaviour. Link each to a hazard `HAZ-<nn>` in `_cross_cutting/Hazard_Log.md`.
> Delete this subsection if no safety thread exists (record "tailored out: no safety thread").

| ID | Statement | HAZ | Source | Priority | Method |
|----|-----------|-----|--------|----------|--------|
| REQ-SAF-<nn> | The <subject> shall <mitigate hazard behaviour> <under fault conditions>. | HAZ-<nn> | <SN-nn> | <High> | <T/A/D> |

---

## 9. Modes & States

> Enumerate top-level modes and transitions, reusing OpsCon `SCN-<nn>`. **Seeds the Phase 03
> State Machine** — do not invent transitions here that the OpsCon does not support.

### 9.1 Mode enumeration
| Mode/State | Description |
|------------|-------------|
| <MODE> | <what the system does in this mode> |
| _Off / Boot / Idle / Active / Fault / Maintenance_ | _(example set — delete or adapt)_ |

### 9.2 Transition table
| From | Event [guard] / action | To |
|------|------------------------|----|
| <STATE> | <event> [<guard>] / <action> | <STATE> |
| _Idle_ | _start [authorised] / begin (example — delete)_ | _Active_ |

---

## 10. Measures of Effectiveness & Performance

> The authoritative home for measurement definitions (Conventions §2.2). Mirrored into
> `_cross_cutting/TPM_Tracker.md`. MOE = from a **need** (solution-independent); MOP = from a
> **REQ** (solution-dependent); TPM = a promoted MOP carrying technical/schedule risk.

### 10.1 Measures of Effectiveness (MOE — derived from SN)
| MOE ID | Derived from SN | Mission-level metric | Target | Unit |
|--------|-----------------|----------------------|--------|------|
| MOE-<nn> | SN-<nn> | <how well it meets the need> | <target> | <unit> |

### 10.2 Measures of Performance (MOP — derived from REQ)
| MOP ID | Derived from REQ | System-level metric | Target | Threshold | Unit |
|--------|------------------|---------------------|--------|-----------|------|
| MOP-<nn> | REQ-<id> | <measurable quantity the REQ pins> | <target> | <threshold> | <unit> |

### 10.3 Technical Performance Measures (TPM — promoted MOP)
| TPM ID | Promoted from MOP | Current | Target | Threshold | Margin |
|--------|-------------------|---------|--------|-----------|--------|
| TPM-<nn> | MOP-<nn> | <TODO> | <target> | <threshold> | <margin> |

---

## 11. Verification (seed)

> **Seed only — Phase 07 is authoritative** and may change any method. Leave `TC-VER-TBD`
> placeholders; Phase 07 resolves them. Method codes T/I/A/D per Conventions §4.

| Req ID | Method (T/I/A/D, seeded) | Verifying Activity |
|--------|--------------------------|--------------------|
| REQ-<id> | <T/I/A/D> | TC-VER-TBD |
| _REQ-F-01_ | _T_ | _TC-VER-TBD (example — delete)_ |

---

## 12. Assumptions & Dependencies

> Collect 4–8: external standards, vendor SDKs, infrastructure, certifications, upstream systems.

| # | Assumption / Dependency | Type | Impact if false |
|---|-------------------------|------|-----------------|
| 1 | <assumption or external dependency> | <standard/vendor/infra/cert> | <impact> |

---

## 13. Requirements Engineering Record

> Captures the elicitation/analysis front-half and the peer review — the SRR evidence.

### 13.1 Elicitation methods used
| Need cluster | Method (interview / workshop / survey / observation / document review) | Source(s) |
|--------------|-----------------------------------------------------------------------|-----------|
| <cluster> | <method> | <STK-nn / regulation / doc> |

### 13.2 Conflicts & resolutions
| Conflict (REQ pair) | Nature (e.g. perf↔cost) | Resolution | Rationale (priority tie-break) |
|---------------------|-------------------------|------------|--------------------------------|
| <REQ-x ↔ REQ-y> | <nature> | <agreed balance> | <why> |

### 13.3 Peer review / walkthrough
- **Type:** <peer review (Inspection) | author-led walkthrough>
- **Reviewers:** <names/roles — engineers, architects, testers>
- **Date:** <YYYY-MM-DD>  *(TODO if not yet held)*
- **Flagged items & revisions:** <summary or link to minutes>

---

## Appendix A — Coverage & SMART summary (fill at gate)

- REQ counts by class: F=<n> · U=<n> · P=<n> · O=<n> · SEC=<n> · INT=<n> · C=<n> · D=<n> · SAF=<n>
- Priority split: High=<n> · Medium=<n> · Low=<n> · N-A=<n>
- REQs flagged for revision: <list or "none">
- Orphan REQs (no parent SN): **must be zero** — <list or "none">
- Uncovered SNs (no covering REQ): **must be zero** — <list or "none">

> **SRR exit gate:** on sign-off, set `Status: Baseline (SRR-approved <YYYY-MM-DD>)` and establish
> the Functional/Requirements baseline (Conventions §3). Thereafter, change only via `CR-<nn>` (Phase 09).
