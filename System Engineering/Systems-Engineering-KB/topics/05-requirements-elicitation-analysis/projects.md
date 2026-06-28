# Eliciting & Analyzing Requirements — Projects

## Guided project

**Elicitation deliverable for a new system.** Produce a requirements package for a system in the course's domain — pick the **smart home thermostat** (Wi-Fi, mobile-app and voice control, learns user behavior) or the **communication satellite** (broadband for remote regions) (source: m2-ex-elicit, m2-intro).

**Goal:** gather, classify, prioritize, and trace at least five requirements from distinct stakeholder types.

**Requirements (deliverables):**
- At least five requirements drawn from ≥3 stakeholder types (e.g., End User, Regulatory Body, Engineer) (source: m2-ex-elicit).
- Each requirement clear and specific (no vague terms) (source: m2-elicit).
- A classification (functional / non-functional / constraint / domain) per requirement (source: m2-elicit, master-notes).
- A priority label (High / Medium / Low / N/A) per requirement (source: m2-elicit).
- A source/stakeholder attribution per requirement (traceability to source) (source: m2-elicit).

**Suggested steps & checkpoints:**

1. **Pick methods.** Choose at least two elicitation methods and justify each by its advantages/challenges.
   - *Done:* a one-line rationale per chosen method (source: master-notes).
2. **Elicit.** Generate the raw needs; capture at least one need per stakeholder type.
   - *Done:* ≥5 raw needs, each tagged with its stakeholder.
3. **Refine for clarity.** Rewrite any vague need into a measurable "shall" statement.
   - *Done:* no statement contains undefined terms like "good" or "fast" (source: m2-elicit).
4. **Classify & prioritize.** Fill a table with columns: Requirement | Stakeholder | Type | Priority.
   - *Done:* every row has all four columns filled; at least one High and one Low.
5. **Resolve a conflict.** Identify (or inject) one conflict and record how you balanced it.
   - *Done:* a short note explaining the trade-off (source: m2-elicit).
6. **Trace.** For one requirement, write the chain need → goal → design → implementation → testing.
   - *Done:* a five-link chain for at least one requirement (source: m2-elicit).

## Independent (challenge) project

**Goal:** produce a full elicitation + analysis package for a *new* system not worked in the material (e.g., an autonomous delivery robot or a piece of clinical software) — domains the material only sketches (source: m2-elicit).

**Constraints:**
- ≥7 requirements across ≥3 stakeholder types, including at least one **domain requirement** tied to a named standard (model on UL 1023 / ENERGY STAR) (source: master-notes, m2-ex-elicit).
- Surface at least one **non-functional**, one **implicit**, and one **interoperability** requirement and note why each was hard to elicit (source: m2-ex-elicit).
- Provide a prioritized table with High/Medium/Low/N/A and resolve at least one performance-vs-cost conflict (source: m2-elicit).
- (Forward link only — out of scope here) checking each requirement is SMART/verifiable belongs to [06-verifying-requirements](../06-verifying-requirements/README.md); recording traceability *types* and managing change belongs to [07-requirements-management](../07-requirements-management/README.md).

## Build notes & solution sketch

- **Architecture of the deliverable:** a single requirements table (Requirement | Stakeholder | Type | Priority) plus a short methods-rationale and one traceability chain — this mirrors the m2-ex-elicit reference table (source: m2-ex-elicit).
- **Key decision — method mix:** combine a *depth* method (interview/workshop) with a *coverage* method (survey) and a *behavior* method (observation/document review). Rationale: each method's advantages cover the others' challenges — surveys scale where interviews don't; observation catches what surveys miss (source: master-notes).
- **The hard parts:** (1) non-functional requirements — probe quality attributes explicitly because users won't volunteer them; (2) implicit requirements — confirm assumptions out loud (offline operation); (3) interoperability — verify the assumed integration actually exists before writing it as satisfiable (source: m2-ex-elicit).
- **Conflict resolution:** when performance and cost collide, prioritize and find a balance rather than promising both; record the chosen priority labels as evidence of the decision (source: m2-elicit).
- **Where to stop:** classify and prioritize here; do not author SMART rewrites or a full traceability matrix — those are owned by topics 06 and 07 respectively.
