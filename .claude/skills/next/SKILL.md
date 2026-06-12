---
name: next
disable-model-invocation: true
description: Boundary-aware guidance at the current chain position — a forward decision, plus an optional backward recap for re-entry. Refreshes dashboard/state.json (via _build_share/project-state.py), walks foundation → per-feature → per-slice mtdd-* to find exactly which boundary the project sits at, asks 3–5 questions citing this project's real artifacts and feature slugs by name, then commits to ONE slash command + one alternative + one rule citation. `/next --resume` (or any run after a gap) first reads the backward-looking trail (progress-tracker, .ai/current-issues.md, in-flight slices, git log, recent specs/ADRs) and synthesizes a staleness-aware recap before recommending. Never invokes the recommended skill — the user types it. Use for "/next", "what's next", "what should I do", "guide me at this boundary", "/resume", "i'm back", "where did I leave off", "catch me up". Do NOT use for text/HTML status (/status), coherence audit (/coherence-check), or advancing a feature (the canonical skill it recommends).
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
---

# next — boundary-aware guidance (forward + optional recap)

Forward-looking decision aid. Identifies where the project sits in this chain —
foundation (1× per project) → per-feature loop (N×) → per-slice mtdd-* sub-loop —
asks a few project-specific questions, and commits to **one** slash command.
**Never invokes it** — the user keeps agency. `--resume` prepends a backward recap
for re-entry after a break (the absorbed `/resume`). Orthogonal to the chain.

<what-to-do>

## Critical rules (read before starting)

1. **Never invoke another chain skill.** Suggest only; stop after the recommendation.
2. **Never ask a generic question.** Every question cites this project's actual names — feature slug, component from `02-components.md`, a term from `.ai/context.md`, an F-ID from a PRD, a slice ID, an ADR number. Bad: *"do you have multiple bounded contexts?"* Good: *"`strategic-design.md` names `billing` and `invoicing` — does `late-fees` touch both?"*
3. **One primary recommendation.** Can't pick between two → ask one more question instead of offering two.
4. **Cap forward output ≤ 40 lines.** Guidance, not a report. (`--resume` adds the recap under its staleness band — Phase R.)
5. **Prefer skip over run** where the chain's optional-phase rules permit (`/research`, `/event-storm`, `/ddd-strategy`, `/to-fitness`, `/explore`, `/bootstrap`). See the skip-rules table.
6. **Read-only.** No writes anywhere; no `progress-tracker.md` append (read-only audits per [`../_build_share/PROGRESS-TRACKER.md`](../_build_share/PROGRESS-TRACKER.md) § When to append). Never read project source (`src/`, `app/`) — read artifacts + breadcrumbs.
7. **Verdict** — exactly one of: `RECOMMENDATION-MADE → /<skill> <args>` · `RECAP-AND-RECOMMENDATION → /<skill> <args>` (resume mode) · `BLOCKED-ON-STATE → /status` (state.json missing AND generator failed) · `BLOCKED-ON-ANCHOR → /anchor` · `BLOCKED-ON-FEATURES → /feature-map` · `NEW-PROJECT → /intake or /anchor` (no commits, no `.ai/`).

## Procedure

```
next progress:
- [ ] Phase 0: Refresh dashboard/state.json; validate floor (anchor + features)
- [ ] Phase R: (--resume or a detected gap) backward recap, staleness-banded
- [ ] Phase 1: Identify the boundary (per-slice → per-feature → foundation, inside-out)
- [ ] Phase 2: Read the most-relevant artifacts for that boundary
- [ ] Phase 3: Mini-grill (3–5 project-specific questions)
- [ ] Phase 4: Commit (primary + alternative + rule). Verdict.
```

### Phase 0 — Refresh + validate

```bash
python3 .claude/skills/_build_share/project-state.py    # refresh state.json (read-only)
```

Generator fails AND `state.json` absent → **BLOCKED-ON-STATE → /status** (run `/status --html` once to regenerate, then re-run). Floor: `.ai/anchor.md` absent → **BLOCKED-ON-ANCHOR**; `.ai/features.md` absent → **BLOCKED-ON-FEATURES** (anchor-absent wins). No commits AND no `.ai/` → **NEW-PROJECT → /intake or /anchor**. The authoritative chain order + optional-phase conditions live in [`../_shared/downstream-integration.md` §12](../_shared/downstream-integration.md) and [`../_shared/conventions.md` § The chain](../_shared/conventions.md); the tables below mirror them — if they disagree, those win.

### Phase R — Backward recap (only `--resume`, or auto when last activity > 24h)

Read the backward trail in order (skip anything absent; never invent): `state.json` (`recentCommits`, `recentlyModified`, `progressTail`) → `.ai/progress-tracker.md` top 10 (each `Next:` line is the strongest "I was about to" signal) → **`.ai/current-issues.md`** (gitignored — always read if present; highest-signal "what was I debugging", invisible to git) → in-flight slices (any `tickets/<feature>/SLICE-*.md` with a `## Status log` but no `## Completion`) → `git log` (~14d, last 10) → recent ADRs → last `.ai/discovery/*.md` if within the gap. Then print a recap, capped by staleness band:

| Band (days since last activity) | Cap | Style |
|---|---|---|
| < 24h | ≤ 8 lines | "You were just here." 2-line summary + jump to the recommendation |
| 1–7d | ≤ 30 lines | Standard recap |
| > 7d | ≤ 45 lines | Standard + one sentence per active feature naming its most recent decision |
| > 60d | ≤ 45 lines | Lead with "dormant for N days; here's where it was last." |

