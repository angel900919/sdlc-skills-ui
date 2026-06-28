# Requirements in Model-Based Systems Engineering (MBSE) — Exercises

Attempt each from memory or by reasoning over a scenario before checking the **Solutions & explanations** at the bottom.

## Warm-up (Tier 1 — production recall)

W1. From memory, define MBSE in one sentence and name its single structural difference from document-based SE.
W2. List the four systems engineering domains any MBSE process should cover.
W3. List the three main requirement types, high-level to detailed, and give one example "ility."
W4. State the mapping of each main requirement type to its SysML representation.
W5. From memory: what is the maximum recommended depth for a requirements package structure, and what do you do if you need more?

## Core exercises (Tier 2 — apply at Analyze level)

C1. **Classify and map.** For each, give the type and SysML representation:
   (a) "The company wants to enter the EU market." (b) "A nurse wants to chart vitals at the bedside." (c) "The system shall recover within 30 s of failure." (d) "Response time shall stay under 200 ms."

C2. **Diagnose the table (guidance-fading pair, part 1 — worked-style).** A table has columns "Derived" and "Derived From." Row: *Business Requirement 4 — Derived From: User Requirement 9*. Is this valid? Name the rule and the error type.

C3. **Diagnose the table (guidance-fading pair, part 2 — independent).** Row: *System Requirement 12 — Derived: System Requirement 30; Derived From: (empty)*. Is this valid? Explain using the empty-column rules.

C4. **Choose package vs. stereotype.** Your requirements are already organized by subsystem in a 3-layer package tree. Stakeholders now want to slice them by communication protocol too. Do you add a 4th package layer or do something else? Justify.

C5. **Negative space.** Explain what a *negative* "Derive" matrix shows and what kind of problem it surfaces. Give the source's named example of such a problem.

C6. **Explain it back (Feynman).** In 4–6 sentences, explain to a teammate why MBSE lets you catch errors and gaps that document-based SE can't. *Self-check rubric:* full credit if you mention (1) a single queryable model, (2) auto-updated dependency matrices, (3) negative space / orphan detection, and (4) timestamped coverage metrics for trend monitoring.

## Challenge exercises (Tier 3 — analyze/evaluate)

H1. **Coverage-metric plan.** Design a plan to monitor whether every system requirement is verified by a test case over the life of a project. Which relationship and which artifact do you use, and why does the *timestamp* matter?

H2. **Build the map yourself.** You are given these nodes for one requirement's traceability story: `SRD v2.1`, `Business Req`, `derived System Req`, `refined Use Case`, `Test Case`, `Architecture Component`. Draw (describe) the edges that map this requirement's provenance, labeling each edge with the relationship the source associates with it.

H3. **Interleaved set (decide which concept applies).** For each item, first decide *which tool/concept* is the right one — table, dependency matrix, negative-space matrix, coverage metric, dependency map, stereotype, or package — then say why. (This deliberately mixes this topic with its sibling ideas.)
   (a) "We want to know how requirement-test coverage has changed across the last three months."
   (b) "We suspect a relationship was drawn backwards."
   (c) "We need to find business requirements mapped to nothing."
   (d) "We want to add a 'safety-critical' dimension without deepening the folder tree."
   (e) "Before changing a top-level requirement, we want to see every domain it touches."
   (f) "We need a folder-like hierarchy to cluster requirements by subsystem."

H4. **Evaluate a design.** A colleague proposes a 6-layer package tree, no stereotypes, and a single combined requirement diagram showing all 200 requirements. Critique this against the source's guidance and propose fixes.

---

## Solutions & explanations

**W1.** MBSE is a formalized methodology supporting requirements, design, analysis, verification, and validation of complex systems; its structural difference is that a single digital model — not documents — is authoritative (source: m2-mbse).

**W2.** Requirements/capabilities, behavior, architecture/structure, and verification & validation (source: m2-mbse).

