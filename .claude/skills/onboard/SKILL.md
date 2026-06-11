---
name: onboard
description: |-
  Plain-English front door for an EXISTING codebase (brownfield). Runs one friendly conversation that captures what the app does and who uses it — the product knowledge a human has but the code cannot tell you — does a light filesystem peek to confirm it is a real repo and name the stack, detects the user's technical level, predicts the project tier, and writes the machine handoff stub plus the human orientation doc, then routes into the brownfield recon chain. Writes .ai/intake.md with project_type brownfield and .human/intake/idea.md, then hands off to /anchor. Use when the user says "/onboard", "I have an existing app", "I inherited this repo", "onboard onto this project", "I know what this app does but not the code", or "where do I start with an existing project". Do NOT use for: fresh ideas with no code (/intake), deep code reconnaissance (/explore), locking the stack (/anchor), domain modeling (/comprehend), a codebase health or bug audit (/health-audit), or per-feature work (/prd).
---

<what-to-do>

You are the warm, plain-English front door **for an existing codebase**. A person arrives with a repo they want to work on; you have ONE friendly conversation and produce two artifacts: a human orientation doc and a tiny machine handoff stub. You capture the one thing the **code can't tell you and the user already knows** — *what the app is for and who uses it* — flag the project as brownfield, predict the tier, and route into the recon chain. You are the brownfield twin of `/intake`.

Read [`../_shared/conventions.md`](../_shared/conventions.md) for the `.human`/`.ai` folder model and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) for the `.ai/intake.md` schema before writing files.

## Critical rules

1. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — one question at a time, always propose a recommended answer, never stack questions, never use jargon (no "schema", "endpoint", "framework", "NFR") unless the user used it first. As a front door, you set the plain-English tone the chain inherits.
2. **Capture product knowledge, not code.** The user knows *what the app does* — that's what you elicit. Don't ask them to explain code internals, modules, or call flow; recovering those from the source is `/explore`'s job (deep recon) and `/comprehend`'s job (domain model). Steer code-internals questions to "we'll map that next."
3. **Brownfield only — probe first.** Probe the filesystem. Real source (populated `package.json`/`pyproject.toml`/`go.mod`/`Cargo.toml`, a `src/`, lockfiles) → proceed. No code → this is a fresh idea; route to `/intake`. Verdict **GREENFIELD**.
4. **Light peek only.** Read manifests to confirm it's a real repo and name the stack in plain words ("looks like a Next.js app with Postgres"). This is *confirmation*, not analysis — **`/anchor` owns authoritative stack detection and locking; `/explore` owns deep recon.** Don't crawl `src/`; don't draw conclusions about quality.
5. **Detect technical level, then adapt.** Where `/intake` asks a technical user to choose the stack, you **detect it and ask them to confirm** — because they know the product, not the code. For a non-technical user, state the detected stack in plain words and move on.
6. **Predict the tier; let signals bump it.** Default to what the conversation implies. If the app names money, PII/sensitive data, SLAs, regulated data, or external paying users, predict `mvp` or `production` and say why in plain words. Record the signals in `.ai/intake.md`. Canonical signal list: [references/hats.md](references/hats.md).
7. **Reach mutual understanding, then read back.** As many gentle questions as it takes until you and the user share the same picture of what the app is and who it's for. Then read the brief back and fold in corrections before writing.
8. **Two artifacts, two registers.** `.human/intake/idea.md` is prose for the person (what the app is, who uses it, the stack at a glance, what they want to do next, an optional simple diagram). `.ai/intake.md` is the terse machine stub (slug, tier, technical level, `project_type: brownfield`). Never merge them.
9. **Capture what you assumed and what you skipped.** Every default you picked and every topic you didn't cover goes into `idea.md` under Assumptions and Still open.
10. **Diagrams via the mermaid skill.** If a simple diagram helps the orientation doc (a who-does-what flow, an app-on-a-page mindmap), generate it through the **mermaid skill** so it is validated. Diagrams go in `.human/` only — never in `.ai/`.
11. **Route, don't gatekeep.** Onboard captures and routes; it does not judge whether the code is healthy or worth building on (that's `/health-audit`). End with a handoff to `/anchor`. Brownfield **skips `/discovery`** — there's no idea to kill/keep; the app already ships.

## Procedure

Copy this checklist:

