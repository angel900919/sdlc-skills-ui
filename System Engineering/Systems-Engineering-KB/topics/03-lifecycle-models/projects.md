# System Lifecycle Models — Projects

These projects are Apply-level: the central deliverable is a *justified model selection*, grounded in the source's domains (source: m1-lifecycle).

## Guided project — Model-selection memo for three systems

**Goal:** Produce a one-page **lifecycle-model selection memo** that recommends and justifies a model for three different systems.

**Scenario systems (drawn from / inspired by the source's worked examples):**
1. A **commercial aircraft** (stable, regulated requirements; costly late change).
2. A **smart door lock** (phone + keypad unlock, auto-lock after 30s, tamper alerts) where each level must be verified.
3. A **mobile fitness tracker** whose features will evolve with user feedback.

**Requirements (what the memo must contain):**
- For each system: the **chosen model**, plus a justification citing requirements stability, risk profile, and feedback needs.
- For the chosen model of system 2, the **design↔test pairing table** (the four V-Model pairs).
- A short note on whether any system warrants **blending** models.

**Suggested steps & "done" criteria per checkpoint:**

| Checkpoint | Do | Done when |
|---|---|---|
| M1 — Characterize | For each system, write one line on requirements stability, dominant risk, and feedback cadence | Three characterizations written |
| M2 — Select | Match each system to Waterfall / V-Model / Spiral / Agile | A model named for each, no two justifications identical |
| M3 — Justify | Tie each choice to a model property from the source | Each justification names a specific property (e.g. "low flexibility," "risk analysis each cycle") |
| M4 — V-Model detail | Fill the four design↔test pairs for the smart door lock | Module/software/system/requirements rows complete |
| M5 — Blend check | Decide if any system benefits from blending; cite the source's blending note | A yes/no with one-sentence reason |

## Independent (challenge) project — End-to-end iterative build plan

**Goal:** For a system *you* choose where requirements are genuinely uncertain (e.g. a community-events mobile app, a home-energy dashboard), produce a **two-cycle iterative development plan** using either Spiral or Agile, plus a one-paragraph defence of why you picked that model over the other three.

**Constraints only (no steps given):**
- The plan must show **two complete cycles**. If Spiral: each cycle runs Planning → Risk Analysis → Engineering → Evaluation, and Cycle 1's evaluation feedback must explicitly set Cycle 2's goal. If Agile: each iteration runs Planning → Development → Testing → Review & Retrospective, delivering a working increment.
- Each cycle must end with concrete **feedback** that changes the next cycle's scope.
- The defence must rule out Waterfall and the V-Model with reasons specific to your system's requirements stability and risk.
- Cumulative tie-in: state which test types from [16-verification-validation-methods](../16-verification-validation-methods/README.md) you'd run, and how change between cycles is governed per [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md).

## Build notes & solution sketch

**Architecture of a good selection memo.** Drive every recommendation from three source-grounded axes: *requirements stability* (stable → Waterfall/V; evolving → Agile), *risk* (a dominant feasibility unknown → Spiral's per-cycle risk analysis), and *feedback needs* (frequent user feedback → Agile sprints) (source: m1-lifecycle).

**Key decisions and why.**
- Aircraft → **Waterfall**: stable, regulated requirements, costly late change — the source's own example (source: m1-lifecycle).
- Smart door lock → **V-Model**: you want verification paired to each design level (module↔unit, software↔integration, system↔system, requirements↔acceptance) (source: m1-lifecycle).
- Fitness tracker → **Agile**: evolving features and continuous user feedback are Agile's strength (source: m1-lifecycle).

**The hard parts.**
- *Avoid one-size-fits-all justifications.* The discriminator is which property of the system (stability vs risk vs feedback) dominates — name it explicitly (source: m1-lifecycle).
- *For the iterative plan,* the most common failure is cycles that don't actually feed forward. Make Cycle 1's feedback the literal input to Cycle 2's planning, exactly as Spiral 1's "add 2FA and transaction history" became Spiral 2's plan (source: m1-lifecycle).
- *Blending:* don't over-claim. The source supports blending Waterfall with the V-Model for risk management; cite that rather than inventing arbitrary hybrids (source: m1-lifecycle).
