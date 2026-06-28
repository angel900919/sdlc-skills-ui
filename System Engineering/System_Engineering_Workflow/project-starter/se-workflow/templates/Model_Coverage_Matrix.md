---
Document: Model Coverage Matrix (MBSE analytical layer) — <Project Name>
Document ID: MODELCOV-<PROJECT_SLUG>-v1.0
Standard: OMG SysML (via PlantUML) · ISO/IEC/IEEE 15288:2023 (System Analysis)
Status: Draft
Owner: Lead Systems Engineer
---

# Model Coverage — <Project Name>

> **How to use this template.** Replace every `<ANGLE-BRACKET placeholder>`, resolve every
> `TODO:` marker, and delete the rows marked `(example — delete)`. This is the MBSE analytical
> layer that turns the 7 PlantUML diagrams into a queryable model — it is what makes the model a
> *model* and not seven pictures. All IDs, the Model-Coverage gate, T/I/A/D codes, and the SysML
> relationship/notation contract follow [../05_Conventions.md](../05_Conventions.md) (§7).
>
> **Exit gate (Model Coverage):** every `REQ-*` is *satisfied* by ≥1 block **and** *verified* by
> ≥1 test case (placeholders OK), with zero un-explained orphans and a clean derive-direction check.

---

## 1. Coverage metrics  (timestamped — append a row per re-run)

> Re-running Phase 03 appends a new dated row so coverage is tracked **over time**, not as a
> one-off number. Watch the trend.

| Date | % REQ satisfied | % REQ verified | # orphan REQ | # orphan blocks |
|------|-----------------|----------------|--------------|-----------------|
| <YYYY-MM-DD> | <n>% | <n>% | <n> | <n> |
| _2026-01-01_ | _80%_ | _60%_ | _2_ | _1_ | _(example — delete)_ |

---

## 2. Satisfy matrix  (REQ × block) + negative space

> Cell = a `satisfy` link (block → REQ). **Negative space:** any REQ with no satisfying block is
> an **orphan REQ** → fails the gate unless it carries a justified `TODO` / `tailored out`.

| REQ | Satisfied by block(s) | Orphan? |
|-----|-----------------------|---------|
| REQ-<id> | <Block_A>, <Block_B> | <No / **TODO: assign satisfier**> |
| _REQ-F-01_ | _<Controller> (example — delete)_ | _No_ |
| _REQ-O-03_ | _— (example — delete)_ | _**TODO: assign satisfier**_ |

---

## 3. Verify matrix  (REQ × test case) + negative space

> Cell = a `verify` link (test case / I-A-D activity → REQ). `TC-VER-TBD` placeholders are OK
> until Phase 07. **Negative space:** any REQ with no verify link is **unverified** → gate fail.
> A `satisfy` is an assertion; it is **not proof** — back every satisfy with a verify.

| REQ | Verified by (TC-VER-* / I / A / D) | Orphan? |
|-----|------------------------------------|---------|
| REQ-<id> | TC-VER-TBD <or I/A/D activity> | <No / **TODO: assign verifier**> |
| _REQ-F-01_ | _TC-VER-TBD (T) (example — delete)_ | _No_ |

---

## 4. Derive-direction check  (KB topic 09 empty-column rule)

> `derive` is **REQ → REQ only**, pointing **derived (lower) → source (higher)**. Empty-column
> rules: a top-level / business-class REQ must have an **empty "Derived From"**; a leaf system REQ
> must have an **empty "Derives."** A violation = a **wrong-direction** relationship → fix the arrow.

| REQ | Derived From | Derives | Wrong-direction? |
|-----|--------------|---------|------------------|
| REQ-<id> | REQ-<id> <or empty> | REQ-<id> <or empty> | <No / **YES — fix arrow**> |
| _REQ-F-01_ | _SN-01 (top-level: empty Derived-From OK)_ | _REQ-F-04 (example — delete)_ | _No_ |

---

## 5. Orphan blocks  (in the BDD, satisfy no REQ)

> A block satisfying no REQ is **gold-plating** or signals a **missing REQ** — resolve, don't ignore.

| Block | In diagram | Satisfies any REQ? | Action |
|-------|------------|--------------------|--------|
| <Block> | <BDD/IBD> | <No> | <TODO: add REQ or remove block> |

---

## 6. REQ class → SysML subtype / stereotype map

> Type each requirement node in `Requirements_Diagram.puml` by its Conventions class.

| Conventions class | SysML requirement subtype / stereotype |
|-------------------|----------------------------------------|
| `F` Functional | functional requirement |
| `U` Usability | usability requirement |
| `P` Performance | performance requirement |
| `O` Operational/Reliability | extended/generic requirement + «reliability» stereotype |
| `SEC` Security | generic requirement + «securityControl» stereotype |
| `INT` Interface | interface requirement |
| `C` Constraint | design constraint |
| `D` Domain | design constraint + «domain/standard» stereotype |
| `SAF` Safety | generic requirement + «safety» stereotype |

---

## 7. Diagram inventory  (7 of 9 SysML working set)

> Confirm each mandated diagram exists as renderable `.puml`. Note "7 of 9" so SysML readers
> aren't confused; add Package (model > ~3 layers) or Parametric (hard physical/parametric
> constraint tied to a REQ-P-*) only when size/parametrics warrant.

| # | Diagram | File | Present? |
|---|---------|------|----------|
| 1 | Use Case | `diagrams/Use_Case_Diagram.puml` | <Yes / TODO> |
| 2 | Block Definition (BDD) | `diagrams/BDD.puml` | <Yes / TODO> |
| 3 | Internal Block (IBD) | `diagrams/IBD.puml` (rename `IBD_<TopBlock>.puml`) | <Yes / TODO> |
| 4 | State Machine | `diagrams/State_Machine.puml` | <Yes / TODO> |
| 5 | Activity | `diagrams/Activity.puml` (rename `Activity_<Scenario>.puml`) | <Yes / TODO> |
| 6 | Sequence | `diagrams/Sequence.puml` (rename `Sequence_<Interaction>.puml`) | <Yes / TODO> |
| 7 | Requirements | `diagrams/Requirements_Diagram.puml` | <Yes / TODO> |
| + | Package (optional) | `diagrams/Package.puml` | <added if size warrants / N-A> |
| + | Parametric (optional) | `diagrams/Parametric_<eqn>.puml` | <added if parametrics warrant / N-A> |

---

## 8. Open TODOs  (owed satisfiers / verifiers / transitions)

| # | Owed item | Type (satisfier / verifier / transition / arrow-fix) | Owner | Due |
|---|-----------|------------------------------------------------------|-------|-----|
| 1 | <description> | <type> | <role> | <date> |

---

## Gate summary (fill at gate)

- [ ] All 7 mandated diagrams exist as renderable `.puml` ("7 of 9" stated).
- [ ] Every `REQ-*` *satisfied* by ≥1 block (no un-justified orphan).
- [ ] Every `REQ-*` *verified* by ≥1 test case / I-A-D activity (placeholders OK).
- [ ] Derive-direction check clean (no wrong-direction arrows; derives are REQ→REQ).
- [ ] No unexplained orphan blocks; no `trace` link that should be stronger.
- [ ] State Machine covers every SyRS mode/state with no invented transitions.
- [ ] Coverage metrics computed **and timestamped** above.
- [ ] Model status set and each `.puml` registered as a CI for Config Mgmt.

> On pass, set `Status: Baseline (Model-Coverage-gate-approved <YYYY-MM-DD>)`.
> Record any escalation to a live MBSE tool (Cameo/Capella/Sparx) as a `DEC-<nn>` in Phase 05.
