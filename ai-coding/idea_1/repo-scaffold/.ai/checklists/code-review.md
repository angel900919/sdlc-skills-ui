# Code Review Checklist

_For a fresh-context reviewer (human or subagent). Review the diff against the plan.
Scope: flag correctness and requirement gaps, NOT style preferences (tooling owns style).
A reviewer told to "find gaps" will invent some — stay disciplined to real issues._

## Correctness
- [ ] Every plan requirement is implemented and has a test
- [ ] Nothing outside the task's scope changed
- [ ] Edge cases and error paths handled (not just the happy path)
- [ ] End-state verified, not just claimed (the thing actually happens, e.g. row written)

## Tests (see `.ai/checklists/` and the Testing guide)
- [ ] Tests can actually fail (not tautologies; assertions constrain behavior)
- [ ] The subject under test isn't mocked away
- [ ] Asserted values match the spec, not the implementation (no "bug freezing")
- [ ] No ordering/timing/randomness dependence

## Safety
- [ ] No secrets, no PII in logs
- [ ] Protected paths untouched or approved
- [ ] No new combination of private-data + untrusted-input + open-egress

## System hygiene
- [ ] Recurring issue? → propose a standards line, lint rule, or hook, not just a one-off fix
