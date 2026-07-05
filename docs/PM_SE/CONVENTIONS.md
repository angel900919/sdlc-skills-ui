# PM_SE — Conventions

> **The contract. When anything else — playbook, template, tracker, your memory — disagrees with this file, this file wins. Fix the other place.** One page of IDs, methods, severities, verdicts, and freeze rules so nothing gets restated (and drifted) anywhere else.

## 1. ID grammar

Uppercase, hyphen-separated, zero-padded two-digit sequence (`SN-01`, never `SN-1`). IDs are **stable for the life of the product** — never renumbered; retire with `(deprecated)`. An unknown ID is `<PREFIX>-TBD`, **never a blank cell**.

| Prefix | Names | Home |
|---|---|---|
| `SN-` | Solution-free needs | [02_validation_log](templates/02_validation_log.md) |
| `SCN-` | Scenarios (≥1 off-nominal, ≥1 maintenance) | [02_validation_log](templates/02_validation_log.md) |
| `ASM-` | Assumptions | 02 / [06_spec](templates/06_spec.md) |
| `REQ-<class>-` | Requirements (classes below) | [06_spec](templates/06_spec.md) |
| `AC-` | Acceptance criteria (charter seeds) | [01_charter](templates/01_charter.md) |
| `IF-` | Interface seams | [08_architecture](templates/08_architecture.md) |
| `DEC-` | Decisions | [15_decision_log](templates/15_decision_log.md) |
| `RSK-` | Risks | [16_risk_register](templates/16_risk_register.md) |
| `HAZ-` | Hazards *(only when the hazard trigger fires)* | 16, hazard block |
| `INC-` | Incidents | [14_incident_postmortem](templates/14_incident_postmortem.md) |
| `SLO-` | Service-level objectives (**2–4 max**) | [07_ship_bar](templates/07_ship_bar.md) |
| `RB-` | Runbooks | [12_runbook](templates/12_runbook.md) |

**Requirement classes** (`REQ-<class>-nn`): `F` functional (what it does) · `P` performance (latency, accuracy, battery, throughput) · `O` operational-reliability (uptime, OTA, offline, retention) · `SEC` security · `INT` interface · `C` constraint (budget ceiling, mandated tech, regulation) · `SAF` safety — **only when the hazard trigger fires**. Don't mint a new class letter per "-ility" — file it under the closest class (usually P or O).

**Automated tests need no IDs.** The test path (`tests/test_latency.py::test_p95`) *is* the ID. Explicit `TC-` IDs only for non-code checks (manual scripts, bench procedures). This namespace also fixes Lean PM's `R#` collision between requirements and risks.

## 2. Traceability spine — columns, not a matrix

`SN → REQ (verified-by + method) → IF → SLO` — **forward-only**, living as columns where each hop already lives: SN→REQ in the spec's REQ table (06 §5); REQ verified-by + method in the spec and the matrix (10 §1); REQ→IF in the interface table (08 §4, latency budgets cite REQ-P); REQ→SLO in the ship-bar's SLO handoff (07). No standalone coverage matrix. Two grep-able orphan checks replace it:

- [ ] No `REQ` without a parent `SN` — a requirement serving no need is scope creep
- [ ] No `SN` without a covering `REQ` — a need nothing satisfies is a broken promise

Need bidirectional, tool-enforced traceability? You've outgrown PM_SE — see the right-sizing table in [README.md](README.md).

## 3. Verification methods — T / I / A / D

Assigned at requirement birth, in the REQ row. Plain English:

| Code | Method | Means | Evidence |
|---|---|---|---|
| **T** | Test | Run it and measure against the threshold | test run, logs, measured value |
| **I** | Inspection | Read or examine it without running it | checklist, review note |
| **A** | Analysis | Compute, simulate, or model it — LLM eval-suite aggregates live here | calculation, eval report |
| **D** | Demonstration | Use it and watch it behave | demo recording, witnessed run |

