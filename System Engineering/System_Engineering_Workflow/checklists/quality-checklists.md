---
Document: Quality Checklists — consolidated reusable artifact checks
Document ID: CHK-QUALITY-v1.0
Standard: ISO/IEC/IEEE 29148:2018 (requirements); INCOSE SE Handbook v5 (2023); ISO/IEC/IEEE 42010:2022 (ICDs); ISO/IEC/IEEE 29119-3:2021 (test cases)
Status: Baseline
Owner: Lead Systems Engineer
---

# Quality Checklists

> **The single home for reusable artifact-quality checks.** A stage skill or a gate review (see [`gate-reviews.md`](gate-reviews.md)) references one of these checklists instead of restating it. Each checklist is a *per-item* gate: run it on **one** REQ, **one** ICD row, **one** test case, **one** decision matrix, etc. Everything shared — IDs, T/I/A/D, severity, status strings, the traceability spine — comes from [`../05_Conventions.md`](../05_Conventions.md); this file never redefines it.

| # | Checklist | Apply to | Owning stage(s) |
|---|---|---|---|
| 1 | [SMART requirement](#1-smart-requirement-check) | one `REQ-<class>-<nn>` | 02 |
| 2 | [INCOSE requirement-quality](#2-incose-requirement-quality-check) | one `REQ` *and* the REQ set | 02 |
| 3 | [ICD row](#3-icd-row-check) | one `ICD-<nn>` row | 04 (draft) → 06 (frozen) |
| 4 | [Test-case anatomy](#4-test-case-anatomy-check) | one `TC-VER-<nn>` / `TC-VAL-<nn>` | 07 / 08 |
| 5 | [Decision-matrix soundness](#5-decision-matrix-soundness-check) | one `DM-<nn>` (+ `DEC-<nn>`) | 05 |
| 6 | [Bidirectional traceability](#6-bidirectional-traceability-check) | the trace spine | all (audited at gates) |
| 7 | [SysML model-coverage](#7-sysml-model-coverage-check) | the Phase-03 model | 03 |

---

## 1. SMART requirement check

Run on **every** `REQ-<class>-<nn>`. If any letter fails, rewrite with the user — **no non-SMART REQ enters the SyRS** (SRR exit criterion). Use the ISO/IEC/IEEE 29148:2018 template: *"The `<subject>` shall `<action>` `<measurable condition/threshold>` `<under defined conditions/context>`."*

- [ ] **S — Specific:** exactly **one** observable behaviour. No "and/also" double-barrelling (split it into two REQs). No vague verb ("support", "handle", "manage").
- [ ] **M — Measurable:** a number, threshold, or observable pass/fail event — never an adjective ("fast", "robust", "intuitive", "scalable").
- [ ] **A — Achievable:** feasible against known technology, cost, and schedule limits; not aspirational.
- [ ] **R — Relevant:** traces to an originating `SN-<nn>` / mission / regulation — no orphan REQ invented ahead of the problem.
- [ ] **T — Testable:** a defined way to decide pass/fail; a T/I/A/D method (Conventions §4) can be **seeded** against it.

**Also confirm (per REQ):** a stable, zero-padded `REQ-<class>-<nn>` ID using a Conventions §2.1 class code · a **priority** (High/Med/Low/N-A) · a **Source** (`STK-*`/`SN-*`/regulation) · a parent `SN-*` it derives from · a seeded T/I/A/D method with a `TC-VER-TBD` placeholder. *Domain (`D`) REQs cite a verified standard edition/clause; regulatory items pinning an industry standard (UL/IEC/DO/ISO) are `D`, not `C`.*

> **EARS fallback:** when a stakeholder can't phrase a REQ, use the matching EARS pattern (Ubiquitous / Event-driven / State-driven / Unwanted-behaviour / Optional), then **SMART-check the result** — EARS is a phrasing aid, not a substitute for SMART.

---

## 2. INCOSE requirement-quality check

The SMART check (above) is the per-statement minimum. This is the broader INCOSE *Guide for Writing Requirements* quality lens — run it on each REQ **and** on the set, especially for safety-critical / regulated work.

**Per requirement (well-formed statement)**
- [ ] **Unambiguous** — exactly one interpretation; no "etc.", "and/or", "as appropriate", "user-friendly".
- [ ] **Complete** — needs no other text to be understood; no dangling "TBD" except an explicit, owned `TODO:`.
- [ ] **Singular** — one requirement per statement (no compound "shall … and shall …").
- [ ] **Feasible** — achievable within physical, cost, schedule, and regulatory constraints.
- [ ] **Verifiable** — a single T/I/A/D method can prove it; if you can't name how to test it, rewrite it.
- [ ] **Correct** — accurately represents the stakeholder need it derives from.
- [ ] **Conforming** — uses the standard template, the agreed glossary terms, and a consistent "shall" for binding obligation (no "will/should/must" drift).
- [ ] **Appropriate** — written at the **right level** (a *system* REQ here, not a design detail or an implementation choice).

**Across the requirement set**
- [ ] **Complete (set)** — every `SN-*` is covered by ≥ 1 REQ; no need is dropped silently (out-of-scope needs recorded with rationale).
- [ ] **Consistent** — no contradictory pairs (perf↔cost, security↔usability); identified conflicts resolved or recorded with a priority tie-break.
- [ ] **Non-redundant** — no two REQs state the same thing; no overlap that would let them drift apart.
- [ ] **Comprehensible / bounded** — the set is organised (by class) and sized so a reviewer can hold it; large sets are decomposed.
- [ ] **Traceable (set)** — forward (`SN→REQ`) **and** backward (`REQ→SN`) links present; bidirectional if safety-critical/regulated.

---

## 3. ICD row check

Run on **every** `ICD-<nn>` seam — each cross-boundary edge where two independently developed components meet. ICD rows are `Draft` at **PDR** and **frozen** (`Baseline (CDR-approved <date>)`) at **CDR** — never baselined early.

**Row header (the inventory line)**
- [ ] **Sender → Receiver** named (both are real blocks from the BDD/deployment view).
- [ ] **Layer** stated — Physical / Protocol / Application / Network.
- [ ] **Standard** **named** — a real spec (e.g. OCPP 2.0.1, ISO 15118-2, REST+JSON/OpenAPI, CAN-FD, MQTT, gRPC), never "JSON over HTTP" without a schema reference.
- [ ] **Direction** — Bi / In / Out.
- [ ] **Trust-boundary?** flag set (Y/N) — if Y, linked to a `THR-*` (Security thread).
- [ ] **Safety-relevant?** flag set (Y/N) — if Y, handed to the Safety/RAMS thread.

**Detailed entry (the contract, one sub-section per `ICD-<nn>`)**
- [ ] **Transport / physical layer** specified.
- [ ] **Subprotocol / message set** specified.
- [ ] **Authentication** mechanism named (mTLS / OAuth 2.1 / API key / cert / RFID / EMV / …) — not "auth TBD".
- [ ] **Message format** referenced by a concrete artifact (OpenAPI path / Protobuf / JSON Schema / ASN.1), not described in prose.
- [ ] **Cadence** stated (heartbeat / polling / event-driven).
- [ ] **Latency budget sourced from a `REQ-P-*`** — or marked `TODO: define latency budget for ICD-<nn> in Phase 02` (never invent a number).
- [ ] **Failure modes** defined (timeout/retry, offline buffering, fallback).
- [ ] **Versioning** rule stated (semver / capability negotiation).
- [ ] **Linked REQs** listed (the `REQ-INT-*` / `REQ-P-*` / `REQ-SEC-*` this seam satisfies).
- [ ] **Status** correct for the gate — `Draft` at PDR; `Baseline (CDR-approved <date>)` only at CDR freeze.

---

## 4. Test-case anatomy check

Run on **every** `TC-VER-<nn>` (verification, Phase 07) and `TC-VAL-<nn>` (validation, Phase 08). Test documentation conforms to **ISO/IEC/IEEE 29119-3:2021** (supersedes IEEE 829 — mark 829 superseded).

**Identity & traceability**
- [ ] Stable ID — `TC-VER-<nn>` or `TC-VAL-<nn>` (Conventions §2.4).
- [ ] **Traces to ≥ 1 `REQ-*`** it verifies/validates (the `verify` link in the spine); validation cases also trace to the `SN-*`/`SCN-*`/MOE they exercise.
- [ ] **Method** named per Conventions §4 — T/I/A/D (verification); validation reuses T/D for acceptance.

**Preconditions & inputs**
- [ ] **Preconditions** fully (re-)establish all required state — the case must be runnable **standalone**.
- [ ] **Independence:** does **not** depend on another case's result or output (no "use TC-VAL-05's cart"); can be re-run and run in parallel.
- [ ] **Inputs / test data** specified concretely (not "valid data").

**Steps & expected results**
- [ ] **Steps** are ordered and unambiguous (one action each).
- [ ] **Per-step `*Expected:*`** result stated inline — not just a single end-of-case "expect pass".
- [ ] **Pass criteria** numeric and **set in advance**, derived from this project's MOE/MOP set (validation) or the REQ threshold (verification).

**Post-execution (recorded when run)**
- [ ] **Actual Result** field present (blank until run).
- [ ] **Pass/Fail Status** field present (blank until run).
- [ ] **Evidence** path defined (`verification-evidence/TC-VER-NN/` or `validation-evidence/TC-VAL-NN/`).

> **Boundaries:** Acceptance/UAT/FAT/SAT/regulatory are **validation** (Phase 08) — never given a `TC-VER`. FAT is **F**actory-first (before delivery), SAT is **S**ite (after install). Coverage is *necessary but not sufficient* — red-team whether the case would actually hit the worst case.

---

## 5. Decision-matrix soundness check

Run on **every** strategic decision (`DM-<nn>` matrix + its `DEC-<nn>` register row). A decision is **done** only when it has a matrix, a sensitivity block, and a `DEC-NN`→REQ link (Stage 05 *Decisions-traced* gate).

**Alternatives & criteria**
- [ ] **2–4 alternatives**, all at the **same level** (don't pit a vendor product against a DIY approach — run a second matrix for the other tier).
- [ ] **Criteria** include the standard set — **Cost, Performance, Reliability, Risk, Scalability, Maintainability** — with any drop recorded as "tailored out: `<reason>`".
- [ ] **Weights sum to 100%**, and **each weight ties to a `REQ`/stakeholder priority** (not taste). If flat weights are contested, use **AHP** and **reject if consistency ratio CR > 0.1**.

**Scoring**
- [ ] Every cell scored on the **1–10** scale (Conventions).
- [ ] Every score has a **derivable** one-line justification naming the method that produced it (benchmark figure / vendor SLA / TCO line / capacity test) — **no 10 without verifiable evidence**.
- [ ] **Weighted totals** computed as Σ(score × weight) with the arithmetic shown; scores not flat-tied across alternatives.
- [ ] **Cost** uses TCO/NPV over the horizon (not just upfront price) and isn't silently over-weighted.

**Sensitivity & record**
- [ ] **Sensitivity analysis present** — each criterion in turn set to **40%** (remaining 60% spread equally), totals recomputed; whether the winner **flips** is recorded.
- [ ] Any flip is **flagged with a plausibility judgement** (a sensitive winner is still valid if the flipping up-weight is implausible) — never silently ignored.
- [ ] `Decision_Register.md` row is **5-column**, uses `DEC-<nn>`, links back to its `DM-<nn>` and forward to ≥ 1 `REQ`, and reads as an ADR stub (context / decision / consequences).
- [ ] No score, total, or COCOMO number copied from the worked example — all recomputed for this project. *(If software ≥ ~10 KLOC, a COCOMO estimate exists with self-consistent `E=a·KLOC^b`, `T=c·E^d`, `N=E/T`, or is explicitly skipped with a reason.)*
- [ ] New risks/opportunities surfaced by the trade study pushed to the Risk register.

---

## 6. Bidirectional traceability check

Run on the **traceability spine** (Conventions §8). Forward *and* backward links are maintained continuously; **bidirectional is mandatory** for safety-critical / regulated work (DO-178C, ISO 26262, IEC 62304).

```
SN ──derive──▶ REQ ──satisfy──▶ Design block ──(ICD)──▶ INC ──verify──▶ TC ──▶ result
 │              │                                                 ▲
 MOE           MOP/TPM ─────────────────────────────────────────┘ (verify)
                                  CR ──▶ re-baseline ──▶ SLO
```

**Forward — nothing un-built**
- [ ] Every `SN-*` → ≥ 1 `REQ-*` (no uncovered need).
- [ ] Every `REQ-*` → `satisfy` ≥ 1 design block (no un-allocated REQ).
- [ ] Every `REQ-*` → `verify` ≥ 1 `TC-VER-*`/`TC-VAL-*` (or I/A/D activity).
- [ ] Every `REQ-INT-*` / external dependency → an `ICD-<nn>`.
- [ ] Every `MOE-*` → ≥ 1 `MOP-*`; critical MOPs → `TPM-*`; TPMs → `SLO-*` in operations.

**Backward — nothing orphaned**
- [ ] Every `REQ-*` → a parent `SN-*`/mission/regulation (no orphan REQ).
- [ ] Every design block → ≥ 1 `REQ-*` it satisfies (no phantom/orphan block).
- [ ] Every `TC-*` → ≥ 1 `REQ-*` it verifies/validates (no test with no purpose).
- [ ] Every `MOP-*` → a `REQ-*`; every `TPM-*` → a `MOP-*`/`REQ-*`.

**Integrity**
- [ ] **Derive direction** is correct — lower-level (derived) → higher-level (source); no leaf REQ with a "Derives", no top REQ with a "Derived From".
- [ ] Each link uses the **right relationship** (derive / refine / satisfy / verify / copy / containment / trace — Conventions §7); `trace` used only when none of the stronger ones fit; `satisfy` is an **assertion** always backed by a `verify`.
- [ ] No link breaks at a stage boundary; placeholders are explicit (`TC-VER-TBD`, `DEC-TBD`), never blank cells.
- [ ] For safety/regulated work, every `HAZ-*` → `REQ-SAF-*` → `TC-VER-*` chain is complete **and bidirectional**.

---

## 7. SysML model-coverage check

Run on the **Phase-03 model** to clear the **Model-Coverage gate** (the entry condition for PDR). The working set is the **7 of 9** SysML diagram types (Conventions §7).

**Diagram set**
- [ ] All **7** mandated diagrams exist as renderable `.puml` — Use Case · BDD · IBD · State Machine · Activity · Sequence · Requirements. *(Package added if model size warrants; Parametric if physical/parametric constraints warrant; state "**7 of 9**".)*
- [ ] No diagram exceeds ~12 entities (decompose per-subsystem rather than crowd one diagram).

**Coverage (satisfy / verify)**
- [ ] **Every `REQ-*` is `satisfy`-ed by ≥ 1 block** — the satisfy matrix has no negative-space orphan (or each orphan carries a justified `TODO:`/`tailored out`).
- [ ] **Every `REQ-*` is `verify`-ed by ≥ 1 test case or I/A/D activity** — placeholders OK; the verify matrix has no un-justified orphan.
- [ ] **No orphan blocks** without explanation (every block satisfies ≥ 1 REQ).

**Relationship integrity**
- [ ] **Derive-direction check clean** — no business/top-level REQ with a "Derived From", no leaf REQ with a "Derives"; all `derive` links connect REQ→REQ.
- [ ] Correct relationship vocabulary — parent↔child REQ from analysis is **derive** (or **containment** for namespace decomposition); **refine** is REQ↔model-element only; `o--` = aggregation, `*--` = composition (don't call `o--` "composes").
- [ ] No `trace` link that should be a stronger relationship; all **7** relationships available (containment for compound REQs, copy for reused regulatory REQs).

**Behavioural & record**
- [ ] **State Machine** covers every SyRS mode/state with **no invented transitions** (loop back to the user / mark `TODO:` rather than fabricate).
- [ ] Coverage metrics **computed and timestamped** in `Model_Coverage.md` (a dated row each run — watch the trend, not a static table).
- [ ] Model status set (`Draft`/`In Review`/`Baseline`) and diagrams registered as `CI-*` for Configuration Management.

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — IDs (§2), T/I/A/D (§4), severity (§5), status strings (§6), diagrams + the 7-relationship vocabulary (§7), the traceability spine (§8), canonical citations (§9).
- [`gate-reviews.md`](gate-reviews.md) — the gate criteria that *invoke* these checklists as exit criteria.
- Producing-stage skills (where each check is applied in context): [`02 Requirements`](../skills/se-phase-02-requirements/SKILL.md) (1, 2) · [`03 Modeling`](../skills/se-phase-03-modeling/SKILL.md) (7) · [`04 Architecture`](../skills/se-phase-04-architecture/SKILL.md) (3) · [`05 Tradeoff`](../skills/se-phase-05-tradeoff/SKILL.md) (5) · [`07 Verification`](../skills/se-phase-07-verification/SKILL.md) / [`08 Validation`](../skills/se-phase-08-validation/SKILL.md) (4) · traceability spine audited at every gate (6).
- Authorities: **ISO/IEC/IEEE 29148:2018** (requirements + SMART) · **INCOSE SE Handbook v5 (2023)** and the INCOSE *Guide for Writing Requirements* (requirement-quality characteristics) · **ISO/IEC/IEEE 42010:2022** (interfaces/views) · **ISO/IEC/IEEE 29119-3:2021** (test documentation).
