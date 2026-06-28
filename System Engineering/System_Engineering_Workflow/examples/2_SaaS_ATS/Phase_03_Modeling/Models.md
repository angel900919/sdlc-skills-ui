---
Document: TalentFlow — MBSE Models (BDD · Requirements · State Machine · Sequence) + Coverage
Document ID: MODELS-TALENTFLOW-v1.0
Standard: ISO/IEC/IEEE 15288:2023 (System Analysis); OMG SysML 1.x via PlantUML
Status: Draft
Owner: Lead Systems Engineer
---

# TalentFlow — Phase 03 Modeling (MBSE)

The SysML single source of truth for TalentFlow, built from the baselined-pending [`../Phase_02_Requirements/SysRS.md`](../Phase_02_Requirements/SysRS.md) and the Phase 01 [`../Phase_01_Concept/Concept.md`](../Phase_01_Concept/Concept.md). This deliverable contains the four diagrams required for this phase as **embedded PlantUML** — a Block Definition Diagram (BDD), a Requirements Diagram exercising `satisfy`/`verify`/`derive`/`refine`/`copy`, a State Machine of the system modes, and a Sequence for the key privacy scenario (SCN-03 right-to-erasure) — plus the MBSE coverage layer.

Conforms to [`../../../05_Conventions.md`](../../../05_Conventions.md) for every ID grammar, the gate ladder, T/I/A/D methods (§4), S1–S4 severity, the SysML notation contract (§7, 7-relationship vocabulary), and standard citations (§9). **No conflicting IDs are invented**: every `REQ-*`, `SN-*`, `MOP-*`, `TPM-*`, and block name reuses the SysRS verbatim; new design-side IDs (`TC-VER-*`, `ICD-*`, `DEC-*`, `SLO-*`) use the convention grammar and trace back to a requirement.

> **7 of 9 note (Conventions §7).** The full Phase-03 working set is 7 of the 9 SysML diagram types. This single-file deliverable carries the **4 highest-value diagrams** for the model-coverage gate (BDD · Requirements · State Machine · Sequence). The remaining three of the seven — Use Case, IBD (`IBD_TenantIsolationLayer.puml`), and Activity (`Activity_SCN-01.puml`) — are `TODO: author as sibling .puml files` and are tracked in §6. Package and Parametric remain the two-of-nine omitted by default (no parametric/physical constraint thread; model is < 3 navigable layers).

---

## 1. Modeling inputs (reused, not re-elicited)

| Input | Source | Used to seed |
|---|---|---|
| 35 `REQ-*` (F:8 · U:3 · P:4 · O:4 · SEC:8 · INT:4 · C:2 · D:2) | SysRS §3–§8 | BDD blocks, Requirements diagram, coverage matrices |
| 11 top-level system blocks | SysRS §12.1 | BDD, satisfy matrix |
| 5 system modes (Nominal · Degraded · Read-Only/Safe · Maintenance · Offboarding/EOL) | SysRS §9 | State Machine |
| `SN-01…SN-12` stakeholder needs | Concept §6 | `derive` (REQ→REQ traces up to SN, shown as notes) |
| `SCN-03` right-to-erasure flow | Concept §7 | Sequence diagram |
| `MOP-*` / `TPM-*` latency & completeness budgets | SysRS §10 | Sequence latency annotations, verify matrix |
| Strategic decisions `DEC-01…DEC-05` (names only) | SysRS §12.2 | Block notes (allocation rationale owed to Phase 05) |

**REQ count by class confirmed against SysRS §13 SMART pass:** F 8, U 3, P 4, O 4, SEC 8, INT 4, C 2, D 2 = **35**. No `REQ-SAF-*` (safety class tailored out — SysRS §8 note).

---

## 2. Block Definition Diagram — `BDD.puml`

Top-down decomposition of the `TalentFlow Platform` block into the 11 sub-blocks named in SysRS §12.1, plus the four data-tier stores (SysRS §2 item 5) the Tenant Isolation Layer and Privacy & Erasure Service act on. Connector meaning per Conventions §7 and the SKILL decision table: `*--` composition (the part cannot exist without, and is lifecycle-owned by, the platform); `o--` aggregation (a shared external-facing dependency the platform uses but does not own). The four datastores are composed by the Data Tier; the Tenant Isolation Layer mediates every access to them (shown as a dependency, not ownership).

