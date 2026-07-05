# Architecture

_The narrative, diagram-bearing view for people. The terse agent version is `.ai/architecture.md`;
keep them in sync. Diagrams use [Mermaid](https://mermaid.js.org), which renders on GitHub._

## What this system is
[One or two paragraphs: the product, its users, the core value it delivers.]

## System overview
```mermaid
flowchart LR
    User([User]) -->|HTTPS| API[API Layer]
    API --> SVC[Services<br/>business logic]
    SVC --> DB[(Database)]
    SVC --> EXT[External APIs]
    API -.observability.-> OTEL[[OpenTelemetry]]
```

## Request lifecycle
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant S as Service
    participant D as Database
    U->>A: request
    A->>A: validate → typed command
    A->>S: dispatch command
    S->>D: read / write
    D-->>S: result
    S-->>A: response model
    A-->>U: JSON
```

## Components
### [API layer] — `src/api/`
[What it owns. Key decision + link to the ADR. Cross-ref `.ai/architecture.md#components`.]

### [Services] — `src/services/`
[Where business rules live and why nothing else may hold them.]

### [Data layer] — `src/db/`
[The single path to persistence; the invariant it protects.]

## Cross-cutting concerns
- **Auth:** [approach] — see `adr/[NNNN]`.
- **Observability:** [OpenTelemetry GenAI/HTTP spans → backend].
- **Error handling:** [standard error shape, where it's defined].

## Where to go next
- Decisions behind this design → [adr/](adr/)
- How a specific feature works → [features/](features/)
