# Troubleshooting

> Symptom → cause → fix. Every entry should ideally point at the permanent check that now
> catches this class of failure (Guide 05: every failure becomes a check). Grows from real incidents.

| Symptom (what you observe) | Likely cause | Fix | Now caught by |
|---|---|---|---|
| _(example — delete)_ 401 loops after ~1h | session refresh race under load | serialize refresh; add jitter | `tests/auth_refresh.spec.ts` |
| _(example — delete)_ agent "done" but feature broken | tautological / weakened assertion | require a real functional assertion | `verify.sh` assertion-count check |
| _(example — delete)_ tool returns junk, model fabricates | unclassified tool response (empty/blocked/decoy) | classify-and-refuse before the model sees it | `honest_fetch` guard |

## When you're stuck
1. Read the trace at the failing node boundary (not the network layer).
2. Reproduce with a replay test (stub probabilistic nodes; assert on the node you changed).
3. Add the fix **and** the check; record the lesson in [`../.ai/lessons.md`](../.ai/lessons.md).
