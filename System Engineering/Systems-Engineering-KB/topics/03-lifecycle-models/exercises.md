# System Lifecycle Models — Exercises

All solutions are at the bottom under the `---` rule. Try each from memory first.

## Warm-up (Tier 1 — production recall)

W1. From memory, list the six stages of the Waterfall model in order.

W2. From memory, list the four phases of one Spiral cycle in order.

W3. From memory, state the four Agile Manifesto values (the "X over Y" form).

W4. Name the four design-phase ↔ test-phase pairings of the V-Model.

W5. Who introduced the Spiral model and in roughly what decade?

## Core exercises (Tier 2 — apply to a scenario)

C1. **Apply Waterfall.** Your team is building bridge-monitoring infrastructure with fixed, regulator-approved requirements that will not change. Choose a lifecycle model and justify the choice in two sentences from requirements stability and the cost of late change.

C2. **Apply the V-Model (guidance-fading pair, part 1 — worked steps given).** For a smart door lock, the left-side design phases produce: System Requirement Specification → System Architecture document → Detailed component/interface specs → code modules ready for implementation → working prototype. Write the artifact you'd produce at the **System analysis** phase.

C3. **Apply the V-Model (guidance-fading pair, part 2 — now independent).** For a different system — a hospital infusion pump — name the four test phases you would pair to module design, software design, system design, and requirements, and say what each one checks.

C4. **Apply Spiral.** You're starting a mobile banking app and security is the dominant unknown. Write the *Risk Analysis* questions you'd raise in Spiral 1 (account view) and Spiral 2 (real transfers), and explain why risk analysis belongs in every cycle.

C5. **Apply Agile.** Plan Iteration 1 of a mobile fitness tracker: name the sprint focus, one development task, one testing activity, and what the Review & Retrospective gathers.

C6. **Explain it back (Feynman).** In your own words, explain to a non-engineer why the V-Model is "Waterfall that plans its testing." Self-check rubric: (a) you noted both are a single linear pass; (b) you named the design↔test pairing; (c) you said testing is planned per level, not bolted on at the end.

## Challenge exercises (Tier 3 — analyze / evaluate)

X1. **Interleaved set — pick the concept first.** For each scenario, decide which of Waterfall, V-Model, Spiral, or Agile fits best, then justify in one sentence:
   - (a) A **medical robotic arm** with strict safety requirements that must be verified at every level.
   - (b) A **social-media feed feature** whose requirements will shift weekly with user behaviour.
   - (c) A **new fintech product** whose biggest unknown is whether secure bank-API integration is even feasible.
   - (d) A **commercial aircraft** with stable, regulated requirements where late change is very costly.

X2. **Evaluate a bad choice.** A startup picked Waterfall for a consumer app whose features change every sprint based on user data. Diagnose what will go wrong, citing the model's properties, and recommend an alternative with reasoning.

X3. **Build the map yourself.** Given these nodes — `Waterfall`, `V-Model`, `Spiral`, `Agile`, `linear/single pass`, `iterative/cycles`, `risk analysis each cycle`, `feedback each sprint`, `design↔test pairing` — draw the edges that connect each model to its defining property. (Sketch as a list of "node → node" links.)

X4. **Contrast under one scenario.** A company wants to add a payment feature to an existing app *and* the regulator requires documented verification of each level. Argue whether a *blend* of models is justified here, referencing the source's note on blending.

---

## Solutions & explanations

**W1.** Requirements → Design → Implementation → Verification → Deployment → Maintenance (source: m1-lifecycle).

**W2.** Planning → Risk Analysis → Engineering → Evaluation (source: m1-lifecycle).

**W3.** Individuals and interactions over processes and tools; Working software over comprehensive documentation; Customer collaboration over contract negotiation; Responding to change over following a plan (source: m1-lifecycle).

**W4.** Module design ↔ unit testing; software design ↔ integration testing; system analysis/design ↔ system testing; requirements ↔ acceptance testing (source: m1-lifecycle).

**W5.** Barry Boehm, in the 1980s (source: m1-lifecycle).

**C1.** Choose **Waterfall**. Requirements are clear and stable, which is exactly Waterfall's best case; and because late changes are costly, a linear single pass with heavy upfront documentation is appropriate — there's little need for iteration (source: m1-lifecycle). *(V-Model is also defensible if per-level verification is required.)*

**C2.** The **System Architecture document**, produced by breaking the system into its main components — mobile app, lock hardware, control unit (microcontroller), and network module for alerts (source: m1-lifecycle).

**C3.** Module design ↔ **unit testing** (each component tested individually); software design ↔ **integration testing** (interactions between modules); system design ↔ **system testing** (entire system as a whole); requirements ↔ **acceptance testing** (system tested against the original requirements) (source: m1-lifecycle).

**C4.** Spiral 1 risk questions: *Can we integrate securely with banking APIs? What if users lose their phones?* Spiral 2 risk questions: *Can we prevent fraud during transfers? What if the server goes down during a transaction?* Risk analysis is one of the four phases in *every* cycle so the scariest unknowns are surfaced and retired before more is engineered (source: m1-lifecycle).

**C5.** Sprint focus: user registration and a dashboard of basic activity data. Development: implement sign-up/login and a simple activity summary. Testing: unit testing plus a small group of beta users on the core functionality. Review & Retrospective: gather feedback on signup ease and dashboard clarity, then adjust the design (source: m1-lifecycle).

**C6.** Strong answer hits all three rubric points: both Waterfall and the V-Model are a single front-to-back pass, but the V-Model pairs a test phase with each design phase, so you plan unit/integration/system/acceptance testing at the level each belongs to rather than as one block at the end (source: m1-lifecycle).

**X1.** (a) **V-Model** — safety must be verified at every level, which is exactly its design↔test pairing. (b) **Agile** — rapidly evolving requirements and frequent feedback are Agile's stated strength. (c) **Spiral** — the dominant unknown is feasibility/risk, and Spiral runs explicit risk analysis each cycle to retire it early. (d) **Waterfall** — stable, regulated requirements with costly late change is Waterfall's classic case (the source's own aircraft example) (source: m1-lifecycle). *Common wrong answer:* choosing Agile for (a) or (d) — Agile's flexibility can become uncontrolled change, which is dangerous for safety-critical, stable-requirement systems (source: m1-lifecycle).

**X2.** Waterfall is linear with low flexibility, so going back to change earlier phases is hard and late changes are costly — a poor fit for an app whose features change every sprint (source: m1-lifecycle). Recommend **Agile**, which adapts easily to changing requirements and uses frequent reviews and continuous testing to keep the product aligned with users (source: m1-lifecycle).

**X3.** Map edges (source: m1-lifecycle):
- Waterfall → linear/single pass
- V-Model → linear/single pass; V-Model → design↔test pairing
- Spiral → iterative/cycles; Spiral → risk analysis each cycle
- Agile → iterative/cycles; Agile → feedback each sprint

**X4.** A blend is justified. The regulator's per-level verification requirement points to the **V-Model**, while the source explicitly notes Waterfall/linear models are *often blended with iterative models like the V-Model for better risk management* — so combining a V-Model's verification rigor with iterative delivery for the evolving payment feature is consistent with the material (source: m1-lifecycle).
