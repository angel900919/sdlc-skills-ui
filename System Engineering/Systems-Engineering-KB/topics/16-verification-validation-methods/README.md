# Verification & Validation Methods

> Domain: Integration, Verification & Validation · Learning order: 16 · Bloom target: Apply

## Overview

This topic is the catalogue of methods that prove a built system is both **correct** and **right**. **Verification** answers *"Did we build the system right?"* — does it meet the specified requirements — and is performed *before* validation using inspections, reviews, and testing (source: m4-vv). **Validation** answers *"Did we build the right system?"* — does it meet user needs and intended use in a real-world operational environment — using acceptance testing, pilot testing, and simulation (source: m4-vv). The contrast to keep straight: verifying a *requirement statement* (is it SMART/well-formed?) lives in [06-verifying-requirements](../06-verifying-requirements/README.md); verifying the *built system against those requirements* is here. **What you already know that connects here**: [15-integration-strategies](../15-integration-strategies/README.md) — you integrate subsystems first, and integration testing is one of the verification levels you apply here.

## Learning objectives

After this topic you will be able to:

- (Apply) Classify a given V&V activity as verification or validation and justify which question it answers.
- (Apply) Choose the correct V&V method (inspection vs review vs unit/integration/system/acceptance testing vs UAT/OAT/FAT/SAT vs pilot vs simulation) for a described scenario.
- (Apply) Sequence V&V methods correctly, putting verification before validation.
- (Understand) Distinguish the four acceptance-testing types (UAT, OAT, FAT, SAT) and regulatory/compliance testing.
- (Understand) Explain the validation challenges (unclear/evolving requirements, lab-vs-real-world gaps) and the best practices that counter them.

## Prerequisites

- [06-verifying-requirements](../06-verifying-requirements/README.md) — you must know what a verifiable requirement is before you can test a built system against it; this topic verifies the *product*, that one verifies the *statement*.
- [15-integration-strategies](../15-integration-strategies/README.md) — integration testing here builds on the integration strategies (top-down, bottom-up, incremental) you assemble subsystems with there.

## Subtopics covered

- Verification vs validation ("did we build the system right?" vs "did we build the right system?"; verification before validation)
- Inspections & reviews
- Testing against requirements (unit, integration, system, acceptance — the testing levels)
- Validation: acceptance testing (UAT, OAT, FAT, SAT, regulatory/compliance)
- Pilot testing & field trials
- Simulation & prototyping
- Validation challenges & best practices

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
