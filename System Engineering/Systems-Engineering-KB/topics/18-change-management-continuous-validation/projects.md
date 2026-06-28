# Change Management & Continuous Validation — Projects

## Guided project: run a full impact analysis + draft an Impact Analysis Report

**Scenario.** You're on a development team for a payment application (or a system of your choice). A product owner submits a change request — start from the "Submit Payment" button move, or the checkout redesign (move the payment-method selector above the order summary, add option icons) (source: m4-ex-impact, m4-change).

**Goal.** Produce a complete **Impact Analysis Report** and route the change through the 6-phase change control process up to the CCB decision.

**Requirements (inputs).** A written change request; the 5 impact-analysis steps; the 6 process phases (source: m4-change).

**Suggested steps & checkpoints:**

1. **Write the Change Request (CR).** Capture the requested change and its rationale. *Done when:* the CR states what changes and why (source: m4-change).
2. **Initial Review.** Decide feasibility yes/no in one line. *Done when:* a go/no-go-to-analysis call is recorded (source: m4-change).
3. **Run the 5-step impact analysis.** Scope (which components) → risks & dependencies → cost & schedule estimate → compliance/safety → stakeholder input. *Done when:* every step has a concrete answer (e.g., components named, an hours estimate, at least one named dependency, at least one compliance risk) (source: m4-change).
4. **Assemble the Impact Analysis Report.** Include code-change scope, schedule impact, key test requirements, and mitigation steps (e.g., feature-flag rollout). *Done when:* the report has all four parts and is "submit-ready" for the CCB (source: m4-change).
5. **Simulate the CCB decision.** State the board's go/no-go and the conditions attached. *Done when:* a decision is recorded with at least two conditions to proceed (source: m4-ex-impact).
6. **Plan Documentation & Communication.** List what docs to update (test cases, design docs, user guides, training) and who to notify. *Done when:* the update list and notification list exist (source: m4-ex-impact, m4-change).

**Impact Analysis Report skeleton (starter — extend it):**

- [ ] Change scope — components/subsystems affected (source: m4-change)
- [ ] Risks & dependencies — named risks + dependencies (source: m4-change)
- [ ] Cost & schedule — hours/budget estimate (source: m4-change)
- [ ] Compliance & safety — regulatory/safety/accessibility impact (source: m4-change)
- [ ] Stakeholder input — engineers/users/managers feedback (source: m4-change)
- [ ] Key test requirements — which tests must run/update (source: m4-change)
- [ ] Mitigation steps — e.g., feature-flag rollout (source: m4-change)

## Independent (challenge) project: design a continuous-testing pipeline for a chosen system

Pick a system (payment app, autonomous delivery robot, smart-home system) and design its **continuous-testing pipeline**. Constraints only:

1. Apply all five continuous-testing principles — shift-left, test automation in CI/CD, fail-fast feedback, environment consistency, service virtualization (source: m4-change).
2. Specify the **per-commit pipeline**: build → unit tests → integration + smoke tests → reports → optional staging deploy (source: m4-change).
3. Map at least one concrete test to **each layer**: unit (Very Fast), integration (Fast), end-to-end (Slower), performance/security (Varies) (source: m4-change).
4. Show **shift-left** explicitly: at least one BDD/acceptance test defined *before* the code (source: m4-change).
5. Show **service virtualization**: name one dependent service/hardware you'd mock and why (source: m4-change).
6. Add a one-paragraph note distinguishing this *continuous validation* work from the *V&V method definitions* it reuses (cross-ref [16-verification-validation-methods](../16-verification-validation-methods/README.md)).

**Goal.** A pipeline diagram + table that someone could implement in CI/CD, catching defects per commit with fail-fast feedback.

## Build notes & solution sketch

- **Architecture (impact analysis):** make the 5-step list the spine of the report — each step becomes a section; the CCB reads it top to bottom. Keep the report submit-ready before any code is touched (source: m4-change).
- **Key decision — isolated vs system-wide change.** The button move is isolated to the frontend/UI layer (safer); a change like "save card for later" touches data handling and security, so step 4 (compliance/safety) becomes the gate. Classify the change early — it sets the testing depth (source: m4-ex-impact, m4-change).
- **Key decision — which change-management tool.** No single tool fits all; for an Agile software pipeline reach for JIRA/Azure DevOps/GitHub-GitLab, for complex/regulated systems IBM EWM/Windchill/DOORS (source: m4-changemgmt, m4-change).
- **Hard part (pipeline) — fail-fast.** The value is in *immediate* failure reporting per commit, not just having tests; wire reports so a red unit test stops the line before slower E2E runs (source: m4-change).
- **Hard part — what automation misses.** Keep dedicated manual testing sessions for edge cases and usability; automation covers the bulk but not everything (source: m4-change).
- **Boundary note:** the *requirement-level* change process and traceability belong to [07-requirements-management](../07-requirements-management/README.md); test plans/cases belong to [17-test-plans-cases](../17-test-plans-cases/README.md). This project owns the system-wide impact workflow and the continuous-validation pipeline (source: m4-change).
