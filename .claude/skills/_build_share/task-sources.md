# Task sources — one core, two optional adapters

Every `mtdd-*` skill works through a **task source**: the thing that tells it *what
to build*, *when it's done*, and *where to record progress*. A source provides four
operations — **detect · read the logical fields · write per-phase progress · write
the completion summary**. The TDD discipline downstream (red → green → refactor,
the review rubric, the verify gates) is **identical** no matter which source you
use; only the parse and the write-back surface differ.

There is **one core source** that works in any git repo with no external tooling,
and **two optional adapters** that light up only when your project already has the
backing system:

| Source | Needs | Use when |
|---|---|---|
| **Free-form** *(core — the default)* | nothing but a git repo | one-off / ad-hoc work; any project; the drop-in default |
| **Beads** *(adapter)* | the `bd` CLI + a beads DB | your project tracks work as beads (e.g. an automation queue) |
| **Canonical / chain** *(adapter)* | the SDLC chain's `tickets/` materialization | you're running the full plan → publish → build chain |

> **If you just dropped MTDD into a repo, you want free-form.** Skip the two adapter
> sections below — they're inert until their backing system is present.

---

## The logical contract (what every source provides)

Whatever the source, each skill extracts the same small set of logical fields. The
cheat sheet at the bottom maps each to its per-source location.

| Logical field | Meaning |
|---|---|
| `title` | task title; commit subject text |
| `acceptance_criteria` | the `## Acceptance criteria` checkbox list — the done-contract |
| `target_branch` | the branch the feature branch is cut **from** and merged **back into** — see [Target branch resolution](#target-branch-resolution) |
| `skip_tests` | skip the TDD/test gate (trivial config/doc changes only) |
| `is_bug` | a defect-fix slice → regression-test-first discipline |
| file boundary | which paths this task may touch (positive list, or a negative out-of-scope list) |
| `language` | toolchain hint for typecheck/test (else detected) |
| `depends_on` | upstream tasks that must land first *(adapters only)* |
| traceability | F-IDs / user stories / NFRs / Unwanted-EARS *(chain adapter only)* |

## Picking the source

A skill resolves its source in this order:

1. **Configured** — if the repo has a `.mtdd/config` with an `mtdd_task_source` value
   (written once by [`mtdd-init`](../mtdd-init/SKILL.md)), use it. *(Optional — only
   present if you ran init.)*
2. **Auto-detected from the argument** — otherwise discriminate on the argument
   shape:
   - **File path, no frontmatter** (or frontmatter without a `slice:` key) → **free-form** (core).
   - **A bare token** (no `/`, doesn't end `.md`) → try the **beads** adapter: run
     `bd show <arg> --json` (or `bd show <arg>`); exit 0 → treat as a bead. If `bd`
     isn't installed or the lookup fails and the arg doesn't look like a file path,
     **ask the user** — don't silently fall back.
   - **File path with YAML frontmatter containing `slice:`** → the **canonical /
     chain** adapter.

A file with hand-rolled frontmatter but **no** `slice:` key is free-form. The
`slice:` key is the canonical discriminator.

---

## Core source: free-form

The portable default. A hand-written task at `tasks/<slug>.md`, copied from
[`task-template.md`](task-template.md). No frontmatter, no external tool — all
fields live in plain markdown body sections.

### Body sections → mtdd usage

| Section | Read by |
|---|---|
| `# <title>` | all |
| `## Context` + `## Goal` | implement (prose context) |
| `## Acceptance criteria` | implement (satisfy), review (tick), merge (copy into Completion) |
| `## Out of scope` | implement (negative file boundary) |
| `## Target branch` | implement, review, verify, merge |
| `## Skip tests?` | implement, verify (`true`/`false`) |
| `## Status log` | all (append one line per phase) |
| `## Completion` | merge (populates) |

### Runtime mutations

Progress and completion are written **into the task file**:

- **Per phase** — append one line to `## Status log` (already present in the template).
- **Completion** — the merge phase replaces the empty `## Completion` section with
  the populated summary.

### Refusals

Free-form has no source-specific refusals. The only stops are the universal ones
(dirty working tree, missing input file, a vague acceptance criterion that needs
rewriting). `## Out of scope` is the negative file boundary.

### Branch naming

`feature/<slug>` where `<slug>` is the slugified title (lowercase, alphanumeric +
hyphens, ≤50 chars).

---

## Adapter: beads *(optional — needs the `bd` CLI)*

Inert unless your project uses a beads tracker. The bead is the **source of truth**;
mtdd reads it via `bd show` and writes phase progress back to it. The bead body
matches the canonical schema, so the field mappings are the same as the chain
adapter — only the read source and the write-back surface differ.

### Read commands

- `bd show <id> --json` — structured read (`id`, `title`, `status`, `labels`,
  `body`, `dependencies`, …). Prefer this for field extraction.
- `bd show <id>` — text read (the rendered canonical-shaped markdown body). Fallback,
  or to read body sections (`## What to build`, `## Acceptance criteria`, …).

### Logical fields → where they come from

| Logical field | Beads source |
|---|---|
| `title` | JSON `title` |
| `slice`, `feature`, `type`, `tests`, `language`, `depends_on`, `files`, `signatures`, `target_branch`, traceability arrays | body frontmatter OR JSON `metadata` / `attributes` |
| `status` (open/in_progress/blocked/closed) | JSON `status` |
| `labels` | JSON `labels` array |
| `acceptance_criteria` | body `## Acceptance criteria` checkbox list |
| `## What to build`, `## Traceability`, `## Blocked by` | body sections |
| `hitl_reason`, `skip_tests_reason` | body frontmatter |

### Refusals (beads)

Before any work, `/mtdd-implement` refuses on:

1. `status: closed` → *"Bead already closed. Aborting."*
2. `status: in_progress` AND the matching feature branch is not currently checked
   out → *"Bead is claimed by another run. Run `bd update <id> --status open` to
   release it if you're sure no other agent is working on it, then retry."* (Current
   `bd` has no `--unclaim`; reverting to `open` releases the claim.)
3. `status: blocked` → *"bd reports this bead is blocked by an open dependency.
   Resolve those beads first."*
4. `afk` label (or `type: afk` in body frontmatter) → *"This bead is marked AFK
   (autonomous) — `mtdd` is human-in-the-loop only and won't run it."* (In the full
   chain, AFK work is owned by a separate autonomous runtime.)
