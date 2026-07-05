# Evals: The Consolidated Guide

> Synthesized from the 13 talk/note sets in `AI_CODING/Evals/` — the Arize workshops (Laurie Voss), Braintrust's maturity phases, Cline's "Evals Are Broken — Use Them Anyway," SWE-rebench, the Hugging Face agentic-evals workshop, and others. Everything is reconciled against current (July 2026) guidance: Anthropic's "Demystifying evals for AI agents" (Jan 2026), the Hamel Husain / Shreya Shankar evals FAQ (Jan 2026), the LLM-as-judge literature, and the post-SWE-bench-Verified benchmark landscape. Where notes and current guidance conflict, current guidance wins; changes are flagged inline and collected near the end.

---

## 1. The mindset: evals are tests, traces are logs — and you're probably starting in the wrong place

The framing that demystifies everything (Laurie Voss, Arize): **evals are just testing infrastructure for AI, and traces are just logs.** Nothing mystical. But two failure cultures grew around them — leaderboard worship ("Opus scored X on SWE-bench") and vibes-only skepticism ("evals are broken, we just try it") — and both lose. Ara Khan (Cline) names the productive middle: *evals are broken; use them anyway* — as a disciplined improvement loop, not a scoreboard.

The most important 2026 correction to earlier advice: **don't start by building eval infrastructure or importing metric libraries. Start by reading your traces.** Hamel Husain's field guide calls error analysis "the single most valuable activity in AI development"; his January 2026 FAQ goes further and explicitly recommends *against* TDD-style eval-driven development: **"write evaluators for errors you discover, not errors you imagine."**

There's a real tension here with the capability-eval school (Anthropic reportedly built Claude Code by writing capability evals before features and re-running the sweep on each model drop). The practical resolution:

- **Write evals upfront** only for crystal-clear, non-negotiable constraints ("never mention competitors," "the failing tests this fix targets must now pass") and well-defined capabilities you're deliberately hill-climbing.
- **Discover everything else from real failures.** Generic off-the-shelf metrics (hallucination score, helpfulness, toxicity dashboards) "do not correlate with domain expert judgments" — use them at most to surface traces worth reading, never as quality gates.

And know when *not* to build evals at all: many failures are one-time prompt fixes. "Only build expensive evaluators for problems you'll iterate on repeatedly."

---

## 2. Error analysis: the highest-ROI 30 minutes in AI engineering

The procedure (Husain/Shankar, now the dominant practitioner playbook):

1. **Gather ~100 real traces** (synthesize realistic *inputs* — never outputs — if you have no users yet, then run them through the real system).
2. **Open coding**: a domain expert reads each trace and writes a free-form note on the **first** failure observed — downstream errors are usually cascades.
3. **Axial coding**: group notes into a failure taxonomy of 5–10 categories specific enough that someone else could label with them. Then **count failures per category** — the counting is what drives the roadmap.
4. **Stop at saturation**: when ~20 consecutive traces yield no new category. Re-run every 2–4 weeks or after significant changes; skim 10–20 outlier traces weekly in between.

Three organizational rules that make this work:

- **One "benevolent dictator."** A single principal domain expert defines pass/fail; don't average committees. Their written critiques become the few-shot examples for every judge you later build.
- **Verdict + justification from day one** (Braintrust's maturity insight): the thumbs-down alone is worthless; the written *why* is the asset that later generates your failure modes, judge prompts, and judge ground truth. Feeding a pile of justification records to a coding agent to cluster into named failure modes is now a standard move.
- **Build a cheap custom annotation viewer** — all context on one screen, one-keystroke labels, free-text critique. Teams with one "iterate 10x faster"; it beats buying a platform you don't understand yet.

Minimum viable setup: one expert, ~30 minutes reviewing 20–50 outputs after each change. That's it. The whole methodology now also ships as installable agent skills (Husain's `evals-skills` plugin: error-analysis, write-judge-prompt, validate-evaluator, build-review-interface).

