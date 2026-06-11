---
name: mermaid
description: Generates and validates Mermaid diagrams (flowchart, sequence, state, ER, class, journey, mindmap, gantt, C4) so broken syntax never ships into a document. Validates every diagram before returning it, using the local mmdc CLI, a hosted renderer, or an offline lint. Use when the user asks for a diagram, chart, flowchart, sequence diagram, ER/entity diagram, state machine, or mind map, mentions Mermaid, or when another skill needs a validated Mermaid block for a human-facing artifact. Do NOT use for image editing, hand-drawn art, or non-Mermaid chart libraries.
---

# Mermaid

Produce **valid** Mermaid diagrams. The core promise: no diagram leaves this skill without passing a syntax check, because a broken ```mermaid block silently fails to render in the reader's viewer.

## Critical rules

<critical>
1. **Validate before you return.** Every diagram you generate or edit MUST pass `scripts/validate_mermaid.py` before you present it or write it to a file. No exceptions.
2. **On failure, fix and re-validate.** Read the parse error (it gives a line number and what was expected), correct the source, run the validator again. Loop until it passes. Never hand back a diagram you could not validate.
3. **Quote any label with special characters.** Parentheses, brackets, colons, slashes, quotes, or `#` inside a node label break the parser unless the whole label is wrapped in double quotes: `A["Order (paid)"]`. This is the #1 cause of failures — see [references/syntax-gotchas.md](references/syntax-gotchas.md).
4. **Keep diagrams small and readable.** A human-facing diagram with >15–20 nodes is noise. Split into multiple focused diagrams instead.
</critical>

## Quick start

To generate a diagram:

1. Pick the diagram type from the table below.
2. Write the Mermaid source.
3. Validate it:
   ```bash
   python scripts/validate_mermaid.py --string "graph TD
     A[Start] --> B{OK?}
     B -->|yes| C[Done]"
   ```
   Or validate every ```mermaid block in a file: `python scripts/validate_mermaid.py path/to/doc.md`
4. If it fails, fix per the parse error and re-run. If it passes, return the fenced block.

## Workflow

Copy this checklist:

```
Mermaid progress:
- [ ] Step 1: Choose diagram type (see table)
- [ ] Step 2: Draft the source — quote labels with special chars
- [ ] Step 3: Validate with scripts/validate_mermaid.py
- [ ] Step 4: If FAIL, read the parse error, fix, re-validate (loop)
- [ ] Step 5: Return / write the validated ```mermaid block
```

**Step 1: Choose the diagram type**

| Intent | Type | Header keyword |
| :--- | :--- | :--- |
| Process / decision flow | Flowchart | `flowchart TD` (or `graph TD`) |
| Interactions over time between actors | Sequence | `sequenceDiagram` |
| Lifecycle / status transitions | State | `stateDiagram-v2` |
| Data entities + relationships | Entity-relationship | `erDiagram` |
| Object/type model | Class | `classDiagram` |
| Step-by-step user experience + sentiment | User journey | `journey` |
| Hierarchy of ideas / scope breakdown | Mindmap | `mindmap` |
| Schedule over time | Gantt | `gantt` |
| System context / containers | C4 | `C4Context` |

For the syntax of each type and a worked example, see [references/syntax-gotchas.md](references/syntax-gotchas.md).

**Step 2: Draft the source**
Write it. Wrap any label containing `()[]{}:;/#"` or a leading number in double quotes. Avoid the bare word `end` as a node id in flowcharts (it collides with `subgraph ... end`).

**Step 3: Validate**
Run `scripts/validate_mermaid.py`. It tries, in order: local `mmdc` → hosted Kroki renderer → offline structural lint. The first that can run is authoritative (the structural lint announces itself as best-effort).

**Step 4: Fix loop**
A `FAIL` line gives the backend and the parser's message (line number + what it expected). Most failures are an unquoted label or an unbalanced bracket. Fix and re-run. Do not stop until `PASS`.

**Step 5: Return**
Present the validated diagram as a fenced ```mermaid block. When writing for a human artifact (e.g. `.human/` summaries), the block goes straight into the markdown file.

## Validation backends

The script (`scripts/validate_mermaid.py`) needs nothing installed to do a structural lint, but for an **authoritative** check install the CLI once:

```bash
npm install -g @mermaid-js/mermaid-cli   # provides `mmdc`
```

If `mmdc` is absent it falls back to the hosted Kroki API (needs network). If both are unavailable it runs an offline structural lint and clearly labels the result as best-effort — treat a structural-only PASS as "probably fine, not guaranteed."

## Common errors

### "Parse error on line N" with `Expecting 'SQE', 'PE', ...`
**Cause**: a special character in a node label broke the shape parser (e.g. `A[Order (paid)]`).
**Fix**: quote the label — `A["Order (paid)"]`.

### Subgraph or flowchart silently truncates
**Cause**: a node literally named `end`, or an unclosed `subgraph`.
**Fix**: rename the node (`done`, `finish`), ensure each `subgraph` has a matching `end`.

### Edge label with a colon or pipe fails
**Cause**: unescaped `:` / `|` in an edge label.
**Fix**: `A -->|"rate: hourly"| B` — quote the label text.

See [references/syntax-gotchas.md](references/syntax-gotchas.md) for the full list, per-type cheat-sheets, and worked examples.

## When called by another skill

Skills that produce human-facing artifacts (e.g. `/intake`, `/discovery`, `/understand` writing `.human/` summaries) invoke this skill to get a validated diagram. The contract: they hand you the intent + the data; you return a fenced ```mermaid block that has passed `scripts/validate_mermaid.py`. Diagrams are for **human** artifacts — machine-facing `.ai/` artifacts use structured YAML/JSON/tables instead, so do not add Mermaid to those.
