# Verification & Validation Methods — Projects

## Guided project: design a V&V approach for a healthcare patient-management system

**Scenario.** A hospital is about to build and deploy a new patient-management system (the source's healthcare example) and you must plan its full V&V approach (source: m4-vv).

**Goal.** Produce a one-page V&V plan that (1) lists each method, (2) labels each as verification or validation, (3) puts them in the correct order, and (4) names a concrete check per method.

**Requirements (inputs).** Cover at minimum: at least one inspection type, at least two review types, all four testing levels, at least two acceptance-testing types (including UAT), and at least one of pilot/simulation (source: m4-vv).

**Suggested steps & checkpoints:**

1. **V&V table** — columns: Method | Verification or Validation | What it checks | When in the sequence. *Done when:* every method has all four columns and verification rows all precede validation rows (source: m4-vv).
2. **Inspection & review pass** — pick the inspection types (document/code) and reviews (requirements, design, code, test-case) you'll run before build. *Done when:* each names the artifact examined and "without execution / before implementation" is respected (source: m4-vv).
3. **Testing levels** — define one example check at each level: unit, integration, system, acceptance. *Done when:* the first three are verification and acceptance is flagged as the bridge to validation (source: m4-vv).
4. **Validation plan** — specify **UAT** by clinical end-users, plus one of OAT (performance/security/maintainability in the final environment) or regulatory/compliance testing; decide whether a **pilot** (limited ward/department first) or **simulation** is warranted. *Done when:* each validation method names who runs it and where (source: m4-vv).
5. **Best-practices & criteria** — attach the four validation best practices and a documented pass/fail criterion for at least the UAT. *Done when:* pass/fail is defined *in advance* (source: m4-vv).

**Starter V&V table (extend it):**

| Method | V or V? | What it checks | Order |
| :-- | :-- | :-- | :-- |
| Document inspection | Verification | Requirements spec & design docs, no execution | 1 |
| Design review | Verification | Architecture, interfaces, maintainability | 2 |
| Unit testing | Verification | Each module in isolation | 3 |
| Integration testing | Verification | Subsystems exchange data correctly | 4 |
| System testing | Verification | Full system vs requirements | 5 |
| UAT | Validation | End-users confirm business workflows | 6 |
| Pilot (one ward) | Validation | Real users, limited deployment | 7 |

(source: m4-vv)

## Independent (challenge) project

Design a complete V&V approach for a system of your choice that spans the domain — e.g., the autonomous-delivery robot (from the requirements module) or a smart-city traffic system (source: m4-vv). Constraints only: (1) include inspection, at least three review types, all four testing levels, at least three acceptance types (must include UAT and one of FAT/SAT with a justification for why that pairing fits your delivery model), and pilot **and** simulation with a one-line rationale for each; (2) sequence everything with a clear verification→validation boundary; (3) address both validation challenges (evolving requirements; lab-vs-real-world gap) by citing which best practice mitigates each; (4) add a short note distinguishing this *system* V&V from *requirement-statement* verification done earlier (cross-ref [06-verifying-requirements](../06-verifying-requirements/README.md)) and from where the test cases/plans are authored (cross-ref [17-test-plans-cases](../17-test-plans-cases/README.md)). Goal: a deployment-ready V&V plan a reviewer could execute.

## Build notes & solution sketch

- **Architecture:** one ordered V&V table is the spine — the verification block (inspection, reviews, unit/integration/system testing) always sits above the validation block (acceptance types, pilot, simulation); the verification→validation boundary is the single most important line in the plan (source: m4-vv).
- **Key decision — which acceptance types?** UAT is mandatory (end-user/business fit); add **OAT** when operational performance/security/maintainability matter, **regulatory/compliance** for regulated domains (healthcare, finance), and the **FAT→SAT** pair when there's a manufacturer-builds / customer-installs split (source: m4-vv).
- **Key decision — pilot vs simulation:** simulation validates behavior *before any deployment exists* (NASA rover pattern); a pilot validates with real users in a *limited live deployment* (traffic-district pattern) — use both for high-risk systems (source: m4-vv).
- **Hard part — the two validation challenges:** evolving/unclear requirements → counter with *iterative validation* + *engage users early*; lab-vs-real-world gap → counter with *test in real environments* + a real-user *pilot*; pre-agree *documented pass/fail criteria* so "validated" is objective (source: m4-vv).
- **Scope boundary:** writing the actual test cases and the formal test plan is owned by [17-test-plans-cases](../17-test-plans-cases/README.md); continuous testing inside Agile sprints is owned by [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md). This plan *names* the methods and their order (source: m4-vv, m4-review).
