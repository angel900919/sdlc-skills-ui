# Configuration Management — cross-cutting thread

> The discipline that keeps every controlled item **identified, baselined, accounted-for, and audited** so that at any moment you can say exactly *what the system is*, *which version is current*, and *that the as-built matches the as-documented*.

**Why first-class.** A system that ships keeps changing, and without CM the answer to "which SysRS is current?" or "does this build match its baseline?" drifts into folklore. The [Skills Audit](../00_Skills_Audit_Report.md) (Part D) found CM **collapsed into change control** — present only as "approve a CR" — with no identification, baseline, status-accounting, or audit discipline. This thread restores CM as a living discipline alive in **every** stage, reviewed at **every** gate, distinct from (and the foundation under) change control.

---

## What it is & why it matters

**Configuration Management (CM)** is the set of activities that establish and maintain consistency between a product's *requirements, design, and as-built reality* throughout its life — by controlling the items that make up the system and the record of their state. It answers four standing questions, the **four CM functions** (ISO 10007:2017; EIA-649):

| # | CM function | Question it answers |
|---|---|---|
| 1 | **Configuration Identification** | *What* is under control? (the `CI-*` register, naming, version scheme, baseline membership) |
| 2 | **Configuration Control** | *How* does a controlled item change? (baselines set/frozen at gates; changes only via a `CR-*`) |
| 3 | **Configuration Status Accounting (CSA)** | *What state* is everything in right now? (the CM ledger: per-CI version, baseline, open/closed CRs) |
| 4 | **Configuration Audits (FCA / PCA)** | *Does reality match the record?* (functional + physical audits at PRR) |

**CM is not change control.** Change control is the *governance loop* for a single change (Submit → Impact Analysis → CCB → re-baseline) — it owns the `CR-*` and the CCB. CM is the *steady-state bookkeeping* that change control acts upon: CM defines the `CI-*` and baselines a CR re-versions, and CSA records the result. Phrased simply: **change control decides** *whether* an item changes; **CM knows** *what* the item is, *which baseline* holds it, and *what version* it became. Stage 09 **operates** both; this thread defines the CM discipline so the other threads and stages can route through it.

Without CM you get the classic failures: nobody knows which document is authoritative; a "fixed" build is rebuilt from the wrong source; an audit finds the as-built differs from the shipped design; a change is made to a draft that two teams have already forked.

---

## Standards anchor

Canonical citations are fixed by [`05_Conventions.md` §9](../05_Conventions.md) — cite these exact forms, do not restate or re-version them here.

| Concern | Canonical citation |
|---|---|
| Configuration management (primary) | **ISO 10007:2017** — *Quality management — Guidelines for configuration management* |
| CM plan & process (software/systems) | **IEEE 828** — *Configuration Management in Systems and Software Engineering* |
| CM principles (industry baseline) | **EIA-649** — *Configuration Management Standard* (the five CM functions / principles) |
| SE lifecycle (CM & Information Mgmt processes) | **ISO/IEC/IEEE 15288:2023** (Technical-Management group) |
| Quality / audit basis (FCA, PCA) | **ISO 9001:2015** |
| Domain CM clauses (as applicable) | DO-178C §SCM · ISO 26262 Part 8 · IEC 62304 §8 |

> ISO 10007 gives the *guidelines*, IEEE 828 the *plan structure*, EIA-649 the *principles*. They agree on the four functions; cite all three together as the audit's Part D prescribes, and let **ISO 10007** lead.

---

## The living artifact

This thread is operated through the **`Configuration_Management_Plan.md`** (owned by Stage 09) plus a continuously-updated **CI register** and **CSA ledger** that this thread keeps alive across all stages.

