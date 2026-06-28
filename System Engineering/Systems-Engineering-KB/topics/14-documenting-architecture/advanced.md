# Documenting System Architecture — Advanced concepts

## Advanced concepts

- **The BDD as a phased living document.** The artifacts are not independent snapshots: the BDD is refined *through* the IBD and ICD phases. As component interactions and interfaces become clearer, new properties, blocks, or connections are added back to the BDD — so the four artifacts form a single evolving model, not a fixed sequence (source: m3-document).
- **ICD as a development-coordination contract.** The ICD's role extends beyond description: its use case is "coordinating development across teams" (source: m3-review). Its data-exchange details (units, valid ranges, timing/synchronization) and constraints (latency, power) are the clauses that let teams build and integrate independently — which is why the ICD, not the IBD, is the artifact teams negotiate over (source: m3-document; source: m3-icd).
- **Protocol/format heterogeneity within one system.** A single architecture commonly mixes transport and encoding per interface. The ADR ICD uses **I2C+JSON** (Sensor→Navigation), **CAN Bus+Binary** (Navigation→Motor Control), and **MQTT+JSON** (Communication→Cloud) — internal real-time control vs. external cloud telemetry have different needs, so the ICD documents each interface's stack separately (source: m3-icd).
- **Tying error handling to the protocol.** Error/validation strategy is protocol-specific in the ICD: CRC checks on CAN Bus messages, retries on MQTT failures — the mechanism follows from the medium (lossy wireless → retries; framed bus → checksum) (source: m3-icd).

## Edge cases & gotchas

- **One IBD per block, always.** An IBD decomposes exactly one block from the BDD; there is no single IBD of the whole system — attempting one collapses the per-block decomposition the method depends on (source: m3-document).
- **Port-type ambiguity.** The same physical link can be modeled as a standard or a flow port depending on whether you treat it as an *interface interaction* or a *flow of data/energy* (e.g., the Communication Module's WiFi connection to the cloud). The lecture frames the WiFi Port as an interface (standard-port) connection — choose deliberately and justify, because the choice signals intent to integrators (source: m3-document).
- **Acceptance testing's dual role is mirrored in docs.** QA/Test teams rely on architecture for *traceability and functional/physical breakdown* — so the same FFBD/BDD must support both behavior description and requirements-coverage validation; a diagram drawn only for communication may not carry the traceability QA needs (source: m3-document; source: m3-review).
- **Update-frequency mismatch is silent.** The ICD pins each interface's rate (10 Hz / 100 Hz / 30 s). If a consumer assumes a different rate than the producer documents, nothing fails at compile time — it surfaces only at integration as dropped or stale data, which is why the frequency belongs in the written contract (source: m3-icd).
- **Constraints are assumptions until stated.** "Battery voltage 20V–25V", "Wi-Fi must be available", "≤10 ms sensor latency" are assumptions the whole design rests on; left out of §5 they become undocumented landmines (source: m3-icd).

## Performance, production & security considerations

- **Security via the living document.** A future requirement for *encrypted communication* is handled by updating the Communication Module block (BDD) and its interface clauses (ICD) — security requirements propagate through the documentation, they are not bolted on outside it (source: m3-document).
- **Production tooling for traceability.** For requirement-to-architecture traceability at scale, the material points to ReqView and DOORS; for the modeling itself, SysML environments (draw.io, Cameo) for scalability and collaboration (source: m3-document; source: m3-review). Tool details live in [07-requirements-management](../07-requirements-management/fundamentals.md) and [08-sysml-modeling](../08-sysml-modeling/fundamentals.md).

## Where to go deeper

- **m3-icd** — the full ADR ICD; study it as a template for the level of detail a production interface contract needs (formats, frequencies, constraints, version table).
- **[15-integration-strategies](../15-integration-strategies/fundamentals.md)** — the Boeing 787 case shows interface control documents adopted specifically to prevent supplier-integration miscommunication; the payoff of good ICDs in the field.
- **[08-sysml-modeling](../08-sysml-modeling/advanced.md)** — for the formal SysML grammar behind BDD/IBD and the other diagram types this topic only *uses*.
