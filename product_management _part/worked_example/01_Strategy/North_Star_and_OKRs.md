---
Document: North Star & OKRs — Cadence
Document ID: NSOKR-cadence-v1.0
Status: Approved (G1-approved 2026-01-29)
Owner: Product Manager
Updated: 2026-01-29
---

# North Star & OKRs — Cadence

## 1. North Star Metric — `MET-01`
- **`MET-01` — Weekly Active Teams (WAT):** the number of teams completing **≥3 standups in a 7-day window**.
- **Why it's value-exchange (not vanity):** a team only hits ≥3 standups/week if members actually got value (alignment without a meeting) *and* it leads revenue — sustained weekly-active teams are the accounts that convert to Pro and expand. It cannot rise while customers churn: a team that stops getting value drops below the threshold within a week.
- **Baseline:** 0 (pre-GA; GA was 2026-05-28) → **Target / direction:** 120 WAT by 2026-09-30 (illustrative).
- **Guardrails (so growth isn't bought with harm):** `MET-06` notification opt-out rate must stay < 8%; `MET-07` median time-to-submit must stay < 90s; privacy-erasure SLA honored.
- **Owner / cadence:** Product Manager · reviewed **weekly**.

## 2. Input-metric tree (4 levers under the star)
```
                         MET-01  Weekly Active Teams (≥3 standups/wk)
                                │
   ┌───────────────┬───────────┼───────────────┬───────────────┐
 MET-02          MET-03      MET-04          MET-05         (guardrails)
 invite-loop     activation  completion      frequency       MET-06 opt-out
 (breadth)       (1st <48h)  rate (depth)    (standups/wk)    MET-07 time-to-submit
```
| ID | Input metric | What it measures | Leading/Lagging | Baseline | Moves the star by… |
|----|--------------|------------------|-----------------|----------|--------------------|
| `MET-02` | Invite-loop | invitations sent per activated team / week | Leading | TODO: pull post-GA (owner PM·2026-06) | more members per team → more complete digest → more value → stays ≥3/wk |
| `MET-03` | Activation | % of new teams completing first standup within 48h of creation | Leading | TODO: baseline (owner PM·2026-06) | a team that never does standup #1 never becomes weekly-active |
| `MET-04` | Completion rate | % of invited members who submit on a scheduled standup day | Leading | TODO: baseline (owner PM·2026-06) | higher completion → digest is worth reading → habit sticks |
| `MET-05` | Frequency | standups completed per active team per week | Leading | TODO: baseline (owner PM·2026-06) | the ≥3 threshold *is* the star's depth dimension |
<!-- MET-06 (opt-out) and MET-07 (time-to-submit) are guardrails, not levers — see §1 and 12_Analytics/KPI_Scorecard.md. -->

## 3. Objectives & Key Results

### `OBJ-01`: Make async standups the default way distributed teams stay aligned
- **`KR-01`:** Grow Weekly Active Teams from 0 → **120** by 2026-09-30 — *moves: `MET-01`*
- **`KR-02`:** Lift new-team activation (first standup < 48h) to **≥ 40%** by 2026-09-30 — *moves: `MET-03`*
- **`KR-03`:** Raise standup completion rate to **≥ 70%** by 2026-09-30 — *moves: `MET-04`*

### `OBJ-02`: Make the invite loop the primary growth engine (PLG)
- **`KR-04`:** Reach **≥ 3.5** invites sent per activated team per week by 2026-09-30 — *moves: `MET-02`*
- **`KR-05`:** Keep notification opt-out rate **< 8%** while WAT grows (growth not bought with spam) — *moves: `MET-06` (guardrail)*

## 4. Traceability & instrumentation handoff
- **Derived from strategy:** these OKRs measure the coherent actions in [Product_Strategy.md](Product_Strategy.md) §3 (win the habit; make every standup a growth event).
- **To be instrumented in:** pm-phase-12-analytics — each `MET-*` gets an event/source in `Tracking_Plan.md`; live read-out in [../12_Analytics/KPI_Scorecard.md](../12_Analytics/KPI_Scorecard.md).
- **Placeholders:** unresolved baselines are `TODO` with owner+date (never blank); resolved post-GA in Phase 12.

---
**Related (Phase 01):** Vision.md (TODO) · [Product_Strategy.md](Product_Strategy.md)
**Owning skill:** pm-phase-01-strategy · **Exit gate:** G1 · Strategy Sign-off → **Persevere** (DEC-01, 2026-01-29)
**Next:** pm-phase-12-analytics (instrument these) · pm-phase-05-roadmap (outcomes derive from these OKRs)
