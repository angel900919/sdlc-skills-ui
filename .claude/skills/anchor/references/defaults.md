# Anchor defaults — "I don't know" answers, detection, and uplift

Referenced from SKILL.md Phases 2–5. When the user says "I don't know", pick the simplest sensible default here, write it to frontmatter, mark `<field>_tentative: yes`, annotate the `why:` line `(tentative)`, and add a TODO. Never make the user feel bad for not knowing — defaults are starting points, not commitments.

---

## Stack defaults

| Field | Default | Reason |
|---|---|---|
| `language` | `typescript` | Broadest community; frontend + backend covered. |
| `framework` | `nextjs-14` | Full-stack, App Router, deploys anywhere. |
| `hosting` | `vercel` | Zero-config for Next.js; free tier covers dev/preview. |
| `db` | `postgres-supabase` | Real Postgres, free dev tier, easy to migrate later. |
| `auth` | `clerk` | Drop-in, free tier, hosted UI; revisit at production. |
| `deployment_target` | `single-env-single-region` | Bump to multi-env at mvp, multi-region at production. |
| `nfr_ceiling_latency_p95_ms` | `1000` | One second = "noticeable but not yet broken". Tighten when measured. |
| `approved_dependencies` *(mvp+)* | greenfield: stack lock-ins only (framework + ORM + auth provider). brownfield: direct deps from the manifest (transitive excluded). | The allowlist `/design` reads to resist hallucinated deps. Mark `approved_dependencies_tentative: yes` when seeded purely from auto-detection. |

## Release-policy defaults

| Field | Default | Reason |
|---|---|---|
| `release_policy.versioning` | prototype: `none` (silent — never asked). mvp+ "I don't know": `semver` (tentative). | Prototypes don't need release ceremony; semver is the ecosystem norm once releases are real. |
| `release_policy.tag_pattern` | `v{version}` | Written only when `versioning ≠ none`; follows the versioning answer, never asked separately. |
| `release_policy.branching` | greenfield: `trunk` · brownfield: propose from detection (table below) as `[detected]` | One of trunk / git-flow / github-flow. Trunk-based is the CD default; a brownfield repo already votes with its branches. |
| `release_policy.hotfix_path` *(mvp+)* | `"branch from the production ref; fix via /diagnose with a regression test; /mtdd-review + /mtdd-verify still mandatory; merge + deploy; backfill the chain artifacts (issue file + qa-report note) within a day"` | The expedited P0 route past the full chain — discipline kept, paperwork deferred, never skipped. Confirm, don't re-derive. |

## Per-language overrides

If the user picks a non-default language, swap the framework + test runner:

| Language | Default framework | Default test runner |
|---|---|---|
| `typescript` | `nextjs-14` | `vitest` |
| `python` | `fastapi` | `pytest` |
| `go` | `chi` (or stdlib `net/http`) | `go test` |
| `rust` | `axum` | `cargo test` |
| `java` | `spring-boot` | `junit5` |

Hosting fallback when the framework doesn't auto-fit: `nextjs-*` → `vercel`; `fastapi`/`flask`/`go-*`/`rust-*` → `fly.io`; `spring-boot` → `aws-ecs` (tentative).

## Production-tier defaults `[Pr]`

| Block | Sub-field | Default | Tentative? |
|---|---|---|---|
| observability | `logs` | hosting-native (e.g. `vercel-logs`) | no |
| observability | `metrics` | `vercel-analytics` (or `prometheus`) | no |
| observability | `tracing` | `none-yet` | **yes** — add at ≥2 services |
| security_gate | `auth_on_entry` | `yes` (provider middleware) | no |
| security_gate | `permissions_model` | `jit-scoped` | no |
| security_gate | `red_zone_gates` | `[db-migrations, permission-changes, dependency-adds]` | no |
| codebase_legibility_rules | all four | `yes` (no bare catch-alls, no dynamic imports, single data interface, unique greppable names) | no |

Legibility rules are cheap to adopt now, costly to retrofit. If the user opts out, ask why.

---

## AI defaults `[AI]`

| Field | Default | Tentative? | Reason |
|---|---|---|---|
| `ai.provider` | `openai` | yes | Broadest model coverage. |
| `ai.model` *(prototype)* | `gpt-4o-mini` | yes | Cheap + capable for prototypes. |
| `ai.cost_ceiling_per_request_usd` | `0.01` | yes | $10 / 1,000 requests. Tighten when measured. |
| `ai.drafter` *(prod)* | `openai/gpt-4o` | yes | Capable first-pass generation. |
| `ai.classifier` *(prod)* | `openai/gpt-4o-mini` | no | Routing/categorization — small model is fine. |
| `ai.judge` *(prod)* | `anthropic/claude-sonnet-4-6` | yes | **Different vendor from drafter.** Hard rule. |
| `ai.eval_framework` | `promptfoo` | no | Git-native, no SaaS lock-in. |
| `ai.trials_per_eval_run` | `3` | no | Minimum for statistical signal. |
| `ai.transparency_policy` | `"AI output is labeled in the UI; users can opt out per feature."` | yes | Placeholder — refine per feature in `/prd`. |

