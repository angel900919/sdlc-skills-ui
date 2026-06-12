---
name: status
disable-model-invocation: true
description: Read-only project-state reporter — the text + HTML lens over the chain's shared dashboard/state.json (refreshed by the _build_share/project-state.py generator). `/status` prints a roster across every feature; `/status FEATURE` a per-slice deep-dive (status, branch, last activity); `--html` also writes the self-contained dashboard/index.html visual snapshot; `--write` persists the per-feature report to .ai/specs/FEATURE/status.md. Uses state.json as the spine and drills into live tracker records (beads, canonical tickets, or Jira) + git only for detail it doesn't carry. Never mutates specs, plan, issues, or tracker records. Use for "/status", "/status FEATURE", "--html", "where are we on X", "project pulse", "regenerate the dashboard", "show me the project state", or one view of work in flight. Do NOT use for QA evidence (use /qa), coherence audit (/coherence-check), forward guidance (/next), or advancing a feature's lifecycle (the canonical chain skill).
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
---

# status — project-state reporter (text + HTML lens)

The read-only lens over the chain's shared machine state. The generator
[`_build_share/project-state.py`](../_build_share/project-state.py) stitches
`features.md`, slice frontmatter, the progress-tracker tail, fitness, and recent
git into `dashboard/state.json`; this skill renders it. Default output is **text**;
`--html` additionally writes the visual `dashboard/index.html`. `/next` reads the
same spine. Orthogonal to the chain — run it any time; cheap and idempotent.

<what-to-do>

## Critical rules (read before starting)