5. Exactly one of `skip-tests` / `force-skip-tests` labels (not both) → log a warning
   and proceed with **full TDD**. Both labels are required to actually skip tests
   (defense-in-depth against accidental mislabels).

### Runtime mutations (beads)

Beads mode does **not** write to a file — every phase writes back to the bead:

| Phase | `bd` command |
|---|---|
| implement start (fresh) | `bd update <id> --claim` — atomic; sets `assignee = you` + `status: in_progress`; idempotent |
| implement end | `bd note <id> "implement: <summary> — branch \`<name>\` at <sha>"` |
| review COMPLETE | `bd note <id> "review: COMPLETE — all criteria satisfied"` and optionally `bd update <id> --acceptance "$(cat <<'EOF'…EOF)"` |
| review REJECT | `bd note <id> "review: REJECT — <one-line reason>"` (bead stays `in_progress`) |
| verify PASS | `bd note <id> "verify: PASSED (typecheck + tests)"` |
| verify FAIL | `bd note <id> "verify: FAILED (<typecheck\|tests>) — <first error>"` |
| merge — summary | `bd note <id> --stdin <<'EOF' … EOF` (multi-line completion summary) |
| merge — progress line | `bd note <id> "merge: COMPLETED — merged into \`<target>\` at <sha>"` |
| merge — close | `bd close <id> --reason "merged into <target> at <sha>"` |

Notes on `bd` syntax:

- `bd note <id> "..."` is shorthand for `bd update <id> --append-notes "..."` — it
  appends with a newline separator, so per-phase notes accumulate.
- `bd note <id> --stdin <<'EOF' ... EOF` is the multi-line variant (merge summary).
- `--unclaim` does not exist; release a stuck claim with `bd update <id> --status open`.
- `bd close` is idempotent — re-running merge after a partial failure is safe.

### One writer at a time

While an mtdd skill is mid-run on a bead, **do not** run host-side `bd` write
commands or open the beads viewer; read-only `bd show` from another terminal is
fine. (One `bd` writer at a time avoids concurrent-write corruption.)

### Branch naming

`feature/<bead-id>--<short-slug-of-title>` (e.g. `feature/ralph-x8z--add-oauth-refresh`).
The double-dash separates the bead ID from the title slug, matching the autonomous
runner's convention so existing tooling recognizes the branch.

### Safe setup

See [`BEADS-SETUP.md`](BEADS-SETUP.md) for the gitignored-export configuration that
keeps a `bd close` from silently reverting on a later branch switch.

---

## Adapter: canonical / chain *(optional — needs the SDLC chain)*

Inert unless you're running the full plan → publish → build chain. The file is a
**materialized chain ticket** at `tickets/<feature>/SLICE-N-<slug>.md`, written by
`/publish-issues --backend=md` as a file-copy of the canonical at
`.ai/specs/<feature>/issues/SLICE-N.md`. Schema lives at
[`.claude/skills/to-issues/references/template.md`](../to-issues/references/template.md).

### Frontmatter fields → mtdd usage

