# Feedback loops — the Phase 1 deep material

Phase 1 of `/diagnose` is the whole skill: a fast, deterministic, agent-runnable
pass/fail signal for the bug. This file is the construction menu and the techniques for
sharpening it. **Build the right loop and the bug is 90% fixed.**

## Ways to construct a loop — try them in roughly this order

Cheapest / sharpest first. Stop at the first one that reaches the **real** bug.

1. **Failing test** at whatever seam reaches the bug — unit, integration, or e2e.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with a fixture input, diffing stdout against a known-good snapshot.
4. **Headless browser script** (Playwright / Puppeteer) — drives the UI, asserts on
   DOM / console / network.
5. **Replay a captured trace.** Save a real request / payload / event log to disk and
   replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked
   deps) that exercises the bug path with a single function call.
7. **Property / fuzz loop.** For "sometimes wrong output", run 1000 random inputs and
   look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit, dataset,
   version), automate "boot at state X, check, repeat" so you can `git bisect run` it.
9. **Differential loop.** Run the same input through old-vs-new (or two configs) and
   diff the outputs.
10. **HITL bash script.** Last resort. If a human must click, *drive them* with a
    structured loop script so the signal still feeds back to you mechanically — capture
    their observed output and assert on it. Don't fall back to unstructured "try it and
    tell me what you see."

## Iterate on the loop itself

Treat the loop as a product. Once you have *a* loop, ask:

- **Faster?** Cache setup, skip unrelated init, narrow the test scope.
- **Sharper signal?** Assert on the *specific* symptom, not "didn't crash".
- **More deterministic?** Pin time, seed RNG, isolate the filesystem, freeze the network.

A 30-second flaky loop is barely better than no loop. A 2-second deterministic loop is a
debugging superpower.

## Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger 100×,
parallelise, add stress, narrow timing windows, inject sleeps. A 50%-flake bug is
debuggable; a 1% one is not — keep raising the rate until it is, *then* go to Phase 3.

## Performance branch

For perf regressions, logs are usually the wrong tool. Instead:

1. Establish a **baseline measurement** — timing harness, `performance.now()`, a
   profiler, or a query plan.
2. **Measure first, fix second.** Confirm where the time actually goes before changing
   anything.
3. **Bisect** against the baseline metric (treat "slower than baseline by N" as the
   pass/fail signal, exactly like a failing test).

## When you genuinely cannot build a loop

Stop and say so explicitly — do **not** proceed to hypothesise without a signal. List
what you tried, then ask the user for one of:

- access to whatever environment reproduces it,
- a captured artifact (HAR file, log dump, core dump, screen recording with timestamps),
  or
- permission to add temporary production instrumentation.

That outcome is the `BLOCKED-NO-REPRO` verdict — return it rather than guessing.
