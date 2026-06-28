# Reusable Prompt Patterns — cross-phase, domain-agnostic

> Copy-paste prompt patterns that work in **any** phase and **any** domain. Replace every `<placeholder>` with your specifics. These are the *cross-phase* layer — when you're inside a specific phase, prefer that phase's tailored `## AI prompt pack` (see the [README table](README.md)). Everything below emits IDs, methods, gates, and citations in the grammar of [`05_Conventions.md`](../05_Conventions.md) — the patterns **cite the contract, they never redefine it**. They also honour the standing rules of the [AI Systems Engineer Protocol](../02_AI_Systems_Engineer_Protocol.md): never invent numbers/regs/results (emit `TODO:` + a research recommendation instead), one topic at a time, show-back-and-confirm, and challenge solutions-masquerading-as-needs.

**How to read each pattern:** *When to use* → *The prompt* (copy this) → *What good output looks like* (so you can tell whether the model actually did the job).

**Universal placeholders** used throughout: `<system>` (the system under design), `<domain>` (e.g. medical-device, EV-charging, fintech), `<project-slug>` (kebab-case), `<tailoring-level>` (Minimum-Viable | Formal). Paste the relevant prior-phase artifact (or its path under [Conventions §10](../05_Conventions.md)) wherever a prompt references one.

---

## 1. Stakeholder elicitation

**When to use.** Start of Phase 01, or any time the stakeholder list looks thin ("it's all users"). Use it to force coverage of the non-obvious roles — the ones who *operate, maintain, regulate, pay for, supply, and dispose of* the system — because **missing stakeholders are missing requirements** (Protocol §4).

**The prompt.**
> ```
> Act as a systems engineer doing stakeholder analysis for <system> in the <domain> domain.
> Here is what I know so far: <paste current stakeholder list / one-paragraph context>.
>
> 1. Produce a stakeholder register with columns: ID (STK-<nn>, zero-padded), Stakeholder,
>    Role/relationship, Interest (what they want from the system), Influence (High/Med/Low),
>    Interest level (High/Med/Low), and "What they'd veto".
> 2. Deliberately include the roles people forget: operators, maintainers, regulators/auditors,
>    the payer/budget-holder, suppliers/integrators, support staff, and the eventual
>    decommissioner/disposer. Add any <domain>-specific roles (e.g. clinicians, drivers,
>    inspectors) explicitly.
> 3. Plot them on an influence x interest grid (Manage closely / Keep satisfied / Keep informed /
>    Monitor) and name who I MUST interview first and why.
> 4. For each High-influence stakeholder, give 3 open-ended elicitation questions aimed at NEEDS,
>    not solutions.
> 5. Flag any stakeholder whose needs I have NOT yet captured as a gap. Do not invent their
>    needs — list the gap as TODO and tell me how to find the answer.
> Ask me to confirm or correct the register before we derive needs from it.
> ```

**What good output looks like.**
- A register where every row has a stable `STK-<nn>` ID and at least three of the *forgotten* roles appear (regulator, maintainer, payer, disposer).
- An influence×interest placement with a justified "interview first" shortlist — not every stakeholder marked High.
- Needs-focused questions ("what does a successful shift look like for you?"), **not** solution-leading ones ("would you want a dashboard?").
- Explicit `TODO:` gaps for uncaptured needs, with a "how to find out" — never fabricated needs.
- A show-back asking you to confirm before proceeding (one-topic-at-a-time discipline).

---

## 2. SMART / EARS requirement rewrite

**When to use.** Any time a "requirement" reads as a wish, an adjective, or two behaviours in one sentence — in Phase 02 at scale, or whenever a stray un-testable line appears in any later phase. Turns prose into requirements that a test can pass or fail.

