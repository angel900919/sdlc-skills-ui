# Requirements in Model-Based Systems Engineering (MBSE) — Projects

Both projects are grounded in the methodology described in *m2-mbse*. They can be done in any SysML-capable MBSE tool, or on paper/spreadsheet if no tool is available (the source's analytical views — tables, matrices, metrics — all reproduce in a spreadsheet).

## Guided project — package structure, stereotype scheme, and coverage-metric plan

**Scenario.** You are modeling requirements for a small online onboarding system. Inputs arrive as a wishes document, a change request, and notes from a user forum (source: m2-mbse).

**Goal.** Produce (1) a wide-and-flat package structure, (2) a stereotype scheme, and (3) a coverage-metric plan that monitors verification coverage over time.

**Requirements.**
- At least 2 business, 3 user, and 5 system requirements (include 2 non-functional "ilities") (source: m2-mbse).
- Each requirement mapped to the correct SysML representation (source: m2-mbse).
- A package tree no deeper than ~3 layers (source: m2-mbse).
- At least one stereotype carrying its own property (source: m2-mbse).

**Suggested steps & checkpoints (each with a "done" criterion):**
1. **Pre-process inputs.** Classify, deduplicate, rephrase. *Done:* a flat list of unambiguous requirements, each typed business/user/system (source: m2-mbse).
2. **Map to SysML.** Assign each requirement its element type/stereotype per the mapping table. *Done:* every requirement has a SysML representation; non-functional ones use design constraint / usability / performance / interface / physical (source: m2-mbse).
3. **Design packages.** Cluster by functionality or subsystem; cap at 3 layers. *Done:* the deepest path is ≤3 packages and the tree is wider than it is deep (source: m2-mbse).
4. **Add a stereotype dimension.** Pick an orthogonal axis (e.g., "Protocols" or "Safety") and apply it as a stereotype with at least one property. *Done:* a "Used By"/table view lists every requirement bearing the stereotype (source: m2-mbse).
5. **Plan coverage metric.** Define the Verify-based metric (% requirements with a test-case link) and the recompute cadence. *Done:* a one-paragraph plan stating the relationship (Verify), the artifact (Verify matrix + negative space), the metric, and why the timestamp matters for trend monitoring (source: m2-mbse).

**Deliverables:** the typed requirement list with SysML mapping, the package tree, the stereotype definition, and the coverage-metric plan.

## Independent (challenge) project — a full traceable, secure-by-design requirements model

**Goal.** Build an end-to-end requirements model for a system of your choice that you can *analyze* for errors and gaps, with security treated as a first-class "ility."

**Constraints only (no steps given):**
- Cover at least the requirements domain end to end, and connect it to the other three MBSE domains via relationships (behavior, architecture/structure, V&V) (source: m2-mbse).
- Every requirement must earn a traceability story in a requirement diagram: SRD version, derived requirements, refined use cases, test cases, satisfied architecture (source: m2-mbse).
- Include security requirements as non-functional "ilities"; note (don't invent) where a **security control** element would attach — the source defers its detail to a future post (source: m2-mbse).
- Produce three analytical views that *find problems*: a table that catches a wrong-direction relationship, a negative-space Derive matrix that catches an orphan, and a timestamped coverage metric (source: m2-mbse).
- Keep packages wide-and-flat and use at least one stereotype dimension (source: m2-mbse).

**Stretch:** generate a top-of-tree dependency map and use it to write a short impact analysis for one proposed change (source: m2-mbse).

## Build notes & solution sketch

**Architecture of the model.** Requirements sit in a wide-and-flat package tree; orthogonal dimensions become stereotypes; relationships (derive/refine/satisfy/verify) connect requirements to use cases, test cases, and architecture. The analytical layer (tables, matrices, coverage metrics, dependency maps) is derived automatically from those relationships, so the work is in modeling clean relationships, not in maintaining the views (source: m2-mbse).

**Key decisions & why.**
- *Generic + stereotype vs. subclass for system functional requirements* — both are valid; the source allows either, and a middle course (business reqs + stereotyped generic reqs + other types) is recommended for balance (source: m2-mbse).
- *Stereotype, not a deeper package, for new dimensions* — preserves navigability under the ~3-layer rule (source: m2-mbse).
- *Separate high-level and system-level diagrams* once requirement count grows, to keep diagrams readable (source: m2-mbse).

**The hard parts (where teams get stuck).**
- Getting relationship *direction* right so tables don't flag business reqs with a "Derived From" or system reqs with a "Derived" — sanity-check with the table view early (source: m2-mbse).
- Distinguishing *expected* empties from real orphans in the negative matrix (a business requirement's empty "Derived From" is normal; an unmapped business requirement with no outgoing derive is the orphan) (source: m2-mbse).
- Remembering the coverage metric's value comes from *repeating it on a schedule* and reading the trend, not from any single number (source: m2-mbse).

**What the source does not specify:** exact metric formulas/thresholds, tool-specific UI steps, and the security-control element's mechanics (forward-referenced to a future post). Treat those as design choices or pointers, not facts to reproduce (source: m2-mbse).
