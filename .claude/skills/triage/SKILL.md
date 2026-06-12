---
name: triage
disable-model-invocation: true
description: |-
  Triages issues that did NOT come through the chain — human-filed bugs and requests, /health-audit findings, or anything not minted by /publish-issues. Assigns a category (bug or enhancement), a priority (P0 to P3), and a routing state (needs-info, ready-for-agent, ready-for-human, wontfix); it recommends and the maintainer decides. Recognises a chain-origin ticket by its feature label and skips it — the chain already specced it. Routes a bug needing root cause to /diagnose and ready work into the build path. Use for "/triage", "triage this", "anything need my attention", "look at issue 42", "move 42 to ready-for-agent", "what is ready for agents", or after /health-audit lands findings. Do NOT use for generating chain issue content (/to-issues), publishing tickets (/publish-issues), spec authoring (/prd, /design, /plan), feature-boundary verification (/qa), or root-causing a bug yourself (/diagnose).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# triage — classify and route non-chain issues

The inbox manager for the project tracker — it sorts the part of the pile the chain did
not already classify. Inputs are **issues that did not come from `/publish-issues`**:
human-filed bugs and requests, and `/health-audit` findings. Each run gives a loose issue
a **category**, a **priority**, and a **routing state**, then hands it to the right next
step. You recommend; the maintainer decides (see Critical rules).

<what-to-do>

Copy this checklist and tick as you go:

```
triage progress:
- [ ] Phase 0: Ground + detect backend / mode / label map
- [ ] Phase 1: Survey — show what needs attention (the no-arg entry)
- [ ] Phase 2: Classify ONE non-chain issue (chain-origin → detect & skip)
- [ ] Phase 3: Recommend → maintainer decides → apply the outcome
- [ ] Hand-off: emit one verdict (TRIAGED / ROUTED / PARKED / SURVEY-ONLY / SKIPPED-CHAIN-TICKET)
```

### Phase 0 — Ground and detect

Near-zero preconditions — triage runs against a **tracker**, not against `.ai/`. Don't
block on missing upstream artifacts.

1. **Detect the backend** — beads (`bd`), Jira (Atlassian Rovo MCP, else `acli`/REST),
   markdown (`tickets/`), or a GitHub-style tracker (`gh`). Mirror the adapter
   conventions in [`../publish-issues/references/`](../publish-issues/references/).
2. **Load the optional context — if present.** `.ai/context.md` (domain glossary) sharpens
   a codebase exploration; `.out-of-scope/*.md` (see
   [`references/out-of-scope.md`](references/out-of-scope.md)) lets you spot a request that
   was already rejected. **Absent → note in one line and proceed.**
3. **Load `tracker_label_map` from `.ai/anchor.md` if present** — the project's tracker may
   name labels differently (e.g. GitHub `bug` for `category-bug`). Apply it consistently
   when reading and writing. Absent → use the canonical strings (see Label vocabulary).

### Phase 1 — Survey (the no-arg entry)

On a bare `/triage`, query the tracker and present three buckets, oldest first:

1. **Unlabeled** — never triaged.
2. **`needs-triage`** — flagged for evaluation (this is what `/health-audit` writes).
3. **`needs-info` with reporter activity** since the last triage note — needs re-look.

Show counts and a one-line summary per issue. Let the maintainer pick one. If nothing
needs attention, say so and emit `SURVEY-ONLY`.

### Phase 2 — Classify one issue

**First, detect chain origin and skip if found.** A `feature-<slug>` label plus the
`/publish-issues` disclaimer line marks a ticket the chain already specced (`/prd → /design
→ /plan → /to-issues` set its category, routing, and priority). **Do not re-triage it** —
say so in one line ("#42 is a chain ticket; it's already specced — leave it to the
chain") and emit `SKIPPED-CHAIN-TICKET`. Triage owns only non-chain work.

For a **non-chain** issue:

1. **Gather context.** Read the full issue (body, comments, labels, reporter, dates) and
   any prior triage notes so you don't re-ask resolved questions. Explore the codebase
   using the domain glossary if present; respect nearby ADRs. Check `.out-of-scope/` and
   surface any prior rejection that resembles this issue.
2. **Recommend category, state, and priority** — one-line rationale each (rubrics in
   `<supporting-info>`), plus a brief code summary relevant to the issue. Wait for direction.
   Talk in plain English, one question at a time (audience is the maintainer; see
   [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions)).
3. **Bugs — reproduce, or hand to `/diagnose`.** Attempt a quick repro from the reporter's
   steps. A confirmed repro makes a far stronger brief. If the bug needs real root-cause
   work (not obvious, flaky, or a regression), **route it to
   [`/diagnose`](../diagnose/SKILL.md)** rather than guessing here — emit `ROUTED`.

### Phase 3 — Apply the outcome

Set the maintainer-confirmed category, state, and priority (dedicated priority field on
beads/Jira; a label on a GitHub-style tracker), then take the per-state action:

- **`ready-for-agent`** → write a durable agent brief
  ([`references/agent-brief.md`](references/agent-brief.md)) **and route it into the build
  path** (see § Routing into the build path) — emit `ROUTED`.
- **`ready-for-human`** → same brief, noting why it can't be delegated (judgment, external
  access, design call, manual test).
