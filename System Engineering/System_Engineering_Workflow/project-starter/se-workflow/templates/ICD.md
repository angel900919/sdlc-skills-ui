---
Document: <Project> Interface Control Document
Document ID: ICD-<PROJECT_SLUG>-v0.1
Standard: ISO/IEC/IEEE 42010:2022 (interface views); ISO/IEC/IEEE 15288:2023 (Architecture/Design Definition)
Status: Draft
Owner: <System Architect>
---

<!--
HOW TO USE THIS TEMPLATE
- This is the Phase 04 Interface Control Document. It freezes every component-to-component seam.
- STATUS DISCIPLINE (Conventions §3): the ICD is `Draft` in the allocated baseline at PDR, and is
  frozen -> `Baseline (CDR-approved YYYY-MM-DD)` as part of the product baseline at CDR (Phase 06).
  Do NOT mark it Baseline in Phase 04. Update the frontmatter Status only at CDR.
- A "seam" = where two INDEPENDENTLY developed/owned components meet. Internal couplings inside one
  block belong to the IBD (Phase 03), not here.
- No vague rows: every interface names a standard or an in-house spec WITH a link — never
  "JSON over HTTP" without an OpenAPI / JSON-Schema reference.
- Latency budgets come from REQ-P-*; if none exists, write
  "TODO: define latency budget for ICD-NN in Phase 02" — never invent a number.
- All IDs (ICD-NN, REQ-*, THR-*, HAZ-*), gates, status strings, and citations come from
  ../05_Conventions.md — cite, do not redefine.
-->

# <Project> — Interface Control Document

## 1. Scope

- **Purpose:** Defines every interface where two independently developed components meet. This is the contract used by integration testing in `Phase_06_Integration/Integration_Plan.md`.
- **Derived from:** the Physical/Deployment view in `Architecture_Description.md` §5 — every cross-boundary edge there is one ICD row below.
- **Freeze point:** Draft at PDR (allocated baseline) → frozen to Baseline at **CDR** (product baseline). Changes after freeze go through a `CR-NN` (Phase 09).
- TODO: confirm all external dependencies and every `REQ-INT-*` are represented as rows in §2.

## 2. Interface inventory

> One row per seam. Assign `ICD-NN` (zero-padded, stable for project life). Layer ∈ {Physical, Protocol, Application, Network}. Direction ∈ {Bi, In, Out}. Set the trust-boundary and safety flags — they hand the seam to the Security (`THR-*`) and Safety (`HAZ-*`) threads.

| ICD-ID | Sender | Receiver | Layer | Standard (named + link) | Direction | Trust-boundary? | Safety-relevant? |
|---|---|---|---|---|---|---|---|
| ICD-01 | `<sender block>` | `<receiver block>` | <Physical/Protocol/App/Network> | `<named standard + ref>` | <Bi/In/Out> | <Y/N> | <Y/N> |
| ICD-02 | `<sender block>` | `<receiver block>` | <Application> | `<named standard + ref>` | <Bi/In/Out> | <Y/N> | <Y/N> |
| ICD-03 | Edge Controller (example — delete) | Backend API | Application | OpenAPI 3.1 + REST/JSON over WSS/TLS 1.3 (link: `/specs/api.yaml`) | Bi | Y | N |
| ... | <one row per seam> | | | | | | |

## 3. Detailed interface specifications

> One sub-section per `ICD-NN`. Capture the full contract. Copy the block below for each interface.

### ICD-NN — <Sender> ↔ <Receiver> (<short label>)

