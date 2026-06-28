# Requirements in Model-Based Systems Engineering (MBSE)

> Domain: Requirements & Modeling · Learning order: 9 · Bloom target: Analyze

## Overview

Model-Based Systems Engineering (MBSE) is a formalized methodology that supports requirements, design, analysis, verification, and validation of complex systems by making a single digital model — not documents — the authoritative source (source: m2-mbse). This topic owns *how MBSE analytically handles requirements*: classifying requirement types, mapping them to SysML element types and stereotypes, organizing them in packages, and using tables, dependency matrices, coverage metrics, and dependency maps to diagnose model errors and find gaps. **MBSE here** is the methodology and its analytical tooling; **SysML in topic 08** is the modeling language and its diagram/relationship grammar that MBSE consumes (source: m2-mbse). Requirement *management* practice (traceability concepts, ReqView) lives in topic 07.

**What you already know that connects here:** From [08-sysml-modeling](../08-sysml-modeling/README.md) you know SysML's requirement element and its relationships (derive, refine, satisfy, verify). MBSE uses exactly those relationships as the data its matrices and metrics analyze.

## Learning objectives

After this topic you will be able to:

- (Analyze) Compare MBSE with document-based systems engineering and explain why digital modeling reduces development time/cost and supports secure-by-design.
- (Analyze) Classify a requirement as business, user, or system (functional vs. non-functional "ility") and map it to the correct SysML element type or stereotype.
- (Analyze) Diagnose direction errors in a requirements table (e.g., a business requirement with a non-empty "Derived From" column).
- (Analyze) Read a Derive/Verify/Satisfy dependency matrix and use its negative space to identify orphaned or unverified requirements.
- (Analyze) Design a wide-and-flat package structure and a stereotype scheme for a system's requirements.
- (Evaluate) Interpret coverage metrics over time to judge the health of a requirements model.

## Prerequisites

- [08-sysml-modeling](../08-sysml-modeling/README.md) — you must already know the SysML requirement element and its relationships (derive/refine/satisfy/verify); this topic analyzes them rather than redefining them.
- [07-requirements-management](../07-requirements-management/README.md) — traceability concepts and tool-based requirement management set up the "why" behind MBSE traceability.

## Subtopics covered

- What MBSE is and its advantages over document-based SE (reduces time/cost, secure-by-design, SEI CERT research)
- The four MBSE domains: requirements/capabilities, behavior, architecture/structure, V&V
- Requirement types in MBSE: business, user, system (incl. non-functional "ilities")
- Mapping requirement types to SysML element types and stereotypes
- Requirement categories & package structure (wide-and-flat, ~3 layers)
- Stereotypes as tags with their own properties
- Telling the traceability story with a requirement diagram (provenance)
- Tables to spot model errors (wrong-direction relationships)
- Dependency matrices (Verify, Derive, Satisfy) and negative space
- Coverage metrics over time and dependency maps

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
