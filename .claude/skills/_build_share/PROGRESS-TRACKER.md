# Progress tracker — canonical conventions

> **Chain convention — optional for standalone MTDD.** This file documents the `.ai/progress-tracker.md` breadcrumb used by the full RALPH chain. Standalone MTDD only touches it in `mtdd-merge` step 9, **and only if the repo already keeps one** — otherwise that step is skipped. If you're running MTDD on its own, you can ignore this pack; the per-task bead note / `## Status log` is the record.

Shared format + procedure used by every chain skill that closes a slice, crystallizes a decision, or seals a session boundary. Canonical contract — do not duplicate the rules inside individual SKILL.md files; reference this file and supply the skill-specific fields (entry header, what to put in the 2–4 lines, when to skip).

The `.ai/progress-tracker.md` file is the **session-resumption breadcrumb trail**. It is **append-only** (most-recent entry on top), **chronological**, and **read by every chain skill at session start** so any agent (or human) walking in mid-chain sees what's been decided and what's next without rereading every artifact.

## Where the file lives

`.ai/progress-tracker.md` at the repo root, alongside `anchor.md`.

Seeded by `/anchor`'s Phase 8. If absent when another chain skill runs, it usually means `/anchor` hasn't run — that's already a refusal condition for most chain skills. The handful of skills that predate `/anchor` in the SDLC (`/discovery`, `/understand`, `/feature-map`) **create the file** with the stub in [`_shared/conventions.md` § Progress tracker](../_shared/conventions.md#progress-tracker) if it's missing.

## Entry format

```markdown
## YYYY-MM-DD — <skill> landed (<scope>)
- Artifact: `.ai/<path>` — <one-line summary of what's in it>
- Key decision(s): <2-3 line summary; concrete, not generic>
- Next: <one concrete action the next operator should take>
```

- **Date** — ISO format (`YYYY-MM-DD`). Use today's date (`date +%Y-%m-%d` or the `currentDate` from prompt context).
- **`<skill>`** — skill name without slash (`prd`, `design`, `architect`).
- **`<scope>`** — feature slug (`invoice-send`) or `project` for project-level skills (`/anchor`, `/architect`, `/feature-map`, `/bootstrap`).
- **Lines** — 2–4. Terse. The goal is fast skimming, not a changelog.
- **`Next:`** — always present. Without it, the tracker is just a log.

## When to append

**Append on a success verdict** — the kind that hands off (`READY-FOR-DESIGN`, `READY-FOR-PLAN`, `READY-FOR-SHIP`, `PUBLISHED`, `QA-APPROVED`, etc.). The append happens **after the artifact is written**, as the last action before issuing the verdict text.

**Do NOT append on:**
- **Refuse-and-route verdicts** (`BLOCKED-ON-*`, `NEEDS-*`) — the artifact itself (with `Status: Blocked` or similar) records the blocker. Re-running the skill after the blocker is cleared writes ONE entry, not two.
- **Read-only audits** that don't crystallize a decision (`/coherence-check`).
- **Dry-runs / preview modes** if a skill has them.

**Update mode** — when a skill edits an existing artifact (e.g., `/design` re-run with sections preserved), still append. The entry should call out which sections changed: *"updated design for `invoice-send`: revised module split + added retry policy."*

**Within-session re-runs** — if you'd append a near-duplicate of the top entry (same skill, same scope, same date), **update the existing entry in place** instead. Different days = different entries.

## When to read

**At the start of every chain skill's procedure** — Phase 0 or the first action of Phase 1. Read the **top 5 entries** (after the intro paragraph). They're the most recent, most relevant, and fit in <40 lines.

What to extract:

- **Has the upstream skill landed?** (e.g., `/design` looks for a `... — prd landed (<slug>)` entry confirming the PRD it depends on.)
- **Did anything shift since the last time this skill ran?** (e.g., `/prd` re-running and seeing an `architect landed` entry newer than the last `prd landed` entry → architecture may have moved; re-check placement in Phase 2.)
- **What was the previously-stated "next" action?** (e.g., `/design` sees PRD's `Next: run /design <feature>` — confirms we're on the chain.)

If reading suggests the chain has gone out of order (e.g., `/qa` runs but no `to-issues landed` entry for the feature), warn but proceed — the operator may have chosen a non-chain workflow for that feature.

## Per-skill append table

