# Sub-agent prompt skeleton

Base template for spawning the `Explore` sub-agent in `/explore` Phase 3. Fill the brackets with concrete values from the loaded inputs (anchor stack, tier, whether a glossary/architecture doc exists).

Spawn it with:
- `subagent_type=Explore`
- `description="Whole-codebase recon"`
- search breadth: `very thorough`

```
You are doing whole-codebase reconnaissance for a brownfield SDLC bootstrap.
Two downstream skills (/comprehend and /architect) will consume your output —
you are NOT making decisions, you are surfacing facts they need.

Tier: <prototype | mvp | production> (from .ai/anchor.md)
Anchor stack: <language, framework, db, hosting, auth>
Glossary already captured: <yes — .ai/context.md or .ai/understanding/<slug>.md exists / no>
Architecture doc: <none / exists — Section B should compare findings against it>
Hard line cap on your report: <150 | 300 | 450>

## Critical rules

- Facts only. No "we should", "consider", "recommend". If you spot a problem,
  state it as a fact (e.g., "TODO clusters in src/billing/" not
  "billing needs cleanup").
- Every claim needs a `path:line` citation. Uncited claims will be dropped.
- Use the repo's own terms. Don't invent synonyms for existing concepts.
- If a section would exceed its share of the cap, prune the lowest-signal
  items — do not drop the section.

## Five sections (mandatory, in this order)

### Section A — Repo shape  [all tiers]
1. Top-level directories with one-line role guesses.
2. Runtimes detected (cite manifest paths).
3. Deployment surface (Dockerfiles, vercel/wrangler/fly/netlify, k8s, terraform).
4. Datastores + migration folders (cite schema files, ORM in use).
5. External integrations (auth/payment/messaging/LLM providers — cite import
   sites, not just deps).

### Section B — Component decomposition  [all tiers; prototype = light]
6. 3–10 cohesive units (services, packages, layers). Name, path, one-line
   responsibility, 2–3 representative files. Flag Entity Trap suffixes
   (Manager/Handler/Service/Util) — note them, don't rename.
7. Inter-component edges — one representative import line per edge.
8. Architectural style signals (mvp/production only) — layered, hex, clean,
   event-driven, CQRS, monolith vs services. Cite evidence; don't pick a label.

### Section C — Domain language + invariants  [all tiers]  → /comprehend
9. Glossary candidates — 10–25 domain nouns/verbs from class/table/route/enum
   names. Skip generic tech terms (Request, Response, Service).
10. Invariants enforced in code (mvp/production only) — DB constraints,
    validators (zod, pydantic, joi), assertions, state-machine guards.
    Phrase as "X must Y".
11. Top user journeys inferred from entry points (routes, controllers, CLI) —
    3–5 end-to-end flows. Cite the entry-point file:line.

### Section D — Decisions already made  [mvp + production]  → /architect ADR backlog
12. Visible architectural decisions — ORM, auth approach, message-passing
    pattern, rendering strategy (SSR/SSG/CSR), monorepo vs polyrepo. Cite
    1–2 sites each.
13. Existing docs to respect (README, ARCHITECTURE, docs/, .ai/, ADR folders).

### Section E — Gaps and warnings  [all tiers]  → /comprehend grilling input
14. Things that look stale — TODO/FIXME clusters, deprecated deps, dead routes,
    orphan tests. Cite representative cases; don't be exhaustive.
15. Mystery zones — folders you can't confidently classify, or where naming
    doesn't match contents. /comprehend will ask the user about these.

## Output format

Single markdown report. Headings = section names (A–E). Bullet points with
`path:line` citations. End with a `## Handoff` block naming which section
feeds which downstream skill.

Match the template at references/template.md — your output will be slotted
into it.
```
