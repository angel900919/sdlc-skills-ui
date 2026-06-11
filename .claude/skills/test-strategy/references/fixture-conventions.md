# Fixture & factory conventions — decision menu

Consulted by Phase 4. One recommendation per question, not a buffet: propose the stack idiom
(or the recovered brownfield convention), let the user confirm or redirect.

## Factory vs fixture — the decision

| Pick | When | Smell it prevents |
| :-- | :-- | :-- |
| **Factory** (function/class builds a fresh entity per call, overridable fields) | Entities have many states/variants; tests need *one* customized field; relational graphs | the 400-line shared fixture nobody dares edit |
| **Fixture** (named, pre-baked data loaded per test/suite) | Few entities, few states; read-heavy tests; the framework's fixture system is idiomatic (pytest) | factory sprawl for data that never varies |
| **Hybrid** (factories build; a thin fixture layer wires framework lifecycle — db session, app instance) | Most real mvp+ projects | framework lifecycle leaking into every factory |

Default recommendation: **hybrid** at mvp+, single fixture convention at prototype.

## Library menu (governed — reuse-first)

Infer the ecosystem from `anchor.language`/framework. **Check `anchor.approved_dependencies`
and the lockfile first** — the framework built-in is often enough and needs no `dep_adds`.
Any `new` row gets the [`deps-governance`](../../design/references/deps-governance.md)
trust judgment and a `dep_adds[]` entry.

| Ecosystem | Built-in (prefer) | Factory libs | Fake-data |
| :-- | :-- | :-- | :-- |
| TypeScript/JS (vitest, jest) | plain factory functions | fishery, @factory-js/factory | @faker-js/faker |
| Python (pytest) | pytest fixtures + plain functions | factory_boy (+ pytest-factoryboy) | Faker |
| Ruby (rspec) | — | factory_bot | faker |
| Go | table-driven structs + builder funcs | (usually none — prefer hand-rolled builders) | gofakeit |
| Java/Kotlin | @TestFactory / object mothers | Instancio, EasyRandom | datafaker |
| .NET | object mothers | Bogus, AutoFixture | Bogus |

Rules of thumb:
- **One library for the whole suite.** Two factory libraries in one repo is the gap this skill exists to close.
- **Deterministic by default** — seed the faker (one global seed constant, named in the artifact) so red-first failures reproduce.
- **No network, no clock** in factories — time and randomness are injected, not ambient.

## Naming + location conventions (pick one per project)

- Location: one canonical folder (`tests/factories/`, `tests/fixtures/`, or co-located `__factories__/`) — never both.
- Naming: one scheme — `<entity>_factory.py` / `make<Entity>()` / `<Entity>Factory` — applied to every entity.
- Imports: tests import factories from the canonical folder only; a test file defining its own inline entity builder is the anti-pattern downstream reviews reject.

## The canonical entity-acquisition pattern

The heart of the artifact: **one row per entity in `.ai/context.md`**, and one acquisition
path per row. Shape of a good row:

| entity | acquire via | location | overrides |
| :-- | :-- | :-- | :-- |
| Registration | `make_registration(**overrides)` | tests/factories/registration.py | kwargs; `run=` accepts a Run instance or defaults to `make_run()` |

Rules:
- **Relations recurse through factories** — a factory needing a parent entity calls *that entity's* factory, never inserts raw rows.
- **Valid by default** — a no-arg call returns an entity satisfying the invariants in `context.md`; invalid variants are explicit overrides (`make_registration(status="cancelled")`), never the default.
- **Entity states map to overrides/traits**, named after the `states:` list in `context.md` — keep domain language, not column values.
- An entity in `context.md` with no row here is a recorded gap (Notes), not an improvisation downstream.
