# Recon: project-wide

<!--
TIER MARKERS:
  [P]  = prototype  (line cap 150)
  [M]  = mvp        (line cap 300)
  [Pr] = production (line cap 450)

Include a section only if its tier set covers the anchor's project_tier.
Hard cap by tier — if over, the scan reported too much noise.
Prune lowest-signal items per section. Do not drop sections.

Every claim about the codebase needs a `path:line` citation.
No "we should" / "consider" / "recommend" — those belong to /architect or /design.

The frontmatter block (per ../_shared/ai-schema.md) is the index — fill it first.
-->

## Status  [P][M][Pr]

`Draft` <!-- Draft | Ready-for-Comprehend | Ready-for-Architect | Superseded -->

## Meta  [P][M][Pr]

- **Project root:** `<absolute or relative path>`
- **Tier:** `prototype | mvp | production` *(inherited from `.ai/anchor.md`)*
- **Anchor stack:** `<language + framework + db + hosting, from .ai/anchor.md>`
- **Scanned by:** sub-agent (`Explore`), `YYYY-MM-DD`
- **Scan scope:** `whole repo` | `src/, apps/, services/` *(if restricted in Phase 2)*

---

## Section A — Repo shape  [P][M][Pr]

### Top-level layout
- `<dir/>` — `<one-line role>` (`<manifest path:line>` if applicable)

### Runtimes detected
- `<runtime + framework>` — `<manifest:line>` (e.g., `package.json:1`)

### Deployment surface
- `<Dockerfile / compose / vercel.json / wrangler.toml / k8s / terraform>` — `<path:line>`

### Datastores + migrations
- `<db + ORM>` — `<schema path:line>`
- Migrations: `<folder path>`

### External integrations
- `<provider name>` — `<import site: path:line>` *(cite the import, not just the dep)*

---

## Section B — Component decomposition  [P][M][Pr]

### Major components
<!-- 3–10 cohesive units. Flag Entity Trap suffixes (Manager/Handler/Service/Util) but don't rename. -->
- **`<component name>`** — `<path/>` — `<one-line responsibility>` — files: `<path:line>`, `<path:line>`

### Inter-component edges
- `<component A>` → `<component B>` — `<one representative import: path:line>`

### Architectural style signals  [M][Pr]
<!-- Cite evidence — don't pick a label, just report what's visible. -->
- `<layered / hex / clean / event-driven / CQRS / modular-monolith>` — evidence at `<path:line>`, `<path:line>`

---

## Section C — Domain language + invariants  [P][M][Pr]  *(feeds `/comprehend`)*

### Glossary candidates
<!-- 10–25 domain nouns/verbs from identifiers (class names, table names, route paths, enum values). Skip generic tech terms. -->
- **`<Term>`** — `<path:line>` — `<how it's used in one line>`

### Invariants enforced in code  [M][Pr]
<!-- Rules the code defends — DB constraints, validators, assertions, state-machine guards. Phrase as "X must Y". -->
- **`<X must Y>`** — `<path:line>` *(e.g., DB constraint, zod schema, FSM guard)*

### Top user journeys (inferred)
<!-- 3–5 end-to-end flows from routes/controllers/CLI entry points. Cite the entry-point file:line. If unclear, say so. -->
1. `<journey one-liner>` — entry at `<path:line>`

---

## Section D — Decisions already made  [M][Pr]  *(feeds `/architect` ADR backlog)*

### Visible architectural decisions
<!-- Things a future reader needs context on. ORM choice, auth approach, rendering strategy, message passing, monorepo vs polyrepo. -->
- **`<decision name>`** — `<one-line what>` — evidence at `<path:line>`, `<path:line>`

### Existing docs to respect
- `<README.md | ARCHITECTURE.md | docs/ | .ai/ | ADR folder>` — `<one-line scope>`

---

## Section E — Gaps and warnings  [P][M][Pr]  *(feeds `/comprehend` grilling)*

### Things that look stale
- `<TODO/FIXME cluster | deprecated dep | dead route | orphan test>` — `<path:line>`

### Mystery zones
<!-- Folders you can't confidently classify, or where naming doesn't match contents. /comprehend should ask the user about these. -->
- `<dir/>` — `<why it's mysterious>`

---

## Handoff  [P][M][Pr]

- **`/comprehend`** uses **Section C** (glossary, invariants, journeys) and **Section E** (mystery zones become questions for the user).
- **`/architect`** uses **Sections A + B + D** (shape, components, decisions). If `.ai/architecture.md` or `.ai/architecture/` exists, run `/architect` in update mode.
- **Skip the section** that maps to a downstream skill you've already run.

---

## Notes  [P][M][Pr]

- **Glossary cross-check vs `.ai/context.md` / `.ai/understanding/<slug>.md`:** `<conflicts surfaced — none / list>`
- **Stale citations flagged:** `<e.g., src/legacy/foo.ts last touched 14 months ago — verify still in use>`
- **Repo restrictions applied:** `<e.g., excluded node_modules/, .git/, build artifacts — default>`
- **Supersedes:** `<prior recon timestamp, if this is a refresh>`

---

## Verdict  [P][M][Pr]

**`READY-FOR-COMPREHEND`**

<!-- One of:
  READY-FOR-COMPREHEND     — default; /comprehend is the next step
  READY-FOR-ARCHITECT      — domain model already recovered; jump to /architect
  SKIPPED-GREENFIELD       — refusal; anchor says greenfield or no manifests
  BLOCKED-ON-ANCHOR → /anchor
-->

<One paragraph: if READY-FOR-COMPREHEND, restate which sections feed which next-skill, and call out anything in Section E the user should resolve before /comprehend. If READY-FOR-ARCHITECT, restate the sections /architect will use and whether update mode applies. If blocked, name what's needed to unblock.>