| Skill              | Append? | Notes                                                                                       |
|--------------------|---------|---------------------------------------------------------------------------------------------|
| `/anchor`          | Yes     | Seeds the file if absent (`anchor landed`); appends `anchor re-run` entry on subsequent runs. |
| `/discovery`       | Yes     | Creates the file if missing (predates `/anchor`).                                           |
| `/understand`      | Yes     | Creates the file if missing.                                                                |
| `/feature-map`     | Yes     | Creates the file if missing.                                                                |
| `/architect`       | Yes     | Update mode still appends; call out which sections changed.                                 |
| `/ddd-strategy`    | Yes     |                                                                                             |
| `/event-storm`     | Yes     |                                                                                             |
| `/bootstrap`       | Yes     |                                                                                             |
| `/research`        | Yes     | Brownfield only — never fires on greenfield.                                                |
| `/prd`             | Yes     |                                                                                             |
| `/design`          | Yes     | Includes back-annotation of PRD open questions (separate flow; both happen at write time).   |
| `/plan`            | Yes     |                                                                                             |
| `/to-issues`       | Yes     |                                                                                             |
| `/publish-issues`  | Yes     | One entry per backend run; include backend name + ticket count.                             |
| `/qa`              | Yes     | Append only after human approval flips `Status: Building → QA-Approved`.                    |
| `/mtdd-merge`      | Yes     | Per slice merged. Skip on idempotent resume (branch already merged before the run started). |
| `/coherence-check` | No      | Read-only audit, no decision crystallized.                                                  |
| `/triage`          | No      | High-frequency; tracker changes belong on the tracker, not in `progress-tracker.md`.        |
| `/prototype`       | No      | Throwaway; the answer folds into PRD/design which append.                                   |

## Example entries

```markdown
## 2026-05-22 — design landed (invoice-send)
- Artifact: `.ai/specs/invoice-send/design.md` — placed in `PlaceOrder`; 4 modules; 2 API endpoints; async via `OutboxRelay`.
- Key decisions: PRD Q1 → async/outbox; Q2 → 3-retry jittered backoff (cap 30s); Q3 → hashed PII in logs.
- Next: `/plan invoice-send`.

## 2026-05-21 — prd landed (invoice-send)
- Artifact: `.ai/specs/invoice-send/prd.md` — production tier (uplifted: PII + money signals).
- Key decisions: JTBD = "freelancer closes session and sends invoice in <30s"; kill = <40% sent invoices paid within 14d by 2026-08-01.
- Next: `/design invoice-send`.

## 2026-05-20 — architect landed (project)
- Artifact: `.ai/architecture/` — 6 components, style = modular monolith, top-3 characteristics: scalability / resilience / auditability.
- Key decisions: outbox pattern for cross-component events; PII confined to Postgres (invariant); auth at the boundary.
- Next: `/prd` for the first feature on `.ai/features.md`.

## 2026-05-19 — anchor landed (project)
- Artifact: `.ai/anchor.md` — `project_tier=mvp`, AI=no.
- Stack: TypeScript + Next.js 15 (App Router) + Postgres 16 + Clerk auth, deploy Vercel.
- Next: `/architect` (no DDD signal — skipping `/ddd-strategy`).
```

## Anti-patterns

| Smell                                                       | Fix                                                                       |
|-------------------------------------------------------------|---------------------------------------------------------------------------|
| Entry has no `Next:` line                                   | Always include — without it, the tracker is just a log, not a breadcrumb. |
| Entry restates the artifact's contents in prose             | Summarize what's NEW about this entry; link to the artifact for detail.   |
| Appending on every save during a single skill run           | Append once, at verdict.                                                  |
| Reading the whole file instead of just the top 5            | Pagination by recency: top 5 covers ~95% of "what just happened" needs.   |
| Appending on a refusal verdict                              | The artifact's `Status: Blocked` already records this; don't double-log.  |
| Entry written in passive voice or vague verbs               | Concrete past-tense: "placed in PlaceOrder," not "placement was considered." |
| `Key decision:` repeats what the PRD/design already states  | Capture the *choice* (the verb), not the field that holds it.             |

## Procedure snippet to drop into a chain skill

Two insertion points in every chain skill — at the top and at the bottom of the procedure. The exact wording can match the skill's house style; what matters is that both insertions exist.

**At the top (Phase 0 or first action of Phase 1):**

> *Load the top 5 entries of `.ai/progress-tracker.md` if present, per [`_build_share/PROGRESS-TRACKER.md` § When to read](./PROGRESS-TRACKER.md#when-to-read). They tell you what landed recently and what the previously-stated next action was. If the file is absent and this skill is one of the early-chain skills (`/discovery`, `/understand`, `/feature-map`), create it from [`_shared/conventions.md` § Progress tracker](../_shared/conventions.md#progress-tracker).*

**At the bottom (last step before issuing the verdict, success path only):**

> *Append a new entry to the top of `.ai/progress-tracker.md` per [`_build_share/PROGRESS-TRACKER.md` § Entry format](./PROGRESS-TRACKER.md#entry-format). Skip on refusal verdicts.*
>
> Example for this skill:
> ```markdown
> ## YYYY-MM-DD — <skill> landed (<scope>)
> - Artifact: `.ai/<path>` — <skill-specific one-liner>
> - Key decision(s): <skill-specific summary>
> - Next: <skill-specific next action>
> ```