| Canonical key | Read by | Used for |
|---|---|---|
| `title:` | all | task title; commit subject text |
| `slice:` | implement, merge | branch naming: `feature/<feature>-slice-<N>` |
| `feature:` | implement, merge | branch naming |
| `type: hitl\|afk` | implement | refuse on `afk` (`mtdd` is HITL-only) |
| `status: open\|published\|removed` | implement | refuse on `removed` |
| `tests: required\|skip-tests` | implement, verify | TDD vs skip-tests branch |
| `language:` | verify | toolchain selection (typecheck/test commands) |
| `depends_on: [N, ...]` | implement | refuse if any blocker isn't merged (check sibling tickets) |
| `files: [...]` | implement | explicit positive file boundary — only touch listed paths |
| `signatures: [...]` | implement | API contracts to honor verbatim |
| `satisfies_f_ids`, `satisfies_user_stories`, `satisfies_nfrs`, `satisfies_unwanted` | review | traceability surface in the review report (not gates) |
| `hitl_reason:` | implement | surface at start of phase (the named rule) |
| `skip_tests_reason:` | implement, verify | the named reason when `tests: skip-tests` |
| `backend_refs.*` | — | metadata only; not read by mtdd |
| `target_branch:` (optional, mtdd extension) | all | declares the integration branch — see [Target branch resolution](#target-branch-resolution) |

### Body sections → mtdd usage

| Section | Read by |
|---|---|
| `## What to build` | implement (prose context) |
| `## Acceptance criteria` | implement (satisfy), review (tick), merge (copy into Completion) |
| `## Traceability` | review (surface in report) |
| `## Blocked by` | implement (refuse if blockers unmerged) |

### Refusals (canonical)

Before any work, `/mtdd-implement` refuses on:

1. `type: afk` → *"This slice is `type: afk` (autonomous) — `mtdd` is HITL-only and
   won't run it."* (Chain: the autonomous runner owns AFK slices.)
2. `status: removed` → *"Slice was retired upstream. Aborting."*
3. Any slice in `depends_on:` whose sibling materialized ticket
   (`tickets/<feature>/SLICE-M-*.md`) lacks a populated `## Completion` section with
   a `**Merged:**` line → *"Slice M (blocker) is not yet merged. Run mtdd on that one
   first."*

### Runtime mutations (canonical)

Runtime progress is written into the **materialized ticket** at
`tickets/<feature>/SLICE-N-<slug>.md` — **never** into the canonical spec at
`.ai/specs/<feature>/issues/SLICE-N.md`.

- **Per phase** — append one line to `## Status log` (create the section at the end
  of the file if it doesn't exist).
- **Completion** — the merge phase appends a populated `## Completion` section.

### Branch naming

`feature/<feature>-slice-<N>` (e.g. `feature/invoice-send-slice-3`).

---

## Target branch resolution

The **target branch** is the branch a slice integrates into: the feature branch is
cut **from** it, and `/mtdd-merge` merges **back into** it. It is resolved once and
never silently assumed.

`/mtdd-implement` resolves it in order:

1. **Provided by the orchestrator** — autonomous `/mtdd-cycle` confirms the branch
   with the user at its Step 0 and passes it into the implement sub-agent. Used as-is.
2. **Configured / declared** — `.mtdd/config` `mtdd_target_branch` (written by
   [`mtdd-init`](../mtdd-init/SKILL.md)), else the task's declared value (beads /
   canonical `target_branch:` or free-form `## Target branch`). Used (echoed for
   confirmation at the interactive briefing pause).
3. **Neither** — implement detects a default to *propose*
   (`git symbolic-ref --short refs/remotes/origin/HEAD`, else `develop` if it exists,
   else the current branch) and **confirms it with the user** before cutting any
   branch. It does not just run with `develop`.

**Persistence — the single source of truth.** At branch creation, implement stamps
the resolved branch onto the feature branch:

```
git config branch.<feature-branch>.mtdd-target <target_branch>
```

`/mtdd-review`, `/mtdd-verify`, `/mtdd-merge`, and the `stop-guard.sh` TDD-order hook
**read this stamp back** (falling back to the task's declared value, then `develop`,
only if the stamp is missing). This is what lets every phase and the autonomous gate
agree on one base on **any** repo — `main`, `develop`, trunk, whatever — instead of
hardcoding `develop`.

---

## Cheat sheet — equivalent fields across the three sources

| Concept | Free-form *(core)* | Beads *(adapter)* | Canonical *(adapter)* |
|---|---|---|---|
| Identity | `# <title>` | `<bead-id>` + JSON `title` | `slice:` + `feature:` + `title:` |
| What to do | `## Context` + `## Goal` | body `## What to build` | `## What to build` |
| Done when | `## Acceptance criteria` | body `## Acceptance criteria` | `## Acceptance criteria` |
| File boundary | `## Out of scope` (negative) | body `files:` (positive) | `files:` (positive) |
| Tests | `## Skip tests?: true\|false` | body `tests:` AND/OR `skip-tests`+`force-skip-tests` labels | `tests: required\|skip-tests` |
| Target branch | `## Target branch` | body `target_branch:` | `target_branch:` |
| Progress | append `## Status log` | `bd note` per phase | append `## Status log` (materialized ticket) |
| Completion | populate `## Completion` | `bd note` + `bd close` | append `## Completion` (materialized ticket) |
