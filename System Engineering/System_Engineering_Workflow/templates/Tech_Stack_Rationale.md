---
Document: <Project> Technology Stack Rationale
Document ID: TSR-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 42010:2022 (architecture decisions); ISO/IEC/IEEE 15288:2023 (Design Definition)
Status: Draft
Owner: <System Architect>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the Phase 04 technology-stack justification. It records, per tier, the chosen technology,
  the alternatives weighed, and WHY — each "why" tied to a REQ, an architecture principle, or a
  constraint (REQ-C-*/REQ-D-*).
- The load-bearing section is §N "What we are NOT using and why": 4–8 tempting alternatives, each
  with a SPECIFIC rejection reason tied to a REQ or principle. A generic "considered others" fails
  the gate.
- Respect mandated-tech constraints (REQ-C-* / REQ-D-*) — never silently override them.
- Strategic, expensive-to-reverse choices here become Phase 05 trade studies (`DM-NN`). Note the
  DEC-TBD seed so `se-phase-05-tradeoff` can make them auditable.
- All IDs and citations come from ../05_Conventions.md — cite, do not redefine.
- Keep only the tiers that apply to your system; delete the rest. Add tiers as needed.
-->

# <Project> — Technology Stack Rationale

> For each major tier: **Choice · Alternatives considered (≥ 2) · Why this (link a REQ / principle / constraint)**. Keep applicable tiers only.

## 1. <Tier — e.g. Hardware / SoC / Sensors>  *(delete if software-only)*

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<chosen tech + version>` | `<alt 1>`, `<alt 2>` | <reason tied to REQ-NN / AP-NN / REQ-C-NN> | <DEC-TBD if strategic> |
| ... | | | |

## 2. <Tier — e.g. Firmware / Edge OS>  *(delete if N/A)*

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<chosen tech + version>` | `<alt 1>`, `<alt 2>` | <reason> | <DEC-TBD?> |

## 3. Backend / Services

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<runtime/language + version>` | `<alt 1>`, `<alt 2>` | <reason tied to REQ-P-NN throughput, team skill, etc.> | <DEC-TBD?> |
| Go 1.22 + Fiber (example — delete) | Java/Spring, Node/Express, Rust/Axum | 5k RPS throughput + GC predictability (REQ-P-05); team skill | DEC-TBD |

## 4. Database / Persistence

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<engine + version>` | `<alt 1>`, `<alt 2>` | <ACID/scale/consistency reason tied to REQ-NN> | <DEC-TBD?> |

## 5. Mobile / Web clients  *(delete if N/A)*

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<framework + version>` | `<alt 1>`, `<alt 2>` | <reason tied to REQ-U-NN / team / platform reach> | <DEC-TBD?> |

## 6. Infrastructure / Orchestration / CI-CD

| Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) | DEC-TBD? |
|---|---|---|---|
| `<orchestrator / IaC / CI>` | `<alt 1>`, `<alt 2>` | <HA/portability/cost reason tied to REQ-O-NN / AP-NN> | <DEC-TBD?> |

## 7. Observability / Auth / Payment / Standards  *(keep what applies)*

| Concern | Choice | Alternatives considered (≥ 2) | Why this (link REQ / principle / constraint) |
|---|---|---|---|
| Observability | `<stack>` | `<alt 1>`, `<alt 2>` | <open standards / no lock-in / AP-NN> |
| Auth / Identity | `<choice>` | `<alt 1>`, `<alt 2>` | <reason tied to REQ-SEC-NN> |
| Payment | `<choice>` | `<alt 1>`, `<alt 2>` | <PCI-scope reason tied to REQ-SEC-NN> |
| Mandated standards | `<list — e.g. ISO 15118, PCI-DSS 4.0, GDPR>` | — | Required by REQ-D-NN / REQ-C-NN (market entry / regulation) |

## 8. Architecture frameworks applied  *(cross-reference §4 of Architecture_Description.md)*

> One or two lines per framework — which framework does what (complementary, not single-select). Keep consistent with `Architecture_Description.md` §4; do not restate the full justification.

- **<TOGAF ADM>** — <governing process; mapping lives in `Architecture_Description.md` §4 / Project Development Plan>.
- **<C4 / arc42>** — <software views / document spine>.
- **<Cloud Well-Architected>** — <cloud-tier quality pillars: reliability / security / performance / cost / sustainability>.
- TODO: confirm this list matches `Architecture_Description.md` §4.

## 9. What we are NOT using and why  *(load-bearing — 4–8 specific rejections)*

> Each row: a tempting alternative + a SPECIFIC rejection reason tied to a REQ or a principle. Not "we considered others" — name the option and the blocking reason.

| Rejected option | Reason for rejection (tie to REQ / principle) |
|---|---|
| `<rejected tech>` | <specific reason, e.g. "no offline mode — violates REQ-O-04"> |
| `<rejected tech>` | <specific reason linking REQ-NN or AP-NN> |
| Pure cloud-only architecture (example — delete) | Violates REQ-O-04 (24 h offline operation requirement) |
| MQTT for the device protocol (example — delete) | Chosen protocol mandates JSON-over-WSS; MQTT not conformant — blocks REQ-INT-01 |
| `<rejected tech>` | <specific reason> |
| ... | <4–8 total> |

---

### PDR exit-gate self-check (delete once green)

- [ ] Every major tier has a `Choice`, ≥ 2 alternatives, and a `why` tied to ≥ 1 REQ or principle.
- [ ] No mandated-tech `REQ-C-*` / `REQ-D-*` silently overridden.
- [ ] §9 "NOT using" list has ≥ 4 specific rejections, each tied to a REQ or principle.
- [ ] Strategic choices flagged `DEC-TBD` for Phase 05 (so they get a `DM-NN` matrix).
- [ ] Framework list (§8) matches `Architecture_Description.md` §4.