**The prompt.**
> ```
> Rewrite the following raw statements as testable requirements for <system>.
>
> Raw input:
> <paste the rough requirements / stakeholder quotes>
>
> Rules:
> - Use the ISO/IEC/IEEE 29148:2018 template: "The <subject> shall <action> <measurable object/value>
>   <under defined conditions>." If the trigger/condition is what matters, fall back to EARS
>   (Ubiquitous / Event "When <trigger>" / State "While <state>" / Unwanted "If <condition>, then" /
>   Optional "Where <feature>").
> - Assign each an ID REQ-<class>-<nn> using ONLY the Conventions §2.1 classes
>   (F, U, P, O, SEC, INT, C, D, SAF). Put quality-attribute "-ilities" under the closest class
>   (usually P or O) and name the attribute in the text.
> - SMART-check every one: Specific, Measurable, Achievable, Relevant, Time-bound/Verifiable.
>   Replace every unverifiable adjective (fast/robust/intuitive/secure) with a number + condition.
> - Split every double-barrelled statement into separate requirements (one observable behaviour each).
> - For each requirement: cite its parent SN-<nn>, propose a priority (High/Med/Low/N-A), and seed a
>   verification method T/I/A/D with a TC-VER-TBD placeholder.
> - If a statement is too vague to make measurable, DO NOT invent the number — output it as
>   "TODO: need threshold for <metric>" and tell me what to ask the stakeholder or research.
>
> Return a table: REQ-ID | requirement text | class | parent SN | priority | T/I/A/D | SMART gaps.
> ```

**What good output looks like.**
- Every line follows the `shall` template (or a correctly-chosen EARS clause) with a concrete number and condition — zero bare adjectives.
- Correct class letters from §2.1 (a UL/IEC/DO/ISO item lands in `D`, a budget ceiling in `C` — not confused).
- Double-barrelled inputs come back **split**, each independently testable.
- Each requirement carries a parent `SN-<nn>`, a priority, and a *seeded* (not final) T/I/A/D with `TC-VER-TBD`.
- Genuinely-unknowable thresholds appear as `TODO: need threshold for <metric>` — **not** a plausible-looking invented value.

---

## 3. Need-vs-solution challenge

**When to use.** Whenever a "requirement," architecture choice, or feature smuggles in *how* before the *what* is agreed. This is the single biggest guard against "built it right, but it was the wrong thing." Run it on any list that mixes problem and solution space.

**The prompt.**
> ```
> Act as a skeptical systems engineer enforcing problem/solution-space separation for <system>.
>
> For each item below, decide: is this a genuine NEED (problem space) or a SOLUTION/design choice
> (solution space) that has prematurely fixed the answer?
>
> Items:
> <paste the requirements / feature list / "asks">
>
> For every item:
> 1. Classify: NEED or SOLUTION-IN-DISGUISE.
> 2. If SOLUTION: state the underlying need it's actually serving, rewrite it as a solution-free
>    need ("the system needs to <achieve outcome> so that <stakeholder benefit>"), and note what
>    design freedom we'd lose by baking in the original wording.
> 3. Phrase the recovered need as a candidate SN-<nn> traceable to a stakeholder.
> 4. If a solution truly is an imposed CONSTRAINT (mandated tech, regulation, fixed budget),
>    say so and route it to class C or D instead of pretending it's a free choice.
> Return a table: item | verdict | underlying need (SN-<nn>) | design freedom at stake.
> Then tell me which one or two of these, if left as solutions, would most narrow our architecture.
> ```

**What good output looks like.**
- Items like "use Postgres," "add a mobile app," "poll every 5s" are caught as solutions and traced back to the need (durable storage / on-the-go access / freshness target).
- Recovered needs are **solution-free** and outcome-shaped, each phrased as a candidate `SN-<nn>`.
- Genuine constraints are correctly *kept* (and routed to `C`/`D`), not over-corrected into needs.
- A pointed "this one is quietly deciding your architecture" call-out — the engineering judgement, not just classification.

---

## 4. Weighted decision-matrix builder + sensitivity

**When to use.** Any strategic, expensive-to-reverse choice (framework, vendor, topology, build-vs-buy) — the heart of Phase 05, but reusable anywhere a decision needs to be *auditable*. Produces a `DM-<nn>` matrix and the sensitivity analysis that proves the winner isn't an artefact of arbitrary weights.

