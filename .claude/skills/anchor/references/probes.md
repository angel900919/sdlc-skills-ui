# Anchor question bank

Pull from these when stuck. **One question at a time. Propose a recommended answer.** Ask only the questions whose tier marker covers the locked `project_tier`. Adapt depth to `technical_user` (non-technical → don't ask stack questions; pick defaults, confirm the outcome in plain English).

Markers: `[P]` prototype · `[M]` mvp · `[Pr]` production · `[AI]` only if AI=yes · `[BF]` only if brownfield.

---

## Phase 0 — Existing anchor / mode
- *"`.ai/anchor.md` already exists — here's the stack [restate 3–5 lines]. Which fields should we update? I'll preserve the rest."* (update mode; never touch `lifecycle_stage`/`project_tier`)
- (no `.ai/intake.md`) *"There's no intake stub — the project isn't defined enough to anchor. Run `/onboard` (existing repo) or `/intake` (fresh idea) first."* → stop, `BLOCKED-ON-INTAKE`.

## Phase 1 — Confirm + lock the tier (never ask cold)
- *"Intake predicted **`<predicted_tier>`** because [reason it gives]. Lock that as the project tier, or adjust?"*
- (user wants higher) *"That's a `/promote` decision once you're validated — but I can lock `<tier>` now if the project genuinely starts there. Which?"*
- **AI-in-core-path:** *"Does this use AI / LLMs in its core path — do users see model output, or does the system decide with an LLM in production? (Not just devtools.)"*

## Phase 2 — Brownfield scan `[BF]` (read first, then confirm)
- *"Let me read what's on disk before you answer."* → then: *"I see [stack]. Lock these in? Override any per field."*
- (mvp+) *"Seeded `approved_dependencies` with [N] direct deps from [manifest] ([list]). Anything to drop before locking?"*

## Phase 3 — Stack `[P]+`
- **language** *"Language? (Recommend: detected if brownfield, else `typescript`.)"* — "I don't know" → default + tentative.
- **framework** *"Framework? (Recommend: detected, else `nextjs-14`.)"*
- **hosting** *"Where does it run? (Recommend: detected, else `vercel`.)"*

### mvp adds `[M]+`
- **db** *"Database? (Recommend: `postgres-supabase` — real Postgres, free dev tier.)"*
- **auth** *"Auth provider? (Recommend: `clerk` — drop-in; revisit at production.)"*
- **deployment_target** *"How many envs/regions? (Recommend: `single-env-single-region`.)"*
- **nfr_ceiling_latency_p95_ms** *"What p95 latency would be embarrassing if exceeded? Give me a number. (Recommend: 1000 ms.)"* — force a number; "I don't know" → default + tentative.
- **release_policy** (one or two questions max) *"Do you version releases — semver, calver, or none? (Recommend: `semver`; tag pattern `v{version}` follows.)"* · *"For a P0 bug in shipped code, OK with the default hotfix path — branch from the production ref, fix via `/diagnose` with a regression test, review + verify still run, merge + deploy, backfill the chain artifacts within a day?"* — branching is proposed from the Phase-2 detection (brownfield) or `trunk`, never asked cold.

### production adds `[Pr]`
- **observability** *"Logs / metrics / tracing providers? (Recommend: hosting-native logs + analytics, tracing none-yet.)"*
- **security_gate** *"Auth on entry (yes + how)? Permissions model (recommend JIT-scoped)? Which ops need human approval (recommend db-migrations, permission-changes, dependency-adds)?"*
- **codebase_legibility_rules** *"Adopt the legibility ruleset — no bare catch-alls, no dynamic imports, single data interface, unique greppable names? (Recommend: yes — cheap now, costly to retrofit.)"*

## Phase 4 — AI block `[AI]`
- **provider/model** `[P]+` *"AI provider? (Recommend: `openai`.) Model? (Recommend: `gpt-4o-mini` for prototype.)"*
- **cost ceiling** `[M]+` *"Cost ceiling per request (USD)? Give me a number. (Recommend: `0.01` = $10/1k.)"*
- **drafter/classifier/judge** `[Pr]` *"Drafter model (recommend `openai/gpt-4o`)? Classifier (recommend `openai/gpt-4o-mini`)? Judge — MUST differ from drafter (recommend `anthropic/claude-sonnet-4-6`)?"*
- **eval** `[Pr]` *"Eval framework (recommend `promptfoo`)? Trials per run (recommend 3)? One-line transparency policy for end users?"*

## Phase 5 — Uplift look-ahead (no re-scan)
- *"Intake flagged uplift signals: [list]. I'll carry these so `/architect` pre-sizes for them — they don't change the tier (that's `/promote`)."*
- (new signal in convo) *"You mentioned [billing] — that's a new uplift signal vs intake. I'll add it; if it changes the whole project's tier, consider re-running `/intake`."*

## Phase 6 — Read back
- *"Here's the assembled anchor — [paste frontmatter + body]. Where did I misrepresent you?"*
- *"Anything to flip from tentative to locked?"*
- *"Any field that doesn't apply to this project — drop it?"*

---

## Probing follow-ups (when an answer is vague)
- "Pick the simplest one — you can always upgrade. Which?"
- "If you build it the wrong way, how much pain to redo? That tells us the tier."
- "What number would make you say 'oh no'? That's the ceiling."
- "Is that a real decision, or a guess? If a guess, I'll mark it tentative."

## Questions to refuse (belong elsewhere — capture in a follow-up, steer back)
- Capabilities / per-feature NFRs / transparency card per feature → `/prd`
- File structure / class hierarchy / API contract → `/design`
- High-level architecture / components / ADRs → `/architect`
- What does domain term X mean → `/understand`
- Is this worth building / JTBD / target user → `/discovery`
- Compare 5 frameworks side-by-side → research, not anchoring. Do it separately, then come back to lock.
