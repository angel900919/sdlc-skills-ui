---
Document: Migration Comms — <PRODUCT/FEATURE/API_NAME>
Document ID: MIGCOMMS-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!--
TEMPLATE — Phase 16 · Product Sunset & Retirement. Owning skill: pm-phase-16-sunset.
Conforms to ../05_Conventions.md (§2 gate G10 · PER/STK/DEC referenced · §6 frontmatter · §7 outcomes-over-outputs).
This file holds the ACTUAL message drafts. The schedule (which touchpoint, when, which channel) lives in
Deprecation_Plan.md §2; the decision rationale lives in Sunset_Decision.md.
Framework anchor (§8 + Research Pack §17): 5D Sunset Strategy — DECLARE (transparent customer comms).
Every message must answer: WHY · TIMELINE · MIGRATION PATH (the destination, not just the exit).
BLUF for execs and internal teams. Tailor per segment. Be transparent and human — avoid abrupt/legalistic notices.
Fill every <ANGLE_BRACKET> / TODO: or delete the block. Don't ship placeholder dates.
-->

# Migration Comms — <PRODUCT/FEATURE/API_NAME>

## Comms principles (read before drafting)
<!-- Communication is the single biggest determinant of a clean sunset (Research Pack §17). -->
- **Transparent:** say *why* plainly; don't bury the lede or hide the EOL date.
- **Destination, not just exit:** every message links the migration path / alternative / export.
- **Consistent dates everywhere:** EOL `<YYYY-MM-DD>`; mirror the timeline in Deprecation_Plan.md §1.
- **Tailored per segment:** self-serve gets product+email; high-value gets a human (T3); developers get headers+docs.
- **Right tone:** appreciative, not defensive; sunset is portfolio hygiene, not an apology.

## Core message (the reusable spine — slot into every touchpoint)
| Slot | Fill |
|---|---|
| What's changing | <product/feature/API> will be retired. |
| Why | <1-2 honest sentences: low usage/value vs. cost · superseded by <X> · strategic focus>. |
| Key dates | Announce `<YYYY-MM-DD>` · Read-only `<YYYY-MM-DD>` · **EOL `<YYYY-MM-DD>`**. |
| What to do | <migrate to <destination> · export your data by <date> · contact <who>>. |
| Migration path | <link to guide> · <self-serve steps OR "we'll help you">. |
| Data | <export format/window> · <what we retain and for how long, then delete>. |
| Help | <support channel · office hours · CSM contact>. |

## Touchpoint drafts (5-7; mirror Deprecation_Plan.md §2)
<!-- Draft each touchpoint below. Keep ≥5. Reuse the core message spine; vary emphasis by stage. -->

### T1 — Initial announcement *(channels: email · in-app banner · docs · status page)*
> **Subject:** <Important: <feature> will be retired on <EOL date>>
>
> <Greeting>. We're retiring **<feature>** on **<EOL date>**. <Why — 1-2 sentences.>
> **What this means for you:** <impact>. **What to do:** migrate to **<destination>** — <link>.
> You can export your data until **<export-close date>**: <link>. Questions? <support/contact>.
> <Sign-off — appreciative.>

### T2 — Why & migration guide *(channels: blog/changelog · docs · dev portal)*
> <Longer-form: the reasoning, what's replacing it, side-by-side mapping old→new, FAQ link.>
> **Developer note (if API):** `<v1>` now returns a `Deprecation: <date>` header; `Sunset: <date>` from <wind-down>. Migrate to `<v2/endpoint>` — <migration guide link>.

### T3 — High-touch account outreach *(channels: 1:1 CSM/AE call + personalized email)*
<!-- For high-value / high-dependence accounts (PER-<nn>). Personal, assisted, early in the runway. -->
> Hi <name>, reaching out personally because your team relies on **<feature>**. <Why>. We want to make your move to **<destination>** smooth — <offer: assisted migration / dedicated window / migration call>. Proposed plan: <…>. Can we set up <call> this week?

### T4 — Mid-runway reminder + progress *(channels: email · in-app)*
> Reminder: **<feature>** retires on **<EOL date>** (<n> weeks left). <If not migrated:> here's how to move: <link>. <If migrated:> nothing more to do — thank you.

### T5 — Read-only / final-call notice *(channels: email · banner · `Sunset` header)*
> **<feature> is now read-only.** New <sign-ups/data/keys> are disabled. Full shutdown on **<EOL date>**. Export your data and finish migrating: <link>.

### T6 — Last-chance + export reminder *(channels: email · in-app modal)* — *optional, recommended for high-stakes*
> **<n> days left.** After **<EOL date>**, <feature> and its data will no longer be accessible <per our retention policy>. Export now: <link>. Need help? <contact>.

### T7 — Shutdown confirmation + thanks *(channels: email · status page)* — *optional*
> **<feature> has been retired.** Thank you for using it. Your path forward: <destination / link>. <Data note: what was deleted / retained and for how long.>

## Internal briefs (BLUF — brief BEFORE the external announcement)
<!-- Stakeholders thread (STK-*). Each team needs answers + a script before customers ask. Log the call as DEC-* in _threads/Decision_Log.md. -->
- **Support:** <one-paragraph BLUF> · macros/FAQ link · escalation path for migration friction · who owns exceptions.
- **Sales / CSM:** <BLUF> · talk-track · grandfathering/exception rules · at-risk-account list (high-dependence PER-<nn>).
- **Finance:** <BLUF> · billing/proration changes · contract/SLA impacts · revenue effect.
- **Legal / Privacy:** <BLUF> · contract obligations honored to <date> · data retention/erasure plan (→ Deprecation_Plan.md §3, RSK-<nn>).
- **Leadership:** <BLUF> · capacity freed → <outcome funded> (Sunset_Decision.md §5).

## Customer FAQ (publish with T1/T2)
<!-- Pre-empt the predictable questions; keep answers transparent. -->
- *Why are you retiring this?* — <honest why>.
- *What do I use instead?* — <destination + migration link>.
- *What happens to my data?* — <export window + retention + deletion>.
- *I'm on a contract that covers this — what now?* — <grandfathering / honor-to-date / contact>.
- *(API) Which versions/endpoints are affected and when?* — <table; headers; cutover dates>.
- *Who do I contact for help?* — <channel / migration office hours>.

## Comms log & approvals
| Touchpoint | Drafted | Approved by (Legal/Brand/PM) | Sent date | Channel | Notes |
|---|---|---|---|---|---|
| T1 | <Y/N> | <name / TODO:> | <YYYY-MM-DD> | <…> | <…> |
| T3 | <Y/N> | <…> | <…> | 1:1 | <accounts covered> |

## Gate — G10 · End-of-Life (comms-side checks)
<!-- Full G10 verdict recorded in Sunset_Decision.md §7. -->
- [ ] 5-7 touchpoints drafted; each states why · timeline · migration path.
- [ ] High-touch accounts have a personal (T3) outreach, not just a mass email.
- [ ] Dates consistent with Deprecation_Plan.md §1; no abrupt single-notice kill.
- [ ] Internal teams (Support/Sales/Finance/Legal) briefed **before** external send.
- [ ] Legal/brand approval captured in the comms log.

---
*Owning skill:* **pm-phase-16-sunset** · *Companions:* **Sunset_Decision.md** (the why + G10 verdict) · **Deprecation_Plan.md** (timeline + touchpoint schedule + data/legal) ·
*Conventions:* ../05_Conventions.md