**The prompt.**
> ```
> Build a weighted decision matrix DM-<nn> for this decision on <system>.
>
> Decision: <what we're choosing>
> Alternatives (must be at the SAME abstraction level): <A, B, C ...>
> Criteria + weights (must sum to 100%): Cost <w>%, Performance <w>%, Reliability <w>%,
>   Risk <w>%, Scalability <w>%, Maintainability <w>% <add/drop with reason>.
> Each criterion ties to a REQ/MOE: <map criterion -> REQ-<id>/MOE-<id>>.
>
> 1. Score each alternative 1-10 per criterion with a ONE-LINE justification that NAMES the
>    evidence method (benchmark, TCO line, SLA figure, capacity test, MTBF source). No score of
>    9-10 without cited evidence. If the evidence isn't available, score it "TODO: needs <evidence>"
>    rather than guessing.
> 2. Compute weighted totals (show the arithmetic) and rank.
> 3. Sensitivity: re-run with EACH criterion set to 40% (remaining 60% split proportionally).
>    Report which, if any, decisions FLIP, and judge whether each flip is plausible or a corner case.
> 4. Write a 3-5 sentence decision narrative and a DEC-<nn> register stub (decision, rationale,
>    alternatives rejected, linked REQ, date).
> Output: the matrix, the weighted totals, the sensitivity block, the narrative, the DEC-<nn> stub.
> ```

**What good output looks like.**
- Alternatives at a *matched* abstraction level (not "AWS" vs "a Python script"); weights sum to 100% and each maps to a `REQ`/`MOE`.
- Every cell has a one-line, method-named justification; high scores cite real evidence, and missing evidence is `TODO:`, not bluffed.
- Weighted totals show the arithmetic and are **recomputable**; a `DM-<nn>` ID is used.
- A full sensitivity block (each criterion → 40%) that **explicitly flags flips** and judges plausibility — not buried.
- A `DEC-<nn>` register stub linking the decision to ≥1 requirement (an ADR in miniature).

---

## 5. Red-team / assumption-challenge

**When to use.** Loop step 5 of *every* phase — run it on any draft before you take it to a gate (a spec, an architecture, a test plan, a runbook, a disposal plan). The point is to attack the work the way a hostile reviewer at the gate would, so weaknesses surface now, not there.

**The prompt.**
> ```
> Red-team this <artifact type> for <system> as a hostile reviewer at the <gate> gate would.
> Be adversarial and specific; your job is to REFUTE, not to reassure.
>
> Artifact:
> <paste the draft>
>
> Find and tabulate:
> 1. Unstated assumptions — what does this quietly take for granted that could be false?
> 2. The single weakest element (requirement / interface / claim / step) and why it breaks first.
> 3. Internal contradictions and conflicting pairs (e.g. performance vs cost, security vs usability).
> 4. Missing-but-expected content a <domain> reviewer would demand (non-functional, safety,
>    security, regulatory, error/edge cases, rollback).
> 5. Any number, regulation, or result that is ASSERTED without evidence or citation.
> 6. Traceability breaks — orphans with no parent and parents with no child.
>
> Return a table: finding | severity (S1-S4 per Conventions §5.1) | location | why it matters | fix.
> End with the one question you'd ask at the gate that this draft cannot currently answer.
> ```

**What good output looks like.**
- Findings that name *specific* lines/IDs, not generic "consider edge cases" filler.
- Severities assigned from the §5.1 `S1`–`S4` taxonomy, so the worst items are obvious.
- At least one genuine *unstated assumption* and one *internal contradiction* surfaced.
- Asserted-without-evidence numbers/regs flagged for citation (feeds a research trigger — see [`research-and-agents.md`](research-and-agents.md)).
- A killer gate question the draft can't yet answer — the thing to fix before the review.

---

## 6. Gate-readiness review