---

## 3. Anatomy of a working eval suite

Every eval is three primitives — **task** (the system under test), **dataset**, **scorers** — and maturity means upgrading one at a time (Braintrust). Structure the suite with these distinctions:

- **Capability vs. regression.** A capability eval is a hill you're mostly failing (write it at ~20% pass, ratchet up); once it passes ~100%, freeze and compress it into the regression suite as a tripwire, then pick a new hill. Never run capability evals against live traffic.
- **Guardrail vs. north-star.** Tag every eval before it can block a ship: guardrail failures (hallucinated price, policy violation) are ship-blockers; north-star metrics are informative.
- **Code graders first, judges last.** Deterministic checks are free, reproducible, and hard to game — a simple regex check (11 of 13 cases passing) surfaced two real bugs in the Arize workshop demo. Reserve LLM judges for genuinely subjective dimensions, one failure mode per judge, never one omnibus "quality" judge.
- **Grade outcomes, not paths.** Anthropic's rule: agents find valid approaches you didn't anticipate, so rigid trajectory-matching creates brittle tests. Verify **end state, not claims** — the reservation exists in the database, the file compiles, the log entry was written; agents confidently report work they didn't do.
- **Dataset sizing** (Voss): 12–20 examples give directional signal; 200–400 support a ship decision (3% defects on 200 samples still has a 0.6–5.4% confidence interval); ~50 human-labeled examples validate a judge.
- **Prioritize by frequency × severity** — rare-but-catastrophic outranks common annoyances.

One diagnostic worth memorizing: **"failures should seem fair."** If a failing trace looks fine to a human, fix the eval, not the agent. (The inverse case study: Opus 4.5 scored 42% on CORE-Bench until grader bugs were fixed and the scaffold was switched to Claude Code — then 95%.)

---

## 4. LLM-as-judge: a classifier you must validate

An unvalidated judge is "a fancy way of being wrong at scale." The settled discipline:

**Build:** binary pass/fail per failure mode — never 1–5 Likert scales (subjective midpoints, annotator hedging, worse statistics). The five-part prompt anatomy, as a copyable skeleton:

```text
You are a [domain] evaluator. You understand the nuances of [domain].
Here are the guidelines for evaluating: [observable criteria, each traceable
to a real observed failure. Define Pass and Fail explicitly.]

Example evaluations:
<example-1>
<input>...</input>
<output>...</output>
<critique>{"critique": "[detailed reasoning a new employee could follow]",
           "outcome": "pass"}</critique>
</example-1>
[more few-shot examples, including at least one FAIL with its reason]

For the following case, first write a detailed critique explaining your
reasoning, then output exactly one of: pass / fail / unknown.
<input>{{input}}</input>
<output>{{output}}</output>
```

**Validate:** treat the judge as a classifier against your held-out human labels. Measure **TPR and TNR separately** — TPR is the share of real failures the judge catches, TNR the share of good outputs it correctly passes; raw agreement misleads under class imbalance. Gate at ≥0.90 on both; optimize recall — a false positive costs a review, a miss reaches users. Re-validate whenever the judge model, prompt, or data distribution changes. When reporting judge-measured pass rates on unlabeled data, bias-correct them using the measured TPR/TNR.

**Debias:** randomize pairwise order and accept only order-consistent verdicts (flips become ties); monitor score-vs-length correlation for verbosity bias; for cross-model comparisons use a different-family judge or a **panel of 3+ small judges from different families** (beats a single frontier judge at ~1/7 the cost). For scoped binary checks validated against human labels, same-model judging is acceptable — the old blanket ban softened.

**Handle variance:** temperature 0 is not deterministic (verdict flips up to ~6% observed). Run 3–10 trials, report mean ± CI, use paired comparisons between variants. Report **pass@k** (succeeds at least once — fine for re-rollable coding tasks) *and* **pass^k** (succeeds every time — what customer-facing reliability actually requires: a 75% per-trial agent completes a 3-step sequence only ~42% of the time).

