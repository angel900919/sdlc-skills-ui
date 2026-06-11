# Anchor anti-patterns

Scan the assembled draft against this list before pasting it back (Phase 6) and before writing (Phase 7). Strip any symptom.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| **Asking the tier cold** | "What tier is this — prototype, mvp, or production?" with no prediction | Intake predicted it. Confirm `predicted_tier` as the default: *"Intake said `<tier>` because…— lock it?"* |
| **Re-scanning for uplift** | Reading the description to hunt for money/PII signals | Honor `intake.uplift_signals` as given. Only add a signal that genuinely surfaces fresh in conversation. |
| **Ignoring technical level** | Asking a non-technical user "Drizzle or Prisma?" | Adapt to `technical_user`. Non-technical → pick defaults, mark tentative, confirm the outcome in plain words. |
| **Hand-bumping the tier** | An `/anchor` run setting `project_tier` higher than before | Anchor never advances the tier. That's `/promote`. Re-run `/anchor` after to fill new fields. |
| **Collapsing the two stages** | Setting `stage: <tier>` or moving `lifecycle_stage` on a re-run | `stage: anchor` (producer) is fixed; `lifecycle_stage` mirrors `project_tier` and only `/promote` moves it. |
| **Production questions at prototype** | Asking judge≠drafter or eval framework on a weekend project | Gate by tier. Fire production questions only at `project_tier: production`. |
| **AI questions for a non-AI project** | Asking about eval frameworks for a marketing site | Gate by `ai_in_core_path`. No AI in core path → skip the block entirely. |
| **Demanding answers the user lacks** | "Pick your fitness-function framework now" | Accept "I don't know" → default + `tentative` + TODO. Never block. |
| **Re-asking what's on disk** | "What framework?" when `package.json` says Next.js | Brownfield: scan first, propose, confirm. |
| **Overwriting the anchor** | Re-elicitation that wipes prior values | Update mode: ask which fields; preserve the rest, the history, and the tier. |
| **Clobbering CLAUDE.md** | Overwriting an existing root `CLAUDE.md` | Exists → write `CLAUDE.md.suggested`. Never clobber. |
| **Per-feature leakage** | "What's the latency budget for the invoice feature?" | That's `/prd`. Anchor sets the project-wide ceiling only. |
| **Vague NFR ceiling** | "fast", "good", "acceptable" | Force a number with a unit. "I don't know" → tentative default. |
| **Tentative pretended certain** | A default-picked field written as locked | Mark `<field>_tentative: yes` + `(tentative)` note + TODO. |
| **Tentative treated as blocking** | Refusing READY-FOR-ARCHITECT because a required field is tentative | Tentative ≠ blocking. Verdict stays READY-FOR-ARCHITECT; list the tentatives in the hand-off. |
| **Diagram in the .ai file** | A Mermaid block inside `.ai/anchor.md` | Machine artifact holds structure. The (optional) diagram goes in `.human/summaries/anchor.md` only. |
| **YAML/body merged** | All prose in frontmatter, or all data in the body | Frontmatter = index; body = `key: value` + one-line `why:`. |
| **Sprawl** | `anchor.md` over the tier line cap (40/100/200) | Cut non-required fields, or route a real tier bump to `/promote`. Never drop a required field to fit. |
| **Deliberating instead of locking** | Comparing five frameworks inside the anchor run | Anchor LOCKS. Name comparison as a separate task, then come back. |
| **Skipping the mirror** | Writing only `.ai/anchor.md` | Anchor is a human sign-off point — always write `.human/summaries/anchor.md`. |
