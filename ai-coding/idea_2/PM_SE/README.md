# PM_SE — Lean Product & Systems Engineering

**One lean lifecycle taking a product — software, AI, hardware, or all three — from raw idea to retirement, for a solo developer or two-person team.** Lean PM is the chassis (shape and kill-discipline); Systems Engineering is the graft (the failure-prevention machinery Lean PM lacks), each stripped to its minimum viable mechanism. Covers AI products (hosted + local LLM, RAG, agents), IoT/Raspberry Pi/embedded devices, hardware+software hybrids, mobile apps, web dashboards, and plain software.

**PM_SE supersedes [`Lean_Product_Management/`](../product-management/Lean_Product_Management/) as the default methodology for new products.** The parent frameworks remain as escalation targets when the triggers below fire.

The design rule: **keep every artifact that forces a decision or prevents a named failure; drop everything that only informs.**

## Quick start (a new product in 5 steps)

1. **Create a product folder** (e.g. `products/<slug>/`) and copy [`templates/00_tracker.md`](templates/00_tracker.md) into it as `TRACKER.md`.
2. **Set the product-type row** in the tracker (software / AI / hardware / hybrid) — it decides which `[AI]`/`[HW]` blocks and conditional templates apply to you.
3. **Open [`PLAYBOOK.md`](PLAYBOOK.md) at Phase 0** and work the phases top to bottom.
4. **Copy each template only when its phase calls for it** — never in advance. Skipping one? `tailored out: <reason>` in the tracker — never silent.
5. **Decide every gate explicitly**, run the red-team prompt first, and log verdict + date. An unrecorded gate is a failed gate. KILL and PIVOT are wins.

## The lifecycle

```
 P0        P1           P2           P3            P4         P5              P6
 FRAME →   DISCOVER →   DESIGN   →   BUILD &   →   LAUNCH →   OPERATE     →   SUNSET
 (½ day)   (1–2 wks)    (1–2 wks)    PROVE         (1–2 wks)  & EVOLVE        (an
   │          │            │         (2–6 wks)        │       (continuous)    afternoon)
  G0         G1 ★         G2 ★          │            G4          G5              G6
 Frame     OPPORTUNITY   DESIGN        G3 ★        Launched   Health          Clean
 Check     GATE          FREEZE       SHIP-READY   & landed   Check           Exit
           ── ★ = never skip ──
```

**The never-skip spine** — seven checks that survive at any size:

1. **The G1 kill-filter** — one hard FAIL stops the line; a gate, not an average.
2. **Problem before solution** — SN needs + SCN scenarios signed off at G1 before any REQ exists.
3. **Ship-bar frozen before build** — what "good" means, written before code.
4. **Verification method at requirement birth** — T/I/A/D in the row, or the row isn't done.
5. **Interfaces pinned before both sides are built.**
6. **Eval vs the unchanged bar** + verification-matrix two-zero-rules + separate validation block at G3.
7. **Frozen things change only via re-baseline** — a logged change note, never a quiet edit.

Even a throwaway weekend spike does 2, 3, and 6 in miniature.

## What's inside

