# System Lifecycle Models — Advanced concepts

Terse notes for someone who already holds the four-model schema.

## Advanced concepts

- **Blending models is first-class, not a hack.** Waterfall is *often blended with iterative models (like the V-Model) for better risk management* — so in practice you compose models rather than pick one purely (source: m1-lifecycle).
- **Two flavours of "iterative."** Spiral and Agile both iterate, but on different axes: Spiral organizes each cycle around **risk analysis** (one of its four phases), whereas Agile organizes each sprint around **customer feedback** and rapid delivery. Choosing between them is choosing whether your dominant uncertainty is *risk/feasibility* or *evolving requirements* (source: m1-lifecycle).
- **Feedback as the cycle controller.** In both Spiral and Agile, the evaluation/review output is not a report — it is the *input* that sets the next cycle's goal (Spiral 1's "add 2FA + history" → Spiral 2's plan) (source: m1-lifecycle).
- **The V-Model's contribution is plan-time, not run-time.** It doesn't add iterations; it forces verification to be *designed* alongside each decomposition level, so acceptance tests trace to requirements and unit tests to module design from the start (source: m1-lifecycle).

## Edge cases & gotchas

- **The V-Model is not iterative despite all the testing.** It is still a single linear pass; the testing is *paired*, not *repeated*. Mistaking it for iterative leads to the wrong choice when requirements are actually unstable (source: m1-lifecycle).
- **Agile's flexibility cuts both ways.** Changing scope can produce *uncontrolled changes if not managed properly*; it demands disciplined project management and highly engaged team members — Agile is not "less process," it's *different* process (source: m1-lifecycle).
- **Agile's documentation debt surfaces late.** Less comprehensive documentation can be challenging for large teams or long-term maintenance — a gotcha that bites after delivery, not during sprints (source: m1-lifecycle).
- **Waterfall's late-change cost is structural.** Its low flexibility means going back after a phase is finished is hard; the expensive failure mode is a requirement discovered during verification or deployment (source: m1-lifecycle).

## Performance, production & security considerations

The source treats security as something the **Spiral model's risk-analysis phase** is meant to surface early — e.g. for a mobile banking app: *Can we integrate securely with banking APIs? Can we prevent fraud during transfers? What if the server goes down during a transaction?* The lifecycle-model lesson is that *when* you address such risks is itself a model choice: Spiral front-loads them every cycle; Waterfall defers them to its single verification phase (source: m1-lifecycle).

> Performance and production-operations specifics beyond this risk-timing point are not covered in the source material for this topic.

## Where to go deeper

- The verification/validation methods the V-Model pairs in — depth on unit, integration, system, and acceptance testing: [16-verification-validation-methods](../16-verification-validation-methods/README.md).
- Managing change and continuous validation across Agile sprints (the "uncontrolled change" risk): [18-change-management-continuous-validation](../18-change-management-continuous-validation/README.md).
- The full Agile-SE practice, beyond the four values: [19-agile-se-playbook](../19-agile-se-playbook/README.md).
- How models relate to the stages a system passes through: [02-se-process-stages](../02-se-process-stages/README.md).