**W3.** Business → user → system. Example "ility": security (also usability, testability, modifiability) (source: m2-mbse).

**W4.** business → SysML business requirement; user → generic requirement + user stereotype; system functional → generic requirement + system stereotype OR functional subclass; system non-functional → design constraint / usability / performance / interface / physical requirement (source: m2-mbse).

**W5.** ~3 layers in most cases; if more are needed, redesign the structure wider and flatter (source: m2-mbse).

**C1.** (a) business → SysML business requirement. (b) user → generic + user stereotype. (c) system non-functional ("ility": availability/recoverability) → design constraint or other non-functional type. (d) system non-functional (performance) → performance requirement (source: m2-mbse).

**C2.** **Invalid.** Rule: a business requirement is high-level and cannot be derived from any other requirement, so its "Derived From" must be empty. Error type: wrong-direction relationship (source: m2-mbse).

**C3.** **Invalid.** A system requirement is low-level and can only be derived, so its "Derived" column must be empty. Here "Derived = System Requirement 30" is populated → wrong-direction error. (Its empty "Derived From" is itself a separate concern — it may also be an orphan — but the populated "Derived" is the rule violation.) (source: m2-mbse).

**C4.** Don't add a 4th layer — deeper trees inhibit navigation and the source caps practical depth at ~3 layers. Apply a **stereotype** (a tag with its own properties) for the protocol dimension; you can then surface it via a table column or a "Used By" view (source: m2-mbse).

**C5.** A negative "Derive" matrix shows requirements that have **no** "Derived From" relationship — the negative space. It surfaces **orphaned requirements**; the source's named example is **unmapped business requirements** (source: m2-mbse).

**C6.** Model answer: MBSE keeps everything in one formal, queryable model instead of scattered documents (source: m2-mbse). Because relationships live in the model, dependency matrices for Verify/Derive/Satisfy update automatically and act as verification tools (source: m2-mbse). Negative-space matrix views reveal absence — orphaned/unmapped requirements you'd never spot by reading documents (source: m2-mbse). Timestamped coverage metrics let you watch coverage trend over time, which static documents can't do (source: m2-mbse).

**H1.** Use the **Verify** relationship between each system requirement and a test-case activity; the artifact is the **Verify dependency matrix** (and its negative space to find unverified requirements). Compute a **coverage metric** of "% requirements with a Verify link," and recompute it periodically — the **timestamp** turns single snapshots into a trend, letting you see whether verification coverage is improving or regressing over the project (source: m2-mbse).

**H2.** Edges (relationship in parentheses): `Business Req` is published in `SRD v2.1` (provenance/SRD version); `derived System Req` ← `Business Req` (**derive**); `refined Use Case` ← `System Req` (**refine**); `Test Case` verifies `System Req` (**verify**); `Architecture Component` ← `System Req` (**satisfy**). This is exactly the provenance a requirement diagram maps (source: m2-mbse). (The relationship definitions live in [08-sysml-modeling](../08-sysml-modeling/fundamentals.md).)

**H3.** (a) **coverage metric** — timestamped, monitors change over time. (b) **table** — its column view exposes wrong-direction relationships. (c) **negative-space (Derive) matrix** — surfaces unmapped/orphaned business requirements. (d) **stereotype** — orthogonal tag without deepening the tree. (e) **dependency map** — top-of-tree view across testing/security/docs/behavior for impact analysis. (f) **package** — folder-like hierarchy for clustering by subsystem (source: m2-mbse).

**H4.** Critique: 6 layers exceeds the ~3-layer guidance and inhibits navigation; no stereotypes forces extra dimensions into the over-deep tree; a single 200-requirement diagram will be "too busy and hard to understand." Fixes: redesign the package tree wider and flatter (~3 layers), use stereotypes for orthogonal dimensions, and split high-level and system-level requirement diagrams instead of one combined diagram (source: m2-mbse).