| Attribute | Value |
|---|---|
| Physical / Transport | <connector, bus, network — e.g. RJ45 / CAN-FD / WebSocket over TLS 1.3> |
| Subprotocol / message set | <e.g. ocpp2.0.1 / list the key messages> |
| Auth | <mTLS / OAuth 2.1 / API key / device cert / RFID / EMV> |
| Message format | <OpenAPI path / Protobuf .proto / JSON Schema / ASN.1 — link the artifact> |
| Cadence | <event-driven / 30 s heartbeat / 1 Hz polling> |
| Latency budget | <≤ X ms from REQ-P-YY  \|  TODO: define latency budget for ICD-NN in Phase 02> |
| Throughput / capacity | <≥ X msg/s or N/A — from REQ-P-* if applicable> |
| Failure mode | <timeout/retry policy / offline buffering ≥ X h / fallback behaviour> |
| Versioning | <semver / capability negotiation / version header> |
| Crosses trust boundary | <Y → THR-NN  \|  N> |
| Safety-relevant | <Y → HAZ-NN  \|  N> |
| Linked REQs | <REQ-INT-NN, REQ-SEC-NN, REQ-P-NN> |

### ICD-01 — Edge Controller ↔ Backend API (telemetry + control)  *(example — delete)*

| Attribute | Value |
|---|---|
| Physical / Transport | WebSocket Secure (WSS) over TLS 1.3 |
| Subprotocol / message set | App-defined: `Register`, `Telemetry`, `Command`, `Ack`, `Heartbeat` |
| Auth | mutual TLS with device cert from secure element |
| Message format | JSON Schema (link: `/specs/edge-api.schema.json`) |
| Cadence | Heartbeat every 60 s; Telemetry every 5 s during a session |
| Latency budget | ≤ 200 ms command round-trip (from REQ-P-04) |
| Throughput / capacity | ≤ 50 msg/s/device |
| Failure mode | Offline buffer ≥ 24 h, drains FIFO on reconnect; command timeout 500 ms → safe state |
| Versioning | semver; capabilities advertised in `Register` |
| Crosses trust boundary | Y → THR-02 |
| Safety-relevant | Y → HAZ-01 |
| Linked REQs | REQ-INT-01, REQ-SEC-02, REQ-P-04, REQ-O-04 |

## 4. Cross-cutting concerns

> Interface-wide concerns that don't belong to a single ICD row.

- **Security / trust boundaries:** <summarise which ICD rows cross a trust boundary; link each to the Security thread (`THR-*`) in `../cross_cutting/`. TODO: complete after threat-modelling pass.>
- **Observability:** <correlation IDs, tracing headers, log/metric expectations across interfaces.>
- **Error handling & idempotency:** <global retry/backoff policy, idempotency keys, dead-letter handling.>
- **Time & ordering:** <clock sync requirement (NTP/PTP), ordering guarantees, replay protection.>
- **Power / environmental interfaces (hardware/hybrid):** <mains, DC output, operating temp, ingress rating — add a table if applicable; else "N/A — software-only".>

## 5. Change control

- This ICD is versioned (doc version `vMAJOR.MINOR`; underlying schemas use semver `MAJOR.MINOR.PATCH`).
- **Frozen at CDR (Phase 06).** After freeze, any change to a message set, schema, auth, or physical interface requires a `CR-NN` via `Phase_09_Change_Config/Change_Management_Plan.md`.
- Each `ICD-NN` has a row in `Traceability_Matrix.md` linking to its satisfying block(s) and verifying test case(s) (`TC-VER-*`).
- TODO: at CDR, update frontmatter `Status:` to `Baseline (CDR-approved YYYY-MM-DD)`.

---

### PDR exit-gate self-check (delete once green)

- [ ] Every cross-boundary edge from the Deployment view (§5 of `Architecture_Description.md`) appears as an inventory row (§2).
- [ ] Every `REQ-INT-*` and every external dependency has an `ICD-NN` entry.
- [ ] Every row names a standard (with link), an auth mechanism, and a REQ-sourced (or `TODO:`-marked) latency budget.
- [ ] Trust-boundary and safety-relevant flags set on every row; each crossing seam linked to a `THR-*` / `HAZ-*` (or TODO).
- [ ] No vague rows ("TBD" / "JSON over HTTP" without a schema link).
- [ ] Status = `Draft` (NOT baselined — frozen at CDR).
