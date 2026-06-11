# Design anti-patterns — scan before writing

Scan the assembled draft against this list in Phase 9; strip any symptom before reading back. Each is a rejection-class smell with the fix.

## Boundary violations (re-deciding what design inherits)

- **Re-picking the stack** — naming a different language/framework/db than `anchor.md`. Fix: inherit from anchor; if the feature truly needs a different runtime, that's `BLOCKED-ON-ANCHOR`, not a design call.
- **Re-architecting** — inventing a new component, changing the style, or adding a cross-component contract architecture doesn't define. Fix: trace to an existing `02-components.md` component; if none fits → `NEEDS-ARCHITECTURE-UPDATE`. Don't invent a component.
- **Recomputing the tier** — re-scanning for uplift signals or "bumping" the tier. Fix: inherit the PRD's `tier:` verbatim. Tier disputes go upstream (`/prd` re-run or `/promote`).
- **Re-litigating scope** — adding capabilities the PRD excluded. Fix: design the PRD's in-scope set; surface scope gaps as a PRD follow-up.

## The orphan feature

- **Designing without a placement** — modules with no `maps_to_component`. Fix: Phase 2 is the gate — refuse the orphan, route to `/architect`. Slow architectural decay starts here.
- **Forcing a bad fit** — jamming the feature into a component whose role doesn't cover it, just to avoid the refusal. Fix: if the fit needs `and`/`also` to justify, it's an orphan — surface it honestly.

## Module smells

- **Entity-Trap names** — `DiscountManager`, `OrderService`, `PaymentHandler`, `DataProcessor`. Fix: verb-noun, single responsibility ([`../../architect/references/naming.md`](../../architect/references/naming.md)).
- **The `and`/`also` role** — "validates the code *and* writes the order *and* emails the receipt". Fix: that's three modules — split.
- **The 800-LoC module** — a single module estimated over ~500 LoC. Fix: split; it's hiding multiple responsibilities.
- **Non-additive decomposition** — re-listing the whole component instead of only what's new/modified. Fix: additive — NEW or MODIFIED for this feature only.

## Contract smells

- **Happy-path-only API** — a contract with a 200 and no 4xx/5xx. Fix: one row per error case ([api-contracts.md](api-contracts.md)); that's where bugs hide.
- **The migration with no rollback** — a forward schema change and no `DROP`/down migration. Fix: never write a migration without a rollback + backfill plan.
- **"Add a column"** — a schema delta with no type, default, migration file name, or rollback. Fix: the full delta or nothing.
- **Missing idempotency** — a state-changing endpoint with no dedupe story (mvp+). Fix: name the `Idempotency-Key` + dedupe window.
- **Prose contracts** — API/schema written as paragraphs. Fix: tables/YAML only in `.ai/`.

## Flow & resilience smells

- **"What if X is down?" left unanswered** — a hop to an external boundary with no failure mode (mvp+). Fix: name what breaks · detection · response (retry/circuit/fallback/dead-letter) · user-visible effect.
- **Diagram in `.ai/`** — a Mermaid block in the machine file. Fix: the call flow is a step list in `.ai/`; the `sequenceDiagram` is the `.human` render ([sequence-diagram.md](sequence-diagram.md)).
- **Observability as an afterthought** — no `trace_id`, no metrics, no PII redaction rule (mvp+). Fix: telemetry is a design-time decision.
- **Unsupported characteristic claim (production)** — a `Characteristics honored:` line from PRD Notes with no design element backing it. Fix: extend the design or drop the claim — the write blocks otherwise.

## Dependency smells

- **The silent `npm install`** — a new package not declared in the External dependencies table / `dep_adds[]`. Fix: name it exactly, trust-judge it.
- **The slopsquatting fingerprint** — new + low-adoption + name-adjacent + thin provenance. Fix: REFUSE until proven real; substitute an allowlist entry ([deps-governance.md](deps-governance.md)).
- **Vague package names** — "the Stripe SDK", "an HTTP client". Fix: `stripe (npm)`, `httpx (pypi)` — exact name + ecosystem.
- **Growing the allowlist silently** — adding to `approved_dependencies` from inside design. Fix: flag `dep_adds[]`; anchor adopts.

## AI-rigor smells

- **AI rigor dropped** — an `ai_in_core_path` feature whose design has no prompt/eval/model design and ignores the PRD's AI card. Fix: the ai-llm checklist is mandatory ([surfaces.md](surfaces.md)).
- **Judge == drafter (production)** — the eval judge model is the same model that drafts. Fix: they must differ (per `anchor.md`).

## Doc smells

- **Code in the design** — implementation bodies, not interfaces/contracts. Fix: modules/interfaces/schemas yes, code no (except trimmed, tested prototype snippets tagged `(from prototype)`).
- **Over the line cap** — past 90/185/250. Fix: the feature is two features — split.
- **Invented prototype snippets** — "from prototype" code that no spike produced. Fix: only inline real, tested snippets.
- **Hand-authored `.human` mirror** — narrative typed by hand instead of rendered from the `.ai` call flow. Fix: derive it; `.ai` wins on any disagreement.
