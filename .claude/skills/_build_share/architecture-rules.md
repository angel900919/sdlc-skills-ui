# Architecture Rules — Write-Time Imperatives

Distilled from *Clean Architecture* (Part III, chapters 23–27): TWO_VALUES, INDEPENDENCE, BOUNDARIES, CLEAN_BOUNDARIES, DEPENDENCY_RULE. These are write-time rules — apply as you design the slice.

Load this pack when the slice introduces a new module boundary, integrates a third-party SDK, splits / merges components, or makes a deferrable technology decision. Single-file edits and pure UI work usually don't need this pack.

## Always (every architectural slice)

1. **Source-code dependencies point inward.** Inner ring (entities, use cases) never imports outer ring (frameworks, drivers, DB).
2. **Control flow can cross outward via interfaces owned by the inner side.** This is the Dependency-Inversion escape hatch — use it when a use case needs to call out to infrastructure.
3. **No outer type crosses inward.** No DB row, no wire-format struct, no framework type passed into a use case. Map at the boundary.
4. **One architectural vocabulary per project.** Pick Clean / Hexagonal / BCE / DCI and stick to it. Don't mix terms in the same project.

## Soft vs. Hardened decisions (TWO_VALUES)

Up-front, list every technology decision the design will touch. Mark each:

- **Soft** — defer behind an interface owned by the policy side. The interface is named in domain vocabulary, not the vendor's.
- **Hardened** — committing now. Write one line of justification AND the reversal cost.

If a decision could be Soft but you Harden it without justification, you're trading future flexibility for present convenience — name the trade so the reviewer can challenge it.

## Boundaries (BOUNDARIES + CLEAN_BOUNDARIES)

Draw a boundary **only where volatility differs**. Three signals:

- The two sides change for different reasons.
- The two sides change at different rates.
- The two sides are owned by different teams.

If none of these are true, you don't need a boundary — let the code live together. Boundaries cost; they need a justification.

For each boundary you draw:

- **The higher-level side owns the interface.** The lower side implements.
- **The lower side should be replaceable by an in-memory stub** for dev / test.
- **For third-party SDKs:** write the wrapper interface in **your application's vocabulary first** (as if the SDK didn't exist). Centralize SDK imports behind that wrapper. Plan learning tests on first contact and boundary tests against the wrapper.

## Independence (INDEPENDENCE)

- **Name the use cases explicitly** before drafting any API surface. "GET /orders" is not a use case — "Place an order" is.
- **State the load profile.** Throughput, latency, availability. Pick the smallest execution model that meets it (single process → multi-process → services → distributed). Slide toward the next position only when load demands it.
- **One component per team.** Cross-team commits to the same component invite merge pain and unclear ownership.

## Anti-patterns (refuse on these)

- A use case imports the DB driver / HTTP framework / message broker directly.
- An entity field's type is `Stripe.Charge` or `Date` (use a domain type; map at the boundary).
- A wrapper interface mirrors the SDK 1:1 — that's not a wrapper, that's a re-export with extra steps.
- A boundary exists only because "we might want to swap X someday." Boundaries cost — they need a volatility justification.
- A component owned by two teams, or one team owning three components that change together.
- Mixing two architectural styles (e.g., Hexagonal ports + a separate Clean entities ring) without a single source-of-truth diagram.

## Briefing shape

When you brief yourself before the slice, use this shape:

```
### Soft decisions
- <decision> — defer behind `<interface>` owned by `<module>`. Reason: <volatility>.

### Hardened decisions
- <decision> — chosen because <rationale>. Reversal cost: <one sentence>.

### Boundaries this slice draws or crosses
- <component A> → <component B>: <direction>. Inversion needed? <yes/no — interface name if yes>.

### Third-party wrappers (if any)
- <vendor> — wrapper interface `<DomainShapedName>` in `<package>`. Learning tests: <yes/no>.
```

If the slice doesn't touch any of these (pure UI tweak, internal refactor, doc change), say so in one line and skip this pack entirely.
