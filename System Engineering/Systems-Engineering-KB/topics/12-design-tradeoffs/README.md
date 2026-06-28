# Evaluating Design Trade-offs: Performance, Cost & Scalability

> Domain: Design & Architecture · Learning order: 12 · Bloom target: Analyze

## Overview

Designing a system is not about picking the single "best" option; it is about balancing competing factors — performance, cost, risk, and scalability — to find the right solution for a given context and constraints (source: m3-tradeoffs). A high-performance system tends to be expensive, while a cheaper one may not scale; trade-off evaluation makes those tensions explicit and measurable so you can choose deliberately rather than by gut feel (source: m3-tradeoffs). This topic owns the **analysis of each criterion** — how to measure and reason about performance, cost (including COCOMO effort estimation), and scalability. The structured method that **combines** these criteria into a single ranked choice — the decision matrix — lives in [13-decision-matrix](../13-decision-matrix/README.md); performance/cost/scalability numbers you produce here become its inputs.

**What you already know that connects here:** [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) introduced architecture and design as distinct activities; trade-off evaluation is how you choose between candidate architectures and designs before committing.

## Learning objectives

After this topic you will be able to:

- (Analyze) Compare two candidate designs from a table of performance metrics and justify which one wins (source: m3-perf).
- (Apply) Compute software effort and development time with the Basic COCOMO formulas for organic, semi-detached, and embedded modes (source: m3-cocomo).
- (Analyze) Classify a given growth scenario by scalability type (vertical, horizontal, data, functional, administrative) (source: m3-scalability).
- (Apply) Calculate net benefit and ROI for a candidate investment (source: master-notes).
- (Analyze) Decompose a system's cost into the seven cost types and select the right cost model (TCO, NPV, LCA) for a comparison horizon (source: m3-cost, master-notes).
- (Analyze) Diagnose which scalability method (capacity planning, elasticity testing, bottleneck analysis, modular design) fits a stated symptom (source: m3-scalability).

## Prerequisites

- [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) — you must be able to tell architecture from design and identify candidate options before you can evaluate trade-offs among them.

## Subtopics covered

Why trade-offs exist, Performance analysis (metrics and methods), Cost analysis (cost types, TCO, the 5 steps, LCA/CBA/ROI), The COCOMO model (project types; basic / intermediate / detailed), Scalability analysis (types; capacity planning, elasticity, bottleneck, modular design), Additional criteria (reliability, security, usability, risk)

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
