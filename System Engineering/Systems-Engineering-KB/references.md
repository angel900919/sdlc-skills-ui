# References

## Source material

Everything in this knowledge base traces back to these sources. The **id** is what inline `(source: id)` citations point to. All paths are relative to `udacity/System Engineering/`. Every file is Markdown converted from the original Udacity *Systems Engineering* course (lecture pages, exercises, references, and synthesized study notes); the converted text carries systematic OCR typos, which this KB silently corrects while preserving meaning.

### Module 1 — Introduction to Systems Engineering

| id | Title / path | Topics fed |
|---|---|---|
| m1-intro | `1-Introduction to Systems Engineering/… - Introduction.md` | 01 |
| m1-core | `1-Introduction to Systems Engineering/… - Systems engineering and core principles.md` | 01 |
| m1-stages | `1-Introduction to Systems Engineering/… - Stages of the systems engineering process.md` | 02 |
| m1-lifecycle | `1-Introduction to Systems Engineering/… - System lifecycle models.md` | 03 |
| m1-tools | `1-Introduction to Systems Engineering/… - Common systems engineering tools and techniques.md` | 04 |
| m1-exercise | `1-Introduction to Systems Engineering/… - Exercise solution.md` | 04 |
| m1-review | `1-Introduction to Systems Engineering/… - Lesson review.md` | 01 |

### Module 2 — Requirements Analysis and System Modeling

| id | Title / path | Topics fed |
|---|---|---|
| m2-intro | `2-Requirements Analysis and System Modeling/lectures/… - Introduction.md` | 05 |
| m2-elicit | `2-… /lectures/… - Elicit and analyze requirements.md` | 05 |
| m2-verify | `2-… /lectures/… - Verifying requirements.md` | 06 |
| m2-reqtools | `2-… /lectures/… - Requirement management tools.md` | 07 |
| m2-models | `2-… /lectures/… - Creating and interpreting system models.md` | 08 |
| m2-sysml | `2-… /lectures/… - Creating SysML diagrams.md` | 08 |
| m2-mbse | `2-… /lectures/Requirements in Model-Based Systems Engineering (MBSE).md` | 09 |
| m2-review | `2-… /lectures/… - Lesson Review.md` | 07, 08 |
| m2-ex-elicit | `2-… /lectures/Exercise- Requirements elicitation.md` | 05 |
| m2-ex-vending | `2-… /lectures/Exercise VendingMachineSystem.md` | 08 |
| m2-ex-verify | `2-… /lectures/Exercise Verirication.md` | 06 |

### Module 3 — System Design and Architecture

| id | Title / path | Topics fed |
|---|---|---|
| m3-intro | `3-System Design and Architecture/lectures/… - Introduction.md` | 10 |
| m3-frameworks | `3-… /lectures/… - Architectural frameworks and design systems.md` | 10, 11 |
| m3-togaf | `3-… /lectures/… - TOGAF Framework.md` | 11 |
| m3-applytogaf | `3-… /lectures/… - Applying TOGAF.md` | 11 |
| m3-zachman | `3-… /lectures/… - Zachman Framework.md` | 11 |
| m3-nist | `3-… /lectures/… - NIST Framework.md` | 11 |
| m3-tradeoffs | `3-… /lectures/… - Evaluating design tradeoffs.md` | 12 |
| m3-perf | `3-… /lectures/… - Performance.md` | 12 |
| m3-cost | `3-… /lectures/… - Cost.md` | 12 |
| m3-scalability | `3-… /lectures/… - Scalability.md` | 12 |
| m3-decision | `3-… /lectures/… - Decision Matrix.md` | 13 |
| m3-document | `3-… /lectures/… - Document system architecture.md` | 14 |
| m3-review | `3-… /lectures/… - Lesson review.md` | 14 |
| m3-ex-decision | `3-… /lectures/Exercise decision matrix.md` | 13 |
| m3-ex-togaf | `3-… /lectures/Exercise- Applying TOGAF.md` | 11 |
| m3-cocomo | `3-… /Reference/COCOMO Model - Software Engineering - GeeksforGeeks.md` | 12 |
| m3-icd | `3-… /Reference/interface-control-document-icd-autonomous-delivery-robot-system.md` | 14 |

