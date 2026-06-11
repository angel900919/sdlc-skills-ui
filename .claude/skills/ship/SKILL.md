---
name: ship
description: |-
  Lean continuous-delivery release gate — the terminal step of the per-feature loop. Carries a qa-approved feature across the release line: assembles release notes from the PRD and merged slices, walks a tier-aware release checklist, hands the actual deploy to CI/CD or the human (never deploys, pushes, or tags itself), runs the post-deploy smoke, and only on an explicit human go-ahead flips features.md qa-approved to shipped. Deploy is not release — it records the shipped lifecycle state and notes feature-flag exposure as a separate product flip. Human-gated at the one irreversible boundary; writes no new artifact (release notes to chat, optional CHANGELOG append). Use when the user says "/ship", "ship it", "release X", "cut the release", "mark X shipped", or after /qa returns READY-FOR-SHIP. Do NOT use for: feature-boundary verification (/qa), deploy automation (that is CI/CD), per-slice merge (the mtdd loop), spec authoring (/prd, /design, /plan), or rolling back (a human ops decision).
---

# Ship — continuous-delivery release gate

Continuous delivery's manual approval gate: CI/CD owns the deploy mechanics; `/ship` owns the release *decision*, the notes, and the lifecycle flip `qa-approved → shipped` — it never deploys on its own.

<what-to-do>

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, tier dial, tracker, Talking to the human) before starting. The tier-aware checklist, the CD trigger modes, and the graceful-degradation table live in [references/checklist.md](references/checklist.md).

## Critical rules

1. **Two gates.** The `.ai/features.md` row must read `status: qa-approved` (else `BLOCKED-ON-STATUS`), **and** `.ai/specs/<feature>/qa-report.md` must exist with its most-recent approval `Approved: Yes` (else `BLOCKED-ON-QA → /qa`). The report is the proof; the row is the flag. Never ship from `building` or re-ship `shipped`.
2. **CD-aware — never deploys.** `/ship` *triggers* a release, it doesn't run one. Order: **(a) pipeline-triggered** — the project's CI/CD deploys on merge/tag, so hand the merge/tag to the human (or via `gh`) and let the pipeline run; **(b) manual** — hand `! <deploy_command>` to the human so they own the trigger; **(c) none configured** → stop at `AWAITING-DEPLOY` with what's missing (`.ai/pipeline.md`'s gap table names the absent deploy wiring; if that contract doesn't exist yet, `/pipeline` locks it). Never run `git push`/`git tag`/`npm publish`/a deploy command autonomously. Modes + detection: [references/checklist.md](references/checklist.md).
3. **Deploy ≠ release.** `shipped` is the **lifecycle** state this records. If the project uses **feature flags**, say so: "shipped = merged + flag-ready," and exposure to users is a separate product flip `/ship` does not make. (The modern split: CI/CD deploys; a flag releases.)
4. **Human go-ahead before any outward action.** `/ship` proposes and verifies; the human confirms. Approval to *prepare* a release is not approval to *deploy* it — ask again at the deploy step. Tagging, pushing, deploying, and the `shipped` flip are all hard to reverse.
5. **No spec authoring; minimal files.** Reads PRD/plan/`qa-report.md`; never edits them. Writes exactly the `features.md` status flip + the `progress-tracker.md` entry (+ an *optional* `CHANGELOG.md` append **only if that file already exists**). Release notes print in chat — never create new per-feature files.
6. **Idempotent.** Re-running on a `shipped` feature is a **`NO-OP`** with a one-line note. Re-running after an `AWAITING-DEPLOY`/`AWAITING-CONFIRMATION` pause re-checks the gates and picks up where it left off — nothing double-flips.
7. **Graceful degradation.** `/autofix-pr` for the release PR where useful; if a built-in or a configured command is absent (older CC / the Windows checkout / no `deploy_command`), emit the manual step for the human and note it — never silently skip.
8. **Single feature per run** — one status flip maps to one approved evidence pack. **Talk to the human in plain English** at each gate per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions).
9. **Tracker.** Read top 5 at Phase 0; append one entry **only on `SHIPPED`** (after the flip lands). Skip on every other verdict.

## Procedure

```
ship progress:
- [ ] Phase 0: Tracker top 5; validate arg + status gate + QA-evidence gate + tier; resolve deploy/smoke + release_policy (+ hotfix backfill); detect flags; announce
- [ ] Phase 1: Assemble release notes (PRD scope + merged slices since last ship) → chat (+ CHANGELOG if it exists)
- [ ] Phase 2: Present the tier-aware release checklist; confirm before anything outward
- [ ] Phase 3: Release trigger (CD-first; never autonomous) → post-deploy smoke
- [ ] Phase 4: On human go → flip features.md qa-approved→shipped + tracker (+ optional CHANGELOG); verdict
```

