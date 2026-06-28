# Writing Test Cases & Test Plans — Exercises

## Warm-up

From memory (Tier 1 — recall):

1. List the fields a test case usually includes before execution, and the two added after execution.
2. List the eight components a test plan should include.
3. State the three qualities a good test case must have.
4. Which two test-case fields are optional?
5. Name the four parts of the Testomat test-case template used in the cart exercise.

## Core exercises

**C1 (apply — write a case from a requirement).** Given the requirement *"REQ-LOGIN-01: The system shall allow registered users to log in with email and password,"* write a complete test case with all seven fields. (This is the worked TC_LOGIN_01; do it before checking.)

**C2 (apply — write a case from a scenario).** Take scenario *TS04 "Login attempt with both fields blank"* (Medium priority) from the TP_LOGIN plan and expand it into a full test case. Make sure the Expected Result is a not-expected behaviour, not a redirect.

**C3 (guidance-fading pair).**
- *3a (more scaffolding):* the Title, Preconditions, and Steps for a cart "Add to Cart" case are given — fill only the Expected Result:
  - Title: Verify clicking "Add to Cart" adds the item and the cart updates
  - Preconditions: site reachable, a product page open, cart empty
  - Steps: 1) click "Add to Cart"; 2) open the cart
  - Expected Result: **______**
- *3b (less scaffolding):* given only the scenario *TS08 "Verify 'Forgot Password' link navigates to reset workflow"* (Low priority), write the full test case.

**C4 (analyze — critique a vague case).** Critique this case against the qualities simple/clear, independent, relevant; rewrite the weak fields:

| Field | Details |
|---|---|
| Test Case ID | T1 |
| Title | Test login |
| Preconditions | Use the account from the previous test |
| Steps | Log in |
| Expected Result | It works |

**C5 (Feynman — explain it back).** In 4–5 sentences, explain to a teammate the difference between a test case's *Expected Result* and a test plan's *Pass/Fail Criteria*, and where each lives. *Self-check rubric:* (a) you said the Expected Result is the per-case pass/fail line; (b) you said the plan's criteria roll up over all cases; (c) you gave the TP_LOGIN rule (passes only if ALL tests pass, no errors/warnings); (d) you noted a step can have its own expected result.

## Challenge exercises

**X1 (analyze/evaluate — prioritise coverage).** Given the eight TP_LOGIN scenarios with their priorities (TS01–TS08), justify why TS06 (SQL injection) and TS07 (XSS) are High while TS08 (Forgot Password) is Low, in terms of "prioritise high-risk and critical functions." Then state which test approach (manual/automated/security/load) you'd assign to each of TS01, TS05, TS06, TS08.

**X2 (interleaved — pick the concept first).** For each item, first decide whether it belongs to **this topic (test case/plan authoring)**, to **[16-verification-validation-methods](../16-verification-validation-methods/README.md)** (a V&V *method/type*), or to **[18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md)** (continuous testing / CI-CD) — then answer:
- (a) "Acceptance testing vs system testing" — which topic owns the definitions?
- (b) "What goes in the Risk Assessment field?"
- (c) "Running the test suite automatically on every commit."
- (d) "Writing the Expected Result line for TS02."

**X3 (build the map yourself).** Nodes: `Requirement`, `Test Case`, `Traceability field`, `Test Plan`, `Test Scenario`, `Actual Result + Pass/Fail Status`, `Plan Pass/Fail Criteria`. Draw the directed edges and label each (e.g., "drives", "lists", "rolls up to"). Check against the fundamentals diagram.

**X4 (assemble a mini plan).** For the cart feature on www.thebeststore.com, write a small test plan with all eight components: Test Plan ID, Objective, Scope (limit to add-to-cart and cart update), Test Approach, Test Environment, at least three Test Scenarios with priorities, one Risk + Mitigation, and Pass/Fail Criteria.

---

## Solutions & explanations