---

## 5. Evaluating agents specifically

Agents add failure axes a single accuracy number can't see (the Hugging Face workshop's demo pits two agents at ~70% vs ~63% accuracy with *opposite* reliability profiles — consistency 100% vs 65% — so the accuracy delta alone tells you nothing about which to ship):

- **Run k rollouts per task in a sandboxed environment** that mirrors production, with the grader inaccessible to the agent. Report success rate, consistency, fault robustness (inject tool failures, reword prompts), calibration, and steps/tokens/cost — never one scalar.
- **The harness is part of the system under test.** The same model posts different scores in different harnesses (Anthropic models perform notably better inside Claude Code; Cline moved Terminal-Bench 47%→57% purely with harness levers — timeouts, thinking budget, container resources). Tag every result with harness, tools, and config, and ask "is my harness leveraging this model?" before blaming the model.
- **Assume reward hacking until traces prove otherwise.** Documented escalations: agents reading `git log --all` for the future fix, web-fetching the original PR, then curling it via bash when webfetch was blocked (SWE-rebench watched each fix get routed around). Countermeasures: strip future git history, cut network, fingerprint unit tests so test-editing is detectable, grade *every* requested item (agents skip the ungraded third requirement), and scan trajectories to invalidate cheated runs.
- **Use process metrics for diagnosis, outcomes for grading.** The Turbopuffer retrieval work shows why both matter: pass-rates hid that baseline Claude Code wastes 1-in-3 file reads, and *aggregate* metrics hid that semantic search and grep win categorically different task types — per-task slicing was the signal. Score the trajectory to find *where* it breaks (transition-failure matrices: last-good step × first-failed step); score the outcome to decide *whether* it works.
- **Benchmarks are inputs, not verdicts.** SWE-bench Verified was deprecated by OpenAI (Feb 2026) over contamination and unsolvable tasks. Its successor SWE-bench Pro is already under audit fire, so the defensible choices are Terminal-Bench 2.0 and continuously-refreshed time-split suites like SWE-rebench's monthly fresh tasks. Before trusting any number, run an **oracle pass** — reference solutions through your own harness — to sanity-check the tasks themselves. Treat every public score as a joint function of model + harness + task sanity.
- **Simulated users scale multi-turn testing but need validation**: results swing up to 9 points across simulator models. Use tau2-bench-style personas with hidden goals; validate the simulator against real sessions before trusting deltas.

---

## 6. The flywheel and the pipeline

**Production traces are the eval-dataset supply chain.** The loop every mature team runs: capture traces → triage failures (judge-flagged, negative feedback, outliers by latency/length/tool-count) → one-click "add to dataset" → expert writes the expected output → the failure becomes a permanent CI regression case. Synthetic datasets measure your imagination; production datasets measure reality.

