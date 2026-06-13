# Dogfood log — running the SDLC chain on its own repo

**Date:** 2026-06-13 · **Branch:** `develop` · **Mode:** autonomous (user-authorized)

## Run conditions (deviations from designed usage — read first)

The chain is designed human-in-the-loop: a human types each slash command, answers
interviews one question at a time, and signs the human gates. This run deviates,
with the user's explicit blanket authorization:

1. **Autonomous driving.** The agent runs each stage itself instead of the human
   typing commands. Chain skills are `disable-model-invocation`, so invocation
   mechanics differ from real usage (noted per stage below).
2. **Defaults assumed.** Every interview takes the skill's own proposed answer.
   Where the agent substitutes session knowledge for a human answer, the artifact
   says so.
3. **Human gates auto-passed on the record.** Gates (`/qa` acceptance, `/ship` go)
   are passed under the user's standing authorization and flagged in the artifact —
   the chain's own override-on-the-record convention.

**What this run live-verifies for the first time:** verifier subagent delegation
(mtdd-review / mtdd-verify / qa), guard-paths `ask` escalation, inject-state
orientation block with real artifacts, mtdd-init seeding in the source repo.

## Stage log

| # | Stage | Verdict | Issues hit | Fixes applied |
|---|---|---|---|---|
| 1 | /onboard | READY-FOR-ANCHOR | I-1, I-2 | I-2 fixed (schema comment) |
| 2 | /anchor | READY-FOR-ARCHITECT | — (2 observations) | none needed |
| 3 | /explore | READY-FOR-COMPREHEND | I-3, I-4 | both fixed (skill edits) |
| 4 | /environments | ENVIRONMENTS-LOCKED | — | — (mermaid sub-invocation worked first try, kroki-validated) |

## Issues & fixes (detail)

_(numbered as I-1, I-2, … — referenced from the table above)_

- **I-1 (by design, no fix)** — The Skill tool refuses `disable-model-invocation`
  skills (`Skill onboard cannot be used with Skill tool due to
  disable-model-invocation`). Autonomous orchestration therefore executes each
  SKILL.md's content manually after reading it. This exercises the skill
  *instructions* faithfully but not the harness's slash-command loading path —
  a structural limit of any autonomous dogfood of this chain.
- **I-2 (fixed)** — `_shared/ai-schema.md` intake-stub template: the `ready_for`
  comment listed only `discovery`/`feature-map`, but `/onboard` (brownfield)
  always routes to `anchor`. One-line comment fix.
- **I-3 (fixed — the big one so far)** — `/explore` Phase 3 mandated
  `subagent_type=Explore` with the report returned as the agent's final message.
  **The Explore agent type compresses its final message to a conclusion and
  cannot write files** — two live runs returned a *summary of* the report
  instead of the report, the second despite an explicit hard output contract
  (it even misread the 300-line cap as a word cap). The skill's design was
  structurally incompatible with its own template. Fix: general-purpose
  sub-agent under read-only discipline writes the full report to a `/tmp`
  draft path; the parent reads, spot-checks, and slots it. Third run: 183-line
  report, 161 citations, 3/3 spot-checks accurate. Files: `explore/SKILL.md`
  (rule 3, Phase 3), `explore/references/sub-agent-prompt.md`, schema prose in
  `_shared/ai-schema.md`. **`/research` uses the same Explore-returns-report
  pattern — same latent bug; fix when the loop reaches it.**
- **I-4 (fixed)** — Routing contradiction: README/QUICKSTART and the canonical
  order in `_shared/downstream-integration.md` place `/environments` (RECOVERY)
  and `/data-management` (RECOVERY) **between** `/explore` and `/comprehend`,
  but `/explore`'s verdict + hand-off prose routed straight to `/comprehend`,
  silently skipping both. A verdict-following user would never run them. Fix:
  canonical-order note added to `explore/references/hand-off.md` + SKILL.md
  Phase 8 bullet.

## Live verifications banked

- `inject-state.sh` fired at session start (minimal block — no `.ai/` yet). ✓
- `guard-paths.sh` allow path: silent pass-through on `.ai/`/`.human/`/root
  writes, and on the (unguarded by design) `_shared/ai-schema.md` edit. ✓

## Lessons learned

_(running list — consolidated at end of run)_

- **L-1 (/anchor)** — A monorepo with two frameworks (react-vite web + fastify
  server) has no schema guidance for the single `framework:` field; a compound
  value absorbed it fine, but the schema could say so explicitly. No fix applied
  — worked naturally.
- **L-2 (/anchor)** — The brownfield detection table maps *existing* `v*` tags →
  semver but has no row for "no tags at all", so an autonomous run falls to the
  mvp default (semver, tentative) when the repo state arguably implies `none`.
  A human would have caught this in the interview — autonomous defaults are
  measurably worse than a 5-second human answer here. Left as tentative + TODO,
  which is exactly what the tentative mechanism is for. ✓ (mechanism validated)
- **L-3 (/anchor)** — CLAUDE.md collision behavior (rule 10) fired correctly:
  existing curated CLAUDE.md untouched, seed written to `CLAUDE.md.suggested`.