- **`needs-info`** → post triage notes naming the specific gaps; emit `PARKED`.
- **`wontfix` (bug)** → polite explanation, then close with the maintainer's confirmation.
- **`wontfix` (enhancement)** → record it in `.out-of-scope/`
  ([`references/out-of-scope.md`](references/out-of-scope.md)), link it from a comment, then
  close; emit `PARKED` or `TRIAGED` per the maintainer.
- **`needs-triage`** → apply the role; optional note if there's partial progress.

**Quick override.** "Move #42 to ready-for-agent" / "bump #42 to P1" → trust the
maintainer and apply directly. Confirm what you're about to do, then act. Skip repro and
briefing unless they ask. Priority changes never need anything more.

### Hand-off

Emit exactly one verdict as the last line — these are advisory outcome labels (like
`/diagnose`'s), not chain `READY-FOR-X` tokens. Definitions in `<supporting-info>`.

</what-to-do>

<supporting-info>

## Critical rules

- **Non-chain only.** Triage classifies issues the chain did not. A chain-origin ticket
  (`feature-<slug>` + disclaimer) is detected and **skipped**, never re-triaged — the
  chain already set its category, routing, and priority.
- **Recommend; never auto-apply.** Propose with a rationale, wait for confirmation before
  any label, comment, `.out-of-scope/` write, or close. Flag unusual transitions and ask.
- **AI disclaimer on every post.** `> *This was generated by AI during triage.*` opens
  every comment or issue you write.
- **Don't root-cause here.** A bug that needs real diagnosis goes to `/diagnose`; triage
  classifies and routes, it doesn't debug.
- **One role each.** Exactly one category, one state, one priority per triaged issue. Two
  of any → flag the conflict and ask before doing anything else.
- **No `.ai/` artifact, no progress-tracker append.** Like `/ship` and `/diagnose`, triage
  writes no `.ai/` file. Tracker changes are high-frequency and live on the tracker — never
  log them to `.ai/progress-tracker.md`. The only file it may write is `.out-of-scope/`.

## Category, state, and priority rubrics

**Category** — `category-bug` (something is broken) or `category-enhancement` (new feature
or improvement).

**State** (exactly one) — `needs-triage` (evaluation pending) · `needs-info` (waiting on
the reporter) · `ready-for-agent` (fully specified, an AFK agent can take it) ·
`ready-for-human` (needs human implementation) · `wontfix` (will not be actioned). An
unlabeled issue normally goes to `needs-triage` first; `needs-info` returns to
`needs-triage` once the reporter replies.

**Priority** (exactly one) — `P0` production-down / security / release-blocker (drop
everything) · `P1` significant user or workflow impact (next) · `P2` default, normal
cadence (most issues) · `P3` nice-to-have (backlog).

## Label vocabulary

Canonical label strings are the role names above. Honor `.ai/anchor.md`'s
`tracker_label_map` consistently in both directions — the **same** map `/publish-issues`
honors (see [`../publish-issues/SKILL.md` § Label vocabulary](../publish-issues/SKILL.md)).
Chain-internal labels (`f-id-*`, `nfr-*`, `skip-tests`, `lang:*`, `feature-<slug>`) are
**never remapped**.

## Routing into the build path

A `ready-for-agent` issue is not chain-specced, so it needs a body an executor can work
from — and a home in the build queue. Route it **source-aware** (the same split
`/diagnose` uses):

- **Bare repo** (no `.ai/`) → write a free-form `tasks/<slug>.md` from
  [`../_build_share/task-template.md`](../_build_share/task-template.md); the agent brief is
  its body, and a confirmed bug repro is **acceptance criterion #1**. Tell the maintainer to
  run it through their execute loop (e.g. `/mtdd-implement tasks/<slug>.md` — an example, not
  a requirement).
- **Chain repo** (`.ai/` present) → route it as a `category: bug` (or enhancement) slice via
  [`/to-issues`](../to-issues/SKILL.md), so it joins the canonical issue files and the build
  loop drains it the normal way.

Triage's job ends when the issue is `ready-for-agent` and a task is routed. **What runs it
next — `/mtdd-*`, or any executor — is a separate step the maintainer drives; an executor
consumes triage's output, it never invokes triage.** Triage sits beside the chain, not
inside it; it has no coupling to `/to-issues` or `/publish-issues` beyond reusing the
`tracker_label_map` convention and this build-path routing.

## Verdicts (advisory outcome labels)

| Verdict | Meaning |
|---|---|
| `TRIAGED` | issue classified; category / state / priority applied (and a `wontfix` recorded, if any) |
| `ROUTED` | handed forward — a bug to `/diagnose`, or `ready-for-agent` work into the build path (free-form task or `/to-issues` slice) |
| `PARKED` | `needs-info` (waiting on the reporter) or a recorded `wontfix` — no further action until something changes |
| `SURVEY-ONLY` | Phase 1 survey shown; nothing mutated |
| `SKIPPED-CHAIN-TICKET` | the issue is chain-origin; left to the chain, not re-triaged |

</supporting-info>
