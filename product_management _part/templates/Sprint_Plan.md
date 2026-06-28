---
Document: Sprint / Iteration Plan — <PRODUCT_NAME> · Iteration <n>
Document ID: SPRINT-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 10 · Sprint / Iteration Plan (the CURRENT iteration only). Owning skill:
pm-phase-10-delivery. Conforms to ../05_Conventions.md (§3 IDs US-*/AC-*/DEP-*/RSK-*/RMI-*,
§4 spine, §6 frontmatter/Living, §7 outcomes-over-outputs). Companion: Delivery_Plan.md
(the standing how). Pulls from 09_Backlog/ (US-*/AC-*/DoR_DoD.md). Risks live in Risk_Register.md.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example IDs.
Status: Living — one rolling doc per iteration; copy this block for the next iteration or archive.
Kanban teams: drop the timebox; treat "Iteration goal" as the current flow objective and keep
the WIP + flow snapshot live.
-->

# Sprint / Iteration <n> — <PRODUCT_NAME>

- **Window:** <YYYY-MM-DD> → <YYYY-MM-DD>  ·  **Cadence:** `<Scrum sprint | Kanban flow>` (see `Delivery_Plan.md`)
- **Serves:** RMI-<nn> · FEAT-<nn>  →  **Outcome:** OBJ-<nn>/KR-<nn> measured by **MET-<nn>**

## 1. Iteration goal *(an OUTCOME, not a story count — §7)*
> TODO: one sentence — the customer/business change this iteration aims to produce.
> e.g. "Cut <task> time enough to move MET-<nn> from <baseline> toward <target>."
<!-- A sprint that is a feature checklist with no outcome is a feature-factory smell. -->

## 2. Capacity *(plan with slack — NEVER ~100%)*
<!-- Planning to full utilization kills flow. Reserve buffer for discovery, support, and unknowns. -->
- Team available capacity this iteration: TODO: `<basis — never invent a number>`.
- Reserved for discovery / support / spillover: `<~20%>`.
- Planned load vs. capacity: `<e.g. ~70–80% committed>`.

## 3. Committed work (pulled from the ready backlog)
<!-- Pull top-priority SLICED stories that meet DoR (09_Backlog/DoR_DoD.md). Vertical slices only. -->

| US- | Story (one line) | Trace (RMI/OPP) | Size `<pts | S/M/L | n/a>` | DoR met? | Status | Owner |
|---|---|---|---|---|---|---|
| US-<nn> | <as-a… so-that…> | RMI-<nn> / OPP-<nn> | <> | <Y/N> | <To do / In progress / Done> | <name> |
| US-<nn> | <…> | RMI-<nn> / OPP-<nn> | <> | <> | <> | <name> |

> Each `US-` carries testable `AC-` in `09_Backlog/User_Stories.md` (Given/When/Then where it adds clarity). Don't restate AC here.

## 4. WIP & flow snapshot *(learn, don't judge)*
- WIP limit(s): `<per stage>` — current WIP: `<>`.
- Oldest in-progress item (work-item age): US-<nn> — `<days>` (flag if > cycle-time p85).
- Throughput last iteration: `<items>` (context for the forecast, not a target).

## 5. Forecast *(probabilistic, not a promise)*
- Method: `<Monte Carlo over throughput | flow-based>`.
- Forecast: `<e.g. 85% likely to finish the committed slice by YYYY-MM-DD>`.
- Over-commit flag: `<none | which US- is at risk and why>`.

## 6. Dependencies & risks
- **DEP-<nn>** — <cross-team / external / tech> · owner `<name>` · needed by <YYYY-MM-DD> · blocks US-<nn>.
- **RSK-<nn>** — <delivery risk for this iteration> (scored + mitigated in `Risk_Register.md`).
- Carried-forward open assumption: ASM-<nn> → now monitored as RSK-<nn>.

## 7. Defects in flight
<!-- Severity (impact) ≠ priority (when we fix it) — score separately (§5.1). -->
- **ISS-<nn>** (`S1–S4`) — <one line> · priority `<P0–P3>` · status `<open/fixed>`.
- Gate rule: an open `S1/S2` blocks G8 unless explicitly waived (rationale + owner + fix date) in `Release_Readiness.md`.

## 8. Review & retro outcome
- Goal met? `<yes / partly / no>` — evidence vs. MET-<nn>: `<>`.
- Decisions / process changes logged as `DEC-<nn>` in `_threads/Decision_Log.md`.
- Carry-over to next iteration: US-<nn>, US-<nn>.

---
*Owning skill:* **pm-phase-10-delivery** · *Companions:* **Delivery_Plan.md** · **Risk_Register.md** · **Release_Readiness.md** ·
*Backlog source:* **../09_Backlog/User_Stories.md** + **DoR_DoD.md** · *Conventions:* ../05_Conventions.md
