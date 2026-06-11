# Tracker mode reads — `/status` backend cheat-sheet

How `/status` extracts state + last activity for a single slice, per backend. **All commands are read-only.** Never run a write variant (`bd update`, `bd close`, `bd note`, Jira POST/PUT) from this skill.

## Detection

Per slice, read frontmatter `backend_refs`:

```yaml
backend_refs:
  beads: rl-x8z       # or null
  jira: PROJ-1234     # or null
  md: tickets/<feature>/SLICE-3-retry-webhooks.md   # or null
```

Query every backend with a non-null ref. If two backends both have non-null refs and their derived states disagree, surface `CONFLICT (beads: closed, jira: In Progress)` in the cell — never pick a winner.

If a backend ref is non-null but the read fails (CLI not installed, MCP unauthenticated, file missing), surface `UNAVAILABLE (<reason>)` for that cell. Never synthesize state.

## Beads

**Detect installed**: `command -v bd` returns 0. If missing → `UNAVAILABLE (bd not installed)`.

**State**:

```bash
bd show <id> --format=json
```

Read `.status` field. Map:
- `closed` → `merged` (combined with the branch-merge check from Phase 2)
- `open`, `in-progress`, `blocked` → `in-progress`
- anything else → surface verbatim

**Last 2 notes**:

```bash
bd show <id> --format=json | jq -r '.notes | sort_by(.created_at) | reverse | .[0:2][] | "\(.created_at) \(.text)"'
```

Or plain-text fallback when `jq` is absent:

```bash
bd show <id>
```

…and parse the `Notes:` block by hand.

The latest note typically has the prefix `implement:`, `review:`, `verify:`, or `merge:` (written by the `mtdd-*` chain). Render the first 80 chars after the prefix.

## Canonical markdown (`--backend=md`)

The slice file lives at `tickets/<feature>/SLICE-N-<slug>.md` (path is in `backend_refs.md`).

**Detect**: file exists on disk. If missing → `UNAVAILABLE (file not found at <path>)`.

**State**: read the file and check, in order:
1. `## Completion` section present → `merged`.
2. `## Status log` last entry starts with `- merge:` → `merged`.
3. `## Status log` last entry starts with `- review: REJECT` → `in-progress` (work bounced back).
4. `## Status log` has any `- implement:` or `- review:` or `- verify:` entries → `in-progress`.
5. Otherwise → `published`.

**Last note**: the last `- <phase>:` line of `## Status log`, OR the first line of `## Completion` if present (completion wins).

## Jira

**Detect**: Atlassian MCP available + authenticated. If not → `UNAVAILABLE (Jira MCP not configured)`.

**State**: fetch the issue with `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` using the ref (e.g., `PROJ-1234`). Read `fields.status.name`:
- `Done`, `Closed`, `Resolved` → `merged` (combined with branch-merge check)
- `In Progress`, `In Review` → `in-progress`
- `To Do`, `Backlog`, `Open` → `published`
- other → surface verbatim

**Last note**: read the most-recent comment from the issue's `comments` field. Render `<author> @ <created>: <first 80 chars>`.

If the Jira MCP is rate-limited or slow, time-box per slice (5s) and degrade to `UNAVAILABLE (timeout)` rather than blocking the whole report.

## Git branch + last commit

Independent of tracker backend — runs once per feature in deep-dive mode:

```bash
git branch --list 'feat/<feature>-slice-*'
```

For each match, get the last commit:

```bash
git log -1 --format='%h %s' <branch>
```

For the "branch contains merge commit" check (needed to confirm `merged` derivation): check whether the slice's expected merge commit is on the configured target branch (default `develop`, override from `.ai/anchor.md` if set):

```bash
git branch --contains <merge-SHA> | grep -q '^[* ]\+<target>$'
```

If the local `<target>` branch is behind the remote, the merge may have been pushed elsewhere. That's fine — local state is what we report; the `Generated against:` header in the persisted artifact captures the local SHA so the snapshot is self-dating.

## Why these are all read-only

`/status` is meant to be cheap and safe: an operator can run it 30 times a day, in any state, on any branch, without altering anything. The moment a status reader starts writing back to tracker records, it becomes a coordination hazard — two operators running `/status` would race the tracker. Snapshots (`--write`) land in the per-feature spec directory, which is version-controlled and operator-owned, not in tracker records.
