# Requirements Management, Traceability & Change Management — Projects

## Guided project — traceability matrix + change log for a small system

**Goal.** Build a working traceability + change-management scheme for a small smart-home subsystem, grounded in the course's smart-lock and motion-detection examples (source: m2-reqtools; master-notes §2).

**Scenario.** A smart-home security subsystem with at least three verified, SMART requirements (reuse the course's: smart-lock control on authentication, and detect movement in 5 m + alarm in 2 s; add one of your own) (source: m2-reqtools; master-notes §2).

**Milestones & "done" criteria:**

1. **Requirements register.** List 3+ requirements, each with a stable ID, classified as functional / non-functional / constraint.
   - *Done when:* every requirement has a unique ID and a classification (best practice: structured approach) (source: master-notes §2).
2. **Traceability matrix.** A table with columns Req ID, Design, Code, Test case; one filled row per requirement.
   - *Done when:* every requirement has a forward chain to at least a design and a test, AND each test is confirmed to trace back to its requirement (bidirectional) (source: m2-reqtools).
3. **Baseline.** Freeze the matrix as Baseline 1.0 with a date.
   - *Done when:* the locked set has a version label and date (source: master-notes §2).
4. **Change log.** A table with columns: Change ID, Phase, Date, Description, Affected artifacts, CCB decision, New baseline.
   - *Done when:* the log has one column or row per change-management phase so a change can be tracked Request→Track (source: m2-reqtools).
5. **Run one change.** Push a real change request (e.g. tighten alarm to 1 s) through all five phases, recording each in the change log and bumping the baseline to 1.1.
   - *Done when:* the log shows impact analysis (affected artifacts from the matrix), a CCB decision, implementation, and the new baseline (source: m2-reqtools).

## Independent (challenge) project — a compliance-ready scheme

**Goal.** Design a requirements-management scheme for a *safety-critical* small system (e.g. a medical infusion controller or a vehicle door-lock ECU).

**Constraints only:**
- Pick one applicable standard from the course (ISO 26262, DO-178C, or IEC 62304) and state why it applies (source: m2-reqtools).
- Traceability must be **bidirectional** and justified by the chosen standard (source: m2-reqtools).
- Map each part of your scheme to a ReqView feature that would support it (document mgmt, traceability links, change mgmt, verification planning, custom attributes/views, export/reporting, standards support) (source: m2-reqtools).
- Define a CCB and the change-control process explicitly (source: m2-reqtools; master-notes §2).
- Show traceability and change-log entries for at least two requirements and one full change.

This is cumulative: it reuses verified/SMART requirements from topic 06 and elicited/classified requirements from topic 05.

## Build notes & solution sketch

- **Architecture of the scheme.** Three linked artifacts — a requirements register (IDs + classification), a traceability matrix (the links), and a change log (the control). The register feeds the matrix; the matrix powers impact analysis in the change log (source: m2-reqtools; master-notes §2).
- **Key decision — how many traceability directions?** Forward-only is fine for low-stakes; pick bidirectional whenever a standard or safety case is in play, because auditors must follow links both ways (source: m2-reqtools). This is the load-bearing trade-off in the independent project.
- **Key decision — when to baseline?** Lock a baseline at each major stage (e.g. design review) so every later change has a fixed reference; bump the version on each approved change in phase 5 (source: master-notes §2).
- **The hard part — impact analysis depends on links you recorded earlier.** If the matrix is thin, phase 2 can't see the blast radius. Invest in complete forward+backward links before you need them (source: m2-reqtools).
- **Don't duplicate topic 18.** The full system-wide impact-analysis workflow and continuous validation live in [18-change-management-continuous-validation](../18-change-management-continuous-validation/projects.md); keep this project at the requirements level (matrix + 5-phase log + CCB).
- **Tool note.** ReqView's Change Management feature does the baseline/version comparison and its Traceability Links feature does the matrix; this project models by hand what the tool automates (source: m2-reqtools).