**When to use.** At every exit gate (ATP, MCR, SRR, PDR, CDR, TRR, PRR, ORR, GA, DRR). Treats the gate as a real go/no-go **decision with evidence** (Protocol §6), not a rubber stamp — and returns one of the five canonical outcomes.

**The prompt.**
> ```
> Run a gate-readiness review for the <GATE> gate of <system> (tailoring level: <tailoring-level>).
>
> Gate criteria (from the owning phase + ../checklists/gate-reviews.md):
> <paste the checklist items for this gate>
>
> Evidence to assess:
> <paste the relevant artifacts / their status / open items / risk + TPM state>
>
> 1. Score EACH criterion: Met / Partially-met / Not-met / N-A (tailored out: <reason>), each with
>    the specific evidence (or its absence) that justifies the score. No "looks fine" — cite the line.
> 2. Check the cross-cutting threads at this gate: open S1/S2 risks, baseline status, hazard log,
>    TPM margins vs plan, cost/schedule. Per Conventions, a baselined artifact's status must read
>    "Baseline (<GATE>-approved <date>)".
> 3. Recommend EXACTLY ONE outcome with justification:
>    Proceed | Proceed-with-actions | Hold | Re-baseline | Stop.
>    - Proceed only if all criteria Met, baselines set, no open S1/S2, TPMs in margin.
>    - Proceed-with-actions => list each open item with a named owner + due date.
>    - Hold/Re-baseline/Stop => state the blocking gap and the consequence.
> Do not declare the gate "passed" while any criterion is unmet — name the unmet item.
> Return: criteria scorecard | thread check | outcome + rationale | action list (owner, due).
> ```

**What good output looks like.**
- A per-criterion scorecard with concrete evidence cited for each Met/Not-met — no rubber-stamping.
- The cross-cutting threads actually checked (an open `S1` risk or a `TPM` below margin blocks "Proceed").
- **Exactly one** of the five outcomes, justified — and never "passed" with an unmet item.
- For *Proceed-with-actions*, every open item has a named owner and due date; for *Hold/Stop*, the blocking gap and its consequence are explicit.
- Baseline status phrased per §6 (`Baseline (<GATE>-approved <date>)`).

---

## 7. Traceability gap-finder

**When to use.** Before any gate that asserts coverage (SRR, TRR), after a change ripples through baselines, or any time you suspect the golden thread has a break. Walks the [Conventions §8 spine](../05_Conventions.md) — `SN → REQ → design → ICD → INC → TC` — in both directions and reports every orphan and every dangling link.

**The prompt.**
> ```
> Audit the traceability spine for <system> against Conventions §8:
>   SN ──derive──▶ REQ ──satisfy──▶ design block (BDD/IBD) ──▶ ICD ──▶ INC ──▶ TC-VER/TC-VAL ──verify──▶
>   (and the MOE/MOP/TPM and CR/SLO branches).
>
> Inputs (paste each you have):
> - Stakeholder needs: <SN list>
> - Requirements: <REQ list>
> - Design/blocks + ICD rows: <list>
> - Integration increments: <INC list>
> - Test cases: <TC-VER / TC-VAL list>
> - Measurement: <MOE/MOP/TPM list>
>
> Check BOTH directions and report:
> 1. FORWARD orphans: SN with no REQ; REQ with no satisfying design; design with no ICD where a seam
>    exists; REQ with no verifying TC; MOP with no REQ; TPM not traced to a MOP.
> 2. BACKWARD orphans: REQ with no parent SN; TC verifying nothing; ICD row with no requirement;
>    design block satisfying no REQ.
> 3. Method gaps: REQ with no seeded/assigned T/I/A/D.
> 4. For safety-critical/regulated work, confirm BIDIRECTIONAL coverage is complete (flag any one-way link).
>
> Return one coverage table: element ID | linked to | direction OK? | gap | recommended fix (e.g. add
> TC-VER-<nn>, derive REQ from SN-<nn>, mark out-of-scope with rationale). Give a one-line coverage
> summary (e.g. "3 SN uncovered, 2 REQ unverified, 1 orphan TC"). Do not invent links to close a gap —
> recommend the artifact to create.
> ```

