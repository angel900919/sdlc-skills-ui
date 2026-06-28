---
Document: Growth Experiment Backlog — <PRODUCT_NAME>
Document ID: GXBACKLOG-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <PM / Growth lead — name/role>
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 15 · Product Growth & Optimization. Owning skill: pm-phase-15-growth.
Companion template: Growth_Model.md (the loops/leaks these bets target).
Conforms to ../05_Conventions.md (§3 IDs GX-/MET-/EXP-/FB-/INS-/DEC-/RSK-, §4 traceability spine,
§6 frontmatter, §7 outcomes-over-outputs, §8 ICE/RICE citation).
This is a BLANK, reusable fill-in. Replace every <ANGLE_BRACKET>, resolve every "TODO:", or
delete the example rows. Don't ship the example IDs/scores.
STATUS = Living per §6: a backlog is never "done" — re-rank on the growth-review cadence, bump the
minor version each pass.
RULE: every GX ties to a SINGLE MET-* and a GUARDRAIL; correlation is never the result — a bet is
"won" only after a causal EXP-* (P13) holds with guardrails intact. Never fabricate an effect size
or benchmark — cite a sourced range or mark TODO. AI drafts/runs more experiments; the human owns
Confidence, statistical rigor, and the dark-pattern red-team (§11).
-->

# Growth Experiment Backlog — <PRODUCT_NAME>

## How to use this
A prioritized list of `GX-*` growth bets, each a **falsifiable hypothesis** aimed at one loop/stage
from `Growth_Model.md`, scored with **ICE** (or RICE), carrying a single `MET-*` and a **guardrail**.
Top bets **graduate** into causal `EXP-*` (pm-phase-13-experimentation). Ship winners into the loop,
kill losers, iterate. *Outcomes over outputs (§7): a bet is judged by the metric it moved, not by shipping.*

<!-- Use ONE primary scoring model (ICE default; RICE if you have reach data). Re-rank on cadence,
not once. A low Confidence score is a flag to run discovery (talk to a customer), not to guess louder. -->

## Scoring legend — ICE (default)
<!-- Score each 1–10; ICE = (Impact + Confidence + Ease) / 3, or Impact × Confidence × Ease — pick one
and apply it consistently. RICE = (Reach × Impact × Confidence) / Effort if you have reach data (§8). -->
- **Impact** — how much it moves the target `MET-*` if it works (1 = trivial, 10 = step-change).
- **Confidence** — strength of evidence it *will* work (1 = hunch, 10 = strong prior `FB-/INS-/EXP-`). *Be honest; low = run discovery.*
- **Ease** — inverse of effort to build + run (1 = quarters, 10 = days).
- **Score** = `<ICE formula in use>`. Higher ranks first. *Score informs sequencing — it never launders a HiPPO call.*

## Hypothesis grammar (fill every bet this way)
> **If** we `<change>`, **then** `<MET-*>` will `<move by ~__>`, **because** `<evidence: FB-/INS-/benchmark>`.
<!-- No "because" grounded in evidence = it's a guess; mark Confidence low and route to discovery. -->

## Traceability (§4 spine)
- Targets loops/leaks in: `15_Growth/Growth_Model.md` (loop · stage · bottleneck).
- Metrics from: `12_Analytics/...` — `MET-*`. Evidence from: `14_Feedback/...` — `FB-*` / `03_Discovery/...` — `INS-*`.
- Graduates into: `13_Experiments/Experiment_Plan.md` — `EXP-*` (causal proof). Decisions: `_threads/Decision_Log.md` — `DEC-*`.

---

## The backlog (ICE-ranked — highest score on top)
<!-- One row per bet. Keep it ranked. Status vocabulary below. Replace ALL example rows. -->

