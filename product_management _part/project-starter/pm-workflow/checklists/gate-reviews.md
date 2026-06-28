# Gate Reviews — the decision criteria

> The single home for what each gate **requires** before you advance. Each phase skill's *Exit-gate checklist* is a copy of its gate block here; if they ever disagree, **this file wins** ([Conventions §2](../05_Conventions.md)). A gate is a **decision, not a formality** — the AI runs these as a real review and recommends *Persevere · Persevere-with-actions · Pivot · Hold · Kill* ([AI PM Protocol §6](../02_AI_Product_Manager_Protocol.md)).

## How to run a gate

1. **Walk the checklist** for the gate below. Every box is checked, `TODO`'d with an owner+date, or explicitly waived (recorded).
2. **Review the six threads** (the *every-gate* block) — open risks, decisions, discovery cadence, metric health, responsible-product checks.
3. **Decide** — one of the five outcomes, with the evidence. Log it in `WORKFLOW.md`'s gate log and `_threads/Decision_Log.md` (`DEC-*`).
4. **Name the next command** — the phase skill to run next.

> **Pivot and Kill are wins when the evidence supports them.** A gate that always says "Persevere" is theatre. The cheapest failed build is the one a gate stopped.

---

## Every gate (the six-thread review)

Reviewed at **every** G0–G10 before any phase-specific check:

- [ ] **Stakeholders** — key decisions since last gate logged (`DEC-*`); no unmanaged misalignment; sponsor still bought in.
- [ ] **Continuous Discovery** — customer-contact cadence kept; new `INS-*`/`OPP-*` captured; no decision resting on zero evidence.
- [ ] **Metrics & Experimentation** — North Star + inputs current; every new bet has a `MET-*`; guardrails defined.
- [ ] **Product Ops** — artifacts current and in the source of truth; no critical process debt blocking the team.
- [ ] **Responsible Product** — privacy/accessibility/security/ethics re-checked against this phase's scope change; new `RSK-*` logged. **The floor is non-negotiable.**
- [ ] **Portfolio** *(multi-product)* — this bet's place in the portfolio and lifecycle stage still valid.

---

## G0 — Kickoff *(owner: P00 Charter)*
- [ ] Product/initiative named; slug + folder created; stage and tailoring profile set ([Tailoring Guide](../04_Tailoring_Guide.md)).
- [ ] Mandate clear: problem space, target segment, sponsor, and the team (esp. the product trio).
- [ ] Success defined at the mandate level (what outcome would make this worth doing?).
- [ ] Operating cadence chosen (continuous/dual-track, Scrum, Kanban, Stage-Gate) and tooling/source-of-truth set.
- [ ] Initial stakeholder map (`STK-*`) with influence/interest; decision rights named (RACI for the big calls).

