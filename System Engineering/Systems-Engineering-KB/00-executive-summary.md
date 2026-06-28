# Systems Engineering — Executive Summary

> [OUTSIDE MATERIAL] **How to use this knowledge base.** Study by *retrieval, not re-reading*. Read a `fundamentals.md` once, then **close it** and do the `exercises.md` from memory — producing an answer is what builds durable learning, recognizing one is not. Follow the widening schedule in [02-spaced-review.md](02-spaced-review.md); it deliberately feels slower than cramming, and that difficulty is the point. Fluency from re-reading is **not** mastery — closed-book recall is the real signal. Don't cram the night before; space it.

## What this covers

**Systems engineering (SE)** is the interdisciplinary discipline for designing, integrating, and managing complex systems across their whole lifecycle — from a stakeholder's first need to the system's retirement (source: m1-core). This KB turns the four-module Udacity *Systems Engineering* course into a study system. By the end you will be able to:

- Explain what SE is and place any activity in the lifecycle (concept → disposal).
- Choose a lifecycle model (Waterfall / V-Model / Spiral / Agile) for a given project and justify it.
- Elicit, classify, prioritize, verify (SMART), and trace requirements.
- Model systems in SysML and run requirements model-based (MBSE).
- Apply architecture frameworks (TOGAF, Zachman, NIST), evaluate trade-offs (performance / cost / scalability, COCOMO), pick a design with a decision matrix, and document it (BDD / IBD / ICD / FFBD).
- Integrate subsystems, verify and validate the result, write test cases/plans, manage change, and run continuous validation — then tie it all together in an Agile SE workflow.

