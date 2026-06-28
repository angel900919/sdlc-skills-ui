# Writing Test Cases & Test Plans — Examples

Guidance fades across these examples: a fully worked test case, then a partially blanked one, then a fresh case with only a strategy hint, then a full plan built section by section.

## Simple example — a fully worked test case (TC_LOGIN_01)

**Goal:** write a test case to verify login functionality in a web application (source: m4-testplans).

The title should clearly describe exactly the test. Preconditions are any setup needed before the test — here the user must exist and the browser should be open on the login page. The steps must be very clear and may contain the expected result for each step, so the tester knows whether to proceed. The Expected Result is the overall result after all steps and is basically the pass/fail criteria. Traceability and Priority are optional but help link to requirements and filter by priority (source: m4-testplans).

| Field | Details |
|---|---|
| **Test Case ID** | TC_LOGIN_01 |
| **Title** | Verify that a registered user can log in with valid credentials |
| **Preconditions** | 1. User "testuser@example.com" is registered<br>2. Browser is open on the login page |
| **Steps** | 1. Enter "testuser@example.com" into the Username field<br>2. Enter "P@ssw0rd!" into the Password field<br>3. Click the Login button |
| **Expected Result** | 1. User is redirected to the dashboard (/dashboard)<br>2. A welcome message "Welcome, Test User!" is displayed |
| **Traceability** | REQ-LOGIN-01: "The system shall allow registered users to log in with email and password." |
| **Priority** | High |

*(source: m4-testplans)*

Why each line: the **ID** makes it referenceable; the **Title** says what is verified; **Preconditions** put the system in a known state so the case is independent; **Steps** are reproducible actions; **Expected Result** is the observable pass/fail line; **Traceability** proves it covers REQ-LOGIN-01; **Priority** lets you run High-priority tests first.

## Intermediate example — completion problem (shopping-cart CART_001)

Author this in the **Testomat** Description / Prerequisite / Steps+Expected / Expected-result template (source: m4-ex-testcase). You are validating that clicking **"Add to Cart"** on a product at www.thebeststore.com adds the item correctly and the cart updates accordingly (source: m4-ex-testcase). The first fields are done; **fill the two blanked lines** (see Solutions).

```
### Description
Verify that clicking "Add to Cart" on a product page adds the item to the cart
and the cart count/total updates correctly.

### Prerequisite
- The site www.thebeststore.com is reachable and a product page is open
- The cart is empty at the start of the test

### Steps
1. On a product page, click the "Add to Cart" button
   *Expected:* A confirmation appears that the item was added
2. Open the cart
   *Expected:* ______(A) the cart shows the added item

### Expected result
______(B) the whole-test pass/fail line
```

*(template and scenario: source: m4-ex-testcase; field meanings: source: m4-testplans)*

## Advanced example — fresh case from a strategy hint only

**Scenario:** write a test case for TS05 from the login plan — "Login attempt after account is locked due to 5 failed attempts" (source: m4-testplans).

**Strategy hint only:** the precondition must put the account into the *locked* state (this is a not-expected-behaviour case, so the expected outcome is a *refusal*, not a dashboard); link Traceability to the lockout requirement; set Priority per the plan (TS05 is High). Produce all seven fields. A model answer is in Solutions.

## Real-world case study — the TP_LOGIN test plan

**Situation:** verify the login functionality of a web application under different conditions (source: m4-testplans).

**Approach:** the plan, TP_LOGIN, sets four objectives — authenticate valid users, show appropriate error messages for invalid/missing inputs, lock accounts after repeated failures, and ensure security measures such as rate limiting and input validation. Its scope covers successful login, invalid inputs, account lockout, and security checks. The test approach mixes manual testing (UI feedback, error messages, visuals), automated scripts (repetitive and boundary cases), security tests (SQL injection, XSS via Postman and Burp Suite), and load tests (rate-limiting under high-fail conditions). The environment names browsers (Chrome, Firefox, Edge latest), OSes (Windows 10, macOS 12, Ubuntu 20.04), a staging backend with pre-loaded test users, and tools (Selenium WebDriver, Postman, Browser DevTools). Eight scenarios (TS01–TS08) are listed with priorities, and risks are paired with mitigations (source: m4-testplans).

