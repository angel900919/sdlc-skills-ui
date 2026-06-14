# Coherence-check report format

Format for the report `/coherence-check` produces. Referenced from `SKILL.md` Phase 3 (compile the report). The human-readable report goes to **stdout**; an identical machine-readable snapshot is written to `dashboard/coherence.json` (SKILL.md Phase 5) for the Command Center's drift panel. It writes no other file — and never an audited artifact.

## With findings

```
# Coherence Check — <date>

## Artifacts scanned
- ✓ .ai/discovery/freelancer-invoicing.md
- ✓ .ai/understanding/freelancer-invoicing.md
- ✓ .ai/features.md
- ✓ .ai/anchor.md
- ✗ .ai/architecture.md (not found)
- ✓ .ai/specs/invoice-send/prd.md
- ✗ .ai/specs/invoice-send/design.md (not found)
- ✓ .ai/context.md
- ✗ .ai/architecture/domain-model.md (not found)

## Contradictions

### 1. Target user mismatch
- `discovery/freelancer-invoicing.md:34` — "Maya, a solo freelance designer billing 3–5 clients monthly"
- `understanding/freelancer-invoicing.md:62` — user journey describes "agency owner managing 4 seats and approval flow"
- Also affects: `specs/invoice-send/prd.md:18` (persona = "agency admin")

### 2. Tier vs. PII handling
- `anchor.md:8` — `project_tier: prototype`
- `specs/invoice-send/prd.md:91` — PRD mentions "store client tax IDs and bank routing numbers"
- PII handling typically bumps tier to mvp+ per anchor's tier-bump rules.

### 3. Stale component reference
- `specs/invoice-send/design.md:42` — references component "InvoiceOrchestrator"
- `architecture/02-components.md` — no component named "InvoiceOrchestrator"; closest is "InvoiceComposer"

---
**3 CONTRADICTIONS FOUND**
```

## Zero findings

If no contradictions, the report is just the header + verdict:

```
# Coherence Check — <date>

## Artifacts scanned
- ✓ .ai/discovery/freelancer-invoicing.md
- ✓ .ai/understanding/freelancer-invoicing.md
[...]

## Contradictions
None.

---
**COHERENT**
```
