# Adapter — `--backend=md`

Loaded by `/publish-issues` Phase 3 when the user passes `--backend=md`.

The simplest adapter, and **the human-side projection of the issues** for teams without Jira/Beads: each canonical issue file is materialized as a tracker-friendly markdown copy under `tickets/`, and the relative path is written back to `backend_refs.md`. This is the `.human`-facing view in the same sense the integration contract means it — but it lives at `tickets/<feature>/`, **not** under `.human/` (that path is fixed by the `/to-issues` template runtime note; don't relocate it).

## Operations

- **CREATE** — copy `.ai/specs/<feature>/issues/SLICE-N.md` to `tickets/<feature>/SLICE-N-<title-slug>.md`. Strip the YAML frontmatter from the copy, or keep it minimal (title, status, `depends_on` as inline links). Set `backend_refs.md` to the relative path.
- **UPDATE** — re-render the copy from the canonical file. Overwrite.
- **CLOSE** — don't delete; move under `tickets/<feature>/archived/` OR add a `Status: Closed` line at top. Preserve for git history.
- **In-progress check** — `tickets/` is dumb storage; "in progress" isn't a concept here. Treat all states as openable; never `BLOCKED-ON-CONFLICT`.

## Title-slug rule

Lowercase, replace non-alphanumeric with `-`, collapse repeats, trim. Cap at 60 chars. Example: `"Retry failed Stripe webhooks"` → `retry-failed-stripe-webhooks`. (Matches the `backend_refs.md` example in the `/to-issues` template.)

## Disclaimer

Prepended to the materialized body **after** the `# Title` line (so the title reads first). See SKILL.md § Disclaimer for the exact text.

## Why this exists

Stakeholders who don't have Jira/Beads but want to browse tickets in GitHub or a wiki. Also a backup adapter when external trackers are down.
