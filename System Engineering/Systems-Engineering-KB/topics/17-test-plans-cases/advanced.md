# Writing Test Cases & Test Plans — Advanced concepts

## Advanced concepts

- **Per-step expected results as gates.** Beyond the case-level Expected Result, each step can carry its own expected result so the tester knows whether to proceed to the next step — turning a case into a sequence of gated checkpoints rather than one all-or-nothing assertion (source: m4-testplans).
- **Mixed-method approach in one plan.** A single plan's Test Approach can combine manual, automated, security, and load testing, each targeting different scenarios (UI feedback → manual; boundary/repetitive → automated; injection/XSS → security via Postman/Burp Suite; rate-limiting → load). The plan, not the individual case, is where method selection is reasoned across the V&V catalogue (source: m4-testplans).
- **Entry/exit criteria.** Best practice is to define when testing starts and ends, making the plan a stateful process with explicit boundaries — not just a checklist (source: m4-testplans).

## Edge cases & gotchas

- **Strict pass/fail rule.** TP_LOGIN passes only if ALL tests pass without any issues; *any* error OR warning means the plan does not pass — warnings are not tolerated (source: m4-testplans). A weaker rule (e.g., "majority pass") changes the plan's meaning entirely.
- **Environment ≠ production.** Test environment data may not reflect production; mitigate with representative test accounts and scrubbed production datasets, or defects hide until release (source: m4-testplans).
- **Brittle automation.** Automated scripts are brittle to UI changes; mitigate with resilient selectors maintained alongside UI updates, or the suite rots as the UI evolves (source: m4-testplans).
- **Not-expected behaviours are required.** Cases must include both expected and not-expected behaviours; a suite of only happy paths can pass while the system mishandles invalid input, lockout, or injection (source: m4-testplans).

## Performance, production & security considerations

- **Security testing is in scope of authoring.** The plan template explicitly accommodates security tests (SQL injection, XSS) and the tools to run them (Postman, Burp Suite) — security is a first-class scenario class, not an afterthought (source: m4-testplans).
- **Load/performance.** Load tests verify rate-limiting under high-fail conditions; non-functional testing (usability, performance, security) is a stated best practice alongside functional testing (source: m4-testplans).
- Continuous execution of these artifacts (CI/CD, continuous validation) is owned by [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md).

## Where to go deeper

- **m4-testplans** — the canonical source for the full TP_LOGIN plan, the eight TS scenarios, and the strict pass/fail rule.
- **m4-ex-testcase** — the Testomat authoring workflow (project → test suite → test case) and the case template; deeper tool specifics beyond the source are not covered here.
- **[16-verification-validation-methods](../16-verification-validation-methods/README.md)** — the method/type definitions a plan's Approach selects from.
