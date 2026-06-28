# Change Management & Continuous Validation — Exercises

## Warm-up (Tier 1 — recall from memory)

W1. From memory, list the five steps of impact analysis in order.
W2. From memory, list the six phases of the change control process in order.
W3. From memory, name the five principles of continuous testing.
W4. From memory, name the five Agile test types and one thing each checks.
W5. From memory, state who makes the final approval decision and what tool tracks the whole process.

## Core exercises (Tier 2 — apply at Bloom: Apply)

**C1 — Run the 5-step impact analysis (button move).** A product owner asks to move the **"Submit Payment"** button from the bottom to the top of the payment page to improve usability (source: m4-ex-impact). Produce: (a) at least four impacted areas with a one-line "why"; (b) at least three risks with consequences; (c) the items to update (test cases, design docs, user guides, training); (d) recommended validation steps. Then answer **should the change be done?** with reasoning.

**C2 — Guidance-fading pair (impact analysis).**

- *C2a (scaffolded):* For the checkout redesign (move payment-method selector above order summary, add icons), fill each step: Scope = ___ ; Risks/dependencies = ___ ; Cost/schedule = ___ ; Compliance/safety = ___ ; Stakeholder input = ___. (Answer key uses m4-change's numbers.)
- *C2b (faded):* A team wants to add a "save card for later" checkbox to the same checkout page. With no scaffold, run all 5 steps and name one mitigation step you'd put in the Impact Analysis Report.

**C3 — Design a continuous-testing pipeline.** For a payment app, specify what runs **on each commit** and name the test layer (and relative speed) for: a single function, two components talking, a full checkout workflow, and a load/security check. State where shift-left and fail-fast appear.

**C4 — Feynman ("explain it back").** In ≤120 words, explain to a new teammate why a UI change still needs a full change control process (impact analysis + CCB) even though "it's just moving a button." *Self-check rubric:* (a) names impact analysis as evidence-gathering; (b) names the CCB as the decision authority; (c) cites at least two non-obvious impacts (e.g., accessibility, automated UI tests); (d) mentions documentation/communication. Score 4/4 to pass.

## Challenge exercises (Tier 3 — analyze / evaluate)

**X1 — Interleaved set (decide which concept applies first).** For each task, first decide whether it is **impact analysis / change control** (this topic), **continuous testing** (this topic), **requirement-level change** ([07-requirements-management](../07-requirements-management/README.md)), or a **V&V method definition** ([16-verification-validation-methods](../16-verification-validation-methods/README.md)) — then act:

- (a) "Decide which components a proposed engine-component swap touches, and its cost and schedule."
- (b) "Wire the test suite to run on every pull request with fail-fast reporting."
- (c) "Trace a changed requirement back to the design elements that satisfy it."
- (d) "Define what 'demonstration' vs 'test' means as a verification method."
- (e) "Convene the board to approve or reject a change after reviewing its impact report."

**X2 — Compare shift-left vs end-of-cycle.** In a short table, contrast shift-left/continuous testing with traditional end-of-cycle testing on: *when tests run*, *feedback speed*, *defect cost*, *who writes tests first*. Then state which the source recommends and why.

**X3 — Evaluate a decision.** A team is two days from a critical release and proposes the "Submit Payment" button move because one manager "feels it's cleaner" (no user data). Using the source's decision criteria, recommend proceed / delay and justify with at least two "when to delay or reconsider" conditions.

**X4 — Build the map yourself.** Given these nodes — *Change Request*, *Initial Review*, *Impact Analysis*, *CCB Approval*, *Implementation & Testing*, *Documentation & Communication*, *Rejected* — draw the directed edges of the change control process, including both reject paths. (Compare against the diagram in [fundamentals.md](fundamentals.md).)

---

## Solutions & explanations

**W1.** (1) Identify change scope; (2) Assess risks and dependencies; (3) Estimate cost and schedule impact; (4) Evaluate compliance and safety risks; (5) Review stakeholder input (source: m4-change).

**W2.** (1) Change Request Submission; (2) Initial Review; (3) Impact Analysis; (4) Approval Process (CCB); (5) Implementation & Testing; (6) Documentation & Communication (source: m4-change).

**W3.** Shift-Left Testing; Test Automation in CI/CD; "Fail Fast" Feedback; Environment Consistency; Service Virtualization (source: m4-change).

**W4.** Unit (individual components/modules for correctness); Integration (how components interact — APIs, databases, third-party services); System (whole system vs functional + non-functional requirements, incl. performance/security/usability); Regression (new changes don't break existing functionality); UAT (end-users validate real-world needs) (source: m4-change).

**W5.** A **Change Control Board (CCB)** or relevant authority makes the final decision; **configuration management software (CMS)** — e.g. IBM DOORS for compliance — tracks the whole process (source: m4-change).

**C1 (answer key, from m4-ex-impact):**
- *Impacted areas:* UI Layout and Flow; Frontend Code; Accessibility Features; Automated UI Tests; User Documentation; Analytics/Tracking.
- *Risks:* Accidental Submissions (confirm before reviewing); Visual Clutter (button out of place / confuses expectations); Break in Test Automation (UI tests fail on element repositioning).
- *Items to update:* Test Cases; Design Documentation (mockups, layout-flow diagrams); User Manuals/Help Docs (screenshots, steps); Training Material.
- *Validation steps:* Regression Testing; Usability Testing; Cross-Browser/Responsive Testing; Accessibility Testing.
- *Decision:* **Yes, but with caution and proper planning** — moderate but mitigable risks, isolated to the frontend, no backend/business-logic change; proceed only with updated automated tests, usability + accessibility testing, and communication to support/docs/training (source: m4-ex-impact). *Common wrong answer:* "No, it's risky" — the risks are moderate and mitigable, so a flat no misreads the analysis.

**C2a (answer key, from m4-change):** Scope = CheckoutPage, PaymentOptions widget, responsive layout styles (3 front-end components). Risks/dependencies = icon-library version + localization pipeline dependencies; order-total-display regression + accessibility risks. Cost/schedule = ~16h design/implementation + ~8h cross-browser/mobile testing. Compliance/safety = accessibility → aXe audits + keyboard-navigation UAT. Stakeholder input = collate findings into the Impact Analysis Report before CCB approval; mitigation = feature-flag rollout (source: m4-change).

**C2b (model):** Scope = checkout form + persistence/storage layer for the saved card (this likely *does* touch backend, unlike the button move). Risks = security/PCI handling of stored card data, regression in payment flow, localization of the new label. Cost/schedule = larger than a pure-UI change (backend + security testing). Compliance/safety = payment-data compliance is a real safety/compliance risk — step 4 is the gate. Stakeholder input = security, legal, UX. Mitigation in the report: feature-flag rollout plus a security review. *Why harder:* unlike the button move, this changes data handling, so it is **not** isolated to the UI (contrast with C1) (source: m4-change, m4-ex-impact).

**C3 (model):** On each commit — build the code, run unit tests, execute integration and smoke tests, generate reports, optionally deploy to staging (source: m4-change). Layers: single function → **Unit** (Very Fast); two components → **Integration** (Fast); full checkout workflow → **End-to-End** (Slower); load/security → **Performance/Security** (Varies) (source: m4-change). Shift-left = write the BDD/acceptance test before the code; fail-fast = report failures immediately so defects don't accumulate (source: m4-change).

**C4.** Rubric self-scored. Strong answer: impact analysis gathers the evidence (scope, cost, dependencies, risks); the CCB — not the engineer — decides; non-obvious impacts include accessibility (screen readers/keyboard) and automated UI tests that reference the old position; documentation, user guides, and training must be updated and stakeholders notified (source: m4-change, m4-ex-impact).

**X1.** (a) impact analysis/change control (this topic) — scope + cost + schedule of the engine swap (source: m4-change). (b) continuous testing (this topic) — CI/CD on every PR with fail-fast (source: m4-change). (c) requirement-level change — traceability ([07](../07-requirements-management/README.md)). (d) V&V method definition ([16](../16-verification-validation-methods/README.md)). (e) change control — the CCB approval phase (this topic) (source: m4-change).

**X2 (model):**

| Aspect | Shift-left / continuous | End-of-cycle |
| :-- | :-- | :-- |
| When tests run | Every phase; per commit/PR/build | Once, at the end |
| Feedback speed | Immediate (fail-fast) | Late |
| Defect cost | Low (caught early) | High (costly rework) |
| Who writes tests first | Tests defined before/alongside code (BDD) | Code first, tests after |

The source recommends continuous testing: it provides rapid, ongoing feedback so defects are caught the moment they are introduced, preventing costly rework later (source: m4-change).

**X3 (model):** **Delay / reconsider.** Two of the source's stated delay conditions apply: (1) it's close to a critical release window and you don't want to risk layout instability; (2) the design change is based on assumption rather than user data or feedback. The value-vs-risk principle is not satisfied because there's no usability evidence, so the value doesn't clearly outweigh the risk right now (source: m4-ex-impact).

**X4.** Expected edges: Change Request → Initial Review; Initial Review —feasible→ Impact Analysis; Initial Review —not feasible→ Rejected; Impact Analysis → CCB Approval; CCB Approval —approved→ Implementation & Testing; CCB Approval —rejected→ Rejected; Implementation & Testing → Documentation & Communication. Matches [fundamentals.md](fundamentals.md) (source: m4-change).