```plantuml
@startuml TalentFlow_BDD
title TalentFlow — Block Definition Diagram (system blocks, SysRS §12.1)
skinparam classAttributeIconSize 0
skinparam linetype ortho
hide circle

class "TalentFlow Platform" as PLAT <<block>> {
  +tenantCount : int
  +region : enum{primary, secondary}
  +mode : enum{Nominal,Degraded,ReadOnlySafe,Maintenance,OffboardingEOL}
  +monthlyAvailability : percent
  ..operations..
  +routeRequest(req) : Response
  +setMode(mode) : void
}

class "Edge / API Gateway" as GW <<block>> {
  +protocol : enum{REST, WebSocket}
  +tlsVersion : string  = "1.2+"
  +tenantContext : TenantClaim
  +enforceRateLimit(tenant) : void
}

class "Identity & SSO Gateway" as IDP <<block>> {
  +samlValidation : bool
  +scimEndpoint : URI
  +mfaPolicy : enum{idpAsserted, enforced}
  +authenticate(assertion) : Session
  +provision(scimEvent) : void
}

class "Tenant Isolation Layer" as TIL <<block>> {
  +scope : TenantId
  +crossTenantDenials : count
  +authorize(actor, tenant, resource) : Decision
}

class "Candidate Pipeline Service" as CPS <<block>> {
  +stages : List<Stage>
  +transition(candidate, toStage) : Event
  +submitScorecard(candidate, scorecard) : void
}

class "Search & Indexing Service" as SRCH <<block>> {
  +index : TenantPartitionedIndex
  +p95ReadLatency : ms
  +search(tenant, filters) : Results
}

class "Scheduling & Email Integration Service" as SCHED <<block>> {
  +queue : RetryQueue
  +sendTemplatedEmail(candidate, template) : SendStatus
  +scheduleInterview(candidate, slot) : Event
}

class "Job-board & HRIS Integration Service" as JBH <<block>> {
  +queue : RetryQueue
  +publishOpening(opening) : PostingRef
  +handoffHire(candidate, fieldSet) : Receipt
}

class "Privacy & Erasure Service" as PES <<block>> {
  +retentionPolicy : Policy
  +erasureSlaDays : int = 30
  +captureConsent(candidate, basis) : void
  +exportSubject(candidate) : Archive
  +eraseSubject(candidate) : ErasureProof
}

class "Audit Service" as AUD <<block>> {
  +log : TamperEvidentLog
  +record(actor, tenant, action, target, ts) : void
  +produceEvidence(query) : EvidencePack
}

class "Billing Service" as BILL <<block>> {
  +pciScope : string = "SAQ-A"
  +chargeSubscription(tenant, token) : Result
}

class "Careers Portal" as CAR <<block>> {
  +wcagLevel : string = "2.2 AA"
  +submitApplication(app) : CandidateRecord
}

class "Recruiter Web App" as RWA <<block>> {
  +wcagLevel : string = "2.2 AA"
  +advanceCandidate(candidate) : void
}

class "Data Tier" as DATA <<block>> {
  +partitioning : enum{perTenant}
  +encryptionAtRest : string = "AES-256"
}
class "Primary Store" as PS <<block>>
class "Search Index" as SI <<block>>
class "Object Storage" as OS <<block>>
class "Backups" as BK <<block>>

PLAT *-- GW
PLAT *-- IDP
PLAT *-- TIL
PLAT *-- CPS
PLAT *-- SRCH
PLAT *-- SCHED
PLAT *-- JBH
PLAT *-- PES
PLAT *-- AUD
PLAT *-- BILL
PLAT *-- CAR
PLAT *-- RWA
PLAT *-- DATA

DATA *-- PS
DATA *-- SI
DATA *-- OS
DATA *-- BK

' Shared external dependencies (aggregation — independent lifecycle, platform does not own them)
class "Tenant IdP (Okta/Entra/Google)" as EXTIDP <<external>>
class "Stripe (tokenized)" as STRIPE <<external>>
class "Calendar / Email / Job-board / HRIS Partners" as PARTNERS <<external>>
IDP o-- EXTIDP
BILL o-- STRIPE
SCHED o-- PARTNERS
JBH o-- PARTNERS

' Every data-access path is mediated by the Tenant Isolation Layer (REQ-SEC-01)
TIL ..> DATA : <<mediates every access>>\n(REQ-SEC-01)
GW ..> IDP : <<authenticated session>>
GW ..> TIL : <<tenant-scoped>>

note bottom of TIL
  Satisfies REQ-SEC-01, REQ-C-01.
  Isolation depth traded in DEC-01 (Phase 05).
  Trust boundary detailed in IBD_TenantIsolationLayer.puml (TODO).
end note

note bottom of PES
  Erasure cascade across PS, SI, OS, BK.
  Backup strategy traded in DEC-02 (Phase 05).
end note

@enduml
```

**Orphan-block check:** all 11 SysRS §12.1 blocks plus the Gateway and Data Tier appear; each satisfies ≥1 REQ (see §5.1). The Edge/API Gateway and Data Tier are structural enablers introduced in SysRS §2 — they satisfy `REQ-O-01` (availability measured *at the gateway*) and `REQ-SEC-03` (at-rest encryption in the data tier) respectively, so they are **not** gold-plated orphans.

---

## 3. Requirements Diagram — `Requirements_Diagram.puml`

Exercises the SysML 7-relationship vocabulary (Conventions §7) on **real** REQ IDs:

- **satisfy** (block → REQ): design block asserts it fulfils the REQ.
- **verify** (test case → REQ): `TC-VER-*` placeholders prove the REQ (real IDs assigned in Phase 07; here they carry the `-TBD`-resolution intent — each is a *named placeholder* `TC-VER-01..15`).
- **derive** (REQ → REQ only, derived→source): a lower system REQ analytically derived from a higher one, adding constraints.
- **refine** (model element → REQ): the State Machine / Sequence clarifies a REQ's meaning.
- **copy** (copy REQ → master): a reused regulatory/constraint REQ mirroring its master.

To stay readable (SKILL "split if unreadable" rule), the diagram is **split into two**: 3a the privacy/security/isolation thread (the Formal-overlay spine), 3b the functional/performance/availability thread. Together they cover all 35 REQs (full presence proven in §5).

### 3a — Privacy / Security / Isolation thread