1. **READ-ONLY by default.** No `Write`/`Edit`/tracker mutation. The only files this skill ever writes are `dashboard/{state.json,index.html}` (mechanical render, never source) and — only on `--write` — `.ai/specs/<feature>/status.md`. Never touches PRD, plan, design, issues, `features.md`, `progress-tracker.md`, or tracker records.
2. **One backend per slice; never invent state.** A slice with `backend_refs.beads: rl-x8z` → `bd show rl-x8z` for its state. Multiple backends → query all; surface disagreement as a `CONFLICT` cell (don't pick a winner). Backend unavailable → `UNAVAILABLE`, never synthesized.
3. **Canonical slice file is source of truth for shape; never edit it to "correct" drift — surface the drift.**
4. **No verdicts about the feature.** Report state + a mechanical `Next:` suggestion. "Ready to ship" is `/qa` + human judgment. Never show full git logs or note histories — "last activity" only.
5. **No-arg = roster; arg = deep-dive.** Two output shapes. Don't auto-deep-dive every feature in roster mode.
6. **`--write` only in deep-dive mode** (per-feature artifact); refuse `--write` with no feature.
7. **Append to progress-tracker only on `--write`** per [`../_build_share/PROGRESS-TRACKER.md`](../_build_share/PROGRESS-TRACKER.md).
8. **Verdict** — exactly one of `STATUS-REPORTED`, `STATUS-PERSISTED → .ai/specs/<feature>/status.md`, `ROSTER-REPORTED`, `BLOCKED-ON-FEATURES → /feature-map`, `BLOCKED-ON-FEATURE → <feature> not in features.md`, `BLOCKED-ON-ANCHOR → /anchor`.

## Procedure

```
status progress:
- [ ] Phase 0: Refresh + read dashboard/state.json (the spine); detect mode; validate args
- [ ] Phase 1: Use state.json as the spine; supplement only gaps (live tracker notes, git detail)
- [ ] Phase 2: Verify/label per-slice status from the spine
- [ ] Phase 3: Render (roster table OR deep-dive); if --html, regenerate dashboard/index.html
- [ ] Phase 4: If --write, persist to .ai/specs/<feature>/status.md + append progress-tracker. Verdict.
```

### Phase 0 — Refresh the spine + detect mode

Refresh `dashboard/state.json` (read-only data refresh, not a chain-skill invocation). With `--html`, also regenerate `dashboard/index.html`:

```bash
python3 .claude/skills/_build_share/project-state.py          # text run → state.json
python3 .claude/skills/_build_share/project-state.py --html   # also writes dashboard/index.html
```

`state.json` carries the roster (`features` with derived Status), the slice board (`slices` with derived status + `backendRefs`), `foundation`, `progressTail`, `recentCommits`, `recentlyModified`, `nextActions`. Use it as the spine — **do not re-stitch what it already computed.** If the generator fails AND `state.json` is absent, fall back to reading the raw artifacts (Phase 1 list) so `/status` still works.

- **Mode:** `/status` → roster · `/status <feature>` → deep-dive · `/status <feature> --write` → deep-dive + persist · `/status --write` (no feature) → refuse. `--html` composes with any mode.
- **Floor:** `.ai/features.md` absent → **BLOCKED-ON-FEATURES**; `.ai/anchor.md` absent → **BLOCKED-ON-ANCHOR** (need `project_tier`); deep-dive feature not a row in `features.md` → **BLOCKED-ON-FEATURE**. A `Planned` feature with no `issues/SLICE-*.md` → report `0 slices, status: Planned` and stop at Phase 3.

### Phase 1 — Read the spine, supplement only the gaps

From `state.json`: roster (`features[]`), slice board (`slices[]` — derived status already computed), last activity (`progressTail` + `recentCommits`), foundation completeness. Supplement only what it lacks: live tracker **note text** (deep-dive, per [`references/tracker-modes.md`](references/tracker-modes.md)), git branch detail, the latest `qa-report.md` Approval, and — when any shipped feature has a `.ai/specs/<feature>/outcome.md` — its outcome verdict (surface it as an extra Outcome column in the roster). **Fallback (no spine):** read `features.md`, every `SLICE-*.md`, `progress-tracker.md`, tracker records, git, and apply Phase 2's tree yourself.

### Phase 2 — Per-slice status (verify/label the spine)

The generator already derived each slice's status; confirm against this tree (first match wins): `status: removed` → removed · `status: open` → planned · published + a `depends_on` not yet merged → blocked · backend terminal + merge commit on target → merged · backend has impl/review/verify notes OR a feature branch → in-progress · backends disagree → conflict · backend query failed → unavailable · else → published. For in-progress/merged slices also capture the **last note**: `<phase>: <one-line> (<short-time>, <SHA>)` (e.g. `merge: COMPLETED at abc1234 (2026-05-22)`).

### Phase 3 — Render

**Roster (no-arg):** one row per `features.md` feature (preserve order): `| Feature | Status | Slices (<merged>/<total non-removed>) | Last activity |`, then a mechanical **Next suggestions** list (only features with an actionable step; append `→ ready for /qa` when all slices merged and no `qa landed` yet). Render `deprecated` and `removed` rows distinctly (e.g. a trailing "retired" section or a struck label) — never mixed in as live features, and never in Next suggestions. Close with "Run `/status <feature>` for a per-slice deep dive."

**Deep-dive (feature arg):** header (Status, tier from anchor + PRD `## Meta`, priority, PRD path, slice tally), then `| # | Title | Status | Backend ref | Branch | Last activity |`, a one-line **QA** summary, a mechanical **Next** (single most-upstream verb from `/to-issues`·`/publish-issues`·`/build`·`/mtdd-{verify,review,merge}`·`/qa`), and a **Drift** section *only* if any slice is `conflict`/`unavailable` (surface `CONFLICT (beads: closed, jira: In Progress)`; never pick one; never fix).

**If `--html`:** confirm `dashboard/index.html` was regenerated in Phase 0 and point the user at it (`open dashboard/index.html`). The HTML is the same data across every feature at once — overview, foundation, features, slices, fitness (production only), activity.

### Phase 4 — Persist (only `--write`) + verdict

No `--write`: print the report → **STATUS-REPORTED** (deep-dive) or **ROSTER-REPORTED** (roster). `--write` (deep-dive only): write `.ai/specs/<feature>/status.md` (the deep-dive body + a `**Generated:** <ISO> by /status --write` / `**Generated against:** <SHA> on <branch>` header; overwrites each run — it's a snapshot), append one progress-tracker entry per [`../_build_share/PROGRESS-TRACKER.md` § Entry format](../_build_share/PROGRESS-TRACKER.md#entry-format), then **STATUS-PERSISTED → .ai/specs/<feature>/status.md**.

</what-to-do>

<supporting-info>

Backend read commands: [`references/tracker-modes.md`](references/tracker-modes.md).

</supporting-info>
