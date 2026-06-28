# Requirements in Model-Based Systems Engineering (MBSE) — Examples

Every example is grounded in *m2-mbse*. Blanked steps are answered in the **Solutions** section at the bottom.

## Simple example — classify a requirement and map it to SysML

**Goal:** type three requirements and choose the correct SysML representation for each.

Given:
- R1: "The organization needs to reduce customer onboarding cost by 20%."
- R2: "An applicant wants to submit documents from a phone."
- R3: "All data in transit shall be encrypted (security)."

Worked solution, with a one-line reason per step:

1. **R1 is a *business requirement*** — it states an organizational goal/need (reduce cost) (source: m2-mbse). → Map to **SysML business requirement** (source: m2-mbse).
2. **R2 is a *user requirement*** — it states how a stakeholder wants to interact with the solution, mid-level (source: m2-mbse). → Map to **SysML generic requirement + user requirement stereotype** (source: m2-mbse).
3. **R3 is a *system non-functional requirement* (an "ility": security)** — a quality attribute the solution must have (source: m2-mbse). → Map to a **SysML design constraint** (or another non-functional type such as performance/interface/physical/usability) (source: m2-mbse).

Result: business → business requirement; user → generic+user stereotype; non-functional system → design constraint (source: m2-mbse).

## Intermediate example — diagnose a requirements table (completion problem)

**Goal:** find the wrong-direction errors in a table with "Derived" and "Derived From" columns. This mirrors the source's Figure 7 (source: m2-mbse).

| Row | Requirement | Type | Derived | Derived From |
|---|---|---|---|---|
| 1 | Business Requirement 13 | business | User Requirement 24 | User Requirement 14 |
| 2 | System Requirement 7 | system | System Requirement 19 | Business Requirement 13 |
| 3 | User Requirement 14 | user | — | Business Requirement 13 |

Worked steps:

1. **Recall the rules.** Business requirements are high-level and cannot be derived from anything → their **"Derived From" must be empty**. System requirements are low-level and can only be derived → their **"Derived" must be empty** (source: m2-mbse).
2. **Row 1 (business).** "Derived From = User Requirement 14" is **populated** → error: a business requirement is shown as derived from a user requirement (source: m2-mbse).
3. **Row 2 (system).** "Derived = System Requirement 19" is populated → ____ (complete this — which column should be empty for a system requirement?).
4. **Row 3 (user).** No rule forbids a user requirement having either column → ____ (complete this — is row 3 an error?).

Fill the two blanks; the completed reasoning is in **Solutions**.

## Advanced example — read a negative "Derive" matrix to find orphans (strategy hint only)

**Goal:** from a Derive dependency matrix, identify orphaned requirements. Strategy hint: switch to the *negative* view, then apply the type rules.

Scenario: a model has business requirements BR-A, BR-B, BR-C and system requirements SR-1…SR-6. The standard Derive matrix shows derive links exist for BR-A→SR-1, BR-A→SR-2, BR-C→SR-5, SR-5→SR-6. The team wants to know which requirements are unmapped.

Do it yourself (steps deliberately blanked):
1. Generate the ____ matrix view to surface only requirements with no "Derived From" relationship (the negative space) (source: m2-mbse).
2. List the requirements appearing in that negative space.
3. Decide which of those are *expected* empties vs. genuine **orphans**, using the type rules.

Work it through, then check **Solutions**.

## Real-world case study — SEI CERT secure-by-design requirements modeling

**Situation.** The SEI CERT Division observed the common industry practice of adding security features late in development, which leaves systems insecure by default (source: m2-mbse).

**Approach.** CERT began researching MBSE (with SysML) so security risks are mitigated *early*, in the same digital model that holds requirements, behavior, architecture, and V&V. Security requirements are modeled as non-functional "ility" requirements; the requirement diagram even carries a special **security control** element type tying controls to security requirements (source: m2-mbse).

**Outcome (as the article frames it).** MBSE in a digital-modeling environment provides advantages document-based SE cannot — reducing development time/cost and improving the production of secure, correctly functioning software — which has driven growing adoption (source: m2-mbse).

**Lesson.** Putting requirements (including security "ilities") into a queryable model lets you verify coverage and trace security controls from the start — secure *by design* rather than secured later (source: m2-mbse). *Note:* the article forward-references the detailed security-control discussion to a future post — see [advanced.md](advanced.md) (source: m2-mbse).

## Guided walkthrough — from raw requests to a traceability story

A complete narration of how one requirement enters the model and earns its provenance (source: m2-mbse).

1. **Collect.** A sponsor verbally requests "faster onboarding"; a user forum asks for "phone uploads." These are raw requests in mixed forms (source: m2-mbse).
2. **Pre-process.** Classify, deduplicate, and rephrase them before they enter the model (source: m2-mbse).
3. **Type & map.** "Faster onboarding" → business requirement (SysML business requirement). "Phone uploads" → user requirement (generic + user stereotype) (source: m2-mbse).
4. **Organize.** Place them in a package tree no deeper than ~3 layers; if a new categorization dimension (e.g., "Protocols") is needed, apply a **stereotype** rather than deepening the tree (source: m2-mbse).
5. **Relate.** Derive a system requirement from the user requirement; have it **refine** a use case, be **verified** by a test case, and **satisfy** an architecture element. Establish these as relationships, not as co-located diagram boxes (source: m2-mbse).
6. **Tell the story.** Build a requirement diagram mapping provenance: SRD version published, requirements derived, use cases refined, test cases for verification, architecture satisfied (source: m2-mbse).
7. **Analyze.** Check the table (no wrong-direction errors), the Verify matrix (every requirement has a test case), the negative Derive matrix (no orphans), and the timestamped coverage metric (trending up) (source: m2-mbse).
8. **Project impact.** Generate a top-of-tree **dependency map** to see how a change ripples into testing, security, documentation, and behavior (source: m2-mbse).

---

## Solutions

**Intermediate example.**
- Step 3 (Row 2, system requirement): the **"Derived" column should be empty** for a system requirement, because it is low-level and can only be derived, never the source of a derivation. Row 2 has "Derived = System Requirement 19" populated → **error** (wrong-direction relationship) (source: m2-mbse).
- Step 4 (Row 3, user requirement): a user requirement sits midway between business and system, so being derived *from* a business requirement is fine and no rule is violated → **row 3 is NOT an error** (source: m2-mbse).
- Errors are in rows 1 and 2 — exactly the pattern of the source's Figure 7 (source: m2-mbse).

**Advanced example.**
1. Generate the **negative ("Derive") matrix**, which shows requirements without a "Derived From" relationship — the negative space (source: m2-mbse).
2. Requirements with no incoming Derive: **BR-A, BR-B, BR-C** (business reqs have no "Derived From" by definition) and **SR-3, SR-4** (system reqs with no parent). (SR-1, SR-2, SR-5, SR-6 all have a "Derived From".)
3. Apply the rules: business requirements *should* be empty in "Derived From" — so BR-A and BR-C are fine (they have outgoing derives), and **BR-B is an orphan** (a business requirement mapped to nothing — "unmapped business requirement," the source's named case). **SR-3 and SR-4 are orphans** too: system requirements should be derived but aren't (source: m2-mbse). Common wrong answer: flagging BR-A/BR-C as orphans for having an empty "Derived From" — that column is *expected* empty for business requirements; orphan-hunting for business reqs means looking for those with no *outgoing* derive (source: m2-mbse).
