# Ship-Bar & Metrics — <Product Name>

> **Phase 2 · feeds G2 Design Freeze · ~half a day.** This file is the product's definition of "good", written *before* build — it exists to stop you moving the goalposts to wherever the build landed. Phase 3 logs eval results here; Phase 5 monitors from here. The bar may be *raised* later; it is never quietly lowered — changes only via a re-baseline note in [15_decision_log.md](15_decision_log.md). Delete sections that don't apply; log the deletion as `tailored out: <reason>` in the tracker.

| Owner | Status |
|---|---|
| <name> | Draft / **FROZEN (G2, <date>)** / Superseded (via change note DEC-<nn>) |

## 1. Metric stack (keep it to ~5)

> One North Star **outcome** metric, 2–4 drivers you can move weekly, ≥1 counter-metric that catches gaming. Vanity test for each row: *would this rise even if the product got worse?* Mantra: **all product metrics green but the outcome unmet = built it right, wrong thing.**

| Role | Metric | Definition (formula) | Threshold | Target | Owner | Cadence |
|---|---|---|---|---|---|---|
| **North Star** (outcome) | | | | | | weekly |
| Driver 1 | | | | | | weekly |
| Driver 2 | | | | | | weekly |
| **Counter-metric** | <quality or cost paired against volume> | | <floor/ceiling> | | | weekly |

- **Threshold ≠ target — on every row in this file.** Threshold = below this you act; target = what you aim for. Equal = zero margin = banned.
- Activation = first **successful outcome**, not "opened the feature".

## 2. Instrumentation plan (so analytics exist on day one)

| Event | Fires when | Key properties |
|---|---|---|
| `outcome_completed` *(example — delete)* | user completes <job> | user_id, duration, source |
| `ai_response_feedback` *(example — delete)* | thumbs / edit / regenerate / escalate | response_id, model+prompt version, verdict |
| `device_heartbeat` *(example — delete)* | every <n> min per device | device_id, firmware ver, uptime, temp |

## 3. THE FROZEN SHIP-BAR ← freeze before build

**All products** — acceptance criteria + budgets, each traced to a REQ in [06_spec.md](06_spec.md). Seed this table from the charter's AC-nn rows: promote each seed to a bar row traced to a REQ, or retire it with a reason — no seed dies silently.

| Criterion | REQ | Threshold | Target |
|---|---|---|---|
| core flow completes *(example — delete)* | REQ-P-01 | p95 < 2 s, error < 0.5 % | p95 < 1 s |
| works on <platforms> *(example — delete)* | REQ-C-01 | pass on all | — |

**[AI] The four fields** (all four, or it isn't a bar):

| Field | Value |
|---|---|
| **Metric** | e.g. % pass on golden set; zero PII leaks; p95 latency |
| **Threshold / Target** | e.g. ≥ 85 % pass (threshold) / ≥ 92 % (target); 0 leaks; < 3 s |
| **Eval-set version** | golden-set v1 (<n> cases) — frozen <date> |
| **Judge method** | <deterministic check / rubric / LLM-judge (different model family, spot-validated) / human review> |

**[AI] Golden set:** <30–100> real cases from the Phase 1 error analysis — typical + edge + **adversarial** (incl. injection) — versioned, **held out** from any prompt tuning. New failures from beta/production go into the *next* version; the frozen version stays frozen for comparability.

**[HW] Environmental & duty bar** — every row names its T/I/A/D method:

| Criterion | REQ | Threshold | Target | Method |
|---|---|---|---|---|
| Operating temp range | | <x>–<y> °C | | T — bench thermal rig |
| Battery life | | ≥ <N> h | ≥ <N+margin> h | T — scripted duty cycle |
| 7-day soak uptime | | ≥ <x> %, ≤ <n> watchdog reboots | | T — soak rig |
| Sensor accuracy | | ± <x> <unit> vs reference | | A — calibration comparison |
| RF range | | ≥ <x> m through <obstacle> | | D — site walk with logger |
| Ingress rating | | IP<xx> | | I — enclosure spec + T — spray test |

## 4. Guardrails & auto-halt triggers (armed before launch)

> A guardrail is a trigger with an action, not a dashboard. Dangerous ones auto-act.

| Signal | Threshold | Action |
|---|---|---|
| **[AI]** PII / secret leak | any | **immediate rollback** |
| Error rate | > <x> % over <window> | halt ramp / rollback, page owner |
| Cost burn (infra / API / tokens) | > 120 % of forecast | halt + investigate |
| **[AI]** Quality (thumbs-down / regen / refusal rate) | > <x> % | investigate within 24 h |
| **[HW]** Watchdog reboots | > <n> per device per day | pull unit from ramp, bench-repro |
| **[HW]** Over-temp | > <x> °C | firmware auto-shutdown |
| **[HW]** Device offline | > <N> h | alert owner |

## 5. Eval-results log (Phase 3+ — bar unchanged, or the entry is invalid)

| Date | Eval-set ver | Prompt ver | Model | Firmware | HW rev | Score | vs bar |
|---|---|---|---|---|---|---|---|
| | | | | | | | pass / miss |

## 6. Metric → SLO handoff (fill at launch, G4 — 2–4 SLOs max)

| SLO | From bar row | Threshold | Alert route |
|---|---|---|---|
| SLO-01 | | | |

## 7. Unit economics & runway

- **Cost per successful outcome:** <formula> vs **margin floor** <x> — tracked from day zero, not after launch.
- **[AI]** token/API cost per outcome at current pricing (*verify current*): <TODO>
- **[HW]** BOM + assembly + shipping per unit vs price: <TODO>
- **Runway cap for this bet:** <€/$ or weeks>. Breach = automatic gate review, not a bigger budget.
