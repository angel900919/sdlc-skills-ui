# Template — `.ai/specs/<feature>/as-built.md` (structured, no diagrams)

The MACHINE-facing as-built record. **No Mermaid** — the diagrams live in the `.human` mirror (built from this via the mermaid skill). Commit-pinned, overwritten on each run.

````markdown
---
slug: <project-slug>
feature: <feature-slug>
stage: as-built
status: complete
commit: <short-sha>
branch: <branch>
basis: HEAD | WIP            # WIP = mapped before the last slice merged (warn in body)
module_count: <N>
entry_point: <route / command / handler>
drift_count: <N>            # extra + missing + reordered (0 if no design sequence)
verdict: AS-BUILT-WRITTEN | AS-BUILT-WRITTEN-WITH-DRIFT
source_issues: .ai/specs/<feature>/issues/
source_design: .ai/specs/<feature>/design.md   # or: none
human_summary: .human/specs/<feature>/as-built.md
created: YYYY-MM-DD
---

# As-built — <feature>  ·  @ <short-sha> (<branch>)  ·  <YYYY-MM-DD>

<!-- If basis: WIP, say so here: "Mapped before final merge — point-in-time snapshot." -->

## Module map
<!-- One row per manifest file. `modified` files get a trailing * in the diagram; here just the flag. -->

| module | role (≤6 words) | new/modified | imports → |
| :-- | :-- | :-- | :-- |
| <module> | <role> | new | <module>, <module> |
| <module> | <role> | modified | <module> |

## Import edges
<!-- Project-internal only. External/stdlib excluded (noted below). sync default; async only on concrete evidence. -->
- `<module A>` → `<module B>`  (sync)  — `path:line`
- `<module A>` ⇢ `<EventBus>`  (async)  — `path:line`
- Boundary (External / unchanged): `<Port/adapter not in manifest>` — `path:line`

## Main flow — <entry point>
<!-- Ordered step list of the single main entry-point flow. Branches as `if …`. The .human flowchart is built from this. -->
1. `<entry: route/command>` → `<first hop>`
2. `<hop>` — `path:line`
3. if `<condition>` → `<branch outcome>` (else `<other>`)
4. `<terminal: boundary port / response>`

## Drift vs design
<!-- N/A if design.md has no sequenceDiagram (prototype/absent). Else one row per hop. rename ≠ drift. -->

| # | Design hop | As-built hop | Match? | Note |
| :-- | :-- | :-- | :-- | :-- |
| 1 | <A ->> B: msg> | <a → b> | match | — |
| 2 | <C ->> D: msg> | — | missing | design hop absent in code |
| 3 | — | <e → f> | extra | code hop with no design counterpart |

**N = <count of extra + missing + reordered>.**  (`rename`-only rows are not drift.)

## Notes & omissions
- External deps excluded: `<e.g. stdlib, framework — excluded by rule>`.
- Planned-but-not-present files: `<path — in a slice manifest but absent at HEAD>` / none.
- Unconfirmable edges omitted: `<path:line — couldn't resolve>` / none.
- Second entry point (if any), not diagrammed: `<note>` / none.
````

## Notes
- **Diagrams are NOT in this file.** The module block diagram + main-flow flowchart go in `.human/specs/<feature>/as-built.md`, generated via the mermaid skill from the Module map / Import edges / Main flow above.
- **Idempotent:** overwrite on each run; the pinned `commit`/`branch`/`created` make the basis explicit.
- **Scope = the slice manifest, never a repo crawl.** A feature with no slices is `NOT-LOOP-BUILT` (shipped) or `BLOCKED-ON-ISSUES` (planned) — this skill does not infer a file set.
