# Ship — release checklist, CD trigger modes, graceful degradation

`tier` throughout is the **effective tier from `prd.md`** (after uplift), not `project_tier`.

## Tier-aware release checklist (Phase 2)

```
                              prototype   mvp        production
──────────────────────────────────────────────────────────────────
Status + QA-evidence gate     ✓           ✓          ✓
Release notes                 ✓ (terse)   ✓          ✓
Version tag                   if used     ✓          ✓
Build / migrations run        —           ✓          ✓
Post-deploy smoke             optional    ✓          ✓
Rollback note (one-step)      —           —          ✓
Reversible-migrations check   —           —          ✓
Feature-flag / env callouts   —           —          ✓ (each called out individually)
Human deploy gate             ✓           ✓          ✓
features.md flip → shipped    ✓           ✓          ✓
```

- **prototype** — tag (if the project tags) + the flip. That's it; don't manufacture release ceremony.
- **mvp** — the above + run the build/migrations if any + a named post-deploy smoke + user docs updated for this feature (`/docs <feature>`) or the skip recorded — mvp+ when discovery's target user is external or `uplift_signals` contains `external-dependants`.
- **production** — the above + a **rollback note** (how to revert this release in one step), confirmation migrations are reversible per `.ai/data-management.md`'s reversibility rule — read that artifact and check each migration in the release has a down/rollback or carries its argued irreversible flag, instead of assuming — and any feature-flag / env-var change called out individually. If `.ai/runbooks/<feature>.md` exists, surface its `## Rollback procedure` (the full numbered deploy + migration-down + flag-off steps) instead of just the one-line note; at production the checklist requires that runbook to exist or a recorded skip — if absent, recommend `/runbook <feature>` before deploying and record the user's skip decision in the checklist read-back.
- **Version tag (all tiers)** — read `anchor.release_policy`: `versioning ≠ none` → the checklist carries the **version bump + the exact tag name** per `tag_pattern` (e.g. `v1.4.0`) as a **human** step (`gh release create` *with their go*, per the degradation table), and the Phase-1 notes header carries that version; `versioning: none` (or a legacy anchor with no `release_policy`) → the "if used" behavior above.

## Hotfix releases (`anchor.release_policy.hotfix_path`)

A release that arrived via the anchor's expedited hotfix path is **legal at `/ship`** — the regression test, `/mtdd-review`, and `/mtdd-verify` already ran on the hotfix branch. `/ship`'s extra duty is the **backfill obligation**: verify the chain artifacts were backfilled (the `category: bug` issue file + the `qa-report.md` note), or record them as **pending with a date** in the release notes' known limitations. Everything else — gates, trigger modes, smoke, the human deploy gate — is unchanged.

## CD trigger modes (Phase 3, rule 2) — never autonomous

Pick the mode the project actually uses; detect from `.ai/pipeline.md § Deploy & release` when present (the locked per-env deploy wiring), else `anchor.md` + the repo:

| Mode | When | What `/ship` does |
| :-- | :-- | :-- |
| **(a) Pipeline-triggered** *(preferred — the CI/CD norm)* | repo has a pipeline (`.github/workflows/`, `vercel.json`, `fly.toml`, etc.) that deploys on merge/tag | Hand the **merge/tag** to the human (or via `gh pr merge` / `gh release create` *with their go*), then let the pipeline deploy. `/ship` watches for the human's "it deployed," it does not run the pipeline. |
| **(b) Manual command** | `anchor.deploy_command` set, no auto-pipeline | Hand `! <deploy_command>` to the human so they own the trigger. Never run it directly. |
| **(c) None configured** | no pipeline and no `deploy_command` | Stop at **`AWAITING-DEPLOY`**, naming what's missing (`.ai/pipeline.md`'s gap table when present; else set up CI/CD or add `anchor.deploy_command` — `/pipeline` locks the contract if it doesn't exist). Don't invent a deploy. |

**Deploy ≠ release.** With feature flags, mode (a) deploys the code dark; the *release* is a separate flag flip (a product decision). `/ship` records `shipped` (the lifecycle state = merged + flag-ready) and names the flag; it does not flip the flag.

**Release PR.** If a release PR is open and **`/autofix-pr`** exists, offer it to clear CI-fail / review comments on that PR. Absent → note "resolve the release PR manually." Graceful, never blocking.

## Graceful degradation (rule 7)

| Need | Preferred | Fallback (note, don't skip) |
| :-- | :-- | :-- |
| Deploy | the project's pipeline (mode a) | manual `! <deploy_command>` (mode b); else `AWAITING-DEPLOY` (mode c) |
| Release PR cleanup | `/autofix-pr` | "resolve the release PR by hand" |
| Post-deploy smoke | `anchor.smoke_command` / `npm run smoke` / `make smoke` | WARN — ask the human to confirm health manually |
| Version tag | `gh release create` *(human go)* | the human tags by their own means |

Always confirm a referenced built-in exists in the target CC version before relying on it; when unsure, fall back and note it.
