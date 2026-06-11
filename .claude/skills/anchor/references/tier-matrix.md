# Anchor tier matrix

Referenced from SKILL.md Phases 3–4 and Phase 7 (line cap). Ask only the fields whose column is `✓` for the locked `project_tier`. Canonical tier semantics live in [`../../_shared/conventions.md`](../../_shared/conventions.md) (the tier dial) — keep this in sync.

```
                                  prototype   mvp   production
─────────────────────────────────────────────────────────────
project_tier / project_type          ✓        ✓        ✓
lifecycle_stage (= project_tier)     ✓        ✓        ✓
language / framework / hosting        ✓        ✓        ✓
db                                    —        ✓        ✓
auth                                  —        ✓        ✓
deployment_target                     —        ✓        ✓
nfr_ceiling_latency_p95_ms            —        ✓        ✓
approved_dependencies                 —        ✓        ✓
release_policy.versioning             —*       ✓        ✓
release_policy.tag_pattern            —        ✓†       ✓†
release_policy.branching              —*       ✓        ✓
release_policy.hotfix_path            —        ✓        ✓
observability                         —        —        ✓
security_gate (block)                 —        —        ✓
codebase_legibility_rules             —        —        ✓
── AI block (only if ai_in_core_path) ───────────────────────
ai.provider / ai.model                ✓        ✓        ✓
ai.cost_ceiling_per_request_usd       —        ✓        ✓
ai.drafter / classifier / judge       —        —        ✓ (judge≠drafter)
ai.eval_framework                     —        —        ✓
ai.trials_per_eval_run                —        —        ✓
ai.transparency_policy                —        —        ✓
─────────────────────────────────────────────────────────────
Field count (approx)                  ~5       ~13      full
Hard line cap                         40       100      200
```

`*` prototype writes these **silently from defaults** (versioning `none`, branching detected or `trunk`) — never asked. `†` tag_pattern exists only when `versioning ≠ none`; it follows from the versioning answer, never a separate question.

## Reading the dial

- **prototype** — language, framework, hosting (+ tier/type/lifecycle). That's it. Plus the AI provider/model if LLMs are in the core path. `release_policy` is defaulted silently, no question. Anything heavier is over-asking — strip it.
- **mvp** — adds db, auth, deployment_target, the one NFR ceiling number, the `approved_dependencies` allowlist, and the `release_policy` group (one or two questions max — versioning, and confirm the `hotfix_path` default).
- **production** — adds observability, the `security_gate` block, and `codebase_legibility_rules` — plus the full AI eval block (judge≠drafter, eval framework, trials, transparency) when AI is in the core path.

## Line cap

If the assembled `.ai/anchor.md` exceeds the cap for its tier, the project is being asked for more rigor than the tier supports. Two fixes:
1. Cut the lowest-priority non-required fields (anything without a `✓` for this tier shouldn't be there).
2. If the project genuinely needs the higher tier, that's a **`/promote`** decision — anchor never hand-bumps the tier. Tell the user to run `/promote`, then re-run `/anchor` in update mode to fill the new tier's fields.

The cap is a smell test, not a hard truncation — never drop a *required* field to fit it.