### Module 4 — System Integration, Verification, and Validation

| id | Title / path | Topics fed |
|---|---|---|
| m4-intro | `4-System_Integration_Verification_and_Validation/… - Introduction.md` | 15 |
| m4-integration | `4-… /… - Integration strategies and techniques.md` | 15 |
| m4-vv | `4-… /… - Verification and validation methods.md` | 16 |
| m4-testplans | `4-… /… - Test Plans.md` | 17 |
| m4-change | `4-… /… - Manage system changes and continuous validation.md` | 18 |
| m4-changemgmt | `4-… /… - Change management.md` | 18 |
| m4-review | `4-… /… - Lesson review.md` | 16 |
| m4-ex-testcase | `4-… /Exercise- Creating a test case.md` | 17 |
| m4-ex-impact | `4-… /Exercise- Perform impact analysis.md` | 18 |

### Cross-cutting synthesized notes

| id | Title / path | Topics fed |
|---|---|---|
| master-notes | `Master_Systems_Engineering_Course_Notes.md` (video-transcript synthesis of all four modules) | 01, 04, 05, 06, 07, 08, 12, 13, 14 |
| playbook | `Agile Systems Engineering Playbook.md` (integrative end-to-end workflow) | 19 |

> **Scope note.** Two files in the source folder — `Master_AI_Agents_Study_Guide.md` and `Multi-agent Orchestration Patterns.pdf` — cover *AI agents*, a different subject, and were deliberately **excluded** from this knowledge base.

## Further reading

Resources and standards named in the source material. URLs marked *(from source)* are the links the course itself provides; standards are listed by their designation rather than a fabricated URL.

**Tools (with tutorials referenced in the course)**
- ReqView quick-start tutorial — `https://www.reqview.com/doc/quick-start/` *(from source: m2-reqtools)* — requirements management tool used in Module 2.
- Visual Paradigm Online — `https://online.visual-paradigm.com/` *(from source: m2-sysml)* — free (limited) SysML modeling used in the exercises.
- Other tools named (no course URL): IBM Engineering Requirements Management DOORS, Jama Connect, Helix RM/ALM, Cameo Systems Modeler, Enterprise Architect (Sparx), Diagrams.net / draw.io, JIRA, Azure DevOps, GitHub/GitLab, IBM Engineering Workflow Management, Windchill, ServiceNow, BMC Remedy, Ansys ModelCenter, Postman, Swagger, JMeter, New Relic, Selenium, Testomat (sources: m1-tools, m2-reqtools, m4-changemgmt, m4-testplans).

**Standards named in the material** (consult the issuing body for the authoritative text)
- ISO/IEC/IEEE 29148 — requirements engineering processes; the BRS / StRS / SyRS / SRS / OpsCon document set (source: m1-tools).
- IEEE 830-1998 — software requirements specification template (source: m2-verify / master-notes).
- ISO/IEC 42010 — architecture description (source: m3-frameworks).
- ISO 26262 (automotive), DO-178C (airborne software), IEC 62304 (medical device software) — safety-critical compliance ReqView supports (source: m2-reqtools).
- NIST Special Publication 500-167 — the NIST Enterprise Architecture model (source: m3-nist).
- ISO 27001, PCI DSS, GDPR — referenced in the TOGAF banking example (source: m3-applytogaf).
- UL 1023 — household burglar-alarm system units, cited as a domain-requirement example (source: master-notes).

**Reference article**
- *COCOMO Model – Software Engineering* (GeeksforGeeks) — the cost-estimation reference behind topic 12 (source: m3-cocomo). Note: this converted copy has OCR-mangled formulas/code and an internally inconsistent worked example; topic 12 recomputes it cleanly.

## Glossary

Format: **Term** — *Q: self-test prompt* — answer/definition (source) → home topic. Attempt the prompt before reading the definition.

