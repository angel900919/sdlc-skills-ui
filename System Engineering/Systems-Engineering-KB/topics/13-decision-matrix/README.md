# Decision Matrices: Ranking & Scoring Alternatives

> Domain: Design & Architecture · Learning order: 13 · Bloom target: Apply

## Overview

A **decision matrix** (also called a **weighted scoring model**) is a structured way to pick the best design option by scoring every alternative against weighted criteria and adding the results up, so the choice is objective and data-driven rather than a gut call (source: m3-decision). The point is to balance competing factors — performance, cost, risk, scalability, maintainability — instead of optimizing just one (source: master-notes). **Decision-matrix here vs. design tradeoffs in topic 12:** topic 12 teaches how to *measure* each individual factor (benchmarking, cost analysis, COCOMO, scalability methods); this topic takes those measurements as inputs and *combines* them into a single ranked decision. You measure there; you decide here.

**What you already know that connects here:** from [12-design-tradeoffs](../12-design-tradeoffs/README.md) you know how to evaluate performance, cost, and scalability for a single option — a decision matrix is the tool that turns several of those evaluations into one comparable score per alternative.

## Learning objectives

After this topic you will be able to:

- (Apply) Build a decision matrix for a set of design alternatives: choose criteria, assign weights, score, and total (source: m3-decision).
- (Apply) Compute weighted scores (score × weight) and sum them to a total per alternative (source: m3-decision).
- (Apply) Run a sensitivity analysis by adjusting a weight and checking whether the winner changes (source: master-notes).
- (Understand) Explain why weighting criteria makes the comparison reflect real priorities (source: master-notes).
- (Analyze) Diagnose a flawed matrix (weights that don't sum to 1, incomparable alternatives, an over-weighted criterion).

## Prerequisites

- [12-design-tradeoffs](../12-design-tradeoffs/README.md) — you need to know how to evaluate performance, cost, and scalability for one option before you can score several options against those criteria.

## Subtopics covered

- What a decision matrix is (a.k.a. weighted scoring model)
- The steps to build one: define/choose criteria → identify alternatives → weight criteria → score each alternative → multiply score × weight → sum → decide
- Choosing and weighting criteria
- Scoring alternatives and computing weighted totals
- Worked example: choosing a system architecture
- Sensitivity analysis (what if priorities change)

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
