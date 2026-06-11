# cycle-state — the MTDD cycle state machine (single source of truth)

This file defines the `.mtdd/cycle-state` schema, the read snippet sub-agents use
to decide their confirmation pause, and the orchestrator's transition table —
**once**. `mtdd-cycle`, `mtdd-implement`, and `mtdd-review` all reference this doc
one hop, so the producer (the orchestrator, which writes the file) and the
consumers (the phase skills, which read the run mode from it) cannot disagree.

It replaces the retired `MTDD-AUTONOMOUS` free-text sentinel. The old sentinel was
an unvalidated magic word passed through a natural-language prompt: garble it and
the sub-agent stalled forever waiting for a `go` no one would type. The state file
is durable, validated, id-matched, and **fails loud** instead of stalling.

## Where it lives

`.mtdd/cycle-state` — same directory and same sh-sourceable `key=value` format as
`.mtdd/config`, but with the opposite commit policy:

| File | Written by | Lifetime | Committed? |
|---|---|---|---|
| `.mtdd/config` | `/mtdd-init` | project-level settled setup | **yes** — the team shares it |
| `.mtdd/cycle-state` | `/mtdd-cycle` (orchestrator only) | one runtime cycle | **no** — git-ignored runtime state |

`/mtdd-init` adds `.mtdd/cycle-state` to the repo's `.gitignore`.

## Schema

```
# .mtdd/cycle-state — written ONLY by /mtdd-cycle. Runtime, git-ignored.
# sh-sourceable key=value, like .mtdd/config.
mtdd_cycle_id=<IDENTIFIER>            # the task this cycle is for (bead id / ticket path / task path)
mtdd_cycle_branch=<branch | empty>   # filled once implement reports its feature branch
mtdd_cycle_phase=<implement | review | verify | done | halted>
mtdd_cycle_mode=<autonomous | interactive>
mtdd_cycle_last_verdict=<DONE | BLOCKED | COMPLETE | REJECT | PASS | FAIL | empty>
```

## Single writer

**Only the orchestrator (`/mtdd-cycle`) ever writes `.mtdd/cycle-state`.** The phase
sub-agents (`implement`, `review`, `verify`) **read** it to decide their pause and
nothing more — they never write it. One writer means no producer/consumer write
race and no drift. The orchestrator gets the branch from implement's report and
records it after Gate A; the branch name is deterministic from the identifier, so a
crash mid-implement is recoverable on resume without implement having written
anything.

## The run-mode read (consumers: implement step 1.7d, review step 1.5d)

At its confirmation pause, a phase skill decides **autonomous vs interactive** by
reading this file, **id-matched** against the identifier it was invoked with:

```sh
# my_id = the identifier this phase was invoked with.
state=.mtdd/cycle-state
if [ -f "$state" ]; then
  # shellcheck disable=SC1090
  . "$state" 2>/dev/null || { echo "BLOCKED: cycle-state unreadable"; exit 1; }
  if [ "$mtdd_cycle_mode" = autonomous ] && [ "$mtdd_cycle_id" = "$my_id" ]; then
    echo autonomous          # skip the pause — the orchestrator is driving this task
  else
    echo interactive         # stale/other-task file → normal human path
  fi
else
  echo interactive           # no cycle in progress → normal human path
fi
```

Three outcomes, by design:

- **autonomous** — file present, `mode=autonomous`, **and** `mtdd_cycle_id` equals
  this phase's identifier → skip the pause and proceed as if the user replied `go`.
- **interactive** — no file, or `mode` is not autonomous, or the id does **not**
  match → take the normal human path: surface the pause and wait for `go`. The
  id-match is the defense against a stale or leaked state file wrongly
  auto-proceeding a human's later standalone run on a *different* task.
- **BLOCKED (fail loud)** — the invocation explicitly says this phase is running
  under an autonomous `/mtdd-cycle` for this id, but the read above cannot confirm
  it (file missing, unreadable/garbled, mode not autonomous, or id mismatch). Then
  the phase reports `BLOCKED: cycle-state unreadable` instead of pausing. A garbled
  spawn prompt becomes a loud `BLOCKED` the orchestrator catches at Gate A — never
  a silent stall. (A human running the phase standalone never carries that
  autonomous claim, so the absent file is just the ordinary interactive path, not a
  BLOCKED.)

This read decides **only** the confirmation pause. It never softens a genuine
refusal, blocker, REJECT, or test failure — those gates stay honest.

## Transition table (the orchestrator owns this)

| Current phase | Verdict from the sub-agent | Next phase | Orchestrator writes / does |
|---|---|---|---|
| *(no file)* | — | `implement` | create the file: `phase=implement`, `mode=autonomous`, `id=IDENTIFIER`, `branch=` empty, `last_verdict=` empty |
| `implement` | `DONE` | `review` | record the reported branch; `phase=review`, `last_verdict=DONE` |
| `implement` | `BLOCKED` | `halted` | `phase=halted`, `last_verdict=BLOCKED`; surface the blocker; stop |
| `review` | `COMPLETE` | `verify` | `phase=verify`, `last_verdict=COMPLETE` |
| `review` | `REJECT` | `halted` | `phase=halted`, `last_verdict=REJECT`; surface the criteria; stop (do **not** verify) |
| `verify` | `PASS` | `done` | `phase=done`, `last_verdict=PASS`; surface the smoke checklist; stop (do **not** merge) |
| `verify` | `FAIL` | `halted` | `phase=halted`, `last_verdict=FAIL`; surface the failing gate; stop |

A four-state, mostly-linear machine with two terminals (`done`, `halted`). A file
plus this table is the right altitude — **not** a state-machine library.

## Resume

Re-running `/mtdd-cycle <IDENTIFIER>` reads an existing `.mtdd/cycle-state`. If the
file is present **and** `mtdd_cycle_id` matches the identifier given:

| Recorded `phase` | Resume action |
|---|---|
| `implement` | re-spawn implement; it detects the existing feature branch and resumes |
| `review` | re-spawn review against the recorded `mtdd_cycle_branch` |
| `verify` | re-spawn verify against the recorded `mtdd_cycle_branch` |
| `done` | report the cycle already completed; next is the manual smoke + `/mtdd-merge` |
| `halted` | a human fixed the cause; restart at implement (`phase=implement`) — every halt (BLOCKED / REJECT / FAIL) is fixed by re-implementing |

If the file is present but the id does **not** match, a *different* task's cycle is
in flight — refuse and tell the user, rather than clobbering it.
