# MTDD — Manual Test-Driven Development skills

> This file documents only the **portable MTDD bundle** (`mtdd-*` + `_build_share/`),
> which drops into any git repo on its own. The overview of the full skills suite this
> repo ships (the SDLC chain, the greenfield/brownfield workflows) lives in
> [`README.md`](README.md) — not needed when you copy just the bundle.

MTDD is a **human-in-the-loop (HITL)** TDD loop broken into discrete phases you
run one at a time — each a Claude Code skill you invoke with `/mtdd-<phase>`.
Strong discipline (red → green → refactor, structured commits, a hard TDD-order
gate), but you stay in control at every boundary. It **drops into any git repo**
— no toolchain to install, the default task source needs nothing but the repo
itself — and is also the HITL half of a larger autonomous TDD chain, into which
it plugs unchanged.

> **One-line model:** one-time `/mtdd-init`, then four phase skills + an
> orchestrator, one task, one feature branch. You drive
> `implement → review → verify → merge` by hand (or let `mtdd-cycle`
> auto-chain the first three), pausing between phases to inspect the work.

---

## Quickstart — drop into a new repo

```sh
# 1. Copy the bundle beside your repo's skills (core + your language pack).
#    See _build_share/README.md § "What to copy" for the lean per-language subset.
mkdir -p .claude/skills
cp -r <mtdd-source>/mtdd-*        .claude/skills/
cp -r <mtdd-source>/_build_share  .claude/skills/_build_share

# 2. Settle this repo's environment once (branch, test/typecheck commands, source).
/mtdd-init                        # detects + confirms + writes .mtdd/config (commit it)

# 3. Write a task and run the loop.
cp .claude/skills/_build_share/task-template.md tasks/my-thing.md   # edit it
/mtdd-implement tasks/my-thing.md
/mtdd-review    tasks/my-thing.md
/mtdd-verify    tasks/my-thing.md     # emits a manual smoke checklist
/mtdd-merge     tasks/my-thing.md     # merges to your branch (does NOT push)
```

