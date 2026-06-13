# Showing how old your oldest data is — the plan, in plain words

**Verdict: READY-FOR-DESIGN.**

**The problem:** the Storage panel already shows the oldest record in each pile, but as a raw date like `2026-04-12`. Yet when you clean up, you pick a cutoff in *days* — "older than 30 days." So you end up doing date subtraction in your head just to know whether 30 days will catch anything.

**What we'll build:** show that oldest record as an age — `today`, `1 day ago`, `63 days ago` — right where the date is now. The exact date stays reachable; we're just adding the plain "how long ago" so the cutoff choice is obvious at a glance.

**What we're deliberately not doing:** relative times anywhere else in the app, hours/minutes precision (cutoffs are in days), or a live-ticking counter.

**How we'll know it worked:** the next time you decide a cutoff, you can read the oldest-data age in days straight off the panel — no mental math. (It's a small display nicety, so there's no number to log; the test is whether it reads cleanly.)

**The honest kill switch:** if by 2026-09-13 the days-ago label feels like noise rather than help, we put the bare date back and call date-only the deliberate choice.

**Top risks we're watching:** keeping the age and the date consistent (both come from the same value), and making sure clock skew never shows a negative "−2 days ago".

Machine contract: [.ai/specs/oldest-record-age/prd.md](../../../.ai/specs/oldest-record-age/prd.md)

*(Autonomous dogfood note: derived from the project's own records — the Storage panel source and the prune feature's spec — not a live interview. This feature's gap was surfaced by the verifier subagent earlier this session.)*
