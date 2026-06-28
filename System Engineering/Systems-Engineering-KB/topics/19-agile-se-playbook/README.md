# Agile Systems Engineering Playbook (Capstone)

> Domain: Applied & Integrative · Learning order: 19 · Bloom target: Create

## Overview

This capstone topic is the integration layer for the whole course: it threads every prior topic — lifecycle models, requirements, SysML, architecture, V&V, change management — into a single Agile workflow held together by one **unified ID system** that gives **end-to-end traceability** from a stakeholder need all the way to a passing test case (source: playbook). Its job is *orchestration*, not re-teaching: where it touches a concept owned by another topic, it links rather than re-derives. The contrast to keep straight: the six **lifecycle phases** here describe *what artifact to produce and which tool to use at each step*, whereas the lifecycle *models* (Waterfall, V-Model, Agile) in [topic 03](../03-lifecycle-models/README.md) describe *how the phases are sequenced and iterated*.

**What you already know that connects here:** topic 03's [lifecycle models](../03-lifecycle-models/README.md) gave you the iteration patterns; this playbook decides which one to run (Agile sprints) and what to deliver in each.

## Learning objectives

After this topic you will be able to:

- (Create) Design a unified ID scheme (requirement → JIRA → branch/commit → test case) that yields end-to-end traceability for a feature (source: playbook).
- (Create) Build the full artifact set for a chosen system by running it through all six lifecycle phases (BRS/StRS → SyRS/OpsCon → BDD/FFBD/ICD → IBD/SRS/code → V&V → deployment) (source: playbook).
- (Create) Derive an Agile sprint plan (Sprint 0, delivery sprints, hardening sprint) that maps SE activities onto sprint cadence (source: playbook).
- (Evaluate) Choose Minimum-Viable vs Formal governance for a given project, and justify the pick against project criticality (source: playbook).
- (Apply) Run the SMART and change-impact checklists against a candidate requirement or change (source: playbook).

## Prerequisites

- [03-lifecycle-models](../03-lifecycle-models/README.md) — the Agile/V-Model iteration patterns this playbook schedules into sprints.
- [07-requirements-management](../07-requirements-management/README.md) — traceability and ReqView, which the unified ID system operationalizes.
- [11-architecture-frameworks](../11-architecture-frameworks/README.md) — the architecture work that Phase 3 produces.
- [17-test-plans-cases](../17-test-plans-cases/README.md) — the test cases and plans that close the traceability loop in Phase 5.
- [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md) — the impact-analysis checklist and CCB governance.

## Subtopics covered

- Unified ID system & end-to-end traceability
- Folder structure & Agile workflow (Sprint 0, delivery, hardening)
- Six lifecycle phases mapped to artifacts and tools
- Governance & scalability levels (minimum viable vs formal)
- Reusable checklists (SMART, impact analysis)
- End-to-end example: Smart Home AI Security
- Summary of document purposes

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
