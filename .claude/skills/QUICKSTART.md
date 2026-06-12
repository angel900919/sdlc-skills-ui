# Quickstart — driving the SDLC chain

The short version of [`README.md`](README.md): which command to type, in what order,
and how the chain tells you what comes next. Each skill is a slash command you run
yourself — **no skill ever runs the next one for you**.

## The mental model (30 seconds)

- **Every skill ends with a verdict token** naming the next command
  (`READY-FOR-DESIGN → /design`). Read the verdict, type the command. Lost? Type
  **`/next`** — it finds where the project sits and recommends exactly one command.
- **Two folders:** `.ai/` is the machine source of truth; `.human/` is the
  plain-English mirror you read. If they disagree, `.ai/` wins.
- **The tier dial** (`prototype` / `mvp` / `production`) is locked by `/anchor` and
  scales every skill's depth. Only `/promote` advances it.
- **Gates are advisory:** a negative verdict (`KILL`, `BLOCKED-ON-X`) can be
  overridden — but on the record, with a reason.
- **Skills interview you** one plain-English question at a time, always with a
  proposed answer. "I don't know" is an acceptable answer; you get a safe default.

## Path A — Greenfield (new idea, no code)

Run in order. *(italic = conditional — skip when the condition doesn't apply)*

```
/intake            capture the idea, mint the slug, predict the tier
/discovery         worth building? PROCEED / INVESTIGATE / KILL
/understand        domain model: glossary, entities, invariants, journeys
/feature-map       decompose into a prioritized feature roster
/anchor            LOCK the stack + tier — the foundation everything reads
/architect         high-level design: style, components, ADRs
/test-strategy     lock the test pyramid, fixtures, E2E journeys
/data-management   lock the data policy            (if there's a datastore)
/bootstrap         ordered checklist → runnable skeleton (you execute it)
/environments      env roster + config inventory
/pipeline          delivery contract: quality gates, deploy/release, gap table
```

*Conditional inserts:* `/event-storm` after `/understand` (event-heavy domain) ·
`/ddd-strategy` after `/anchor` (multi-context domain) · `/threat-model` after
`/architect` (production, or PII/money/regulatory) · `/ux-spec` after `/architect`
(UI project) · `/docs readme` after `/pipeline` (mvp+ with external users).

Then enter the **per-feature loop** below, once per feature off the roster.

## Path B — Brownfield (existing repo)

Same destination, recovery-flavored: skills **scan first, cite `file:line`, and ask
you to confirm** — they never invent what the code doesn't show.

```
/onboard           what is this app for? (the one thing code can't tell you)
/anchor            confirm the detected stack, lock the tier
/explore           whole-repo recon — facts only, file:line cited
/environments      recover the env spec from .env.example / CI / IaC
/data-management   recover the migration + data policy   (if datastore)
/comprehend        confirm the code-derived domain model
/architect         high-level design over what exists
/feature-census    inventory shipped features + capture planned work
/test-strategy     recover + lock the existing test conventions
/pipeline          recover the delivery contract from the real CI files
```

*Conditional inserts:* `/health-audit` after `/architect` (is anything critical
broken before we build?) · `/threat-model` and `/ux-spec` as in Path A.

## The per-feature loop (both paths)

Once per feature. All artifacts land under `.ai/specs/<feature>/`.

```
/prd               the WHAT — requirements contract, effective tier
/design            the HOW — modules, schemas, API contracts, test plan
/plan              vertical slices; slice 1 is always the tracer bullet
/to-issues         one canonical SLICE-N.md work contract per slice
/publish-issues    push slices to your tracker (--backend=beads|jira|md)
/build             picks the next unblocked slice → routes to MTDD
   ↳ per slice:    /mtdd-cycle  (or /mtdd-implement → review → verify), then /mtdd-merge
   ↳ repeat /build until it says READY-FOR-QA
/qa                feature-boundary evidence pass + human acceptance
/ship              release gate — flips the feature to shipped (you deploy)
```

*Prototype express lane:* `/quick-spec` runs `/prd → /design → /plan` as one
conversation and writes the same three artifacts — prototype tier only; any uplift
signal (money, PII, SLA, regulatory, external dependants) bounces it to the full chain.

*Conditional inserts:* `/ux-spec` after `/prd` (UI-bearing feature) · `/research`
before `/design` (brownfield scout) · `/to-fitness` after `/design` (production) ·
`/runbook` and `/docs <feature>` between `/qa` and `/ship` (production / external
users) · `/measure` after the metric timeframe passes · `/as-built` for a post-build
code map.

## Any time

| Command | Use it when |
|---|---|
| `/next` | "What do I do now?" — also `--resume` after a break |
| `/status` | project pulse; `/status <feature>` per-slice; `--html` dashboard |
| `/coherence-check` | audit `.ai/**` for contradictions (read-only) |
| `/critic <artifact>` | fresh-context review of one artifact before building on it |
| `/diagnose` | a hard bug, flaky test, or perf regression |
| `/triage` | issues that did NOT come through the chain |
| `/promote` | advance the tier (the only skill that can) |
| `/measure` | settle the bet: actual metric vs target → keep / iterate / sunset |
| `/sunset` | retire a shipped feature: deprecated → removed (human-gated) |

Optional: wire the SessionStart orientation hook (every session opens with
branch + newest breadcrumb + tier already in context) and the PreToolUse path
guard (secrets/lockfiles denied; gate and frozen-spec edits escalate to you) —
shared snippet in
[`README.md` § Session-start orientation](README.md#session-start-orientation-optional-hook).

## Where things land

```
.ai/        machine artifacts: anchor.md, architecture/, specs/<feature>/, pipeline.md …
.human/     plain-English mirrors + validated Mermaid diagrams
.ai/progress-tracker.md   append-only log every skill reads first
```

Full reference: [`README.md`](README.md) · TDD execution loop:
[`README-mtdd.md`](README-mtdd.md) · contracts: [`_shared/conventions.md`](_shared/conventions.md)
