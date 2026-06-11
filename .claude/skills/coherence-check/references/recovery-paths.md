# Contradiction → recovery path

When `/coherence-check` reports `N CONTRADICTIONS FOUND`, the user resolves each finding manually. This table maps each typical contradiction class to the canonical skill that owns the fix. Referenced from `SKILL.md` Phase 4 (verdict).

`/coherence-check` itself never blocks — it's read-only. The user re-runs after each fix to confirm zero residue.

| Contradiction class | Example | Resolve in |
|---|---|---|
| **Target user / persona drift** | `discovery.md` says target = "Maya, solo freelancer"; `understanding.md` says persona = "small-agency owner" | Re-open `/discovery` if the JTBD framing was wrong, or `/understand` if the persona was over-specified. Usually `/understand` is the offender (discovery is shorter and earlier). |
| **Tier vs NFR mismatch** | `anchor.md` says `project_tier: prototype`; a PRD's NFRs reference a 99.99% SLA | Either bump tier in `/anchor` (if the SLA reflects real stakes the project hits) or downgrade NFRs in `/prd` (if the SLA was over-spec). Don't fix both at once. |
| **Orphan component reference** | `design.md` names a `BillingDispatcher` module but `architecture/02-components.md` doesn't list it | Add to architecture via `/architect` update mode if the component is real, OR point the design at an existing component via `/design`. |
| **Orphan F-ID / user story / NFR** | A slice's `satisfies_f_ids` lists `F-7` but `prd.md` only defines F-1–F-5 | Re-run `/to-issues <feature>` in update mode (it re-validates frontmatter against PRD), or add the missing F-ID via `/prd`. |
| **ADR contradicts current decision** | An accepted ADR says "monolith" but `architecture/01-style.md` shows event-driven | Write a superseding ADR via `/architect`. Mark the old ADR `superseded by ADR-NNNN`; do not delete it. |
| **Glossary drift** | `understanding.md` defines "Order" one way; a feature spec uses "Order" with a different meaning | Re-open `/understand` to sharpen the term; either way `.ai/context.md` gets updated. |
| **Status / lifecycle inconsistency** | `features.md` row says `Status: Building` but no `.ai/specs/<feature>/issues/` directory exists | Use `/feature-map` update mode to roll the row back to `Planned`, or run `/to-issues` to materialize the missing files. |
| **Stale verdict reference** | A skill body or template names a verdict that no longer exists (e.g., `PROCEED-TO-ARCHITECT` after that verdict was renamed) | Hand-fix; no canonical skill owns this. Likely a docs maintenance issue. |

## General rules

- Resolve **one contradiction at a time**; re-run `/coherence-check` after each to confirm zero residue.
- Resolve **upstream first** — discovery before understanding, anchor before architect, prd before design. Fixing a downstream artifact while the upstream is still wrong invites the same contradiction back.
- If a contradiction surfaces a **real design question** (not just documentation drift), resolve it in the owning upstream skill (`/understand`, `/architect`, `/prd`) before committing — don't paper over it in the downstream doc.

When `/qa` (Phase 2c) sub-invokes this skill scoped to a feature subtree, the same recovery loop applies: read findings, route per the table above, re-run.