- **Acceptance testing** — *Q: which V&V question does it serve?* — Testing that confirms the system meets end-user needs in a real-world scenario before deployment; a *validation* activity (variants: UAT, OAT, FAT, SAT, regulatory) (source: m4-vv). → [16](topics/16-verification-validation-methods/fundamentals.md)
- **ADM (Architecture Development Method)** — *Q: how many phases, and what ties them together?* — TOGAF's cyclical 9-phase method (Preliminary, A–H) with central **Requirements Management** running through all phases (source: m3-togaf). → [11](topics/11-architecture-frameworks/fundamentals.md)
- **Agile model** — *Q: what does it value over a fixed plan?* — Iterative lifecycle delivering working increments in short sprints; values responding to change, working software, customer collaboration, and individuals/interactions (source: m1-lifecycle). → [03](topics/03-lifecycle-models/fundamentals.md)
- **Architecture (system)** — *Q: blueprint or detail?* — The major building blocks/subsystems, their relationships, and the guiding rules (layered, service-oriented, event-driven); the blueprint (source: m3-intro). **Why:** it partitions complexity before detailed design begins. → [10](topics/10-design-architecture-fundamentals/fundamentals.md)
- **Architectural framework** — *Q: what four things does it bundle?* — A structured approach bundling methodology, meta-model, viewpoints/views, and best practices for developing and governing architectures (source: m3-frameworks). → [10](topics/10-design-architecture-fundamentals/fundamentals.md)
- **Backward (reverse) traceability** — *Q: which direction?* — From tests/design back to source requirements; ensures no unnecessary elements were added (source: m2-reqtools). → [07](topics/07-requirements-management/fundamentals.md)
- **Baseline** — *Q: what does it lock?* — A fixed, version-controlled set of requirements/artifacts at a project stage, against which changes are managed (source: m2-reqtools). → [07](topics/07-requirements-management/fundamentals.md)
- **Bidirectional traceability** — *Q: when is it essential?* — Forward + backward traceability combined; essential for safety-critical projects and compliance (source: m2-reqtools). → [07](topics/07-requirements-management/fundamentals.md)
- **Block Definition Diagram (BDD)** — *Q: what does it define?* — A SysML structure diagram defining system blocks (components), their properties/operations, and relationships (composition, generalization, association) (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Bottleneck analysis** — *Q: what does it find?* — A scalability method that identifies performance constraints (CPU, memory, slow DB queries) limiting growth (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Bottom-up integration** — *Q: what does it need instead of stubs?* — Integration starting from the lowest-level modules upward; needs **drivers** to simulate higher levels (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **BRS (Business Requirements Specification)** — *Q: whose vision?* — ISO 29148 document capturing the business/mission vision: major goals, scope, user communities (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **Capacity planning** — *Q: what does it predict?* — Determining how much workload a system can handle before performance degrades, and when to add resources (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Change Control Board (CCB)** — *Q: what is its role?* — The authority that reviews and approves/rejects change requests after impact analysis (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **COCOMO** — *Q: who, and what does it estimate?* — Constructive Cost Model (Boehm, 1981); estimates software effort, time, and cost from size in KLOC (source: m3-cocomo). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Composite requirement** — *Q: what does it contain?* — A requirement decomposed into sub-requirements via namespace containment ("the system shall do A and B" → A, B) (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Configuration management** — *Q: what does it protect?* — Maintaining system integrity by preventing unauthorized changes and documenting each one (version control) (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **Constraint** — *Q: functional or limiting?* — A limitation imposed on the design (e.g. cost ceiling, regulatory compliance) (source: m2-elicit). → [05](topics/05-requirements-elicitation-analysis/fundamentals.md)
- **Continuous testing** — *Q: when does testing happen?* — Integrating automated + manual testing into every phase of the lifecycle for rapid feedback, not just at the end (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **Decision matrix (weighted scoring model)** — *Q: how is a winner picked?* — A structured tool: weight criteria, score each alternative, multiply, sum; highest total wins (source: m3-decision). **Why:** it makes a multi-criteria choice objective and defensible. → [13](topics/13-decision-matrix/fundamentals.md)
- **Decommissioning / Disposal** — *Q: what stage?* — The final lifecycle stage: retiring the system safely, handling environmental impact and recycling (source: m1-stages). → [02](topics/02-se-process-stages/fundamentals.md)
- **Dependency** — *Q: name the four types.* — When one component relies on another; types: data, control, timing/temporal, resource (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **Dependency matrix** — *Q: what does it auto-check?* — An MBSE table view of one relationship type (Verify, Derive, Satisfy) that auto-updates and reveals coverage gaps and errors (source: m2-mbse). → [09](topics/09-mbse-requirements/fundamentals.md)
- **Derive relationship** — *Q: between what, and why?* — A SysML relationship between requirements at different abstraction levels, imposing additional constraints from analysis (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Driver** — *Q: which integration needs it?* — A temporary module simulating a higher-level caller; needed for bottom-up integration (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **Elicitation** — *Q: from whom?* — Gathering information from stakeholders to define system needs (interviews, surveys, workshops, document review, observation) (source: m2-elicit). → [05](topics/05-requirements-elicitation-analysis/fundamentals.md)
- **Elasticity testing** — *Q: scale which ways?* — Evaluating how well a system scales dynamically up and down with real-time demand (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Effort Adjustment Factor (EAF)** — *Q: which COCOMO model?* — In Intermediate COCOMO, the product of 15 cost-driver multipliers applied to refine the basic effort estimate (source: m3-cocomo). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Functional Flow Block Diagram (FFBD)** — *Q: what does it model?* — A diagram of sequential functions and control flow (blocks, arrows, branches/loops) (source: m3-document). → [14](topics/14-documenting-architecture/fundamentals.md)
- **Functional requirement** — *Q: what vs how well?* — What the system must *do* (a specific feature/behavior) (source: m2-elicit). → [05](topics/05-requirements-elicitation-analysis/fundamentals.md)
- **Forward traceability** — *Q: which direction?* — From requirements to design, code, and tests; ensures all requirements are implemented and verified (source: m2-reqtools). → [07](topics/07-requirements-management/fundamentals.md)
- **Holistic view** — *Q: parts or whole?* — Considering the system as a whole so trade-offs are balanced and unintended consequences minimized (source: m1-core). → [01](topics/01-se-fundamentals/fundamentals.md)
- **Horizontal scalability** — *Q: scale out or up?* — Adding more nodes to distribute load (e.g. more servers behind a load balancer) (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Impact analysis** — *Q: what does it evaluate before approval?* — Evaluating how a proposed change affects performance, cost, schedule, dependencies, and compliance (source: m4-change). **Why:** it prevents costly mistakes by exposing system-wide effects before a change is approved. → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **Incremental integration** — *Q: what does it ease?* — Integrating/testing one component (or small group) at a time; easier fault isolation, continuous feedback (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **Inspection** — *Q: with or without execution?* — Detailed examination (visual/document/code) to detect defects *without* executing the system (source: m4-vv). → [16](topics/16-verification-validation-methods/fundamentals.md)
- **Interface Control Document (ICD)** — *Q: a contract for what?* — A formal document defining interactions between subsystems: physical/data/software interfaces, protocols, data exchange, constraints, version control (source: m3-icd). → [14](topics/14-documenting-architecture/fundamentals.md)
- **Internal Block Diagram (IBD)** — *Q: exists vs interacts?* — A SysML structure diagram showing a block's internal parts and their connections via ports; "how parts interact" (vs the BDD's "what exists") (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **ISO/IEC/IEEE 29148** — *Q: what does it standardize?* — The requirements-engineering standard defining the BRS, StRS, SyRS, SRS, and OpsCon templates (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **KLOC** — *Q: COCOMO's size unit?* — Kilo (thousand) Lines of Code; the size input to COCOMO (source: m3-cocomo). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Latency** — *Q: vs throughput?* — Delay between input and the start of processing (vs throughput = volume per unit time) (source: m3-perf). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Lifecycle thinking** — *Q: when does SE end?* — Managing a system across its whole life (concept → disposal), not just to delivery (source: m1-core). → [01](topics/01-se-fundamentals/fundamentals.md)
- **MBSE (Model-Based Systems Engineering)** — *Q: model vs document?* — A formalized methodology using models (not documents) as the single source of truth for requirements, design, analysis, V&V (source: m2-mbse). **Why:** it cuts development time/cost and enables secure-by-design. → [09](topics/09-mbse-requirements/fundamentals.md)
- **Modular design** — *Q: scale how?* — Structuring a system into independent, interchangeable modules so it scales without a full redesign (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Non-functional requirement** — *Q: what vs how well?* — How well the system performs (reliability, scalability, performance, security); the "ilities" (source: m2-elicit). → [05](topics/05-requirements-elicitation-analysis/fundamentals.md)
- **NIST EA Model** — *Q: how many layers?* — A 5-layer enterprise-architecture model (Business, Information, Information Systems, Data, Technology Infrastructure); NIST SP 500-167 (source: m3-nist). → [11](topics/11-architecture-frameworks/fundamentals.md)
- **OpsCon (Operational Concept)** — *Q: what does it describe?* — ISO 29148 document defining operational scenarios and how the system will be used (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **Orphaned requirement** — *Q: how is it found?* — A requirement with no Derive/Satisfy/Verify links; surfaced by a "negative space" dependency matrix (source: m2-mbse). → [09](topics/09-mbse-requirements/fundamentals.md)
- **Peer review** — *Q: who, checking for what?* — A structured activity where peers review requirements for clarity, completeness, consistency, verifiability (source: m2-verify). → [06](topics/06-verifying-requirements/fundamentals.md)
- **Pilot testing** — *Q: how broad a rollout?* — Deploying to a limited environment with real users before full-scale rollout to surface usability/performance issues (source: m4-vv). → [16](topics/16-verification-validation-methods/fundamentals.md)
- **Prioritization** — *Q: what scale does the course use?* — Ranking requirements by importance: High / Medium / Low / N/A (source: m2-elicit). → [05](topics/05-requirements-elicitation-analysis/fundamentals.md)
- **Refine relationship** — *Q: how does it differ from derive?* — A SysML relationship clarifying a requirement's meaning via any model element (e.g. a use case); unlike derive, it can link a requirement to *any* element (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Regression testing** — *Q: protects against what?* — Re-testing to ensure new changes don't break existing functionality; run frequently in Agile sprints (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **Requirements diagram** — *Q: what does it trace?* — A SysML diagram showing requirements and their relationships/traceability to blocks, test cases, and other requirements (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **ReqView** — *Q: general PM tool or purpose-built?* — A desktop requirements-management tool purpose-built for the full requirements lifecycle with traceability and compliance support (source: m2-reqtools). → [07](topics/07-requirements-management/fundamentals.md)
- **Risk management** — *Q: name two tools.* — Identifying, analyzing, mitigating risks; tools include FMEA (Failure Modes and Effects Analysis) and FTA (Fault Tree Analysis) (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **Satisfy relationship** — *Q: does it prove anything?* — A SysML relationship allocating a requirement to a design element; an assertion, **not** proof — proof comes from test cases (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Sensitivity analysis** — *Q: what does it test in a decision matrix?* — Changing criterion weights to see whether the winning alternative changes (source: master-notes). → [13](topics/13-decision-matrix/fundamentals.md)
- **Service virtualization** — *Q: stand-in for what?* — Lightweight simulators/mocks standing in for unavailable dependent services so tests aren't blocked (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **Shift-left testing** — *Q: move testing where?* — Defining/automating tests before or alongside code, moving quality checks earlier in the cycle (source: m4-change). → [18](topics/18-change-management-continuous-validation/fundamentals.md)
- **SMART criteria** — *Q: spell it out.* — A test of requirement quality: Specific, Measurable, Achievable, Relevant, Testable (source: m2-verify). **Why:** an unverifiable requirement can't be proven met. → [06](topics/06-verifying-requirements/fundamentals.md)
- **Spiral model** — *Q: what drives each loop?* — Boehm's iterative lifecycle; each spiral cycles Planning → Risk analysis → Engineering → Evaluation, driven by risk (source: m1-lifecycle). → [03](topics/03-lifecycle-models/fundamentals.md)
- **SRS (Software Requirements Specification)** — *Q: which layer?* — ISO 29148 document describing software-specific design/functional requirements (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **StRS (Stakeholder Requirements Specification)** — *Q: whose needs?* — ISO 29148 document defining stakeholder/user requirements and needs (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **Stub** — *Q: which integration needs it?* — A temporary module simulating lower-level behavior; needed for top-down integration (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **Stereotype** — *Q: like what?* — A SysML/UML extensibility tag (with its own properties) applied to elements like requirements for extra categorization (source: m2-mbse). → [09](topics/09-mbse-requirements/fundamentals.md)
- **SyRS (System Requirements Specification)** — *Q: what level?* — ISO 29148 document detailing the technical requirements — what the system must do (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **SysML** — *Q: extends what, for what?* — Systems Modeling Language; extends UML for systems engineering (hardware, software, electrical, mechanical) with 9 diagram types (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Systems engineering** — *Q: one-line definition?* — An interdisciplinary approach to realizing successful systems by integrating disciplines across the whole lifecycle (source: m1-core). → [01](topics/01-se-fundamentals/fundamentals.md)
- **Systems thinking** — *Q: lens for what?* — Understanding a system as interconnected components working toward a common goal; the interaction lens (source: m1-core). → [01](topics/01-se-fundamentals/fundamentals.md)
- **Test case** — *Q: name three required fields.* — A set of inputs/conditions verifying expected behavior; fields include ID, description, preconditions, steps, expected result (source: m4-testplans). → [17](topics/17-test-plans-cases/fundamentals.md)
- **Test plan** — *Q: case or strategy?* — A document outlining the overall test approach: objective, scope, approach, environment, scenarios, risks, pass/fail criteria (source: m4-testplans). → [17](topics/17-test-plans-cases/fundamentals.md)
- **TOGAF** — *Q: what does it stand for?* — The Open Group Architecture Framework; an enterprise-architecture method built around the ADM (source: m3-togaf). → [11](topics/11-architecture-frameworks/fundamentals.md)
- **Top-down integration** — *Q: starts where?* — Integration starting from top-level control logic downward; needs **stubs** for lower modules (source: m4-integration). → [15](topics/15-integration-strategies/fundamentals.md)
- **Total Cost of Ownership (TCO)** — *Q: one-time or lifetime?* — The full lifetime cost of a system (development, deployment, operation, maintenance, decommissioning) (source: m3-cost). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **Trade-off analysis** — *Q: balancing what?* — Evaluating design alternatives to balance cost, performance, and risk (source: m1-tools). → [04](topics/04-se-tools-techniques/fundamentals.md)
- **Traceability** — *Q: link to what?* — Linking each requirement to its source, design, code, and tests so the impact of change is known (source: m2-elicit). → [07](topics/07-requirements-management/fundamentals.md)
- **Verification** — *Q: which question?* — "Did we build the system *right*?" — confirming it meets specifications via inspection, review, testing (source: m4-vv). → [16](topics/16-verification-validation-methods/fundamentals.md)
- **Validation** — *Q: which question?* — "Did we build the *right* system?" — confirming it meets real user needs (source: m4-vv). → [16](topics/16-verification-validation-methods/fundamentals.md)
- **Verify relationship** — *Q: by what?* — A SysML relationship where a test case (or inspection/analysis/demonstration) verifies a requirement (source: m2-models). → [08](topics/08-sysml-modeling/fundamentals.md)
- **Vertical scalability** — *Q: scale up or out?* — Adding more resources to a single node (e.g. upgrade CPU/RAM) (source: m3-scalability). → [12](topics/12-design-tradeoffs/fundamentals.md)
- **V-Model** — *Q: what does each left phase pair with?* — A lifecycle where each design/decomposition phase (left) pairs with a corresponding test phase (right): module→unit, software→integration, system→system, requirements→acceptance (source: m1-lifecycle). → [03](topics/03-lifecycle-models/fundamentals.md)
- **Waterfall model** — *Q: best for what kind of requirements?* — A linear, sequential lifecycle; best for projects with clear, stable requirements (source: m1-lifecycle). → [03](topics/03-lifecycle-models/fundamentals.md)
- **Zachman Framework** — *Q: process or taxonomy?* — A 6×6 classification taxonomy (6 interrogatives × 6 perspectives), not a process (source: m3-zachman). → [11](topics/11-architecture-frameworks/fundamentals.md)
