---
name: bootstrap
description: |-
  Produces .ai/bootstrap.md — an ordered, copy-pasteable checklist that turns a locked stack (/anchor) + architecture (/architect) into a runnable greenfield project skeleton (scaffold, component roots, Docker, migrations, .env.example, dev scripts, CI). Greenfield only — refuses on brownfield via the anchor claim AND a filesystem probe. Tier-aware (90/185/250 line cap). Grounds every tool, scaffolder, and version it emits through Context7 (resolve-library-id + query-docs) so commands name real packages with current CLI syntax — no phantom or stale libraries — staying within anchor's approved_dependencies, naming the major version + --frozen-lockfile. Use when "/bootstrap", "scaffold the project", "set up the skeleton", "project setup", "before slice 1", or after /architect on a greenfield project. Do NOT use for: per-feature code (/design, /plan), stack lock (/anchor), HLD (/architect), or scaffolding over existing code (brownfield → /research).
allowed-tools:
  - Read
  - Glob
  - Write
  - mcp__context7__resolve-library-id
  - mcp__context7__query-docs
---

# bootstrap — runnable project-skeleton checklist

Greenfield-only generator: turns a locked stack + architecture into an ordered checklist of
copy-pasteable, Context7-grounded commands + verification lines that the user (or `/run`) executes.

<what-to-do>

## Critical rules (read before starting)

