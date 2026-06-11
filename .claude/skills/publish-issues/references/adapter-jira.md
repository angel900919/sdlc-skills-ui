# Adapter — `--backend=jira`

Loaded by `/publish-issues` Phase 3 when the user passes `--backend=jira`. **Jira is a human-side projection** of the issues (alongside `md`) — a place humans browse and operate tickets.

## Field mapping (canonical → Jira)

| Canonical | Jira |
|---|---|
| `title` | Summary |
| `## What to build` + acceptance + traceability | Description (markdown — prefer markdown rendering via MCP) |
| `priority` | Priority field: `P0`→Highest, `P1`→High, `P2`→Medium, `P3`→Low |
| `category: enhancement` / `bug` | Label `category-enhancement` / `category-bug` |
| `type: afk` | Label `ready-for-agent` (uniform with beads) |
| `type: hitl` | Label `ready-for-human` (uniform with beads) |
| `tests: skip-tests` | Label `skip-tests` |
| `language: <value>` | Label `lang:<value>` (uniform with beads — dashboards can filter by language across backends) |
| `depends_on` | Issue link type `is blocked by` (parent blocks child) |
| `satisfies_*` | Labels `f-id-F-2`, `us-US-3`, etc. (same convention as beads) |
| (always) | first line of description = AI-generated disclaimer (see SKILL.md § Disclaimer) |
| `feature` slug | Label `feature-<slug>` |
| Project key | From `anchor.md` `jira_project_key`; else ask once at Phase 0 (plain English) and cache for the run |

## Preferred path — Atlassian Rovo MCP tools (when present)

These are available in this environment — prefer them:

- Create: `mcp__claude_ai_Atlassian_Rovo__createJiraIssue` → returns issue key (e.g. `PROJ-1234`)
- Update: `mcp__claude_ai_Atlassian_Rovo__editJiraIssue`
- Add dep link: `mcp__claude_ai_Atlassian_Rovo__createIssueLink` with a type from `mcp__claude_ai_Atlassian_Rovo__getIssueLinkTypes`
- Transition (close): `mcp__claude_ai_Atlassian_Rovo__getTransitionsForJiraIssue` → pick "Done"/"Closed" → `mcp__claude_ai_Atlassian_Rovo__transitionJiraIssue`
- State check: `mcp__claude_ai_Atlassian_Rovo__getJiraIssue` → `.fields.status.name`
- Project discovery: `mcp__claude_ai_Atlassian_Rovo__getVisibleJiraProjects`; existing-ticket lookup: `mcp__claude_ai_Atlassian_Rovo__searchJiraIssuesUsingJql`

## Fallback paths (only if MCP unavailable)

1. `acli` (Atlassian CLI): `acli jira workitem create --project <key> --type Task --summary "..." --description-file body.md`
2. Raw REST: `curl -u <email>:<token> -H "Content-Type: application/json" -X POST "$JIRA_BASE_URL/rest/api/3/issue" -d @payload.json`

## In-progress check

`getJiraIssue` → `.fields.status.statusCategory.key`. Working states: `indeterminate` (In Progress, In Review). Terminal: `done`.

## Field-mapping gotchas

Jira description format varies (wiki markup vs ADF). The MCP `createJiraIssue` accepts markdown; the raw REST API requires ADF — use the MCP path when in doubt. Custom fields (epic link, story points) are NOT mapped — out of scope for the tracker-agnostic canonical schema; add via manual edit post-publish.
