---
Document: Release Plan — <PRODUCT_NAME>
Document ID: RELEASE-<PRODUCT_SLUG>-v1.0
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 05 · Release Plan (the committed-Now delivery view of the roadmap).
Owning skill: pm-phase-05-roadmap. Companion: Roadmap.md (intent over the horizon).
Conforms to ../05_Conventions.md (§3 IDs RMI-*/OPP-*/DEP-*/MET-*, §4 spine, §6 frontmatter,
§7 outcomes-over-outputs). Fill every <ANGLE_BRACKET> / TODO: or delete the row.
Scope discipline: this plan covers the **Now** horizon ONLY. Do NOT let its specificity
leak into Next/Later — that belongs in Roadmap.md. Feeds story-mapping in pm-phase-09-stories.
-->

# Release Plan — <PRODUCT_NAME>

## Purpose & scope
The **committed delivery view of the Now horizon only**: how the Now `RMI-*` from `Roadmap.md`
break into releasable slices, in what sequence, with which dependencies, and the outcome
(`MET-*`) each release is accountable for. The roadmap states *intent*; this plan states the
*committed slice*. **"Done" = a moved metric, not a shipped feature (§7).**

<!-- Source roadmap: ROADMAP-<PRODUCT_SLUG> (Now horizon). Keep the two in sync. -->

## Release slices (Now horizon)
<!-- Slice VERTICALLY — each slice should deliver end-to-end user/business value, never a
horizontal frontend/backend layer. Sequence by cost-of-delay, not convenience. -->

| Release / Slice | RMI | OPP | Outcome it's accountable for (OBJ/KR · MET) | Sequence | Status | Dependencies |
|---|---|---|---|---|---|---|
| R1 — <slice name> | RMI-<nn> | OPP-<nn> | <OBJ-nn/KR-nn> · MET-<nn> | 1 | <Planned/In progress/Released> | DEP-<nn> |
| R2 — <slice name> | RMI-<nn> | OPP-<nn> | <OBJ-nn/KR-nn> · MET-<nn> | 2 | Planned | DEP-<nn> / — |
| R<n> — <slice name> | RMI-<nn> | OPP-<nn> | <OBJ-nn/KR-nn> · MET-TBD | <n> | Planned | — |

<!-- Every slice MUST carry an RMI-*, an OPP-* (evidence), and a MET-* it moves. No MET ⇒ not ready. -->

## Per-release detail
<!-- One block per slice above. Keep it lean — just enough to sequence and hand to delivery. -->

### R1 — <slice name>
- **Bet / RMI:** RMI-<nn> — <one-line problem this slice solves for which segment>.
- **Traces to:** OPP-<nn> (evidence) · OBJ-<nn>/KR-<nn> (outcome).
- **Accountable for (success metric):** MET-<nn> — <target / guardrail>. <!-- the metric that defines "done" -->
- **Scope (in):** <what ships in this slice — the coherent releasable increment>.
- **Out of scope / deferred:** <explicitly parked — push to a later slice or the roadmap>.
- **Dependencies:** DEP-<nn> — <cross-team / external / tech> (owned in pm-phase-10-delivery).
- **Rollout:** <flag / % ramp / cohort / big-bang> · **Rollback:** <trigger + how>.
- **Decision date / checkpoint:** <YYYY-MM-DD> — <commit / re-evaluate>.

### R2 — <slice name>
- TODO: repeat the block above for each slice.

## Sequencing & dependencies
<!-- Make the critical path visible. DEP-* are owned/tracked in pm-phase-10-delivery; surface them here. -->
- Critical path: R<n> → R<n> → R<n> (<why this order — cost-of-delay / dependency>).
- DEP-<nn> — <dependency> blocks <slice>; owner <name>; needed by <YYYY-MM-DD>.

## Capacity check
<!-- Pressure-test against REAL team capacity; never plan at 100%. Mark unknowns TODO:, don't invent. -->
- Team capacity for this horizon: TODO: <capacity / velocity basis>.
- Planned load vs. capacity: <e.g. ~70-80% committed, buffer for discovery & unknowns>.
- Risks to capacity: RSK-<nn> — <leave/dependency/hiring> (→ `_threads/Risk_Register.md`).

## Story-map handoff
<!-- Bridge release → backlog. The next phase turns these slices into a story map and stories. -->
- Each slice above feeds **pm-phase-09-stories** → `09_Backlog/Story_Map.md` (vertical slices → `US-*` + `AC-*`).

## Change log
| Date | vX.Y | Change | Why | By |
|---|---|---|---|---|
| <YYYY-MM-DD> | v1.0 | Initial Now-horizon plan | G4 commit | <name> |

---
*Owning skill:* **pm-phase-05-roadmap** · *Companion template:* **Roadmap.md** (Now/Next/Later intent) ·
*Next phase:* **pm-phase-09-stories** (Story_Map.md) · *Conventions:* ../05_Conventions.md