### The judge-≠-drafter rule (non-negotiable, even on "I don't know")

Same-vendor judges agree with same-vendor drafters too often; cross-vendor catches more failure modes.
- `drafter = openai/*` → judge `anthropic/claude-sonnet-4-6`
- `drafter = anthropic/*` → judge `openai/gpt-4o`
- `drafter = openrouter/*` → judge a different concrete provider

---

## Detection signals (brownfield)

When `project_type=brownfield`, read these BEFORE asking. If present, propose the value as a `[detected]` default (not tentative).

| File / signal | Field inferred |
|---|---|
| `package.json` dep `next` | `framework: nextjs-<major>` |
| `package.json` dep `react` (no next) | `framework: react-vite` |
| `package.json` dep `express` / `fastify` / `hono` / `@nestjs/core` | `framework: express` / `fastify` / `hono` / `nestjs` |
| `package.json` devDep `vitest` | `test_runner: vitest` |
| `package.json` dep `drizzle-orm` / `@prisma/client` | `db: postgres-drizzle` / `postgres-prisma` (check schema) |
| `package.json` dep `@clerk/*` / `next-auth` / `@supabase/*` | `auth: clerk` / `next-auth` / `supabase` |
| `pyproject.toml` dep `fastapi` / `django` / `flask` | `language: python`, framework accordingly |
| `go.mod` `module …` | `language: go` |
| `Cargo.toml` `[package]` | `language: rust` |
| `vercel.json` / `wrangler.toml` / `netlify.toml` / `fly.toml` | `hosting:` vercel / cloudflare-workers / netlify / fly.io |
| `Dockerfile` (no platform config) | `hosting: docker-anywhere` (tentative) |
| `prisma/schema.prisma` / `drizzle.config.*` / `migrations/` | `db:` from datasource/dialect |
| `.env.example` has `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY` | `ai.provider` hint |
| `.mtdd/config` `mtdd_target_branch` + branch listing: `main` only → trunk · long-lived `develop`/`release/*` → git-flow · PR-flow onto `main` → github-flow | `release_policy.branching` |
| existing `v*` git tags | `release_policy.versioning: semver`, `tag_pattern: v{version}` |

If multiple AI keys appear, ask which is primary — don't guess.

**`approved_dependencies` seeding (mvp+):** read the **direct** deps block — `dependencies` (`package.json`), `[project.dependencies]`/`[tool.poetry.dependencies]` (`pyproject.toml`), `require` (`go.mod`), `[dependencies]` (`Cargo.toml`). One entry per direct dep, ecosystem inferred from `language`. **Exclude transitive deps** (inherited via lockfile, not separately approved). Restate the count and ask what to drop before locking.

---

## Tier uplift signals (carried from intake — NOT re-scanned here)

Intake records `uplift_signals` in `.ai/intake.md`. Anchor **honors that list** — it does not re-scan the description. This table is the shared reference for what each signal means and is the same list `/prd` reads for per-feature uplift.

| Signal | Examples |
|---|---|
| **money** | payments, billing, invoicing, refunds, subscriptions, payouts |
| **pii** | health, financial, minors, biometrics, location, identity docs, passwords |
| **sla** | uptime promise, p95/p99 latency target, throughput contract |
| **external-dependants** | public API, partner integration, third-party webhook consumer, embedded SDK |
| **regulatory** | GDPR, HIPAA, PCI-DSS, COPPA, SOC2, WCAG, age-restriction, content moderation |

### What anchor does with them
- Carry the list verbatim into `uplift_signals` and the `## Uplift look-ahead` body, noting what `/architect` should pre-size for.
- Anchor does **not** auto-bump `project_tier` from signals — tier changes are a `/promote` decision. The signals are a heads-up for `/architect` and for per-feature `/prd` uplift.
- If a genuinely new signal surfaces in conversation (the user mentions billing that wasn't in intake), add it to the list and tell them — and suggest re-running `/intake` only if it materially changes the tier prediction.

---

## How to write a tentative field (all three, every time)

```yaml
# frontmatter
auth: clerk
auth_tentative: yes
tentative_fields: [auth]
```
```markdown
## Stack
- auth: clerk   # why: drop-in, free tier; user hadn't decided (tentative)

## TODO (tentative fields)
- [ ] Confirm auth provider (Clerk vs Supabase Auth vs Auth0) before production
```

So the user can grep `tentative: yes`, scan the `why:` note, or read the TODO list — any of three paths surfaces it.
