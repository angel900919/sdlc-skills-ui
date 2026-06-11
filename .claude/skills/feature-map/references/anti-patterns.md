# Feature-map anti-patterns

Scan the assembled roster against this list before pasting it back (Phase 7) and before writing (Phase 8).

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| **Decomposing off discovery alone** | Features derived from the 3–5 v0.1 bullets while an understanding doc exists | Decompose off `behaviors`; frame with discovery scope. The journeys are the slices. |
| **Technical slicing** | Features named `api-layer`, `db-schema`, `auth-service` | Force user-outcome names. *"What can a user DO when this ships?"* |
| **Mega-feature** | One "feature" hiding 3+ journeys | Split — each independently-shippable journey is its own feature. → `NEEDS-DECOMPOSITION`. |
| **Frontend/backend split** | `X-frontend` + `X-backend` as two features | One vertical feature. Reject the split. |
| **Orphan feature** | A feature with an empty `satisfies` | Drop it, or surface a missing behavior to `/understand` (record under `orphans`). |
| **Entity gap** | A load-bearing context.md entity no feature touches | Surface it — either a missing feature or genuinely out of v0.1. |
| **Scope drift** | A feature not in discovery's scope, added silently | Push back: amend discovery or defer with a date. Record under `beyond_discovery`. |
| **All-P0** | Every feature P0 | Refuse. Force ≤4 and a real 1–N order. *"Ship only one this week — which?"* |
| **Undated "later"** | "We'll add it after the others" with no date or trigger | No revisit date → it's Never, not Deferred. |
| **Slug overload** | Two near-identical slugs (`invoice-1` / `invoice-2`) | Differentiate by user outcome (`invoice-create` / `invoice-send`). |
| **Tentative pretended certain** | No understanding doc, but roster written as locked | Mark `trace_status: tentative`; `satisfies` points at discovery capabilities; note it. |
| **Tier-cap ignored** | 12 features for a prototype | Push back: defer, split, or bump the tier. |
| **Diagram in the .ai file** | Mermaid block inside `.ai/features.md` | Machine artifacts hold structure. The diagram goes in `.human/summaries/features.md` only. |
| **Update mode = rewrite** | Replacing the whole file when the user said "add 2" | Touch only named rows. Preserve every other row, its `status`, and its `prd` link. |
| **Re-deciding scope** | Changing what's in/out here | Discovery's scope is authoritative. This skill decomposes; it doesn't override. |

## The discovery-vs-understanding discipline

The single most common failure is treating the two inputs as interchangeable. They are not:

- **understanding's `behaviors`** = the decomposition engine. Slice the journeys.
- **discovery's `scope`** = the envelope (in/deferred/never) and the P0 signal (what the JTBD/metric needs).
- **context.md entities** = naming + coverage check.

If you find yourself listing features straight off discovery's v0.1 bullets while an understanding doc sits unread, stop — you're producing labels, not traced vertical slices.
