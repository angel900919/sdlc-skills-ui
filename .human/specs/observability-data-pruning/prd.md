# Cleaning up old observability data — the plan, in plain words

**Verdict: READY-FOR-DESIGN.**

**The problem:** the Command Center keeps a record of everything — every hook event, every transcript line, every token count — forever. On a daily-driver machine that database only grows.

**What we'll build:** a cleanup you control. See what's taking the space, pick a cutoff (we'll suggest 30 days), get shown exactly what would be deleted *before* anything happens, then watch it report rows removed and disk space actually given back. The cleanup itself gets logged — even deletion is observable. Anything belonging to a session that's still running is untouchable, whatever cutoff you pick.

**What we're deliberately not doing:** touching Claude Code's own transcript files on disk (not ours), auto-scheduled cleanup (v1 is always your deliberate act), or deleting session history itself (only its bulky old records).

**How we'll know it worked:** the first real cleanup on your months-old database should give back at least a fifth of the file size — the feature itself reports the numbers.

**The honest kill switch:** if you never run it by 2026-09-13, we remove the button and write down "keep everything forever" as the real policy.

**Top risks we're watching:** reclaiming space safely while the app is live; making sure you understand old search results go away with the old records (the confirm screen says so in numbers).

Machine contract: [.ai/specs/observability-data-pruning/prd.md](../../../.ai/specs/observability-data-pruning/prd.md)

*(Autonomous dogfood note: derived from the project's own records, not a live interview.)*
