---
Document: Runbook RB-03 — Groundedness / Hallucination Regression
Document ID: RB-ARIA-03-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (Operation) · IEEE 1012-2016
Status: Draft
Owner: AI/ML Operations (STK-08)
---

# RB-03 — Groundedness / hallucination regression

**Trigger:** `SLO-09` < 90 % (threshold) on the live-sampled groundedness eval — substantive responses whose asserted facts are no longer all backed by a returned citation, or a fabricated entity appears.
**Linked:** SLO-09 · REQ-P-05 · REQ-F-06 · REQ-F-04 · MOP-04 · TPM-01 · RSK-03 · CR-TBD (Phase 09)
**Default severity:** **S2** (Major) by default; escalate to **S1** if hallucinated content was drafted *into* a proposed write that a user could confirm (RSK-03 path).

- **Symptom** — Groundedness panel (Trust dashboard) crosses below 90 %; or rising "ungroundable claim flagged/withheld" rate; or user reports of invented facts/contacts in summaries (REQ-F-04) or drafts.
- **Triage** — Open the eval stream → bucket failures by task class and model tier (`SLO-08` routing): is the drop global (model/prompt change) or scoped to one tier/connector (retrieval gap)? Correlate with the most recent model/prompt `CR-*` and deploy cohort (§8) — if a candidate is mid-rollout, this is the eval gate catching drift (RSK-07). Check RAG retrieval health (USE on the index): empty/stale retrievals produce ungrounded answers. Severity: S2, or S1 if hallucination entered a write proposal.
- **Mitigation** — If correlated with a model/prompt cohort: **auto-rollback should have fired** (§8) — verify and force rollback of that bundle (model id + prompt hash + allow-list hash) if not. If retrieval-side: fail the affected connector's RAG path closed (Aria withholds/flags ungroundable claims per REQ-F-06 rather than inventing) and rebuild the index shard. Tighten the citation-required gate so unsupported claims are withheld, not shown.
- **Resolution** — Restore `SLO-09` ≥ 95 % target on a full eval-regression run (§5.1) before re-promoting any candidate. For a retrieval fix, confirm citations resolve on the synthetic groundedness probe.
- **Post-incident trigger** — If S1 (hallucination reached a write proposal) or a sustained S2: PIR + **loop-back `CR-*`** via Phase 09 to strengthen REQ-P-05/REQ-F-06 grounding criteria and expand the groundedness eval set with the failing cases; update TPM-01 margin in `TPM_Tracker.md`.
