# Coding Standards (write-time)

Write-time rules applied by `/mtdd-implement` as it codes and checked by `/mtdd-review` as it judges. Edit this file directly to evolve the rules — it is the source of truth. (The review-time AI-generated-code audit lives separately in [`ai-code-audit.md`](ai-code-audit.md).)

## Testing

- Every behavioural change MUST include tests.
- Tests must cover documented acceptance criteria and reasonable edge cases.
- Test names read like a spec — they describe **what** the system does, never **how**.
- Tests must survive an internal refactor. If renaming a private helper breaks a test, the test is wrong.
- One logical assertion per test.
- Do not leave failing or skipped tests on the branch.

## Mocking

- Mock ONLY at system boundaries (external APIs, time, randomness).
- Never mock your own modules, internal collaborators, or anything you control.
- Prefer dependency injection over creating dependencies inside functions.

## Architecture

- Keep modules focused on a single responsibility.
- Do not mix UI rendering with business logic.
- Avoid modifying unrelated parts of the codebase.
- Prefer small, targeted changes over large refactors.

### Deep modules

- Prefer **deep modules**: a small interface hiding a lot of behaviour.
- Avoid **shallow modules**: an interface nearly as complex as the implementation.
- Run the **deletion test** on every new abstraction: imagine deleting it. If complexity vanishes (it was a pass-through), delete it. If complexity reappears across N callers (it was earning its keep), keep it.
- If a module is shallow, either deepen it (push more behaviour behind the interface) or inline it into the caller. Three similar lines at the call site beat a premature wrapper.

## Safety

- Do not introduce security risks (injection, unsafe parsing, secret exposure).
- Validate inputs at system boundaries.
- Do not hardcode credentials or sensitive data.

## Maintainability

- Remove dead or commented-out code.
- Keep functions small and focused.
- Avoid unnecessary abstractions.
- Write code that is easy to debug and extend.
- Default to writing no comments. Only add one when the WHY is non-obvious.
