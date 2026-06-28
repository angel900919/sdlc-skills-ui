# Architecture Frameworks: TOGAF, Zachman, NIST — Examples

Every example here *applies* a framework to a concrete system. Blanked steps are solved in the Solutions section at the bottom.

## Simple example — fully worked: applying the TOGAF ADM to an online banking system

A modern online banking system must handle millions of transactions securely and efficiently, with strong **performance, reliability, and usability** (source: m3-applytogaf). We carry these quality attributes through every ADM phase. Each step states the phase's job, then the banking-specific output.

1. **Preliminary — establish architecture principles.** *Job:* set capability and principles. *Output:* Performance — transactions process in < 2 seconds; Reliability — 99.99% uptime with failover; Security — comply with ISO 27001 and PCI DSS for payments; Usability — simple UI, accessible to all users (source: m3-applytogaf).
2. **A – Architecture Vision — goals & stakeholders.** *Job:* define scope, stakeholders, high-level vision. *Output:* Goals = fast/secure/intuitive digital banking, millions of concurrent users with global access, high availability via auto-scaling and failover. Stakeholders = Bank Executives (growth, compliance), IT Architects (integration, performance), Developers (API design, microservices), Security Officers (cybersecurity, fraud prevention), Customers (ease of use, speed) (source: m3-applytogaf).
3. **B – Business Architecture — processes & functions.** *Job:* develop business process/organizational architecture. *Output:* Customer Onboarding (eKYC), Fund Transfers (real-time), Payments & Billing, Loan & Credit Services, Fraud Detection & Security. A BPMN/SysML process model shows customer interaction, transaction flow, and decision points (e.g., fraud check before payment approval) (source: m3-applytogaf).
4. **C – Information Systems Architecture — data & applications.** *Job:* define Data + Application architectures. *Output (Data):* PostgreSQL for structured banking data, MongoDB for semi-structured data, Redis for real-time balance caching, Kafka for event-driven transaction processing. *Output (Application):* microservices (Authentication, Payments, Loans, Notifications), API Gateway (GraphQL/REST), mobile/web apps in React and Flutter (source: m3-applytogaf).
5. **D – Technology Architecture — infrastructure & security.** *Job:* define IT infrastructure and platforms. *Output:* Frontend React/Flutter; Backend Spring Boot/Node.js; DB PostgreSQL/MongoDB/Redis; Messaging Kafka/RabbitMQ; Cloud AWS (EC2, Lambda, Kubernetes); Security OAuth2, Zero Trust, firewalls. Measures: end-to-end encryption (AES-256, TLS 1.3), MFA, AI-based real-time fraud detection (source: m3-applytogaf).
6. **E – Opportunities & Solutions — implementation roadmap.** *Job:* identify projects and transitions. *Output:* define the MVP (login, transfers, account details + MFA/fraud detection + caching/auto-scaling), then a release plan: Phase 1 core banking → Phase 2 AI fraud detection → Phase 3 international payments → Phase 4 user personalization (source: m3-applytogaf).
7. **F – Migration Planning — deployment strategy.** *Job:* plan the implementation roadmap. *Output:* Blue-Green deployment (Blue = stable/current, Green = new features deployed without downtime, rollback to Blue on issues) plus parallel deployment starting in one region before global rollout (source: m3-applytogaf).
8. **G – Implementation Governance — ensuring compliance.** *Job:* oversee realization of architecture. *Output:* enforce PCI DSS (payment security), ISO 27001 (data protection), GDPR (EU privacy); automated CI/CD pipelines (GitHub Actions, Jenkins) for continuous testing/deployment; automated security scans (source: m3-applytogaf).
9. **H – Architecture Change Management — scaling & evolution.** *Job:* enable continuous evolution. *Output:* monitor with real-time analytics (Prometheus, Grafana), optimize via A/B testing, upgrade fraud-detection models; evolve by integrating blockchain for secure transactions and expanding to cross-border banking/digital assets (source: m3-applytogaf).

Running throughout all nine: **Requirements Management** keeps performance/reliability/security/usability traceable from Preliminary to H (source: m3-togaf).

## Intermediate example — completion: the Smart Campus System (last two phases blanked)

A university wants a **Smart Campus System** integrating smart classroom scheduling, IoT-based energy management, a student mobile app, and campus-wide Wi-Fi/cloud services. Apply the ADM (source: m3-ex-togaf). The first seven phases are filled; **complete F and G yourself**, then check the Solutions.

1. **Preliminary** — Define principles (modularity, interoperability, sustainability), governance, tools; set up architecture team; identify stakeholders: IT, facilities, academic departments, campus leadership (source: m3-ex-togaf).
2. **A – Architecture Vision** — Define scope: student experience, energy savings, integrated services; create the vision and get stakeholder buy-in (source: m3-ex-togaf).
3. **B – Business Architecture** — Map university processes (class scheduling, facilities, student support); identify how smart solutions improve them (source: m3-ex-togaf).
4. **C – Information Systems Architecture** — Identify data flows (classroom occupancy, student profiles) and required apps (IoT dashboard, mobile app) (source: m3-ex-togaf).
5. **D – Technology Architecture** — Define tech: Wi-Fi expansion, IoT sensors, cloud infrastructure, mobile backend (source: m3-ex-togaf).
6. **E – Opportunities & Solutions** — Evaluate vendors, existing assets (e.g., LMS), and integration points; recommend solution packages (source: m3-ex-togaf).
7. **F – Migration Planning** — _______ **(complete this)**
8. **G – Implementation Governance** — _______ **(complete this)**
9. **H – Architecture Change Management** — Define how to handle future changes (new services, new buildings); keep the architecture up to date (source: m3-ex-togaf).

