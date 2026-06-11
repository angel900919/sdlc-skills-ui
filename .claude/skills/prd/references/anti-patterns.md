# PRD anti-patterns

Scan the draft against this before reading it back (Phase 5).

| Anti-pattern | Symptom | Fix |
| :-- | :-- | :-- |
| Architecture leakage | "Use Redis to cache X" / "Build with Next.js" | Strip. Stack lives in `anchor.md`. Capture in Notes if a real constraint, else drop. |
| Design leakage | File paths, class names, API endpoint URLs | Move to `/design`. PRD names capabilities, not implementations. |
| Vibes metric | "More engagement", "users love it" | Force metric + baseline + target + timeframe + source. |
| Adjective NFR | "Fast", "secure", "reliable" | Force number + threshold + measurement method. |
| Compound EARS clause | "When X, the system shall do A AND B" | Split — one behavior per clause. |
| Risk = wishlist | "User might want feature Y" | Risks are unverified beliefs, not feature requests. Reframe or drop. |
| Open questions = open scope | Capabilities filed under "open questions" | Open questions are unknowns to *answer*, not capabilities to *defer*. Move to Scope/Out. |
| AI card for engineers | "Uses GPT-4o, temp 0.7" | Rewrite in user-facing language — it's read on a settings page. |
| User story without actor/benefit | "Users can send invoices" | Force `As a <actor>, I want <feature>, so that <benefit>` — all three parts; actor is the END USER. |
| Prototype-snippet dump | 50-line code block | Trim to the 5–10 decision-encoding lines; rest goes to `/design`. |
| Invented code as "prototype" | API URLs that don't exist yet | Only snippets from a *tested* prototype qualify. Inventing code is implementation leakage. |
| Snippet without provenance | Code block, no `(from prototype)` tag | Tag it — otherwise readers can't tell locked-in from speculative. |
| Invariant violation | A req breaks an architecture invariant | Revise the req OR run `/architect` in update mode. Never silently violate. |
| NFR contradicts characteristic | Feature `availability 99.99%` vs project `99.5%` | Align the NFR, or write a per-feature ADR justifying the exception. |
| Component-less feature | Capabilities fit no component in `02-components.md` | Note it; `/design` will refuse with NEEDS-ARCHITECTURE-UPDATE. PRD still written so work isn't lost. |
| Ignoring architect | Writing against `anchor.md` only when architecture exists | Load architecture — invariants + top-3 characteristics are load-bearing. (At mvp+, missing architecture is BLOCKED-ON-ARCHITECTURE.) |
| Tier downgrade ignored | "Make this prototype" on a payments feature | Warn loudly; honor only on reconfirmation. |
| Brief sprawl | PRD > tier cap | The feature is two features. Split, run `/prd` twice. |
| PRD as wishlist | 30+ scope items | Cut to JTBD-critical; rest to Out-of-scope or future PRDs. |
| Inventing a feature | `<feature>` not on the roster, written anyway silently | Surface it; record `beyond_roster: true`; suggest `/feature-map` to add it. |
