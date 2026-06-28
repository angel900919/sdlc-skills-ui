# Architecture Frameworks: TOGAF, Zachman, NIST — Advanced concepts

Terse, for someone who already holds the schema. No re-teaching of the ADM/matrix/layers.

## Advanced concepts

- **TOGAF beyond the ADM.** The ADM is only one of TOGAF's five core components. The others give it depth: the **Enterprise Continuum** categorizes architectural assets (industry standards, templates); the **Architecture Content Framework** defines *which* artifacts to produce; **TOGAF Reference Models** ship predefined patterns — specifically the **TRM** (Technical Reference Model) and **III-RM** (Integrated Information Infrastructure Reference Model); the **Capability Framework** guides roles, skills, and tools (source: m3-togaf). Knowing the ADM without these is knowing the verb without the nouns.
- **The four architecture domains the ADM develops iteratively.** Business, Application, Data, Technology — developed *iteratively across the nine phases* to produce a balanced architecture, not one-per-phase (source: master-notes §Architectural Frameworks). Phase C alone covers two domains (Data + Application).
- **Zachman cells are *primitive* models.** Each of the 36 cells is a single-aspect, single-perspective model; they are all related but each represents a unique concept of the same enterprise. A full row = one stakeholder's complete view; a full column = one question answered at every abstraction level (source: master-notes §Architectural Frameworks; m3-zachman). The framework's power is exhaustiveness, not workflow.
- **NIST's lineage.** SP 500-167 introduced the model and it "heavily influenced" FEAF (source: m3-nist) — i.e. NIST is upstream of the U.S. federal EA tradition. The course frames it as an early/foundational reference rather than a currently-prescribed method (source: master-notes §Architectural Frameworks: "While NIST is an older framework, it laid the foundation...").

## Edge cases & gotchas

- **Requirements Management is not phase #10.** The ADM count is exactly 9 (Preliminary, A–H); Requirements Management is the central, all-phase process (source: m3-togaf). Any "10-phase ADM" framing is wrong.
- **Data appears in two places with different meanings.** TOGAF puts Data *inside* Phase C (with Application) as a process step (source: m3-togaf); NIST makes Data its own *layer*, separate from Information Systems Architecture (source: m3-nist). Don't equate them.
- **Designer vs Builder in Zachman** is the logical/physical split — Designer holds logical data models and system architecture; Builder holds physical data models, software design, and system topology (source: m3-zachman). Placing physical tables under Designer (or logical entities under Builder) is the classic cell error.
- **Architecture Vision (A) vs Business Architecture (B)** — the source explicitly flags this as a confusion point: A = buy-in + aligning the effort with business goals (what/why); B = translating that into how the business works and what functions must be enabled (source: m3-ex-togaf).
- **NIST layer coupling is bidirectional.** Layers are "independent but interconnected" — a change at one can force changes at others in either direction (source: m3-nist). Treating the stack as a strict top-down cascade misses upward ripples.

## Performance, production & security considerations

The frameworks themselves are method/taxonomy/model definitions; the source treats *performance, production, and security* as *outputs of applying* a framework rather than properties of the framework. In the banking ADM application this surfaces concretely (source: m3-applytogaf):

- **Performance/scalability** are set as Preliminary-phase principles (< 2 s transactions, 99.99% uptime) and realized in Phase D (caching with Redis, AWS auto-scaling/Kubernetes) and Phase H (analytics, A/B testing).
- **Security** spans phases: principles (ISO 27001, PCI DSS) in Preliminary; measures (AES-256, TLS 1.3, MFA, AI fraud detection, OAuth2, Zero Trust) in Phase D; compliance enforcement (PCI DSS, ISO 27001, GDPR) + automated security scans in Phase G.

For the trade-off *analysis* behind these choices (performance vs cost vs scalability), see [12-design-tradeoffs](../12-design-tradeoffs/README.md); for ranking design options surfaced in Phase E, see [13-decision-matrix](../13-decision-matrix/README.md).

## Where to go deeper

- **TOGAF Reference Models — TRM and III-RM** (source: m3-togaf): the predefined patterns behind the "Reference Models" component — worth studying if you'll reuse architectural assets via the Enterprise Continuum.
- **NIST Special Publication 500-167** (source: m3-nist): the originating document; read it to understand the five-layer model's intent and its influence on FEAF.
- **The standards an architectural framework integrates** — ISO/IEC 42010 (architecture descriptions) and IEEE 1471 (architectural viewpoints) — are noted in the general framework material (source: master-notes §Architectural Frameworks); see [10-design-architecture-fundamentals](../10-design-architecture-fundamentals/advanced.md).
