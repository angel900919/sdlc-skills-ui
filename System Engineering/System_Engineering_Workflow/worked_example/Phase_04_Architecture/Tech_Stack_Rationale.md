# Technology Stack Rationale — EVCN

## 1. Edge / Station

| Layer | Choice | Rationale | Alternatives Considered |
|---|---|---|---|
| **SoC** | NXP i.MX 8M Plus (Cortex-A53 quad + Cortex-M7) | Mature Linux + RT split, automotive-temp grade, integrated NPU for vision-based vandalism detection later. | TI AM62, Renesas RZ/G2 |
| **OS** | Yocto Linux + PREEMPT_RT patch | Reproducible builds, long-term support, RT scheduling for charge control. | Buildroot, OpenWrt |
| **Firmware language** | Rust (Station Controller), C (driver layer) | Memory safety in the hottest control path; C reused for vendor PE drivers. | Pure C, C++ |
| **OCPP stack** | OCA Reference v2.0.1 (Java) wrapped in Rust IPC | Certified base + Rust safety wrapper for state machine. | StevTech eve, in-house |
| **ISO 15118 stack** | switch-ev/v2g (Rust port) | Open source, conformance-tested, active project. | Vector vSECC (commercial) |
| **Secure element** | Infineon OPTIGA TPM 2.0 SLB 9670 | TCG-certified, broad ecosystem, FIPS 140-2. | NXP A1006, ATECC608 |

## 2. Cloud Backend

| Layer | Choice | Rationale | Alternatives Considered |
|---|---|---|---|
| **Container orchestration** | Kubernetes (EKS) | Industry standard, multi-AZ HA, ecosystem. | ECS, Nomad |
| **Service language** | Go | Fast, concurrent, small images, strong stdlib for net code. | Java, Rust, Node |
| **API gateway** | Envoy + Istio | mTLS, observability, traffic shifting for blue/green. | Kong, Nginx Plus |
| **Identity** | Keycloak (self-hosted) + Auth0 (driver-facing) | Operator-side full control; driver-side managed. | Cognito only, Okta |
| **Database** | PostgreSQL 16 (Aurora) | ACID, JSONB for OCPP payloads, mature ops. | CockroachDB, MongoDB |
| **Event bus** | Apache Kafka (MSK) | High throughput for telemetry, replay for analytics. | NATS, RabbitMQ |
| **Object storage** | S3 | Logs, firmware images, video clips. | Azure Blob, GCS |
| **CSMS framework** | StevTech eve (Java) wrapped behind Go gRPC | OCA-tested foundation; Go layer exposes business APIs. | In-house from scratch |
| **Observability** | Prometheus + Grafana + Loki + OpenTelemetry | Open standards, no vendor lock-in. | Datadog, New Relic |
| **CI/CD** | GitHub Actions + Argo CD | GitOps, mature ecosystem. | Jenkins, GitLab CI |

## 3. Mobile / Web Clients

| Layer | Choice | Rationale | Alternatives Considered |
|---|---|---|---|
| **Mobile** | Flutter 3.x | Single codebase iOS+Android, native-grade BLE for future PnC v2 use. | React Native, native Swift+Kotlin |
| **Web** | React 18 + Vite + TypeScript | Strong typing, fast HMR, large hiring pool. | Vue, Svelte |
| **State** | TanStack Query | Caching + refetch handles flaky networks at sites. | Redux Toolkit |
| **Maps** | Mapbox GL | Custom styling, offline tiles for in-app navigation. | Google Maps, Apple MapKit |
| **Charts** | Recharts | Lightweight, MIT-licensed. | Highcharts (paid) |

## 4. Cross-Cutting

| Concern | Choice | Rationale |
|---|---|---|
| **Time sync** | NTP + IEEE 1588 PTP for revenue meters | PTP needed for sub-ms timestamp on energy events. |
| **Crypto** | TLS 1.3 everywhere; AES-256-GCM at rest; Ed25519 for firmware signing | Modern, post-quantum-ready migration path. |
| **PCI scope minimization** | Tap to Pay via Stripe Terminal SDK | Card data never touches our software. |
| **Compliance** | UL 2594, IEC 61851-1, ISO 15118, FCC Part 15, CE, PCI-DSS 4.0, GDPR | Required for market entry. |
| **DR** | OpenADR 2.0b VEN client embedded in DR Orchestrator | Mandated by California Rule 24, similar in NY. |

## 5. Architecture Frameworks Applied

- **TOGAF-lite ADM** structures the phases (Vision → Business → IS → Tech → Migration → Governance → Change). Mapping in `Phase_01_Concept/Project_Development_Plan.md`.
- **C4 model** used for software-only views of the cloud (Context, Container, Component, Code).
- **AWS Well-Architected Framework** drives the cloud pillars: Reliability (multi-AZ), Security (mTLS, KMS), Performance (k6 SLOs), Cost (spot for non-prod), Sustainability (rightsizing).
- **NIST CSF** drives the security overlay (Identify / Protect / Detect / Respond / Recover).

## 6. What We Explicitly Are NOT Using (and why)

| Tech | Reason for rejection |
|---|---|
| Pure cloud-only architecture | Violates REQ-O-04 (24 h offline charging). |
| MQTT for OCPP | OCPP 2.0.1 mandates JSON-over-WSS; MQTT not certified. |
| Kotlin Multiplatform Mobile | Smaller talent pool than Flutter at this time. |
| AWS-only managed services (e.g., DocumentDB) | Vendor lock-in; postgres open path stays portable. |
| Plain SSH key auth for stations | Requires per-device key management; replaced by mTLS + TPM. |
