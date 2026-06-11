# /publish-issues verdict hand-off + recovery paths

For each verdict, two artifacts: the **hand-off prose** the skill emits, and the **recovery path** for non-success verdicts. Referenced from `SKILL.md` Phase 4.

---

## `READY-FOR-BUILD → /build`

**Hand-off prose (honest about what's built):**

> *"All `<N>` issues for `<feature>` published to `<backend>` — `READY-FOR-BUILD`. `backend_refs.<backend>` + `status: published` written back to the canonical files; re-runs are idempotent. The build loop (`/build` · `mtdd-*`) is built — `--backend=beads` → run each slice through the manual `mtdd` loop (the autonomous `ralph-loop-afk` runner is still Phase 2); `--backend=jira`/`md` → a human operator picks tickets."*

**Recovery path:** none — re-runs are no-ops via `backend_refs`.

---

## `PARTIAL → re-run to resume`

**Hand-off prose:**

> *"Published `<K>` of `<N>`. Slice `<X>` failed on `<error>`. Canonical files updated for the `<K>` that succeeded. Re-run `/publish-issues <feature> --backend=<backend>` to resume — already-published slices are detected via `backend_refs` and updated, never duplicated."*

**Recovery path:**
1. Read the report — note which slices succeeded.
2. Re-run `/publish-issues <feature> --backend=<...>` — succeeded slices already carry `backend_refs` and are skipped (idempotent).
3. If the same failure recurs ≥2 times, re-diagnose as `BLOCKED-ON-AUTH` or `BLOCKED-ON-CONFLICT`.

---

## `BLOCKED-ON-AUTH`

**Hand-off prose:** credentials missing or invalid; print the env vars / setup steps for the failing backend.

**Recovery path:**
- **beads** → confirm `bd` CLI installed + `.beads/` initialized.
- **jira** → confirm the Atlassian Rovo MCP tools are connected, or `JIRA_BASE_URL` + `JIRA_API_TOKEN` set / `acli` configured for the target project.
- **md** → should not fire (no auth); file a bug.
- After fixing: re-run; idempotent.

---

## `BLOCKED-ON-SCHEMA → /to-issues`

**Hand-off prose:** at least one canonical file failed frontmatter validation; print the file + missing field.

**Recovery path:**
1. Read the named `file:line` in the report.
2. Re-run `/to-issues <feature>` in update mode to regenerate the affected files (preserves slice numbering).
3. Re-run `/publish-issues`.

Do NOT hand-fix YAML — `/to-issues` is the single writer of canonical-file content.

---

## `BLOCKED-ON-CONFLICT`

**Hand-off prose:** refused to close in-progress work, OR canonical + upstream are out of sync (e.g. `backend_refs` points at a deleted ticket); print each conflict with two concrete resolution options.

**Recovery path:**
1. Inspect the conflicting ticket on the backend directly.
2. Decide the source of truth — update the canonical file to match the backend, OR update the backend to match the canonical file.
3. Do NOT let the skill silently pick a winner; the conflict surface IS the safety check.
4. Re-run `/publish-issues`.