```plantuml
@startuml TalentFlow_Requirements_SecPriv
title TalentFlow — Requirements Diagram (Security · Privacy · Isolation thread)
skinparam linetype ortho

' ---- Requirements (typed by class → SysML subtype, Model_Coverage map) ----
rectangle "REQ-SEC-01\nTenant-scoped authZ on every access" as SEC01 <<securityControl>>
rectangle "REQ-SEC-02\nRBAC least privilege" as SEC02 <<securityControl>>
rectangle "REQ-SEC-03\nEncrypt in transit/at rest, per-tenant keys" as SEC03 <<securityControl>>
rectangle "REQ-SEC-04\nTamper-evident PII audit log" as SEC04 <<securityControl>>
rectangle "REQ-SEC-05\nMFA on admin actions" as SEC05 <<securityControl>>
rectangle "REQ-SEC-06\nConsent + lawful basis capture" as SEC06 <<securityControl>>
rectangle "REQ-SEC-07\nSubject data export (Art.15)" as SEC07 <<securityControl>>
rectangle "REQ-SEC-08\nErasure ≤30d across all stores + proof" as SEC08 <<securityControl>>
rectangle "REQ-O-04\nRetention policy / no over-retention" as O04 <<reliability>>
rectangle "REQ-C-01\nCloud-only multi-tenant SaaS" as C01 <<designConstraint>>
rectangle "REQ-D-01\nGDPR/CCPA processor obligations (DPA)" as D01 <<domain>>
rectangle "REQ-D-02\nSOC 2 Type II / ISO 27001 ISMS" as D02 <<domain>>

' ---- Design blocks (satisfy assertions) ----
component "Tenant Isolation Layer" as TIL <<block>>
component "Privacy & Erasure Service" as PES <<block>>
component "Audit Service" as AUD <<block>>
component "Identity & SSO Gateway" as IDP <<block>>
component "Data Tier" as DATA <<block>>

' ---- Test-case placeholders (verify) ----
usecase "TC-VER-04\nCross-tenant access denied" as TV04 <<testCase>>
usecase "TC-VER-09\nErasure completeness audit" as TV09 <<testCase>>
usecase "TC-VER-10\nAudit-log completeness" as TV10 <<testCase>>
usecase "TC-VER-11\nConsent/lawful-basis (I)" as TV11 <<testCase>>
usecase "TC-VER-12\nSubject export within window" as TV12 <<testCase>>
usecase "TC-VER-13\nAt-rest/in-transit crypto (I)" as TV13 <<testCase>>
usecase "TC-VER-14\nRBAC/MFA enforcement" as TV14 <<testCase>>

' ---- satisfy (block → REQ) ----
TIL ..> SEC01 : <<satisfy>>
TIL ..> C01  : <<satisfy>>
IDP ..> SEC02 : <<satisfy>>
IDP ..> SEC05 : <<satisfy>>
DATA ..> SEC03 : <<satisfy>>
AUD ..> SEC04 : <<satisfy>>
AUD ..> D02  : <<satisfy>>
PES ..> SEC06 : <<satisfy>>
PES ..> SEC07 : <<satisfy>>
PES ..> SEC08 : <<satisfy>>
PES ..> O04  : <<satisfy>>
PES ..> D01  : <<satisfy>>

' ---- verify (TC → REQ) ----
TV04 ..> SEC01 : <<verify>>
TV13 ..> SEC03 : <<verify>>
TV10 ..> SEC04 : <<verify>>
TV14 ..> SEC02 : <<verify>>
TV14 ..> SEC05 : <<verify>>
TV11 ..> SEC06 : <<verify>>
TV12 ..> SEC07 : <<verify>>
TV09 ..> SEC08 : <<verify>>
TV09 ..> O04  : <<verify>>
TV11 ..> D01  : <<verify>>
TV10 ..> D02  : <<verify>>
TV04 ..> C01  : <<verify>>

' ---- derive (REQ → REQ, derived→source; adds constraints) ----
SEC08 ..> D01 : <<derive>>
SEC07 ..> D01 : <<derive>>
SEC06 ..> D01 : <<derive>>
O04  ..> D01 : <<derive>>
SEC03 ..> SEC01 : <<derive>>
SEC04 ..> D02 : <<derive>>

' ---- copy (reused regulatory/constraint master) ----
note top of D01 : Master regulatory REQ — copied across product lines\n(<<copy>>-able; own ID retained)

' ---- refine (model element → REQ): the erasure Sequence clarifies SEC-08 ----
usecase "Sequence_SCN-03\n(right-to-erasure)" as SEQ <<interaction>>
SEQ ..> SEC08 : <<refine>>
SEQ ..> SEC04 : <<refine>>

note bottom of SEC08
  Top privacy/legal risk RSK-02 → TPM-04 (MOP-13).
  Cascade across PS/SI/OS/BK; crypto-erase of backups (DEC-02).
end note
@enduml
```

### 3b — Functional / Performance / Availability / Interface thread