**Outcome:** a single pass/fail rule governs it — the plan passes only if ALL tests pass without any issues; any error or warning means the plan does not pass (source: m4-testplans).

**Lesson:** a good plan decides *which* checks run (scenarios), *how* (approach), *where* (environment), *what could go wrong* (risks), and *what counts as success* (criteria) — before any case is executed.

## Guided walkthrough — building TP_LOGIN section by section

Narrated start to finish; every value is quoted from the source (source: m4-testplans).

1. **Test Plan ID** — assign a trackable id: `TP_LOGIN`.
2. **Objectives** — list what the plan achieves:
   - Validate that registered users can authenticate with valid credentials.
   - Confirm appropriate error messages for invalid or missing inputs.
   - Verify account lockout after repeated failed attempts.
   - Ensure security measures (e.g., rate limiting, input validation) are in place.
3. **Scope** — "This test plan covers verification of the web application's login feature under various conditions, including successful login, invalid inputs, account lockout, and security checks. It ensures that the login process meets functional requirements and handles error conditions gracefully."
4. **Approach** — choose methods from the V&V catalogue:
   1. Manual testing for UI feedback, error messages, and visual elements.
   2. Automated scripts for repetitive and boundary cases.
   3. Security tests (e.g., SQL injection, XSS) via Postman and Burp Suite.
   4. Load tests to ensure rate-limiting works under high-fail conditions.
5. **Environment** — pin the configuration:
   - Browsers: Chrome (latest), Firefox (latest), Edge (latest)
   - OS: Windows 10, macOS 12, Ubuntu 20.04
   - Backend: Staging environment with test users pre-loaded
   - Tools: Selenium WebDriver, Postman, Browser DevTools
6. **Scenarios & Priority** — list the tests that must execute for the plan to pass:

   | Scenario ID | Description | Priority |
   |---|---|---|
   | TS01 | Successful login with valid email and password | High |
   | TS02 | Login attempt with invalid password | High |
   | TS03 | Login attempt with invalid email format | Medium |
   | TS04 | Login attempt with both fields blank | Medium |
   | TS05 | Login attempt after account is locked due to 5 failed attempts | High |
   | TS06 | SQL injection attempt in username and password fields | High |
   | TS07 | Cross-site scripting (XSS) attempt in input fields | High |
   | TS08 | Verify "Forgot Password" link navigates to reset workflow | Low |

7. **Risks & Mitigations**:
   - Risk: test environment data may not reflect production. Mitigation: use representative test accounts and scrubbed production datasets.
   - Risk: automated scripts brittle to UI changes. Mitigation: use resilient selectors and maintain scripts alongside UI updates.
8. **Pass/Fail criteria** — "The test plan passes if ALL tests passed without any issues. If any error or warning is shown, the test plan will not pass."

---

## Solutions

### Intermediate (CART_001) — blanked lines

- **(A)** *Expected:* the cart opens and shows the added item with the correct quantity (1) and the cart count/total updated to reflect it.
- **(B)** **Expected result:** the item is added correctly and the cart updates accordingly — i.e., the product appears in the cart with the right quantity and the cart total/count reflects the addition (source: m4-ex-testcase). *(The exercise's own solution is the test case saved in Testomat; this is a faithful, source-grounded completion.)*

### Advanced (TS05) — model test case

| Field | Details |
|---|---|
| **Test Case ID** | TC_LOGIN_05 |
| **Title** | Verify login is refused after the account is locked due to 5 failed attempts |
| **Preconditions** | 1. User "testuser@example.com" is registered<br>2. The account is in the *locked* state after 5 consecutive failed login attempts<br>3. Browser is open on the login page |
| **Steps** | 1. Enter "testuser@example.com" into the Username field<br>2. Enter the correct password "P@ssw0rd!" into the Password field<br>3. Click the Login button |
| **Expected Result** | Login is refused even with valid credentials; an account-locked message is shown and the user is NOT redirected to the dashboard |
| **Traceability** | Requirement covering account lockout after repeated failed attempts (per TP_LOGIN objective: "Verify account lockout after repeated failed attempts") |
| **Priority** | High (TS05 priority) |

*(scenario, objective, and priority: source: m4-testplans; this expands TS05 into a full case)*