```
onboard progress:
- [ ] Phase 0: Probe filesystem (brownfield?) + existing .ai/ (already onboarded?); greenfield → route to /intake
- [ ] Phase 1: Warm open — capture what the app does in their words; light stack peek; read technical level; predict tier
- [ ] Phase 2: Conversation — one question at a time until you share the same picture
- [ ] Phase 3: Read back the orientation; collect corrections
- [ ] Phase 4: Write .human/intake/idea.md (+ optional validated diagram) and .ai/intake.md
- [ ] Phase 5: Seed .ai/progress-tracker.md; issue verdict + handoff to /anchor
```

### Phase 0 — Probe and place
- **Greenfield** (no populated manifest, no `src/`, no lockfiles) → stop. *"There's no code here yet — `/onboard` is for existing projects. For a fresh idea, start with `/intake`."* Verdict: **GREENFIELD → /intake**.
- **`.ai/intake.md` already exists** → *"Looks like this project is already onboarded."* Verdict: **ALREADY-ONBOARDED → /anchor**.
- **Brownfield** (real source present) → continue.

### Phase 1 — Warm open
Greet plainly: *"Tell me about this app — what does it do, in a sentence or two, however you'd explain it to a friend?"* If `.human/intake/idea.md` already has a seed, read it and treat it as the opening answer.

Do a **light manifest peek** (rule 4): name the stack in plain words to confirm later. From their answer + the peek, silently assess: technical level (do they name tools or describe outcomes?), tier prediction (scan for uplift signals — [references/hats.md](references/hats.md)), and a project slug (kebab-case the app's name, ≤30 chars).

### Phase 2 — The conversation
Walk these topics in order, one plain-English question at a time, each with a recommended answer. Skip any already answered. Keep going until you share the same picture (rule 7) — but don't pad. The hats behind each topic: [references/hats.md](references/hats.md).

| # | Topic (plain-English question) |
| :-- | :-- |
| 1 | "Who uses this app — who's the main person it's for?" |
| 2 | "What are the main things it lets them do?" |
| 3 | "How will you know it's working well — what's the signal of success?" |
| 4 | "Anything sensitive in play — money, personal data, uptime promises, outside parties relying on it?" (uplift signals) |
| 5 | *(detected stack)* "It looks like it's built with [stack] — does that match, or is there more to it?" |
| 6 | "What are you hoping to do with it now — add features, fix things, or just understand it first?" |

For a non-technical user, topic 5 becomes a plain statement, not a question: *"It looks built with [stack] — I'll note that; `/anchor` will confirm the details."*

### Phase 3 — Read back
Assemble the brief (the body of `idea.md`) and read it back. Ask one question: *"Where did I get this app wrong, and is anything important missing?"* Fold in corrections.

### Phase 4 — Write the artifacts
1. **`.human/intake/idea.md`** — plain-English prose using [references/orientation-template.md](references/orientation-template.md). Optional: one validated diagram via the mermaid skill if it clarifies the app.
2. **`.ai/intake.md`** — the terse machine stub per [`../_shared/ai-schema.md`](../_shared/ai-schema.md). Set `slug`, `project_type: brownfield`, `predicted_tier`, `technical_user`, `uplift_signals`, `status: complete`.

### Phase 5 — Tracker + verdict
Seed `.ai/progress-tracker.md` (stub in [`../_shared/conventions.md`](../_shared/conventions.md)) if absent. Then issue exactly one verdict:

- **`READY-FOR-ANCHOR → /anchor`** — brownfield captured. Hand off: *"Next: `/anchor` to confirm and lock the stack it scans, then `/explore` maps the code."*
- **`GREENFIELD → /intake`** — no code on disk; this is a fresh idea.
- **`ALREADY-ONBOARDED → /anchor`** — this project already has `.ai/intake.md`.

</what-to-do>

<supporting-info>

## The brownfield chain
```
/onboard (HERE) → /anchor → /explore → /comprehend → /architect → [/health-audit] → /feature-census → /prd → [loop]
```
`/onboard` writes `.ai/intake.md` with `project_type: brownfield`, which unblocks `/anchor`. The brownfield twin of `/intake`: where `/intake` *asks* a technical user to choose the stack and routes to `/discovery`, `/onboard` *detects* the stack from manifests, asks to confirm, and routes to `/anchor`.

</supporting-info>
