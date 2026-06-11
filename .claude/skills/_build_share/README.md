# MTDD shared rule packs & gates

This folder holds the **shared rule packs** and **gate scripts** the `mtdd-*`
skills load on demand. It is not a workflow doc — for how the skills fit
together (the implement → review → verify → merge loop), see [`../README.md`](../README.md).

> MTDD is the human-in-the-loop half of a larger TDD chain. This bundle runs
> fully standalone; the full-chain orchestration (slice planning, publishing,
> QA) lives with that chain, not here.

## What to copy — portable core vs optional extras

MTDD grafts into any git repo by copying this `_build_share/` folder beside the
`mtdd-*` skill folders (Claude Code discovers skills only at
`.claude/skills/<name>/`). Not every file is needed for every project — four tiers:

**Core (always copy).** The portable engine — works in any git repo with no external
tooling:

- `task-sources.md`, `coding-standards.md`, `ai-code-audit.md`, `task-template.md`
- `mtdd-init.sh`, `.gitattributes`, this `README.md`
- `gates/` — all four (git-only POSIX shell)
- `lint-skills.py` — dev/CI helper; tiny, optional

**Language packs (copy the ones you use).** Loaded only when a task touches that
language/surface:

- `ts-styleguide.md` (TypeScript) · `py-styleguide.md` (Python) · `react-rules.md`
  (React/Next.js) · `architecture-rules.md` (architecture tasks)

**Optional deep reference (skip for a lean drop-in).** Bulky, consulted only when a
distilled pack isn't enough:

- `full/` — the complete 1500+-line Google style guides
- `clean-architecture/` — *Clean Code* Part III chapter docs, the source for the
  distilled `architecture-rules.md`

**Chain / beads adapters (only with the backing system).** Inert in a plain repo:

- `BEADS-SETUP.md` — beads operator reference; needs the `bd` CLI
- `PROGRESS-TRACKER.md` — the chain's `.ai/progress-tracker.md` breadcrumb format;
  `/mtdd-merge` skips it when there's no `.ai/`

A minimal **TypeScript** drop-in is therefore the core set + `ts-styleguide.md`
(+ `react-rules.md` for a React app); a minimal **Python** drop-in is the core set +
`py-styleguide.md`. Everything else is opt-in. The `Tier` column in the table below
marks each file the same way.

## Shared rule packs

Loaded by `/mtdd-implement` and `/mtdd-review` at the briefing step (step 1.7 /
1.5), classified per task so only the matching packs load.

> **All packs in this folder are edited in place — they are the source of truth.** (`coding-standards.md`, `ts-styleguide.md`, and `py-styleguide.md` were previously generated from a `core/` tree via `pnpm sync` in the larger chain; for the standalone MTDD bundle that coupling is removed — edit these files directly.)

| File | Tier | Loaded by | Purpose |
|---|---|---|---|
| [`task-sources.md`](task-sources.md) | core | all four `/mtdd-*` skills | The task-source model: free-form `tasks/<slug>.md` (the portable core) + the beads and canonical adapters; how each skill resolves the source, reads fields, and writes back |
| [`coding-standards.md`](coding-standards.md) | core | `/mtdd-implement` + `/mtdd-review` | Write-time standards (testing, mocking, deep modules, safety, maintainability) |
| [`ai-code-audit.md`](ai-code-audit.md) | core | `/mtdd-review` | Review-time audit of AI-generated diffs (context-gap, phantom deps, over-engineering, test theater, risk matrix) |
| [`task-template.md`](task-template.md) | core | `/mtdd-implement` (free-form source) | Copy to `tasks/<slug>.md` when working a one-off task |
| [`ts-styleguide.md`](ts-styleguide.md) | lang | `/mtdd-implement` + `/mtdd-review` | Google TypeScript style, distilled to write-time imperatives |
| [`py-styleguide.md`](py-styleguide.md) | lang | `/mtdd-implement` + `/mtdd-review` | Google Python style, distilled to write-time imperatives |
| [`react-rules.md`](react-rules.md) | lang | `/mtdd-implement` + `/mtdd-review` | 2025-2026 React / Next.js rule packs (component / hook / page / form / ai / performance / cross-cutting) |
| [`architecture-rules.md`](architecture-rules.md) | lang | `/mtdd-implement` + `/mtdd-review` | Clean Architecture write-time imperatives (distilled). Source chapters live in [`clean-architecture/`](clean-architecture/). |
| [`clean-architecture/`](clean-architecture/) | deep-ref | `/mtdd-implement` + `/mtdd-review` (deeper material) | Chapter docs from *Clean Code 2nd Ed.* Part III. Source for the distilled `architecture-rules.md`. **Skip for a lean copy.** |
| [`full/typescript.md`](full/typescript.md) | deep-ref | reference when distilled `ts-styleguide.md` isn't enough | Complete Google TypeScript Style Guide (1500+ lines). **Skip for a lean copy.** |
| [`full/python.md`](full/python.md) | deep-ref | reference when distilled `py-styleguide.md` isn't enough | Google Python Style Guide. **Skip for a lean copy.** |
| [`BEADS-SETUP.md`](BEADS-SETUP.md) | adapter | operator reference (beads) | Safe beads config (gitignored export) so a `bd close` can't silently revert on a branch switch |
| [`PROGRESS-TRACKER.md`](PROGRESS-TRACKER.md) | adapter | `/mtdd-merge` (optional) | `.ai/progress-tracker.md` breadcrumb format — chain convention, optional standalone |

