# Launch Checklist — <Product / Release Name>

> **Phase 3 (go/no-go) + Phase 4 (the ramp) · feeds G3 Ship-Ready and G4 Launch · checklist ~1 h, ramp 1–2 weeks.** It exists to make the go/no-go a check, not a debate — the criteria were frozen at G2, long before this meeting. Release (code live, dark, flagged) ≠ launch (users told). Default to a gradual ramp; big-bang needs a written reason. Don't start the ramp on a Friday. Delete sections that don't apply; log it as `tailored out: <reason>` in the tracker.

| Owner | Target date | Status |
|---|---|---|
| <name> | | Prep / Go-decided / Ramping / **Landed** |

## 1. Go/no-go — the G3 record

> **No-Go is genuinely available.** Iterate = fix plan + re-decision date — not ready ≠ failure. KILL = celebrate it; a kill here is cheaper than a launch funeral.

**VERIFIED — built it right:**

- [ ] Eval passed vs the **UNCHANGED frozen bar** — [07_ship_bar.md](07_ship_bar.md) §3, versions cited in the §5 log (eval-set, prompt, model, firmware, HW rev); bar untouched since G2 or re-baselined via [15_decision_log.md](15_decision_log.md)
- [ ] Verification matrix two zero-rules green — [10_verification_matrix.md](10_verification_matrix.md) §1
- [ ] Zero open S1 defects

**VALIDATED — built the right thing:**

- [ ] Beta results ≥ the pre-set numeric targets — [10_verification_matrix.md](10_verification_matrix.md) §3, targets dated *before* the beta
- [ ] Beta themes addressed or consciously deferred (logged)

**Ready to be seen:**

- [ ] Analytics verified end-to-end — events fired in prod, arriving in the dashboard, properties correct
- [ ] Rollback rehearsed **once, for real** (one config flip / one tag back) + rollback note pre-written (§3)
- [ ] Unit economics positive — cost per successful outcome under the margin floor ([07_ship_bar.md](07_ship_bar.md) §7)
- [ ] Legal basics live: ToS · privacy policy · pricing
- [ ] **[AI]** Injection tests run vs the golden set's adversarial cases · no secrets in prompts · no PII to training vendors (vendor terms checked — *verify current*)
- [ ] **[HW]** §5 hardware readiness block 100 % (or `tailored out`)

**G3 verdict: GO / Iterate / KILL** — <date, by whom>. If Iterate: <what's missing · owner · re-decision date>. Log in tracker.

## 2. Ops floor — in place BEFORE the spotlight

- [ ] **2–5 runbooks exist as REAL FILES** in `runbooks/` — copies of [12_runbook.md](12_runbook.md) (the 2–5 classics named in `12_runbook.md`'s header). **An empty `runbooks/` folder is a Hold.**
- [ ] 2–4 SLO-<nn> derived from REQ-P / REQ-O rows, filled into [07_ship_bar.md](07_ship_bar.md) §6 — targets come from the requirement, not gut feel
- [ ] Alerting **reaches you** — test alert fired, phone actually buzzed
- [ ] **Deployed matches tagged** — what's live is the release-tuple tag, diff-checked, no drift
- [ ] ONE deploy mechanism + ONE rehearsed back-out step — not three half-scripted paths
- [ ] **Pull-the-plug test:** kill the riskiest dependency once (revoke the API key, unplug the Pi, stop the DB) — degradation sane, and you'd have noticed
- [ ] Support surface prepped: FAQ for top questions · feedback channel · canned first responses

## 3. Ramp ladder (verdict per stage: Advance / Hold / Rollback)

> **Hold is cheap and legitimate. Rollback on a guardrail breach is automatic — not a 3 a.m. debate.** Set dwell time before the ramp starts: <e.g. ≥ 48 h with green signals per stage>.

| Stage | Audience | Entry date | Watch (metrics + quality signals) | Verdict · date |
|---|---|---|---|---|
| Internal | team / self | | smoke: core flow works | |
| Canary | 1–5 % <who> | | errors, North Star, cost, thumbs-down/regen | |
| 25 % | | | same + support load | |
| 50 % | | | same | |
| 100 % / GA | | | same | |

- Big-bang instead? Written reason here: <hardware batch / hard deadline / trivial change>
- **Pre-written rollback note** (fill blanks during the incident, don't compose at 3 a.m.): *"We've temporarily rolled back <feature> after detecting <issue class>. Your data is safe. Fix ETA: <…>."*

## 4. [AI] Launch block

- [ ] Auto-halt triggers **armed**, each with threshold AND action (from [07_ship_bar.md](07_ship_bar.md) §4): error/refusal spike > <x> % over <window> → **halt ramp** · cost > 120 % of forecast → **halt + investigate** · PII leak → **instant rollback**
- [ ] Ramp advance gated on **quality signals** (thumbs-down, regen, escalation rate) — not just uptime; an AI product can be 100 % up and 100 % wrong
- [ ] Transparency duties met: users know it's AI · AI content labeled · human fallback visible (obligations vary by jurisdiction — *verify current*)

## 5. [HW] Hardware readiness block

- [ ] Firmware tagged + **reproducible build** — the flashed image rebuilds from the repo alone
- [ ] OTA / recovery path tested — a failed update was recovered: **the device can be UN-BRICKED**
- [ ] Updates **signed**; devices reject unsigned images
- [ ] Burn-in / soak passed: <n> units × <duration> vs the [07_ship_bar.md](07_ship_bar.md) §3 environmental bar
- [ ] **Canary-of-one before ANY fleet push** — one device, full dwell, then the rest
- [ ] Device ramp mapped onto §3: bench → own site → friendly pilot (1–5 units) → batch
- [ ] SAT re-check at the install site — a bench pass doesn't survive the install environment
- [ ] Spares / RMA line: <n> spare units · return path · who reflashes
- [ ] Shipping lithium batteries? Carrier + labeling rules checked — *verify current*

## 6. Comms

- [ ] Positioning line → site/store copy (from [06_spec.md](06_spec.md) front matter)
- [ ] Release notes / CHANGELOG written · release-tuple tag pushed
- [ ] Announcement drafted for the 1–2 chosen channels: <which>
- [ ] People thanked by name: <who helped>

## 7. Week-one watch (daily)

| Day | North Star | Errors | Cost | **[HW]** uptime · reboots · sensor sanity | Feedback themes | Action |
|---|---|---|---|---|---|---|
| T+1 | | | | | | |
| T+3 | | | | | | |
| T+7 | | | | | | |

**G4 exit — Landed:** target audience reached, stage verdicts logged · week-one metrics in range · no open S1 · rollback unused-or-worked · runbooks real · deployed matches tagged → log in tracker, book the T+14 review ([13_ops_review.md](13_ops_review.md)).
