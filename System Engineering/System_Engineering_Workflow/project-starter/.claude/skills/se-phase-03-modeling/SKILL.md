---
name: se-phase-03-modeling
description: Runs Phase 03 (Modeling / MBSE) of the systems-engineering workflow. Turns the baselined SyRS into a SysML single source of truth — a working set of seven PlantUML diagrams (Use Case, Block Definition, Internal Block, State Machine, Activity, Sequence, Requirements) plus the MBSE analytical layer (dependency matrices, negative-space orphan detection, timestamped coverage metrics, packages, stereotypes) — so every requirement is satisfied by at least one block and verified by at least one test case before architecture begins. Use when the user wants to model the system, draw SysML/PlantUML, build a BDD/IBD/state machine/activity/sequence/use-case/requirements diagram, stand up the MBSE model, link requirements to design blocks, find orphan requirements, or clear the model-coverage gate. Triggers on phrasings like "model the system", "draw the SysML", "make the BDD", "build the IBD", "state machine diagram", "activity diagram for X flow", "sequence diagram", "requirements traceability diagram", "MBSE coverage matrix", "find orphan requirements", "phase 3 modeling".
disable-model-invocation: true
user-invocable: true
---

# Phase 03 — Modeling (MBSE)

<what-to-do>

Build the SysML single source of truth from the baselined SyRS: the 7-of-9 PlantUML diagram working set **plus** the MBSE analytical layer (matrices, negative-space, coverage metrics) that turns those diagrams into a queryable model. **Exit gate: the Model Coverage gate** — every `REQ-*` is *satisfied* by ≥1 block and *verified* by ≥1 (placeholder) test case, with zero un-explained orphans. This phase conforms to `../../../se-workflow/05_Conventions.md` for all IDs, gates, T/I/A/D methods, severities, and diagram conventions (Conventions §7 is the authoritative SysML notation contract).

## Inputs (from prior phases)

Read these before asking the user anything; reuse their facts, never re-elicit them:

- **`Phase_02_Requirements/SysRS.md`** — the authoritative `REQ-*` set (classes F/U/P/O/SEC/INT/C/D/SAF), Modes & States section (seeds the State Machine), system-overview/decomposition (seeds the BDD), MOP/TPM rows. **This is the spine input.**
- **`Phase_02_Requirements/Traceability_Matrix.md`** — `SN → REQ` links and any seeded `TC-VER-*` defaults; mirror them, don't reinvent them.
- **`Phase_01_Concept/Stakeholder_Mission.md` + `OpsCon.md`** — actors and operational scenarios (`SCN-*`) for the Use Case, Activity, and Sequence diagrams.
- **Cross-cutting registers** (if present): `_cross_cutting/Hazard_Log.md` (`HAZ-*`), `Threat_Model.md` (`THR-*`), `TPM_Tracker.md` — model elements that satisfy a `SAF-*` or `SEC-*` REQ should trace back to these.

**Graceful fallback:** if the SyRS is missing or not baselined, offer to route back to `se-phase-02-requirements`, or proceed with the user supplying the REQ list inline (mark the model `Status: Draft` and flag "built on un-baselined requirements — re-verify coverage after SRR"). If Phase 1 actors/scenarios are absent, elicit only the actors and one golden-path scenario needed for the behavioral diagrams.

## Step-by-step

Work **one topic at a time** — ask, draft the `.puml`, show it back, confirm, then move on. Use `AskUserQuestion` for finite choices. Never dump all questions at once.

1. **Read prior artifacts & confirm output path.** Default `<output-dir>/<slug>/Phase_03_Modeling/`. Create the folder. Summarise back to the user: actor list (from Phase 1), REQ count by class (from SyRS), and the Modes & States list — so they can correct stale inputs before modeling.
2. **Set the build mode.** `AskUserQuestion`: *"Build all seven diagrams now, or one at a time with review between each?"* (default: one at a time). Also confirm the **tool tier** — PlantUML for a documentation model (default), or escalate to a live MBSE tool (see Decision points + the SysML-v2 forward-note).
3. **Decide diagram order.** Build in this dependency sequence; each diagram consumes the prior ones:

   | # | Diagram | File | Builds on |
   |---|---|---|---|
   | 1 | Use Case | `Use_Case_Diagram.puml` | Actors (Ph.1) + Functional `REQ-F-*` |
   | 2 | Block Definition (BDD) | `BDD.puml` | System decomposition (SyRS overview) |
   | 3 | Internal Block (IBD) | `IBD_<TopBlock>.puml` | The most critical block from the BDD |
   | 4 | State Machine | `State_Machine.puml` | Modes & States (SyRS) |
   | 5 | Activity | `Activity_<Scenario>.puml` | One golden-path `SCN-*` flow |
   | 6 | Sequence | `Sequence_<Interaction>.puml` | One time-ordered multi-actor interaction |
   | 7 | Requirements | `Requirements_Diagram.puml` | All `REQ-*` with the 7 relationships |

