# Brownfield recovery checklist — confirm, don't invent

Consulted by Phase 2 when `anchor.project_type: brownfield`. The repo already votes: a
strategy that contradicts 200 existing tests is fiction. Recover what exists, cite it,
confirm it with the user (the `/comprehend` discipline), and only fill genuine gaps with
`(new)` conventions.

## Step 1 — Harvest recon first

Read `.ai/recon.md` before touching disk: Section A (repo shape — test dirs, CI), Section D
(decisions already made — test tooling choices), Section E (gaps — e.g. "no integration
tests", "fixtures duplicated across modules"). Reuse its citations; don't re-derive them.

## Step 2 — Detect from disk (each finding cites file:line)

| Recover | Look at | Record as |
| :-- | :-- | :-- |
| Test framework + runner | manifest devDependencies / `pyproject.toml` / `go.mod`; config files (`vitest.config.*`, `pytest.ini`, `jest.config.*`, `conftest.py`); CI test step | `test_framework` (e.g. `pytest 8 — pyproject.toml:41`) |
| Test layout + naming | where test files actually live; dominant naming pattern (count both if mixed — the majority is the convention, the minority is a recorded inconsistency) | pyramid `naming`/`location` rows |
| Fixture/factory patterns | `tests/factories/`, `conftest.py` fixtures, `__fixtures__/`, helper modules; factory libs in the lockfile | `fixture_style`, `fixture_library`, acquisition-table rows for entities already covered |
| Test db setup | test config db URL; transaction/truncate hooks (`conftest.py` db fixture, `setup/teardown`, testcontainers usage); docker-compose test services | `## Test database & services` |
| Seed scripts | `scripts/seed*`, manage commands, SQL dumps, `db/seeds/` | `## Seed data` (or its absence — a gap) |
| Existing E2E | `e2e/`, `cypress/`, `playwright.config.*`, integration CI jobs | seed rows for the journey table (map existing specs to understanding behaviors) |
| Real-data exposure | `.env`/test config pointing at prod-like data; SQL dumps or CSVs committed under tests | feeds the `## Brownfield data rule` (mandatory with pii/regulatory uplift) |

Keep the scan cheap: targeted globs + reading the handful of config/fixture files —
this is convention recovery, not a re-run of `/explore`.

## Step 3 — Confirm with the user, per cluster

Read the picture back in plain English, one cluster at a time, recommendation first:

> "You already test with pytest and factory_boy — factories live in `tests/factories/`
> (`tests/factories/user.py:12`), and each test runs inside a rolled-back transaction
> (`conftest.py:33`). I'd lock these as-is. Keep them, or change something?"

- Confirmed → recorded with its citation; `recovered_from_repo: true`.
- Corrected → the user's answer wins; note the divergence ("repo does X at file:line; locking Y — existing tests migrate opportunistically, not as a big-bang rewrite").
- Genuinely absent (no seed script, no E2E) → propose a convention marked `(new)` in the artifact — this is the only place invention is allowed.

## Anti-patterns

- Proposing the greenfield default when the repo already does something else — recover first, always.
- An uncited "the repo uses X" claim — no citation, no claim.
- Treating a one-off helper in a single test file as "the convention" — conventions need ≥2 call sites or a config-level footprint.
- Prescribing a migration of all existing tests to the new convention — out of scope; the strategy governs *new* tests, and notes the legacy pattern so reviewers recognize it.
