---
Document: User Stories — <Product / Feature>
Document ID: US-<PRODUCT_SLUG>-v0.1
Status: Draft
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!-- Phase 09 · owned by skill `pm-phase-09-stories`. Conforms to ../05_Conventions.md
     (IDs `US-`/`AC-` §3, traceability spine §4, severity §5, frontmatter §6, outcomes §7).
     A story is a PLACEHOLDER FOR A CONVERSATION (3 C's: Card / Conversation / Confirmation),
     not a spec. INVEST is the refinement bar (a checklist, not a gate). Slice VERTICALLY —
     no frontend/backend/technical-layer stories. AC co-authored by the Three Amigos
     (PM + design + eng/QA) just-in-time, before dev.
     Sibling templates: Story_Map.md · DoR_DoD.md. -->

> *How to use:* copy a `## US-` block per story; replace every `<ANGLE_BRACKET>` or mark `TODO:`.
> Every story must trace UP to an `OPP-`/`OBJ/KR-` and its DoD must point to a `MET-` — a story
> with no outcome line is feature-factory output; refuse it or flag the gap (Conventions §7).

## 1. Context & traceability
| Field | Value |
|---|---|
| Feature / epic | `FEAT-<nn>` — <title> |
| Roadmap item (Now) | `RMI-<nn>` |
| Outcome targeted | `OBJ-<nn>` / `KR-<nn>` → `MET-<nn>` |
| PRD requirements in scope | `REQ-<class>-<nn>`, … <!-- class ∈ F/U/P/O/SEC/C, Conventions §3.4 --> |
| Story map | **Story_Map.md** (`MAP-<PRODUCT_SLUG>`) |

## 2. Story index
<!-- One row per US-. MoSCoW maps to priority (Conventions §5.2). Size = S/M/L or a
     #NoEstimates right-sizing tag — never report points as a KPI (see DoR_DoD.md §3). -->

| ID | Title | Traces (FEAT/REQ/OPP) | MoSCoW | Size | Slice | Status |
|---|---|---|---|---|---|---|
| US-01 | <short title> | FEAT-__ · OPP-__ | Must | <S/M/L> | Release 1 | Draft |
| US-02 | <short title> | FEAT-__ · REQ-F-__ | Should | <S/M/L> | Release 2 | Draft |
| US-__ | TODO: | TODO: | <M/S/C> | — | — | Draft |

---

## US-01 — <short title>
**As a** `PER-<nn>` **I want** `<capability>` **so that** `<OBJ/KR-<nn> outcome>`.
<!-- Real researched persona + a benefit phrased as an OUTCOME, not a feature restatement. -->

- **Traces:** `FEAT-<nn>` · `REQ-<class>-<nn>` · `OPP-<nn>` · `MET-<nn>` · **slice:** Release 1 (MVP)
- **Size:** `<S/M/L or #NoEstimates flow>`  ·  **MoSCoW:** `<Must/Should/Could>`
- **Conversation notes:** *<the shared understanding from the Three Amigos — the real deliverable>*

**Acceptance criteria** *(scoped to this US; declarative Given/When/Then — what, not how)*
- **AC-01** — **Given** `<context>` **When** `<action>` **Then** `<observable outcome>`.
- **AC-02** — *(negative)* **Given** `<invalid/empty input>` **When** `<action>` **Then** `<safe failure + clear message>`.
- **AC-03** — *(boundary)* **Given** `<limit/edge value>` **When** `<action>` **Then** `<defined behavior at the edge>`.
- **AC-04** — *(error/empty state)* **Given** `<no data / failure>` **When** `<view/action>` **Then** `<graceful empty/error state>`.
- **AC-05** — *(accessibility)* `<WCAG 2.2 AA criterion — keyboard, focus, contrast, label>` — TODO: confirm WCAG target/version.
- **AC-06** — *(privacy/security)* `<consent / data-handling / authZ / OWASP case>` — TODO: confirm binding rule.

<!-- Forced unhappy paths: negative · boundary · error/empty · a11y (WCAG 2.2) · privacy/security.
     AI may PROPOSE missing edge cases — validate each against real behavior; AI suggestions
     are hypotheses, not coverage (Conventions §11). -->

---

## US-02 — <short title>
**As a** `PER-<nn>` **I want** `<capability>` **so that** `<OBJ/KR-<nn> outcome>`.

- **Traces:** `FEAT-<nn>` · `REQ-<class>-<nn>` · `OPP-<nn>` · `MET-<nn>` · **slice:** Release 2 (Next)
- **Size:** `<S/M/L>`  ·  **MoSCoW:** `<Must/Should/Could>`
- **Conversation notes:** *<shared understanding>*

**Acceptance criteria**
- **AC-01** — **Given** `<context>` **When** `<action>` **Then** `<observable outcome>`.
- **AC-02** — *(negative / boundary / a11y / privacy)* TODO: add unhappy-path AC.

---

<!-- Duplicate the US- block per story. AC- numbering RESTARTS within each story (AC- is scoped
     to its US-, Conventions §3.2). IDs are stable for life — never renumber; retire with
     "(deprecated)". -->

## Splitting oversized stories (SPIDR / Humanizing Work)
<!-- If a story isn't Small/Estimable or spans a whole epic, split it — keep each slice
     vertical, valuable, demoable. NEVER split into frontend/backend tasks. -->
- **S**PIDR patterns: **S**pike · **P**aths (happy vs. error) · **I**nterfaces (UI variations) · **D**ata (data variations) · **R**ules (business-rule variations); plus **workflow steps**.
- Record each split as a `DEC-<nn>` in `_threads/Decision_Log.md`.

## INVEST refinement bar *(checklist, not a gate)*
- [ ] **I**ndependent — can ship without waiting on another story.
- [ ] **N**egotiable — a conversation starter, scope is flexible.
- [ ] **V**aluable — observable user/business value (vertical slice).
- [ ] **E**stimable — team understands it enough to size/right-size.
- [ ] **S**mall — fits comfortably in a sprint/flow.
- [ ] **T**estable — has clear, confirmable `AC-`.

## Links
- Map & slices → **Story_Map.md** · Readiness/done bar → **DoR_DoD.md**
- Upstream spec → **PRD.md** / **NFR_Checklist.md** (Phase 08)
- Downstream build → **Sprint_Plan.md** / **Delivery_Plan.md** (Phase 10)
- Instrumentation of `MET-` → **Measurement_Plan.md** / **Tracking_Plan.md** (Phase 12)
- Owning skill → `pm-phase-09-stories` · Conventions → `../05_Conventions.md`
