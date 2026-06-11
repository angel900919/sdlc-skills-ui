# /coherence-check anti-patterns

Patterns to reject. Referenced from `SKILL.md` Critical rules — backstops the explicit numbered rules.

| Anti-pattern | Symptom | Fix |
| :--- | :--- | :--- |
| Single-source finding | "This PRD feels vague" with one citation | Drop. Contradictions need two citations. |
| Quality judgment | "Discovery's metric is weak" | Drop. Not this skill's job; run `/discovery` again if you want to revise. |
| Tier-bump speculation | "Maybe this should be mvp" with no PRD evidence of money/PII/SLA | Drop. Only emit when PRD literally mentions a trigger condition. |
| Stale-reference false positive | Flagging a component that exists under a slightly different heading | Read the artifact fully before emitting; case-insensitive substring match isn't enough. |
| Fix suggestions inline | "→ update discovery to match understanding" | Remove. Skill reports, user resolves. |
| Modifying files | Using `Edit` or `Write` "just to fix a typo" | Forbidden. Even one write violates the contract. |
| Hallucinated citations | `discovery.md:34` when line 34 says something different | Re-read before emitting. If unsure, drop the finding. |
| Inventing artifacts | Reporting on a domain-model.md that wasn't found | Use Phase 0 inventory as the source of truth. |