```plantuml
@startuml TalentFlow_Requirements_FuncPerf
title TalentFlow — Requirements Diagram (Functional · Performance · Availability · Interface)
skinparam linetype ortho

' ---- Requirements ----
rectangle "REQ-F-01\nStage transition persisted in-request" as F01 <<functional>>
rectangle "REQ-F-02\nTenant-scoped search results" as F02 <<functional>>
rectangle "REQ-F-03\nStructured scorecard persisted" as F03 <<functional>>
rectangle "REQ-F-04\nCareers application → candidate record ≤5s" as F04 <<functional>>
rectangle "REQ-F-05\nTemplated candidate email + status" as F05 <<functional>>
rectangle "REQ-F-06\nInterview scheduling via calendar" as F06 <<functional>>
rectangle "REQ-F-07\nPublish opening to job board" as F07 <<functional>>
rectangle "REQ-F-08\nHired-candidate HRIS handoff" as F08 <<functional>>
rectangle "REQ-U-01\nSingle-stage advance ≤3 interactions/≤10s" as U01 <<usability>>
rectangle "REQ-U-02\nWCAG 2.2 AA" as U02 <<usability>>
rectangle "REQ-U-03\nSurface degraded-integration state" as U03 <<usability>>
rectangle "REQ-P-01\nRead p95 ≤400ms / p99 ≤800ms" as P01 <<performance>>
rectangle "REQ-P-02\nStage-write p95 ≤600ms" as P02 <<performance>>
rectangle "REQ-P-03\nSustained throughput at SLO" as P03 <<performance>>
rectangle "REQ-P-04\nNoisy-neighbor isolation" as P04 <<performance>>
rectangle "REQ-O-01\n≥99.9% monthly availability" as O01 <<reliability>>
rectangle "REQ-O-02\nAZ-failover RTO≤15m/RPO≤5m" as O02 <<reliability>>
rectangle "REQ-O-03\nZero-downtime deploy + rollback" as O03 <<reliability>>
rectangle "REQ-INT-01\nSAML 2.0 SSO" as INT01 <<interface>>
rectangle "REQ-INT-02\nSCIM 2.0 provisioning" as INT02 <<interface>>
rectangle "REQ-INT-03\nTokenized Stripe (SAQ-A)" as INT03 <<interface>>
rectangle "REQ-INT-04\nTLS integration, fail-safe queue/retry" as INT04 <<interface>>
rectangle "REQ-C-02\nPCI scope confined to SAQ-A" as C02 <<designConstraint>>

' ---- Blocks ----
component "Candidate Pipeline Service" as CPS <<block>>
component "Search & Indexing Service" as SRCH <<block>>
component "Careers Portal" as CAR <<block>>
component "Recruiter Web App" as RWA <<block>>
component "Scheduling & Email Integration Service" as SCHED <<block>>
component "Job-board & HRIS Integration Service" as JBH <<block>>
component "Identity & SSO Gateway" as IDP <<block>>
component "Billing Service" as BILL <<block>>
component "Edge / API Gateway" as GW <<block>>
component "TalentFlow Platform" as PLAT <<block>>

' ---- Test cases ----
usecase "TC-VER-01\nStage-transition + latency" as TV01 <<testCase>>
usecase "TC-VER-02\nTenant-scoped search + latency" as TV02 <<testCase>>
usecase "TC-VER-03\nScorecard persist" as TV03 <<testCase>>
usecase "TC-VER-05\nApplication-to-record ≤5s" as TV05 <<testCase>>
usecase "TC-VER-06\nEmail/calendar/job-board/HRIS (D)" as TV06 <<testCase>>
usecase "TC-VER-07\nSSO + SCIM" as TV07 <<testCase>>
usecase "TC-VER-08\nRead latency p95/p99 + load" as TV08 <<testCase>>
usecase "TC-VER-15\nAvailability/failover/deploy + degraded UX" as TV15 <<testCase>>

' ---- satisfy ----
CPS ..> F01 : <<satisfy>>
CPS ..> F03 : <<satisfy>>
CPS ..> P02 : <<satisfy>>
SRCH ..> F02 : <<satisfy>>
SRCH ..> P01 : <<satisfy>>
CAR ..> F04 : <<satisfy>>
CAR ..> U02 : <<satisfy>>
RWA ..> U01 : <<satisfy>>
RWA ..> U03 : <<satisfy>>
SCHED ..> F05 : <<satisfy>>
SCHED ..> F06 : <<satisfy>>
JBH ..> F07 : <<satisfy>>
JBH ..> F08 : <<satisfy>>
JBH ..> INT04 : <<satisfy>>
SCHED ..> INT04 : <<satisfy>>
IDP ..> INT01 : <<satisfy>>
IDP ..> INT02 : <<satisfy>>
BILL ..> INT03 : <<satisfy>>
BILL ..> C02 : <<satisfy>>
GW ..> P03 : <<satisfy>>
GW ..> P04 : <<satisfy>>
GW ..> O01 : <<satisfy>>
PLAT ..> O02 : <<satisfy>>
PLAT ..> O03 : <<satisfy>>

' ---- verify ----
TV01 ..> F01 : <<verify>>
TV01 ..> P02 : <<verify>>
TV02 ..> F02 : <<verify>>
TV03 ..> F03 : <<verify>>
TV05 ..> F04 : <<verify>>
TV06 ..> F05 : <<verify>>
TV06 ..> F06 : <<verify>>
TV06 ..> F07 : <<verify>>
TV06 ..> F08 : <<verify>>
TV06 ..> INT04 : <<verify>>
TV07 ..> INT01 : <<verify>>
TV07 ..> INT02 : <<verify>>
TV08 ..> P01 : <<verify>>
TV08 ..> P03 : <<verify>>
TV08 ..> P04 : <<verify>>
TV15 ..> O01 : <<verify>>
TV15 ..> O02 : <<verify>>
TV15 ..> O03 : <<verify>>
TV15 ..> U03 : <<verify>>
TV01 ..> U01 : <<verify>>
TV05 ..> U02 : <<verify>>
TV07 ..> INT03 : <<verify>>
TV07 ..> C02 : <<verify>>

' ---- derive (REQ → REQ, derived→source) ----
P02 ..> F01 : <<derive>>
P01 ..> F02 : <<derive>>
U01 ..> F01 : <<derive>>
P04 ..> P03 : <<derive>>
O02 ..> O01 : <<derive>>
O03 ..> O01 : <<derive>>
C02 ..> INT03 : <<derive>>

note bottom of P01
  Feeds MOP-05 → TPM-02 (latency-under-growth, RSK-03).
end note
note bottom of O01
  Feeds MOP-09 → TPM-01 (availability SLO, RSK-03) → SLO-01 (Phase 10).
end note
@enduml
```

