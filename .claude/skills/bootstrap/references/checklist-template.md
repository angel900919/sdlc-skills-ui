# Refusal logic + checklist template

For `/bootstrap` Phases 1, 4, 6. The brownfield refusal grid, the tier-gated step
list, and the `.ai/bootstrap.md` file template.

## Refusal logic {#refusal-logic}

The probe is intentionally noisy toward refusing. A false refusal (a greenfield
repo with a stray `package.json`) costs the user one `--force`. A false acceptance
(bootstrapping over an existing app) corrupts working code.

**Filesystem probe** (Phase 1, always run — glob the repo root and one level deep; exclude `.ai/` and `.git/`):

- **Lockfiles:** `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `uv.lock`, `poetry.lock`, `Pipfile.lock`, `Gemfile.lock`, `go.sum`, `Cargo.lock`
- **Populated manifests:** `package.json` with non-empty `dependencies`/`scripts`; `pyproject.toml` with `[project]`; `Cargo.toml` with `[dependencies]`; `go.mod` with `require`
- **Compose files:** `docker-compose.yml`, `compose.yaml`, `compose.yml`
- **Source files:** count under `src/`, `app/`, `lib/`, `pages/`, `cmd/`, `internal/` — >5 is evidence of scaffolding

| Signal | Greenfield? | Action |
|---|---|---|
| `anchor.project_type=greenfield` + empty repo | ✓ | Proceed |
| `anchor.project_type=brownfield` | ✗ | `SKIPPED-BROWNFIELD → /research` |
| greenfield + lockfile present | ✗ | `BLOCKED-ON-CONTRADICTION → /coherence-check` |
| greenfield + populated `package.json` | ✗ | `BLOCKED-ON-CONTRADICTION → /coherence-check` |
| greenfield + 6+ files in `src/` | ✗ | `BLOCKED-ON-CONTRADICTION → /coherence-check` |
| `--force` flag | proceed | frontmatter `forced: yes` + body `WARNING:` line listing what was overridden |

## Tier-gated steps

Every step: title · grounded command(s) (Phase 3 — real package + major version + lockfile discipline) · a `✓ Verify:` line. Derive component roots from architecture's component list, never a stock template.

**Prototype** — minimum to run (cap 90 lines):
1. Init project scaffold (the grounded create-CLI, e.g. `npm create vite@latest`, `uv init`, `cargo new`)
2. Install dependencies (`--frozen-lockfile` discipline)
3. Run dev server / app
4. Verify "hello world" response

**MVP** — add to prototype (cap 185):
5. Init each component root from architecture (per-component scaffold)
6. `.env.example` with required keys (from anchor: `db`, `auth`, AI provider, …)
7. `docker-compose.yml` for db + infra services named in architecture
8. `docker compose up -d` + verify each service health
9. db migrations folder + an empty migration round-trip
10. Root dev scripts (`dev`, `test`, `typecheck`, `lint`)
11. Full test-runner round-trip (0 tests passing is OK)
12. Basic CI (`.github/workflows/ci.yml` or equivalent): typecheck + test on push/PR

**Production** — add to mvp (cap 250):
13. Observability scaffold (structured logger config + healthcheck endpoint per component)
14. Secrets wiring (no plaintext — `.env.example` only; real secrets via anchor's named provider)
15. Extend CI: lint + build (+ coverage gate); verify via `act` or a green no-op commit
16. Red-zone gates if `anchor.security_gate.red_zone_gates` (e.g. db migrations require manual approval)

## File template {#file-template}

```markdown
---
name: bootstrap
project_type: greenfield
project_tier: mvp
generated_at: <date>
status: in-progress      # in-progress | complete
forced: no               # yes if --force was used
anchor_ref: .ai/anchor.md
architecture_ref: .ai/architecture/02-components.md
---

# Bootstrap checklist — `<project-name>`

**Stack:** <stack from anchor>.
**Components:** `<web/>`, `<api/>`, … (per architecture).
**Tier:** mvp.
**Toolchain grounded via Context7:** next@15 (/vercel/next.js) · drizzle-kit@0.30 (/drizzle-team/drizzle-orm) · postgres:16 — verified <date>.

## Prerequisites (one-time, machine-level)
- [ ] <runtime> installed (`<cmd> --version` → expected)
- [ ] Docker running (`docker info` exits 0)   # mvp+

## Steps

### 1. Init scaffold
\`\`\`bash
<grounded create command — real CLI, current flags>
\`\`\`
✓ Verify: <one-line check>.

### 2. <component root> …
… (one section per step; every command grounded, every step verified)

## Flags / unverified (if any)
- ⚠ `<pkg>` — not in anchor.approved_dependencies; add via /anchor before relying on step N.
- ⚠ `<tool>` — could not ground via Context7; confirm it exists before running step M.

## Verdict
- [ ] All steps verified → re-run `/bootstrap` to flip `status: complete` → unlocks `/prd`.
```

The example commands are placeholders — the real `bootstrap.md` replaces them with
the stack-specific, Context7-grounded commands from Phase 3. Prototype omits
Docker/db/CI; production adds observability + secrets + extended CI. Keep under the
tier line cap — if over, cut machine-level prerequisites or merge sub-steps.