| Path | What it is |
|---|---|
| [`PLAYBOOK.md`](PLAYBOOK.md) | The step-by-step guide: per phase — objective, timebox, activities (`[AI]`/`[HW]` twins), exit gate, best practices, pitfalls. Plus the 5 threads and two quick-reference cards (AI + HW). |
| [`CONVENTIONS.md`](CONVENTIONS.md) | The contract: ID grammar, traceability spine, T/I/A/D, severity S1–S4, verdicts, freeze semantics, the release tuple. When anything disagrees with it, it wins. |
| [`AI_PROMPTS.md`](AI_PROMPTS.md) | 6 reusable prompts — the gate red-team IS your review board at n=1. |
| [`templates/00_tracker.md`](templates/00_tracker.md) | Where are we, what did each gate decide, what's deployed, what's tailored out. |
| [`templates/01_charter.md`](templates/01_charter.md) | Is this worth discovery time; budget box; risk & hazard trigger check. |
| [`templates/02_validation_log.md`](templates/02_validation_log.md) | Is the problem real: evidence, SN needs, SCN scenarios, 4-dimension feasibility verdicts. |
| [`templates/03_ai_feasibility.md`](templates/03_ai_feasibility.md) | *(AI only)* AI-or-not; baseline bar-to-beat; data legality; cost/outcome; local-LLM check. |
| [`templates/04_hw_feasibility.md`](templates/04_hw_feasibility.md) | *(HW only)* breadboard spike numbers; BOM @ 1/10/100; supplier/EOL; power; cert scan. |
| [`templates/05_opportunity_gate.md`](templates/05_opportunity_gate.md) | GO / GO-with-de-risk / PIVOT / KILL — the cheapest decision you'll ever make. |
| [`templates/06_spec.md`](templates/06_spec.md) | Strategy front matter, scope, flows, the REQ table with T/I/A/D at birth (+ AI/HW appendices). |
| [`templates/07_ship_bar.md`](templates/07_ship_bar.md) | What "good" and "done" mean — frozen before build; thresholds ≠ targets; unit economics. |
| [`templates/08_architecture.md`](templates/08_architecture.md) | One deployment diagram, THE interface table, trust boundaries, stack, NOT-using list. |
| [`templates/09_build_plan.md`](templates/09_build_plan.md) | *(HW or ≥3 pieces)* dependency-ordered increments, each with an observable exit signal. |
| [`templates/10_verification_matrix.md`](templates/10_verification_matrix.md) | Both halves of V&V: REQ-by-REQ evidence + stranger-beta scripts with pre-set numeric targets. |
| [`templates/11_launch_checklist.md`](templates/11_launch_checklist.md) | Staged ramp with per-stage Advance / Hold / Rollback; rehearsed rollback; release ≠ launch. |
| [`templates/12_runbook.md`](templates/12_runbook.md) | One page per operational task — real files before launch, not intentions. |
| [`templates/13_ops_review.md`](templates/13_ops_review.md) | Recurring health check: Continue / Iterate / Re-open / Sunset — verdict written even when Continue. |
| [`templates/14_incident_postmortem.md`](templates/14_incident_postmortem.md) | *(per incident)* why the gates let it through; loop closed before it closes. |
| [`templates/15_decision_log.md`](templates/15_decision_log.md) | The ADR ladder + the change-note block — the why behind every one-way door. |
| [`templates/16_risk_register.md`](templates/16_risk_register.md) | What could kill us, if/then/leading-to, ≤10 live rows (+ conditional hazard block). |
| [`templates/17_trial_brief.md`](templates/17_trial_brief.md) | *(per experiment)* pre-committed test of a change worth measuring. |
| [`templates/18_sunset_checklist.md`](templates/18_sunset_checklist.md) | The ordered teardown: export → wipe → revoke → cancel subscriptions LAST. |

## Right-sizing — is lean enough for your product?

PM_SE is calibrated for **low-to-moderate-stakes products**: reversible, humans in control. The charter's trigger check tests exactly this. **One trigger ⇒ tier up; in doubt ⇒ tier up.** PM_SE stays the floor — you add the parent's depth on top, you don't abandon the spine.

| Trigger | Escalate to |
|---|---|
| PII at scale / PHI / financial / biometric / children's data · regulated domain (hiring, lending, medical, insurance, legal, safety) | [AI Product Management Workflow](../product-management/AI%20Product%20Managemnet%20/AI_Product_Management_Workflow/) — data governance, formal evals, responsible-AI gates |
| AI acting autonomously on the world / decisions affecting non-consenting third parties | [AI Product Management Workflow](../product-management/AI%20Product%20Managemnet%20/AI_Product_Management_Workflow/) — red-teaming, oversight design |
| Safety-critical physical hardware (failure can injure) · external contract with formal acceptance | [System Engineering Workflow](../System%20Engineering/System_Engineering_Workflow/) — full Safety/RAMS thread, formal V&V, acceptance machinery |
| Team scale, multi-squad GTM, stakeholder programs | [Product Management Workflow](../product-management/Product_Management_Workflow/) |
| The pure-software original, pre-SE-graft (reference only) | [Lean Product Management](../product-management/Lean_Product_Management/) — superseded by PM_SE |

## Lineage — what each phase absorbs

| PM_SE phase | From Lean PM | From SE |
|---|---|---|
| P0 Frame | Phase 0 | Stage 00 Agreement (salvage: constraint + acceptance seeds, client-mode 3-liner, tailoring log, hw/sw/hybrid flag) |
| P1 Discover | Phase 1 Validate | Stage 01 Concept (SN needs, SCN scenarios incl. off-nominal + maintenance, stakeholder probe, 4-dimension feasibility) |
| P2 Design | Phase 2 Design (+ strategy one-pager as spec front matter) | Stages 02 Requirements + 03 Modeling (3 surviving diagrams) + 04 Architecture (ICD → interface table) + 05 Trade-off (ADR ladder) |
| P3 Build & Prove | Phase 3 Build | Stages 06 Integration + 07 Verification + 08 Validation |
| P4 Launch | Phase 4 Launch | Stage 10 ORR slice (runbooks real, SLO handoff, deployed==tagged, pull-the-plug test) |
| P5 Operate & Evolve | Phase 5 Operate & Grow | Stages 09 Change/Config (the change rule, release tuple) + 10 Operations (incident loop-closure) |
| P6 Sunset | Phase 5 sunset verdict | Stage 11 Disposal (ordered teardown checklist) |