> **Derive-direction discipline (SKILL pitfall):** every `<<derive>>` above points **derived (lower) → source (higher)** and connects **REQ→REQ only**. E.g. `REQ-P-02 → REQ-F-01` (the latency budget is derived from, and constrains, the functional transition); `REQ-O-02 → REQ-O-01` (failover is a derived means to the availability commitment). Domain REQ `REQ-D-01` is the **source** for the privacy-functional `REQ-SEC-06/07/08` and `REQ-O-04`, so those point *up* to it. The `<<refine>>` from `Sequence_SCN-03` and `<<copy>>` on `REQ-D-01` are the only non-`derive` REQ-level relationships, exactly as their vocabulary entries require (refine = model-element↔REQ; copy = reused master).

---

## 4. State Machine — `State_Machine.puml`

Encodes the five SysRS §9 modes and the §9 transition rules **verbatim** — no invented states or transitions. Transitions carry `event [guard] /action`. The Maintenance-overlay note records that deploys (REQ-O-03) and onboarding (SCN-02) enter Maintenance from Nominal.

```plantuml
@startuml TalentFlow_State_Machine
title TalentFlow — System Modes (SysRS §9)
[*] --> Nominal : platform brought online\n/ mode=Nominal

state Nominal {
  Nominal : All tenants & integrations healthy
  Nominal : Full read/write; all integrations live
}
state Degraded {
  Degraded : Dependency/zone impaired
  Degraded : Core pipeline read/write preserved
  Degraded : Ancillary integrations queue-and-retry (REQ-INT-04)
}
state "Read-Only / Safe" as Safe {
  Safe : Writes suspended to protect data integrity
}
state Maintenance {
  Maintenance : Controlled deploys / schema migration
  Maintenance : Tenant onboarding/offboarding (SCN-02)
}
state "Offboarding / EOL" as EOL {
  EOL : Export + retention window + crypto-erase (SCN-05)
}

' --- Nominal <-> Degraded: automatic, health-check driven (REQ-O-02, REQ-INT-04) ---
Nominal --> Degraded : healthCheckFailure [dependency or zone impaired]\n/ engage failover, queue ancillary
Degraded --> Nominal : dependencyRecovered [health restored]\n/ drain retry queue, resume integrations

' --- Any mode -> Read-Only/Safe on incident; only Safe -> Nominal after sign-off ---
Nominal --> Safe : incidentDeclared\n/ suspend writes
Degraded --> Safe : incidentDeclared\n/ suspend writes
Maintenance --> Safe : incidentDeclared\n/ suspend writes
Safe --> Nominal : remediationSignedOff [incident closed]\n/ resume writes

' --- Maintenance: scheduled change / onboarding from Nominal (REQ-O-03 zero-downtime) ---
Nominal --> Maintenance : scheduledChange | tenantOnboard (SCN-02)\n/ staged deploy [health gates]
Maintenance --> Nominal : changeComplete [health checks pass]\n/ resume
Maintenance --> Nominal : healthCheckFailed\n/ automatic rollback (REQ-O-03)

' --- Offboarding/EOL: terminal for a tenant, feeds Phase 11 Disposal (SCN-05) ---
Nominal --> EOL : subscriptionEnd | erasureRequest (SCN-05)
EOL --> [*] : tenant data crypto-erased\n/ certificate of destruction (NIST SP 800-88)

note right of Degraded
  Nominal⇄Degraded automatic per
  REQ-O-02 (AZ failover RTO≤15m/RPO≤5m)
  and REQ-INT-04 (fail-safe queue/retry).
  Degraded UX surfaced per REQ-U-03.
end note
note bottom of EOL
  Offboarding/EOL is terminal per SysRS §9.
  Hands SCN-05 to Phase 11 Disposal (crypto-erase, cert).
end note
@enduml
```

> **State-coverage check:** all five SysRS §9 modes are present; the three §9 summary transition rules (Nominal⇄Degraded automatic; any→Read-Only/Safe on incident, only Safe→Nominal after sign-off; Offboarding/EOL terminal) are each modeled. No transition exists that is not stated in SysRS §9. `refine`: this State Machine refines `REQ-O-02`, `REQ-O-03`, and `REQ-INT-04` (their dynamic behaviour) — noted in §5.2.

---

## 5. MBSE coverage layer (the model that makes it a model)

### 5.1 Satisfy matrix (REQ × block) + negative space

Every one of the 35 REQs has ≥1 satisfying block. "Block" names are the SysRS §12.1 set plus the Edge/API Gateway and Data Tier (SysRS §2).