Review is a form of **Inspection**, never a fifth code. **Acceptance/beta is VALIDATION, never a verification method** — "built the *right thing*" and "built it *right*" are answered separately at G3.

## 4. Severity — S1–S4 (one taxonomy: defects, incidents, security findings)

| Sev | Meaning | Rule |
|---|---|---|
| **S1** | Safety impact, data loss, or primary function dead — no workaround | **Never ship. Auto-rollback.** |
| **S2** | Major function impaired; awkward workaround only | Fix before the next gate, or accept by name |
| **S3** | Minor function; easy workaround | Backlog |
| **S4** | Cosmetic | Backlog, maybe never |

Severity describes **what happened**; a risk score (L×I, 3×3 → H/M/L, in `16_risk_register.md`) describes **what might**. Two ledgers — never mix them.

## 5. Gate verdicts — fixed, forced-choice, no synonyms

| Gate | Name | Verdicts | Never-skip? |
|---|---|---|---|
| G0 | Frame Check | Proceed / Park | no |
| G1 | Opportunity Gate | GO / GO-with-de-risk / PIVOT / KILL — a gate, not an average: one hard FAIL stops the line | ★ |
| G2 | Design Freeze | Approve-&-Freeze / Revise — freezes THREE things: ship-bar, spec, interfaces | ★ |
| G3 | Ship-Ready | GO / Iterate / KILL — two named blocks: VERIFIED (eval vs unchanged bar + matrix zero-rules) and VALIDATED (strangers, real environment, pre-set numeric targets) | ★ |
| G4 | Launch | Advance / Hold / Rollback per ramp stage — phase exits "Landed" | no |
| G5 | Health Check (recurring) | Continue / Iterate / Re-open / Sunset — verdict written even when Continue | no |
| G6 | Clean Exit | Complete / Blocked | no |

At every gate: verdict + date in the tracker — **an unrecorded gate is a failed gate**; every pass cites evidence; the red-team prompt ([AI_PROMPTS #1](AI_PROMPTS.md)) runs first; each thread answers its one gate question; skips recorded as `tailored out: <reason>` — never silent.

## 6. Freeze semantics

```
Draft → FROZEN (G<n>, <YYYY-MM-DD>) → Superseded (via change note)
```

- G2 freezes three things: ship-bar, spec/requirements, interfaces.
- Frozen artifacts change **only via re-baseline**: a logged change note (5-question impact check in `15_decision_log.md`) + version bump + re-run of affected checks. The sanctioned pivot — never a quiet edit.
- Bars may be raised later, **never quietly lowered**. Never lower the bar to make the date.

## 7. Versions & the release tuple

- Annotated git tag per gate = the baseline. Semver by breaking / feature / fix.
- **The release tuple** — every release tag pins ALL of: code commit + prompt-set version + pinned model ID + eval-set hash + firmware semver + hardware rev. Tuple members your product doesn't have are marked `n-a` (never silently dropped); never leave un-pinned one it does.
- CHANGELOG per release. "Deployed matches tagged" drift check at every gate.
- **Changing the eval set is itself a risky change.** Risky change (anything frozen, breaking interface, model/prompt swap, firmware pushed to the fleet, safety/security/data) → change note + re-run affected evals + bump. Normal change → just commit well. Hotfix → ship now, note within 48 h.

## 8. House rules

1. **Never invent** numbers, prices, or regulations. Unknowns become `TODO: <what's owed, by whom, by when>`. Volatile facts (model pricing, regulations, vendor terms) are **verified current at decision time**, never recalled.
2. **Never silently skip.** A tailored-out artifact or section gets one line: `tailored out: <reason>`.
3. Templates show shape, never data — `(example — delete)` rows only.
4. One topic at a time when an AI interviews you; show-back and confirm before moving on.
5. Red-team before every gate. It IS the review board at n=1.
6. **KILL and PIVOT are wins** — the cheapest outcomes this process can produce.
