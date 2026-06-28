---
Document: Definition of Ready & Definition of Done — <Product / Feature>
Document ID: DORDOD-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!-- Phase 09 · owned by skill `pm-phase-09-stories`. Conforms to ../05_Conventions.md
     (frontmatter §6, severity §5, traceability §4, outcomes-over-outputs §7).
     AC = per-story behavior (lives in User_Stories.md). DoR/DoD here are CROSS-story bars —
     keep them distinct from AC. Agreed by the team (Three Amigos), not imposed.
     Sibling templates: Story_Map.md · User_Stories.md. -->

> *How to use:* tune both lists with the delivery team, then make them the shared, visible
> contract for *every* story in this backlog. Replace `<ANGLE_BRACKETS>` / `TODO:`. The DoD
> **must** include instrumentation + the outcome-metric link — "done" is a moved `MET-`, not a
> closed ticket (Conventions §7).

## 1. Definition of Ready (DoR) — a light readiness *conversation*, not a gate
<!-- 2026 caution: a STRICT, gated DoR is an anti-pattern that stalls flow. Use this as a
     "are we ready to discuss/pull this?" prompt, right-sized to the tailoring profile —
     never as a rigid hand-off contract. A story can enter a sprint with open questions. -->

A story is *ready enough* to pull when, by team agreement:
- [ ] **Valued & traced** — value is clear and it traces to an `OPP-`/`OBJ-`/`KR-` (Conventions §4).
- [ ] **Understood** — the Three Amigos share the intent (the conversation, not just the card).
- [ ] **Testable** — at least the happy-path `AC-` is drafted (Given/When/Then where it adds clarity).
- [ ] **Right-sized** — small enough to flow; split with SPIDR if not (see User_Stories.md).
- [ ] **Dependencies known** — blocking `DEP-`/`RSK-` are named (not necessarily resolved).
- [ ] **Persona is real** — `PER-` is research-backed; if invented → `TODO:` + route to `pm-phase-03-discovery`.

> *Keep it a conversation.* If items are perpetually "not ready," fix refinement cadence —
> don't harden the DoR into a gate.

## 2. Definition of Done (DoD) — the quality bar for the Increment
<!-- Cross-story; applies to EVERY story. This is where outcomes-over-outputs is enforced. -->

A story / increment is **Done** when:

### 2.1 Build & quality
- [ ] All `AC-` for the story pass (incl. negative · boundary · error/empty paths).
- [ ] Code reviewed, merged; automated tests added/green; no new **S1/S2** defects open (Conventions §5.1).
- [ ] Meets in-scope NFRs from the PRD (`REQ-U/P/O/SEC/C-<nn>`) — performance/reliability within target.

### 2.2 Instrumentation + outcome-metric link  *(non-negotiable — Conventions §7)*
- [ ] **Events/properties shipped** per the Tracking Plan so behavior is measurable in production.
- [ ] **Outcome metric wired** — the slice reports into `MET-<nn>` (its `OBJ/KR-<nn>`); baseline + target stated, or `MET-TBD` resolved with Phase 12.
- [ ] **Verified in analytics** — the event is firing and visible on the relevant dashboard/`KPI_Scorecard`.

### 2.3 Responsible-product floor *(applies even to the smallest product)*
- [ ] **Accessibility** — `<WCAG 2.2 AA>` checks pass (keyboard, focus, contrast, labels). TODO: confirm target.
- [ ] **Privacy/consent** — data handling, consent, retention honored (GDPR/applicable rule). TODO: confirm.
- [ ] **Security** — authN/Z + relevant OWASP cases covered; no new `SEC` gap.

### 2.4 Releasable
- [ ] Docs/help/release notes updated as needed; feature flag / rollback path in place.
- [ ] Demoable end-to-end (vertical slice); product owner accepts.

## 3. Sizing & flow agreement
<!-- Right-sizing + flow > velocity theater (Conventions §7, 2026 shift). -->
- **Method:** `<story points (S/M/L) | #NoEstimates right-sizing | other>` — TODO: agree with team.
- **Forecasting:** prefer **Monte Carlo over throughput / flow metrics (Little's Law)** for "when."
- **Guardrails:** never normalize points across teams or report points as a KPI; don't equate points with hours.

## 4. Change & governance
- This DoR/DoD is **team-owned**; revisit at retro. Changes logged as `DEC-<nn>` in `_threads/Decision_Log.md`.
- Bump version per Conventions §6 (minor for edits; major on re-approval).

## 5. Links
- Stories & AC → **User_Stories.md** · Map & slices → **Story_Map.md**
- NFRs in scope → **NFR_Checklist.md** / **PRD.md** (Phase 08)
- Instrumentation & metric → **Tracking_Plan.md** / **Measurement_Plan.md** / **KPI_Scorecard.md** (Phase 12)
- Responsible floor → **../cross-cutting/Responsible_Product.md**
- G7 gate → **../checklists/gate-reviews.md** · Owning skill → `pm-phase-09-stories` · Conventions → `../05_Conventions.md`