## Advanced example — independent: fill a Zachman "What" column for an airline reservation system

Strategy hint only: the **"What" (Data)** column runs from the most abstract perspective (Planner) to the live operational system (Functioning System). For an **airline reservation system**, write the cell content for each of the six perspectives. Then check the Solutions table (source: m3-zachman).

| Perspective | Airline Reservation System — "What" (Data) |
|---|---|
| Planner (Scope) | _______ |
| Owner (Business) | _______ |
| Designer (System) | _______ |
| Builder (Tech) | _______ |
| Subcontractor (Tool) | _______ |
| Functioning System | _______ |

## Real-world case study — Zachman matrix for a digital banking system

**Situation:** A bank is implementing a new digital banking system and wants assurance that *every* aspect is considered from *every* stakeholder's viewpoint (source: master-notes §Architectural Frameworks).

**Approach:** Use the Zachman Framework. Perspectives (rows) = Planner (scope), Owner (business), Designer (system logic), Builder (technology), Implementer (components), User (operations). Interrogatives (columns) = What/How/Where/Who/When/Why. Each cell is filled. Selected cells (source: master-notes §Architectural Frameworks):

- **Planner · What** — kinds of data the bank must manage: accounts, transactions, customer profiles.
- **Planner · How** — essential capabilities: transfers, account management, fraud detection.
- **Planner · Why** — strategic goals: customer trust, regulatory compliance, digital transformation.
- **Owner · How** — business processes: customer onboarding, loan application, money transactions.
- **Designer · What** — logical models relating user, transactions, balances.
- **Designer · Where** — logical system architecture: APIs, cloud services, communication protocols.
- **Builder · What** — physical data structures: database tables, JSON formats.
- **Implementer · What** — load initial datasets, configure databases, manage migrations.
- **User · How** — daily actions: logging in, transferring money, contacting support.
- **User · When** — operate in real time, expecting immediate low-latency responses.

**Outcome:** the completed matrix serves as a blueprint aligning business goals, system design, technology, and user experience for a complex banking environment (source: master-notes §Architectural Frameworks).

**Lesson:** Zachman's value is *coverage and traceability* — by forcing every interrogative to be answered from every perspective, no stakeholder concern is silently dropped (source: m3-zachman).

## Guided walkthrough — choosing and applying the right framework

A team must "do enterprise architecture" for the online banking system and isn't sure where to start. Narrated start to finish:

1. **Decide what they actually need.** They need a *repeatable build-and-govern process*, not just a documentation grid. That points to **TOGAF**, the process/method, over Zachman (taxonomy) or NIST (layered model) (source: master-notes §Architectural Frameworks).
2. **Anchor principles (Preliminary).** Performance < 2 s, 99.99% uptime, ISO 27001/PCI DSS, usability (source: m3-applytogaf).
3. **Set the vision (A) and get buy-in** from executives, architects, developers, security officers, customers — *why* the system exists, not yet *how it works* (source: m3-applytogaf; m3-ex-togaf for the A-vs-B distinction).
4. **Work down the domains (B→C→D):** business processes → data + applications → infrastructure/security (source: m3-applytogaf).
5. **Plan delivery (E→F):** MVP and release plan, then Blue-Green/parallel deployment (source: m3-applytogaf).
6. **Govern and evolve (G→H):** compliance + CI/CD, then monitoring, A/B testing, and architecture evolution (blockchain, cross-border) (source: m3-applytogaf).
7. **Cross-check coverage with Zachman (optional).** Run the artifacts produced through a Zachman matrix to confirm every interrogative is answered from every perspective (source: master-notes §Architectural Frameworks). This is how a process framework and a taxonomy framework *combine*.

---

## Solutions

### Intermediate — Smart Campus, phases F and G (model answer)

- **F – Migration Planning:** Plan a phased rollout — start with energy management in 5 buildings, then expand to the full campus. (Equivalently: develop a timeline/roadmap, prioritizing by impact and feasibility, assigning responsibilities and resources to each stage.) (source: m3-ex-togaf)
- **G – Implementation Governance:** Ensure contractors follow the architecture; monitor system integration and validate against requirements via checkpoints, compliance reviews, and stakeholder feedback (source: m3-ex-togaf).

### Advanced — airline reservation "What" column (model answer)

| Perspective | Airline Reservation System — "What" (Data) |
|---|---|
| Planner (Scope) | Flights, Customers, Tickets |
| Owner (Business) | Definitions of a "customer", "flight", and "ticket" |
| Designer (System) | Logical data entities: Customer, Booking, Itinerary |
| Builder (Tech) | Physical data: tables and relationships in a SQL DB |
| Subcontractor (Tool) | SQL table scripts for deployment |
| Functioning System | Actual booking records in production |

(source: m3-zachman)
