# /publish-issues examples + the action table

The full action table plus reference samples for announce, conflict surfacing, partial-drift avoidance, and schema validation. Referenced from `SKILL.md` Phase 0 (announce) and Phase 1/2 (action plan, dry-run).

## Action table (Phase 1)

For each issue file, sorted topologically by `depends_on`:

| `status` | `backend_refs.<backend>` | Upstream state | Action |
|---|---|---|---|
| `open` | `null` | n/a | **CREATE** |
| `open` or `published` | set | open / ready | **UPDATE** (full re-render) |
| `open` or `published` | set | working / in-progress | **UPDATE** (title, body, labels, dep edges only — safe) |
| `open` or `published` | set | terminal (closed) | **CONFLICT** — refuse, ask user |
| `removed` | set | open / ready | **CLOSE** |
| `removed` | set | working / in-progress | **CONFLICT** — refuse, ask user |
| `removed` | set | terminal | **SKIP** (already closed) |
| `removed` | `null` | n/a | **SKIP** (never published) |

Conflicts surface as a numbered list with concrete next steps. Don't proceed past Phase 2 with unresolved conflicts.

## Action plan output (good)

```
Backend: beads. Feature: invoice-send. 4 issue files.

Slice 1 — Bill closed session: CREATE (priority P2, type afk, category enhancement, language typescript,
  labels ready-for-agent feature-invoice-send category-enhancement lang:typescript f-id-F-1 nfr-NFR-2)
Slice 2 — Send invoice email: CREATE (depends on Slice 1 → link after Slice 1 publishes)
Slice 3 — Retry failed webhooks: CREATE (depends on Slice 2)
Slice 4 — Old draft cleanup: SKIP — status: removed, backend_refs.beads is null (never published)

Estimated commands: 3 `bd create`, 2 `bd dep add`. No closes.
Proceed? (y/n)
```

## Conflict surfacing (good)

```
CONFLICT — cannot proceed:

Slice 2 — Send invoice email
  status: removed in canonical
  backend_refs.beads: inv-a9p → bd status: in_progress

Refusing to close an in-progress upstream ticket — the work in flight would be lost.

Options:
  (a) Wait for the in-flight work to finish (it will close inv-a9p on success), then re-run /publish-issues
  (b) Revert the bead to open (bd update inv-a9p --status open), then re-run /publish-issues
  (c) Restore Slice 2 in plan.md (re-run /plan in update mode), regenerate via /to-issues, re-run /publish-issues

Verdict: BLOCKED-ON-CONFLICT
```

## Bad vs Good — silent partial drift

```
❌ Bad: 3 of 4 slices published. Slice 3 failed mid-creation but the skill continued, marking Slice 4
   published with a dep-link to a Slice 3 ref that doesn't exist upstream.

✅ Good: Slice 3 failed → STOP. Slice 4 stays unpublished. Re-running picks up at Slice 3.
```

## Schema validation (good)

```
BLOCKED-ON-SCHEMA — refusing to publish:

.ai/specs/invoice-send/issues/SLICE-3.md:
  missing required frontmatter field: `satisfies_nfrs`
  (mvp+ tier requires ≥1 NFR per slice)

Bounce to /to-issues invoice-send in update mode to fix.
```
