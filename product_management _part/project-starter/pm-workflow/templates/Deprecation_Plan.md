---
Document: Deprecation Plan — <PRODUCT/FEATURE/API_NAME>
Document ID: DEPREC-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 16 · Product Sunset & Retirement. Owning skill: pm-phase-16-sunset.
Conforms to ../05_Conventions.md (§2 gate G10 · §3 IDs RSK-* here; MET/PER/DEC referenced ·
§5.3 risk scoring · §6 frontmatter · §7 outcomes-over-outputs).
Decision rationale lives in Sunset_Decision.md; the actual message drafts live in Migration_Comms.md.
Framework anchor (§8 + Research Pack §17): 5D Sunset Strategy — this file is DESIGN + DELIVER.
Rule: estimate the runway, then DOUBLE it. Maintain quality + support THROUGH the runway (cutting
support the day you announce is the classic trust-killer). Never an abrupt 30-day kill — esp. developer-facing.
Fill every <ANGLE_BRACKET> / TODO: or delete the row. Dates/levels below are PLACEHOLDERS — replace or mark TODO:.
-->

# Deprecation Plan — <PRODUCT/FEATURE/API_NAME>

## At a glance
- **What's being retired:** <product/feature/API/tier> · slug `<product-slug>` · type `<EOL | feature removal | API/version deprecation | tier sunset | merge>`.
- **Decision:** see **Sunset_Decision.md** (DEC-<nn>). **Verdict:** `<Sunset/Kill>`.
- **Runway window:** `<YYYY-MM-DD>` (announce) → `<YYYY-MM-DD>` (EOL). <!-- = your honest estimate, doubled. -->
- **Destination for users:** <alternative / migration path / export> (full detail in Migration_Comms.md).

## 1. Timeline & phases (runway → EOL)
<!-- The phase backbone for a clean sunset. Keep quality + support FULL through the runway; degrade only at read-only.
For APIs: emit `Deprecation: <date>` at announce and `Sunset: <date>` HTTP headers at wind-down (RFC 8594 / draft-deprecation-header). -->

| Phase | Date | What changes | Access | Support / quality level | API signal |
|---|---|---|---|---|---|
| **Announce** | <YYYY-MM-DD> | banner + email + docs note; migration guide live | Full | **Full** | `Deprecation: <date>` header + sunset docs |
| **Runway (migrate)** | <YYYY-MM-DD → …> | migration open; high-touch account triage; reminders | Full | **Full** | deprecation warnings in responses/SDK |
| **Wind-down / read-only** | <YYYY-MM-DD> | new sign-ups/keys off; feature frozen; export prompts | Read-only | **Maintained** (no new work, bugs/security only) | `Sunset: <date>` header |
| **EOL / shutdown** | <YYYY-MM-DD> | access off; final export window closes | Off | — | endpoint returns 410 Gone |
| **Post-EOL** | <YYYY-MM-DD> | data retention clock → erasure; debrief | — | — | — |

<!-- Phased, feature-by-feature wind-down for complex products; a single clean cut only for trivial, low-dependence cases.
Drive the length from contractual obligations, migration complexity, and segment dependence (Sunset_Decision.md §4). -->

## 2. Comms touchpoint schedule (5-7 touchpoints, multi-channel)
<!-- Communication is the single biggest determinant of a clean sunset. Schedule 5-7 touchpoints here;
the WORDING of each is drafted per segment in Migration_Comms.md. Every touchpoint says WHY · TIMELINE · MIGRATION PATH.
Avoid the abrupt single-notice kill. Tailor cadence to segment (high-value accounts get earlier + more personal touches). -->

