# PM_SE — AI Prompts

> **PM_SE assumes you build WITH an AI pair.** These six patterns run inside any AI assistant — paste the prompt, attach the artifact, act on the answer. The AI's allegiance is to the product and its users, not to your first idea: collaborative, never sycophantic. #1 is the standing review board — it runs before every gate, no exceptions.

Rules of engagement (apply to every pattern):

- **Refute, don't reassure.** Praise is not evidence.
- **Cite IDs** (`SN-nn`, `REQ-<class>-nn`, `IF-nn`, `RSK-nn`) or quote the exact line — no vague findings.
- **Never invent.** Unknowns become `TODO: <what's owed, by whom, by when>`; volatile facts get "verify current".
- **One topic at a time** when the AI interviews you; show-back and confirm before moving on.

## 1. Gate red-team — before every gate

```text
You are the hostile review board for <gate, e.g. G2 Design Freeze> of <product>.
Attached: <this phase's artifacts>. Attack them — refute, don't reassure.
Assume the author was optimistic. Cite the exact ID or quote the line for every finding.
Report, in order:
1. The one question this draft cannot answer.
2. The weakest requirement, and why a check could never fail it.
3. The interface most likely to break first.
4. Every gate-checklist item NOT actually met — name the item and the consequence.
5. What the draft assumes that is written down nowhere.
Do not declare the gate passable while any item above is open.
```

## 2. Need-vs-solution challenge — P1, before any REQ exists

```text
Here is my needs table (SN-nn rows) for <product>.
Flag every row that smuggles in a solution — a technology, feature, vendor, or "how" —
and rewrite it as the outcome it serves: who is stuck, doing what job, at what cost today.
Park any genuinely mandated technology as a constraint (future REQ-C-nn), never as a need.
Then interview me, one topic at a time: who operates, maintains, regulates, pays for,
and disposes of this? Missing stakeholders are missing needs.
If I don't know an answer, record TODO: <owed, by whom, by when> — do not fill the gap.
```

## 3. SMART requirement rewrite — P2, drafting the spec

```text
Rewrite these draft requirements for <product> into REQ-table rows:
REQ-<class>-nn | "The <system> shall <one behaviour> <threshold> <condition>"
| parent SN | priority | T/I/A/D | verified-by.
Rules:
- One behaviour per row — split anything double-barrelled.
- Ban unverifiable adjectives (fast, robust, intuitive, secure, seamless, support, handle):
  replace each with a metric, or mark the threshold TODO — never leave the adjective standing.
- Method at birth: every row answers "how would a check pass or fail this?"
- Every row traces to a parent SN-nn; flag orphans, never invent parents.
Show rewrites one block at a time; confirm before moving on.
```

## 4. Interface-seam interrogation — P2, before both sides get built

```text
Here is the deployment diagram for <product>. For EVERY arrow crossing a box or trust
boundary, interrogate me one seam at a time until its IF-nn row is complete:
- Endpoints: what talks to what?
- Transport + protocol, and message format with a NAMED schema —
  "JSON over HTTP" is not an answer.
- Auth: how does each side prove who it is?
- Cadence, and latency/timeout budget — from which REQ-P, or TODO?
- Failure mode: timeout, retry, offline buffer, or degrade —
  what happens when the other side is gone?
- Versioning: how do both sides evolve without breaking?
Flag any seam where both sides are being built before the row is filled.
```

## 5. Trace-gap finder — G2/G3, before calling it covered

```text
Attached: the spec REQ table and verification matrix for <product>.
Walk the spine SN → REQ → IF → SLO and report every gap, citing IDs:
1. Orphan REQs — no parent SN (scope creep: cut or justify).
2. Uncovered SNs — no REQ satisfies them (broken promises).
3. REQ rows missing a T/I/A/D method or a named check — bare "Manual" counts as missing.
4. Matrix rows with a method but no evidence link.
5. IF-nn seams in the diagram but not the table, or vice versa.
The SLO hop applies only from G4 onward — do not report missing SLOs before launch.
Output: Gap | ID | Fix required before <G2/G3>.
Coverage ≠ correctness — if the checks look too weak to fail, say so.
```

## 6. Pre-mortem — P0/P1, seeding the risk register

```text
It is launch day for <product> and it failed — badly enough that we killed it.
Write the story of why, three separate times:
1. The market killed it — nobody wanted it, or nobody would pay.
2. The build killed it — never hit the bar, a seam broke, a dependency never shipped.
3. We killed ourselves — cost, burnout, a risk we knew about and ignored.
[AI] Add a fourth: the model failure that did it (drift, injection, cost creep,
     vendor/model change).
[HW] Add a fourth: the hardware failure that did it (part EOL, thermal/battery event,
     unpatchable fleet, failed cert).
Convert every cause into a register row:
RSK-nn | if <cause> then <event>, leading to <impact> | L×I | trigger | mitigation.
Rank by which is cheapest to prevent right now.
```
