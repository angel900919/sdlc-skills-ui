# Anchor shape examples — good vs bad

Referenced from SKILL.md Phase 6 (read back) and Phase 7 (write). Shapes, not rules — the rules live in the SKILL body and the schema in [`../../_shared/ai-schema.md`](../../_shared/ai-schema.md).

## `why:` line (body)
- **Bad:** "Next.js because it's good." / "We picked Next because everyone uses it."
- **Good:** "`framework: nextjs-14` — why: full-stack covered, App Router fits the marketing-site + dashboard split, deploys with zero config."

## NFR ceiling
- **Bad:** "fast" · "200ms" (no percentile, no condition)
- **Good:** "`nfr_ceiling_latency_p95_ms: 800` — the p95 we'd be embarrassed by, measured at the edge under nominal load."

## AI block (production)
- **Bad:** "OpenAI for everything." (no judge separation)
- **Good:**
  ```
  - drafter: openai/gpt-4o · classifier: openai/gpt-4o-mini
  - judge: anthropic/claude-sonnet-4-6   # different vendor — avoids confirmation bias
  - eval_framework: promptfoo · trials_per_eval_run: 3
  ```

## Tentative field
- **Bad:** `auth: clerk` written as if locked when the user said "I don't know".
- **Good:** `auth: clerk` + `auth_tentative: yes` + `tentative_fields: [auth]` + `why: … (tentative)` + a TODO line. Three paths to the same fact.

---

## A full worked `.ai/anchor.md` (mvp, greenfield, no AI)

```markdown
---
slug: freelancer-invoicing
stage: anchor
status: complete
project_type: greenfield
project_tier: mvp
lifecycle_stage: mvp
ai_in_core_path: false
uplift_signals: [money]
approved_dependencies: [next, drizzle-orm, "@clerk/nextjs", zod]
tentative_fields: [auth]
verdict: READY-FOR-ARCHITECT
verdict_overridden: false
source_intake: .ai/intake.md
source_features: .ai/features.md
human_summary: .human/summaries/anchor.md
consumed_by: [promote, architect, prd, design, bootstrap]
created: 2026-05-31
auth_tentative: yes
---

# Anchor — freelancer-invoicing

> Tier: `mvp` · Locked 2026-05-31 · Read this before every session.

## Lifecycle
- current: `mvp`, since 2026-05-31 — restates frontmatter lifecycle_stage (single source of truth).
- advance with /promote only; never hand-edit the tier.
- stage_history:
  - { from: none, to: mvp, date: 2026-05-31, by: /anchor, rationale: initial stage set by /anchor, overridden: false }
- promotion_criteria:
    to_production: []

## Stack
- language: typescript        # why: shared types across the timer UI and invoice API
- framework: nextjs-14        # why: full-stack, App Router, one deploy
- hosting: vercel             # why: zero-config for Next, free preview envs
- db: postgres-drizzle        # why: type-safe ORM, real Postgres
- auth: clerk                 # why: drop-in; user hadn't decided (tentative)
- deployment_target: single-env-single-region
- nfr_ceiling_latency_p95_ms: 800   # why: invoice send must feel instant

## Approved dependencies
- name: next          why: framework — locked at anchor time
- name: drizzle-orm   why: ORM — locked at anchor time
- name: "@clerk/nextjs"  why: auth — locked at anchor time
- name: zod           why: schema validation — broadly used

## Uplift look-ahead
- signals: [money]    # billing is in scope — /architect should isolate a payments boundary;
                      # /prd will bump the billing feature to production tier when scoped.

## TODO (tentative fields)
- [ ] Confirm auth provider (Clerk vs Supabase Auth vs Auth0) before production
```

Prototype trims to language/framework/hosting (+ lifecycle); production adds `## Security gate`, `## Observability`, and the full AI eval block when AI is in the core path.

---

## The human mirror — `.human/summaries/anchor.md`

Plain-English sign-off. Lead with one sentence; 3–6 bullets; optional simple diagram via the **mermaid skill** (only if it helps — anchor rarely needs one); link back.

```markdown
# Anchor — freelancer-invoicing

**We locked an mvp-tier TypeScript stack: Next.js on Vercel, Postgres via Drizzle, Clerk for sign-in.**

- **Tier:** mvp — real users and money are in scope, so we're past throwaway-prototype rigor but not yet full production.
- **Stack:** Next.js + Vercel (one deploy), Postgres + Drizzle (type-safe data), Clerk for login.
- **Still tentative:** the login provider (Clerk for now) — easy to swap before we go to production.
- **Money is on the horizon:** billing isn't built yet, but the architecture will leave room for it.
- **Lifecycle:** this project is at stage **mvp**. When it's validated and you want more rigor, run `/promote` — don't bump the tier by hand.

Machine detail: [`.ai/anchor.md`](../../.ai/anchor.md).
```

A diagram earns its place here only when the stack has real moving parts (e.g. a service + worker + queue). For a single-app stack, skip it.