4. **Diagram 1 — Use Case.** Pull actors from the stakeholder table; group `REQ-F-*` that serve one user goal into one use case. Use `<<include>>` for shared sub-flows (e.g. "Authenticate" included by "Start Session") and `<<extend>>` for optional/exception flows. Write the `.puml`. Record which REQs each use case `<<refine>>`s (a use case refining a functional requirement — a **refine**, not a derive).
5. **Diagram 2 — BDD.** With the user, decompose top-down. Ask (one block at a time if large): top-level block (project name); 5–8 primary sub-blocks; per sub-block — typed attributes (value properties) and operations. Pick connectors deliberately (see Decision points): `*--` composition, `o--` aggregation, plain line association, `<|--` generalization. Keep ≤12 blocks per diagram; split into per-subsystem BDDs if larger. Write `BDD.puml`. The BDD is a **living document** — note that it will sharpen during IBD/ICD work.
6. **Diagram 3 — IBD.** Pick the most critical block (usually the local controller / service mesh). Elicit its internal parts and **ports**: *standard ports* for interface-based interactions (service/operation calls) and *flow ports* for material/energy/data exchange. Show signal/data/physical flow between parts. Write `IBD_<TopBlock>.puml`.
7. **Diagram 4 — State Machine.** Encode the SyRS Modes & States: states, transitions `event [guard] /action`, entry/exit actions, orthogonal regions for overlays (e.g. a Maintenance region over operational states). Do **not** invent transitions — if Modes & States is incomplete, mark `TODO: <owed transition>` and loop back to the user. Write `State_Machine.puml`.
8. **Diagram 5 — Activity.** Model the system's golden-path `SCN-*` (e.g. charge session, intrusion response, transaction settlement). Fork/join for concurrency, decision diamonds for branches, swimlanes for responsible blocks. Annotate which `REQ-*` each step satisfies. (FFBD is an acceptable alternative when the audience wants pure functional sequencing with no concurrency — see Decision points.) Write `Activity_<Scenario>.puml`.
9. **Diagram 6 — Sequence.** Model one time-critical multi-actor interaction (e.g. a Plug-&-Charge handshake, OAuth flow, OTA rollout). Lifelines per actor/block; synchronous solid arrows for blocking calls, asynchronous open arrows for fire-and-forget. Annotate latency budgets from `REQ-P-*` (and the `MOP-*`/`TPM-*` they feed). Write `Sequence_<Interaction>.puml`.
10. **Diagram 7 — Requirements (the traceability backbone).** Iterate **every** `REQ-*` and apply the correct one of the **7 SysML relationships** (Conventions §7 vocabulary):
    - **derive** (REQ→REQ only): lower REQ analytically derived from a higher one, adding constraints — direction is `<<derive>>` from the **derived (lower)** REQ *to* its **source (higher)** REQ. A derive may **only** connect two requirements.
    - **refine** (model element ↔ REQ): a use case / activity / state clarifies a REQ's meaning. May connect a REQ to *any* model element.
    - **satisfy** (block → REQ): a design block allocates/fulfils a REQ — an **assertion, not proof**.
    - **verify** (test case / I-A-D activity → REQ): proof that the REQ is met; use `TC-VER-TBD` placeholders until Phase 07 assigns real IDs.
    - **containment/composite** (parent REQ ⬦— child REQs): a compound REQ ("shall do A and B") decomposed into sub-REQs by namespace nesting — the structural decomposition the audit found missing.
    - **copy** (copy REQ ⤳ master REQ): a read-only mirror of a reused/regulatory master REQ, with its own ID — for `C-*`/`D-*`/`SEC-*` constraints reused across product lines.
    - **trace** (any↔any): the weak general dependency — use **sparingly**, only when none of the above fits (e.g. linking to a source document).
    Type each REQ in the diagram by its class → SysML subtype mapping (see Deliverables). Write `Requirements_Diagram.puml`; split into high-level vs system-level diagrams if one becomes unreadable.
