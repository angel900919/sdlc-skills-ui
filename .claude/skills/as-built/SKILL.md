---
name: as-built
description: |-
  Read-only, post-build, per-feature as-built code map. After a feature's slices merge, compiles the per-slice file manifests plus the code at HEAD into a structured .ai/specs as-built record and a .human mirror with two validated Mermaid diagrams — a module/import map and the main entry-point flow — plus a drift table comparing the real call chain against design.md's planned sequence diagram. Origin-agnostic (greenfield and brownfield features built through the loop; op modify marks changed files); commit-pinned, timestamped, idempotent; never modifies code or specs. Use when the user says "/as-built", "/codemap", "code map for X", "did the code drift", or after a feature's last slice merges. Do NOT use for: untouched shipped features with no slices (that is /explore's component map), design-time C4/HLD (/architect), planned sequence diagrams (/design), progress reporting (/status), or test verification (/qa).
---

# As-built — feature code map

Reverse-engineers what the code **actually is now** for one feature, from the real source at HEAD — not what `design.md` *intended*. Reads the per-slice `files:` manifests to learn the feature's file set, reads that code, and writes a structured `.ai/specs/<feature>/as-built.md` (module table, import-edge list, main-flow step list, drift table) plus a `.human/specs/<feature>/as-built.md` mirror carrying the two **validated Mermaid diagrams**.

