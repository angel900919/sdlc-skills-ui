# INVEST + Gherkin

**INVEST** is a quality checklist for a well-formed user story (Independent, Negotiable, Valuable, Estimable, Small, Testable). **Gherkin** is the Given/When/Then syntax for writing testable acceptance criteria. **Primary sources:** INVEST — Bill Wake (2003); Gherkin / Given-When-Then — Behaviour-Driven Development (Dan North; Cucumber) (canon: [`../05_Conventions.md` §8](../05_Conventions.md)).

## What it's for / when to use
- **INVEST:** a *refinement* heuristic to sanity-check a story before it enters a sprint — not a gate.
- **Gherkin:** to make "done" unambiguous and **testable**, replacing vague words ("fast", "intuitive", "secure") with concrete, observable behavior.
- Use when turning a sliced story map into a ready, testable backlog (P09), and when AC become executable test scaffolding for QA automation.

## The steps
1. **Draft the story** as a placeholder for a conversation (3 C's: Card, Conversation, Confirmation) — "As a… I want… so that…" is a starter, not the deliverable.
2. **Run INVEST**: Independent? Negotiable? Valuable to a user/business? Estimable? Small (fits a sprint)? Testable?
3. **If it fails "Small"**, split *vertically* (SPIDR / Humanizing Work patterns), never frontend/backend.
4. **Write AC collaboratively** (Three Amigos: PM + dev + QA) *before* development.
5. **Express each AC in Gherkin** — `Given <context>`, `When <action>`, `Then <observable outcome>`. Declarative (what), not imperative (how).
6. **Cover the unhappy paths** — negative, boundary, security (OWASP), accessibility (WCAG) cases, not just the happy path.

## Worked micro-example
Story `US-07`: *As a returning user, I want to reset my password so that I can regain access.*
- INVEST check: Independent ✓, Valuable ✓, Small ✓, Testable ✓.
- `AC-01` — **Given** a registered user on the login page, **When** they request a reset and submit their email, **Then** a reset link valid for 60 minutes is sent.
- `AC-02` (boundary) — **Given** an expired link, **When** the user opens it, **Then** they see "link expired" and can request a new one.

## When NOT to use it
- INVEST as a rigid **gate** that blocks work (it's a conversation aid).
- Gherkin for everything — exhaustive GWT for trivial CRUD is ceremony; a plain checklist AC is fine.
- Spike/research or pure-tech enabler items that aren't user-facing behavior.

## Common mistakes / anti-patterns
- Treating the "As a…" template as a mandatory, rigid spec instead of a conversation starter.
- AC written exhaustively up front by a BA/PO **in isolation** rather than by the Three Amigos.
- Imperative Gherkin that scripts UI clicks ("how") instead of behavior ("what") — brittle and unreadable.
- Hallucinated or over-trusted AI-generated AC; AI drafts, humans validate edge cases and value.
- A strict gated **Definition of Ready** (increasingly an anti-pattern) — keep it a light readiness conversation.

## Used in phases
- **Primary:** [pm-phase-09-stories](../skills/pm-phase-09-stories/)
- **Also:** [pm-phase-10-delivery](../skills/pm-phase-10-delivery/)

## Source
- https://ones.com/blog/invest-criteria-scrum-user-stories-guide/
- https://testquality.com/gherkin-user-stories-acceptance-criteria-guide/
- https://www.humanizingwork.com/the-humanizing-work-guide-to-splitting-user-stories/
