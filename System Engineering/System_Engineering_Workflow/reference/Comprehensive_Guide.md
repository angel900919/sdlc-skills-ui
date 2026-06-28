# Systems Engineering — Comprehensive Reference Guide

> A consolidated, end-to-end reference covering every process step, technique, and tool taught across Modules 1–4 of the Systems Engineering course, complemented with up-to-date industry alternatives and a fully worked example at the end.

> **📍 Current front door:** For the active, up-to-date workflow start here → [`../01_Workflow_Overview.md`](../01_Workflow_Overview.md). This guide is the deep-reference companion.

> **⚠️ Two distinct worked examples — do not conflate:** The §10 worked example in *this* guide is the **Smart Home Security System (SHSS)**, a **second, illustrative** example used for teaching. It is **DISTINCT** from the **canonical EV Charging Station Network** maintained in [`../worked_example/`](../worked_example/). Any cross-reference to **"SHSS"** points to **this guide's** §10 example — **not** to the `worked_example/` folder (which is EV-charging). When in doubt: `worked_example/` = EV Charging (canonical); this guide §10 = SHSS (illustrative).

---

## Table of Contents

1. [What is Systems Engineering?](#1-what-is-systems-engineering)
2. [The Systems Engineering Lifecycle](#2-the-systems-engineering-lifecycle)
3. [Lifecycle Models](#3-lifecycle-models)
4. [Module 1 — Foundational Tools & Standards](#4-module-1--foundational-tools--standards)
5. [Module 2 — Requirements Analysis & System Modeling](#5-module-2--requirements-analysis--system-modeling)
6. [Module 3 — System Design & Architecture](#6-module-3--system-design--architecture)
7. [Module 4 — Integration, Verification & Validation](#7-module-4--integration-verification--validation)
8. [Change Management & Continuous Validation](#8-change-management--continuous-validation)
9. [Master Tool Map (Recommended + Alternatives)](#9-master-tool-map-recommended--alternatives)
10. [End-to-End Worked Example: Smart Home Security System](#10-end-to-end-worked-example-smart-home-security-system)

---

## 1. What is Systems Engineering?

**Systems Engineering (SE)** is an interdisciplinary approach that designs, integrates, and manages complex systems across their entire lifecycle. It ensures hardware, software, people, and processes work together seamlessly to satisfy stakeholder needs.

### Core Principles

| Principle | Description |
|---|---|
| **Systems Thinking** | View the system as a whole — see the forest, not just the trees. |
| **Holistic View** | Balance trade-offs (performance vs. cost vs. risk) across the whole system. |
| **Lifecycle Thinking** | Manage the system from concept through disposal. |
| **Interdisciplinary Collaboration** | Bridge mechanical, electrical, software, and management domains. |

### Why It Matters
Without SE, teams work in silos and integration fails late. With SE, stakeholder needs drive design, interfaces are defined early, and systems are built right the first time. **Famous failure:** NASA's Mars Climate Orbiter (1999) was lost ($125M) because one team used metric units and another used imperial — a single requirements oversight.

### History
- **WWI / WWII** — Radar systems, Manhattan Project (origins of SE).
- **1950s–60s (Golden Age)** — NASA Apollo program pioneered SE methodologies.
- **Modern era** — Healthcare robotics, autonomous vehicles, smart grids, cybersecurity, LLM-based systems.

---

## 2. The Systems Engineering Lifecycle

| Stage | Goal | Example Activity |
|---|---|---|
| **Concept** | Identify stakeholder needs and define goals. | Market research for an EV. |
| **Development** | Translate needs into blueprints, models, prototypes. | Design a satellite payload, run thermal-vacuum sims. |
| **Production** | Manufacture and assemble. | Factory acceptance tests for a medical device. |
| **Operations & Maintenance** | Active use, monitoring, patches. | Deploy software updates, scale servers. |
| **Disposal** | Decommissioning and retirement. | Safe containment of nuclear waste; data wiping & battery recycling. |

---

## 3. Lifecycle Models

| Model | Best For | Notes |
|---|---|---|
| **Waterfall** | Stable, well-understood requirements (bridges, commercial aircraft). | Linear, sequential. |
| **V-Model** | Safety-critical (medical robotics, avionics). | Each design step on the left has a corresponding test on the right. |
| **Spiral** | High-risk, evolving projects (banking apps with security spirals). | Iterative + risk-focused. |
| **Agile** | Fast-moving, user-feedback driven (mobile apps, SaaS). | Sprints, MVP, frequent delivery. |
| **Hybrid / SAFe** *(modern complement)* | Large enterprises blending Agile with regulatory rigor. | Scaled Agile Framework. |

---

## 4. Module 1 — Foundational Tools & Standards

### 4.1 Requirement Management Tools

| Tool | Strengths | License |
|---|---|---|
| **IBM Engineering Requirements Management DOORS / DOORS Next** *(Recommended for large/regulated systems)* | Industry standard for aerospace, defense, automotive; rich traceability. | Commercial |
| **Jama Connect** | Collaboration, traceability, risk management. | Commercial |
| **Helix RM (formerly Helix ALM)** | Real-time collaboration, impact analysis, regulatory tracking. | Commercial |
| **ReqView** *(Recommended for small projects / individual learning)* | Lightweight, structured, web-based. | Freemium |
| **Polarion ALM** *(modern alternative)* | Siemens platform, integrated with PLM tools. | Commercial |
| **Modern Lite Alternatives** | Notion, Confluence + Jira, GitHub Issues with markdown, ReqIF-XML. | Free / Mixed |

### 4.2 ISO/IEC/IEEE 29148 Document Templates
The international standard for requirements engineering. Five templates:

| Template | Purpose |
|---|---|
| **BRS** — Business Requirements Specification | Mission/business goals. |
| **StRS** — Stakeholder Requirements Specification | What stakeholders need. |
| **SyRS** — System Requirements Specification | Technical "shall" requirements. |
| **SRS** — Software Requirements Specification | Software-only requirements. |
| **OpsCon** — Operational Concept | Day-in-the-life usage scenarios. |

### 4.3 MBSE Tools (Model-Based Systems Engineering)

| Tool | Strengths | License |
|---|---|---|
| **SysML v1 / v2** *(Standard language)* | The de-facto modeling language for SE. v2 (released 2023+) replaces XMI with a textual API and improves rigor. | Standard |
| **Cameo Systems Modeler / MagicDraw (Dassault)** *(Recommended for industry)* | Robust, simulation-capable, used in aerospace/defense. | Commercial |
| **Sparx Enterprise Architect** | Supports UML, SysML, BPMN, ArchiMate. | Commercial |
| **Visual Paradigm** *(Recommended for learning)* | Free online tier, full SysML support. | Freemium |
| **Diagrams.net (draw.io)** *(Recommended for free/quick diagrams)* | Free, browser-based, exportable. | Free / Open Source |
| **Capella + Arcadia** *(modern open-source alternative)* | Eclipse-based MBSE, strong in aerospace. | Free / Open Source |
| **PlantUML / Mermaid** *(modern code-as-diagram alternatives)* | Text-driven, version-controllable. | Free / Open Source |

### 4.4 Core Techniques (Cross-cutting)

| Technique | Use |
|---|---|
| **Trade-off Analysis** | Choose between alternatives (e.g., aluminum vs. carbon fiber wing). |
| **Risk Management (FMEA, FTA)** | Identify probability and impact of failures. |
| **Verification & Validation** | Prove the system meets specs and user needs. |
| **Interface Management (ICD)** | Define and govern subsystem boundaries. |

---

## 5. Module 2 — Requirements Analysis & System Modeling

### 5.1 Requirements Elicitation

| Method | Description | Pros | Cons |
|---|---|---|---|
| **Interviews** | One-on-one with stakeholders. | Deep insight, clarifies ambiguity. | Time-consuming. |
| **Workshops** | Multi-stakeholder brainstorming. | Builds buy-in, resolves conflict. | Needs skilled facilitation. |
| **Surveys / Questionnaires** | Structured feedback at scale. | Cheap, quantitative. | Shallow, depends on question quality. |
| **Observation** | Watch users with current system. | Reveals real (not stated) behavior. | Time-intensive. |
| **Document Review** | Analyze existing specs, regulations, incident reports. | Surfaces hidden constraints. | Needs domain expertise. |
| *(Modern complement)* **User Story Mapping / Jobs-to-be-Done** | Agile, user-journey driven. | Connects features to outcomes. | Less formal. |

### 5.2 Requirement Types

| Type | Definition | Example (Smart Home Security) |
|---|---|---|
| **Functional** | What the system *does*. | "The system shall detect motion within a 10 m radius and trigger an alarm." |
| **Non-Functional (Quality Attributes)** | *How well* it performs (performance, reliability, security, usability, scalability, maintainability). | "The alarm shall trigger in less than 3 seconds." |
| **Domain / Constraint** | Industry-specific compliance or limits. | "Shall comply with UL 1023 intrusion-detection standard." |

### 5.3 Verifying Requirements — SMART

| Letter | Attribute | Example |
|---|---|---|
| **S**pecific | Clear, unambiguous. | "Trigger an alarm" (not "respond fast"). |
| **M**easurable | Quantifiable. | "within 2 seconds." |
| **A**chievable | Feasible. | Sensor latency supports 2 s. |
| **R**elevant | Aligned with goals. | Supports security mission. |
| **T**ime-bound / Testable | Deadline + testable criterion. | "in 95% of test cases at 5/7/10 m." |

**Bad:** "The system should have a fast response time."
**Good:** "The security system shall trigger an alarm within 2 seconds of detecting unauthorized motion."

### 5.4 Standardized Templates
- **IEEE 830-1998 / ISO 29148** (IEEE 830 superseded by / rolled into ISO/IEC/IEEE 29148) — structured requirement format with verification method, rationale, and source.
- **EARS (Easy Approach to Requirements Syntax)** *(modern complement)* — controlled natural-language patterns: *Ubiquitous, Event-driven, State-driven, Optional, Unwanted-behavior, Complex.*

### 5.5 Traceability

| Direction | Purpose |
|---|---|
| **Forward** | Requirement → Design → Code → Test (proves needs are met). |
| **Backward** | Test/Code → Requirement (catches gold-plating / orphans). |
| **Bidirectional** | Both — required for safety-critical (DO-178C, ISO 26262). |

### 5.6 SysML — The 9 Diagram Types

> **Note:** The active workflow uses a **7-of-9 working subset** by default — it drops the **Package** and **Parametric** diagrams. See [`../05_Conventions.md`](../05_Conventions.md) §7.

| Category | Diagram | Purpose |
|---|---|---|
| **Structure** | **Block Definition Diagram (BDD)** | Components, properties, operations, hierarchy. |
| | **Internal Block Diagram (IBD)** | Internal wiring, ports, flows. |
| | **Package Diagram** | Hierarchical grouping. |
| | **Parametric Diagram** | Math/physics constraints (e.g., battery life equation). |
| **Behavior** | **Use Case Diagram** | Actors and system goals. |
| | **Activity Diagram** | Workflow with concurrency. |
| | **Sequence Diagram** | Time-ordered messages between parts. |
| | **State Machine Diagram** | States and transitions. |
| **Requirements** | **Requirements Diagram** | Hierarchies and traceability links: *derive*, *satisfy*, *verify*, *refine*. |

### 5.7 SysML Requirement Relationships

| Relationship | Meaning | Example |
|---|---|---|
| **Derive** | A new requirement extracted from a higher-level one. | "Wireless module" derived from "send alerts." |
| **Satisfy** | Design element fulfills a requirement. | Battery component *satisfies* "10 h battery life." |
| **Verify** | Test case proves the requirement. | Lab test *verifies* alarm response time. |
| **Refine** | More detailed version of a higher-level requirement. | "PIR sensor, 10 m, 100°" *refines* "real-time intrusion detection." |

### 5.8 Recommended Modeling Tools (Module 2)
- **Recommended:** Visual Paradigm (free online), Cameo (industry).
- **Alternatives:** draw.io, PlantUML, Capella, Eclipse Papyrus.

---

## 6. Module 3 — System Design & Architecture

### 6.1 Architecture vs. Design
- **Architecture** = the floor plan (high-level blocks and rules).
- **Design** = the wiring, plumbing, and finishes (specific tech choices).

### 6.2 Architectural Frameworks

#### 6.2.1 TOGAF — Architecture Development Method (ADM, 9 phases)

| Phase | Activity |
|---|---|
| **Preliminary** | Establish principles & governance. |
| **A — Architecture Vision** | Define goals, scope, stakeholders. |
| **B — Business Architecture** | Processes, functions, roles. |
| **C — Information Systems** | Data + Application architecture. |
| **D — Technology Architecture** | Infrastructure, hardware, networks, security. |
| **E — Opportunities & Solutions** | Identify projects, MVP, roadmap. |
| **F — Migration Planning** | Deployment strategy (e.g., blue-green). |
| **G — Implementation Governance** | Compliance, ISO 27001, PCI-DSS, GDPR. |
| **H — Architecture Change Management** | Evolve over time. |

#### 6.2.2 NIST Enterprise Architecture (5 Layers)
1. Business Architecture
2. Information Architecture
3. Information System Architecture
4. Data Architecture
5. Technology Architecture

#### 6.2.3 Zachman Framework — 6 × 6 Matrix

| Rows (Perspectives) ↓ / Columns → | What (Data) | How (Function) | Where (Network) | Who (People) | When (Time) | Why (Motivation) |
|---|---|---|---|---|---|---|
| **Planner / Executive** | Scope of data | Scope of process | Scope of geography | Scope of stakeholders | Scope of timing | Scope of strategy |
| **Owner / Business** | Conceptual data | Business process | Business location | Business roles | Business events | Business goals |
| **Designer / Architect** | Logical data | System logic | Logical network | System roles | Logical events | Design rationale |
| **Builder / Engineer** | Physical data | Technical design | Physical network | Technical roles | Trigger schedules | Technical rules |
| **Subcontractor / Implementer** | Data definitions | Configuration | Network deployment | Operational roles | Execution schedules | Implementation goals |
| **Functioning System / User** | Live data | Live operations | Live infrastructure | Live users | Live timing | Live goals |

#### 6.2.4 Modern Complements
- **C4 Model** (Context, Container, Component, Code) — a lightweight, visual approach to software architecture. Pairs naturally with PlantUML/Structurizr.
- **arc42** — a lean architecture documentation template.
- **DoDAF / MODAF / UAF** — defense-oriented frameworks with SysML/UPDM mapping.
- **AWS / Azure / Google Cloud Well-Architected Frameworks** — cloud-native architectural pillars (operational excellence, security, reliability, performance, cost, sustainability).

### 6.3 Evaluating Design Trade-offs

#### 6.3.1 Performance Analysis
| Method | Use |
|---|---|
| **Benchmarking** | Compare to industry baselines (e.g., camera response time vs. competitors). |
| **Simulation & Modeling** | Digital twins (MATLAB, Simulink, AnyLogic). |
| **Load Testing** | Stress with synthetic load (JMeter, k6, Locust, Gatling). |
| **Latency & Throughput Measurement** | End-to-end timing and concurrency limits. |

#### 6.3.2 Cost Analysis
| Method | Use |
|---|---|
| **Life-Cycle Cost Analysis (LCA)** | Total cost from design to disposal, with discounted cash flow (DCF). |
| **Total Cost of Ownership (TCO)** | Direct + indirect cost over lifetime. |
| **Cost-Benefit Analysis (CBA)** | Net benefit = total benefit − total cost. |
| **ROI** | (Net Gain − Cost) / Cost × 100%. |
| **COCOMO** | Software effort estimation (see 6.4). |

#### 6.3.3 Capacity / Scalability Analysis
| Method | Use |
|---|---|
| **Capacity Planning** | Forecast demand and resource needs. |
| **Elasticity Testing** | Validate auto-scale up/down. |
| **Bottleneck Analysis** | Find slow queries, IO contention, etc. |
| **Modular Design** | Decouple via microservices, plug-and-play. |
| **Vertical vs. Horizontal Scaling** | Add resources to one node vs. add more nodes. |

### 6.4 COCOMO Model (Constructive Cost Model)

Boehm's effort-estimation model.

**Basic equation:** `E = a × (KLOC)^b`,  `T_dev = c × (E)^d`

| Project Type | a | b | c | d | Example |
|---|---|---|---|---|---|
| **Organic** (small team, well-known domain) | 2.4 | 1.05 | 2.5 | 0.38 | Simple payroll system. |
| **Semi-Detached** (medium complexity) | 3.0 | 1.12 | 2.5 | 0.35 | New system interfacing with existing ones. |
| **Embedded** (highly constrained) | 3.6 | 1.20 | 2.5 | 0.32 | Flight-control software. |

**Three flavors:**
1. **Basic** — size only.
2. **Intermediate** — adds 15 cost drivers (Effort Adjustment Factor, EAF). Categories: Product, Hardware, Personnel, Project.
3. **Detailed** — applies COCOMO per module across 6 phases (planning, system design, detailed design, code/test, integration, cost-construct).

**Modern complement:** COCOMO II, story points + velocity-based estimation, Monte Carlo schedule simulation.

### 6.5 Decision Matrix (Weighted Scoring)

Steps:
1. **Identify decision criteria** (performance, cost, risk, scalability, maintainability).
2. **List comparable alternatives** at the same level of detail.
3. **Weight criteria** (e.g., size 20 %, weight 25 %, capacity 35 %, cost 20 %).
4. **Score each alternative** (1–10 or %).
5. **Compute weighted total** and run sensitivity analysis.

### 6.6 Documenting System Architecture

#### 6.6.1 Block Definition Diagram (BDD) — 5 Steps
1. Identify the system + components.
2. Define each block (attributes + operations).
3. Establish relationships (filled diamond = composition; hollow triangle = generalization; line = association).
4. Add properties.
5. Build with a SysML tool (draw.io, Cameo, Visual Paradigm).

#### 6.6.2 Internal Block Diagram (IBD) — 5 Steps
1. Choose a block to decompose.
2. Define internal parts.
3. Show connections (signal/data/physical flow).
4. Add ports — *standard* (interface-based) and *flow* (energy/material/data).
5. Validate against requirements.

#### 6.6.3 Interface Control Document (ICD)
A formal contract describing:
- **Overview & systems involved**
- **Physical interfaces** — connectors, voltages, mechanical fit (XT60, JST, USB, M12).
- **Data interfaces** — protocols, formats, frequency (CAN, I²C, MQTT, JSON, Protobuf).
- **Software interfaces** — APIs, function calls.
- **Communication protocols** — TCP/IP, CAN, UART, MQTT; message formats; CRC, retries.
- **Constraints & assumptions** — power, latency, environmental.
- **Version control & change tracking.**

#### 6.6.4 Stakeholder-Tailored Documentation Practices
- **Executives** → high-level summaries, ROI charts.
- **Engineers** → BDD/IBD, API specs.
- **Use clear language**, visuals, and traceability links.
- **Always justify trade-offs** so future readers understand "why."

### 6.7 Architecture / Design Tool Map (Module 3)

| Need | Recommended | Alternatives |
|---|---|---|
| Diagrams | **draw.io / diagrams.net** | PlantUML, Mermaid, Lucidchart, Excalidraw |
| Detailed SysML | **Cameo / MagicDraw** | Capella, Sparx EA, Visual Paradigm |
| Trade-off / parametric | **MATLAB / Simulink** | AnyLogic, Modelica, Python/NumPy |
| Load testing | **JMeter** | k6, Locust, Gatling, Artillery |
| ICD authoring | **Word / LaTeX templates** | Confluence, Polarion, DOORS modules |
| Decision matrices | **Excel / Google Sheets** | Airtable, Notion DB, custom Python |

---

## 7. Module 4 — Integration, Verification & Validation

### 7.1 The V&V Question
- **Verification:** "Did we build the system **right**?" (specs).
- **Validation:** "Did we build the **right** system?" (user needs).

### 7.2 Integration Strategies

| Strategy | Approach | Pros | Cons | Artifacts Needed |
|---|---|---|---|---|
| **Top-Down** | Start with high-level logic, integrate downward. | Validates UI/architecture early. | Late hardware integration; needs **Stubs**. | Stubs |
| **Bottom-Up** | Start with low-level modules (drivers, sensors). | Tests fundamentals early; no stubs. | High-level seen late; needs **Drivers**. | Drivers |
| **Incremental** | Add one component at a time, end-to-end. | Easy fault isolation, continuous feedback. | Needs robust harness; many test cycles. | Test harness |
| **Big Bang** *(rarely advised)* | Integrate all at once. | Cheap upfront. | Painful to debug. | — |
| **Continuous Integration (CI)** *(modern complement)* | Auto-integrate on every commit. | Fast feedback. | Requires test automation. | CI server (Jenkins, GitHub Actions, GitLab CI). |

### 7.3 Dependencies & Interfaces

**Dependency types:** Data, Control, Temporal, Resource.
**Interface types:** Hardware, Software (API), Human-Machine (HMI).

**Best Practices:**
- Modular design + dependency injection.
- Clear integration order.
- Use stubs/drivers/mocks for missing pieces.
- Standardize protocols (REST, gRPC, MQTT).
- Use ICDs and OpenAPI/Swagger contracts.
- Automate interface testing.

**Real-world lesson — Boeing 787 Dreamliner:** 70 % outsourced components → mismatched data standards → power/avionics integration failures. Fix: more in-house work, better ICDs, earlier integration testing.

### 7.4 Verification Methods

| Method | Description | Examples |
|---|---|---|
| **Inspection** | Manual review of physical/code/document artifacts. | PCB layout review, code walkthrough. |
| **Reviews** | Structured peer evaluation. | NASA PDR (Preliminary), CDR (Critical Design Review). |
| **Testing** | Executing the system. | Unit → Integration → System → Acceptance. |
| **Analysis / Demonstration** *(formal V&V methods per IEEE 1012)* | Mathematical or simulated proof; live demo. | Formal verification, model checking. |

### 7.5 Validation Methods

| Method | Description |
|---|---|
| **Acceptance Testing** | UAT (user), OAT (operational), FAT (factory), SAT (site), Regulatory Compliance. |
| **Pilot / Beta Testing** | Limited real-world deployment. |
| **Simulation & Prototyping** | Digital twins, hardware-in-the-loop (HIL), simulators. |
| **A/B Testing** *(modern complement)* | Compare versions in production. |

**Validation Best Practices:** engage users early, test in real environments, iterate, document pass/fail criteria.

### 7.6 Test Cases & Test Plans

#### Test Case Fields
- ID (e.g., NAV_001)
- Title / Description
- Preconditions
- Steps (with per-step expected result)
- Overall Expected Result
- Status & Actual Result (filled after run)
- Traceability link (REQ ID)
- Priority

#### Test Plan Fields
- ID, Objective
- Scope (in/out)
- Approach (manual / automated / hybrid)
- Environment (HW/SW/network)
- Risks
- Pass / Fail criteria
- List of test cases

#### Recommended Tools
- **Testomat.io** *(Recommended for free / web-based learning)* — free, no install.
- **TestRail, Xray (Jira), Zephyr, qTest** — commercial, enterprise-grade.
- **TestLink** — open-source, self-hosted.
- **Polarion QA, IBM Engineering Test Management (ETM)** — for regulated industries.

### 7.7 Test Automation & V&V Tooling

| Layer | Recommended | Alternatives |
|---|---|---|
| Unit | **JUnit 5 (Java), PyTest (Python), Google Test (C++)** | NUnit, Jest, Mocha |
| Integration / API | **Postman, REST Assured** | Newman, Karate, Insomnia |
| UI / E2E | **Playwright** *(modern recommended)*, Cypress, Selenium | TestCafe, Puppeteer |
| Load | **JMeter, k6** | Locust, Gatling |
| Security | **OWASP ZAP, Burp Suite** | Snyk, Trivy |
| Static analysis | **SonarQube** | CodeQL, Semgrep |
| Hardware-in-the-loop | **dSPACE, NI VeriStand, Speedgoat** | Custom Python rigs |
| CI/CD | **GitHub Actions, GitLab CI, Jenkins** | CircleCI, Azure DevOps Pipelines |

---

## 8. Change Management & Continuous Validation

### 8.1 Impact Analysis (5 questions)
1. **Scope** — what is affected?
2. **Risk & Dependencies** — regression potential.
3. **Cost & Schedule** — time/budget delta.
4. **Compliance & Safety** — regulatory exposure.
5. **Stakeholder input** — engineering, ops, legal.

### 8.2 Change Control Process
1. Submit Change Request (CR).
2. Feasibility check.
3. Impact Analysis.
4. **Change Control Board (CCB)** review → Approve / Reject / Defer.
5. Implement and test.
6. Update documentation, baseline, traceability.
7. Notify stakeholders.

### 8.3 Continuous Testing (Agile/DevOps)
- **Shift-Left Testing** — test as early as possible.
- **CI/CD pipelines** — automated tests on each commit.
- **Test pyramid** — many unit, fewer integration, fewest E2E.
- **Fail-Fast** — quick feedback prevents accumulation of bugs.

### 8.4 Change-Management Tools by Domain

| Domain | Recommended | Alternatives |
|---|---|---|
| Agile software | **Jira, Azure DevOps** | GitHub Issues/Projects, GitLab, Linear, ClickUp |
| Code/version | **Git + GitHub / GitLab** | Bitbucket, Perforce, Helix Core |
| Systems engineering | **IBM EWM, Windchill, Helix ALM** | Polarion, Teamcenter |
| Enterprise IT | **ServiceNow, BMC Remedy** | Jira Service Management, Freshservice |
| Risk / impact analysis | **Ansys ModelCenter, SAP CTS** | Custom scripts + dependency graphs |

**Real-world lesson — WhatsApp End-to-End Encryption rollout:** incremental regional rollout, performance testing, beta groups, backward compatibility, regulatory engagement, user communication. Reinforces the value of structured change management.

---

## 9. Master Tool Map (Recommended + Alternatives)

| Process Step | Course-Recommended Tool | Modern / Alternative |
|---|---|---|
| Requirements management | **IBM DOORS / ReqView** | Jama, Polarion, Helix RM, Notion + Confluence |
| Requirements standard | **ISO/IEC/IEEE 29148** | EARS, INCOSE Guide for Writing Requirements |
| Use-case modeling | **SysML Use Case (Visual Paradigm)** | UML, Jobs-to-be-Done canvases |
| MBSE modeling | **Cameo / Visual Paradigm** | Capella, Sparx EA, Eclipse Papyrus |
| Free diagramming | **draw.io / diagrams.net** | PlantUML, Mermaid, Excalidraw |
| Architecture frameworks | **TOGAF / Zachman / NIST** | C4, arc42, DoDAF, UAF, Cloud Well-Architected |
| Trade-off & decision | **Decision Matrix (Excel)** | AHP (Analytic Hierarchy Process), TOPSIS |
| Cost estimation | **COCOMO** | COCOMO II, Function Points, Story Points + Velocity |
| Performance | **JMeter** | k6, Locust, Gatling, MATLAB/Simulink |
| ICD | **Word/LaTeX template** | Polarion, DOORS module, Confluence |
| Test management | **Testomat.io** | TestRail, Xray, Zephyr, qTest, TestLink |
| Test automation | **Selenium, JUnit, PyTest, Postman** | Playwright, Cypress, REST Assured, Karate |
| CI/CD | **Jenkins** | GitHub Actions, GitLab CI, Azure DevOps |
| Change management (SE) | **IBM EWM, Windchill** | Polarion, Helix ALM |
| Change management (SW) | **Jira, GitHub** | GitLab, Azure DevOps, Linear |
| Risk analysis | **FMEA, FTA, Ansys ModelCenter** | Bowtie diagrams, Monte Carlo (PyMC, @RISK) |

---

## 10. End-to-End Worked Example: Smart Home Security System

> A complete walk-through applying every step and tool from Modules 1–4 to design, document, and validate a **Smart Home Security System (SHSS)** — the actual project delivered in this repository (`Deliverables/`). Each step calls out the tool the project uses, the lecture-recommended tool, and viable alternatives. References to existing artifacts: `Deliverables/SysRS_SmartHome.md`, `Deliverables/Architecture_Diagram.puml`, `Deliverables/SysML_Blocks.puml`, `Deliverables/Decision_Matrix_Evaluation.xlsx`, `Deliverables/Verification_Validation_Tests.xlsx`.

---

### Step 1 — Concept Stage (Module 1)
**Activity:** Identify stakeholders and goals.

**Stakeholders:**
- **Homeowner / Admin** — primary system manager, configures sensors, manages users, defines rules.
- **Resident / User** — family member or tenant, arms/disarms, views feeds, receives alerts.
- **Maintenance Technician** — service provider, hardware diagnostics and repair.
- **Privacy & Safety Regulators** — compliance with data protection (GDPR/CCPA) and intrusion-alarm standards (e.g., UL 1023).
- **Cloud Service Provider** — external dependency for remote alerts and storage.

**Mission:** A 24/7 autonomous residential monitoring system that detects intrusions, monitors environmental hazards (water leaks), captures video on demand, and delivers real-time alerts to homeowners — increasing safety and peace of mind.

**Lifecycle model chosen:** **Hybrid V-Model + Agile** — V-Model rigor for safety-critical paths (alarm trigger, lockout logic) and Agile sprints for the mobile app, web portal, and cloud features.

**Tools:** Markdown for the project plan (`Project_Development_Plan.md`); Notion / Miro for early stakeholder mapping. *Alternative:* Confluence + draw.io.

---

### Step 2 — Requirements Elicitation & Analysis (Module 2)
**Activity:** Gather and classify requirements using interviews, surveys, observation, and document review of regulatory standards.

**Standard used:** **IEEE 29148:2018 §9.4** — the SysRS template (the project's required spec). The full document is `Deliverables/SysRS_SmartHome.md` with all 10 sections: Introduction, Overview, Functional, Usability, Performance, System Interfaces, System Operations, Modes & States, Verification, Assumptions & Dependencies.

**Requirements catalogue (excerpt — pulled directly from the project SysRS):**

| ID | Type | Statement | Source |
|---|---|---|---|
| **REQ-F-01** | Functional | The CCU shall process motion sensor triggers within 200 ms of receipt. | Performance brief |
| **REQ-F-04** | Functional | If the system is "Armed" and an intrusion sensor is triggered, the CCU shall activate the internal siren (≥ 85 dB) within 1 s. | Safety / regulatory |
| **REQ-F-08** | Functional (Security) | The system shall require multi-factor authentication for all admin logins. | Compliance |
| **REQ-U-01** | Usability | Users shall arm or disarm within 5 s of opening the app in 95 % of attempts. | UX research |
| **REQ-P-02** | Performance | Notification delivery to the user's mobile shall be < 5 s from event detection. | Stakeholder workshop |
| **REQ-P-04** | Reliability | Battery sensors shall operate ≥ 2 years on one CR123A under 10 triggers/day. | Operations |
| **REQ-O-05** | Reliability | Local security functions shall maintain 99.9 % uptime independent of internet. | Insurance / audit |
| **REQ-SEC-01** | Security | All wireless communication between sensors and CCU shall use AES-128 encryption. | Compliance |

**SMART check (REQ-F-04):** Specific (siren, armed mode, intrusion sensor), Measurable (≥ 85 dB, ≤ 1 s), Achievable (typical PIR + relay latency), Relevant (intrusion deterrence), Time-bound (1 s window). ✅

**Tooling choice:**
- **Project uses:** Markdown SysRS authored to IEEE 29148 §9.4 — pragmatic, version-controllable, PDF-exportable.
- **Lecture-recommended:** **ReqView** (free tier) for hierarchical requirements with traceability. *Alternatives:* Jama Connect, IBM DOORS, Polarion ALM, Helix RM.

---

### Step 3 — System Modeling with SysML (Module 2)

#### 3.1 Use Case Diagram
- **Actors:** *Homeowner*, *Resident*, *Maintenance Technician*, *Cloud Service*.
- **Use cases:** *Arm / Disarm System, View Live Feed, Receive Alert, Bypass Sensor, Configure User, Apply OTA Update, Remote Unlock.*

#### 3.2 Requirements Diagram (refine / derive / satisfy / verify)
```
[REQ-F-04 Alarm Trigger ≤ 1 s]
   ├── refine → [REQ-F-04.1 Siren ≥ 85 dB]
   ├── refine → [REQ-F-04.2 Entry Delay 0–60 s]   (REQ-F-05)
   ├── derive → [REQ-INT-01 CCU↔Siren digital I/O ≤ 50 ms]
   └── satisfy ← [Block: Alarm System]
                         └── verify ← [Test: TC-VER-03]
```

#### 3.3 Block Definition Diagram (BDD) — *the seven mandated blocks*
**Top block:** `SmartHomeSecuritySystem (SHSS)`

**Composed of (filled-diamond composition):**
- `Control Unit (CCU)` — *processor: ARM Cortex; memory: 4 GB RAM; storage: 64 GB eMMC.*
- `Sensors` — *PIR motion, magnetic door/window contacts, moisture probes.*
- `Cameras` — *1080p / 4K, IR night vision, Cloud / SD storage.*
- `Alarm System` — *85 dB siren, push / email notification.*
- `User Interface` — *Mobile App (iOS / Android), Web Portal (HTML5), Wall Panel (touchscreen).*
- `Power Supply` — *AC 110 / 220 V primary; Li-ion 24-h backup.*
- `Cloud Services` — *OAuth 2.0 auth; SQL / NoSQL persistence.*

**Tool used by the project:** **PlantUML** (`Deliverables/SysML_Blocks.puml`) — text-as-diagram, git-friendly, exportable to draw.io.
**Lecture-recommended:** draw.io / Visual Paradigm. *Alternatives:* Cameo Systems Modeler, Capella, Sparx Enterprise Architect.

#### 3.4 Internal Block Diagram (IBD) — Control Unit (CCU)
- Internal parts: `Zigbee/Z-Wave Radio`, `Wi-Fi Module`, `Logic Engine`, `Local Storage`, `Backup Battery Manager`.
- Flow ports: power in ← Power Supply; sensor events in ← Sensors; siren control out → Alarm System.
- Standard ports: REST/WebSocket ↔ Cloud Services; HTTP/WS ↔ User Interface.

#### 3.5 State Machine — System Modes
`Disarmed ↔ Armed-Stay ↔ Armed-Away ↔ Alarm Triggered → Notify → Acknowledge → Disarmed`
Plus orthogonal `Maintenance` and `Panic` substates.

#### 3.6 Activity Diagram — Intrusion Response
`Sensor trigger → CCU evaluates state → If Armed: log + activate siren + push notification → User acknowledges → Optional emergency-services hand-off.`

---

### Step 4 — Architectural Framework Application (Module 3)

The project's primary structuring driver is **IEEE 29148**, but the architecture itself maps cleanly onto a **TOGAF-lite ADM** view:

| Phase | Decision for SHSS |
|---|---|
| **Preliminary** | Principles: privacy-by-design, modularity, OTA-update support, local-first reliability. |
| **A — Vision** | Goals: residential intrusion + environmental monitoring; stakeholders: homeowner, resident, regulator. |
| **B — Business** | Processes: arming / disarming, monitoring, alert escalation, billing for cloud tier. |
| **C — Information Systems** | Data: device DB, user DB, video storage. Apps: mobile (iOS/Android), web portal, cloud logic engine. |
| **D — Technology** | Stack: Zigbee 3.0 / Z-Wave Plus for sensors; Wi-Fi 802.11 ax/ac for cameras; MQTT for status; RTSP/WebRTC for video; TLS 1.3 + AES-128; OAuth 2.0. |
| **E — Opportunities** | MVP = CCU + 3 sensors + 1 camera + mobile app; later add wall panel, smart locks. |
| **F — Migration** | Blue-green deployment on cloud; staged firmware OTA per device cohort. |
| **G — Governance** | Compliance with GDPR / CCPA, UL 1023, ISO 27001 for cloud side. |
| **H — Change Mgmt** | Quarterly review of crypto suites, OTA rollback policy, vulnerability response SLA. |

**Architecture Diagram view** (`Deliverables/Architecture_Diagram.puml`) groups components into the **rubric's four mandated categories** plus an external Cloud tier:

```
Smart Home Environment (Internal)
├── Central Control Unit (CCU)
├── Sensors            : Motion (Zigbee), Door/Window (Z-Wave), Water Leak (Zigbee)
├── Controllers        : Smart Light Controller (Zigbee), Smart Lock Controller (Z-Wave)
├── User Interface     : Wall-mounted Panel (Wi-Fi local)
└── Local Storage      : optional backup (SATA/USB)

Cloud Services (External)        — Encrypted TLS link from CCU
└── Smart Home Management Server : User & Device DB, Video Storage, Logic Engine

Remote Interaction (External)    — HTTPS/TLS to Cloud
├── Mobile App
└── Web Browser Interface
```

**Complementary frameworks:**
- **C4 Model** for software-only views of the cloud server (Context → Container → Component → Code).
- **AWS / Azure Well-Architected** for the cloud tier's reliability, security, and cost pillars.
- **Zachman 6×6** for stakeholder-perspective mapping if doing enterprise-style governance.

---

### Step 5 — Trade-off Analysis (Module 3)

The project delivers **four separate decision matrices** in `Deliverables/Decision_Matrix_Evaluation.xlsx`, evaluated on **Cost, Performance, Reliability, Risk** (the rubric's criteria). Generated programmatically via `generate_matrix.py` / `generate_matrix_v2.py` from the `Decision Matrix Template.xlsx`.

#### 5.1 Server Hosting — Local vs. Cloud (the most strategic choice)

| Criterion (Weight) | Local Server | Cloud Server | Hybrid |
|---|---|---|---|
| Cost (25 %) — upfront vs. recurring | 6 (high CapEx, low OpEx) | 8 (no CapEx, subscription) | 6 |
| Performance (25 %) — latency, throughput | 9 (LAN ms latency) | 6 (WAN dependent) | 8 |
| Reliability (25 %) — uptime, internet independence | 9 (works offline) | 6 (needs internet) | 9 |
| Risk (25 %) — security & data exposure | 8 (data on-prem) | 6 (cloud breach surface) | 7 |
| **Weighted Total** | **8.00** | **6.50** | **7.50** |

**Decision:** **Hybrid** — local CCU keeps alarms running offline (satisfies REQ-O-05's 99.9 % local uptime), with cloud bridging for remote access and video archiving. Sensitivity check: if Cost is up-weighted to 40 %, pure Cloud nearly ties Hybrid.

#### 5.2 Sensor Selection (excerpt — Motion Sensor)

| Criterion (Weight) | PIR | Microwave | Dual-Tech (PIR+MW) |
|---|---|---|---|
| Cost (30 %) | 9 | 6 | 4 |
| Performance / detection accuracy (25 %) | 7 | 8 | 10 |
| Reliability / false-alarm rate (25 %) | 6 | 7 | 10 |
| Risk (20 %) — privacy, regulatory | 9 | 7 | 8 |
| **Weighted Total** | **7.65** | **6.95** | **8.10** |

**Decision:** Dual-Tech for primary zones (lower false-alarm, satisfies REQ-F-02 pet-friendly); PIR for low-priority zones to control budget.

#### 5.3 Cameras (4 options compared)
1080p IR fixed | 4K fixed | PTZ (pan-tilt-zoom) | Battery-powered Wireless. Scored on Cost / Performance / Reliability / Risk. **Mix decision:** 4K fixed indoors, PTZ outdoors, battery wireless for renter-friendly zones.

#### 5.4 Controllers (Smart-home hubs)
Home Assistant (open source) vs. Hubitat vs. SmartThings — evaluated on protocol coverage, cloud dependency, automation engine, ecosystem. **Decision:** Hubitat for local-first reliability + community matter support.

#### 5.5 Software Effort Estimation — COCOMO Basic (complementary)
Estimated CCU + cloud + mobile codebase: **30 KLOC** (Organic — small team, well-understood domain).

```
E   = 2.4 × (30)^1.05 ≈ 2.4 × 35.4 ≈ 85   person-months
T   = 2.5 × (85)^0.38 ≈ 2.5 × 5.32 ≈ 13.3 months
N   = E / T ≈ 6.4 ≈ 7 engineers
```

#### 5.6 Performance Trade-offs
- **CCU latency** (sensor → siren) modeled in Python NumPy; verified ≤ 1 s margin.
- **Cloud notification path** load-tested with **JMeter** *(alt: k6, Gatling, Locust)* to validate REQ-P-02 (< 5 s end-to-end push).

**Tool used by the project:** **Excel template + Python (openpyxl)** for repeatable matrix generation.
**Lecture-recommended:** Excel + manual scoring. *Alternatives:* AHP, TOPSIS, Airtable.

---

### Step 6 — Documenting System Architecture (Module 3)

#### 6.1 Architecture Diagram & SysML BDD
Kept in PlantUML (`.puml`) under `Deliverables/`. Both diagrams render to PNG/SVG and import into draw.io if a richer UI is needed.

#### 6.2 Interface Control Document (ICD)
A focused ICD captures the seams where most integration failures happen:

| Sender → Receiver | Data | Protocol | Format | Update Rate |
|---|---|---|---|---|
| Sensors → CCU | Motion / contact / moisture events | Zigbee 3.0 / Z-Wave Plus | Encrypted payload (AES-128) | Event-driven; heartbeat 60 s |
| CCU → Cameras | Stream request / record trigger | Wi-Fi 802.11 ax/ac | RTSP / WebRTC | Live stream |
| CCU → Alarm System | Activate / deactivate siren | Digital I/O (relay) | Binary | < 1 s response |
| CCU ↔ Cloud Services | Status, logs, video metadata | MQTT over TLS 1.3 | JSON | Status every 30 s; events real-time |
| Mobile App / Web ↔ Cloud | Commands, live feed, configuration | HTTPS / WebSocket / TLS 1.3 | JSON | Real-time |
| User Interface ↔ CCU (local) | Arm/disarm, configuration | Wi-Fi (LAN) HTTP/WS | JSON | On demand |

**Power**:
- Mains AC 110/220 V → CCU (with internal Li-ion 24-h backup, REQ-P-05).
- Battery sensors → CR123A, ≥ 2-year life @ 10 triggers/day (REQ-P-04).

**Tool:** Markdown / Word / LaTeX template. *Alternatives:* Polarion ICD module, Confluence, DOORS modules.

#### 6.3 Stakeholder-tailored deliverables
- **Homeowners / non-technical:** mobile-app screen tour + 1-page benefit summary.
- **Engineers:** SysRS + BDD/IBD + ICD + PlantUML source.
- **Regulators / insurance:** verification matrix (REQ → method T/I/A/D), security controls register.

---

### Step 7 — Integration Strategy (Module 4)

**Chosen strategy:** **Incremental** + **CI/CD**, with selective top-down stubs early on.

- **Increment 1 — Cloud + Mobile (top-down with CCU stub):** mobile app authenticates against cloud, displays mocked sensor states.
- **Increment 2 — CCU bottom-up:** integrate one PIR motion sensor + one door contact via Zigbee; verify event logging.
- **Increment 3 — Cameras + alarm:** add Wi-Fi camera streaming and the 85 dB siren relay.
- **Increment 4 — Wall Panel + Smart Locks:** local UI and access control.
- **Increment 5 — Pilot install** in a real home for two weeks.

**Dependency management:**
- **Data:** mobile app needs cloud → ICD-defined JSON over MQTT/WebSocket.
- **Control:** alarm cannot fire without CCU "Armed" state.
- **Temporal:** CCU boot → Zigbee mesh formation → sensor pairing.
- **Resource:** local Wi-Fi shared by cameras + wall panel — bandwidth budget reviewed in IBD.

**Tools:** **GitHub Actions** for CI of cloud + mobile; firmware OTA pipeline for the CCU; Docker for cloud services.
**Alternatives:** GitLab CI, Jenkins, CircleCI, Azure DevOps.

---

### Step 8 — Verification (Module 4) — *"Did we build the system right?"*

| Method | Activity | Tool |
|---|---|---|
| **Inspection** | Code review of CCU firmware; visual inspection of camera IP65 rating. | GitHub PR review. |
| **Reviews** | PDR + CDR with safety / regulatory officer. | Confluence / Markdown checklist. |
| **Unit testing** | Logic-engine functions (e.g., `evaluateArmedState`). | **PyTest** *(alt: Jest, JUnit, Google Test)* |
| **Integration testing** | Sensor → CCU → Alarm pipeline; CCU ↔ Cloud MQTT exchange. | **Postman** *(alt: Newman, Karate, REST Assured)* |
| **System testing** | End-to-end intrusion → notification timing (REQ-P-02). | Playwright/Cypress for app; k6 for cloud load. |
| **Static analysis & security** | Lint, SAST, dependency scan. | **SonarQube + OWASP ZAP** *(alt: Semgrep, CodeQL, Snyk)* |
| **Hardware verification** | Siren dB measurement, camera IP rating, encryption protocol inspection. | Calibrated dB meter; lab inspection. |

**Verification matrix excerpt (from `SysRS_SmartHome.md` §9):**

| Req ID | Method | Description |
|---|---|---|
| REQ-F-01 | T | Measure latency of motion trigger → CCU log. |
| REQ-U-01 | T | Time arm/disarm interaction. |
| REQ-P-05 | T / A | Simulate AC outage; measure backup duration. |
| REQ-SEC-01 | I | Inspect AES-128 in protocol spec and code. |

---

### Step 9 — Validation (Module 4) — *"Did we build the right system?"*

| Validation Activity | Description | Tool |
|---|---|---|
| **UAT (User Acceptance)** | 5 households use the system for 2 weeks; arm / disarm, receive real alerts. | In-app survey + Jira issues. |
| **Pilot Test** | Install in one neighborhood block, then expand. | Real-world deployment + telemetry. |
| **Simulation** | Multi-sensor / multi-user scenarios run before real install. | **Custom Python simulator** *(alt: AnyLogic, Simulink)* |
| **Operational Acceptance (OAT)** | Monitoring, security, maintainability checks in production setup. | Pen-test + ops runbook. |
| **Regulatory** | Verify UL 1023 alarm intent and GDPR data flows. | Compliance audit. |

---

### Step 10 — Test Cases & Test Plan (Module 4)

**Test Plan ID:** TP-SHSS-01
- **Objective:** Validate intrusion detection, environmental monitoring, alerting, and remote access.
- **Scope:** CCU firmware + cloud + mobile + web portal + sensors + cameras (excludes 3rd-party emergency dispatch).
- **Approach:** ~60 % automated (cloud + mobile), ~40 % manual (hardware + UAT).
- **Environment:** Lab with 1 CCU, 6 sensors, 2 cameras, mobile devices on iOS 17 + Android 14, Wi-Fi 6 router, simulated WAN with throttling.
- **Risks:** Zigbee mesh interference; LTE/Wi-Fi outage during pilot; false alarms from pets.
- **Pass criteria:** ≥ 95 % test cases pass; zero severity-1 defects; meets all SMART NFRs.

**Sample Test Case (project format — `Deliverables/Verification_Validation_Tests.xlsx`):**

| Field | Value |
|---|---|
| **Test Case Name** | TC-VAL-04: Simultaneous Multi-Sensor Trigger |
| **Objective** | Validate the system correctly logs and alerts on 3+ simultaneous sensor triggers. |
| **Priority** | High |
| **Type** | Non-Functional (Performance / Reliability) |
| **Precondition** | System in Armed-Away mode; 3 sensors paired and online (1 motion, 1 door, 1 water). |
| **Steps** | 1. Trigger motion sensor in Zone A. *Expected:* event logged within 200 ms. <br> 2. Within 2 s, open door sensor. *Expected:* event logged, no event lost. <br> 3. Within 2 s, activate water-leak sensor. *Expected:* event logged. <br> 4. Observe mobile app + alarm. *Expected:* siren active, three notifications received within 5 s of each event. |
| **Final Expected Outcome** | All three events appear in the chronological log, siren is active, user receives 3 distinct push notifications within 5 s each (REQ-P-02). |

**Tool used by the project:** Excel export matching `test-cases-export_sample.xlsx` schema, generated by `generate_tests.py`.
**Lecture-recommended:** **Testomat.io** (free, no install). *Alternatives:* TestRail, Xray for Jira, Zephyr, qTest, TestLink.

**Coverage for the rubric's required test areas:**
- ✅ Verification: Motion / Door / Water sensor → CCU; Camera feed; Login (success & failure).
- ✅ Validation: End-to-end alerting; Door/Window arming response; Remote camera access; Arm/disarm modes; Simultaneous (≥ 3) triggers; ≥ 3 device concurrent access.

---

### Step 11 — Change Management (Module 4)

**Scenario:** Mid-project, the chosen Zigbee chipset (Silicon Labs EFR32MG13) is end-of-life'd; vendor recommends EFR32MG24.

**Impact analysis:**
1. **Scope:** CCU radio firmware, sensor pairing logic, ICD entry "Sensors → CCU."
2. **Risk:** Zigbee 3.0 protocol stack revision needed; compatibility with already-paired devices in pilots.
3. **Cost / Schedule:** ~+$3 per CCU unit; ~+4 weeks for re-validation and FCC re-test.
4. **Compliance:** Must keep AES-128 (REQ-SEC-01) and IP65 housing rating; FCC / CE re-cert required.
5. **Stakeholder input:** Engineering, Procurement, Compliance, Operations.

**CCB decision:** Approve EFR32MG24 migration; require regression on TC-VER-01 through TC-VER-08 plus a new **TC-VER-09** for backward-compatibility with previously paired sensors.

**Documentation updates:**
- ICD v1.1 (Zigbee stack rev change).
- BDD note on `Control Unit` chipset version.
- SysRS §6.1 protocol footnote.
- Test plan: add TC-VER-09; re-baseline traceability matrix.

**Tools:** **Jira** (CR ticket), **GitHub** (firmware), **Confluence** (impact report), Markdown SysRS for traceability.
**Alternatives:** Polarion ALM, Helix ALM, ServiceNow.

---

### Step 12 — Continuous Validation & Operations (Module 4)

- **CI/CD:** every commit triggers PyTest, integration tests, container build, deploy to staging cloud.
- **Shift-Left:** **STRIDE threat modeling** during design, especially for the cloud auth flow and OTA update path.
- **Observability:** Prometheus + Grafana for the cloud server; structured logs from the CCU shipped via OpenTelemetry; alarms on sensor heartbeat misses (supports REQ-O-06).
- **OTA governance:** staged rollout per device cohort with **automatic rollback** on failed update (REQ-O-04).
- **Field validation:** anomaly detection on false-alarm rates; A/B test pet-friendly threshold tuning.
- **Disposal plan:** battery recycling vendor; user-data export + secure wipe procedure on account close (GDPR right-to-erasure).

---

### End-to-End Process & Tool Summary (Smart Home Security System)

| Step | Module | Activity | Project Tool | Lecture-Recommended | Modern Alternatives |
|---|---|---|---|---|---|
| 1 | M1 | Concept + stakeholder map | Markdown plans | Notion / Miro | Confluence + draw.io |
| 2 | M2 | SysRS (IEEE 29148:2018 §9.4) | **Markdown** (`SysRS_SmartHome.md`) | **ReqView** | Jama, DOORS, Polarion |
| 3 | M2 | SysML BDD / IBD / SM / Use Case | **PlantUML** (`SysML_Blocks.puml`) | draw.io / Visual Paradigm | Cameo, Capella, Mermaid |
| 4 | M3 | Architecture framework | TOGAF-lite mapping + IEEE 29148 | TOGAF / Zachman / NIST | C4 Model, arc42, AWS WAF |
| 5 | M3 | Architecture diagram | **PlantUML** (`Architecture_Diagram.puml`) | draw.io | Mermaid, Structurizr |
| 6 | M3 | Decision matrices (4 areas) | **Excel + Python `openpyxl`** | Excel manual | AHP, TOPSIS, Airtable |
| 7 | M3 | Effort sizing (optional) | Python COCOMO calc | COCOMO Basic | COCOMO II, Function Points |
| 8 | M3 | ICD | Markdown ICD | Word / LaTeX template | Polarion, Confluence |
| 9 | M3 | Performance modeling | JMeter / Python | JMeter | k6, Gatling, Locust |
| 10 | M4 | Integration (Incremental + CI) | **GitHub Actions + Docker** | GitHub Actions | GitLab CI, Jenkins |
| 11 | M4 | Verification (unit/int/sys) | **PyTest, Postman, SonarQube** | PyTest, Postman, SonarQube | Playwright, Semgrep, Snyk |
| 12 | M4 | Validation (UAT / pilot / sim) | Real-home pilot + Python sim | Surveys, simulation | AnyLogic, Isaac Sim |
| 13 | M4 | Test cases + plans | **Excel export** (`Verification_Validation_Tests.xlsx`) generated via `generate_tests.py` | **Testomat.io** | TestRail, Xray, Zephyr, TestLink |
| 14 | M4 | Change mgmt | Jira + GitHub + Markdown SysRS | Jira + ReqView + GitHub | Polarion, Helix ALM |
| 15 | M4 | Continuous validation | Prometheus + Grafana + OTel | Prometheus + Grafana | Datadog, New Relic |

---

### How the Project's Choices Compare to Lecture Recommendations

| Area | Lecture Recommends | Project Chose | Why It Still Works |
|---|---|---|---|
| Requirements tool | ReqView / DOORS | Markdown to IEEE 29148 §9.4 | Pragmatic, version-controllable, PDF-exportable; preserves all required sections. |
| SysML diagrams | draw.io / Visual Paradigm | PlantUML (`.puml`) | Text-based diagrams diff cleanly in git, render to draw.io / SVG. More modern. |
| Decision matrix | Excel manual | Excel template + Python `openpyxl` | Repeatable and regenerable from data — better engineering hygiene. |
| Test management | Testomat.io | Excel export schema + `generate_tests.py` | Matches the rubric's exact submission format and is automation-friendly. |
| Architecture framework | TOGAF / Zachman | IEEE 29148 + rubric structure | Standards-driven equivalent; TOGAF/Zachman applied informally for domain mapping. |

---

## Final Takeaways

1. **SE is complexity management** — process, tools, and traceability turn chaos into engineered systems.
2. **Lifecycle thinking** drives every decision from concept through disposal.
3. **Requirements are the bedrock** — SMART + traceability + standardized templates (ISO 29148) prevent costly rework.
4. **MBSE with SysML** is the modern "single source of truth" — visual, traceable, simulatable.
5. **Architecture frameworks (TOGAF/Zachman/NIST + C4/AWS WAF)** align engineering with business goals.
6. **Trade-offs are inevitable** — quantify with decision matrices, COCOMO, performance models.
7. **V&V are not the same** — verification proves we built it right; validation proves we built the right thing.
8. **Integration fails at the seams** — manage interfaces with ICDs and incremental + CI strategies.
9. **Change management with CCBs** keeps systems coherent over their lifetime.
10. **Modern tools (CI/CD, observability, simulation) make continuous V&V possible** at scale.

> Build the right system, build it right, and keep it that way — that is the discipline of Systems Engineering.
