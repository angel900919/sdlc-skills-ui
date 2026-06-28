# Integration Strategies & Managing Interfaces

> Domain: Integration, Verification & Validation · Learning order: 15 · Bloom target: Apply

## Overview

System integration is where the designed pieces are combined and tested as a whole — and the **integration strategy** is the deliberate choice of *order and method* for combining and testing components, because the wrong order multiplies complexity, hides faults, and pushes defects late (source: m4-integration; source: m4-intro). This topic owns the three strategies (top-down, bottom-up, incremental), the **stubs vs. drivers** distinction, and how you manage the **dependencies** and **interfaces** that are where integration most often breaks. **Integration here ("does the assembly fit and run?") is distinct from verification & validation — "did we build it right / build the right thing?" — which lives in [16-verification-validation-methods](../16-verification-validation-methods/README.md).**

**What you already know that connects here:** [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) gave you a system decomposed into components with relationships and decisions; integration is the act of bringing those components back together and proving the assembly works.

## Learning objectives

After this topic you will be able to:

- (Apply) Select an integration strategy (top-down, bottom-up, or incremental) for a given system and justify the choice from the selection table (source: m4-integration).
- (Apply) Decide whether a partially built system needs **stubs** or **drivers**, and place them correctly (source: m4-integration).
- (Analyze) Classify a dependency as data, control, timing/temporal, or resource, and order integration by dependency weight (source: m4-integration).
- (Apply) Manage an interface across integration: define it early via an ICD, apply standards, validate it independently, and automate its tests (source: m4-integration).
- (Analyze) Diagnose integration failures in the Boeing 787 Dreamliner case as dependency vs. interface issues and extract the lessons learned (source: m4-integration).
- (Evaluate) Compare top-down, bottom-up, and incremental on testing-start point, stubs/drivers, fault isolation, and risk to choose the best fit (source: m4-integration; source: m4-review).

## Prerequisites

- [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) — supplies the decomposed components, hierarchy, and interfaces that an integration strategy combines and tests.

## Subtopics covered

What an integration strategy is, Top-down integration (and stubs), Bottom-up integration (and drivers), Incremental integration, Comparing and selecting a strategy, Managing dependencies (data, control, timing, resource), Managing interfaces (hardware, software, human-machine), Best practices and tools, Case study: Boeing 787 Dreamliner

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
