# Systems Engineering — Knowledge Base

*Design, model, build, and verify complex systems across their whole lifecycle — from stakeholder need to retirement.*

*Generated 2026-06-15 · 19 topics*

## Start here

1. [Executive Summary](00-executive-summary.md) — the whole subject in one read
2. [Learning Roadmap](01-learning-roadmap.md) — what to learn in what order, and why
3. Work the topics below in order — read `fundamentals.md`, then **close it and do the exercises**
4. [Spaced Review Schedule](02-spaced-review.md) — when to revisit each topic so it sticks
5. [References](references.md) — every source, plus further reading

## Topics by domain

### SE Foundations

What systems engineering is, the process it follows, the lifecycle models it uses, and the core toolkit.

- [Systems Engineering & Core Principles](topics/01-se-fundamentals/README.md) — What systems engineering is, why it exists, and the core principles — systems thinking, holistic view, lifecycle thinking — that define the discipline.
- [Stages of the SE Process](topics/02-se-process-stages/README.md) — The five-stage end-to-end process — Concept, Development, Production, Operations & Maintenance, Disposal — illustrated with a satellite system.
- [System Lifecycle Models](topics/03-lifecycle-models/README.md) — Waterfall, V-Model, Spiral, and Agile — how each structures development and when to choose which.
- [Common SE Tools & Techniques](topics/04-se-tools-techniques/README.md) — Requirement-management tools, MBSE/SysML tools, the ISO/IEC/IEEE 29148 document set, and the core techniques: trade-off analysis, risk management, V&V, and interface management.

### Requirements & Modeling

Turning vague stakeholder needs into clear, verifiable, traceable requirements and system models.

- [Eliciting & Analyzing Requirements](topics/05-requirements-elicitation-analysis/README.md) — Gathering needs from stakeholders and turning them into clear, classified, prioritized, traceable requirements.
- [Verifying Requirements](topics/06-verifying-requirements/README.md) — Proving requirements are well-formed and testable using SMART criteria, standardized templates, requirement diagrams, and peer reviews.
- [Requirements Management, Traceability & Change Management](topics/07-requirements-management/README.md) — Keeping requirements consistent and traceable over the lifecycle with tools like ReqView, and controlling change through a structured process.
- [System Modeling with SysML](topics/08-sysml-modeling/README.md) — The nine SysML diagram types in four categories, and the seven requirement relationships used to build traceable models.
- [Requirements in Model-Based Systems Engineering (MBSE)](topics/09-mbse-requirements/README.md) — Moving from document-based to model-based requirements: requirement types, categories, stereotypes, dependency matrices, and coverage metrics.

### Design & Architecture

Structuring the solution: frameworks, trade-off analysis, decision matrices, and architecture documentation.

- [System Design vs Architecture](topics/10-design-architecture-fundamentals/README.md) — The difference between architecture (the blueprint) and design (the detailed solution), and what an architectural framework provides.
- [Architecture Frameworks: TOGAF, Zachman, NIST](topics/11-architecture-frameworks/README.md) — Three major enterprise-architecture frameworks — TOGAF's ADM, the Zachman 6×6 matrix, and the NIST five-layer EA model — and how to apply them.
- [Evaluating Design Trade-offs: Performance, Cost & Scalability](topics/12-design-tradeoffs/README.md) — Balancing competing criteria — analyzing performance, cost (including the COCOMO model), and scalability — to pick the best-balanced design.
- [Decision Matrices: Ranking & Scoring Alternatives](topics/13-decision-matrix/README.md) — Using a weighted scoring model to compare design alternatives objectively and pick a winner.
- [Documenting System Architecture](topics/14-documenting-architecture/README.md) — The core architecture artifacts — BDD, IBD, ICD, FFBD — and how to tailor documentation to different stakeholders.

### Integration, Verification & Validation

Bringing the pieces together and proving the system was built right and is the right system.

- [Integration Strategies & Managing Interfaces](topics/15-integration-strategies/README.md) — Top-down, bottom-up, and incremental integration; managing dependencies and interfaces; lessons from the Boeing 787.
- [Verification & Validation Methods](topics/16-verification-validation-methods/README.md) — Verification ("built right") via inspections, reviews, and testing; validation ("right system") via acceptance testing, pilots, and simulation.
- [Writing Test Cases & Test Plans](topics/17-test-plans-cases/README.md) — The anatomy of a good test case and a good test plan, with worked login examples.
- [Change Management & Continuous Validation](topics/18-change-management-continuous-validation/README.md) — Impact analysis, the change-control process and CCB, change-management tools, and continuous testing in Agile/iterative development.

### Applied & Integrative

Tying every phase together into a working Agile systems-engineering workflow.

- [Agile Systems Engineering Playbook (Capstone)](topics/19-agile-se-playbook/README.md) — An integrative, end-to-end workflow that ties every phase, artifact, and tool together into an Agile systems-engineering practice.

## Suggested learning order

| # | Topic | Prerequisites |
|---|---|---|
| 1 | [Systems Engineering & Core Principles](topics/01-se-fundamentals/README.md) | — |
| 2 | [Stages of the SE Process](topics/02-se-process-stages/README.md) | se-fundamentals |
| 3 | [System Lifecycle Models](topics/03-lifecycle-models/README.md) | se-fundamentals |
| 4 | [Common SE Tools & Techniques](topics/04-se-tools-techniques/README.md) | se-fundamentals |
| 5 | [Eliciting & Analyzing Requirements](topics/05-requirements-elicitation-analysis/README.md) | se-fundamentals, se-process-stages |
| 6 | [Verifying Requirements](topics/06-verifying-requirements/README.md) | requirements-elicitation-analysis |
| 7 | [Requirements Management, Traceability & Change Management](topics/07-requirements-management/README.md) | requirements-elicitation-analysis, verifying-requirements |
| 8 | [System Modeling with SysML](topics/08-sysml-modeling/README.md) | se-tools-techniques, requirements-elicitation-analysis |
| 9 | [Requirements in Model-Based Systems Engineering (MBSE)](topics/09-mbse-requirements/README.md) | sysml-modeling, requirements-management |
| 10 | [System Design vs Architecture](topics/10-design-architecture-fundamentals/README.md) | se-process-stages, requirements-elicitation-analysis |
| 11 | [Architecture Frameworks: TOGAF, Zachman, NIST](topics/11-architecture-frameworks/README.md) | design-architecture-fundamentals |
| 12 | [Evaluating Design Trade-offs: Performance, Cost & Scalability](topics/12-design-tradeoffs/README.md) | design-architecture-fundamentals |
| 13 | [Decision Matrices: Ranking & Scoring Alternatives](topics/13-decision-matrix/README.md) | design-tradeoffs |
| 14 | [Documenting System Architecture](topics/14-documenting-architecture/README.md) | sysml-modeling, design-architecture-fundamentals |
| 15 | [Integration Strategies & Managing Interfaces](topics/15-integration-strategies/README.md) | design-architecture-fundamentals |
| 16 | [Verification & Validation Methods](topics/16-verification-validation-methods/README.md) | verifying-requirements, integration-strategies |
| 17 | [Writing Test Cases & Test Plans](topics/17-test-plans-cases/README.md) | verification-validation-methods |
| 18 | [Change Management & Continuous Validation](topics/18-change-management-continuous-validation/README.md) | requirements-management, verification-validation-methods |
| 19 | [Agile Systems Engineering Playbook (Capstone)](topics/19-agile-se-playbook/README.md) | lifecycle-models, requirements-management, architecture-frameworks, test-plans-cases, change-management-continuous-validation |