Recap shape: `Welcome back. Last activity <N>d ago (<sha> <subject>).` → a 3–5-sentence plain-prose paragraph (lead with what most recently *completed*, then what's *in flight* by slice ID + phase, then any *open question* from `current-issues.md`) → `Open threads:` (1–5 bullets, each one artifact + one pending action; prioritize in-flight slice > current-issues > open spec comment > postponed `Next:`). Then flow straight into Phase 1 — the merged skill does the recap **and** the forward pick in one pass.

### Phase 1 — Identify the boundary (inside-out, first match wins)

| Signal in `state.json` | Boundary → recommendation |
|---|---|
| Any slice `status: in-progress` | **per-slice mtdd-*** — pick THAT slice (table below) |
| Any feature `QA-Approved` | `/ship <feature>` |
| Any feature `Deprecated` whose `sunset.md` window has passed | `/sunset <feature>` (remove phase) |
| `Building` + all non-removed slices `merged` | `/qa <feature>` |
| `Building` + any slice `published` (ready) | `/build <feature>` |
| `Building` + no slice files | `/to-issues <feature>` |
| `Planned` + no `plan` | walk PRD → research → design → fitness → plan (first gap) |
| Any feature `Shipped` past its PRD metric timeframe with no `.ai/specs/<feature>/outcome.md` | `/measure <feature>` — the metric is due its reckoning |
| Foundation gap in `state.json.foundation` | earliest missing step |

Per-slice phase from the in-progress slice's last `## Status log` line: `red:` / none → `/mtdd-implement <ref>` · `green:` / `refactor:` → `/mtdd-review <ref>` · `review: COMPLETE` → `/mtdd-verify <ref>` · `review: REJECT` / `verify: FAIL` → `/mtdd-implement <ref>` · `verify: PASS` → `/mtdd-merge <ref>`. `<ref>` = `slice.backendRefs.beads || .jira || slice.id`. Foundation walk: `/discovery` → `/understand` → (`/event-storm` opt) → `/feature-map` → `/anchor` → (`/ddd-strategy` opt) → `/architect` → (`/threat-model` prod/uplift) → (`/ux-spec` UI projects) → `/test-strategy` → (`/data-management` datastore) → (`/bootstrap` greenfield / `/explore` brownfield) → `/environments` → `/pipeline`; first missing artifact is the boundary. `state.json.foundation` carries only the pre-gap-wave steps — probe the rest on disk (`.ai/architecture/threat-model.md`, `.ai/design-system.md`, `.ai/test-strategy.md`, `.ai/data-management.md`, `.ai/environments.md`, `.ai/pipeline.md`), honoring each skill's recorded skip (`SKIPPED-*` in the artifact or tracker means not-a-gap). Brownfield runs `/explore` + the `/environments`/`/data-management` RECOVERY pair right after `/anchor`, and `/pipeline` (RECOVERY) after `/test-strategy` — same membership, different order (README § Workflow 2).

### Phase 2 — Read project context

Always read `.ai/anchor.md` + `.ai/context.md`, plus the boundary-specific artifacts (the active `specs/<slug>/*.md`, slice frontmatter + `## Status log`, `02-components.md` for components/invariants) and `state.json.progressTail[0]`'s `Next:` line (the user's last-stated intent). Enough to make every Phase 3 question cite a real name.

### Phase 3 — Mini-grill (3–5 questions)

Each question: cites this project's names, is Y/N or short-answer, tests whether the next phase applies / can be skipped / needs a different scope, and states what each answer implies (so the user answers once and commits). Per-slice boundaries get lighter verification questions ("you're at green on SLICE-3 — proceed to review?"). For optional phases, test that phase's skip rule (below).

### Phase 4 — Commit

End with exactly:

```
Primary: /<skill> <args>
   — <one-sentence trigger from the likely answer>
Alternative: /<skill> <args>  (or "skip — go to /<next>")
   — <one-sentence different trigger>
Rule: <one-line citation from this chain's _shared/ or downstream-integration §12>
```

Verdict: **RECOMMENDATION-MADE → /<skill> <args>** (or **RECAP-AND-RECOMMENDATION → /<skill> <args>** when `--resume` ran Phase R) — the Primary names the default even if it may flip to the Alternative on the user's answers.

## Skip-rules table

Translate each into a project-specific question (Phase 3); never ask the generic form.

| Skill | Skip rule |
|---|---|
| `/discovery` | Skip if brief is concrete + named customer + falsification obvious |
| `/understand`, `/feature-map`, `/anchor`, `/architect`, `/prd`, `/design`, `/plan`, `/to-issues`, `/publish-issues`, `/build`, `/qa`, `/ship` | Never skip |
| `/event-storm` | Skip unless `understanding/<slug>.md` surfaces cross-aggregate consistency or policies the user can't yet name |
| `/ddd-strategy` | Skip unless ≥ 2 bounded contexts OR `.ai/context.md` shows ubiquitous-language drift OR `/architect` emits `NEEDS-STRATEGIC-DESIGN` |
| `/research` | Brownfield + feature touches unfamiliar code; greenfield always skips |
| `/to-fitness` | Production tier only; skipped on prototype/mvp |
| `/bootstrap` | Greenfield only | 
| `/explore` | Brownfield only |
| `/mtdd-verify` | Per slice; skipped only when frontmatter says `tests: skip-tests` |

</what-to-do>

<supporting-info>

## Refused questions

- "Just do it for me." → run the recommended slash command yourself.
- "Should I deploy?" → `/ship` (human-gated). "Is my code right?" → `/code-review` / `/qa`.
- "Render the dashboard / show me the state." → `/status --html` / `/status`.
- "Show one feature in detail." → `/status <feature>`.
- "Pick the next feature to prioritize." → `/feature-map` update mode.

</supporting-info>
