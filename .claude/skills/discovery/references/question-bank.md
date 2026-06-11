# Discovery question bank

Pull from these when a round stalls. Ask one or two at a time, in plain English, and restate each answer before moving on. Each section maps to a phase in the procedure.

## Problem validation
- "Who specifically feels this pain? Picture one real person — what's their role, and what makes it hard for *them*?"
- "What do they do about it today — a tool, a spreadsheet, a workaround, nothing?"
- "Why isn't that good enough?"
- "How often does this come up — every day, or once a quarter? How much does each time cost them — minutes, money, mistakes?"
- "What's the next-best alternative, and why would yours win?"

**Build / buy / ignore filter (apply as information, not a veto):**
- An existing tool already covers ≥80% → a feature request to that tool may beat a new build. Tell the user.
- Pain is rare and a spreadsheet solves it → say so.
- No real person can be named who feels this → lean INVESTIGATE: talk to a user first.

## Jobs-to-be-Done
Shape it as: **When [situation], I want to [motivation], so I can [expected outcome].**

- Reject feature-talk. "A button to export PDFs" is a feature, not a job.
- Good: "When I finish a billable session, I want to send the client an invoice in under 30 seconds, so I can get paid the same week."
- If after 3 tries the JTBD is still feature-shaped or fuzzy, name it: "I can't get a clean job out of this — that's a signal the problem isn't ready." Consider INVESTIGATE.

## Success metric (one number, with a timeframe)
Force the shape: **metric / baseline / target / timeframe / source.**

- Reject: "engagement", "satisfaction", "users love it", "more usage", targets with no baseline, metrics with no timeframe, anything not observable within ~30 days.
- Accept: "Median time-to-invoice drops from 12 min to under 90s within 30 days, measured by timestamps in the sessions table." / "≥50% of week-1 signups do a second session within 7 days, from the event log."

## Kill criteria (≥1 falsifiable claim)
Ask: **"What would have to be true in the first week or two for you to walk away?"**

- Falsifiable = an outside observer looking at the data could agree it happened, no judgment call.
- Reject: "if it doesn't work", "if users don't like it", "if we don't get traction" (define it).
- Accept: "If fewer than 5 of 10 test users return for a second session in week 2." / "If we can't find 10 people willing to do a 15-min interview by end of week 1."
- If after 3 tries no falsifiable criterion exists, that absence is itself a strong KILL/INVESTIGATE rationale — record it.

## Scope
- **v0.1 — 3 to 5 capabilities.** The smallest thing that delivers value OR fails informatively. Push items that don't serve the JTBD into Deferred.
- **Deferred — each with a `YYYY-MM-DD` revisit date** and a trigger ("after 50 active users").
- **Hard non-goals — 3 to 5.** Things it will NEVER do, even at v1.0.

## Constraints, open questions, cost
- Constraints (non-technical): time, budget, team, regulatory (HIPAA/GDPR/SOC2), ethical. **No tech-stack questions.**
- Open questions: 3–5 unknowns that, if answered, most reduce uncertainty.
- Cost of delay (3 months): what happens if not built — lost revenue, competitor wins, moment passes, nothing.
- Cost of being wrong: undo cost — a wasted week vs a wasted quarter.
- Reversibility: easy | moderate | hard.

## Research prompts (for sub-agents)
When dispatching an Explore/general-purpose sub-agent in Phase 2, ask it to return:
- "List existing tools/products that solve or partly solve: <JTBD>. For each: what it does, pricing tier, and the gap a new build could exploit. Cite sources."
- "Is there a regulatory or compliance landscape around <domain/data type>? Name the relevant regimes briefly."
- "Rough signal on audience size / demand for <problem> — search trends, communities, complaints. Cite sources."
