---
Document: Delivery Plan — <PRODUCT_NAME>
Document ID: DEL-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 10 · Delivery Plan (how this team builds, keeps flow healthy, and ships
reversibly). Owning skill: pm-phase-10-delivery. Conforms to ../05_Conventions.md
(§2 gate G8, §3 IDs DEP-*/ISS-*/RSK-*/DEC-*, §4 traceability spine, §5 severity,
§6 frontmatter/Living, §7 outcomes-over-outputs). Companions: Sprint_Plan.md ·
Risk_Register.md · Release_Readiness.md. Upstream: DoR_DoD.md (Phase 09), PRD.md/NFR_Checklist.md
(Phase 08), Release_Plan.md/Roadmap.md (Phase 05), Operating_Model.md (Phase 00).
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Status: Living — the plan adapts as flow data comes in; it is never "Approved-and-frozen" (§6).
-->

# Delivery Plan — <PRODUCT_NAME>

## Purpose & scope
How we turn the **G7-ready backlog** into a **releasable, instrumented, reversible increment**
without becoming an output factory. This plan sets cadence, WIP policy, flow/DORA health, and
release strategy. **Release ≠ launch** — reversible engineering lives here; the GTM moment is
`pm-phase-11-launch-gtm`. **"Done" = a moved `MET-`, not a closed ticket (§7).**

## Inputs & traceability (§4 spine — cross-reference by ID, never re-describe)
<!-- If a gating input is missing, route back — don't invent it. -->
- **Cadence & WIP policy** inherited from `00_Charter/Operating_Model.md` — reuse, don't re-choose.
- **Ready backlog** (`US-*`, `AC-*`, DoD's `MET-` link) from `09_Backlog/` (G7). No ready backlog ⇒ STOP, route to `pm-phase-09-stories`.
- **Quality bar / NFRs** (`REQ-U/P/O/SEC/C-*`) from `08_PRD/` (G6).
- **Slice in flight** (`RMI-*`) from `05_Roadmap/Release_Plan.md`.
- **Outcome metric** (`MET-*`, or `MET-TBD`) from `12_Analytics/` — must be *live* by G8.
- **Open assumptions** (`ASM-*`) from `07_Solution/` — carry forward as `RSK-*` to monitor.

## 1. Cadence & ways of working
<!-- Fit method to the WORK, don't cargo-cult ceremonies (zombie scrum). Re-choose only with a reason. -->
- **Method:** `<Scrum | Kanban | Scrumban | continuous flow>` — *why this fits the work:* <reason>.
- **Iteration length:** `<1–2 weeks | continuous (no timebox)>`.
- **WIP limits:** `<per column/stage>` — start less, finish more (Little's Law: cycle time = WIP ÷ throughput).
- **Definition of Done:** see `09_Backlog/DoR_DoD.md` — *reference it, do not restate it here*.
- **Dual-track stance:** discovery (P03–P07) feeds this backlog continuously — **no** discovery→delivery handoff team; one trio owns the problem end-to-end.
- **Refinement:** just-in-time, top ~10–20 items only — the backlog is living, not designed up front.

## 2. Flow & delivery health *(measure to learn, NEVER to judge — §7)*
<!-- No velocity-as-KPI. No ranking individuals/teams. No LOC/commit surveillance. Team-level only. -->

| Flow metric (Kanban) | What it tells us | Target / signal |
|---|---|---|
| WIP | Are we starting more than we finish? | `<limit>` — breach ⇒ stop starting |
| Cycle time | How long work takes once started | `<p50/p85>` |
| Work-item age | Is in-progress work aging out? | flag when > `<cycle-time p85>` |
| Throughput | Items finished per `<week>` | trend, not target |

| DORA dimension (2024/2025 model) | What it tells us | Current / target |
|---|---|---|
| Deploy frequency | Batch size / release rhythm | `<>` |
| Lead time for changes | Commit → production | `<>` |
| Change-fail / rework rate | Quality of what we ship | `<>` |
| Failed-deployment recovery time | How fast we recover | `<>` |
| *(2025: reliability / 6th dim)* | Operational stability | `<or TODO>` |

> Bottleneck rule: rising work-item age or a WIP breach = adapt the plan, not push the people.

## 3. Forecasting & estimation
- **Forecasting:** `<Monte Carlo over throughput | flow-based>` — probabilistic "when," not velocity theater.
- **Estimation:** `<story points for shared understanding | #NoEstimates / right-sizing>` — **never** a commitment, a KPI, or a cross-team yardstick; points ≠ hours.

## 4. Release strategy *(reversible by design — responsible-product floor)*
- **Mechanism:** `<feature flag | % rollout / ramp | canary | ring>`.
- **Rollback / kill-switch:** `<how it's triggered>` · owner `<name>` · target rollback time `<>`.
- **Instrumentation:** `MET-<nn>` wired + dashboard live before release (else release is not ready).
- **Quality floor verified pre-release:** NFRs (`REQ-P/O/SEC-*`) · accessibility (WCAG 2.2) · privacy/consent · security. Detailed evidence → `Release_Readiness.md`.

## 5. Dependencies & risk
<!-- Log here as pointers; the full register is Risk_Register.md (mirrors _threads/Risk_Register.md). -->
- Cross-team / technical dependencies tracked as `DEP-*` (owner + needed-by date) → `Risk_Register.md`.
- Delivery risks tracked as `RSK-*` (Likelihood × Impact, §5.3) → `Risk_Register.md`.

## 6. AI-assist with a safety net (§11)
<!-- AI is "the great amplifier": throughput up, but stability drops WITHOUT guardrails (DORA). -->
- AI may draft the sprint plan, refine/de-dup the backlog, and predict dependencies/bottlenecks — *the human verifies and decides*.
- Non-negotiable net: automated tests, code review, feature flags, rollback. Never trade the net for AI throughput.

## 7. Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v0.1 | Initial delivery plan | Phase 10 start | <name> |

---
*Owning skill:* **pm-phase-10-delivery** · *Companions:* **Sprint_Plan.md** · **Risk_Register.md** · **Release_Readiness.md** ·
*Exit gate:* **G8 · Release Readiness** (`../checklists/gate-reviews.md`) · *Conventions:* ../05_Conventions.md