| ID | Hypothesis (if / then / because) | Loop · stage | Metric (MET-) | Guardrail | I | C | E | Score | Status → EXP- | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| GX-01 | If `<change>` then `MET-<nn>` ↑ because `<FB-/INS->` | `<loop>` · Activation | `MET-<nn>` | retention `MET-<nn>` not ↓ | 8 | 7 | 6 | 7.0 | `EXP-<nn>` running | — |
| GX-02 | If `<reverse trial>` then conversion ↑ because `<benchmark [cite]>` | `<loop>` · Monetization | `MET-<nn>` | refund/churn `MET-<nn>` | 7 | 4 | 6 | 5.7 | `TODO: discovery first` | — |
| GX-03 | If `<change>` then `MET-<nn>` ↑ because `<evidence>` | `<loop>` · Retention | `MET-<nn>` | `<guardrail MET->` | `<1-10>` | `<1-10>` | `<1-10>` | `<score>` | `<Idea>` | — |
| GX-`<nn>` | `<if / then / because>` | `<loop · stage>` | `MET-<nn>` | `<guardrail>` | `<>` | `<>` | `<>` | `<>` | `<status>` | — |

<!-- "Loop · stage" = which Growth_Model.md loop + which AARRR stage (Acquisition/Activation/
Retention/Referral/Revenue). "Guardrail" is MANDATORY — the metric that must NOT degrade (e.g.
retention, refund rate, support load, error rate). No guardrail ⇒ not ready to run. -->

## Status vocabulary
<!-- A GX moves left→right through these. Decisions logged as DEC-* (§2 decision vocabulary). -->
- **Idea** — captured, not yet scored/prioritized.
- **Discovery** — Confidence too low; talk to a customer / pull data first (pm-phase-03/04/14).
- **Ready** — scored, has a single `MET-` + guardrail, designed; waiting for capacity.
- **EXP-`<nn>` running** — graduated into a causal experiment (pm-phase-13-experimentation).
- **Won → shipped** — `EXP-` showed causal lift, guardrails held; rolled into the loop.
- **Lost → killed** — no lift or guardrail breached; killed (record the learning).
- **Parked** — valid but out of scope now; note the trigger that would revive it.

## Graduating a bet → EXP- (causal proof gate)
<!-- Ship directly ONLY for low-risk, high-confidence, reversible changes. Otherwise run a causal
EXP-* (pm-phase-13-experimentation). Correlation is never the result. -->
- A `GX-` graduates when: target `MET-` + guardrail set · effect size hypothesized · sample/power estimated · ethics floor passed.
- On readout: **Persevere** (ship into loop) · **Pivot** (recut the bet) · **Kill** (drop) — log as `DEC-<nn>`; if it implies a new problem, route an `OPP-*` to pm-phase-04-opportunity.

## Shipped / killed log (what we learned)
<!-- The compounding asset is the LEARNING, not the list. Record every concluded bet here. -->
| Date | GX- → EXP- | Outcome (Won/Lost) | Lift on MET- (causal) | Guardrails held? | Learning / next |
|---|---|---|---|---|---|
| `<YYYY-MM-DD>` | `GX-<nn>` → `EXP-<nn>` | `<Won/Lost>` | `<+__% / none>` | `<Y/N>` | `<what we now believe; new GX-/OPP->` |

## Responsible-product red-team (per bet, before it runs)
<!-- Non-negotiable floor (§10). Any "no" → raise an RSK-* and fix before running, don't ship the violation. -->
- [ ] Not a **dark pattern** dressed as retention (no forced continuity, fake urgency, roach-motel cancel).
- [ ] **Consent** in place for any new tracking (GDPR).
- [ ] **AI disclosure** if the bet personalizes onboarding/content with AI (EU AI Act Art. 50, 2026-08-02).
- [ ] Builds **genuine habit / value**, not manipulative engagement. New risks → `RSK-<nn>`.

## Review cadence & change log
<!-- Living artifact (§6): re-rank on the growth-review cadence; minor bump each pass. -->
- Cadence: `<e.g. monthly re-rank at the growth review>` · Next review: `<YYYY-MM-DD>`.

| Date | vX.Y | Change (GX added / re-ranked / graduated / killed) | Why | By |
|---|---|---|---|---|
| `<YYYY-MM-DD>` | v0.1 | Initial backlog | First growth review | `<name>` |

---
*Owning skill:* **pm-phase-15-growth** · *Companion template:* **Growth_Model.md** (loops/leaks these bets target) ·
*Graduates into:* **pm-phase-13-experimentation** (`EXP-*` causal proof) · *Seeded by:* **pm-phase-14-feedback** (`FB-*`) ·
*Conventions:* ../05_Conventions.md
