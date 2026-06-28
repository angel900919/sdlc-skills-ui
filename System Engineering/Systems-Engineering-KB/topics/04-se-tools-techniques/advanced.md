# Common SE Tools & Techniques — Advanced concepts

This is an introductory catalogue topic, so genuinely advanced material is thin and lives in the home topics linked below. What follows is the small amount of depth the sources support, plus honest pointers.

## Advanced concepts

- **The 29148 documents form a level hierarchy, not a flat list.** Their results ladder from business down to software: BRS (business vision → goals/scope/communities) → StRS (stakeholder requirements → user needs) → SyRS (technical → what the system must do) → SRS (software-specific → design/functional) → OpsCon (how it operates → operational scenarios) (source: m1-tools). Choosing *which* documents a project needs depends on whether it is hardware, software, or both; 29148 covers software and hardware products and systems (source: master-notes).
- **One decision exercises every technique.** The satellite case shows the techniques are not used in isolation: the same antenna choice flows through trade-off → risk → V&V → interface management, and the conclusions can conflict (high-gain wins on performance, loses on cost/complexity/risk). The engineer's job is to reconcile them, not to apply one in isolation (source: m1-tools).

## Edge cases & gotchas

- **Passing verification but failing validation.** The source's sharpest gotcha: an antenna can meet every lab spec yet fail validation if it can't hold a stable link in real orbit due to pointing issues (source: m1-tools). Specs are necessary, not sufficient.
- **Mitigations that don't move the needle.** Adding backup orientation sensors, more simulations, or a secondary low-gain antenna still left the high-gain option's overall risk profile high — so the team changed the design rather than piling on mitigations (source: m1-tools). The gotcha: more mitigation isn't always the answer; sometimes the lower-risk alternative is.
- **Interface mismatches are silent until integration.** Mismatched voltage levels or incompatible communication timing surface late and can cause outright system failure — hence managing interfaces "early and continuously" rather than at integration (source: m1-tools).
- **FMEA vs. FTA direction.** [OUTSIDE MATERIAL] The course names both but doesn't contrast them; in practice FMEA is bottom-up (component → effect) and FTA is top-down (top event → causes). Don't claim the source distinguishes them — it doesn't.

## Performance, production & security considerations

> The source material does not cover performance, production, or security specifics for these tools beyond the lifecycle mapping in m1-exercise (e.g. ICDs used in production, risk matrices in operations). Tool-licensing is the only production note given: these requirement tools are usually not free or limit their free versions (source: m1-tools).

## Where to go deeper

- [07-requirements-management](../07-requirements-management/README.md) — requirement tools, ReqView, and traceability in depth. *Reason:* this topic only names them.
- [08-sysml-modeling](../08-sysml-modeling/README.md) — building BDDs/IBDs in SysML. *Reason:* here SysML is just introduced as a language.
- [12-design-tradeoffs](../12-design-tradeoffs/README.md) and [13-decision-matrix](../13-decision-matrix/README.md) — scoring trade-offs across performance/cost/scalability. *Reason:* the deep method lives there.
- [16-verification-validation-methods](../16-verification-validation-methods/README.md) — concrete V&V methods. *Reason:* here V&V is a one-paragraph definition.
- [14-documenting-architecture](../14-documenting-architecture/README.md) — full ICD structure and content. *Reason:* this topic only states an ICD's purpose.
- Standard: **ISO/IEC/IEEE 29148** — the requirements-engineering standard behind the five document templates (source: m1-tools).
