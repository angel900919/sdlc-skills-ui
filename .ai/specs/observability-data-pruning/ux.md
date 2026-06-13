---
slug: sdlc-command-center
feature: observability-data-pruning
stage: ux
status: complete
tier: mvp
verdict: READY-FOR-DESIGN
verdict_overridden: false
screen_count: 3
new_components: []
design_system: none — WARN (no .ai/design-system.md; the de-facto system is the app's MUI idiom; /design maps to existing components)
sources: [.ai/specs/observability-data-pruning/prd.md, .ai/context.md, .ai/understanding/sdlc-command-center.md]
human_summary: .human/specs/observability-data-pruning/ux.md
consumed_by: [design, qa]
created: 2026-06-13
---

# UX spec — observability-data-pruning

> WARN (on the record): no project design system doc exists; states/copy below follow the
> app's shipped MUI conventions. `/design` maps every screen to existing components.

## Screens

### S1 — Storage overview panel
- purpose: show what the observability store holds and open the cleanup flow (story 1).
- key elements: per-kind table (Audit events · Hook events · Transcript copies · Usage
  samples — row count + oldest-record date each) · total database file size · cutoff
  picker (default **30 days**) · button **"Preview cleanup…"**.
- data shown: entity terms verbatim — Audit event, Hook event, Transcript message
  (labeled "Transcript copies"), Usage sample.
- states: loading = skeleton rows · empty = "Nothing recorded yet." (picker + button
  hidden) · error = "Couldn't read storage stats — {reason}" + Retry · ready = table + controls.

### S2 — Confirm-cleanup dialog
- purpose: the no-accidents gate (story 3): show exactly what the chosen cutoff deletes.
- key elements: title **"Delete old records?"** · body copy (verbatim): *"Records older
  than {cutoff date} will be permanently deleted. Live sessions are never touched. Old
  transcript copies disappear from search results."* · per-kind to-be-deleted counts ·
  danger-styled confirm **"Delete {N} records"** · cancel **"Keep everything"**.
- states: loading = "Counting…" (confirm disabled) · empty = "Nothing older than
  {cutoff date}. No cleanup needed." (confirm disabled) · error = "Couldn't count —
  {reason}" (confirm disabled) · ready = counts + enabled confirm.

### S3 — Result readout (in-panel, after S2 confirm)
- purpose: prove it worked (stories 4–5).
- key elements: success line (verbatim): *"Deleted {N} records · reclaimed {X} MB
  (file: {A} MB → {B} MB)"* · refreshed S1 table · note: "Recorded to the audit trail."
- states: in-progress = "Cleaning up…" (controls disabled, live views unaffected — NFR N1)
  · success = the readout · error (verbatim, atomicity promise): *"Cleanup failed —
  nothing was deleted. The database is unchanged. ({reason})"* · n/a-empty.

## User flows

### F1 — Clean up old records (happy)
1. Open S1 (entry: the app's main navigation — placement finalized by /design).
2. Read per-kind sizes; adjust the cutoff (default 30 days).
3. Click "Preview cleanup…" → S2 with live counts.
4. Click "Delete {N} records" → in-progress → S3 success readout; audit feed gains the entry.

### F2 — Nothing to delete (unhappy)
1–3 as F1 → S2 shows the empty state, confirm disabled. 4. Cancel → S1 unchanged.

### F3 — Failure mid-cleanup (unhappy)
1–4 as F1 → server reports failure → S3 error state with the database-unchanged promise
(design must make the delete transactional to keep this copy honest). Stats refresh to
prove nothing changed.

### F4 — Abandon (unhappy)
Any point before S2 confirm: Cancel/Escape closes the dialog; nothing happens.

## Component usage
- Inherits the shipped MUI idiom: card/panel, data table, dialog (focus-trapped),
  danger-variant button, snackbar-or-inline result line. `new_components: []` — nothing
  novel; /design maps to the exact existing components.

## Accessibility (mvp light)
- Dialog: focus trap, Escape = cancel, confirm is NOT the default-focused control.
- Counts and warnings carried in text, never color alone; danger button has a text label.
- Panel table keyboard-navigable; picker labeled ("Delete records older than").

## Verdict
**READY-FOR-DESIGN** — 3 screens × 4 states each, 4 flows (3 unhappy), verbatim copy,
no new components. `/design`'s file layout must cover S1–S3; `/qa`'s acceptance script
walks the states.
