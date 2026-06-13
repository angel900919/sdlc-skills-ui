# CLAUDE.md — sdlc-command-center

> **Starter template** seeded by `/anchor`. Replace the placeholders, trim sections that don't fit this project's tier (`.ai/anchor.md`), and keep it short and scan-friendly. Long-form rules live in `.claude/skills/_shared/`.

A local web app that lets one developer drive Claude Code and the AI-assisted SDLC skill chain from a browser instead of a raw terminal.

---

## How work happens in this repo

This project follows the SDLC skill chain. **Every step is manually invoked, one at a time, by the human.** You do not auto-loop through phases.

- **Front of chain (1× per project):** `/intake` → `/discovery` → `/understand` → `/feature-map`
- **Foundation (1×):** `/anchor` → `/architect` → `/bootstrap` (greenfield) or `/explore` (brownfield)
- **Per feature:** `/prd` → `/research` (brownfield) → `/design` → `/plan`
- **Lifecycle:** `/promote` gates prototype → mvp → production; never bump the tier by hand.

When unsure where you are, read the verdict line at the bottom of the most recent `.ai/` artifact — every skill names the next step explicitly.

---

## The two-folder model

- **`.human/`** — plain English + diagrams. The only place a person reads or edits.
- **`.ai/`** — the machine-facing source of truth (structured YAML/tables). Agents read this; never infer state from chat history.

| Question | Where |
|---|---|
| Stack, tier, lifecycle stage, toolchain | `.ai/anchor.md` |
| High-level architecture (HLD), components, ADRs | `.ai/architecture/` (or `.ai/architecture.md` at prototype) |
| Domain glossary + entity models + invariants | `.ai/context.md` |
| Feature roster + status | `.ai/features.md` |
| Per-feature spec / design / plan | `.ai/specs/<feature>/{prd,design,plan}.md` |
| Append-only session log | `.ai/progress-tracker.md` |

---

## Hard prohibitions

- **NEVER** `git push` — the user pushes manually.
- **NEVER** `git merge`/`git rebase`/`git reset --hard`/`git push --force`/`--no-verify` outside the skill that owns it.
- **NEVER** auto-loop chain skills. Each invocation is a deliberate human decision.
- **NEVER** hand-bump the project tier — advancing prototype → mvp → production is `/promote`'s gated job.
- **NEVER** edit a frozen per-feature spec after the skill that owns it has written it.
- **NEVER** put a diagram in a `.ai/` file — diagrams live in `.human/` only.

---

## Branch and commit conventions

- **Branch:** `feature/<feature>-slice-<N>` (or `feature/<slug>` for free-form work).
- **Commit prefixes (TDD):** `red:` failing test · `green:` minimal pass · `refactor:` clean-up while green · `chore:` housekeeping.
- Mirror recent commit style — run `git log -n 10 --oneline` before your first commit on a fresh branch.

---

## Deeper references

| Topic | File |
|---|---|
| Folder model, chain, advisory gates, tier dial, tracker | `.claude/skills/_shared/conventions.md` |
| Machine artifact schemas | `.claude/skills/_shared/ai-schema.md` |
| Downstream integration contract | `.claude/skills/_shared/downstream-integration.md` |
| Tier definitions, ADR/EARS/naming formats, build-time style packs | added under `.claude/skills/_shared/` as later skills are built |
