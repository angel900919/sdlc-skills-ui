# AI-Engineering-OS — Conventions

> **The contract. When anything else — a guide, the playbook, a doc, your memory — disagrees with this file, this file wins. Fix the other place.** One page of file rules, the memory-system contract, versioning, and the governance that keeps the repo alive.

## 1. File conventions

- **Two trees, two altitudes.** `.ai/` is machine-first (terse, high-signal, scannable in one read); `.human/` is narrative-first (plain English, Mermaid). The *same fact* may appear in both — at different altitudes — but has **one source of truth** (named in §3).
- **Naming.** `.ai/` files are lowercase-hyphenated (`project-state.md`). Guides and templates are zero-padded (`01_agentic-coding.md`). ADRs are `adr/NNNN-title.md`. Runbooks are `runbooks/verb-noun.md`.
- **Terseness is a feature in `.ai/`.** Prefer tables, bullets, and status markers over prose. If a human needs the story, it lives in `.human/`.
- **Every doc carries a front-matter stamp:** `owner`, `updated: YYYY-MM-DD`, and `status: live | draft | stale | archived`. An undated doc is treated as stale.

## 2. Status grammar

One vocabulary everywhere (project-state, tasks, checklists):

| Marker | Means |
|---|---|
| `[ ]` / `todo` | Not started |
| `[~]` / `in-progress` | Active this session |
| `[x]` / `done` | Complete **and** `verify.sh`-green |
| `[!]` / `blocked` | Waiting on a named dependency |
| `tailored out: <reason>` | Deliberately skipped — **never silent** |

A step is `done` only when its verification target passed. "Wrote the code" is not done.

## 3. The memory-system contract

Each `.ai/` file **owns** one thing and has one **update trigger**. This is the anti-drift spine.

| File | Owns (source of truth for…) | Updated | Owner |
|---|---|---|---|
| `project-state.md` | current status, in-progress, next, session hand-off | **every task** (agent writes, human verifies at merge) | active dev |
| `architecture.md` | system map, key technical decisions, **invariants** | on any structural/decision change (via PR) | tech lead |
| `coding-standards.md` | conventions, patterns, banned constructs | when a convention changes | tech lead |
| `skills/*`, `rules/*` | reusable expertise / always-on guardrails | when a recurring correction is caught | whoever caught it |
| `decisions/*` | the **why** behind one-way doors (decision traces) | at each irreversible choice | decider |
| `lessons.md` | postmortem learnings + archived-doc pointers | per incident / per prune | active dev |

Rule: **a fact has exactly one home.** `.human/` docs *link to* the owning `.ai/` file rather than restating it; when they must restate (for narrative), the `.ai/` file is authoritative and the human doc is regenerated from it.

## 4. Versioning — the AI release tuple

Every release/tag pins **all** of: `code commit` + `prompt-set version` + `pinned model ID` + `eval-set hash` + `skill versions` (+ `context/memory schema` if you have one). Members you don't use are marked `n-a` — never silently dropped.

- **Prompts, skills, and eval sets are versioned like code** (they live in git, reviewed in PRs).
- **Changing the eval set is itself a versioned change** — it can't be a quiet edit, because it changes what "passing" means.
- **A risky change** (model/prompt swap, a new tool with real authority, an eval-set change, anything touching auth/data) → a decision-trace note in `decisions/` + re-run the affected evals + bump. A **normal change** → just commit well.

## 5. Governance — how the repo stays alive

*(Stated once, here.)* Docs rot the moment they stop being load-bearing. This is the machinery that keeps them true.

**Ownership.** Every file in `.ai/` and `.human/` has a **named human owner** (see §3) and an **AI maintainer role** that drafts and keeps it current. Unowned docs are archived, not orphaned — an unowned doc is a stale doc by default.

**Update rules (who writes what, when).**
- **AI drafts and maintains:** `project-state.md` (every task), first-draft `.human/` feature docs and runbooks, `skills/`, eval cases, and change-note stubs.
- **Human owns and approves:** `architecture.md` invariants, `coding-standards.md`, ADRs, merges, and this governance itself. **AI proposes, human disposes** on anything irreversible.
- **On every PR:** the agent updates `project-state.md` and any doc whose owned fact changed; the human reviewer rejects the PR if a changed invariant/convention/interface didn't update its owning doc. *A doc that drifted from the code is a review blocker, same as a failing test.*

**Review cadence.**
- *Per PR* — memory-system freshness is part of review (see above).
- *Weekly* — read transcripts; grow the eval set; close incident loops; run a staleness sweep (`updated` older than the cadence, or `status: stale`).
- *Quarterly* — re-baseline `coding-standards.md` and `architecture.md`; archive superseded docs; prune dead Skills/rules (delete any Skill that no longer beats its no-skill baseline).

**Archiving (never silent deletion).** A doc that is superseded or unchanged past its review window moves to `.human/archive/` (or its learning is folded into `.ai/lessons.md`) with an `ARCHIVED: <date>, superseded by <link>` stamp. History is kept; only the *live* set stays small. This mirrors PM_SE's "re-baseline, never quiet-edit."

**The human/AI split, in one line:** *AI keeps the docs current and proposes changes; humans own the invariants and approve the irreversible.* Everything the agent does is reversible and reviewed; everything a human signs is durable.

## 6. House rules

1. **The memory system is the source of truth** — a fresh session reads `.ai/` before acting; if the docs and the code disagree, that's a bug in the docs, fix it.
2. **Never let a doc drift silently** — update on change, or stamp it `stale`. A skip is `tailored out: <reason>`, never blank.
3. **Every failure becomes a permanent check** — eval case or deterministic spec, before the loop closes.
4. **Guardrails live outside the model** — enforce with code you own, not with sterner prompts.
5. **Templates show shape, never real data** — `(example — delete)` rows only.
6. **Two altitudes, one truth** — `.ai/` terse and `.human/` narrative, but a fact has exactly one owning home.
7. **Verify volatile facts at decision time** — model pricing, vendor terms, and API shapes are checked current, never recalled.
