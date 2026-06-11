# Architect question bank

Use when stuck. Pull only questions whose tier marker covers the inherited tier. **One question at a time. Propose a recommended answer. Adapt to `technical_user`** — for a non-technical user, pick the recommended default, mark it, and confirm the *outcome* in plain words rather than asking the technical question.

Markers: `[P]` prototype · `[M]` mvp · `[Pr]` production · (always) = every tier.

## Phase 0–1 — mode + inputs (always)
1. (Update mode) Architecture exists — what's changing: style, components, ADRs, diagrams, characteristics?
2. Announce: *"Tier from anchor is X. Running X-tier architect: <one-line scope>. Proceed?"*

## Phase 2 — characteristics `[Pr]` full · `[M]` light
3. From the JTBD, what business concerns surface? (Translate via Table 5-1: "ship fast" → deployability; "always available" → availability; "data must be private" → security + privacy.)
4. From understanding's invariants, what architectural characteristic is implied? (e.g. "PII never leaves Postgres" → security/data-isolation as structure.)
5. Which always-on characteristics matter — availability, data integrity, security?
6. List candidates → force **top-3**: *"If you could only protect 3, which?"*
7. For each top-3, propose a fitness function (complexity threshold, ArchUnit layered check, p95 probe, deploy-frequency tracker).

## Phase 3 — style `[P][M][Pr]`
8. **Monolith vs distributed?** Recommend monolith unless ≥2 teams / ≥2 deploy cadences / scale asymmetry. (Solo → monolith, always.)
9. **Where does data live?** Recommend single shared DB at prototype; DB-per-context only on language drift (→ `/ddd-strategy`).
10. **Sync vs async?** Default sync; async only for background work, multiple consumers, or when the user shouldn't wait.
11. Propose the style: *"Recommending **modular monolith** — solo dev, 4 features, no scale concern at mvp."* Then write the style ADR.

## Phase 4 — components `[P][M][Pr]`
12. Approach — workflow (from journeys) or actor×action? Recommend workflow if understanding has journeys.
13. Name candidates **verb-noun**; reject the [Entity Trap](naming.md). Rescue probe: *"What does this component DO — place orders? cancel? fulfill?"* One job → rename; many → split.
14. Role/responsibility per component — one present-tense sentence, no `and`/`also` (split if present).
15. Dependency edges — for each, who calls it (afferent) / what it calls (efferent), each sync or async.
16. Feature trace — every feature in `features.md` maps to ≥1 component. Orphan → add a component or loop back to `/feature-map`.
- `[M][Pr]` API governance (SKILL rule 15) — when a component is API-bearing, propose one default per convention and confirm: *"Recommending one error envelope `{ error, message, trace_id }`, cursor pagination, `Authorization: Bearer`, kebab-case plural paths, URI `/v1/…` versioning — keep, or change which?"* Brownfield: propose the dominant convention already in the code (cite `file:line`), never a conflicting one.

## Phase 5 — ADRs `[P][M][Pr]`
17. Significance filter — does the decision affect structure / NFR / dependency / interface / construction? If none → skip.
18. Count: prototype 0–1 (inline) · mvp 3–5 · production 3–7. Allocate from the shared NNNN counter.
19. Context must list alternatives — no alternatives, no ADR. Voice: commanding "We will…".
20. Compliance — how will we know it's followed? (ArchUnit test, CI lint, review point.)

## Phase 6 — risk storming `[Pr]`
21. One characteristic per pass from the top-3.
22. List threatening risks; score 1–9 (impact × likelihood). **Unknown-tech auto-9.**
23. Every ≥6 risk → mitigation OR explicit acceptance with a named owner.

## Probing follow-ups (when an answer is vague)
- *"What does this component DO, not what it IS?"* (Entity Trap)
- *"Could this ship as a separate deployment? If no, it's one component, not two."*
- *"What would make us cut this characteristic from the top-3?"*
- *"Was there a real alternative? If no, it's not an ADR."*
- *"Can a reader tell which edges are sync vs async?"*

## Questions to refuse (belong elsewhere)
- "What's the JTBD?" → `/discovery` · "What does term X mean?" → `/understand` · "What features?" → `/feature-map` · "What stack/tier?" → `/anchor` · "Bump the tier?" → `/promote` · "How do I implement this feature?" → `/design` · "Per-feature scope?" → `/prd` · "Design DDD bounded contexts?" → `/ddd-strategy`.