11. **Build the MBSE analytical layer** (`Model_Coverage.md` + matrices). This is what makes the model a *model* and not seven pictures:
    - **Satisfy matrix** — REQ rows × block columns; cell = satisfy link. **Negative space:** list every REQ with **no** satisfy link → orphan REQ.
    - **Verify matrix** — REQ rows × test-case columns; cell = verify link (placeholders OK). Negative space → unverified REQ.
    - **Derive (negative) matrix** — REQ rows with their "Derived From" / "Derives" columns. Empty-column rules from KB topic 09: a top-level / business-class REQ must have **empty "Derived From"**; a leaf system REQ must have **empty "Derives."** A violation = a **wrong-direction** relationship error → fix the arrow.
    - **Orphan-block list** — blocks in the BDD that satisfy no REQ (gold-plating or a missing REQ).
    - **Coverage metrics (timestamped):** `% REQ satisfied`, `% REQ verified`, `# orphan REQ`, `# orphan blocks`. **Record the date.** Re-running this phase appends a new dated row so coverage is tracked **over time**, not as a one-off number.
12. **Coverage check & gate.** Print the metric table + the four orphan lists. **Block "done" if any REQ lacks a satisfy *or* a verify link, or any wrong-direction error remains** — render the gap visibly (e.g. a REQ node with a `TODO: assign satisfier` note) rather than silently omitting it.
13. **Done.** Print all generated paths, the render command (`plantuml *.puml`, or the VS Code PlantUML extension), and the coverage snapshot. Recommend `se-phase-04-architecture` (choose the framework, freeze the ICD seams the IBD ports imply, write the tech-stack rationale).

## Decision points

