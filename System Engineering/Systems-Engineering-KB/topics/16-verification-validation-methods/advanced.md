# Verification & Validation Methods — Advanced concepts

## Advanced concepts

- **The three verification modes form a ladder of cost and confidence.** The source's own summary lines compress this: *inspection detects issues without execution; reviews ensure compliance before implementation; testing verifies performance under real conditions* (source: m4-vv). Read in order, they move from cheapest/earliest (static examination of one artifact) through structured group evaluation to the most expensive/latest (executing the system) — so issues are meant to be caught as far left as possible.
- **Acceptance testing is deliberately dual-natured.** It appears as the fourth *testing level* (a verification ladder) and as the umbrella for the *validation* acceptance types (UAT/OAT/FAT/SAT/regulatory) (source: m4-vv). This is not redundancy: it is the precise point where checking-against-spec hands off to checking-fitness-for-use, which is why the lesson review folds "requirement-based testing" into verification but "UAT" into validation (source: m4-review).
- **OAT validates qualities, not just functions.** Where UAT confirms *business needs*, OAT specifically assesses **performance, security, and maintainability** in the final environment — the operational, non-functional qualities that a purely functional acceptance test would miss (source: m4-vv).

## Edge cases & gotchas

- **A verified system can still be the wrong system.** Passing all verification (built right) does not imply validation (right system) — the explicit reason the two activities are separate (source: m4-vv).
- **Lab validation can lie.** Even when simulating real conditions, lab testing can still differ from the real world and miss scenarios — which is why pilots and real-environment testing exist as separate methods (source: m4-vv).
- **Evolving requirements move the target.** If user requirements are unclear or constantly evolving, the test methods themselves must change — a static, write-once validation suite silently goes stale (source: m4-vv).
- **FAT/SAT inversion.** Swapping which is "before delivery" vs "after installation" is the classic acceptance-type error: Factory = manufacturer, before delivery; Site = customer, after installation (source: m4-vv).
- **Ordering inversion.** Running validation (e.g., UAT, pilot) before verification wastes the trial, because a failure can't be attributed to wrong-system vs not-built-right (source: m4-vv).

## Performance, production & security considerations

The source frames the production payoff as **risk reduction and operational fitness**, not runtime tuning (source: m4-vv): simulation/prototyping *reduces risk by testing system concepts early* (NASA rover before launch); pilot testing surfaces *usability issues, performance gaps, or unexpected failures* in a limited live deployment before full rollout (traffic district). On **security and operational qualities**, the named carrier is **OAT**, which assesses performance, security, and maintainability in the final environment, and **regulatory/compliance testing**, which ensures industry regulations and legal requirements are met (source: m4-vv). Beyond these, the source does not cover runtime-performance benchmarking or security-testing techniques in detail.

## Where to go deeper

- **Writing the test cases and test plans** that drive these testing levels → [17-test-plans-cases](../17-test-plans-cases/README.md) — the how-to-author counterpart; this topic only names the levels (source: m4-vv, m4-review).
- **Integration-testing strategy** (top-down, bottom-up, incremental; stubs, harnesses, mocks) → [15-integration-strategies](../15-integration-strategies/README.md) — where the integration level's *how* lives (source: m4-review).
- **Continuous testing in Agile** (shift-left, CI/CD test automation, fail-fast, service virtualization) → [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md) — how V&V embeds in each sprint (source: m4-review).
- **Verifying requirement statements** (SMART, inspection/test/analysis/demonstration) → [06-verifying-requirements](../06-verifying-requirements/README.md) — the upstream, statement-level counterpart to this product-level verification (source: m4-vv).
