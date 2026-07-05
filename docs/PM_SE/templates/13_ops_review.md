# Ops Review — <Product Name>

> **Phase 5 · first at T+14/T+30, then quarterly — this file feeds the recurring G5 Health Check.** Budget: ~1 hour. Launching ≠ landing: this is where you find out whether it worked and decide the future on purpose instead of by inertia. Report **outcomes** ("handle-time −22%"), not activity ("shipped 14 tickets"). The anti-pattern this file prevents: the zombie product that drifts on because nobody wrote a verdict. Delete sections that don't apply.

| Review date | Period covered | Owner |
|---|---|---|
| | | |

## 1. Results vs. targets (from `07_ship_bar.md` — threshold ≠ target on every row)

| Metric | Threshold | Target | Actual | Δ | Read (why) |
|---|---|---|---|---|---|
| North Star (outcome) | | | | | |
| Driver 1 | | | | | |
| Counter-metric | | | | | |
| Cost per successful outcome (vs. margin floor) | | | | | |

- **Retention shape** (cohort curve, not one number): <declining forever = no PMF · flattening = real base · **[AI]** judge from month ~3, not week 1>

## 2. Feedback themes (patterns, not transcripts)

| Theme | Volume | Underlying problem (not the stated request) | Action |
|---|---|---|---|
| | | | |

## 3. Launch retro (first review only)

- **Went well:** <…>
- **Went wrong / near-miss:** <what signal did we miss? was it on `16_risk_register.md`?>
- **Process fix folded back into the templates:** <the framework iterates too>

## 4. [AI] AI health — delete if no AI

| Signal | Status | Owner |
|---|---|---|
| Eval set growing from production flags? (+5–10 cases/wk is healthy) | | |
| Drift — input mix (what users actually send vs. what we designed for) | | |
| Drift — quality (edit/regen/escalation rates vs. launch week) | | |
| Drift — cost (per outcome vs. plan) | | |
| Vendor terms / pricing / model deprecations re-checked (**verify current**) | | |
| Incidents this period → `14_incident_postmortem.md` loop-closed? | | |

## 5. [HW] Device health — delete if no hardware

| Signal | Status | Owner |
|---|---|---|
| Fleet uptime / last-seen (any silent devices?) | | |
| Watchdog / unexplained reboot counts | | |
| Sensor drift → recalibration due? | | |
| Battery degradation (capacity vs. launch) | | |
| Firmware-version spread (how many versions in the field? stragglers?) | | |

**FRACAS-lite** — every field failure gets a row, or the fleet teaches you nothing:

| Failure | HW rev / FW ver | Why | What changed |
|---|---|---|---|
| | | | |

## 6. Strategy refresh (quarterly, optional — one page max)

- **Diagnosis:** <what actually changed in the market/usage since last quarter>
- **Policy:** <the one guiding choice that follows>
- **Actions:** <2–3 moves; anything not serving the policy gets pruned>

## 7. Verdict — G5 (write it down even when it's "Continue")

**Continue / Iterate / Re-open / Sunset** — logged in the tracker with date and evidence.

- **Continue** — healthy; next bets: <top 2–3 from themes + trials>
- **Iterate** — specific fixes: <what, owner, when>
- **Re-open** — the strategy was wrong: back to Phase <1/2> because <evidence>
- **Sunset** — sunset condition met: open `18_sunset_checklist.md`, set a date, wind down deliberately

**Sunset condition (define at first review, keep visible):** *if <trailing-quarter value> no longer covers <run + maintenance + fleet-support cost> and the trend is down → Sunset.*
