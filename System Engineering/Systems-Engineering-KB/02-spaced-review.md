# Systems Engineering — Spaced Review Schedule

<!-- build-knowledge-base: the per-topic table below is generated. Fill the cumulative interleaved sets and delete their STUB. Guide: references/document-templates.md#spaced-review -->

Spacing and retrieval — not re-reading — are what make this durable. After you first study a topic, revisit it on a widening schedule, and make every revisit a **closed-book recall**, not a reread. Tick a box each time you complete a review.

## Per-topic schedule

Default ladder — adjust the gaps to your deadline (the optimal gap grows with how long you need to remember; do the first review within a day, while forgetting is steepest):

| # | Topic | First pass | +1 day | +1 week | +3 weeks | Monthly |
|---|---|---|---|---|---|---|
| 1 | [Systems Engineering & Core Principles](topics/01-se-fundamentals/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2 | [Stages of the SE Process](topics/02-se-process-stages/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3 | [System Lifecycle Models](topics/03-lifecycle-models/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4 | [Common SE Tools & Techniques](topics/04-se-tools-techniques/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 5 | [Eliciting & Analyzing Requirements](topics/05-requirements-elicitation-analysis/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6 | [Verifying Requirements](topics/06-verifying-requirements/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7 | [Requirements Management, Traceability & Change Management](topics/07-requirements-management/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 8 | [System Modeling with SysML](topics/08-sysml-modeling/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 9 | [Requirements in Model-Based Systems Engineering (MBSE)](topics/09-mbse-requirements/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 10 | [System Design vs Architecture](topics/10-design-architecture-fundamentals/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 11 | [Architecture Frameworks: TOGAF, Zachman, NIST](topics/11-architecture-frameworks/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 12 | [Evaluating Design Trade-offs: Performance, Cost & Scalability](topics/12-design-tradeoffs/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 13 | [Decision Matrices: Ranking & Scoring Alternatives](topics/13-decision-matrix/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 14 | [Documenting System Architecture](topics/14-documenting-architecture/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 15 | [Integration Strategies & Managing Interfaces](topics/15-integration-strategies/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 16 | [Verification & Validation Methods](topics/16-verification-validation-methods/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 17 | [Writing Test Cases & Test Plans](topics/17-test-plans-cases/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 18 | [Change Management & Continuous Validation](topics/18-change-management-continuous-validation/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |
| 19 | [Agile Systems Engineering Playbook (Capstone)](topics/19-agile-se-playbook/README.md) | ☐ | ☐ | ☐ | ☐ | ☐ |

## Cumulative interleaved review

Mixed, **unlabeled** retrieval questions drawn from MULTIPLE topics, so you must first work out which idea applies before answering — the discrimination practice that blocked, single-topic review can't give you. This feels harder than reviewing one topic at a time; the difficulty is the point. Attempt from memory; answers are at the bottom.

### Set A — after topics 1–9

1. A requirement reads "the system should be responsive." Why is it defective, and rewrite it so it passes the relevant five-letter test.
2. A teammate uses "systems thinking" and "holistic view" interchangeably. Give the one-line distinction.
3. You must combine a satellite's imaging payload, power, and comms subsystems and test as you go; another team lists Concept→Development→Production→O&M→Disposal. One of these is a *lifecycle model* concern and one is a *process-stages* concern — which is which?
4. Name the direction of traceability you need so that, when a requirement changes, you instantly know which design, code, and tests are affected — and the direction you need to confirm no gold-plating was added.
5. In SysML, which relationship would link a *test case* to a requirement, and which merely *allocates* a requirement to a design element without proving anything?
6. A project has clear, stable requirements and heavy up-front documentation needs; another needs weekly user feedback on a fast-changing feature. Pick a lifecycle model for each.
7. Classify each for a thermostat: "operate within 100–240 V" · "let users set temperature from a phone" · "stay under a $20 BOM cost."
8. You have a requirements table where a *business* requirement shows a value in its "Derived From" column. Why is that a model error?

### Set B — after topics 10–14

1. You're choosing between three architectures on performance, cost, and scalability. What single technique produces a defensible winner, and what two numbers per cell does it combine?
2. TOGAF, Zachman, and NIST EA — match each to: *a 6×6 classification taxonomy* · *a 9-phase iterative method* · *a 5-layer model*.
3. A diagram shows the robot's subsystems and what each contains; another shows how the Navigation System's GPS and IMU connect via ports. Which is a BDD and which is an IBD?
4. "Architecture" vs "design": which decides *LiDAR vs stereo-vision sensor*, and which decides *that a perception subsystem exists at all*?
5. A 400-KLOC project: write the Basic COCOMO effort formula and say which project type (organic/semi-detached/embedded) gives the *largest* effort.
6. Which document is "the contract for how two subsystems talk," and name three things it specifies.
7. You weighted performance 0.4 and it dominated the result; a stakeholder says cost matters more. What analysis re-checks whether the winner survives a weight change?

### Set C — after topics 15–19 (whole-course)

1. Top-down vs bottom-up integration: which needs *stubs* and which needs *drivers*, and what does each let you test early?
2. "Did we build the system right?" vs "Did we build the right system?" — name each, and give one method for each.
3. A product owner wants to move the "Submit Payment" button. What do you run *before* approving, and which body gives the final go/no-go?
4. Put these test artifacts in the right box: *TC_LOGIN_01 with steps and expected result* vs *objectives, scope, environment, TS01–TS08 scenarios, pass/fail*.
5. The Boeing 787 case: name one *dependency* failure and one *interface* failure, and one lesson Boeing drew.
6. In the Agile SE playbook, trace the ID chain for one feature from stakeholder need → requirement → JIRA story → test case. What property does this chain guarantee?
7. "Shift-left testing" and "continuous testing in CI/CD" — what problem do they solve that end-of-cycle testing doesn't?
8. UAT, FAT, and SAT are all acceptance testing — which happens at the manufacturer's site, which at the customer's site after installation, and which is run by end-users against business needs?

---

### Answers

**Set A**
1. It's not Specific, Measurable, or Testable — "responsive" is subjective. SMART rewrite, e.g.: "The system shall respond to a user request within 2 seconds for 95% of requests" (source: m2-verify, m2-ex-verify). *Why:* an unverifiable requirement can't be proven met.
2. *Systems thinking* = the interaction lens (how interconnected parts affect each other); *holistic view* = the whole-system lens (balancing all concerns of the complete system in its environment) (source: m1-core).
3. Concept→…→Disposal is the **process stages** (the phases a system passes through, topic 02); "combine and test as you go" is a **lifecycle-model**/integration concern (how you sequence the work, topics 03/15) (source: m1-stages, m1-lifecycle).
4. **Forward** traceability (requirements → design/code/tests) tells you what a change affects; **backward** traceability (artifacts → source requirements) confirms nothing unnecessary was added. Both together = **bidirectional** (source: m2-reqtools).
5. A **verify** relationship links a test case to a requirement; a **satisfy** relationship allocates a requirement to a design element and is an assertion, *not* proof (source: m2-models).
6. Stable + documentation-heavy → **Waterfall** (or V-Model); fast-changing + weekly feedback → **Agile** (source: m1-lifecycle).
7. "100–240 V" = **constraint**; "set temperature from a phone" = **functional**; "$20 BOM cost" = **constraint** (a cost limitation). (Performance/quality limits like response time would be non-functional.) (source: m2-elicit, m2-ex-elicit).
8. Business requirements are top-level and can't be *derived from* anything, so a non-empty "Derived From" cell signals a relationship drawn in the wrong direction (source: m2-mbse).

**Set B**
1. A **decision matrix** (weighted scoring model); each cell combines a **score** and the criterion **weight** (score × weight) (source: m3-decision).
2. Zachman = 6×6 taxonomy; TOGAF = 9-phase ADM method; NIST EA = 5-layer model (source: m3-zachman, m3-togaf, m3-nist). *Why:* they differ in kind, not just detail.
3. "Subsystems and what each contains" = **BDD** (what exists); "GPS and IMU connected via ports" = **IBD** (how parts interact) (source: m2-models, m3-document).
4. *LiDAR vs stereo-vision* is a **design** decision; *that a perception subsystem exists* is an **architecture** decision (source: m3-intro).
5. Basic COCOMO: **E = a·(KLOC)^b** person-months. **Embedded** (a=3.6, b=1.20) gives the largest effort (source: m3-cocomo).
6. The **Interface Control Document (ICD)**; it specifies (any three) physical interfaces, data interfaces/formats, communication protocols, data-exchange details, constraints/assumptions, version control (source: m3-icd).
7. **Sensitivity analysis** — vary the weights and see whether the ranking/winner changes (source: master-notes, topic 13).

**Set C**
1. **Top-down needs stubs** (to stand in for lower modules) and tests high-level control logic early; **bottom-up needs drivers** (to stand in for higher callers) and tests foundational modules early (source: m4-integration).
2. "Built right" = **verification** (e.g. inspection, requirement-based testing); "right system" = **validation** (e.g. UAT, pilot testing, simulation) (source: m4-vv).
3. Run an **impact analysis**; the **Change Control Board (CCB)** gives final approval (source: m4-change, m4-ex-impact).
4. The login item with steps/expected result is a **test case**; the objectives/scope/scenarios/pass-fail document is a **test plan** (source: m4-testplans).
5. Dependency failure: suppliers delivered incomplete/incompatible components, or software-controlled generators caused power losses. Interface failure: mismatched data-communication standards across avionics, or the battery management system not communicating with other systems (overheating). Lesson: more in-house development / better ICDs / earlier subsystem testing (source: m4-integration).
6. Need → requirement (e.g. AI-SYS-101) → JIRA story → test case (TC-AI-SYS-101); the chain guarantees **end-to-end traceability** (source: playbook).
7. They surface defects at (or before) the commit that introduced them via rapid, automated feedback, instead of letting defects accumulate until an expensive end-of-cycle test phase (source: m4-change).
8. **FAT** at the manufacturer's site (before delivery); **SAT** at the customer's site (after installation); **UAT** run by end-users against business needs (source: m4-vv).
