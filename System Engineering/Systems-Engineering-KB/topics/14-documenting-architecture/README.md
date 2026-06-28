# Documenting System Architecture

> Domain: Design & Architecture · Learning order: 14 · Bloom target: Apply

## Overview

Documenting system architecture turns a design that lives in engineers' heads into a structured, shareable representation of components, interactions, and dependencies — enabling clear communication, design validation, traceability, and collaboration across teams (source: m3-document; source: m3-review). This topic is about *using* the standard artifacts — Block Definition Diagram (BDD), Internal Block Diagram (IBD), Interface Control Document (ICD), and Functional Flow Block Diagram (FFBD) — to capture an architecture and tailor it to its audience. **The grammar of these SysML diagrams (what each of the nine diagram types *is*) lives in [08-sysml-modeling](../08-sysml-modeling/README.md); here the focus is on applying them to document a real architecture and on the ICD/FFBD specifics that SysML alone does not give you.**

**What you already know that connects here:** [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) gave you the components and decisions of an architecture — this topic is how you write that architecture down so others can build, verify, and maintain it.

## Learning objectives

After this topic you will be able to:

- (Apply) Build a Block Definition Diagram for a system, choosing composition, generalization, and association relationships correctly (source: m3-document; source: master-notes).
- (Apply) Decompose a block into an Internal Block Diagram using the five-step procedure, including standard vs. flow ports (source: m3-document; source: master-notes).
- (Apply) Write an Interface Control Document section covering all six standard contents for a given interface (source: m3-document; source: m3-icd).
- (Apply) Construct a Functional Flow Block Diagram for a process using blocks, arrows, and branches/loops (source: m3-document).
- (Analyze) Match each architecture artifact to the stakeholder whose needs it serves (source: m3-document; source: m3-review).
- (Apply) Apply the five documentation best practices (tailoring, clear language, visuals, traceability, justification) to an architecture package (source: m3-document).

## Prerequisites

- [08-sysml-modeling](../08-sysml-modeling/README.md) — supplies the SysML diagram definitions (BDD, IBD, and the rest); this topic assumes you can read them and concentrates on using them to document architecture.
- [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/README.md) — supplies the architecture itself (components, structure, decisions) that the documentation captures.

## Subtopics covered

Why documentation matters, Block Definition Diagram (BDD) for architecture, Internal Block Diagram (IBD) in five steps, Interface Control Document (ICD) contents, Functional Flow Block Diagram (FFBD), Documenting for different stakeholders, Best practices

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
