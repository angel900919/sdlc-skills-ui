# System Design vs Architecture

> Domain: Design & Architecture · Learning order: 10 · Bloom target: Understand

## Overview

System design and architecture is the "blueprint" phase of systems engineering — the moment abstract requirements coalesce into an actionable plan (source: m3-intro). **Architecture** answers *what the major building blocks are and the rules that govern them*; **design** answers *how each block is actually built* (source: m3-intro). This topic owns that distinction plus the general anatomy of an architectural framework (viewpoints, principles, processes, concerns, standards). The named frameworks themselves (TOGAF, Zachman, NIST) live next door in [11-architecture-frameworks](../11-architecture-frameworks/README.md); the trade-off methods that drive design decisions live in [12-design-tradeoffs](../12-design-tradeoffs/README.md). Architecture vs design here is the *high-level/detailed* split — not the *evaluate-the-options* activity that belongs to topic 12.

**What you already know that connects here:** from [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md) you have the requirements that architecture and design must trace forward (requirements ➔ architecture ➔ design ➔ implementation) (source: m3-intro).

## Learning objectives

After this topic you will be able to:

- (Understand) Explain how architecture (building blocks + guiding rules) differs from design (detailed, implementable solutions) (source: m3-intro).
- (Understand) Classify a given engineering decision as architecture-level or design-level, using the autonomous-vehicle subsystems as the model case (source: m3-intro).
- (Understand) Explain the three reasons design and architecture matter — clarity & control, risk mitigation, traceability (source: m3-intro).
- (Understand) Describe the five elements an architectural framework provides and what each one is for (source: m3-frameworks).
- (Understand) Explain what stakeholder viewpoints/views are and why different stakeholders need different views (source: m3-frameworks).
- (Understand) Identify the role of the ISO/IEC 42010 standard within an architectural framework (source: m3-frameworks).

## Prerequisites

- [02-se-process-stages](../02-se-process-stages/README.md) — architecture and design are stages in the SE process; you need the surrounding flow to place them.
- [05-requirements-elicitation-analysis](../05-requirements-elicitation-analysis/README.md) — architecture takes *requirements* as its input, so traceability starts there.

## Subtopics covered

- Architecture: the blueprint phase (building blocks + guiding rules)
- Design: fleshing out the blueprint (trade-offs, interface specs, component behavior, test strategy)
- Architecture vs design distinction
- Why design & architecture matter (clarity & control, risk mitigation, traceability)
- What an architectural framework provides (viewpoints/views, principles & guidelines, processes & methodologies, concerns & roles, standards including ISO/IEC 42010)

## In this topic

- [Fundamentals](fundamentals.md) — concepts, explanations, diagrams, FAQ
- [Examples](examples.md) — worked → faded → independent
- [Exercises](exercises.md) — active recall, Bloom-laddered, with feedback
- [Projects](projects.md) — transfer tasks and hands-on builds
- [Advanced](advanced.md) — deeper concepts and edge cases
- [Flashcards](flashcards.md) — atomic cards for spaced repetition