Cross-cutting, like `/status` — it runs at the feature boundary (after the last slice merges) and can be sub-invoked by `/qa`. **Origin-agnostic:** it maps any feature built **through the loop** — greenfield or a brownfield modification (the `op: modify` tag flags changed files). It does **not** map an untouched shipped feature (no manifest to scope from — that's `/explore`).

<what-to-do>

Read [`../_shared/conventions.md`](../_shared/conventions.md) (folder model, tracker, advisory gate) and [`../_shared/ai-schema.md`](../_shared/ai-schema.md) (the `.ai/specs/<feature>/as-built.md` schema) before writing.

## Critical rules (read before starting)

1. **READ-ONLY on code and specs.** Writes exactly two files — `.ai/specs/<feature>/as-built.md` and `.human/specs/<feature>/as-built.md` — plus one `.ai/progress-tracker.md` append. Never edits source, slice frontmatter, `design.md`, `features.md`, or any other artifact. Asked to "fix the drift" → refuse and route: code drift → `/diagnose` or a new slice via `/to-issues`; intended-design change → re-open `/design`.
2. **The slice manifest is the source of truth for scope.** The file set is the **union of `files:` paths** across every `.ai/specs/<feature>/issues/SLICE-*.md` whose `status` is not `removed`. **Never crawl the repo** and never guess which files belong to the feature. Files outside this set appear only as *referenced* boundary nodes (rule 4). (This is why an untouched shipped feature — no manifest — is `NOT-LOOP-BUILT`, not a crawl.)
3. **Diagram only what the code verifies — never invent an edge.** Every edge must trace to a real `import` / `from … import` / `require` / `using` / package import in a manifest file (grammar in [references/diagramming.md](references/diagramming.md)). Can't confirm an edge → omit it and list it under `## Notes & omissions`. No hallucinated calls.
4. **One flow, one entry point.** Trace the feature's **single main entry-point flow** (the public surface the tracer-bullet Slice 1 threads). Never a whole-codebase, function-by-function trace.
5. **As-built ≠ as-designed.** Report what the code does at HEAD. The **drift table is the only place** the two meet — surface divergence between the real call chain and `design.md`'s `sequenceDiagram`; never "reconcile" by editing either side.
6. **Diagrams live in `.human/` only, via the mermaid skill.** `.ai/specs/<feature>/as-built.md` carries the **structured** view — module table, import-edge list, main-flow **step list**, drift table — and **no Mermaid** (same discipline as `/design`: step list in `.ai`, `sequenceDiagram` in `.human`). The two diagrams (module block diagram + main-flow flowchart) go in `.human/specs/<feature>/as-built.md`, each generated through the **mermaid skill** so it's validated. House style: **solid = sync, dotted = async** (matches `/architect`).
7. **Honest snapshot.** Pin the commit SHA + branch + date in both files (`git rev-parse --short HEAD` / `--abbrev-ref HEAD`; read-only on local state, never `git fetch`). It's a point-in-time map; re-running overwrites.
8. **No verdicts about the feature.** Don't say "ready to ship" or "well built" — that's `/qa` + human judgment. Report structure + drift only.
9. **Origin-agnostic, but loop-fed.** Maps features built through the loop (greenfield + brownfield modifications). A `features.md` row that is `status: shipped` with **no slices** never went through the loop → `NOT-LOOP-BUILT → /explore` (don't crawl; `/explore`'s component map is the as-is view of untouched code).

## Procedure

```
as-built progress:
- [ ] Phase 0: Validate arg + preconditions (anchor, features.md row, issues dir); shipped-no-slices → NOT-LOOP-BUILT
- [ ] Phase 1: Build file manifest from SLICE-*.md (non-removed); confirm files exist at HEAD; pin commit
- [ ] Phase 2: Extract imports → module table + import-edge list (per anchor.language grammar)
- [ ] Phase 3: Derive the entry point; trace the main flow → ordered step list
- [ ] Phase 4: Diff the as-built flow vs design.md sequenceDiagram → drift table
- [ ] Phase 5: Write .ai structured + .human diagrams (mermaid skill) + tracker append; verdict
```

### Phase 0 — Validate arg + preconditions
- **Arg required.** `/as-built <feature>` is the only mode. No feature → list features with an issues dir holding non-removed slices and ask which — `NEEDS-FEATURE-ARG → <list>`. Stop.
- `.ai/anchor.md` must exist (need `language:` for import grammar) → else `BLOCKED-ON-ANCHOR → /anchor`.
- `.ai/features.md` must exist → else `BLOCKED-ON-FEATURES` → `/feature-map` (greenfield) or `/feature-census` (brownfield), per `project_type`.
- `<feature>` must be a row in `features.md` → else `BLOCKED-ON-FEATURE`.
- **Slice check (disambiguates the empty cases):**
  - row `status: shipped` **and** no `issues/SLICE-*.md` → `NOT-LOOP-BUILT → /explore` (untouched existing code — never went through the loop; `/explore`'s component map is the as-is view).
  - row `planned`/`building` **and** no `issues/SLICE-*.md` → `BLOCKED-ON-ISSUES → /to-issues <feature>`.
- Read `.ai/progress-tracker.md` top 5; if no merge activity for the feature, **warn but proceed** (operator may be mapping WIP; the pinned timestamp makes the basis explicit).

### Phase 1 — Build the file manifest
Read every non-removed `.ai/specs/<feature>/issues/SLICE-*.md`; collect each `files:` entry's `path` + `op`. Union the paths (strongest op wins: `new` > `modify`). **Confirm each exists at HEAD**; drop missing ones (record under `## Notes & omissions` as "planned but not present"). **Zero** manifest files present on disk → `NO-CODE-YET → /build <feature>`. Pin `git rev-parse --short HEAD` + branch.

### Phase 2 — Module table + import-edge list
For each manifest file, extract imports using the grammar for `anchor.language` ([references/diagramming.md](references/diagramming.md)). Produce (structured, for `.ai`):
- **Module table:** module · ≤6-word role · `new`/`modified` · imports→.
- **Import-edge list:** `A → B  (sync|async)  — path:line`. Keep only project-internal edges; external/stdlib excluded (note once). A target not in the manifest = a boundary node (`External / unchanged`). Async only on concrete evidence (rule per diagramming.md); default sync.

### Phase 3 — Main flow → step list
Derive the entry point: first hop of `design.md`'s `sequenceDiagram`, else the public surface of the lowest-numbered slice (the tracer bullet). Trace the call chain **through manifest files only**, stopping at boundary nodes. Write it as an **ordered step list** in `.ai` (one step per hop, branches noted as `if …`) — not a diagram. The flowchart is built from this in Phase 5 for `.human`.

### Phase 4 — Drift table (as-built vs design.md)
If `design.md` is absent or has no `sequenceDiagram` (e.g. prototype) → drift section is `N/A — no design sequence diagram`, `N = 0`. Else parse the `sequenceDiagram` into ordered intended hops and compare to the Phase-3 chain, classifying each: `match` · `rename` (same role, concrete name differs — **not** drift) · `extra` · `missing` · `reordered`. `N` = `extra` + `missing` + `reordered`. Method + the role-vs-name normalization: [references/diagramming.md](references/diagramming.md).

### Phase 5 — Write the artifacts + verdict
1. **`.ai/specs/<feature>/as-built.md`** — structured per [`../_shared/ai-schema.md`](../_shared/ai-schema.md): pinned frontmatter (commit, branch, date, module_count, entry_point, drift_count, verdict) + `## Module map` (table) + `## Import edges` (list) + `## Main flow — <entry>` (step list) + `## Drift vs design` (table or N/A) + `## Notes & omissions`. **No Mermaid.** Overwrite on re-run.
2. **`.human/specs/<feature>/as-built.md`** — plain-English walkthrough (entry point, happy path, new-vs-modified summary, drift in one line) + **two validated diagrams via the mermaid skill**: a module/import **block diagram** (skeleton in [references/diagramming.md](references/diagramming.md); `new` plain, `modified *`, `External / unchanged` subgraph) and the main-flow **flowchart** (from the Phase-3 step list; decision diamonds only for real code branches). Pin the same commit/branch/date. Link back to the `.ai` record.
3. Append one `.ai/progress-tracker.md` entry (per [`../_shared/conventions.md`](../_shared/conventions.md)). Within-session same-day re-run → update that entry, don't duplicate.

Verdict (advisory; no spine token — as-built is cross-cutting):
- **`AS-BUILT-WRITTEN → .ai/specs/<feature>/as-built.md`** — `N == 0` or drift N/A.
- **`AS-BUILT-WRITTEN-WITH-DRIFT → .ai/specs/<feature>/as-built.md (N divergences)`** — surface the rows; route review (drift → `/diagnose` or a new slice; intended change → `/design`).
- **`NOT-LOOP-BUILT → /explore`** · **`NO-CODE-YET → /build`** · **`NEEDS-FEATURE-ARG`** · **`BLOCKED-ON-ISSUES → /to-issues`** · **`BLOCKED-ON-FEATURE`** · **`BLOCKED-ON-FEATURES`** · **`BLOCKED-ON-ANCHOR → /anchor`** (per Phase 0).

</what-to-do>

<supporting-info>

## Output artifacts
- **`.ai/specs/<feature>/as-built.md`** — MACHINE-facing, structured, **no diagrams**: module table, import-edge list, main-flow step list, drift table, commit-pinned. The source of truth `/qa` can read for the drift count. Schema in [`../_shared/ai-schema.md`](../_shared/ai-schema.md).
- **`.human/specs/<feature>/as-built.md`** — HUMAN-facing: the two validated Mermaid diagrams (module map + main flow) via the mermaid skill, plus a plain-English walkthrough and the rendered drift table. Diagrams live here only.

Skeletons, per-language import grammar, entry-point derivation, the drift-diff method: [references/diagramming.md](references/diagramming.md). The `.ai` record skeleton: [references/template.md](references/template.md).

</supporting-info>