**Warm-up**
1. Before: Test Case ID, Test Description (Title), Preconditions, Test Steps, Expected Result, plus optional Traceability and Priority. After: Actual Result, Pass/Fail Status (source: m4-testplans).
2. Test Plan ID, Objective, Scope, Test Approach, Test Environment, Test Scenarios, Risk Assessment, Pass/Fail Criteria (source: m4-testplans).
3. Simple/clear (precise instructions), independent (not dependent on another case's results), relevant to actual use cases including expected and not-expected behaviours (source: m4-testplans).
4. Traceability and Priority (source: m4-testplans).
5. Description, Prerequisite, Steps (with per-step Expected), Expected result (source: m4-ex-testcase).

**C1.** The model answer is TC_LOGIN_01 in [examples.md](examples.md#simple-example--a-fully-worked-test-case-tc_login_01) — ID, Title, Preconditions, Steps, Expected Result, Traceability REQ-LOGIN-01, Priority High (source: m4-testplans).

**C2 (TS04).** Expected: ID e.g. TC_LOGIN_04; Title "Verify login is rejected when both fields are blank"; Preconditions: registered user, browser on login page; Steps: 1) leave Username blank, 2) leave Password blank, 3) click Login; Expected Result: an appropriate error message is shown (e.g. fields required) and the user is NOT redirected to the dashboard; Traceability: the objective "Confirm appropriate error messages for invalid or missing inputs"; Priority Medium (source: m4-testplans). *Common wrong answer:* expecting a redirect — TS04 is a not-expected-behaviour case.

**C3a.** Expected Result: the cart opens and shows the added item with the correct quantity, and the cart count/total updates to reflect the addition (source: m4-ex-testcase).
**C3b (TS08).** ID e.g. TC_LOGIN_08; Title "Verify the 'Forgot Password' link navigates to the reset workflow"; Preconditions: browser on login page; Steps: click the "Forgot Password" link; Expected Result: the password-reset workflow page opens; Traceability: TP_LOGIN scope (error/recovery flows); Priority Low (source: m4-testplans).

**C4.** Faults: **ID** "T1" is acceptable as a unique id but uninformative; **Title** "Test login" is not specific (violates clear); **Preconditions** "use the account from the previous test" violates *independence* — re-establish state instead; **Steps** "Log in" is not precise (violates simple/clear); **Expected Result** "It works" gives no pass/fail line (violates clarity/relevance). Rewrite toward TC_LOGIN_01: a descriptive title, self-contained preconditions ("user X is registered, browser on login page"), explicit steps (enter username, enter password, click Login), and an observable Expected Result (redirect to /dashboard, welcome message) (source: m4-testplans).

**C5.** Rubric items (a)–(d) above. Anchor: Expected Result "is the overall result after finishing all the steps and is basically the pass/fail criteria" for that case; the plan's Pass/Fail Criteria roll up over all cases — TP_LOGIN passes only if ALL tests pass with no errors or warnings; a step may carry its own expected result so the tester can decide whether to proceed (source: m4-testplans).

**X1.** SQL injection and XSS are High because they are security-critical, high-risk functions — "prioritise test coverage: focus on high-risk and critical system functions first"; Forgot Password is a peripheral recovery convenience, hence Low (source: m4-testplans). Approach assignment (consistent with the plan's four approaches): TS01 → manual + automated; TS05 → automated/load (rate-limit/lockout under repeated fails); TS06 → security (e.g. via Postman/Burp Suite); TS08 → manual (source: m4-testplans).

**X2.** (a) topic 16 — it owns the V&V *methods/types* catalogue. (b) this topic — Risk Assessment is a test-plan component (potential risks + mitigations) (source: m4-testplans). (c) topic 18 — continuous testing / CI-CD. (d) this topic — writing a case's Expected Result.

**X3.** Edges: Requirement —drives→ Test Case; Test Case —linked back by→ Traceability field —points to→ Requirement; Test Plan —lists→ Test Scenario; Test Scenario —expands into→ Test Case; Test Case —executed, yields→ Actual Result + Pass/Fail Status —rolls up to→ Plan Pass/Fail Criteria (source: m4-testplans). Compare with [fundamentals.md](fundamentals.md#how-it-fits-together-diagram).

**X4.** A correct answer mirrors TP_LOGIN's structure scoped to the cart: e.g. Test Plan ID `TP_CART`; Objective "validate add-to-cart and cart update"; Scope add-to-cart + cart total/count; Approach manual + automated (and optionally security/load); Environment latest browsers, a staging store with test products; Scenarios e.g. add single item (High), add same item twice → quantity 2 (Medium), add then remove (Medium), each with priority; Risk: test catalogue data may not match production → Mitigation: representative test products / scrubbed data; Pass/Fail: plan passes only if all scenarios pass with no errors (source: m4-testplans; source: m4-ex-testcase).