## G1 — Strategy Sign-off *(owner: P01 Strategy)*
- [ ] Vision is outcome-driven (a world-once-you've-won, not a feature list) and stakeholder-approved.
- [ ] Strategy passes the Rumelt test: a real **diagnosis**, a **guiding policy**, and **coherent actions** — not a list of goals/fluff.
- [ ] One **North Star Metric** (a value-exchange metric, not vanity) with 2–4 input metrics named.
- [ ] 1–3 **Objectives** with measurable **Key Results** (`OBJ-*`/`KR-*`); they express outcomes, not outputs.
- [ ] Explicit **what we're NOT doing** (the strategic trade-offs).
- [ ] Leadership signed off; strategy is coherent with any portfolio/company strategy.

## G2 — Problem Validated *(owner: P03 Discovery)*
- [ ] ≥5 customer conversations in the target segment this cycle (continuous-discovery cadence live).
- [ ] The problem/job is described in customers' words and grounded in **past behaviour**, not hypotheticals.
- [ ] Insights captured as `INS-*`; personas (`PER-*`) and/or JTBD (`JOB-*`) traced to real research, not invented.
- [ ] Evidence that the problem is **real, frequent/painful, and valuable** to solve — for a defined segment.
- [ ] Confirmation bias checked: disconfirming evidence sought; the AI red-teamed the conclusion.
- [ ] No solution committed yet (problem space only).

## G3 — Opportunity Go/No-Go *(owner: P04 Opportunity)*
- [ ] Opportunity placed on the **Opportunity Solution Tree** under a desired outcome (`OPP-*` → `OBJ/KR`).
- [ ] Opportunity sized (reach × value) with stated assumptions; not a TAM-as-forecast error.
- [ ] The **four big risks** named and rated: value/desirability, usability, feasibility, business-viability (+ ethics).
- [ ] Business case / ROI sketched at the right rigour for the tailoring profile; viability addressed.
- [ ] A clear **Go / No-Go / Pivot** decision, with what would change the call.

## G4 — Roadmap Commit *(owner: P05 Roadmap)*
- [ ] Roadmap is **Now/Next/Later** (or themes/outcomes), **not** a dated feature Gantt.
- [ ] Every Now item ties to an `OBJ/KR` and an `OPP-*`; uncertainty communicated (confidence decreases Now→Later).
- [ ] Capacity sanity-checked against the team; dependencies (`DEP-*`) surfaced.
- [ ] Stakeholders understand it's a statement of **intent and outcomes**, not a contract of dates.

## G5 — Solution Validated *(owner: P07 Solution Design)*
- [ ] Riskiest assumptions (`ASM-*`) listed and the **most dangerous** ones tested (not the easiest).
- [ ] Evidence the solution is **desirable** (customers want it), **usable** (they can use it — usability tested), **feasible** (eng confirms), **viable** (business/legal works) — and **ethical**.
- [ ] Prototype/test results recorded in `Solution_Validation.md`; failed assumptions triggered a Pivot, not a cover-up.
- [ ] MVP / first-slice scope is the smallest thing that delivers the outcome and produces learning.

## G6 — PRD Approved / Build Entry *(owner: P08 PRD)*
- [ ] Problem, target user, and the **outcome/success metric** are stated up top and trace to an `OPP-*`/`OBJ`.
- [ ] Scope is explicit: in / out / later (MoSCoW); the MVP line is held.
- [ ] **Non-functional requirements** answered (performance, reliability, accessibility/WCAG, privacy/security, compliance) — one line each, even if "N/A, because…".
- [ ] Open questions and dependencies listed; eng + design + key stakeholders have reviewed and approved.

## G7 — Backlog Ready *(owner: P09 Stories)*
- [ ] Story map exists; a coherent end-to-end slice is identified.
- [ ] Top stories meet **Definition of Ready**; each is **INVEST** and has testable **acceptance criteria** (`AC-*`, Given/When/Then where useful).
- [ ] **Definition of Done** agreed and includes instrumentation + the outcome metric link.
- [ ] Estimates/sizing or explicit #NoEstimates flow agreed; first sprint(s) plannable.

## G8 — Release Readiness (Go/No-Go) *(owner: P10 Delivery)*
- [ ] Acceptance criteria met for the release scope; **zero open S1/S2** (or explicitly waived with rationale).
- [ ] Quality verified (functional + non-functional); accessibility + privacy checks done.
- [ ] **Instrumentation live** (the `MET-*` will actually be measurable) and dashboards ready.
- [ ] **Rollback / kill-switch** in place (feature flag or equivalent); on-call/support briefed.
- [ ] Risk register (`RSK-*`) reviewed; no unmitigated high/critical risk.

## G9 — Launch Decision (GA) *(owner: P11 Launch & GTM)*
- [ ] **Launch tier** chosen and rollout plan set (default: staged % rollout, not big-bang).
- [ ] GTM ready: positioning, messaging, pricing/packaging (if applicable), and **partner teams enabled** (PMM, Sales, Support, Success, Legal/PR as needed).
- [ ] Success metrics + **guardrail metrics** defined with thresholds that would trigger rollback.
- [ ] Comms ready (internal + external as applicable); support/docs in place.
- [ ] Legal/privacy sign-off where required; on-call confirmed for launch window.

## G10 — End-of-Life *(owner: P16 Sunset)*
- [ ] Retirement justified (low value/usage vs. cost, strategic shift) — sunk cost explicitly set aside.
- [ ] Affected customers/segments identified; **migration path** or alternative offered; comms timeline set.
- [ ] Data handled responsibly: retention, export, and **deletion/erasure** obligations met (GDPR/CCPA where applicable).
- [ ] Contracts/SLAs/legal commitments checked; internal teams (Support, Sales, Finance) informed.
- [ ] Knowledge captured (what we learned); the decision logged (`DEC-*`).

---

## Gate decision log shape

Record each gate decision (in `WORKFLOW.md` and `_threads/Decision_Log.md`):

| Date | Gate | Decision | Open actions (owner · due) | Evidence / notes |
|---|---|---|---|---|
| `<YYYY-MM-DD>` | `<G3>` | `<Persevere-with-actions>` | `<size SOM — PM · +1wk>` | `<5 interviews; OST node OPP-04>` |
