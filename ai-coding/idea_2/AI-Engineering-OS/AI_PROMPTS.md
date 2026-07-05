# AI-Engineering-OS — Prompt Patterns

> **Seven reusable prompts that run the loop.** Paste the prompt, attach the artifact, act on the answer. They are the operational edge of the five guides — each one implements a never-skip-spine item. The agent's allegiance is to the working system and its users, not to your first idea: collaborative, never sycophantic.

Rules of engagement (apply to every pattern):

- **Refute, don't reassure.** Praise is not evidence.
- **Cite `file:line`** or quote the exact line — no vague findings.
- **Never invent.** Unknowns become `TODO: <what's owed, by whom, by when>`; volatile facts (model pricing, vendor terms, APIs) get "verify current."
- **Show evidence, not claims of success.** "It works" without a run is not done.

> **These now run as slash-commands.** Every pattern below is also an executable, chainable command in [`.ai/commands/`](.ai/commands/) — paste the prompt for a one-off, or run the command to drive the whole loop with artifacts under `.ai/plans/<slug>/`. Map: #1 → `/3-research` · #2 → `/7-review` · #3 → `/eval-judge` · #4 → `/skill-router-test` · #5 → `/extract-skill` · #6 → `/incident-to-test` · #7 → `/1-align`. The commands also add the CRISPY in-between stages (`/2-questions`, `/4-design`, `/5-outline`, `/6-plan`).

## 1. Goal-blind research — before any plan

```text
You are researching, not solving. Do NOT propose a solution.
Task context: <ticket / one-line goal>. Codebase: <path or repo>.
Answer these questions about how the system works TODAY, each with file:line citations:
1. Where does <the relevant behaviour> currently live, and how does it flow?
2. What patterns/conventions does this area already follow?
3. What will this change touch — and what must NOT break (invariants)?
4. What's genuinely unknown? Mark each [needs human].
Rules: report facts only, no "we should", no recommendations. If you're inferring, say so.
Output a ~200-line design doc: Current state / Desired end state / Patterns to follow / Open questions.
```

## 2. Fresh-context adversarial review — before merge

```text
You are a hostile reviewer seeing this diff for the FIRST time. The author was optimistic.
Attached: the diff + the spec/acceptance criteria it claims to satisfy.
Verify by REASONING FROM THE CODE (and by running it if you can), not by trusting the description.
Report, in order:
1. The one requirement this diff does NOT actually meet — cite the line.
2. The most likely bug or edge case (empty/null, concurrency, failure path), with a concrete trigger.
3. Any test that would pass even if the feature were broken (tautological/weakened assertions).
4. Anything the diff assumes that is written down nowhere.
Do not approve while any item above is open. Show the evidence for each finding.
```

## 3. The five-part eval judge — grading model output at scale

```text
You are <role WITH domain context, e.g. a senior credit-risk analyst>.
Decide if the <response> below PASSES or FAILS on ONE dimension: <name the single dimension>.
PASS means: <explicit, testable criteria>.  FAIL means: <explicit criteria>.
<response>{{ the output under test }}</response>
Examples:
  PASS → "<a real labelled passing example>"
  FAIL → "<a real labelled failing example>"
Reason briefly, THEN output strict JSON: {"label": "PASS"|"FAIL", "explanation": "..."}.
If you cannot tell, return {"label": "UNKNOWN", ...} — never guess.
```
*(Validate this judge against ~50 human labels with precision/recall before trusting it — see Guide 05.)*

## 4. Skill-description router test — before shipping a Skill

```text
Here is a Skill description (frontmatter): "<paste description>".
Without reading the body, answer:
1. In your own words, WHAT does this skill do and WHEN would you load it?
2. Give 3 user messages that SHOULD trigger it, and 3 near-misses that should NOT.
3. Is the description first-person or ambiguous anywhere? Is it missing trigger terms users actually type?
If your answer to (1) is fuzzy or over-broad, the description is wrong — rewrite it and show the fix.
```

## 5. Gotcha extraction — turning transcripts into a Skill

```text
Attached: a session transcript (or a set of PR review comments) for <area>.
Find every point where the model's default behaviour was WRONG and a human corrected it —
the landmines its training data doesn't know about. Ignore anything it already got right.
For each: state the gotcha in one imperative line, and whether it belongs in
(a) a Skill body, (b) an enforced rule/lint, or (c) coding-standards.md.
Output the smallest set of load-bearing lines — no coverage of what the model already knows.
Then draft a SKILL.md (third-person description + must-not-miss body rules only).
```

## 6. Incident → regression test — before closing any incident

```text
Attached: the trace/logs of a production failure in <system>.
1. Root-cause it at a specific node boundary (which call, what input, what wrong output).
2. Classify: prompt/model issue, tool issue, data issue, or harness/logic bug.
3. Write the check that FAILS pre-fix and PASSES post-fix — an eval case OR a deterministic spec
   (stub the probabilistic nodes; assert on the node that changed, never on a stubbed one).
4. Name the guardrail (in code, OUTSIDE the model) that makes this class of failure loud next time.
The incident is not closed until (3) exists and is in the suite. Show the failing-then-passing check.
```

## 7. Spec red-team ("grill me") — before writing a plan

```text
Interview me to pin down <feature/change> before any code. ONE question at a time.
Always offer your own recommended answer with each question, and say why.
Cover: the actual user problem (not the solution), success criteria, scope + explicit out-of-scope,
the failure/edge behaviour, and which existing modules this touches.
When I don't know, record TODO: <owed, by whom> — do not fill the gap for me.
When we're aligned, write the destination doc: Problem / Solution / User stories /
Implementation decisions / Testing decisions / Out-of-scope. Confirm before you write it.
```

---

*Each prompt implements a spine item: #1 alignment-before-code, #2 fresh-context review, #3 layered evals, #4–#5 gotchas-as-Skills, #6 failure-becomes-a-check, #7 upstream alignment. See [`PLAYBOOK.md`](PLAYBOOK.md) and the [`guides/`](guides/).*
