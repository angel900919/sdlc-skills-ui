---
name: publish-issues
disable-model-invocation: true
description: |-
  Publishes canonical issue files (written by /to-issues) to ONE tracker backend per run — beads, jira, or md (set with --backend). A pure, idempotent adapter — it mutates the canonical files in place (writes backend refs + flips status), writes no new artifact and no human mirror. Use when the user says "/publish-issues", "publish to beads", "push tickets to jira", "create the tickets in the tracker", "materialize tickets", or after /to-issues emits READY-TO-PUBLISH. Do NOT use for: generating issue content (/to-issues), planning slices (/plan), re-slicing (/plan), or build execution (the build loop).
---

# Publish Issues

Pure adapter. Reads canonical issue files at `.ai/specs/<feature>/issues/SLICE-N.md` and pushes them to **one** tracker backend per run. Idempotent on re-run.

`/to-issues`'s destination on `READY-TO-PUBLISH`: it **mutates the existing canonical files** (writes `backend_refs.<backend>` + flips `status: open → published`) and pushes to the tracker, authoring no new document and no `.human` mirror.

<what-to-do>

## Critical rules (read before starting)

1. **No new artifact · mutates canonical files.** This skill writes no `.ai/<stage>.md` of its own and no `.human/summaries/*` mirror (like `/to-issues` and `/to-fitness`, it produces no document a human signs off). It only mutates the existing `SLICE-N.md` files (`backend_refs` + `status`) and the chosen tracker. The **`md` backend is itself the human-side projection** of the issues — beads is the machine build-loop backend, Jira/md are the human views.
2. **Issue files required.** No `.ai/specs/<feature>/issues/SLICE-*.md` → refuse, route to `/to-issues <feature>`.
3. **One backend per run.** `--backend=beads`, `--backend=jira`, or `--backend=md`. No multi-backend mode — re-run with a different flag for a second tracker.
4. **Idempotent via `backend_refs` + `status`.** Action per slice:
   - `status: open`, ref `null` → **CREATE** upstream; write ref back
   - `status: open` or `published`, ref set → **UPDATE** upstream (title, body, labels, dep edges); leave ref
   - `status: removed`, ref set → **CLOSE** upstream (with the in-progress safety check)
   - `status: removed`, ref `null` → **SKIP** (never published)
