# Adapter — `--backend=beads`

Loaded by `/publish-issues` Phase 3 when the user passes `--backend=beads`. **beads is the machine build-loop backend** — the queue the autonomous runner drains (Phase 2). Until that runner exists, beads tickets are run through the manual `mtdd` loop.

## Field mapping (canonical → bd)

| Canonical | bd |
|---|---|
| `title` | issue title |
| `## What to build` body | issue body |
| `## Acceptance criteria` checkboxes | `--acceptance "<markdown string>"` — pass the criteria block verbatim. bd stores `acceptance_criteria` as an opaque text blob (verified against bd v1.0.3: write-string → read-same-string round-trip); the build loop re-parses the `- [ ]` lines from this string at consume time. Do NOT emit a JSON array — bd stores it as a literal JSON string and the markdown-checkbox parse finds zero criteria, silently degrading TDD enforcement. |
| `priority` (P0–P3) | `--priority 0..3` |
| `category: enhancement` / `bug` | label `category-enhancement` / `category-bug` |
| `type: afk` | label `ready-for-agent` |
| `type: hitl` | label `ready-for-human` (no `ready-for-agent`) |
| `tests: skip-tests` | labels `skip-tests` AND `force-skip-tests` (the build loop requires both — a single-label run does full TDD with a warning) |
| `language: <value>` | label `lang:<value>` (e.g. `lang:typescript`, `lang:python`). The build loop reads this label to dispatch the per-language style + verify commands. Always emitted — never elide even when it matches anchor's default, so a bead reads self-contained. |
| `depends_on: [1, 2]` | `bd dep add <this-ref> <parent-ref>` per parent (after the parent is created) |
| `satisfies_f_ids / _user_stories / _nfrs / _unwanted` | labels `f-id-F-2`, `us-US-3`, `nfr-NFR-2`, `unwanted-U-1` (machine-greppable for `/qa`) |
| (always) | first line of body = AI-generated disclaimer (see SKILL.md § Disclaimer) |
| `feature` slug | label `feature-<slug>` (groups tickets per feature) |

## Commands

- Create: `bd create --title "<title>" --body "<body>" --priority <N> --label <l1> --label <l2> ...` → capture the emitted ID (e.g. `inv-x8z`)
- Update: `bd update <id> --title "<title>" --body "<body>"`; labels via `bd update <id> --add-label X --remove-label Y`
- Deps: `bd dep add <child> <parent>` (idempotent — bd dedups edges)
- Close: query `bd show --json <id>` for status; if not `closed`, `bd close <id>`. Acceptance criteria stay as-is on close.
- In-progress check: `bd show --json <id>` → `.status`. `in_progress` is the working state.

## Critical — single-writer (Decision D7)

Never run while another `bd` writer is active. The bd dolt write-lock deadlocks ~10 min if two writers race. Phase 0 checks `.ralph-state/` (the autonomous runner's lock dir, Phase 2); trust the user if they confirm no other `bd` writer is running. This guard stays even though the autonomous runner is not yet built — it's a correctness guard, not a runner dependency.