| # | Touchpoint | When (vs. timeline) | Channel(s) | Audience | Message draft → |
|---|---|---|---|---|---|
| T1 | **Initial announcement** | Announce day | email + in-app banner + docs + status page | all affected + internal | Migration_Comms.md §T1 |
| T2 | **Why & migration guide** | Announce +<n>d | blog/changelog + docs + dev portal | all + developers | Migration_Comms.md §T2 |
| T3 | **High-touch account outreach** | Runway, early | 1:1 (CSM/AE call + email) | high-value / high-dependence (PER-<nn>) | Migration_Comms.md §T3 |
| T4 | **Mid-runway reminder + progress** | Runway midpoint | email + in-app | not-yet-migrated | Migration_Comms.md §T4 |
| T5 | **Read-only / final-call notice** | Wind-down start | email + banner + `Sunset` header | remaining users | Migration_Comms.md §T5 |
| T6 | **Last-chance + export reminder** | EOL −<n>d | email + in-app modal | remaining + data holders | Migration_Comms.md §T6 |
| T7 | **Shutdown confirmation + thanks** | EOL day / +1 | email + status page | all | Migration_Comms.md §T7 |
<!-- Use 5 minimum; add T6/T7 for higher-stakes or developer-facing sunsets. Delete unused rows but keep ≥5. -->

## 3. Migration & data lifecycle
<!-- Data has its own lifecycle. Shutdown is NOT the finish line. Each obligation is an RSK-* in _threads/Risk_Register.md. -->
- **Destination:** <named alternative / migration path>. Self-serve vs. assisted: <which segments get which>.
- **Export:** format `<CSV/JSON/API>` · self-serve? `<Y/N>` · window opens `<YYYY-MM-DD>` → closes `<YYYY-MM-DD>`.

**Retention & erasure** (GDPR/CCPA storage-limitation; EDPB 2025 expects *automated* deletion + data *classification*)
| Data class | Lawful retention | Erasure trigger | Method | Backups/test/dev in scope? | RSK |
|---|---|---|---|---|---|
| <PII / account> | <e.g. 30d post-EOL, then delete> | <EOL + retention> | **automated** <job/pipeline> | **Yes** — <how> | RSK-<nn> |
| <usage logs / analytics> | <…> | <…> | automated | Yes / <TODO:> | RSK-<nn> |
| <billing/financial (statutory hold)> | <e.g. 7y tax> | <statutory expiry> | scheduled | Yes | RSK-<nn> |
<!-- Manual-only deletion is an audited gap (EDPB). Classify data and AUTOMATE erasure; include backups, test, and dev copies. -->

## 4. Legal, contracts & internal teams
<!-- Brief everyone who touches the customer or the data BEFORE the announcement. -->
- **Contracts / SLAs checked:** <which agreements commit us past the proposed EOL?> → <honor / renegotiate / grandfather> (RSK-<nn>).
- **Grandfathering / exceptions:** <named accounts kept on past EOL, with end date> · <TODO:>.
- **Internal briefing (date complete):** Support `<date>` · Sales/CSM `<date>` · Finance `<date>` · Legal/Privacy `<date>`.
- **Support readiness:** macros/FAQ updated; escalation path for migration friction; staffed through runway.

## 5. Rollout responsibilities & rollback
- **Owners:** comms `<name>` · migration eng `<name>` · data/erasure `<Privacy>` · account triage `<CSM>`.
- **Pause/abort criteria:** <what signal pauses the sunset — e.g. a blocking dependency or contractual conflict surfaces> → re-open Sunset_Decision.md / DEC-<nn>.

## 6. Gate — G10 · End-of-Life (plan-side checks)
<!-- Full G10 decision is recorded in Sunset_Decision.md §7; these confirm the PLAN is executable. -->
- [ ] Runway estimated **then doubled**; no abrupt 30-day kill; developer surface has a generous window.
- [ ] Quality + support maintained **through** the runway (not cut at announce).
- [ ] 5-7 touchpoints scheduled, multi-channel, each stating why/timeline/migration path.
- [ ] Export + **automated erasure** planned (backups/test/dev in scope); each obligation an `RSK-*`.
- [ ] Contracts/SLAs reconciled; Support/Sales/Finance/Legal briefed.

---
*Owning skill:* **pm-phase-16-sunset** · *Companions:* **Sunset_Decision.md** (the why + G10 verdict) · **Migration_Comms.md** (per-segment message drafts) ·
*Conventions:* ../05_Conventions.md