**What good output looks like.**
- A single coverage table walking the spine, with every orphan named by ID and direction.
- Both *forward* (uncovered `SN`, unverified `REQ`) and *backward* (parentless `REQ`, purposeless `TC`) gaps caught.
- Method gaps (a `REQ` with no T/I/A/D) surfaced separately.
- Fixes that *create the missing artifact* (e.g. "add `TC-VER-<nn>`" or "record `SN-07` out-of-scope with rationale") — **not** fabricated links that paper over the gap.
- For regulated work, an explicit bidirectional-completeness verdict.

---

## 8. ICD seam definition

**When to use.** Phase 04 when freezing interfaces (toward CDR), or any time two components/teams/systems meet and the seam between them is fuzzy. Turns "they talk to each other" into a precise, frozen-able `ICD-<nn>` row that both sides can build and test against independently.

**The prompt.**
> ```
> Define the interface seam between <component/system A> and <component/system B> for <system> as a
> frozen-able ICD entry.
>
> Context: <what each side does, the interaction, any INT requirements REQ-INT-<nn> it realises>.
>
> Produce an ICD row ICD-<nn> capturing, for this seam:
> - Parties: provider and consumer (and direction of each data/control flow).
> - Interface type: data / control / power / mechanical / human (pick what applies).
> - Protocol & format: transport, message/schema, units, encoding, version.
> - Operations / endpoints / signals and their semantics.
> - Pre/post-conditions, ordering, idempotency, and timing/latency budget.
> - Error & failure behaviour: error codes, retries, timeouts, fallback, degraded mode.
> - Security of the seam: authN/authZ, encryption, trust boundary crossed (link THR-<nn> if any).
> - Capacity: rate limits, payload size, throughput, backpressure.
> - The verifying test: seed a TC-VER-<nn> and T/I/A/D method that would prove conformance.
> - Owner of each side and the requirement REQ-INT-<nn> it traces to.
>
> If any field is unknown, mark it "TODO: confirm with <owner>/spec" — do NOT guess a protocol,
> port, or limit. Flag whether this seam is ready to FREEZE at CDR or still has open TODOs.
> Output as a single ICD-<nn> table row plus a short note on freeze-readiness.
> ```

**What good output looks like.**
- A complete `ICD-<nn>` row: both parties + direction, protocol/format/version, error/timeout/fallback behaviour, security of the seam, and capacity limits — the things that cause "late integration surprises" when omitted.
- A seeded verifying `TC-VER-<nn>` with a T/I/A/D method, and a trace to a `REQ-INT-<nn>`.
- Unknowns marked `TODO: confirm with <owner>/spec` — **no** invented ports, protocols, or rate limits.
- An explicit **freeze-readiness** verdict (ready to freeze at CDR vs. open TODOs remaining), since CDR freezes ICDs into the product baseline.

---

## Composing patterns

These chain naturally along the workflow's spine:

1. **#1 Stakeholder elicitation** → captures `STK`/`SN`.
2. **#3 Need-vs-solution** → cleans the needs so no solution is baked in early.
3. **#2 SMART/EARS rewrite** → turns clean needs into testable `REQ`.
4. **#4 Decision matrix** → makes the strategic `DEC`/`DM` choices auditable.
5. **#8 ICD seam** → freezes the interfaces those decisions create.
6. **#7 Traceability gap-finder** → proves the thread is unbroken end-to-end.
7. **#5 Red-team** → attacks the whole before the gate.
8. **#6 Gate-readiness** → makes the go/no-go call with evidence.

When any pattern surfaces an unknown (a `TODO:` for a number, regulation, benchmark, or vendor capability), hand off to [`research-and-agents.md`](research-and-agents.md) for the matching research/agent trigger — and remember the house rule: **library / framework / tool / cloud questions go through the Context7 docs MCP first.**
