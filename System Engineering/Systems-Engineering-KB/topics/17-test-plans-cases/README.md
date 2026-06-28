# Writing Test Cases & Test Plans

> Domain: Integration, Verification & Validation · Learning order: 17 · Bloom target: Apply

## Overview

A **test case** is a set of conditions or inputs designed to verify whether a system behaves as expected; a **test plan** is the detailed document outlining the overall approach to testing — scope, objectives, schedule, and responsibilities (source: m4-testplans). This topic is hands-on *authoring*: you write the documents that drive testing. That is distinct from topic 16, which is the **catalogue of V&V methods** (unit, integration, system, acceptance, UAT, inspection, demonstration) — *how* you verify; here you produce the artifacts that *say which checks to run and what counts as pass*. Continuous testing and CI/CD execution of these artifacts belong to topic 18.

**What you already know that connects here:** from [16-verification-validation-methods](../16-verification-validation-methods/README.md) you know the testing *types* and the verification-vs-validation distinction; a test plan's *Test Approach* field simply selects among those methods, and each test case operationalises one of them.

## Learning objectives

After this topic you will be able to:

- (Apply) Write a complete test case populated with Test Case ID, Title/Description, Preconditions, Test Steps, Expected Result, Traceability, and Priority.
- (Apply) Derive test cases directly from a requirement and link them back via a traceability field.
- (Apply) Assemble a test plan section by section: Objective, Scope, Test Approach, Test Environment, Test Scenarios, Risk Assessment, and Pass/Fail Criteria.
- (Analyze) Critique a vague or dependent test case against the qualities simple, clear, independent, and relevant.
- (Apply) Define entry and exit criteria and prioritise coverage toward high-risk, critical functions.

## Prerequisites

- [16-verification-validation-methods](../16-verification-validation-methods/README.md) — supplies the testing methods and the verify-vs-validate distinction that a test plan's *Approach* and a test case's intent draw on.

## Subtopics covered

Anatomy of a test case, Worked test case: verifying login, Anatomy of a test plan, Worked test plan: login under different conditions, Best practices for test cases and plans

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