That's the **free-form** path — the portable default, no external tooling. If your
project already tracks work as **beads** or runs the full **SDLC chain**, those are
opt-in task-source adapters (see [Task sources](#task-sources--one-core-two-adapters)).

---

## The skills

One-time setup, then the four phase skills and an orchestrator:

| Skill | Phase | What it does | Stops / gates on |
|---|---|---|---|
| **`mtdd-init`** | Setup *(once per repo)* | Detects the default branch, typecheck/test commands, language, and task source; confirms them with you and writes `.mtdd/config` so the phases stop re-sniffing. Additive — phases fall back to runtime detection if it's absent. | Not in a git repo. |
| **`mtdd-implement`** | Implement | Claims the task, cuts a `feature/*` branch, drives red → green → refactor cycles with `red:`/`green:`/`refactor:` commit prefixes. Never pushes, merges, or closes. | Dirty inherited tree, vague acceptance criteria, file-boundary breach, closed/claimed/blocked bead. |
| **`mtdd-review`** | Review | Diffs the branch against the target and ticks **every** acceptance criterion against the diff. Emits a `<criteria>` block + a single `COMPLETE`/`REJECT` verdict. May make ≤3-file / ≤50-line `review:` refinements. | Any unticked criterion → `REJECT`; **hard** TDD-order gate (`tdd-check`) → `REJECT`. |
| **`mtdd-verify`** | Verify | Runs typecheck + tests on the branch, then generates a per-slice **manual smoke checklist** (action → expected observable result) from the behavioural criteria. | Typecheck or test failure → STOP. |
| **`mtdd-merge`** | Merge | Fast-forwards the target, merges the feature branch `--no-edit`, writes a completion summary, closes the bead. **Never pushes**, never deletes the branch. | Dirty tree, merge conflict, target behind remote. |
| **`mtdd-cycle`** | Orchestrator | Auto-chains implement → review → verify, each in its **own fresh sub-agent** (context isolation, a stand-in for `/clear`). Auto-confirms each phase's "reply go" pause; halts on a real blocker / `REJECT` / verify failure. **Stops before merge.** | Implement `BLOCKED`, review `REJECT`, verify `FAIL`. |

The phases are deliberately separate skills so a human can `/clear` (or read the
diff, or walk away) between each. `mtdd-cycle` is the autonomous
counterpart — it spawns one fresh sub-agent per phase instead, so no phase
inherits the previous one's diffs and file reads.

---

## The loop

```
                       ┌─────────────────────────────────────────────┐
                       │                                             │
  task ──▶ /mtdd-implement ──▶ /mtdd-review ──▶ /mtdd-verify ──▶ /mtdd-merge ──▶ done
              (branch)      COMPLETE │ REJECT    PASS │ FAIL      (merge, close)
                                     │                │
                                     └──── re-run ◀───┘
                                          /mtdd-implement
```

- **REJECT** at review or **FAIL** at verify routes you back to
  `/mtdd-implement` (paste the reviewer's bullets / failing output so the next
  cycle addresses them).
- `mtdd-cycle` automates the dashed run up to and including verify, then
  **stops** so a human runs the smoke checklist before `/mtdd-merge`.

### Typical session (beads adapter shown; free-form is identical with a `tasks/*.md` arg)

```sh
/mtdd-implement bd-1234        # claims bead, branches, TDD cycles, hands off
/mtdd-review bd-1234           # ticks criteria → COMPLETE or REJECT
/mtdd-verify bd-1234           # typecheck + tests, emits smoke checklist
#   …run the smoke checklist by hand…
/mtdd-merge bd-1234            # merges to target, closes bead (does NOT push)
git push origin <target>       # you push, manually (your configured target branch)
```

Or hands-free up to verify:

```sh
/mtdd-cycle bd-1234      # implement → review → verify in fresh sub-agents
#   …run the smoke checklist it surfaces…
/mtdd-merge bd-1234
```

---

## Task sources — one core, two adapters

Every skill works through a **task source** that tells it what to build and where to
record progress. One portable core, two opt-in adapters; the source is resolved from
`.mtdd/config` `mtdd_task_source` if set, else auto-detected from the argument (full
contract in [`_build_share/task-sources.md`](_build_share/task-sources.md)):

| Source | Identifier | Detection | State lives in |
|---|---|---|---|
| **Free-form** *(core — the default)* | `tasks/<slug>.md` | a file without `slice:` frontmatter | the task file's `## Status log` / `## Completion` |
| **Beads** *(adapter — needs the `bd` CLI)* | a bead ID — `bd-1234` | no `/`, doesn't end `.md` → confirmed via `bd show` | the bead — claimed via `bd update --claim`, progress via `bd note`, criteria via `bd update --acceptance`, closed via `bd close` |
| **Canonical** *(adapter — needs the SDLC chain)* | `tickets/<feature>/SLICE-N-<slug>.md` | file with YAML frontmatter containing `slice:` | the ticket file's `## Status log` / `## Completion` |

All three carry the same logical fields (`acceptance_criteria`, `target_branch`,
`skip_tests`, etc.), so the skills behave identically across sources — only the
read/write side-channel differs. **A bare drop-in uses free-form**; the adapters
light up only when their backing system is present.

> **Target branch — resolved once, then stamped on the branch.** MTDD never
> silently assumes a branch. `/mtdd-implement` resolves the target in order:
> (1) one explicitly passed by `/mtdd-cycle`; (2) `.mtdd/config` `mtdd_target_branch`
> (written by `/mtdd-init`), else `target_branch:` in beads/canonical frontmatter or a
> `## Target branch` section in a free-form task; (3) otherwise a detected default it
> **proposes and confirms with you** at the briefing pause (it never just runs with
> `develop`). The resolved branch is
> then **stamped on the feature branch** — `git config branch.<feature>.mtdd-target`
> — and `/mtdd-review`, `/mtdd-verify`, `/mtdd-merge`, and the autonomous
> TDD-order hook all read that stamp, so every phase agrees on one branch and the
> hook checks against the right base on **any** repo (`main`, `develop`, trunk,
> whatever). For a hands-free `/mtdd-cycle` you confirm the branch once at Step 0;
> it then runs without further prompts. `develop` is only the last-resort fallback
> when nothing else resolves — not a hardcoded assumption.

---

## What MTDD enforces

- **Vertical TDD, not horizontal.** One behaviour at a time: `red:` (one failing
  test, failing for the *right* reason) → `green:` (minimal pass) → `refactor:`
  (optional, only if there's something to clean). Never "all tests then all
  impl."
- **Structured commit prefixes** make the cycle visible in `git log --oneline`
  and are checked by the **TDD-order gate** (`tdd-check.sh`, a git-only POSIX
  shell script — no Node required). It's a **hard reject** at review; on the rare
  setup failure (no `git`) the review must surface a loud downgrade warning
  rather than silently eyeballing.
- **Bug slices are regression-test-first** — the opening `red:` must reproduce
  the defect (assert the actual wrong behaviour), then go green with the fix.
- **Explicit file staging** — `git add <paths>`, never `git add -A`/`.`, so an
  unrelated working-tree change can't ride into a slice's commit.
- **Style packs on demand** — implement and review both classify the task
  (`typescript-style`, `python-style`, `react`, `architecture`) and load only
  the matching rule packs from `_build_share/` before coding / judging.
- **Hard prohibitions** — implement & merge **never** `git push`; implement
  never merges, never edits acceptance checkboxes, never writes the `<criteria>`
  / `<promise>` blocks (review owns those); merge never deletes the branch.
- **Scoped tools** — each skill declares `allowed-tools` matching its job:
  implement gets `Write`/`Edit`; review, verify, and merge get `Edit` but not
  `Write` (they don't create files); the orchestrator gets only `Agent` (it just
  spawns sub-agents). Enforced by the Claude Code CLI; treated as declarative
  intent where enforcement is unavailable.

### The cycle state machine & run mode

`mtdd-cycle` drives its implement → review → verify run as a small state machine
recorded in a runtime `.mtdd/cycle-state` file (schema, read snippet, and
transition table in [`_build_share/cycle-state.md`](_build_share/cycle-state.md)).
The orchestrator is its **sole writer**; the implement and review sub-agents only
**read** it, id-matched, to decide whether to skip their "Reply 'go' to proceed"
confirmation pause. This replaces the old free-text `MTDD-AUTONOMOUS` sentinel,
whose only failure mode was a silent stall when the magic word got garbled.

Three properties fall out of putting the bit in a durable, validated file:

- **Fail-loud, not stall.** A phase told it's autonomous but unable to confirm that
  from `.mtdd/cycle-state` reports `BLOCKED: cycle-state unreadable` — caught at the
  orchestrator's gate — instead of waiting forever for a `go`.
- **Id-matched.** Auto-proceed fires only when `mtdd_cycle_id` matches the task the
  phase was invoked with, so a stale file can't wrongly auto-run a human's later
  standalone invocation on a different task.
- **Resumable.** Re-running `/mtdd-cycle <id>` reads the recorded phase and continues
  mid-cycle instead of restarting. `.mtdd/cycle-state` is runtime/git-ignored
  (`/mtdd-init` adds the ignore), unlike the committed `.mtdd/config`.

It still never softens a genuine refusal, blocker, `REJECT`, or test failure, and a
human running `/mtdd-implement` directly has no matching autonomous state, so their
pause always fires interactively.

---

## Layout & deployment

```
.claude/skills/
├── README-mtdd.md         ← this file (travels with the bundle)
├── mtdd-init/SKILL.md        ← one-time setup (writes .mtdd/config)
├── mtdd-implement/SKILL.md   (+ reference.md)
├── mtdd-review/SKILL.md      (+ reference.md)
├── mtdd-verify/SKILL.md
├── mtdd-merge/SKILL.md
├── mtdd-cycle/SKILL.md (+ reference.md)
└── _build_share/          ← shared rule packs + gates (must travel beside the skills)
    ├── task-sources.md, coding-standards.md, ai-code-audit.md, *-styleguide.md, react-rules.md, …
    ├── task-template.md, mtdd-init.sh, .gitattributes (pins *.sh to LF)
    ├── BEADS-SETUP.md, PROGRESS-TRACKER.md   ← chain/beads adapters (optional)
    └── gates/             ← tdd-check.sh, stop-guard.sh, clean-tree-guard.sh, beads-safety-guard.sh (git-only POSIX shell)
```

Claude Code only discovers skills at `.claude/skills/<name>/SKILL.md`, and
`_build_share/` **must sit beside** the `mtdd-*` folders — the skills reference
their rule packs via `../_build_share/...` and run the gate via
`sh .claude/skills/_build_share/gates/tdd-check.sh` (resolved from the project
root). The gates ride **inside** the bundle and have no external dependency.

To graft MTDD into a target repo, follow the [Quickstart](#quickstart--drop-into-a-new-repo)
above: copy the **lean subset** for your language (core + one style pack — see
[`_build_share/README.md` § "What to copy"](_build_share/README.md)), then run
`/mtdd-init` once. There's no toolchain to install — the gates need only `git` +
`sh`; `/mtdd-init` just settles the per-repo values (branch, test commands, source)
so the phases don't re-ask. `mtdd-init` validates the layout and warns if the bundle
isn't grafted where Claude Code can find it.

See [`_build_share/BEADS-SETUP.md`](_build_share/BEADS-SETUP.md) for the safe
beads configuration (Dolt backend, gitignored export) that keeps a `bd close`
from silently reverting on a later branch switch.

### Gate hooks (autonomous runs only)

`mtdd-implement` ships gate hooks in its frontmatter, all active **only** inside
an autonomous sub-agent and no-op / fail-open interactively:

- **`Stop` → `stop-guard.sh`** — fires as `SubagentStop` as the autonomous
  implement finishes, enforcing the TDD-order gate before the review sub-agent
  spawns (a bad cycle never reaches review).
- **`PreToolUse` on `git checkout`/`switch` → `clean-tree-guard.sh`** — denies
  branch setup while the inherited tree is dirty, so pre-existing uncommitted
  changes can't ride onto the feature branch.
- **`PreToolUse` on `bd *` (once/session) → `beads-safety-guard.sh`** —
  non-blocking warning if beads is in the config where a close silently reverts
  after a `git checkout`. (`mtdd-merge` carries this one too.)

---

## When to use what

- **One phase at a time, reading the diff yourself** → call the phase skills
  directly (`/mtdd-implement`, `/mtdd-review`, `/mtdd-verify`, `/mtdd-merge`).
- **Hands-free implement → review → verify** → `/mtdd-cycle <id>`, then
  run the smoke checklist and `/mtdd-merge` yourself.
- **Fully autonomous, self-healing loop** → that's **not** MTDD. MTDD is HITL by
  design; an `afk`-labeled bead is refused by `mtdd-implement`. (In the full
  chain, autonomous work is owned by a separate AFK runtime.)
