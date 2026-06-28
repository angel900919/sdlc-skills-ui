# Prompt Library — the reusable, cross-phase layer

> This folder is the **cross-phase, reusable** prompt layer of the workflow. It holds the patterns and the research/agent playbook that apply *across* the 12 stages. It is the companion to the [AI Systems Engineer Protocol](../02_AI_Systems_Engineer_Protocol.md) — it operationalises that protocol's §5 (when to recommend research / spawn agents) into copy-paste prompts. Everything here conforms to [`05_Conventions.md`](../05_Conventions.md) (the contract): IDs §2, gates §3, T/I/A/D §4, severity §5, frontmatter §6, diagrams §7, citations §9, folder layout §10.

## What's here

| File | What it gives you |
|---|---|
| [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md) | Eight copy-paste, **domain-agnostic** prompt patterns with `<placeholders>` — stakeholder elicitation, SMART/EARS rewrite, need-vs-solution challenge, weighted decision-matrix + sensitivity, red-team / assumption-challenge, gate-readiness review, traceability gap-finder, ICD seam definition. Each has *when to use*, the *prompt*, and *what good output looks like*. |
| [`research-and-agents.md`](research-and-agents.md) | The consolidated guide: concrete **TRIGGERS** for recommending web research (regs/standards, comparables/benchmarks, tool capabilities, cost inputs) and for spawning **specialised agents** (deep-research, builder, adversarial reviewer, calculation/verification, domain-expert) — each with an example invocation prompt and what it must return. |

## The per-phase prompts live in the skills, not here

Each phase already ships its **own** tailored prompt pack inside its skill, under the **`## AI prompt pack`** heading. **That is the authoritative, single home for per-phase prompts** — this library does not duplicate them. Use the table below to jump straight to the right phase's pack; come *here* only for the cross-phase patterns and the research/agent playbook.

| Phase | Skill (authoritative `## AI prompt pack` lives here) | Stage gate | What its prompt pack covers |
|---|---|---|---|
| 00 | [`../skills/se-phase-00-agreement/SKILL.md`](../skills/se-phase-00-agreement/SKILL.md) | ATP | Agreement register, SEMP, enablement-plan drafting & critique |
| 01 | [`../skills/se-phase-01-concept/SKILL.md`](../skills/se-phase-01-concept/SKILL.md) | MCR | Stakeholder/mission, StRS, OpsCon, feasibility prompts |
| 02 | [`../skills/se-phase-02-requirements/SKILL.md`](../skills/se-phase-02-requirements/SKILL.md) | SRR | Elicitation, SMART generation, MOE/MOP/TPM derivation, spec red-team |
| 03 | [`../skills/se-phase-03-modeling/SKILL.md`](../skills/se-phase-03-modeling/SKILL.md) | Model coverage | The 7-of-9 PlantUML diagram generation + coverage-matrix prompts |
| 04 | [`../skills/se-phase-04-architecture/SKILL.md`](../skills/se-phase-04-architecture/SKILL.md) | PDR | Architecture description, ICD seams, tech-stack rationale prompts |
| 05 | [`../skills/se-phase-05-tradeoff/SKILL.md`](../skills/se-phase-05-tradeoff/SKILL.md) | Decisions traced | Decision-matrix build + sensitivity, COCOMO check, AHP weights |
| 06 | [`../skills/se-phase-06-integration/SKILL.md`](../skills/se-phase-06-integration/SKILL.md) | CDR | Increment planning, dependency/CI-CD/HIL prompts |
| 07 | [`../skills/se-phase-07-verification/SKILL.md`](../skills/se-phase-07-verification/SKILL.md) | TRR | Verification-matrix, T/I/A/D method finalisation, coverage prompts |
| 08 | [`../skills/se-phase-08-validation/SKILL.md`](../skills/se-phase-08-validation/SKILL.md) | PRR | Test-plan, `TC-VAL-*` case generation, acceptance prompts |
| 09 | [`../skills/se-phase-09-change-config/SKILL.md`](../skills/se-phase-09-change-config/SKILL.md) | Baselines current | Change/config-management, CR-log, impact-analysis prompts |
| 10 | [`../skills/se-phase-10-operations/SKILL.md`](../skills/se-phase-10-operations/SKILL.md) | ORR → GA | SLO definition, runbook, continuous-validation prompts |
| 11 | [`../skills/se-phase-11-disposal/SKILL.md`](../skills/se-phase-11-disposal/SKILL.md) | DRR | Decommission, sanitization, environmental, archival prompts |

## How to use this library

1. **Working a specific phase?** Open that phase's skill and use its `## AI prompt pack` first — it is tailored to that phase's deliverables and IDs.
2. **Need a cross-phase move** (elicit stakeholders, SMART-rewrite a stray requirement, build a decision matrix, red-team any draft, check a gate, find a traceability gap, define an ICD seam)? Reach for [`reusable-prompt-patterns.md`](reusable-prompt-patterns.md).
3. **Hit something external or knowable** (a regulation, a benchmark, a vendor capability, a cost input) — or a sub-task deep enough to delegate? Open [`research-and-agents.md`](research-and-agents.md) for the trigger and the ready-made invocation.

## House rules these prompts honour

- **Never invent** numbers, regulations, or test results. An unknown becomes `TODO: <what's owed>` plus a research recommendation (Protocol §10.2). The prompts here are written to *ask you for the missing number*, not to fabricate one.
- **Everything gets an ID and a trace** per [`05_Conventions.md` §2](../05_Conventions.md) and the §8 spine. The patterns emit IDs in the convention's grammar (e.g. `REQ-<class>-<nn>`, `DM-<nn>`, `ICD-<nn>`) — they never coin new ones.
- **Library / framework / tool / cloud questions go through the Context7 docs MCP first** (user house rule) — *before* a general web search. See [`research-and-agents.md`](research-and-agents.md).
- **Gates are decisions, not formalities** — the gate-readiness pattern returns one of *Proceed · Proceed-with-actions · Hold · Re-baseline · Stop* with evidence, per Protocol §6.

## See also

- [`../02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) — the operating manual these prompts serve (this library expands its §5).
- [`../05_Conventions.md`](../05_Conventions.md) — the contract (IDs, gates, methods, severities, citations).
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — the spine, the V-model, problem-vs-solution space.
- [`../checklists/`](../checklists/) — gate-review and per-phase checklists the gate-readiness pattern scores against.
