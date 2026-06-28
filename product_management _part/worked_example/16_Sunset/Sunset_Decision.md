---
Document: Sunset Decision — Cadence Video Summary (FEAT-09)
Document ID: SUNSET-cadence-feat09-v1.0
Status: Approved (G10-approved 2026-09-30)
Owner: Product Manager
Updated: 2026-09-30
---

# Sunset Decision — Video Summary (FEAT-09)

> Example artifact. Per [`templates/Sunset_Decision.md`](../../templates/Sunset_Decision.md); skill [`pm-phase-16-sunset`](../../skills/pm-phase-16-sunset/).

## Decision
**Retire FEAT-09 (auto video-summary of standups)** — a feature shipped as an experiment that never found its job. Verdict: **Kill** (DEC-07, G10 2026-09-30).

## Why (sunk cost set aside)
- **Usage:** < 1.5% of active teams used it in any 30-day window; recurring "what is this?" confusion (FB-03).
- **Cost:** transcoding + storage is the product's largest variable cost line; PII-heavy (raw audio/video) → outsized privacy/retention burden.
- **Strategy fit:** **off-strategy** — Cadence reduces meetings; video re-introduces a meeting-shaped artifact (Strategy §5 non-goal; Roadmap "deliberately NOT now"). Sunk build cost is irrelevant to the forward decision.

## Plan (responsible sunset)
- **Timeline:** 60-day runway (estimate, then doubled the initial guess); maintain quality during runway.
- **Comms:** 5 touchpoints (in-app banner, email ×2, changelog, support macro) — transparent why + date + alternative.
- **Migration / alternative:** point users to the text digest (the core value) + one-click export of existing summaries.
- **Data:** delete stored video/audio on EOL per **GDPR retention/erasure**; remove from backups within the documented window; log the deletion (auditable).
- **Internal:** Support, Sales, Finance informed; contracts/SLAs checked (no enterprise commitment to this feature).

## Close the loop
Post-sunset retro: capture *why we shipped an off-strategy experiment* as a lesson (gate discipline). Reallocate the freed capacity to OPP-02 (searchable notes). Logged: **DEC-07**.
