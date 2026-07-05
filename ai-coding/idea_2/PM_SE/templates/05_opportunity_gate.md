# Opportunity Gate — <Product Name>

> **Phase 1 exit · gate G1 — the kill-filter. Never skipped, for any product, at any size.** Score it as a **gate, not a weighted average**: one hard FAIL stops the line no matter how good the rest looks. A KILL here costs days; the same KILL at launch costs months. Time budget: 30–60 minutes once [`02_validation_log.md`](02_validation_log.md) (and 03/04 if applicable) are filled. Anti-pattern this file prevents: building because the evidence-gathering felt like progress. Run the red-team prompt ([`../AI_PROMPTS.md`](../AI_PROMPTS.md) #1) before you sit down — it IS your review board. Delete sections that don't apply.

| Owner | Date | Gate |
|---|---|---|
| | | G1 |

## The five filters

> Every "Pass" must cite evidence from [`02_validation_log.md`](02_validation_log.md) / [`03_ai_feasibility.md`](03_ai_feasibility.md) / [`04_hw_feasibility.md`](04_hw_feasibility.md) — not vibes. The four feasibility dimensions from 02 §9 feed these filters: Market→Desirable, Economic→Viable, Technical→Feasible, Regulatory→Responsible.

| Filter | The question | Evidence (cite it) | Pass / FAIL |
|---|---|---|---|
| **1 · Desirable** | Real problem, real pull? (≥5 interviews confirm pain + ≥1 behavioral demand signal) | | |
| **2 · Viable** | Will anyone pay/adopt at economics that work? (WTP signal + cost-per-outcome positive) | | |
| **3 · Feasible** | Can we actually build it? (Technical verdict Go/Conditional-Go, evidence measured not claimed) | | |
| **4 · Responsible** | Should we build it? (risk check clean/mitigated; no third-party harm; nothing prohibited) | | |
| **5 · Differentiated** | An honest reason to win vs. alternatives? (data, workflow depth, distribution, trust — not "ours has AI") | | |

**Hard-fail examples** — any one of these is a KILL, full stop: users shrug at the problem · economics underwater at any realistic price · no learnable signal in the baseline · data unobtainable or unlawful · harms non-consenting third parties · clonable thin wrapper with no moat · a certification you can't afford · a single-source part already EOL.

## [AI] AI products — extra lines (delete if no AI)

| | Answer |
|---|---|
| AI-or-not decided (rules/search don't cover it ~90% cheaper)? | |
| Zero-shot baseline recorded as the bar-to-beat (from 03)? | <score, model, date> |

## [HW] Hardware products — extra lines (delete if no hardware)

| | Answer |
|---|---|
| Breadboard spike measured on the real board (from 04)? | <numbers, board, date> |
| BOM @ 1/10/100 under the price ceiling? | |
| Power budget plausible for the deployment reality? | |
| No unobtainable part (single-source, EOL, lead time)? | |
| No unaffordable certification? | |

## Regulatory trigger

- **Does a regulation own you?** <FCC/CE, GDPR/privacy, app-store policy, battery shipping — verify current> If yes → check the right-sizing table in [`../README.md`](../README.md) before proceeding lean.

## Gate checklist

- [ ] Every SN in 02 §7 is solution-free (smuggled tech parked as a constraint) — signed off before any REQ exists
- [ ] Every high-priority SN exercised by ≥1 SCN; ≥1 off-nominal + ≥1 maintenance scenario present
- [ ] All four feasibility dimensions verdicted; **no non-waivable No-Go**
- [ ] Riskiest ASM tested against its **pre-committed** threshold — result recorded, not reinterpreted
- [ ] Red-team ran; the one question the evidence couldn't answer is fixed or named below
- [ ] All five thread questions answered (risk & kill · hazards · security & data · versions & change · metrics & money)

## Verdict

> Vocabulary: **GO** (all filters pass) / **GO-with-de-risk** (pass, with named actions + owners + dates) / **PIVOT** (change customer, problem, or solution — back to Phase 1) / **KILL** (write the kill memo in the tracker; celebrate the saved months).

| Verdict | Date | De-risk actions (owner · due) |
|---|---|---|
| | | |

**One-paragraph rationale:** <the decision in plain words, citing the decisive evidence>

→ Log the verdict + date in `00_tracker.md` — an unrecorded gate is a failed gate. If GO: open Phase 2 with [`06_spec.md`](06_spec.md).
