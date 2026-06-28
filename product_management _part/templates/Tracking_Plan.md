---
Document: Tracking Plan — <Product / Feature>
Document ID: TRK-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager / Data
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — blank & reusable. Owning skill: pm-phase-12-analytics (Phase 12 — Analytics, KPIs & Instrumentation).
Companions: Measurement_Plan.md (defines every MET-* this captures) · KPI_Scorecard.md (the live read-out).
Conforms to ../05_Conventions.md — §3.3 IDs (MET-*), §4 traceability spine, §6 frontmatter/Living status, §3.4 REQ-SEC-* (privacy constraints).
RULES: instrument DELIBERATELY from this plan — never "track everything now". Every event has a consistent name, typed properties,
an owner, a MET-* it feeds, and a consent basis. GOVERNANCE: no new event ships without a row here. Record consent/lawful basis up front
(privacy is designed in, not legal's afterthought). NEVER invent volumes/values — mark "TODO: <owner · date>". Keep status Living.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Don't ship the example rows.
-->

# Tracking Plan — <Product / Feature>

## How to read this
*The deliberate spec for what we capture and why.* Each event exists to feed a `MET-*` in
[Measurement_Plan.md](Measurement_Plan.md). If an event feeds no metric, it doesn't ship.
This plan satisfies the **G8** "instrumentation live & dashboards ready" line.

## 1. Taxonomy & conventions
<!-- One naming convention, enforced. Drift is what makes analytics untrustworthy. -->
- **Event naming:** `object_action` in <snake_case> past tense (e.g. `checkout_completed`). TODO: <confirm / adjust>
- **Property naming:** <snake_case>, typed. Reserved props: `timestamp`, `user_id`, `session_id`, `source`, `app_version`.
- **Casing / units / currency / timezone:** TODO: <e.g. UTC, ISO-8601, minor currency units>
- **What is NOT an event:** TODO: <derived metrics, vanity counters — computed downstream, not tracked>

## 2. Identity & sources of truth
- **Identity model:** TODO: <anonymous_id → user_id stitching; account/org grouping>
- **Source of truth (tool of record):** TODO: <e.g. analytics tool / warehouse>
- **Pipeline / collection:** TODO: <SDK · CDP · server-side · warehouse-native>
- **Environments:** TODO: <dev / staging / prod separation; how test traffic is excluded>

## 3. Event spec
<!-- One row per event. "Feeds MET-" is mandatory — an event with no metric behind it is "track everything now". -->
| Event (`object_action`) | Trigger (fires exactly when) | Properties (name : type) | Feeds `MET-` | Owner | Consent basis (GDPR) | PII? |
|-------------------------|------------------------------|--------------------------|--------------|-------|----------------------|------|
| `<activation_completed>` | TODO: <user first reaches value moment> | `plan:string, source:string, time_to_value_s:int` | `MET-02` | <role> | TODO: <consent / legitimate interest> | no |
| `<core_action_performed>` | TODO: <the key repeated action> | `<count:int>, <surface:enum>` | `MET-03` | <role> | TODO | TODO |
| `<error_shown>` | TODO: <user-facing error> | `<code:string>, <severity:enum>` | `MET-0n` (guardrail) | <role> | TODO | no |
<!-- Keep properties minimal & typed. Mark any property carrying personal data PII=yes and justify it in §5. -->

### Optional: precise trigger as Given/When/Then
<!-- For ambiguous events, pin the trigger so eng and data agree on exactly when it fires. -->
- **`<event_name>`** — *Given* TODO: <precondition / state> · *When* TODO: <user/system action> · *Then* fire with `<props>`.

## 4. Coverage check — every `MET-*` is instrumented
<!-- Cross-check against Measurement_Plan.md §2. A MET with no event is a metric you can't actually read. -->
| `MET-` (from Measurement_Plan) | Captured by event(s) | Status |
|--------------------------------|----------------------|--------|
| `MET-01` (North Star) | TODO: <event(s) or derivation> | <live / TODO> |
| `MET-02` | TODO | <live / TODO> |
| `MET-03` | TODO | <live / TODO> |

## 5. Consent, privacy & PII (the floor — non-negotiable)
<!-- Designed in, per Responsible Product. Ties to REQ-SEC-* / REQ-O- from the PRD. -->
- **Lawful basis** per event recorded above; default-off where consent is required (ePrivacy). TODO: <summary>
- **PII inventory:** TODO: <which properties are personal data, where stored, retention window>
- **Minimisation:** no property collected beyond what its `MET-*` decision needs.
- **EU AI Act Art. 50** AI-interaction transparency where the product uses AI. TODO: <confirm / N/A>
- New risks → `_threads/Risk_Register.md` (`RSK-*`).

## 6. Governance
<!-- The rule that keeps the taxonomy from rotting. -->
- **No new event ships without a row in §3** (PR review references this plan). Owner: <role>.
- **Change process:** TODO: <who approves new events/props; where the spec lives — e.g. Avo / Lexicon / Amplitude Govern>
- **Taxonomy-drift audit:** TODO: <cadence — AI can flag drift; human approves the fix>
- **Versioning:** breaking a property = vMAJOR; adding an event = vMINOR (Conventions §6).

## 7. Traceability & handoffs
- **Defines capture for:** every `MET-*` in [Measurement_Plan.md](Measurement_Plan.md).
- **Feeds:** [KPI_Scorecard.md](KPI_Scorecard.md) (the read-out) · pm-phase-13-experimentation (events become experiment metrics, `EXP-*`).
- **G8 line:** this plan + live instrumentation satisfies "instrumentation live & dashboards ready" for pm-phase-10-delivery.
- **Placeholders:** unresolved metric links use `MET-TBD` (never a blank cell); resolve in Measurement_Plan.md.

---
**Related (Phase 12):** [Measurement_Plan.md](Measurement_Plan.md) · [KPI_Scorecard.md](KPI_Scorecard.md)
**Owning skill:** pm-phase-12-analytics · **Status:** continuous (feeds G8 Release Readiness)
**Log:** taxonomy/instrumentation calls → `_threads/Decision_Log.md` (`DEC-*`) · privacy risks → `_threads/Risk_Register.md` (`RSK-*`)