5. **Topological-order create.** Process slices in dependency order (`depends_on` resolves before dependents) so a child can carry the parent's tracker id.
6. **Schema-validate every file upfront.** Validate each issue file's frontmatter before any side effect. One malformed file → refuse the WHOLE run, bounce to `/to-issues`. Never auto-fix, never half-publish.
7. **Refuse to close in-progress upstream tickets.** `status: removed` + the upstream ticket is in a working state (beads `in_progress`, Jira `In Progress` / `In Review`) → STOP and surface a conflict. Don't destroy work-in-flight.
8. **No two-way sync.** Tracker workflow state (a closed bead, a Jira "Done") never flows back into the canonical file. The canonical `.ai` file owns the spec; the tracker owns workflow state. `/qa` reconciles at feature close.
9. **Auth fail-fast.** Check credentials at Phase 0 (before any side effect). Missing → `BLOCKED-ON-AUTH`; never half-publish.
10. **Single bd-writer guard (`--backend=beads`).** Refuse while a `.ralph-state/<id>.json` exists or another `bd` writer is active — the bd dolt write-lock deadlocks ~10 min if two writers race. This is a correctness guard; keep it even though the autonomous beads runner (`ralph-loop-afk`) is Phase 2 / not yet built.
11. **Idempotent close.** `bd close` and Jira transitions query state first and skip if already terminal — never error on an already-closed ticket.
12. **Write-back is the LAST step per slice.** Only after upstream confirms success: set `backend_refs.<backend>: "<ref>"` and `status: open → published` in the canonical file, written atomically. A mid-run crash is then resumable — re-running picks up where it stopped.
13. **AI-generated disclaimer on every issue body** (see § Disclaimer) — marks the content AI-authored and points readers at the canonical source so manual upstream edits aren't wasted.
14. **Dry-run is pure.** `--dry-run` prints the full plan and exits — zero bd / Jira / file writes.
15. **Tracker.** Read `.ai/progress-tracker.md` top 5 at Phase 0 (per [`../_shared/conventions.md` § Progress tracker](../_shared/conventions.md)); expect a `to-issues landed (<feature>)` entry as the upstream signal. Append one entry on the success verdict only. Skip on `PARTIAL` (re-run appends on completion) and all `BLOCKED-*` refusals.
16. **Talk to the human in plain English** per [`../_shared/conventions.md` § Talking to the human](../_shared/conventions.md#talking-to-the-human-every-skill-that-asks-questions) — this skill barely interrogates (its one interaction is the dry-run confirm), but keep that question jargon-free and propose the recommended answer (proceed).

**Backstopped by anti-patterns.** See [`references/anti-patterns.md`](references/anti-patterns.md) for the rejection list (multi-backend mode, partial publish on schema error, `backend_refs` written before upstream confirms, closing in-progress upstream, etc.).

## Procedure

Copy this checklist:

```
publish-issues progress:
- [ ] Phase 0: Load tracker top 5; validate args, schema, auth, single-writer (beads only); announce
- [ ] Phase 1: Load issue files; topo-sort; build action plan (CREATE/UPDATE/CLOSE/SKIP per slice)
- [ ] Phase 2: Dry-run preview — show the plan, confirm
- [ ] Phase 3: Execute per slice in topo order; write backend_refs + status back after each success
- [ ] Phase 4: Append tracker entry (success verdict only); issue verdict
```

### Phase 0 — Validate

**First**, read `.ai/progress-tracker.md` if present (top 5) for session context. Then:

1. **Args** — feature slug present; `--backend` is one of `beads|jira|md`. Otherwise refuse.
2. **Schema** — load every `.ai/specs/<feature>/issues/SLICE-*.md`. Validate the required frontmatter from the [`/to-issues` template](../to-issues/references/template.md) / [`../_shared/ai-schema.md`](../_shared/ai-schema.md): `slug`, `feature`, `slice`, `stage`, `title`, `status`, `category`, `type`, `priority`, `tier`, `tests`, `language`, `depends_on`, `satisfies_*`, `files`, `backend_refs`. Any malformed → `BLOCKED-ON-SCHEMA → /to-issues`.
3. **Auth** (per backend):
   - `beads` — `bd` on PATH and `.beads/` initialized.
   - `jira` — prefer the Atlassian Rovo MCP tools when present (`mcp__claude_ai_Atlassian_Rovo__createJiraIssue` etc.); else `JIRA_BASE_URL` + `JIRA_API_TOKEN` env, or `acli` configured.
   - `md` — no auth.
   Missing → `BLOCKED-ON-AUTH`.
4. **Single-writer guard** (`beads` only) — refuse if any `.ralph-state/<id>.json` exists or another `bd` writer is active (rule 10).
5. **Anchor** (warn-if-missing) — pull backend defaults if present (`jira_project_key`, `beads_label_prefix`). Load `tracker_label_map` if present (see § Label vocabulary), so labels write in the tracker's own vocabulary; absent is fine.
6. **Announce** — backend, feature, file count, open/removed/already-published split, topo order, single-writer status. Templates: [`references/examples.md`](references/examples.md).

### Phase 1 — Build action plan

For each issue file, sorted topologically by `depends_on`, decide the action from `status` × `backend_refs.<backend>` × upstream state. Full action table: [`references/examples.md`](references/examples.md). Conflicts (e.g. close requested on in-progress upstream, or a ref pointing at a deleted ticket) surface as a numbered list with concrete options — don't proceed past Phase 2 with unresolved conflicts.

### Phase 2 — Dry-run preview

Print the plan: per slice — action, target ref (if known), and what changes (title/body/labels/deps). Ask once, in plain English: *"Proceed with this plan? (y/n)"*. `--dry-run` → stop here and exit (pure, no writes).

### Phase 3 — Execute

For each slice in topo order:

1. Resolve `depends_on` slice numbers to upstream refs (topo order guarantees parents are already published).
2. Call the matching adapter — `beads` → [`references/adapter-beads.md`](references/adapter-beads.md); `jira` → [`references/adapter-jira.md`](references/adapter-jira.md); `md` → [`references/adapter-md.md`](references/adapter-md.md). Each specifies field mapping, commands, in-progress check, and gotchas.
3. On success — open the canonical file, set `backend_refs.<backend>: "<new_ref>"` and `status: open → published`. Write atomically (rule 12).
4. On failure — STOP the whole run (don't continue with stale dep refs). Report the failing slice + error. Verdict: `PARTIAL → re-run to resume`.

### Phase 4 — Tracker + verdict

On the success verdict only, append one entry to `.ai/progress-tracker.md` (per [`../_shared/conventions.md` § Progress tracker](../_shared/conventions.md) format) naming the backend + ticket count. Then issue exactly one verdict (full prose + recovery: [`references/verdict-handoff.md`](references/verdict-handoff.md)):

- **`READY-FOR-BUILD → /build`** — every in-scope slice reached its terminal action (created / updated / closed / skipped); refs + status written back; re-run is idempotent. Hand off honestly: *"All `<N>` issues for `<feature>` published to `<backend>` — `READY-FOR-BUILD`. The build loop (`/build` · `mtdd-*`) is built; for now each `--backend=beads` slice runs through the manual mtdd loop (the autonomous `ralph-loop-afk` runner is still Phase 2), and `jira`/`md` slices are handed to a human operator."*
- **`PARTIAL → re-run to resume`** — an upstream call failed mid-run; succeeded slices have refs written; re-running resumes. Print the failing slice + error.
- **`BLOCKED-ON-SCHEMA → /to-issues`** — a canonical file failed frontmatter validation. Print file + missing field.
- **`BLOCKED-ON-AUTH`** — credentials missing or invalid. Print the exact setup steps for the failing backend.
- **`BLOCKED-ON-CONFLICT`** — refused to close in-progress work, OR a `backend_refs` points at a deleted ticket. Print each conflict with two concrete resolution options.

If the user overrides a negative verdict, set `verdict_overridden: true` + record the reason in the run output (this skill writes no frontmatter of its own; the override is recorded in the tracker entry / report).

## Disclaimer (all backends)

Every issue body / description / materialized ticket starts with:

```
> *Generated by `/publish-issues` from `.ai/specs/<feature>/issues/SLICE-<N>.md` — do not edit upstream; edit the canonical file and re-run.*
```

It marks the content AI-authored and names the source of truth (manual upstream edits get clobbered on the next run). Fill `<feature>` and `<N>` per slice. For **`md`** the line goes *after* the `# Title` heading (so the title reads first); for **beads/jira** it is the first line of the body/description (title lives in a separate field).

## Label vocabulary and `tracker_label_map`

Labels split into two categories — only the first is remappable:

| Category | Labels | Remappable via `tracker_label_map`? |
|---|---|---|
| **Display labels** (category + routing) | `category-enhancement` · `category-bug` · `ready-for-agent` · `ready-for-human` | **Yes** — if `anchor.md` declares a mapping, write the tracker-specific value (e.g. GitHub's native `bug`). |
| **Chain-internal** (grepped by exact string downstream) | `feature-<slug>` · `f-id-F-N` · `us-US-N` · `nfr-NFR-N` · `unwanted-U-N` · `skip-tests` · `force-skip-tests` · `lang:<value>` | **No** — part of the contract with `/qa` (greps `f-id-*`/`nfr-*`) and the beads build loop (reads `skip-tests`/`force-skip-tests` + `lang:*`). Always verbatim. |

When `tracker_label_map` is set, Phase 0 loads it once and applies it to display labels only; chain-internal labels pass through unchanged. Absent map (or no `anchor.md`) → all labels written canonically. Priority entries (`P0..P3`) are ignored here (bd uses `--priority`, Jira uses the Priority field — neither is a label). `tracker_label_map` is owned by `anchor.md` and applied by any skill that writes tracker labels.

</what-to-do>

<supporting-info>

## Tier matrix

Purely mechanical — identical across tiers (the canonical issue file already carries the tier-shaped fields).

</supporting-info>
