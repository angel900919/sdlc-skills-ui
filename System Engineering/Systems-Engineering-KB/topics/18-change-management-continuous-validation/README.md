# Change Management & Continuous Validation

> Domain: Integration, Verification & Validation · Learning order: 18 · Bloom target: Apply

## Overview

Once a system is built, it never stops changing — and every change risks breaking something that already worked. This topic covers the two disciplines that keep change safe: a **system-wide change-management workflow** (impact analysis → change control board approval → implementation → documentation, tracked with configuration-management tooling) and **continuous validation** (shift-left, automated testing woven into every CI/CD cycle so defects are caught the moment they appear) (source: m4-change, m4-changemgmt). Note the contrast with the neighbouring topic: [07-requirements-management](../07-requirements-management/README.md) governs change *at the requirement level* (the 5-phase requirement change process and traceability); here the scope is the *whole system* — impact across components, schedule, cost, compliance, plus the tooling and the continuous-testing pipeline that validates each change. **What you already know that connects here**: from [16-verification-validation-methods](../16-verification-validation-methods/README.md) you already know what verification and validation are; this topic turns them into a *continuous* activity that runs on every commit rather than once at the end.

## Learning objectives

After this topic you will be able to:

- (Apply) Perform an impact analysis for a proposed change using the 5 steps (scope → risks/dependencies → cost/schedule → compliance/safety → stakeholder input) and write the findings as an Impact Analysis Report.
- (Apply) Walk a change request through the 6-phase change control process and identify where the Change Control Board (CCB) makes its decision.
- (Apply) Design a continuous-testing pipeline for a system: shift-left tests automated by layer, run per commit in CI/CD with fail-fast feedback.
- (Analyze) Compare impact analysis with continuous testing, and shift-left testing with traditional end-of-cycle testing.
- (Evaluate) Decide whether a proposed change should proceed ("yes, but with caution") given its risks, mitigations, and value.

## Prerequisites

- [07-requirements-management](../07-requirements-management/README.md) — you need the requirement-level change process and traceability before scaling it up to system-wide impact analysis; this topic does not re-teach traceability types.
- [16-verification-validation-methods](../16-verification-validation-methods/README.md) — continuous testing here reuses the V&V methods and test types defined there.

## Subtopics covered

- Impact analysis (the 5 steps)
- Worked impact analysis: a payment-app checkout UI change
- Approvals & the change control process (6 phases)
- Change Control Board & configuration management (CMS, IBM DOORS)
- Change management tools (Agile / complex SE / IT / risk-impact)
- Continuous testing in Agile (shift-left, CI/CD, fail-fast, environment consistency, service virtualization)
- Test types in Agile (unit, integration, system, regression, UAT)
- Best practices (BDD-before-code, automate by layer, per-commit pipeline)

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
