# Writing Test Cases & Test Plans — Projects

## Guided project — test plan + 5 test cases for the cart feature

**Goal.** Produce a complete **test plan plus at least five test cases** for the "Add to Cart" feature of the e-commerce site www.thebeststore.com, modelled on the login worked examples (source: m4-ex-testcase; source: m4-testplans).

**Requirements / deliverables.**
1. One test plan with all eight components: Test Plan ID, Objective, Scope, Test Approach, Test Environment, Test Scenarios (≥5 with priorities), Risk Assessment (≥2 risk+mitigation pairs), Pass/Fail Criteria (source: m4-testplans).
2. Five+ test cases, each fully populated (ID, Title, Preconditions, Steps, Expected Result, Traceability, Priority), authored in the Testomat Description/Prerequisite/Steps+Expected/Expected-result template (source: m4-ex-testcase).
3. At least two cases must cover not-expected behaviours (e.g., add out-of-stock item; add then remove).

**Suggested steps & checkpoints.**
- *Milestone 1 — scope & objectives.* Write Objective and Scope limited to add-to-cart and cart update. **Done when:** scope explicitly names what is in and out (e.g., checkout is out of scope).
- *Milestone 2 — scenarios.* List ≥5 scenarios with priorities (e.g., add single item — High; add same item twice → quantity 2 — Medium; add then remove — Medium; add out-of-stock — High; cart total updates — High). **Done when:** every scenario has an ID and a priority.
- *Milestone 3 — approach & environment.* Choose methods (manual + automated; security/load if relevant) and pin browsers/OS/backend/tools. **Done when:** each chosen approach is justified by a scenario it covers.
- *Milestone 4 — cases.* Expand each scenario into a full test case in Testomat. **Done when:** all seven fields are filled and every case is independent (state set in Preconditions).
- *Milestone 5 — risks & pass/fail.* Add ≥2 risk+mitigation pairs and a single pass/fail rule. **Done when:** the rule is unambiguous (e.g., plan passes only if all cases pass with no errors).

## Independent (challenge) project — pick your own feature, end to end

**Goal.** Choose a feature from any system you know (login, search, file upload, checkout, password reset) and deliver a **complete test plan + 5+ test cases** that would convince a reviewer the feature is verified and validated.

**Constraints only:**
- Cover both functional and non-functional aspects — include at least one security or load/performance scenario (source: m4-testplans).
- Every test case must carry a Traceability field linking to a requirement (write the requirement statement if none exists), connecting back to [verifying requirements](../06-verifying-requirements/fundamentals.md).
- Prioritise coverage toward high-risk, critical functions; justify your priorities (source: m4-testplans).
- Define explicit entry and exit criteria for the plan (source: m4-testplans).
- Cumulative: have the *Test Approach* explicitly name the V&V methods it uses from [16-verification-validation-methods](../16-verification-validation-methods/README.md), and note how these cases would run continuously per [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md).

## Build notes & solution sketch

**Architecture.** A plan is the parent; scenarios are its children; each scenario expands into one independent test case. Author cases in Testomat under one project ("E-Commerce App") and a test suite, using the Description/Prerequisite/Steps+Expected/Expected-result template (source: m4-ex-testcase).

**Key decisions & why.**
- *Scope first.* Naming what is out of scope (checkout, payments) keeps the plan focused and the pass/fail rule meaningful (source: m4-testplans).
- *Priority by risk.* High to critical/security scenarios, Low to peripheral ones — mirrors TP_LOGIN where injection/XSS are High and Forgot-Password is Low (source: m4-testplans).
- *Independence via Preconditions.* Start each cart case from a known state (empty cart, specific product) so cases can run in any order (source: m4-testplans).

**Hard parts.**
- *Writing testable Expected Results.* Replace "cart works" with observable outcomes — item present, quantity correct, total/count updated (source: m4-ex-testcase).
- *Non-functional scenarios.* A load or security scenario needs the right approach and tools (e.g., Selenium/Postman as in TP_LOGIN) — don't invent UI steps beyond the source for Testomat (source: m4-testplans; source: m4-ex-testcase).
- *One pass/fail rule.* Decide up front, like TP_LOGIN: the plan passes only if all tests pass with no errors or warnings (source: m4-testplans).