**Assumed prior knowledge** (each with a self-check; if shaky, that's fine — the course is beginner-friendly):
- *Basic software/engineering project vocabulary* — Q: what is a "requirement" vs a "design"? If unsure, start at topic 01.
- *What a stakeholder is* — Q: name three stakeholders for a phone app. (users, client, regulators…)
- *Reading a simple diagram/flowchart* — Q: can you follow boxes-and-arrows? SysML builds on this in topic 08.
- *Comfort with percentages and a weighted average* — Q: compute 0.4×3 + 0.3×5. Needed for the decision matrix (topic 13) and COCOMO (topic 12).

## Major topics at a glance

| # | Topic | What it's about | Why it matters | Prereqs |
|---|---|---|---|---|
| 1 | [SE & Core Principles](topics/01-se-fundamentals/README.md) | Definition, systems thinking, holistic view, the integrator role, history | The mental model the rest builds on | — |
| 2 | [Stages of the SE Process](topics/02-se-process-stages/README.md) | Concept → Development → Production → O&M → Disposal | Locates every activity in the lifecycle | 01 |
| 3 | [Lifecycle Models](topics/03-lifecycle-models/README.md) | Waterfall, V-Model, Spiral, Agile + how to choose | Wrong model = cost/risk; choice is a real skill | 01 |
| 4 | [SE Tools & Techniques](topics/04-se-tools-techniques/README.md) | Req tools, ISO 29148 doc set, SysML, trade-off/risk/V&V/interface mgmt | The toolkit; introduces concepts owned later | 01 |
| 5 | [Eliciting & Analyzing Requirements](topics/05-requirements-elicitation-analysis/README.md) | Elicitation methods; functional/non-functional/constraint/domain; prioritize | Poor requirements are a top cause of failure | 01, 02 |
| 6 | [Verifying Requirements](topics/06-verifying-requirements/README.md) | SMART, templates, IEEE 830, peer reviews | An unverifiable requirement can't be proven met | 05 |
| 7 | [Requirements Management](topics/07-requirements-management/README.md) | ReqView, traceability types, change process, CCB | Keeps requirements consistent as things change | 05, 06 |
| 8 | [System Modeling with SysML](topics/08-sysml-modeling/README.md) | 9 diagrams in 4 categories; 7 requirement relationships | The visual language of MBSE and architecture | 04, 05 |
| 9 | [Requirements in MBSE](topics/09-mbse-requirements/README.md) | Model-based requirements, stereotypes, matrices, coverage | Model as single source of truth; finds gaps automatically | 08, 07 |
| 10 | [System Design vs Architecture](topics/10-design-architecture-fundamentals/README.md) | Blueprint vs detail; what a framework provides | Distinguishes the two design altitudes | 02, 05 |
| 11 | [Architecture Frameworks](topics/11-architecture-frameworks/README.md) | TOGAF/ADM, Zachman, NIST + applying them | Reusable structure instead of ad hoc design | 10 |
| 12 | [Design Trade-offs](topics/12-design-tradeoffs/README.md) | Performance, cost (COCOMO), scalability analysis | No design is "best" — you balance criteria | 10 |
| 13 | [Decision Matrices](topics/13-decision-matrix/README.md) | Weighted scoring to pick an alternative | Makes a multi-criteria choice objective | 12 |
| 14 | [Documenting Architecture](topics/14-documenting-architecture/README.md) | BDD, IBD, ICD, FFBD; tailoring to stakeholders | Architecture nobody can read isn't usable | 08, 10 |
| 15 | [Integration Strategies](topics/15-integration-strategies/README.md) | Top-down/bottom-up/incremental; dependencies & interfaces | Where "it works alone" meets "it works together" | 10 |
| 16 | [V&V Methods](topics/16-verification-validation-methods/README.md) | Inspections, reviews, testing, acceptance, pilots, simulation | Proves "built right" and "right system" | 06, 15 |
| 17 | [Test Cases & Test Plans](topics/17-test-plans-cases/README.md) | Anatomy of test cases/plans; worked login examples | Turns V&V intent into executable checks | 16 |
| 18 | [Change Mgmt & Continuous Validation](topics/18-change-management-continuous-validation/README.md) | Impact analysis, CCB, change tools, continuous testing | Change is inevitable; control it without breaking things | 07, 16 |
| 19 | [Agile SE Playbook (Capstone)](topics/19-agile-se-playbook/README.md) | End-to-end Agile workflow tying every artifact/tool together | Integration is the whole point of SE | 03, 07, 11, 17, 18 |

## Key concepts

The load-bearing ideas; each links to its home topic (full definition in the [Glossary](references.md#glossary)).

- **Systems thinking & holistic view** — the interaction lens and the whole-system lens → [01](topics/01-se-fundamentals/fundamentals.md).
- **The lifecycle** (concept → disposal) — every activity lives in a stage → [02](topics/02-se-process-stages/fundamentals.md).
- **Lifecycle models** — Waterfall (stable), V-Model (test-paired), Spiral (risk), Agile (change) → [03](topics/03-lifecycle-models/fundamentals.md).
- **ISO/IEC/IEEE 29148 doc set** — BRS, StRS, SyRS, SRS, OpsCon → [04](topics/04-se-tools-techniques/fundamentals.md).
- **Functional / non-functional / constraint / domain** requirement classes → [05](topics/05-requirements-elicitation-analysis/fundamentals.md).
- **SMART criteria** — Specific, Measurable, Achievable, Relevant, Testable → [06](topics/06-verifying-requirements/fundamentals.md).
- **Traceability** (forward / backward / bidirectional) → [07](topics/07-requirements-management/fundamentals.md).
- **SysML** — 9 diagrams; the **derive / refine / satisfy / verify** relationships → [08](topics/08-sysml-modeling/fundamentals.md).
- **MBSE** — model as single source of truth; dependency matrices & coverage → [09](topics/09-mbse-requirements/fundamentals.md).
- **Architecture vs design** — blueprint vs detailed solution → [10](topics/10-design-architecture-fundamentals/fundamentals.md).
- **TOGAF ADM / Zachman / NIST** — method vs taxonomy vs layered model → [11](topics/11-architecture-frameworks/fundamentals.md).
- **Trade-off analysis** — performance, cost (**COCOMO**, TCO), scalability → [12](topics/12-design-tradeoffs/fundamentals.md).
- **Decision matrix** — weight × score → total → choose → [13](topics/13-decision-matrix/fundamentals.md).
- **BDD / IBD / ICD / FFBD** — the architecture documentation artifacts → [14](topics/14-documenting-architecture/fundamentals.md).
- **Integration strategies** — top-down (stubs), bottom-up (drivers), incremental → [15](topics/15-integration-strategies/fundamentals.md).
- **Verification vs validation** — "built right" vs "right system" → [16](topics/16-verification-validation-methods/fundamentals.md).
- **Test case vs test plan** → [17](topics/17-test-plans-cases/fundamentals.md).
- **Impact analysis & continuous testing** (shift-left, CI/CD) → [18](topics/18-change-management-continuous-validation/fundamentals.md).
- **End-to-end traceability** across the Agile SE workflow → [19](topics/19-agile-se-playbook/fundamentals.md).

## Most important takeaways

- SE exists to **manage complexity**: without it, teams optimize their own parts and the assembled whole fails even when every piece "works" (source: m1-intro).
- The **lifecycle is the spine** — decisions early (concept/requirements) dominate later cost; SE plans maintenance and retirement from the start (source: m1-core).
- **Requirements are the foundation**: poorly defined requirements are a leading cause of project failure, cost overruns, and delays (source: m2-intro).
- A requirement you can't test is a liability: **SMART** turns "should be fast" into "≥10 Mbps under standard conditions" (source: m2-verify).
- **Verification ≠ validation**: building the system right (to spec) is not the same as building the right system (meeting user needs) (source: m4-vv).
- **No design is "best"** — you balance performance, cost, scalability, and risk, and a decision matrix makes the choice defensible (source: m3-tradeoffs, m3-decision).
- **Traceability is the connective tissue**: every requirement should link to its source, design, code, and tests, so the impact of any change is knowable (source: m2-elicit).
- **Change is inevitable**; an impact analysis + CCB lets you absorb it without destabilizing the system (source: m4-change).

## Best practices

- **Engage stakeholders early and throughout** — for elicitation and for validation; it prevents building the wrong thing (source: m2-elicit, m4-vv).
- **Write every requirement SMART** and put it in a standard template so it's reviewable, traceable, and testable (source: m2-verify).
- **Define interfaces early** (ICDs) and validate them independently before full integration — interface mismatches are a top integration failure (source: m4-integration).
- **Integrate the most-dependent components first** and use stubs/drivers to test before everything is ready (source: m4-integration).
- **Maintain bidirectional traceability** for safety-critical/compliance work (source: m2-reqtools).
- **Treat architecture diagrams as living documents** that sharpen as design/integration proceeds (source: m3-document).
- **Shift testing left** and automate it in CI/CD so defects surface at the commit that caused them (source: m4-change).
- **Tailor documentation to the audience** — executives want overviews and trade-offs; engineers want interfaces and dependencies (source: m3-document).

## Common mistakes

- **Working in silos** with un-aligned, untested interfaces — the failure SE exists to prevent (source: m1-intro).
- **Vague requirements** ("good coverage", "intuitive", "sleek") that can't be verified — rewrite them SMART (source: m2-ex-verify).
- **Confusing verification with validation** — passing spec tests while missing real user needs (source: m4-vv).
- **Confusing systems thinking (interactions) with the holistic view (whole-system balance)** — they answer different questions (source: m1-core).
- **Picking the highest-performance option regardless of cost/risk** instead of running a trade-off (source: m1-tools).
- **Skipping impact analysis** before a change and discovering downstream breakage later (source: m4-change).
- **Over-deep model/package structures** in MBSE (>~3 layers) that nobody can navigate (source: m2-mbse).
- **Treating the satisfy relationship as proof** — allocation is an assertion; proof comes from test cases (source: m2-models).

## Real-world applications

Drawn from the course's own examples:
- **Communication satellite** — requirements (≥100 Mbps, 99.9% availability), the high-gain-vs-omnidirectional antenna trade-off, and V&V threaded across topics 04–06 (source: m1-tools, m2-elicit).
- **Smart home / security system** — the running SysML, traceability, and requirements example (source: m2-models, m2-reqtools).
- **Autonomous delivery robot** — the BDD/IBD/ICD/FFBD documentation set, with real JSON/CAN/MQTT interface messages (source: m3-icd, m3-document).
- **Online banking system** — the end-to-end TOGAF ADM application (source: m3-applytogaf).
- **Boeing 787 Dreamliner** — a real integration-failure case (outsourcing, interface mismatches, battery/power issues) and its lessons (source: m4-integration).
- **NASA Apollo / Mars rover** — SE's origins and simulation-based validation (source: m1-core, m4-vv).
- **Smart Home AI Security** — the capstone's end-to-end traceable thread from need to validation (source: playbook).

## Critical insights

- The **V-Model's** real value is the *pairing*: every decomposition phase on the left has a matching test phase on the right, so you plan verification while you design (source: m1-lifecycle).
- **MBSE turns the model into an analytical tool**: dependency matrices and "negative-space" views automatically surface orphaned/unverified requirements that prose documents hide (source: m2-mbse).
- **Frameworks differ in kind**: TOGAF is a *process/method*, Zachman is a *classification taxonomy*, NIST is a *layered model* — they're not competitors doing the same job (source: m3-togaf, m3-zachman, m3-nist).
- A change being **safe** isn't enough — the real question is whether its value outweighs the effort and risk the impact analysis reveals (source: m4-ex-impact).
- Two of the course's own worked numbers are **internally inconsistent** (the COCOMO example and the Smart Campus decision-matrix totals); topics 12 and 13 recompute them and flag the discrepancy rather than copying it — a lesson in verifying even "authoritative" sources.

## Recommended next steps

1. Start with the [Learning Roadmap](01-learning-roadmap.md) and follow topics in order — the prerequisite graph is real; don't skip ahead.
2. For each topic: read `fundamentals.md` once → **do the exercises closed-book** → schedule revisits in [02-spaced-review.md](02-spaced-review.md).
3. Treat topic [19 (the Agile SE Playbook)](topics/19-agile-se-playbook/README.md) as a capstone — run one system end-to-end through all six phases.
4. Beyond this course, the sources point to the standards and tools in [References → Further reading](references.md#further-reading) (ISO/IEC/IEEE 29148, IEEE 830, TOGAF, COCOMO; ReqView and Visual Paradigm for hands-on practice).
