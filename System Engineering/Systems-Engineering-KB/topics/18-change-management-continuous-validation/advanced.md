# Change Management & Continuous Validation — Advanced concepts

## Advanced concepts

- **Impact analysis is a phase, not a synonym for the whole process.** It is step/phase 3 of the change control process and produces the evidence the CCB consumes at phase 4; conflating the analysis with the approval is the most common structural error (source: m4-change).
- **The Impact Analysis Report is the contract between engineering and the CCB.** It must carry four things — code-change scope, schedule impact, key test requirements, and mitigation steps (e.g., feature-flag rollout) — so the board decides on evidence rather than opinion (source: m4-change).
- **Configuration management is the enforcement layer.** Beyond documenting changes, CMS *prevents unauthorized modifications* and gives version control and compliance; in regulated industries IBM DOORS is used specifically to ensure regulatory compliance (source: m4-change). The requirement-traceability side of DOORS is owned by [07-requirements-management](../07-requirements-management/README.md).
- **Tool selection is a constraint-satisfaction problem.** "No single tool fits all" — the choice is driven by process complexity, compliance needs, and collaboration model, and the best tool integrates seamlessly into existing workflows (source: m4-changemgmt). The four domain clusters (Agile / complex SE / enterprise IT / risk-impact) are decision buckets, not a ranking (source: m4-changemgmt).
- **Continuous testing reframes V&V from an event to a property.** The shift is from "testing as a discrete end-of-cycle phase" to testing "integrated into every phase," producing *rapid, ongoing feedback* — the same verification/validation methods from [16-verification-validation-methods](../16-verification-validation-methods/fundamentals.md), but executed continuously (source: m4-change).

## Edge cases & gotchas

- **Isolated change vs system-wide change.** The checkout button move is isolated to the frontend/UI layer with no architectural/backend change, which makes it safer; the moment a change touches business logic, security, or payment workflows, its risk profile and required testing jump (source: m4-ex-impact). Misclassifying a system-wide change as "just UI" is a real trap.
- **A cosmetic change can still fail compliance.** Moving a button risks accessibility (screen readers, keyboard navigation), which is why aXe audits and keyboard-navigation UAT were required — step 4 (compliance/safety) is not optional for UI-only changes (source: m4-change, m4-ex-impact).
- **Automated UI tests break on element repositioning.** Tests that reference button location fail when the layout changes; update all automated tests *before* deploying, not after (source: m4-ex-impact).
- **Service virtualization is for the "not-yet-available" case.** Mocks/simulators stand in only when dependent services or hardware aren't ready, so tests don't block — not a substitute for real integration testing later (source: m4-change).
- **"Yes, but with caution" is a real verdict.** The decision criterion is value-vs-(effort+risk), not safety alone; the same change can be a "delay" near a critical release window or when based on assumption rather than user data (source: m4-ex-impact).

## Performance, production & security considerations

The sources frame the production payoff as **defect timing and cost**: continuous testing identifies and resolves defects early to prevent costly rework later, and fail-fast feedback reduces debugging scope and speeds resolution (source: m4-change). **Environment consistency** ("as code" — containers, VMs) is the production-reliability lever: tests always run against known, reproducible configurations (source: m4-change). On security, the material includes security testing within system testing and the performance/security automation layer, and uses feature-flag rollout as a production mitigation — but it does not go deeper into security architecture of the change process itself (source: m4-change). The checkout example explicitly notes the button move does *not* alter security or payment workflows, which is part of why it is low-risk (source: m4-ex-impact).

## Where to go deeper

- **Requirement-level change & traceability** (5-phase requirement change process) → [07-requirements-management](../07-requirements-management/README.md) — the prerequisite the system-wide workflow scales up from (source: m4-change).
- **V&V methods & test types catalogue** → [16-verification-validation-methods](../16-verification-validation-methods/README.md) — the building blocks the continuous-testing pipeline reuses (source: m4-change).
- **Test plans & test cases** → [17-test-plans-cases](../17-test-plans-cases/README.md) — where the "key test requirements" from the Impact Analysis Report are detailed (source: m4-change).
- **Change-management tools by domain** (JIRA, Azure DevOps, GitHub/GitLab, IBM EWM, Windchill, Helix ALM, ServiceNow, BMC Remedy, Ansys ModelCenter, SAP CTS) and the WhatsApp large-scale case → source m4-changemgmt and the lesson video (source: m4-changemgmt).
- **BDD frameworks and CI/CD** — the sources name JUnit, PyTest, Google Test for unit testing and BDD scenarios for shift-left; consult those tools' docs to implement the pipeline (source: m4-change).
