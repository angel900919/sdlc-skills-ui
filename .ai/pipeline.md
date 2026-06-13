---
slug: sdlc-command-center
stage: pipeline
status: complete
tier: mvp
project_type: brownfield
ci_provider: none
gate_count: 5
open_gaps: 3
dep_adds: []
verdict: PIPELINE-LOCKED
verdict_overridden: false
source_anchor: .ai/anchor.md
source_environments: .ai/environments.md
source_test_strategy: .ai/test-strategy.md
source_data_management: .ai/data-management.md
source_recon: .ai/recon.md
human_summary: .human/summaries/pipeline.md
consumed_by: [design, qa, ship, promote]
created: 2026-06-13
---

# Pipeline — sdlc-command-center delivery contract

> Tier: `mvp` · Locked 2026-06-13 · RECOVERY: no CI exists anywhere in the repo
> (no .github/, no workflow files — recon §A3); this contract records what runs
> today and the gap table names what the mvp bar requires.

## Quality gates (what actually runs today)
| gate | trigger | tool/suite | source | blocking |
| :-- | :-- | :-- | :-- | :-- |
| typecheck | manual (`npm run typecheck`) | tsc, all workspaces (package.json:12) | dev habit | no — nothing enforces it |
| unit+integration tests | manual (`npm test`) | vitest workspace suites (test-strategy § pyramid) | dev habit | no — nothing enforces it |
| skills frontmatter lint | manual after skill edits | `_build_share/lint-skills.py` | chain convention | no |
| secrets-never-in-VCS | agent-time (every Edit/Write) | guard-paths.sh PreToolUse deny (.claude/settings.json:8) | chain hook | yes (agent edits only) |
| lockfile discipline | agent-time | guard-paths.sh denies lockfile edits; package-lock.json committed | chain hook | yes (agent edits only) |

## Deploy & release
- Environments: exactly one (local — environments.md). Deploy = the owner runs
  `npm run dev` or `npm run build && npm start`; trigger is manual by design, there is
  no deployable remote env. Smoke: `curl -s http://127.0.0.1:4317/api/health`.
- Deploy ≠ release: n/a — `flag_system: none`; merged to main = released to the one user.
- Branching: git-flow (develop → main, anchor.release_policy). Branch protection on
  main/develop: **unknown** — `gh` is not installed, GitHub settings unverifiable from
  this machine (→ Open questions).
- Rollback mechanism: `git revert` + restart the process; data rollback = delete the
  re-derivable local store (data-management § reversibility).

## Supply chain
- Secrets scanning: no scanner gate; compensating controls = .gitignore (.env*) + the
  PreToolUse deny on secret paths. Recommended-not-mandatory at mvp — recorded as is.
- Pinning: package-lock.json committed; tool-managed only (guard-enforced).
- Dependency audit: advisory `npm audit` available ad hoc; no automation. [M: recommended]

## Dependency updates
- Automation: **none** (no Renovate/Dependabot config anywhere). Mandatory at mvp → gap G2.

## Gap table
| # | contract requirement (mvp-mandatory) | detected | status | route |
| :-- | :-- | :-- | :-- | :-- |
| G1 | pre-merge automated test gate (blocking) | missing — no CI | open | slice: GitHub Actions workflow running typecheck + vitest on PR to develop/main; OR owner waives (solo, local-first) — owner's call |
| G2 | dependency-update automation | missing | open | slice: add Dependabot config (npm ecosystem, weekly, patch-automerge); owner may waive |
| G3 | branch protection on trunk | unknown (unverifiable locally) | open | owner checks GitHub settings; if absent, enable require-PR + require-G1-checks once G1 exists |

Routing note: gap closure is ordinary build work through the loop (conventions § CI/CD
changes are ordinary slices) — none of it happens in this skill.

## Open questions
- Branch protection state on origin (github.com/angel900919/sdlc-skills-ui) — needs the
  owner or an authenticated `gh`.
- Does the owner want CI at all for a solo local-first tool, or a recorded waiver of
  G1–G3? (Autonomous run left all three `open` rather than waiving — waiving is the
  owner's act, on the record.)

## Notes
- The strongest gates in this repo today are **agent-time, not CI-time**: the PreToolUse
  guard and the skills linter run where the changes are made. The gap table measures the
  CI bar anyway — the mvp standard assumes collaboration; the owner may waive with reason.

## Verdict

**`PIPELINE-LOCKED`** — 5 recorded gates (2 enforced agent-time, 3 manual), 3 open gaps
routed-or-ownered, 0 waived. Foundation complete. Next: `/prd observability-data-pruning`
(the P0 planned feature). Re-run `/pipeline` after `/promote` or when CI lands.