1. **Refuse on brownfield.** `anchor.project_type: brownfield` → refuse, route to `/research`, write nothing.
2. **Defense-in-depth probe.** Even if anchor says greenfield, scan the filesystem ([Refusal logic](references/checklist-template.md#refusal-logic)). Lockfiles / populated manifests / >5 source files under conventional dirs → treat as brownfield-by-evidence and refuse with the files cited. On-disk evidence beats anchor's claim.
3. **Require anchor + architecture.** Read `.ai/anchor.md` (stack) AND `.ai/architecture.md` (prototype) or `.ai/architecture/02-components.md` (mvp/production). Missing → `BLOCKED-ON-ANCHOR` / `BLOCKED-ON-ARCHITECT`.
4. **Read tier from anchor.** `project_tier` is the contract — prototype gets the short list, production the long one. Never ask production-grade setup for a prototype.
5. **Ground every named tool/package/version (Phase 3) — never emit a phantom.** Every scaffolder, package, and base image the checklist names is verified via Context7 before it's written. Bootstrap names **only** tools implied by anchor's locked stack + `approved_dependencies` — it does not introduce application libraries (that's `/design` per feature). A tool the stack needs but anchor didn't list is **flagged** (a `dep_adds`-style note for the next `/anchor`), never silently emitted. Apply the slopsquatting fingerprint and the existing-dep bias from [`../design/references/deps-governance.md`](../design/references/deps-governance.md). If Context7 can't resolve a name, do **not** write its install line — substitute the anchor-approved equivalent or flag the step `unverified`.
6. **Version policy: name the major + lean on the lockfile.** Emit the **major** version you verified (`next@15`, `postgres:16`) — not a pinned patch (it goes stale) — and pair every install with `--frozen-lockfile` (or the ecosystem equivalent: `uv sync --frozen`, `cargo install --locked`, `go mod download` + committed `go.sum`) so the committed lockfile, not a floating tag, is the source of truth at install time.
7. **Ordered, with verification.** Every step has a copy-pasteable command AND a one-line `✓ Verify:` check (e.g. `✓ curl localhost:3000 returns 200`). No verification → the step doesn't count.
8. **Concrete file paths from architecture.** If architecture names `web/` and `api/` roots, the checklist uses those — not generic "frontend/backend." Derive steps from the component list, never a stock template (a CLI-only project gets no phantom `web/` step).
9. **Project wiring only — not domain code.** Docker, root dirs, CI, env, dev scripts. Per-bounded-context domain scaffolding and per-feature code are a separate concern — `/design` + the build phase own them.
10. **Idempotent on re-run.** `.ai/bootstrap.md` with `status: complete` → don't overwrite; restate and ask which step to revisit, or accept `--update`.
11. **Hard tier line cap:** 90 / 185 / 250. Over → you're listing too much for the tier.
12. **Maintain `.ai/progress-tracker.md`** per [`../_build_share/PROGRESS-TRACKER.md`](../_build_share/PROGRESS-TRACKER.md): read top 5 at Phase 0; append on a success verdict (`READY-FOR-PRD` / `IN-PROGRESS`). Skip on `STATUS-COMPLETE`, `SKIPPED-BROWNFIELD`, and `BLOCKED-*`.
13. **Issue exactly one verdict** (Phase 7 table).

## Procedure

```
bootstrap progress:
- [ ] Phase 0: Load progress-tracker top 5; detect .ai/bootstrap.md (update mode if present)
- [ ] Phase 1: Refusal gate — anchor.project_type + filesystem probe
- [ ] Phase 2: Read anchor.md + architecture artifact
- [ ] Phase 3: Ground the toolchain via Context7 (verify every tool/package/version)
- [ ] Phase 4: Assemble checklist (tier-gated steps; grounded commands only)
- [ ] Phase 5: Read back; collect corrections
- [ ] Phase 6: Write .ai/bootstrap.md (enforce tier line cap)
- [ ] Phase 7: Append progress-tracker entry (success only); issue verdict
```

### Phase 0 — Detect existing bootstrap.md

Read `.ai/progress-tracker.md` top 5 for session context (expect an `architect landed` entry upstream). Then read `.ai/bootstrap.md`: `status: complete` → restate ("Already bootstrapped — `<N>` steps, all verified"), ask whether to `--update` against changed anchor/architecture or revisit a step; default to `STATUS-COMPLETE`. `status: in-progress` → restate which steps are checked, ask to continue or regenerate. Absent → Phase 1.

### Phase 1 — Refusal gate

Read `.ai/anchor.md` (absent → `BLOCKED-ON-ANCHOR`). Always run the filesystem probe even if anchor says greenfield (signals + decision table: [`references/checklist-template.md` § Refusal logic](references/checklist-template.md#refusal-logic)). Decide: both signals greenfield → Phase 2 · both brownfield → `SKIPPED-BROWNFIELD → /research` · anchor greenfield but probe finds evidence → `BLOCKED-ON-CONTRADICTION → /coherence-check` (cite the files) · `--force` → proceed with `forced: yes` + a `WARNING:` line. The probe is intentionally noisy toward refusing: a false refusal costs one `--force`; a false acceptance corrupts working code.

### Phase 2 — Read inputs

From `.ai/anchor.md`: `project_tier`, `language`, `framework`, `hosting`, `db`/`auth` (mvp+), AI block (if present), and **`approved_dependencies`** (the allowlist Phase 3 grounds against). From `.ai/architecture.md` or `.ai/architecture/02-components.md`: component names + their root dir names, inter-component contracts, external infra (db, cache, queue, object storage). Architecture missing → `BLOCKED-ON-ARCHITECT`. If `.ai/design-system.md` exists, note it in the checklist preamble and align any UI scaffolding steps (theme/token config, component-library setup) with its tokens and component inventory — never emit a step that invents a contradicting theme.

### Phase 3 — Ground the toolchain (Context7)

This is what stops bootstrap from emitting phantom or stale commands. **Before writing any install/scaffold line**, list every concrete tool the checklist will name — the framework's create-command, the test runner, the migration tool, the linter/formatter, infra base images — all derived from anchor's locked stack + `approved_dependencies` (Phase 2), nothing freelanced. Then ground them, per [`references/grounding.md`](references/grounding.md):

- For each tool, `mcp__context7__resolve-library-id` (official name, e.g. `Next.js`) → pick the best match → `mcp__context7__query-docs` for the **current** scaffold/install command, flag syntax, and latest stable **major** version. Budget: **≤3 resolve + ≤3 query calls** — batch by grounding only the tools you're least sure of (a framework's create-CLI and any version-sensitive tool); a package already in `approved_dependencies`/the lockfile is provably real and needs grounding only if its *command syntax* is uncertain.
- Record per tool: real package name · current command · verified major version · `verified via Context7` provenance (carried into `bootstrap.md`).
- **Refuse/flag, never emit a phantom:** slopsquatting fingerprint (new + low-adoption + name-adjacent + thin provenance) → refuse. Can't resolve → substitute the anchor-approved equivalent or flag the step `unverified — confirm before running` and name what you couldn't ground.
- **Graceful degradation:** Context7 unavailable this run → say so, fall back to naming **only** packages in anchor's locked stack/`approved_dependencies` (already vetted), and flag every tool you couldn't ground rather than emitting it.

### Phase 4 — Assemble checklist (tier-gated)

Build steps from [`references/checklist-template.md`](references/checklist-template.md) per tier — prototype = minimum to run; mvp adds component roots, `.env.example`, Docker, db migrations, dev scripts, basic CI; production adds observability, secrets wiring, extended CI, red-zone gates. Every command uses the **grounded** package name + major version from Phase 3 and the `--frozen-lockfile` discipline (rule 6). Every step gets a `✓ Verify:` line.

### Phase 5 — Read back

Paste the assembled checklist. Ask: *"Anything missing? Wrong order? Anything to drop?"* Expect corrections on ordering (db up before backend), stricter verification, or dropping machine-level prerequisites the user already has. Their corrections win.

### Phase 6 — Write the file

Write `.ai/bootstrap.md` using the [template](references/checklist-template.md#file-template). Enforce the tier line cap (90/185/250). `status: in-progress` (steps not yet run). Include the Phase 3 provenance so the commands are auditable.

### Phase 7 — Progress-tracker + verdict

On `READY-FOR-PRD` / `IN-PROGRESS` (file written), append one entry to `.ai/progress-tracker.md` ([§ Entry format](../_build_share/PROGRESS-TRACKER.md#entry-format)). Then exactly one verdict:

| Verdict | When |
|---|---|
| `READY-FOR-PRD` | file written AND user reports all steps verified — skeleton runnable |
| `IN-PROGRESS` | file written; checklist not yet worked |
| `STATUS-COMPLETE` | already bootstrapped, nothing changed (no write) |
| `SKIPPED-BROWNFIELD → /research` | brownfield detected (no write) |
| `BLOCKED-ON-ANCHOR → /anchor` | anchor.md missing |
| `BLOCKED-ON-ARCHITECT → /architect` | architecture artifact missing |
| `BLOCKED-ON-CONTRADICTION → /coherence-check` | anchor greenfield, probe found evidence |

On `READY-FOR-PRD`, hand off: *"Skeleton runnable. Next: `/environments` to lock the env roster + config inventory the skeleton just created (`.env.example`, CI), then `/pipeline` for the delivery contract, then `/prd` for the first feature."* Once the skeleton runs, `/docs readme` can optionally assemble the root README from this checklist's dev scripts plus environments and test-strategy.

</what-to-do>

<supporting-info>

Runs once, after `/architect`, before the first `/prd` — greenfield only; brownfield skips it.

</supporting-info>
