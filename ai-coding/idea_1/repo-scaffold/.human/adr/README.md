# Architecture Decision Records

The human-facing record of significant, hard-to-reverse decisions and *why* we made them. Numbered,
dated, never deleted (superseded ones are marked, not removed).

- One file per decision: `NNNN-title.md` (from `TEMPLATE.md`).
- Write an ADR for anything architectural, cross-cutting, or expensive to undo. Small/reversible calls
  can just be a line in `.ai/decisions/` instead.
- ADRs are also **agent guardrails**: `AGENTS.md` instructs agents to check ADRs before architectural
  choices, never contradict an accepted one, and propose a new ADR before implementing a new direction.
- For agent-made decisions, record model version and human-review status.

Relationship to `.ai/decisions/`: that folder is the terse, always-nearby log agents read; this folder is
the fuller human narrative. Significant decisions live in both; trivial ones only in `.ai/decisions/`.