| Decision | How to decide |
|---|---|
| **Composition (`*--`) vs aggregation (`o--`) vs association** | Composition = the part **cannot exist** without the whole and the whole owns its lifecycle (a station's contactor). Aggregation (`o--`, open diamond) = a **shared** part with independent lifecycle (a cloud service used by many stations). Plain association = a loose "uses/has-a" with no ownership. **Reconcile the connector meaning:** in this workflow `o--` means **aggregation** (open diamond) — never label it "composes"; that word is reserved for `*--`. |
| **derive vs refine** (the most-confused pair) | `derive` is **REQ→REQ only**, comes from **analysis**, and **adds constraints** (acceleration REQ → engine-power REQ). `refine` connects a REQ to **any model element** and only **clarifies meaning** (an activity diagram refining a functional REQ). Pointing a `derive` at a block or diagram is illegal — use `refine` or `satisfy`. |
| **containment vs derive** for decomposition | If a compound REQ is split into sub-REQs that live *inside* it ("shall do A and B" → children A, B), that is **containment/composite** (namespace nesting), not derive. Use derive when the child is a *separate, analytically-derived* REQ at the next level down. |
| **copy vs trace** for reused REQs | A regulatory/contractual REQ reused verbatim across product lines = **copy** (read-only mirror, own ID). A weak pointer to a source doc or spec tree with no stronger semantics = **trace**. Prefer any meaningful relationship over trace. |
| **Which 2 of 9 diagrams to skip** | The default working set is **7 of 9** (Conventions §7). Add **Package** when the model exceeds ~3 navigable layers or many subsystems (organise wide-and-flat, ≤3 layers per KB topic 09). Add **Parametric** only when the system has hard parametric/physical constraints (battery-life eqn, thermal, cost model) tied to a `REQ-P-*`. State "7 of 9" so SysML readers aren't confused. |
| **Activity diagram vs FFBD** | Use a SysML **Activity** diagram when you need concurrency (fork/join), object flow, or swimlanes. Use an **FFBD** when the audience wants pure functional sequencing/control flow (Start → Scan → Navigate → Deliver → Return → Standby) with branches/loops and no concurrency. FFBD is an option, not a mandated deliverable. |
| **PlantUML vs a real MBSE tool** | Stay on PlantUML for a documentation model that diffs in git. **Escalate** to Cameo / Capella / Sparx (a live model + digital thread) when you need *auto-updating* matrices, model-wide queries, multi-user concurrency, requirement re-use across programs, or formal SysML-v2 — see the forward-note. |

## Rules

- **Conform to `../../../se-workflow/05_Conventions.md`** for every ID grammar (`REQ-<class>-nn`, `TC-VER-nn`, `HAZ-`, `THR-`), the Model-Coverage gate, T/I/A/D verification methods, S1–S4 severity, baseline-status strings, and the SysML notation contract (§7). **Cross-reference, never redefine** — if you need a shared convention, cite the section.
- **One topic at a time.** Ask → draft `.puml` → show back → confirm → next. No walls of questions.
- **PlantUML, not ASCII.** Output is always renderable `.puml` text; `@startuml <Slug>_<Kind>` / `@enduml` and a `title` on every file; stereotype every block `<<block>>`, actor `actor`, use case `usecase`, requirement `<<requirement>>`, test case `<<testCase>>`.
- **Reuse prior-phase facts.** Read Phase 1/2 outputs; never re-ask for actors, REQs, modes, or scenarios already captured.
- **Never invent numbers or transitions.** Latency budgets come from `REQ-P-*`; states come from the SyRS. Unknowns are `TODO: <owed>`, never fabricated.
- **All 7 relationships are in scope** — containment and copy are not optional; use whichever fits. Get the **derive direction** right (derived→source). Use `trace` only as a last resort.
- **Don't copy the worked example's numbers blindly.** The EVCN model is structural reference only; this project's REQs, blocks, and metrics are its own.
- **No silent omissions.** Every REQ appears in the Requirements diagram and the matrices; every gap is rendered as a visible `TODO`.

</what-to-do>

<supporting-info>

## Deliverables & output shapes

Blank versions live in `../../../se-workflow/templates/diagrams/` (and `../../../se-workflow/templates/Model_Coverage_Matrix.md`).

**1. The 7 PlantUML diagrams** (file names per Conventions §7): `Use_Case_Diagram.puml`, `BDD.puml`, `IBD_<TopBlock>.puml`, `State_Machine.puml`, `Activity_<Scenario>.puml`, `Sequence_<Interaction>.puml`, `Requirements_Diagram.puml`. (+ optional `Package.puml` / `Parametric_<eqn>.puml`.)

**2. `Model_Coverage.md`** — the MBSE analytical layer:

```markdown
# Phase 03 — Model Coverage  (<slug>)
Status: Draft | In Review | Baseline (Model-Coverage-gate-approved <date>)

## Coverage metrics (timestamped — append a row per re-run)
| Date | % REQ satisfied | % REQ verified | # orphan REQ | # orphan blocks |
|------|-----------------|----------------|--------------|-----------------|

## Satisfy matrix (REQ × block) + negative space
| REQ | Satisfied by block(s) | Orphan? |
## Verify matrix (REQ × TC) + negative space
| REQ | Verified by (TC-VER-* / I/A/D) | Orphan? |
## Derive direction check (KB topic 09 empty-column rule)
| REQ | Derived From | Derives | Wrong-direction? |
## Orphan blocks (in BDD, satisfy no REQ)
## Open TODOs (owed satisfiers / verifiers / transitions)
```

**3. REQ class → SysML subtype map** (anchor typing to KB topics 08/09; keep this in `Model_Coverage.md`):

| Conventions class | SysML requirement subtype / stereotype |
|---|---|
| `F` Functional | functional requirement |
| `U` Usability | usability requirement |
| `P` Performance | performance requirement |
| `O` Operational/Reliability | extended/generic requirement + «reliability» stereotype |
| `SEC` Security | generic requirement + «securityControl» stereotype |
| `INT` Interface | interface requirement |
| `C` Constraint | design constraint |
| `D` Domain | design constraint + «domain/standard» stereotype |
| `SAF` Safety | generic requirement + «safety» stereotype |

(MBSE three-level lens from KB topic 09: **business → user → system**; this phase models the **system** level, tracing up to user/business needs via `SN-*`.)

## AI prompt pack

- **ELICITATION (BDD decomposition):** "From `SysRS.md`, propose a top-level block and 5–8 sub-blocks for `<system>`. For each, list typed attributes and operations, and tell me which connector (composition `*--` / aggregation `o--` / association) fits and why. Ask me one clarifying question per ambiguous block — don't assume."
- **ELICITATION (states):** "Read the Modes & States section of `SysRS.md`. List the states, and for each transition give `event [guard] /action`. Flag any state with no exit transition or any event with no source state as `TODO` — do not invent transitions."
- **GENERATION (requirements diagram):** "For every `REQ-*` in `SysRS.md`, emit a PlantUML requirements diagram applying the correct one of the 7 SysML relationships (derive REQ→REQ only and pointing derived→source; refine for model elements; satisfy block→REQ; verify TC→REQ with `TC-VER-TBD` placeholders; containment for compound REQs; copy for reused regulatory REQs; trace only as last resort). Stereotype each REQ by its class→subtype map."
- **GENERATION (coverage layer):** "Build the satisfy and verify matrices and the derive-direction check from the diagrams. Compute timestamped coverage metrics and list every orphan REQ, orphan block, and wrong-direction error."
- **CRITIQUE / RED-TEAM:** "Adversarially review this model. Find: (1) any `derive` connecting a REQ to a non-REQ; (2) any business/top-level REQ with a non-empty 'Derived From', or any leaf REQ with a non-empty 'Derives' (wrong-direction); (3) REQs satisfied but not verified (assertion-without-proof); (4) orphan REQs and gold-plated orphan blocks; (5) `trace` links that should be a stronger relationship; (6) states/transitions invented beyond the SyRS. List each with the fix."

## Research & specialised-agent triggers

- **Web research when:** the domain mandates a specific modeling/architecture standard or profile (e.g. SysML-v2, ARP4754A model expectations, AUTOSAR, UAF/DoDAF, a regulator's MBSE submission format); you need current **tool capability** comparisons (Cameo vs Capella vs Sparx — SysML-v2 support, matrix/digital-thread features); or a comparable published system model exists to benchmark decomposition against. Look up the *named* standard/tool version, not generic "MBSE."
- **Spawn a specialised agent when:** the SyRS is large (≫30 REQs) and you want a **modeling agent** to draft all 7 diagrams + matrices in parallel for human review; or a **traceability-audit agent** to run the negative-space/wrong-direction checks across the whole model; or a **domain-expert agent** (safety, security) to validate that `SAF-*`/`SEC-*` blocks correctly satisfy the hazard/threat-derived REQs and trace to `HAZ-*`/`THR-*`.

## Cross-cutting hooks

Links to `../../../se-workflow/cross-cutting/<file>.md`:

- **Measurement (MOE/MOP/TPM)** — *feeds*: sequence/activity diagrams annotate `REQ-P-*` latency/throughput budgets that become `MOP-*`/`TPM-*`; the model is where TPM-bearing behaviours are first made concrete. → `Measurement_MOE_MOP_TPM.md`.
- **Safety/RAMS** — *consumes* `HAZ-*`: blocks satisfying a `SAF-*` REQ must trace to a hazard; the State Machine encodes safe-state transitions. → `Safety_RAMS_Engineering.md`.
- **Security** — *consumes* `THR-*`: «securityControl» stereotypes on `SEC-*` REQs; trust boundaries appear as IBD port groupings. → `Security_Engineering.md`.
- **Configuration Mgmt** — *feeds*: each `.puml` and `Model_Coverage.md` is a versioned CI; the model baselines at the gate and changes only via `CR-*`. → `Configuration_Management.md`.
- **Risk** — *feeds*: orphan REQs / un-modelled scenarios are surfaced as `RSK-*` candidates. → `Risk_and_Opportunity_Management.md`.
- **Quality** — coverage metrics are a QA gate input. → `Quality_Assurance.md`. (HSI and Cost/Schedule are touched only indirectly this phase: usability use cases feed HSI; no direct cost output.)

## Standards anchor

This phase realises **ISO/IEC/IEEE 15288:2023 — System Analysis** (model-based), supporting Architecture/Design Definition (Phase 04). It applies **OMG SysML** (v1.x via PlantUML today; **SysML v2** is the forward target — see note) within the practice of **INCOSE SE Handbook v5 (2023)** and **NASA/SP-2016-6105 Rev 2** MBSE guidance. Requirement relationships and traceability conform to **ISO/IEC/IEEE 29148:2018** (the SyRS being modelled) and feed **ISO/IEC/IEEE 42010:2022** architecture views downstream. Bidirectional model traceability is **mandatory** for safety-critical/regulated work (DO-178C, ISO 26262, IEC 62304).

> **SysML v2 / digital-thread forward-note.** PlantUML gives a git-diffable v1.x documentation model — ideal here. The day you need *auto-updating* dependency matrices, model-wide queries, requirement re-use across programs, a live **digital thread**, or formal SysML-v2 (textual + graphical, API-first), escalate to a real MBSE tool (Cameo/Capella/Sparx) and treat these `.puml` files as the migration source. Record the escalation as a `DEC-*` in Phase 05.

## Exit-gate checklist

The **Model Coverage gate** passes when:

- [ ] All 7 mandated diagrams exist as renderable `.puml` (Package/Parametric added if size/parametrics warrant; "7 of 9" stated).
- [ ] **Every `REQ-*` is *satisfied* by ≥1 block** (satisfy matrix has no negative-space orphan, or each orphan carries a justified `TODO`/`tailored out`).
- [ ] **Every `REQ-*` is *verified* by ≥1 test case or I/A/D activity** (placeholders OK; verify matrix has no un-justified orphan).
- [ ] **Derive-direction check is clean** — no business/top-level REQ with a "Derived From", no leaf REQ with a "Derives"; all derives connect REQ→REQ.
- [ ] No orphan blocks without explanation; no `trace` link that should be a stronger relationship.
- [ ] State Machine covers every SyRS mode/state with no invented transitions.
- [ ] Coverage metrics computed **and timestamped** in `Model_Coverage.md`.
- [ ] Model status set (`Draft`/`In Review`/`Baseline`) and registered as CIs for Config Mgmt.

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Parent→child REQ link labelled `<<refine>>`. | derive/refine confusion. | REQ→REQ from analysis = **derive** (or **containment** if it's namespace decomposition); refine is REQ↔model-element only. |
| `derive` arrow points child→...wait, source→child. | Direction reversed. | Direction is **derived (lower) → source (higher)**; the derive check column catches it. |
| `o--` described as "composes". | Connector meaning drift. | `o--` = **aggregation** (open diamond, shared part); `*--` = **composition**. Never call `o--` "composes". |
| Only 5 relationships used. | containment + copy dropped. | All **7** are in scope: add containment for compound REQs, copy for reused regulatory REQs. |
| Coverage is one static table. | No timestamp / no re-run. | Append a **dated** metrics row each run; watch the trend (KB topic 09). |
| Orphan REQs/blocks slip through. | No negative-space view. | Build the **negative** satisfy/verify/derive matrices that show absence, not just presence. |
| Diagram unreadable. | >12 entities in one diagram. | Decompose (per-subsystem BDD); split high-level vs system-level Requirements diagrams; consider a Package diagram. |
| Satisfy treated as proof. | Assertion≠proof. | Back **every** satisfy with a `verify` to a test case / I/A/D. |
| State machine missing transitions. | SyRS Modes & States incomplete. | Loop back to the user; mark `TODO`; never invent transitions. |

## References

- `../../../se-workflow/05_Conventions.md` — §2 IDs · §3 gates/baselines · §4 T/I/A/D · §7 diagrams + the 7-relationship vocabulary (the contract). 
- `../../../se-workflow/01_Workflow_Overview.md` — the 12-stage spine; Phase 03 = 15288 System Analysis (model-based).
- KB: `Systems-Engineering-KB/topics/08-sysml-modeling/fundamentals.md` (9 diagrams, 4 categories, 7 relationships, derive/refine/satisfy/verify, BDD vs IBD, ports).
- KB: `Systems-Engineering-KB/topics/09-mbse-requirements/fundamentals.md` (typing/stereotypes, packages wide-and-flat, **matrices, negative space, coverage metrics, wrong-direction detection**).
- KB: `Systems-Engineering-KB/topics/14-documenting-architecture/fundamentals.md` (BDD/IBD/ICD/**FFBD**, composition/aggregation/association, standard vs flow ports).
- `../../worked_example/Phase_03_Modeling/` — structural reference only (do not copy its numbers).
- Related phases: `se-phase-02-requirements` (input SyRS) · `se-phase-04-architecture` (consumes blocks/ports → ICD) · `se-phase-07-verification` (resolves `TC-VER-TBD` placeholders).

</supporting-info>