- **ID grammar** (fixed by [`Conventions §2.3`](../05_Conventions.md)): a configuration item is **`CI-<nn>`** — uppercase, hyphenated, zero-padded two-digit sequence (`CI-01`, never `CI-1`), **stable for the life of the project** (retire with a `(deprecated)` note, never renumber). Change requests that re-version a CI are **`CR-<nn>`** ([`Conventions §2.4`](../05_Conventions.md), owned by Stage 09's change-control half).
- **Version grammar** (fixed by [`Conventions §6`](../05_Conventions.md)): documents carry **`vMAJOR.MINOR`** (minor = tracked edit, major = re-baseline); the build/config recipe carries **semver `MAJOR.MINOR.PATCH`** (breaking / feature / fix) — *never key the version bump to the change class A/B/C/D.*
- **Status strings** (fixed by [`Conventions §6`](../05_Conventions.md)): `Draft` → `In Review` → `Baseline (<GATE>-approved YYYY-MM-DD)` → `Superseded`. A `Baseline (...)`-status item changes **only** through a `CR-*`.
- **Baselines** (fixed by [`Conventions §3`](../05_Conventions.md)): **Functional/Requirements @ SRR**, **Allocated @ PDR**, **Product @ CDR**.
- **Where it lives:** the project's `Phase_09_Change_Config/Configuration_Management_Plan.md`, with the CI register and CSA ledger maintained there and surfaced into `_cross_cutting/` per [`Conventions §10`](../05_Conventions.md). Cross-cutting registers (`Risk_Opportunity_Register.md`, `TPM_Tracker.md`, etc.) are themselves CIs.
- **Template:** [`../templates/Configuration_Management_Plan.md`](../templates/Configuration_Management_Plan.md) (blank, fill-in).

**CI register row** (the unit of identification):

```markdown
| CI-NN | <item name> | <doc / sw build / hw asm / model / dataset> | <owner> | <Functional / Allocated / Product> | <vX.Y or semver> | <status> |
```

**CSA ledger row** (the unit of status accounting):

```markdown
| CI-NN | Current version | Controlling baseline | Open CRs | Closed CRs since last gate | Status string |
```

---

## Lifecycle touchpoints

CM is alive in every stage. At each stage the thread does the work below (loop step 7 of the [AI Protocol §7](../02_AI_Systems_Engineer_Protocol.md): *"new CIs identified; baseline set/updated at SRR/PDR/CDR"*).

| Stage | What this thread does |
|---|---|
| **00 Agreement** | Establish CM authority and policy in the SEMP: who chairs the CCB, where the repository lives, the `CI-*` / `CR-*` ID series, and the document-control rules. CM plan stub created. |
| **01 Concept** | Put problem-space artifacts under draft control: `Stakeholder_Mission`, `StRS`, `OpsCon`, `Feasibility_Study` become candidate CIs. Choose the CM tool class with the lifecycle model. |
| **02 Requirements** | **Set the Functional/Requirements baseline at SRR** — `SysRS`, `Traceability_Matrix`, MOE/MOP set are baselined CIs. The trace links here are what impact analysis later walks. |
| **03 Modeling** | The 7 PlantUML diagrams + coverage matrices become version-controlled CIs; model and spec versions are kept in lockstep (a re-baselined `SysRS` re-versions the requirements diagram). |
| **04 Architecture** | **Set the Allocated baseline at PDR** — `Architecture_Description`, `ICD` (draft), `Tech_Stack_Rationale`, requirement-to-block allocation become baselined CIs. |
| **05 Trade-off** | `Decision_Matrices`, `Decision_Register` (`DEC-*`), optional `COCOMO_Estimate` placed under control; decisions are CIs so the basis of a later change is traceable. |
| **06 Integration** | **Set the Product baseline at CDR** — **ICDs frozen**, detailed design, and the **build/config recipe (semver)** become baselined CIs. Increment artifacts (`INC-*`) tracked. |
| **07 Verification** | `Verification_Matrix` and V&V evidence become CIs; this evidence is the FCA input. Coverage-by-method is status-accounted toward the audit. |
| **08 Validation** | `Test_Plan`, `Test_Cases` (`TC-VAL-*`) and validation results placed under control; PRR readiness for FCA/PCA assembled. |
| **09 Change & Config** | **OPERATES this thread.** Runs all four CM functions: maintains the CI register, controls baselines, runs CSA, and plans/runs **FCA + PCA at PRR**. Every approved `CR-*` re-versions affected CIs and updates the ledger. |
| **10 Operations** | Production config + runbooks (`RB-*`) + SLO definitions become CIs; deployed-version drift is detected and reconciled; OTA/patch versions tracked under semver. Re-baselines flow back through Stage 09. |
| **11 Disposal** | Final baseline captured and archived; the as-disposed configuration recorded; CI records retained per the archival/retention policy for audit and lessons-learned. |

---

## Method / activities

1. **Identify (function 1).** Enumerate the `CI-*` — every item whose change must be tracked and audited (documents, software builds, hardware assemblies, models, datasets). Assign each an owner, a type, a version scheme, and a controlling baseline. *Heuristic:* if losing track of its version would cause a defect, an integration break, or an audit finding, it is a CI.
2. **Baseline & control (function 2).** Establish the three baselines at their gates (Functional@SRR, Allocated@PDR, Product@CDR), freeze them, and require every later change to a `Baseline (...)`-status CI to flow through a `CR-*` (Stage 09's change-control loop). Record which CIs roll up into each baseline.
3. **Account for status (function 3 — CSA).** Maintain the CM ledger: per CI, its current version, controlling baseline, open/closed CRs, and status string. Publish on a defined cadence with a named owner. This is the report that answers "which version is current, and what changed since the last gate?"
4. **Audit (function 4 — FCA & PCA at PRR).** Plan and run two audits at **PRR** ([`Conventions §3`](../05_Conventions.md)):
   - **FCA (Functional Configuration Audit)** — does the CI's *achieved* performance meet the requirements/functional baseline? (Every `REQ-*` has closed V&V evidence.) *Did we build it to spec?*
   - **PCA (Physical Configuration Audit)** — does the *as-built* product match its product-baseline documentation (build recipe, ICDs, BOM, design docs)? *Does as-built match as-documented?*
   - Each discrepancy becomes a `CR-*`; the audit owner and entry criteria are recorded.
5. **Tool & repository.** Select the CM/VCS tool (per KB topic 18, "no single tool fits all" — Git+tags / Jira / GitLab for software; ServiceNow/BMC for enterprise IT; IBM EWM / Windchill / Polarion / Helix ALM for regulated complex systems; DOORS for requirements traceability) and define where regulator-required immutable exports live.

---

## Gate-review questions

Ask these about the CM thread at the relevant gate ([`checklists/gate-reviews.md`](../checklists/)). CM is reviewed at *every* gate; the gate-setting ones below are mandatory.

- **ATP (00):** Is CM authority assigned, the CCB chartered, the repository and `CI-*`/`CR-*` series chosen, document-control rules written?
- **SRR (02):** Is the **Functional/Requirements baseline** set with `Baseline (SRR-approved <date>)` status? Are `SysRS`, `Traceability_Matrix`, and the MOE/MOP set identified as CIs?
- **PDR (04):** Is the **Allocated baseline** set? Are architecture, ICD (draft), and the requirement-to-block allocation under control with versions?
- **CDR (06):** Is the **Product baseline** set with **ICDs frozen** and the build/config recipe under **semver**? Does every CI roll up to a declared baseline?
- **TRR (07):** Is the V&V evidence under control and version-pinned to the configuration being tested (FCA inputs identified)?
- **PRR (08):** Are **FCA and PCA** done — every `REQ-*` verified (FCA) and as-built matching as-documented (PCA)? Is each discrepancy a `CR-*`?
- **ORR / GA (10):** Does the **deployed** configuration match the released baseline (no drift)? Are runbooks/SLOs under control?
- **DRR (11):** Is the final/as-disposed configuration captured and archived per retention policy?
- **Every gate:** Is the **CSA ledger** current — can we name the current version of every CI and what changed since the last gate? Any baseline changed outside a `CR-*` (silent drift)?

---

## AI prompt pack

**Elicitation — build the CI register:**
> "Help me build the `CI-*` register for this project. From the SysRS, ICD, architecture, build recipe, and the cross-cutting registers, propose configuration items as `CI-NN` rows — name, type (doc / sw build / hw assembly / model / dataset), likely owner, version scheme, and which baseline (Functional@SRR / Allocated@PDR / Product@CDR) controls each. Flag anything ambiguous as `TODO` and ask me before assuming. Conform to Conventions §2.3 and §6; invent no versions or owners."

**Generation — draft the CM plan:**
> "Draft `Configuration_Management_Plan.md` covering the four ISO 10007 functions — identification (`CI-NN` register), configuration control (the three baselines at SRR/PDR/CDR, change only via `CR-*`), status accounting (the CSA ledger), and FCA/PCA audits at PRR. Point to the Change_Management_Plan for the change-control steps rather than duplicating them. Use the Conventions §6 frontmatter and mark every unknown `TODO: <owed by>`."

**Generation — status-accounting snapshot:**
> "Produce a CSA snapshot from the current CI register and CR log: for each `CI-NN` give current version, controlling baseline, open CRs, CRs closed since the last gate, and status string. Highlight any CI whose version moved without a linked `CR-*` (possible silent baseline drift)."

**Critique / red-team:**
> "Red-team this configuration-management discipline. Where can a baseline change without a `CR-*` (silent drift)? Is any version bump wrongly keyed to change class A/B/C/D instead of breaking/feature/fix? Is CM here just change control in disguise — are identification, status accounting, and FCA/PCA actually present and distinct? Are FCA and PCA confused, or missing their PRR tie? Is any artifact baselined but absent from the CI register? List each gap as a finding with a concrete fix."

---

## Common pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Nobody knows which SysRS/ICD is current. | No status accounting; version bumps skipped. | Run the CSA ledger; make the version-bump a CCB exit criterion. |
| CM section is just "the CCB approves CRs." | CM collapsed into change control (the audit's Part D finding). | Author all four functions — identification, control, CSA, audits — as distinct of the `CR-*` loop. |
| A baseline changed without a CR. | Silent drift; control not enforced on `Baseline (...)` items. | Only `CR-*` may change a baselined CI; flag any unlinked version move at every gate. |
| Version bumped by change class (B ⇒ MINOR as a rule). | Class confused with version semantics. | Bump by **breaking / feature / fix** per [`Conventions §6`](../05_Conventions.md); class is a routing label only. |
| As-built ≠ as-documented at delivery. | No PCA. | Plan FCA + PCA at PRR; route every discrepancy to a `CR-*`. |
| An artifact is baselined but not in the CI register. | Identification incomplete. | Every `Baseline (...)`-status artifact must be a `CI-*`; reconcile register against baselines at each gate. |
| Deployed version differs from the released baseline. | No operational config reconciliation. | Detect drift at ORR/GA; reconcile deployed config to the product baseline. |
| Two plans both restate the 6-step change process. | CM plan duplicates change control. | CM plan *points to* the Change Management Plan; defines only the four CM functions. |

---

## References

- [`../05_Conventions.md`](../05_Conventions.md) — **the contract**: `CI-*`/`CR-*` IDs (§2.3–2.4), gates & the three baselines (§3), status strings & semver rule (§6), canonical CM citations (§9), folder layout (§10).
- [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md) — the 12-stage spine; the 8 cross-cutting threads; 15288 Configuration/Information-Management mapping (§1, §3).
- [`../02_AI_Systems_Engineer_Protocol.md`](../02_AI_Systems_Engineer_Protocol.md) — per-stage loop; thread-update step 7 (CM: "new CIs identified; baseline set/updated at SRR/PDR/CDR").
- [`../skills/se-phase-09-change-config/SKILL.md`](../skills/se-phase-09-change-config/SKILL.md) — **operates** this thread: the four CM functions, baselines, CSA, FCA/PCA, and the distinct change-control loop.
- [`../00_Skills_Audit_Report.md`](../00_Skills_Audit_Report.md) — Part D origin of this thread ("Configuration Management — collapsed into change control. Add identification, baseline management, status accounting, FCA/PCA").
- [`../templates/Configuration_Management_Plan.md`](../templates/Configuration_Management_Plan.md) — blank, fill-in plan.
- KB: [`Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md`](../../Systems-Engineering-KB/topics/18-change-management-continuous-validation/fundamentals.md) — CMS / IBM DOORS, "no single tool fits all."
- KB: [`Systems-Engineering-KB/topics/07-requirements-management/fundamentals.md`](../../Systems-Engineering-KB/topics/07-requirements-management/fundamentals.md) — baseline management, traceability types (the links CSA and impact analysis walk).
- Standards: **ISO 10007:2017** · **IEEE 828** · **EIA-649** · **ISO/IEC/IEEE 15288:2023** · **ISO 9001:2015** (FCA/PCA basis).