## Gates (`gates/`)

Git-only POSIX shell — no Node/tsx, so they run in any repo with `git` + `sh`:

| Script | Used by | Role |
|---|---|---|
| `tdd-check.sh` | `/mtdd-review` step 3 + `/mtdd-implement` self-check | TDD commit-order gate (hard reject at review) |
| `stop-guard.sh` | `mtdd-implement` `Stop` hook (autonomous only) | Blocks hand-off on a mis-ordered branch |
| `clean-tree-guard.sh` | `mtdd-implement` `PreToolUse` hook (autonomous only) | Denies branch setup on a dirty inherited tree |
| `beads-safety-guard.sh` | `mtdd-implement` / `mtdd-merge` `PreToolUse` (once/session) | Non-blocking warning if beads state is git-tracked |

All four are **core** — copy the whole `gates/` folder. They have no external
dependency (`git` + `sh` only); `beads-safety-guard.sh` simply no-ops in a repo
without beads.

## One-time setup (`mtdd-init`)

`mtdd-init.sh` is a git-only POSIX detector (no Node/jq) that the [`mtdd-init`](../mtdd-init/SKILL.md)
skill runs once per repo to settle the values the phases would otherwise re-sniff
every run — default branch, language, typecheck/test commands, and task source —
into a small sh-sourceable `.mtdd/config`:

```sh
sh .claude/skills/_build_share/mtdd-init.sh            # print detected key=value lines
sh .claude/skills/_build_share/mtdd-init.sh --write    # also write ./.mtdd/config
```

`.mtdd/config` is **optional and additive**: when absent, every phase falls back to
its existing runtime detection. When present, `/mtdd-implement` reads
`mtdd_target_branch`, `/mtdd-verify` reads `mtdd_typecheck_cmd` / `mtdd_test_cmd` /
`mtdd_language`, and the task-source resolution reads `mtdd_task_source`. It's
project-level (not machine-level), so commit it. The script also validates the
bundle layout (`gates/` beside it, `.claude/skills/mtdd-*` present) and warns on
stderr if MTDD isn't grafted where Claude Code can discover it.

## Linting the skills

`lint-skills.py` strict-validates every `mtdd-*/SKILL.md` frontmatter — run it after editing any skill, or wire it into CI:

```sh
python3 .claude/skills/_build_share/lint-skills.py        # auto-discovers all mtdd-* skills
# Windows: use `python` if `python3` isn't on PATH.
```

It does a real YAML parse (catches structural bugs the lenient `write-a-skill/validate_frontmatter.py` misses, e.g. an unquoted `description:` containing a colon-space), plus name/description presence, length (≤64 / ≤1024), reserved-word and angle-bracket checks. Exit 0 = all pass, 1 = a failure. Uses PyYAML if present; without it, degrades loudly (warns + runs a targeted stdlib check for the colon-space failure mode rather than passing silently).

## How packs get picked

You never pass a language flag. Each skill classifies the task itself (from the
`files:` array / file mentions and any `language:` / `surface:` frontmatter) and
loads only the matching packs:

- `.ts` / `.tsx` → `ts-styleguide.md` · `.py` → `py-styleguide.md`
- React / Next.js / `.tsx` UI → `react-rules.md` (only the matching sub-packs)
- new module boundary / third-party SDK / deferrable tech decision → `architecture-rules.md`

`/mtdd-implement` loads them to **brief before coding**; `/mtdd-review` loads the
same set to **enforce against the diff**.

## Operating rules

1. **One task per branch.** Don't bundle slices onto one feature branch — review gets confused.
2. **Never commit to the target branch directly.** All work goes via a `feature/...` branch.
3. **Don't hand-edit the task's `## Acceptance criteria` checkboxes.** Review records the verdict in the `<criteria>` block; merge copies the final state into `## Completion`. (Beads: let `bd update --acceptance` keep it in sync.)
4. **Don't skip phases.** Review catches what the implementer rationalized away; verify catches what the reviewer trusted optimistically.
5. **You push, not the agent** — even after a successful merge.
6. **One `bd` writer at a time.** While an mtdd skill is mid-run on a bead, don't run host-side `bd` write commands; read-only `bd show` from another terminal is fine.