| REQ | Satisfied by block(s) | Orphan? |
|---|---|---|
| REQ-F-01 | Candidate Pipeline Service | no |
| REQ-F-02 | Search & Indexing Service | no |
| REQ-F-03 | Candidate Pipeline Service | no |
| REQ-F-04 | Careers Portal | no |
| REQ-F-05 | Scheduling & Email Integration Service | no |
| REQ-F-06 | Scheduling & Email Integration Service | no |
| REQ-F-07 | Job-board & HRIS Integration Service | no |
| REQ-F-08 | Job-board & HRIS Integration Service | no |
| REQ-U-01 | Recruiter Web App | no |
| REQ-U-02 | Careers Portal (+ Recruiter Web App) | no |
| REQ-U-03 | Recruiter Web App | no |
| REQ-P-01 | Search & Indexing Service | no |
| REQ-P-02 | Candidate Pipeline Service | no |
| REQ-P-03 | Edge / API Gateway | no |
| REQ-P-04 | Edge / API Gateway | no |
| REQ-O-01 | Edge / API Gateway | no |
| REQ-O-02 | TalentFlow Platform | no |
| REQ-O-03 | TalentFlow Platform | no |
| REQ-O-04 | Privacy & Erasure Service | no |
| REQ-SEC-01 | Tenant Isolation Layer | no |
| REQ-SEC-02 | Identity & SSO Gateway | no |
| REQ-SEC-03 | Data Tier | no |
| REQ-SEC-04 | Audit Service | no |
| REQ-SEC-05 | Identity & SSO Gateway | no |
| REQ-SEC-06 | Privacy & Erasure Service | no |
| REQ-SEC-07 | Privacy & Erasure Service | no |
| REQ-SEC-08 | Privacy & Erasure Service | no |
| REQ-INT-01 | Identity & SSO Gateway | no |
| REQ-INT-02 | Identity & SSO Gateway | no |
| REQ-INT-03 | Billing Service | no |
| REQ-INT-04 | Scheduling & Email + Job-board & HRIS Integration Services | no |
| REQ-C-01 | Tenant Isolation Layer | no |
| REQ-C-02 | Billing Service | no |
| REQ-D-01 | Privacy & Erasure Service | no |
| REQ-D-02 | Audit Service | no |

**Orphan REQs: 0.** All 35 satisfied.

### 5.2 Verify matrix (REQ × TC) + negative space

`TC-VER-*` are model-side placeholders (real IDs finalised in Phase 07, which resolves the `TC-VER-TBD` rows of SysRS §11). 15 named placeholders cover all 35 REQs; methods mirror the SysRS §3–§8 seeded T/I/A/D codes.

| REQ | Verified by (placeholder · method) | Orphan? |
|---|---|---|
| REQ-F-01 | TC-VER-01 (T) | no |
| REQ-F-02 | TC-VER-02 (T) | no |
| REQ-F-03 | TC-VER-03 (T) | no |
| REQ-F-04 | TC-VER-05 (T) | no |
| REQ-F-05 | TC-VER-06 (D) | no |
| REQ-F-06 | TC-VER-06 (D) | no |
| REQ-F-07 | TC-VER-06 (D) | no |
| REQ-F-08 | TC-VER-06 (T) | no |
| REQ-U-01 | TC-VER-01 (T) | no |
| REQ-U-02 | TC-VER-05 (I) | no |
| REQ-U-03 | TC-VER-15 (D) | no |
| REQ-P-01 | TC-VER-08 (T) | no |
| REQ-P-02 | TC-VER-01 (T) | no |
| REQ-P-03 | TC-VER-08 (T) | no |
| REQ-P-04 | TC-VER-08 (T) | no |
| REQ-O-01 | TC-VER-15 (T) | no |
| REQ-O-02 | TC-VER-15 (A) | no |
| REQ-O-03 | TC-VER-15 (D) | no |
| REQ-O-04 | TC-VER-09 (I) | no |
| REQ-SEC-01 | TC-VER-04 (T) | no |
| REQ-SEC-02 | TC-VER-14 (T) | no |
| REQ-SEC-03 | TC-VER-13 (I) | no |
| REQ-SEC-04 | TC-VER-10 (T) | no |
| REQ-SEC-05 | TC-VER-14 (D) | no |
| REQ-SEC-06 | TC-VER-11 (I) | no |
| REQ-SEC-07 | TC-VER-12 (T) | no |
| REQ-SEC-08 | TC-VER-09 (T) | no |
| REQ-INT-01 | TC-VER-07 (T) | no |
| REQ-INT-02 | TC-VER-07 (T) | no |
| REQ-INT-03 | TC-VER-07 (I) | no |
| REQ-INT-04 | TC-VER-06 (T) | no |
| REQ-C-01 | TC-VER-04 (I) | no |
| REQ-C-02 | TC-VER-07 (I) | no |
| REQ-D-01 | TC-VER-11 (I) | no |
| REQ-D-02 | TC-VER-10 (I) | no |

**Unverified REQs: 0.** Each verify is an *assertion backed by proof intent*; no REQ is satisfied-without-verify.

**Refine links (model element → REQ), recorded for completeness:**
- `State_Machine.puml` refines REQ-O-02, REQ-O-03, REQ-INT-04 (dynamic behaviour).
- `Sequence_SCN-03` (§6) refines REQ-SEC-08, REQ-SEC-04 (the erasure/audit interaction).

### 5.3 Derive-direction check (Conventions §7 / KB empty-column rule)

A top-level/source REQ must have an **empty "Derives-from"**; a leaf REQ must have an **empty "Derives"**. Violations = wrong-direction arrows.

