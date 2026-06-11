# Review-time audit (AI-generated code)

Loaded by `/mtdd-review` only. These checks run at review time, in addition to
acceptance-criteria ticking, and catch the four most common failure modes of
AI-generated diffs. (Write-time coding standards live separately in
[`coding-standards.md`](coding-standards.md).)

## 1. Context Gap — what got silently deleted

Diff the modification line-by-line and list every line that disappeared. For each deletion, classify: is it a `logger.*` call, a `db.commit()` / `session.save()`, an event-listener registration, a `useEffect` cleanup return, a middleware in the chain, an analytics / telemetry call, a side-effect import? Silent removal of any of these is a REJECT unless the task file explicitly authorized it.

React-specific: cleanup returns in `useEffect`, `key` props on lists, accessibility attributes (`aria-*`).

## 2. Phantom Dependencies — imports that don't exist

Grep every `import` / `require` / `from`. For unfamiliar packages, verify with `npm view <pkg>` (Node) or `pip index versions <pkg>` (Python) before approving.

High-risk prefixes/suffixes: `advanced_`, `smart_`, `auto_`, `fast_`, `@enterprise/*`, `*-pro`, `*-plus`, `*-advanced`, `*-utilities`, `*-helpers-pro`, `react-*-pro`, `next-*-helpers`.

Registry red flags: <10k weekly downloads, no publish in >2 years, no GitHub link, single-maintainer with no history.

## 3. Over-Engineering — shape disproportionate to problem

Apply YAGNI: would a plain function or 3 lines of inline code suffice? Stack-specific red flags:

- **Python**: Strategy/Factory/Builder for a 5-line problem; ABCs/Protocols for a one-off; class hierarchy where a function works.
- **Node**: DI container for a small service; event-emitter wrapping `fetch`; deep generic types for a fixed-shape function.
- **React**: HOC + render-prop + context + custom-hook for a single boolean toggle; Redux/Zustand for state that fits `useState`; `useMemo`/`useCallback` without measured need.

## 4. Test Theater — assertions that check existence, not behaviour

Read every assertion. Theatre smells:

- `expect(x).toBeDefined()`, `assert result is not None`, "renders without crashing", `expect(screen.getByText('Submit')).toBeInTheDocument()` and nothing else.

Real assertions check concrete values: `expect(score).toBe(15)`, `assert score == 15`, `expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' })`.

**Mutation check:** pick one line of business logic. If you mentally change it (e.g., `* 1.5` → `* 2`), does at least one test fail? If no — theatre. Confirm all three categories exist: happy path, error path, edge cases.

## 5. Risk matrix

| Dimension | Critical → **REJECT** | High → **MODIFY** | Medium → **REVIEW** |
| :--- | :--- | :--- | :--- |
| **Security** | string-interpolated SQL · `md5`/`sha1` for passwords · `Math.random`/`random` for tokens · plain-text secrets · `dangerouslySetInnerHTML` with user input · `eval`/`exec` with user input | weak/no rate limiting · missing input validation · permissive CORS · JWT in `localStorage` · whole-file reads on untrusted input | logging includes user IDs or emails · no audit trail · errors leak schema |
| **Ethics** | scoring by age / race / gender / religion / national origin | scoring by zip code · school prestige · "native speaker" · salary history | implicit demographic features · no fairness measurement across groups |
| **Reliability** | `except: pass` / empty `catch (e) {}` · no timeout on network calls · unhandled promise rejections · whole-file read on big input | manual resource management without `with`/`try-finally` · missing `useEffect` cleanup · single-retry only · no circuit breaker | `print`/`console.log` for logs · no structured logging · no log levels |

**Compounding rule:** multiple Mediums across dimensions = High system risk. Multiple Highs = Critical. **Any one Critical = automatic REJECT.**

## Audit verdict

- `ACCEPT` — every check is None or Medium with mitigation noted.
- `MODIFY` — anything is High, or multiple Mediums compound. Surface as commentary above the `<criteria>` block; do not auto-flip to REJECT unless blocking (per the existing review rules in `/mtdd-review`).
- `REJECT` — any Critical fires, OR Context Gap removed an unauthorized side-effect, OR any acceptance criterion is `[ ]`.
