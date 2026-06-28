# Agile Systems Engineering Playbook (Capstone) — Projects

This is the capstone build: run one chosen system through all six lifecycle phases, producing the full artifact set held together by a consistent unified ID scheme (source: playbook). Concepts owned by other topics are linked, not re-taught.

## Guided project — run a system through all six phases

**Goal:** produce a complete, traceable systems-engineering artifact set for a **Smart Home AI Security** system (the source's running example), at the **Minimum-Viable** process level, delivered on an Agile sprint cadence (source: playbook).

**Project conventions (set these first):**
- Project code `AI`; ID pattern `[Project]-[Type]-[Number]` (e.g. `AI-SYS-101`) (source: playbook).
- GitLab repo with folders `/docs /models /src /tests /mgmt` (source: playbook).

**Milestones & "done" criteria:**

**M0 — Sprint 0 (Foundation).** *Done when:* `/docs/StRS.md` exists with at least 3 stakeholder needs, `/models/system-bdd` has a high-level BDD, and `/docs/SyRS.md` has an initial SyRS (source: playbook).

**M1 — Phase 1: Problem Definition.** Capture the BRS + StRS from the need "feel safe knowing my front door is monitored." Create a JIRA Epic for the security need. *Done when:* a stakeholder sign-off line on the Architecture Vision is recorded in `/docs` (success gate) (source: playbook). Elicitation technique → [topic 05](../05-requirements-elicitation-analysis/fundamentals.md).

**M2 — Phase 2: Requirements Engineering.** Derive ≥3 SyRS requirements with IDs (`AI-SYS-101`, `AI-SYS-102`, `AI-USR-001`), each passing the SMART checklist; write a one-paragraph OpsCon; create a JIRA Story per requirement linking back to its ID. *Done when:* every story references a SyRS ID and every requirement is measurable/testable (source: playbook). SMART → [topic 06](../06-verifying-requirements/fundamentals.md); ReqView/traceability → [topic 07](../07-requirements-management/fundamentals.md).

**M3 — Phase 3: Architecture & Functional Analysis.** Draw a BDD (`Camera Block` ↔ `AI Processing Block`) and an FFBD for the detection flow; record one trade-off via a decision matrix in `/mgmt`; write an ICD overview line. *Done when:* `/models` holds the BDD/FFBD and `/docs` holds the ICD overview (source: playbook). BDD/FFBD → [topic 08](../08-sysml-modeling/fundamentals.md); trade-off/decision matrix → [topic 12](../12-design-tradeoffs/fundamentals.md), [topic 13](../13-decision-matrix/fundamentals.md); ICD → [topic 14](../14-documenting-architecture/fundamentals.md).

**M4 — Phase 4: Detailed Design & Implementation.** Add an IBD/Sequence diagram and an SRS for `AI-SYS-101` (1080p stream over RTSP). Branch `feature/AI-SYS-101-yolo`, commit `AI-SYS-101: add YOLO detection`; configure GitLab CI/CD to run unit tests. *Done when:* CI runs a unit test on the branch and the commit references the ID (source: playbook).

**M5 — Phase 5: Integration, V&V.** Perform incremental integration of Camera ↔ AI blocks; write `TC-AI-SYS-101-NotifyTest` and a verification matrix mapping each requirement to its TC. *Done when:* the verification matrix shows 100% requirement coverage (success gate) (source: playbook). Integration → [topic 15](../15-integration-strategies/fundamentals.md); V&V → [topic 16](../16-verification-validation-methods/fundamentals.md); test plans → [topic 17](../17-test-plans-cases/fundamentals.md).

**M6 — Phase 6: Deployment & Operations.** Write a migration plan (Blue-Green) and a one-page user manual; define two monitoring metrics (uptime, resource utilization). *Done when:* `/docs` holds the user manual and the migration/monitoring plan (source: playbook).

**Final deliverable:** a repo whose `/docs /models /src /tests /mgmt` together let a reviewer trace `AI-SYS-101` from need to validated test in one search (source: playbook).

## Independent (challenge) project — your own system, Formal level

**Brief:** Pick a *different, safety- or mission-critical* system (e.g., autonomous delivery robot, medical infusion pump). Run it through all six phases at the **Formal** process level and produce the artifact set.

**Constraints (Formal level, source: playbook):**
- Use the **full ISO 29148 suite** (do not merge StRS/SyRS) → [topic 04](../04-se-tools-techniques/fundamentals.md).
- Use **MBSE** (Cameo/Visual Paradigm) for the models.
- Stand up a **Change Control Board (CCB)** process and run at least one change request through the impact-analysis checklist → [topic 18](../18-change-management-continuous-validation/fundamentals.md).
- Maintain **bidirectional traceability** (need ↔ requirement ↔ design ↔ test) → [topic 07](../07-requirements-management/fundamentals.md).
- Deliver on Sprint 0 + delivery + hardening cadence; include a hardening sprint with UAT.
- Goal: full requirement coverage in the verification matrix, plus a logged, impact-analyzed change.

## Build notes & solution sketch

- **Architecture of the deliverable:** the repo *is* the architecture — the five folders mirror the artifact taxonomy, so "where does this go?" is answered by artifact type (specs/ICD → `/docs`, SysML → `/models`, etc.) (source: playbook).
- **Key decision — process level first:** decide Minimum-Viable vs Formal *before* M0; it determines whether StRS/SyRS merge and whether a CCB exists (source: playbook). Picking Formal for a tiny project is the classic over-engineering trap (see [fundamentals.md](fundamentals.md) pitfalls).
- **Key decision — ID scheme is immutable:** lock the `[Project]-[Type]-[Number]` codes at M0; renaming later breaks every downstream branch/commit/TC link (source: playbook).
- **The hard part — closing the verification matrix:** the 100%-coverage gate fails silently if any requirement has no matching `TC-`. Build the matrix incrementally (one row per requirement at M2) and fill the TC column as M5 progresses (source: playbook).
- **Verification vs validation in the hardening sprint:** keep them separate — `TC-AI-SYS-101` proves the 2-second budget (verification); the UAT "are alerts useful, not annoying?" check is validation (source: playbook).
- **Unstick tip:** if traceability feels tangled, grep one requirement ID across the whole repo — every artifact that should touch it must appear (source: playbook).
