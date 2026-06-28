---
Document: Launch Plan — <PRODUCT_NAME>
Document ID: LAUNCH-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager / PMM
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 11 · Launch Plan (the master launch artifact). Owning skill: pm-phase-11-launch-gtm.
Companions: GTM_Plan.md (positioning/motion/pricing/enablement) · Rollout_Plan.md (rings/flags/guardrails) · Launch_Comms.md (internal-before-external).
Conforms to ../05_Conventions.md (§2 gate G9, §3 IDs DEC-*/RSK-*/MET-*/STK-*, §5 severity S1–S4, §6 frontmatter, §7 outcomes-over-outputs).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
THREE non-negotiable defaults (override only with a recorded reason): release ≠ launch · staged-by-default · internal-before-external.
Status flips Draft → Approved (G9-approved YYYY-MM-DD) only when the go/no-go below passes.
-->

# Launch Plan — <PRODUCT_NAME>

## BLUF
<!-- One paragraph an exec reads in 20s: what's launching, the tier, the one outcome it must move, the GA date/window, the ask. -->
TODO: <what is launching, for whom, why now> · **Tier <1/2/3>** · must move **<OBJ-nn/KR-nn via MET-nn>** · GA window **<YYYY-MM-DD>** · decision needed: **G9 go/no-go**.

## Release ≠ launch (separate them)
<!-- Conflating the reversible engineering RELEASE with the GTM LAUNCH is the root of most launch risk. Name them separately. -->
- **Release** (engineering, staged, reversible — owned by P10 / `Rollout_Plan.md`): <flag key + ring schedule; confirm kill-switch exists>.
- **Launch** (the GTM moment — this plan): <the coordinated market moment + comms; see `GTM_Plan.md` / `Launch_Comms.md`>.

## Inputs & traceability (§4 spine)
<!-- Reuse prior phases; never re-ask what P01/P02/P04/P10 settled. No fabricated metric/price/quote/competitor claim — gaps become TODO:. -->
- **G8 release readiness:** `10_Delivery/Release_Readiness.md` — quality bar met, **zero open S1/S2**, instrumentation live, rollback in place. <!-- if not passed, you CANNOT GA → loop to pm-phase-10-delivery, mark TODO: G8 -->
- **Outcome to move:** `01_Strategy/North_Star_and_OKRs.md` — `OBJ-<nn>` / `KR-<nn>`, North Star `MET-<nn>`.
- **Positioning / battlecards:** `02_Market/Positioning_Brief.md` (Dunford) · `Competitive_Analysis.md` → drives `GTM_Plan.md`.
- **Economics:** `04_Opportunity/Business_Case.md` — ACV band, payback, pricing assumptions → drives `GTM_Plan.md`.
- **Metrics source:** `12_Analytics/Measurement_Plan.md` · `Tracking_Plan.md` — `MET-*` defs (or `MET-TBD` → resolved in pm-phase-12-analytics).

## Launch tier (right-size the effort)
<!-- Score reach × strategic impact × reversibility. Reserve Tier 1 (full GTM machine) for the ~2–3 launches/quarter that earn it. Treating every launch as Tier 1 burns the org. -->
| Dimension | Rating (Low/Med/High) | Note |
|---|---|---|
| Reach (how many users / segments) | <…> | <…> |
| Strategic impact (moves the OBJ/KR?) | <…> | <…> |
| Reversibility (can we roll back cleanly?) | <…> | <…> |
| **Chosen tier** | **Tier <1 / 2 / 3>** | logged as DEC-<nn> · rationale: <…> |

- **Tier 1** = full GTM (PR, exec, all-teams enablement, campaign). **Tier 2** = standard (blog, in-app, sales brief). **Tier 3** = minimal (release notes, changelog).

## Timeline & owners
<!-- T-0 = GA. Keep it lean; one Owner per row. Dates absolute (YYYY-MM-DD), never relative. -->
| Milestone | Date | Owner (STK-?) | Status |
|---|---|---|---|
| Internal enablement complete (internal-before-external) | <YYYY-MM-DD> | <PMM> | <…> |
| Beta / design-partner readout | <YYYY-MM-DD> | <PM> | <…> |
| Go/no-go (G9) | <YYYY-MM-DD> | <PM/exec> | <…> |
| GA / launch moment (T-0) | <YYYY-MM-DD> | <PMM> | <…> |
| 7 / 30 / 90-day reviews | <+7 / +30 / +90> | <PM> | <…> |

## RACI (PMM-led, cross-functional)
<!-- Exactly ONE Accountable per row. Each team is a STK-*. Internal teams briefed BEFORE external audiences. -->
| Workstream | Responsible | **Accountable (one)** | Consulted | Informed |
|---|---|---|---|---|
| Positioning & messaging | <PMM> | <PMM lead STK-nn> | <PM, customers> | <all> |
| Rollout / flags / guardrails | <Eng> | <PM/Eng STK-nn> | <SRE/on-call> | <support> |
| Sales enablement | <PMM> | <Sales lead STK-nn> | <PM> | <CS> |
| Support / docs readiness | <Support> | <Support lead STK-nn> | <PM> | <all> |
| Legal / privacy / PR | <Legal> | <Legal lead STK-nn> | <PMM> | <exec> |
| Comms execution | <PMM> | <PMM STK-nn> | <PM> | <all> |

