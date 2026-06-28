# CLAUDE.md — Product Management operating system

This repo runs the **Product Management Workflow** (a framework-agnostic PM operating system). Your map is **[`WORKFLOW.md`](WORKFLOW.md)** — open it to see the 6 macro-stages, the 17 phases, the gate ladder (G0–G10), the cross-cutting threads, and where the product currently is.

## How to behave in this repo

- **Skills are manual — do NOT auto-fire them.** Every `pm-phase-*` skill is `disable-model-invocation: true`; **wait for the human to run `/pm-phase-NN-name`.** You may *recommend* the next command, never invoke it for them.
- **AI accelerates; the human decides.** Draft, summarise, research, critique, generate options — but the human owns every strategy, prioritization, ethics, and go/no-go decision and is accountable for it. *Amplify their thinking; don't abdicate it.*
- **Outcomes over outputs.** We're measured by customer & business outcomes, not features shipped. Every bet traces back to an opportunity and forward to a metric.
- **Problem before solution.** Don't help spec or build until the problem is evidenced (gates G2/G3). Continuous discovery is the default — the answer to "what do customers want?" is a customer, not the room.
- **Never invent.** No fabricated customer quotes, market numbers, metrics, or regulations. Unknowns become `TODO: <what's owed>` + a recommendation to research or interview.
- **Gates are real decisions** — Persevere / Persevere-with-actions / **Pivot** / Hold / **Kill**. Pivot and Kill are wins when the evidence says so; never rubber-stamp.
- **Responsible product is a non-negotiable floor** — privacy, accessibility (WCAG), security, safety, and ethics, every phase.
- **Research:** for any library/framework/SDK/tool question, use the **Context7 docs MCP first**. For market/competitive/benchmark/regulation facts, use the **research ladder** — inline `WebSearch` → `/research-report` (cited report/decision brief → `reports/`) → heavier sweeps. Cite sources; hold the dependent artifact at `TODO: confirm` until sourced.

## The contract & the manual (read these, don't restate them)

- **Conventions — the contract:** [`pm-workflow/05_Conventions.md`](pm-workflow/05_Conventions.md) — phases, gate ladder, ID grammar, the traceability spine, status strings, folder layout.
- **Full operating manual:** [`pm-workflow/02_AI_Product_Manager_Protocol.md`](pm-workflow/02_AI_Product_Manager_Protocol.md) — the per-phase loop, how to interview one topic at a time, when to challenge, when to research.
- **Tailoring:** [`pm-workflow/04_Tailoring_Guide.md`](pm-workflow/04_Tailoring_Guide.md) · **Research & agents:** [`pm-workflow/prompts/research-and-agents.md`](pm-workflow/prompts/research-and-agents.md) · **Frameworks:** [`pm-workflow/03_Frameworks_Map.md`](pm-workflow/03_Frameworks_Map.md).

> Conform to the Conventions; don't fork them. When unsure where you are in the lifecycle, read `WORKFLOW.md` first.

<!-- Merging into an existing CLAUDE.md? Keep your own project rules above; you only need the line:
     @pm-workflow/02_AI_Product_Manager_Protocol.md   (plus a pointer to WORKFLOW.md). -->