| REQ | Derived from (points up to) | Derives (sources for) | Wrong-direction? |
|---|---|---|---|
| REQ-D-01 | — (regulatory master) | REQ-SEC-06, REQ-SEC-07, REQ-SEC-08, REQ-O-04 | no |
| REQ-D-02 | — (regulatory master) | REQ-SEC-04 | no |
| REQ-F-01 | — | REQ-P-02, REQ-U-01 | no |
| REQ-F-02 | — | REQ-P-01 | no |
| REQ-SEC-01 | — | REQ-SEC-03 | no |
| REQ-O-01 | — | REQ-O-02, REQ-O-03 | no |
| REQ-P-03 | — | REQ-P-04 | no |
| REQ-INT-03 | — | REQ-C-02 | no |
| REQ-SEC-08 | REQ-D-01 | — | no |
| REQ-SEC-07 | REQ-D-01 | — | no |
| REQ-SEC-06 | REQ-D-01 | — | no |
| REQ-O-04 | REQ-D-01 | — | no |
| REQ-SEC-04 | REQ-D-02 | — | no |
| REQ-SEC-03 | REQ-SEC-01 | — | no |
| REQ-P-02 | REQ-F-01 | — | no |
| REQ-P-01 | REQ-F-02 | — | no |
| REQ-U-01 | REQ-F-01 | — | no |
| REQ-P-04 | REQ-P-03 | — | no |
| REQ-O-02 | REQ-O-01 | — | no |
| REQ-O-03 | REQ-O-01 | — | no |
| REQ-C-02 | REQ-INT-03 | — | no |

All `derive` links connect REQ→REQ and point derived→source. **Wrong-direction errors: 0.** (REQs not listed here participate in no `derive`; that is legal — `derive` is not mandatory for every REQ, and their up-trace to needs is via `SN-*` per SysRS §11, not a REQ→REQ derive.)

### 5.4 Orphan-block list

| Block | Satisfies ≥1 REQ? | Note |
|---|---|---|
| All 11 SysRS §12.1 blocks | yes | see §5.1 |
| Edge / API Gateway | yes | REQ-P-03/04, REQ-O-01 (availability measured at gateway) |
| Data Tier | yes | REQ-SEC-03 (at-rest encryption / per-tenant keys) |
| Primary Store / Search Index / Object Storage / Backups | structural | targets of REQ-SEC-08 erasure cascade; not independent satisfiers — not gold-plating |

**Orphan blocks (satisfy no REQ and unjustified): 0.**

### 5.5 Coverage metrics (timestamped — append a row per re-run)

| Date | % REQ satisfied | % REQ verified | # orphan REQ | # orphan blocks | # wrong-direction |
|---|---|---|---|---|---|
| 2026-06-26 | 100% (35/35) | 100% (35/35) | 0 | 0 | 0 |

### 5.6 REQ class → SysML subtype map (typing anchor)

| Conventions class | SysML subtype / stereotype used above |
|---|---|
| F Functional | `<<functional>>` |
| U Usability | `<<usability>>` |
| P Performance | `<<performance>>` |
| O Operational/Reliability | `<<reliability>>` |
| SEC Security | `<<securityControl>>` |
| INT Interface | `<<interface>>` |
| C Constraint | `<<designConstraint>>` |
| D Domain | `<<domain>>` |

---

## 6. Sequence — `Sequence_SCN-03.puml` (key scenario: right-to-erasure)

The privacy thread is the Formal-overlay spine and the top legal risk (RSK-02 → TPM-04). This sequence models Concept §7 **SCN-03** time-ordered across actors and blocks, annotating the erasure SLA (`MOP-13`/`TPM-04`, ≤30 days) and the tamper-evident audit record (`REQ-SEC-04`). It is the chosen "one sequence for the key scenario" for this deliverable.

```plantuml
@startuml TalentFlow_Sequence_SCN03
title TalentFlow — Sequence: SCN-03 Candidate right-to-erasure (REQ-SEC-08, SLA ≤30d = TPM-04)
autonumber
actor "Candidate\n(STK-03)" as CAND
actor "Customer Admin\n(STK-04)" as ADMIN
participant "Careers Portal /\nRecruiter Web App" as UI <<block>>
participant "Identity &\nSSO Gateway" as IDP <<block>>
participant "Tenant\nIsolation Layer" as TIL <<block>>
participant "Privacy &\nErasure Service" as PES <<block>>
database "Primary Store" as PS
database "Search Index" as SI
database "Object Storage" as OS
database "Backups" as BK
participant "Audit Service" as AUD <<block>>
actor "Auditor\n(STK-09)" as AUDITOR

CAND -> UI : submit erasure request (REQ-SEC-08)
UI -> IDP : verify requester identity (REQ-SEC-05 MFA if not IdP-asserted)
IDP --> UI : identity verified
UI -> PES : eraseSubject(candidate) [tenant-scoped]
PES -> TIL : authorize(actor, tenant, candidate) (REQ-SEC-01)
TIL --> PES : allow [in-tenant only]
PES -> PES : schedule erasure within legal window\n(≤30d = TPM-04 / MOP-13)
AUD <- PES : record("erasure-scheduled", actor, tenant, target, ts) (REQ-SEC-04)

group Cascade erasure across all stores (REQ-SEC-08; DEC-02 backup strategy)
  PES -> PS : delete candidate PII rows
  PS --> PES : deleted
  PES -> SI : purge indexed PII (REQ-F-02 index)
  SI --> PES : purged
  PES -> OS : delete attachments / objects
  OS --> PES : deleted
  PES -> BK : crypto-erase per-tenant/per-record key (NIST SP 800-88)
  BK --> PES : key destroyed → PII irrecoverable
end

PES -> AUD : record("erasure-complete", proof-hash, ts) (REQ-SEC-04)
AUD --> PES : ErasureProof persisted (tamper-evident)
PES --> UI : erasure complete (within SLA)
UI --> CAND : confirmation
UI --> ADMIN : tenant notified

== On demand ==
AUDITOR -> AUD : produceEvidence(candidate) (REQ-SEC-04, REQ-D-01)
AUD --> AUDITOR : EvidencePack (proof of irrecoverable erasure)

note over PES, BK
  Verified by TC-VER-09 (erasure completeness across PS/SI/OS/BK).
  MOP-13 target 100% within legal window → TPM-04.
  Every step authorized by TIL (REQ-SEC-01) — no cross-tenant reach.
end note
@enduml
```

