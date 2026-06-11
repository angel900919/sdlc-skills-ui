# Library mapping + generated-file shape

Pick the ArchUnit-family library from `anchor.language` (Phase 2), then write each file with
the header + idiom below (Phase 6).

## Language → library → command → idiom

| `anchor.language` | Library | Default test command | Idiom |
| :-- | :-- | :-- | :-- |
| `typescript` | `tsarch` (preferred) or `archunit-ts` | `npx vitest run fitness/` | `filesOfProject().inFolder(...).shouldNot().dependOnFiles().inFolder(...)` |
| `python` | `pytest-arch` | `pytest fitness/` | `archrule("...").match(...).should_not().import_packages(...)` |
| `java` | ArchUnit | `mvn test -Dtest='Fitness*'` | `noClasses().that().resideInAPackage(...).should().dependOnClassesThat()...` |
| `go` | ArchGo (`github.com/fdaines/arch-go`) | `arch-go check` | YAML rules in `arch-go.yml` + Go test runner |
| `csharp` / `dotnet` | ArchUnit.NET | `dotnet test --filter Category=Fitness` | `Types.InAssembly(...).That().ResideInNamespace(...).ShouldNot()...` |

Prefer a runner anchor already names (`pytest`, `vitest`, `jest`, `gotestsum`); else use the
default. **Emit** the command to the user — never run it. If anchor names a CI workflow path,
suggest wiring the command there.

Unrecognized language → ask once (most languages have an ArchUnit clone). Genuinely none →
route all rules to `## Cannot mechanise` → `NEEDS-MECHANIZATION`.

- **tsarch** — https://github.com/ts-arch/ts-arch (Vitest/Jest compatible; preferred for TS)
- **pytest-arch** — https://pypi.org/project/pytest-arch/
- **ArchUnit** (Java) — https://www.archunit.org/
- **ArchUnit.NET** — https://github.com/TNG/ArchUnit.NET
- **ArchGo** — https://github.com/fdaines/arch-go (YAML rules + Go runner; output shape differs)

## File header (every generated file)

Source citation + FAILS-WHEN + the CODEOWNERS note are mandatory (SKILL rules 5–7):

```ts
// fitness/no-llm-in-api-handlers.ts
//
// Source: .ai/architecture/02-components.md L42
// Rule:   "AI calls must run in workflows/, never in src/api/."
// FAILS WHEN: any file under src/api/** imports from src/ai/**.
//
// CODEOWNERS: fitness/ is human-owned. Do NOT modify this file from an agent loop.

import { filesOfProject } from 'tsarch';
import { describe, it, expect } from 'vitest';

describe('Invariant: AI in workflows only', () => {
  it('no AI imports from API handlers', async () => {
    const rule = filesOfProject()
      .inFolder('src/api')
      .shouldNot()
      .dependOnFiles()
      .inFolder('src/ai');
    await expect(rule).toPassAsync();
  });
});
```

Python (`pytest-arch`):

```python
# fitness/no_llm_in_api_handlers.py
#
# Source: .ai/architecture/02-components.md L42
# Rule:   "AI calls must run in workflows/, never in src/api/."
# FAILS WHEN: any module under src/api/** imports from src/ai/**.
#
# CODEOWNERS: fitness/ is human-owned. Do NOT modify from an agent loop.

from pytest_arch import archrule

def test_no_llm_in_api_handlers():
    (archrule("no-llm-in-api-handlers")
        .match("src.api.*")
        .should_not().import_packages("src.ai.*")
        .because("AI work must run in durable workflows, not HTTP handlers."))
```

Numeric assertion (reads a CI/measurement artifact rather than the source tree):

```python
# fitness/invoice-send/p95-latency.py
#
# Source: .ai/specs/invoice-send/prd.md L68 (NFR-1)
# Rule:   "p95 ≤ 200 ms at 100 RPS (APM, 7-day rolling)."
# FAILS WHEN: the latest perf artifact reports p95 > 200 ms.
#
# CODEOWNERS: fitness/ is human-owned.

import json
def test_p95_under_200ms():
    report = json.load(open("artifacts/perf/invoice-send.json"))
    assert report["p95_ms"] <= 200, f'p95 {report["p95_ms"]}ms > 200ms'
```

## File-write rules
- **One file per rule**; intent-derived kebab name (SKILL rule 10), stable across runs.
- **Idempotent** (SKILL rule 9): citation unchanged → skip; changed → overwrite cleanly (no shim); source deleted → list as orphan, never auto-delete.
- **No per-file line cap** — ArchUnit tests are short; a long one is usually two rules sharing a file → split.

## CODEOWNERS

Look for `CODEOWNERS` at repo root, `.github/`, or `docs/` (in that order). Covered already →
skip. Found, not covered → append `fitness/ @<team>`. Missing → create at repo root with the
entry + a one-line why. Team from `anchor` (`team:`/`owner:`); absent → `fitness/ @<TODO-set-team>`
and warn in the verdict that the placeholder must be replaced.
