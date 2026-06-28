---
Document: Runbook RB-04 — Upstream Connector Down / Degraded
Document ID: RB-ARIA-04-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation) · IEEE 1012-2016
Status: Draft
Owner: Platform / SRE Lead (STK-07)
---

# RB-04 — Upstream connector down / degraded

**Trigger:** `SLO-04`/`SLO-05`/`SLO-06` — one of the four upstreams (Outlook/Graph, HubSpot, JIRA, Therefore) is erroring/rate-limiting; circuit breaker should isolate it within 30 s (REQ-O-03). Realises SCN-05.
**Linked:** SLO-04 · SLO-05 · SLO-06 · REQ-O-02 · REQ-O-03 · REQ-F-12 · REQ-INT-06 · MOP-08 · RSK-06 · CR-TBD (Phase 09)
**Default severity:** **S2** (Major — one source degraded) if graceful degradation holds; **S3** if a single account; **S1** only if degradation *cascades* and overall Aria availability (`SLO-04`) drops (the failure mode GD-1 guards against).

- **Symptom** — Connector Health dashboard shows one upstream red; affected dashboard panel should display the degraded-state indicator + last-known-good timestamp (REQ-F-12). Alert fires if the circuit breaker did **not** isolate within 30 s (`SLO-06`) or if `SLO-05` (non-dependent functions available) drops below 95 %.
- **Triage** — Confirm scope: is it the upstream itself (provider status/429 rate-limit) or Aria's connector? Verify the circuit breaker tripped and the other three systems render normally (degradation contained, not cascading). Check rate-limit headroom (REQ-INT-06) — a 429 storm may need backoff tuning, not failover. If chat continues for non-affected tasks and only the one panel is degraded, this is **nominal degraded behaviour** (S2/S3), not an outage.
- **Mitigation** — Let the circuit breaker hold; ensure the affected panel shows the degraded state and last-known-good timestamp (don't present stale data as live — REQ-INT-06). Queue or refuse-with-explanation writes to the down system (SCN-05). If the breaker failed to isolate, manually open it. For rate-limits, increase backoff / reduce poll frequency.
- **Resolution** — On upstream restoration the breaker auto-recovers without operator action (REQ-O-03); confirm the panel returns to live and reconciliation (`SLO-07`, REQ-O-04) catches up within 60 s. Replay any deferred writes only with the user's confirmation (no silent auto-write — REQ-F-09).
- **Post-incident trigger** — PIR only if degradation cascaded (S1) or the breaker failed to isolate within 30 s. If a cascade exposed a gap in REQ-O-02/-03 graceful-degradation behaviour → **loop-back `CR-*`** via Phase 09 and add/strengthen the chaos game day GD-1.