> **Latency/measurement annotations come only from the SysRS** (no invented numbers): erasure SLA ≤30 days (`MOP-13`/`TPM-04`); identity step references `REQ-SEC-05` MFA; cascade backed by `REQ-SEC-08`; crypto-erase per `NIST SP 800-88 Rev. 1` (Conventions §9). The sequence `<<refine>>`s `REQ-SEC-08` and `REQ-SEC-04`.

### Remaining three of the seven (tracked, not authored here)

| Diagram | File (sibling .puml) | Builds on | Status |
|---|---|---|---|
| Use Case | `Use_Case_Diagram.puml` | Concept §2 actors + REQ-F-* | TODO |
| Internal Block (IBD) | `IBD_TenantIsolationLayer.puml` | most-critical block (TIL) ports → ICD seams | TODO |
| Activity | `Activity_SCN-01.puml` | SCN-01 recruiter-advances-candidate golden path | TODO |

These three complete the Conventions §7 seven-diagram working set; their absence is **declared, not silent**, and does not affect the model-coverage gate (which is satisfy + verify completeness, met at 100% in §5.5).

---

## 7. Interface & decision seams surfaced for downstream phases

Design-side IDs introduced here use convention grammar and trace back to a REQ; their definitions are **owned downstream** (ICDs in Phase 04, decisions in Phase 05, SLOs in Phase 10) — listed by name only so Phases 04–10 align to stable names.

| New ID | Kind | Implied by (model element) | Traces to REQ | Owned by |
|---|---|---|---|---|
| ICD-01 | Interface | IDP ↔ Tenant IdP (SAML/SCIM) | REQ-INT-01, REQ-INT-02 | Phase 04 |
| ICD-02 | Interface | Billing ↔ Stripe (tokenized) | REQ-INT-03, REQ-C-02 | Phase 04 |
| ICD-03 | Interface | Scheduling/Email + Job-board/HRIS ↔ Partners | REQ-INT-04, REQ-F-05..08 | Phase 04 |
| ICD-04 | Interface | TIL ↔ Data Tier (authZ on every access) | REQ-SEC-01 | Phase 04 (IBD ports) |
| DEC-01 | Decision | Tenant-isolation model | REQ-SEC-01, REQ-C-01 | Phase 05 (per SysRS §12.2) |
| DEC-02 | Decision | Erasure-across-backups strategy | REQ-SEC-08 | Phase 05 (per SysRS §12.2) |
| DEC-03 | Decision | Multi-region availability topology | REQ-O-01, REQ-O-02 | Phase 05 (per SysRS §12.2) |
| SLO-01 | Service Level Objective | Availability behaviour (GW) | REQ-O-01 (→ TPM-01) | Phase 10 |

> `ICD-*`/`DEC-*`/`SLO-*` are **placeholders introduced, not defined** here (Conventions §2.5 placeholder convention). `DEC-01..05` names are taken verbatim from SysRS §12.2; no conflicting decision IDs invented.

---

## 8. Model-coverage gate

Gate: **Model Coverage** (Conventions §1, Phase 03 exit) → enables Phase 04 PDR work.

- [x] Diagrams present as embedded renderable PlantUML: **BDD, Requirements (3a+3b), State Machine, Sequence (SCN-03)** — 4 of the 7; remaining 3 declared as TODO sibling files (§6), "7 of 9" stated.
- [x] **Every REQ satisfied by ≥1 block** — satisfy matrix §5.1, 35/35, 0 orphans.
- [x] **Every REQ verified by ≥1 test case** — verify matrix §5.2, 35/35, 0 unverified (placeholders, resolved in Phase 07).
- [x] **Derive-direction clean** — §5.3, all REQ→REQ, derived→source, 0 wrong-direction.
- [x] No unexplained orphan blocks (§5.4); `trace` used 0 times (every link is a stronger relationship).
- [x] State Machine covers all 5 SysRS §9 modes with no invented transitions (§4).
- [x] Coverage metrics computed **and timestamped** (§5.5, 2026-06-26).
- [x] Each `.puml` block + this file registered as a CI for Config Mgmt (Phase 09); status `Draft` until SysRS is SRR-baselined, then re-verify coverage.
- [ ] Author the 3 remaining sibling `.puml` (Use Case, IBD, Activity) — **TODO** (§6), tailorable-but-tracked.

**Gate recommendation:** **Pass-with-actions** — satisfy/verify/derive coverage is complete (the gate's binding criteria); advance to Phase 04 (Architecture & PDR) carrying the three remaining diagrams and `ICD-01..04` / `DEC-01..05` seams as Phase-04 entry items.

---

## 9. Self-check

- **Path:** `/Users/andresrambal/Projects/courses/courses/udacity/System Engineering/System_Engineering_Workflow/examples/2_SaaS_ATS/Phase_03_Modeling/Models.md`
- **REQ IDs referenced:** all **35** SysRS requirements (F-01..08, U-01..03, P-01..04, O-01..04, SEC-01..08, INT-01..04, C-01..02, D-01..02), each satisfied by ≥1 block and verified by ≥1 `TC-VER-*` placeholder.
