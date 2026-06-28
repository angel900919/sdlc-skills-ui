# System Modeling with SysML

> Domain: Requirements & Modeling · Learning order: 8 · Bloom target: Apply

## Overview

SysML (Systems Modeling Language) is a standardized, graphical language for describing complex systems. It extends UML by adding constructs tailored for systems engineering — hardware, software, electrical, and mechanical components — rather than software alone (source: m2-models). This topic teaches you to *build and read* the nine SysML diagrams (in four categories) and to wire requirements into a model with the seven requirement relationships. **Modeling here vs methodology in topic 09:** this topic owns the diagram syntax and the requirement-relationship semantics (what a `derive` arrow *means*); [09-mbse-requirements](../09-mbse-requirements/README.md) owns the *MBSE method* — matrices, coverage metrics, and using models as the single source of truth.

**What you already know that connects here:** in [04-se-tools-techniques](../04-se-tools-techniques/README.md) you met modeling as one of the core SE techniques; SysML is the concrete language that delivers it.

## Learning objectives

After this topic you will be able to:

- (Apply) Build a Block Definition Diagram for a given system, choosing composition relationships and assigning attributes and operations to blocks (source: m2-ex-vending).
- (Apply) Construct a requirements diagram that links a main requirement to refined, derived, and satisfying elements using the correct relationship arrows (source: master-notes).
- (Understand) Classify the nine SysML diagrams into the four categories and state each diagram's purpose (source: m2-models).
- (Apply) Choose the correct SysML diagram for a stated modeling need (e.g., "show internal connections" → IBD) (source: m2-models).
- (Analyze) Distinguish the seven requirement relationships — especially `derive` vs `refine`, and `satisfy` vs `verify` (source: m2-models).
- (Understand) Explain how SysML reuses UML and where the two languages diverge (source: master-notes).

## Prerequisites

- [04-se-tools-techniques](../04-se-tools-techniques/README.md) — establishes modeling/visualization as a core SE technique; SysML is its concrete tooling.
- [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md) — you need analyzed requirements (functional, non-functional, types) before you can model and relate them.

## Subtopics covered

SysML vs UML, The 9 diagrams in 4 categories, Structure diagrams (BDD, IBD, Package), Behavior diagrams (Use Case, Activity, Sequence, State Machine), Parametric diagram, Requirements diagram and requirement types, Requirement relationships (composite, derive, refine, satisfy, verify, copy, trace), Modeling tools (Visual Paradigm)

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