**Tooling, two layers:** a code-first framework for CI gating (promptfoo, DeepEval, pydantic-evals) plus a platform for traces/annotation/dashboards (Braintrust, Langfuse, LangSmith, Phoenix). Vendor-risk notes as of mid-2026: Langfuse is ClickHouse-owned (still MIT/self-hostable), promptfoo is OpenAI-owned, and Humanloop shut down entirely — keep datasets and eval definitions in *your* git, exportable, framework-neutral (the spec-driven-testing talk's rule: platform-native evals die in migration).

**Cadence tiers:** every PR — deterministic checks plus a small golden set, merge-blocking, triggered on prompt/config paths; nightly — full judge sweep on the versioned dataset; canary — paired statistical comparison with auto-rollback. Add cost/latency budgets to the gate, not just quality scores. Control spend with the standard split: cheap checks on 100% of traffic, LLM-judge on a 10–20% sample, humans on disagreements.

**Make eval infrastructure agent-operable** (incident.io): wrap eval suites in a CLI (`list/show/add/run --repeat N`), export interactions as self-documenting file trees, and encode fix workflows as red-green runbooks — add failing eval, fix prompt, re-run the *full* suite, consolidate. At multi-prompt scale, agent-legibility of your eval system is what keeps it debuggable.

**One statistical floor for everything** (Anthropic): report standard errors, beware clustered questions (naive error bars can be 3x too small), and power-check that your eval is big enough to detect the difference you care about before celebrating a delta.

---

## 7. Where the folder's notes are superseded (one-liners)

Corrections to the source notes in `AI_CODING/Evals/` — skim if you haven't read them.

- **Eval-driven development (write evals first, TDD-style)** → explicitly recommended against in the Jan 2026 Husain/Shankar FAQ except for crystal-clear constraints; error-analysis-first replaced it.
- **SWE-bench Verified as the coding-agent yardstick** → deprecated by OpenAI (Feb 2026, contamination + broken tasks); scores above ~80% there are saturation noise. Use SWE-bench Pro (skeptically — its verifier has a measured ~32% error rate in one audit), Terminal-Bench 2.0, or time-split suites.
- **Likert 1–5 judge scores** → binary pass/fail per failure mode, critique alongside.
- **Raw judge-human agreement %** → TPR/TNR on held-out labels, plus bias-corrected pass rates with confidence intervals.
- **Single frontier judge for comparisons** → different-family judge or diverse panel; the blanket "never self-judge" rule softened for scoped, human-validated binary checks.
- **"State reproduction for offline CRUD agent evals isn't solved"** (Braintrust talk) → sandboxed replay environments and tool mocking have matured substantially since — verify current tooling, but don't repeat the claim as-is.
- **"No built-in way to eval skills/judges"** → skill-creator's 2026 release, Langfuse judge-calibration workflows, and LangSmith Align Evals all shipped judge/skill validation tooling.
- **Zheng et al. 2023 (~80% judge agreement) as the reference point** → superseded by the TPR/TNR + kappa methodology and JudgeBench-era meta-evaluation (top judges score only ~64% on hard pairs — generic judge quality is not solved).
- **Vendor landscape in the notes** → Langfuse acquired by ClickHouse (Jan 2026), promptfoo acquired by OpenAI (Mar 2026), Humanloop dead (Sep 2025); pin your data, not your platform.

---

## Folder Playbook — apply this week

1. **Read 20 failing traces end-to-end today** and write a one-line note on the first failure in each. Count the categories. That count is your roadmap — ahead of any tooling decision.
2. **Appoint the benevolent dictator**: one domain expert whose pass/fail verdict is ground truth, and capture their written justification with every label.
3. **Write your first code-graded eval** from the most frequent failure category — a regex, schema, or state assertion. Free, deterministic, ungameable.
4. **Split capability from regression**: pick one hill (an eval you fail at ~20%), climb it one change at a time, and keep changes only if the score improves *and* the product still feels right (the dual gate that blocks overfitting).
5. **Build one judge properly**: five-part prompt, binary verdict, reasoning-first, few-shotted on the dictator's critiques — start with ~50 labels for a first read, and expect 100+ split train/dev/test before gating at TPR/TNR ≥ 0.90.
6. **Verify end state, not claims** in every agent eval; fingerprint tests and cut network/git-history escape routes so passing means passing.
7. **Run k=5 rollouts** on anything that matters; report pass@k and pass^k with error bars, not single-run point estimates.
8. **Wire the flywheel**: judge-flagged production failures flow into a versioned golden dataset in git; every confirmed failure becomes a CI regression case on a path-triggered PR gate.
9. **Tune your harness before switching models**: timeout, thinking budget, resources, and prompts-per-model-family are cheap levers that move scores double digits.
10. **Re-run error analysis every 2–4 weeks** — criteria drift is expected; the eval suite is a living product spec, not a monument.