### Phase 0 — Validate
Read `.ai/progress-tracker.md` top 5 (expect a `qa landed (<feature>)` entry). Then:
- **arg** — feature slug; else refuse and ask which.
- **status gate** — `.ai/features.md` row: `qa-approved` → proceed · `building` → `BLOCKED-ON-STATUS → /qa` · `planned` → `BLOCKED-ON-STATUS → /feature-map` · `shipped` → `NO-OP` · `blocked`/`cut` → `BLOCKED-ON-STATUS → /feature-map`.
- **QA-evidence gate** — open `qa-report.md`; missing or most-recent approval ≠ `Approved: Yes` → `BLOCKED-ON-QA → /qa`.
- **tier** — inherited `tier:` from `prd.md` (fallback `anchor.project_tier` + WARN); drives the Phase-2 checklist depth.
- **commands** — resolve the target env's `deploy_mechanism` + `smoke_command` from `.ai/environments.md`'s roster first; only when that file or row is absent, fall back to `.ai/anchor.md`/manifests (`npm run smoke` → `make smoke` → `anchor.smoke_command`); absent everywhere → note (Phase 3 handles it). Detect feature-flag usage (`environments.md` `flag_system`, else anchor/design mention) for the rule-3 note. Read `anchor.release_policy` (versioning / tag_pattern / hotfix_path) for Phases 1–2; absent → no version ceremony, note it.
- **hotfix gate** — a fix that arrived via `anchor.release_policy.hotfix_path` is legal here: verify the backfill obligation was met (the `category: bug` issue file + the `qa-report.md` note), or record it as **pending with a date** in the Phase-1 known-limitations line.
- **Announce** one line: feature, tier, status, whether deploy/smoke were found, what this run will do.

### Phase 1 — Assemble release notes
Build user-facing notes (printed in chat) from: **scope** (PRD F-IDs / user stories — what shipped in user terms, not slice titles) · **changes** (merged slices since last ship: `git log <last-tag-or-base>..HEAD` + each slice's `## Completion`, summarized) · **known limitations** (WARN/SKIP items the human accepted in `qa-report.md`). Shape: a `## <feature> — <version-or-date>` block with `Added / Changed / Fixed` + a one-line `Known limitations`. When `anchor.release_policy.versioning ≠ none`, the header carries the next version per the scheme (date otherwise). Release-note terse.

### Phase 2 — Tier-aware checklist + confirm
Present the checklist the human walks before deploying; depth scales with tier (full table in [references/checklist.md](references/checklist.md)): **prototype** = tag (if used) + flip · **mvp** = + build/migrations + a named smoke step · **production** = + a one-step **rollback note**, reversible-migrations confirmation, and feature-flag/env callouts. When `anchor.release_policy.versioning ≠ none`, the checklist includes the **version bump + the exact tag name** per `release_policy.tag_pattern` (e.g. `v1.4.0`) as a **human** step — `/ship` never tags itself (rule 2). End by asking the human to confirm the checklist is right for this release before anything outward happens (changes → revise + re-present, `AWAITING-CONFIRMATION`).

### Phase 3 — Release trigger (CD-first) + smoke
1. **Trigger** per rule 2 — pipeline (merge/tag → CI/CD), else manual `! <deploy_command>`, else `AWAITING-DEPLOY`. Offer `/autofix-pr` for the release PR if one is open and the built-in exists (graceful fallback otherwise). Never deploy autonomously.
2. **Post-deploy smoke** — once the human confirms the deploy landed, run the resolved smoke command. PASS → continue. **FAIL → do not flip; surface output; recommend rollback** (cite the production rollback note); verdict `AWAITING-CONFIRMATION` (human decides: roll back, or accept + re-run). No smoke configured → WARN; human confirms health by hand.

### Phase 4 — Write-back + verdict
Only after the human confirms the release is live and healthy:
1. Flip the `.ai/features.md` row `qa-approved → shipped` (atomic).
2. If `CHANGELOG.md` exists at repo root, prepend the Phase-1 notes under a dated heading (else skip — rule 5).
3. Append a `ship landed (<feature>)` entry to `.ai/progress-tracker.md` (per [`../_shared/conventions.md`](../_shared/conventions.md)) — after the flip lands.
4. Verdict: **`SHIPPED`** (terminal). Hand-off: *"`<feature>` is shipped. Its success metric has a <timeframe> window — `/measure <feature>` is due on <ship_date + timeframe>. Meanwhile: start the next feature with `/prd <next>` (or `/feature-map`/`/feature-census` to pick one)."*

Other verdicts: `AWAITING-DEPLOY` (no mechanism) · `AWAITING-CONFIRMATION` (checklist revise / smoke fail) · `NO-OP` (already shipped) · `BLOCKED-ON-STATUS → /qa | /feature-map` · `BLOCKED-ON-QA → /qa`.

</what-to-do>