## Pre-mortem (it's 90 days later and the launch failed — why?)
<!-- Imagine failure, then list the most likely causes as RSK-*. Raise each in _threads/Risk_Register.md (Likelihood × Impact, §5.3). -->
| RSK | Failure mode (cause) | Likelihood × Impact | Mitigation / owner |
|---|---|---|---|
| RSK-<nn> | <e.g. messaging unvalidated → flat activation> | <L×I band> | <action> / <owner> |
| RSK-<nn> | <e.g. guardrail breach with no clean rollback> | <…> | <…> |
| RSK-<nn> | <e.g. Sales/Support learn it from customers> | <…> | <…> |
- TODO: <add the rest; the cheapest failed launch is the one a gate stopped>

## Success metrics (outcomes, not vanity)
<!-- 2–3 metrics that ladder to the OBJ/KR. Press, signups, ship-date-hit are NOT success metrics (§7). Reviewed at 7/30/90 days. -->
| MET | What it measures | Ties to | 7-day | 30-day | 90-day target |
|---|---|---|---|---|---|
| MET-<nn> | <e.g. activation = first successful output> | OBJ-<nn>/KR-<nn> | <…> | <…> | <target> |
| MET-<nn> | <e.g. retention / NRR signal> | KR-<nn> | <…> | <…> | <target> |
| MET-TBD | <resolve in pm-phase-12-analytics> | <…> | — | — | <target> |

## Guardrail metrics & rollback
<!-- Full ring/threshold detail lives in Rollout_Plan.md — summarise here so the go/no-go sees it. -->
- Guardrails + auto-rollback thresholds: see **`Rollout_Plan.md`** (`MET-*` + thresholds + kill-switch owner).
- Rollback authority (RACI A): <name>. On-call window: <YYYY-MM-DD → YYYY-MM-DD>.

## Compliance & readiness floor (non-negotiable)
<!-- Responsible Product floor — even the smallest launch. Mark N/A — why, never silent. -->
- [ ] Claims truthful / non-deceptive (no overstated benchmark or competitor claim).
- [ ] Accessibility: EN 301 549 ≈ WCAG 2.1 AA (EAA enforceable).
- [ ] Privacy / DPIA sign-off where personal data is processed.
- [ ] **EU AI Act Art. 50** transparency — disclose AI interaction / label AI-generated content (from 2026-08-02), if applicable.
- [ ] Support runbook + docs live; on-call confirmed.

## Go/No-Go — Gate G9 (Launch Decision · GA)
<!-- The six-thread every-gate review runs first. Decision recorded as DEC-* in _threads/Decision_Log.md — an unrecorded gate is a failed gate. -->
- [ ] Launch **tier** chosen; rollout is **staged % behind flags** (not big-bang) — see `Rollout_Plan.md`.
- [ ] GTM ready: positioning, messaging, pricing/packaging, **partner teams enabled** — see `GTM_Plan.md`.
- [ ] Success `MET-*` + **guardrail `MET-*` with rollback thresholds** defined.
- [ ] Comms ready, internal-before-external; support/docs in place — see `Launch_Comms.md`.
- [ ] Legal/privacy sign-off where required; on-call confirmed for the launch window.
- **Decision:** <Persevere | Persevere-with-actions | Pivot | Hold | Kill> — DEC-<nn> (`_threads/Decision_Log.md`).
- **Open actions (if with-actions):** <action — owner — YYYY-MM-DD>.

## Post-launch review plan (7 / 30 / 90)
<!-- Instrumented in pm-phase-12-analytics. Each review is a decision point, not a status update. -->
- **7 days** — guardrails holding? early activation signal? hotfixes? (rollback still on the table).
- **30 days** — success `MET-*` trending to target? messaging resonance from `FB-*`?
- **90 days** — outcome moved (`OBJ/KR`)? scale the motion (→ pm-phase-15-growth) or Pivot?

## Handoffs (wire the spine)
- Fix-validation A/Bs → `EXP-*` (pm-phase-13-experimentation) · post-launch feedback → `FB-*` (pm-phase-14-feedback) · expansion bets → `GX-*` (pm-phase-15-growth) · success/guardrail metrics instrumented in pm-phase-12-analytics.

## Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial draft | Launch planning start | <name> |

---
*Owning skill:* **pm-phase-11-launch-gtm** · *Companions:* **GTM_Plan.md** · **Rollout_Plan.md** · **Launch_Comms.md** · *Conventions:* ../05_Conventions.md
