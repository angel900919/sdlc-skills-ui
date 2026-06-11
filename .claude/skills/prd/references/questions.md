# PRD question bank

Use when stuck. Pull 5–10 across the phases — never ask all of them. **One question at a time. Propose a recommended answer.** Questions tagged `[P]` prototype · `[M]` mvp · `[Pr]` production — ask only those whose tier set covers the computed tier. Skip Phase 2 if `.ai/specs/<feature>/grill-notes.md` exists (restate + confirm in one round).

## Phase 1 — feature confirmation (always)
1. What's the feature in one sentence? (Recommend: rephrase in user-outcome language, not feature-noun.)
2. Slug confirmation: *"I'll use `<kebab-slug>` for `.ai/specs/<kebab-slug>/`. Right slug?"* — and is it a row in `.ai/features.md`? If not, flag it (don't invent — `beyond_roster`).
3. Feature, refactor, or config change? PRD is for features only — refactors get ADRs, config goes straight to build.

## Phase 2 — seed interview (skip if grill-notes exist)
4. Whose problem is this feature solving? Specific person, not a segment. (Recommend: pull target user from discovery.)
5. JTBD? *"When [situation], I want to [motivation], so I can [outcome]."* (Recommend: pull from discovery, narrow to this feature.)
6. Success metric? ONE measurable number + timeframe + the source it will be read from (query / log / event). (Recommend: a feature-specific metric, usually narrower than the project one.)
7. Kill criterion? A falsifiable observation — a number + a date.
8. Out of scope? Three things this feature deliberately won't do. (Recommend: pull adjacent items from discovery's Deferred.)

## Phase 3 — tier-specific elicitation

### User stories `[M][Pr]`
9. Who's the actor? (Pull from discovery's target user; one story per persona if several.)
10. What do they want to do? One capability — the outcome, not a button click.
11. Why? The "so that" benefit in their terms. No benefit → it's a wishlist item, not a story.
12. Trace check: does each story map to ≥1 functional req? Story with no req → req missing; req with no story → req may be unnecessary.

### Risks / Assumptions `[M][Pr]`
13. What are you assuming about users that you haven't verified? (One per persona.)
14. What external system are you assuming behaves a certain way? (Name system + assumed property.)
15. The cheapest test that falsifies each assumption in ≤1 week?
16. Which assumption, if wrong, kills the feature?

### NFRs `[M][Pr]` — walk only the relevant categories; force a number + measurement
17. Latency — percentile (p50/p95/p99) + threshold + how measured?
18. Throughput — peak load (reqs/sec, events/sec)?
19. Availability — % uptime over what window?
20. Reliability — MTBF / MTTR targets?
21. Cost — per request/user/month ceiling?
22. Capacity — concurrent users, GB stored, items/user?
23. Security — named controls (TLS 1.3, bcrypt cost ≥12, rate limit N/min/IP)?
24. Privacy — data classes, retention period, deletion path?
25. Compliance — named regulation + scope?
26. Maintainability / Usability — LoC/test-coverage budget; task-completion time, WCAG level?

### Functional reqs `[M]` prose / `[Pr]` EARS
27. **[M]** Walk me through what the user does end-to-end, in their voice (trigger → steps → outcome → failure mode). Reject UI walkthroughs.
28. **[Pr]** For each capability, rephrase as EARS (see [ears.md](ears.md)): what's the trigger (When) / state (While) / flag (Where) / failure+recovery (If/Then) / always-on (Ubiquitous)?
29. **[Pr] Invariant defense:** for every project invariant touching this feature, write ≥1 Unwanted-behavior clause that catches the violation.
30. **[Pr]** Verification per req — T / I / A / D?

### Prototype-snippet inlining `[P][M][Pr]` — only if a prototype exists
31. Did a tested prototype produce a snippet that nails a decision better than prose (state machine, reducer, schema, prompt)? If no, skip — never invent code.
32. Trim to the 5–10 decision-encoding lines; inline INSIDE the requirement it crystallizes; tag `(from prototype — path)`.

### AI transparency card `[M][Pr]` (only if feature ships AI to users) — see [ai-transparency-card.md](ai-transparency-card.md)
33. What does the AI do, in one user-facing sentence? What does it NOT do? What data does it see / never see? Where does it run? Where's the opt-out?

### Open questions `[M][Pr]`
34. What three unknowns, if answered, would most reduce uncertainty before design? (Answerable unknowns — not deferred capabilities.)

## Probing follow-ups (when an answer is vague)
- "A specific example from the last 2 weeks?"
- "What number? Compared to what baseline?"
- "How would you measure that without asking the user?"
- "The smallest, cheapest test that would falsify that assumption?"
- "If you could only ship one of these capabilities, which?"
- "Is that a domain rule (`understanding/`), an architectural choice (`anchor`/`architecture`), or a feature requirement (here)?"

## Questions to refuse (capture in Notes, move on)
- What stack / db / framework / hosting? → `/anchor` or `/architect`
- What's the schema / file paths / API contract? → `/design`
- What's the JTBD and target user? *(if not yet captured)* → `/discovery`
- What does this domain term mean? → `/understand`
- Should we build this at all? → `/discovery`
