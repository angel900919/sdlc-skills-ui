# The SDLC Operating System — PM_SE × AI-Engineering-OS

> **Two sibling operating systems, one software development lifecycle.** [`PM_SE/`](PM_SE/) governs *what to build and whether it's any good* — the lean product + systems-engineering lifecycle, its gates, and its ship-bar. [`AI-Engineering-OS/`](AI-Engineering-OS/) governs *how to build it with AI agents* — the daily loop, the context substrate, reusable skills, agent architecture, and the quality/operations loop.
>
> **PM_SE gates the product; AI-Engineering-OS runs the build.** A real product run uses both at once.

Both were built to the same house style and the same design instinct — *keep every artifact someone (or some agent) must read to act correctly; drop everything that only informs* — so they read as one system, not two bolted together. Each carries the same spine: `README` · `PLAYBOOK` · `CONVENTIONS` · `AI_PROMPTS` · a 7-item never-skip list · copy-paste templates.

## The two systems at a glance

| | [`PM_SE/`](PM_SE/) | [`AI-Engineering-OS/`](AI-Engineering-OS/) |
|---|---|---|
| **Answers** | Should we build this, and is it good? | How do we build it with agents? |
| **Discipline** | Lean Product + Systems Engineering | AI / agent engineering |
| **Unit of work** | the **gate decision** | the **task loop** (research → plan → implement → verify → review) |
| **Shape** | 7 phases P0→P6, gates G0–G6 (G1·G2·G3 ★ never-skip) | 5 disciplines (agentic-coding · context · skills · agents · quality-&-ops) |
| **Spine** | `PLAYBOOK` · `CONVENTIONS` · `AI_PROMPTS` (6) · [`templates/`](PM_SE/templates/) (19 lifecycle docs) | `PLAYBOOK` · `CONVENTIONS` · `AI_PROMPTS` (7) · [`guides/`](AI-Engineering-OS/guides/) (5) · [`.ai/`](AI-Engineering-OS/.ai/) · [`.human/`](AI-Engineering-OS/.human/) |
| **Design rule** | keep every artifact that **forces a decision or prevents a named failure** | keep every artifact an **agent or human must read to act** |

## Where they meet — the seam

PM_SE decides the **target** (and whether it was met); AI-Engineering-OS is **how agents hit that target** during the build, and how they keep it healthy in operation.

```
PM_SE:    P0 FRAME → P1 DISCOVER → P2 DESIGN ┃ P3 BUILD & PROVE ┃ P4 LAUNCH → P5 OPERATE → P6 SUNSET
                                    G2 ═══════╋══════════════════╋═══════ G4
                              (define the target)   the build loop   (keep the target met)
AI-Eng-OS:                                  ┃  Guides 01–04     ┃  Guide 05 — Quality & Operations
                                            ┃  .ai/ memory +    ┃  evals · AIOps · incident → test
                                            ┃  /1-align…/7-review ┃
```

The handoff is concrete — each gated PM_SE artifact becomes an input to the agent build:

| PM_SE produces (gated) | → | AI-Engineering-OS consumes |
|---|---|---|
| Frozen **spec** ([06](PM_SE/templates/06_spec.md)) + **ship-bar** ([07](PM_SE/templates/07_ship_bar.md)) at G2/G3 | → | seeds [`/1-align`](AI-Engineering-OS/.ai/commands/1-align.md) → `.ai/plans/<slug>/spec.md`; **the ship-bar is the verification target** every task starts from |
| **Architecture** + interface table ([08](PM_SE/templates/08_architecture.md)) | → | [`.ai/architecture.md`](AI-Engineering-OS/.ai/architecture.md) invariants; agents build to the pinned interfaces |
| **Build plan** increments ([09](PM_SE/templates/09_build_plan.md)) | → | vertical slices in [`/5-outline`](AI-Engineering-OS/.ai/commands/5-outline.md), one per turn |
| **Verification matrix** ([10](PM_SE/templates/10_verification_matrix.md)) | → | `verify.sh` + evals + fresh-context review (Guide 05) prove each REQ |
| **Incident postmortem** ([14](PM_SE/templates/14_incident_postmortem.md)) | ↔ | [`/incident-to-test`](AI-Engineering-OS/.ai/commands/incident-to-test.md) — every failure becomes a permanent check |
| **Decision log** ([15](PM_SE/templates/15_decision_log.md)) | ↔ | [`.ai/decisions/`](AI-Engineering-OS/.ai/decisions/) decision traces |
| The **release tuple** (PM_SE `CONVENTIONS`) | ↔ | the **AI release tuple** — code + prompt-set + model ID + eval-set hash + skill versions |

Their never-skip spines interlock rather than compete: PM_SE's *ship-bar-frozen-before-build* and *verification-method-at-requirement-birth* are the same instinct as AI-Engineering-OS's *a verification target on every task* — one at the product altitude, one at the task altitude.

## Governance — who wins on a conflict

Each system is authoritative **in its own lane**:

- **Product / lifecycle / gate questions** → [`PM_SE/CONVENTIONS.md`](PM_SE/CONVENTIONS.md) wins.
- **Build / agent / context questions** → [`AI-Engineering-OS/CONVENTIONS.md`](AI-Engineering-OS/CONVENTIONS.md) wins.

If a product decision (a frozen spec, a gate verdict) and a build convenience disagree, the gate wins — you re-baseline through PM_SE's change rule, you don't quietly edit around it.

## Start here

| You are… | Start at |
|---|---|
| Framing a **new product idea** | [`PM_SE/PLAYBOOK.md`](PM_SE/PLAYBOOK.md) at Phase 0 — copy [`templates/00_tracker.md`](PM_SE/templates/00_tracker.md), work the gates |
| Building an **already-gated product** with agents | [`AI-Engineering-OS/README.md`](AI-Engineering-OS/README.md) → the 5-step quick start; stand up [`.ai/`](AI-Engineering-OS/.ai/) and `verify.sh` |
| Running a **single task** with an agent | the slash-command pipeline [`/1-align → … → /7-review`](AI-Engineering-OS/.ai/commands/) |
| Studying the **thinking** | [`AI-Engineering-OS/guides/`](AI-Engineering-OS/guides/) (the 5 disciplines) and the [`AI_CODING/`](AI_CODING/) source corpus |

## Repo map

| Path | What it is |
|---|---|
| [`PM_SE/`](PM_SE/) | **Product + Systems-Engineering OS** — the lean lifecycle that gates the product |
| [`AI-Engineering-OS/`](AI-Engineering-OS/) | **AI Engineering OS** — how agents + humans build to that gate |
| [`AI_CODING/`](AI_CODING/) | The source corpus (~112 conference sessions across 7 topics) AI-Engineering-OS was distilled from |
| [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) | Hand-off log for the AI-Engineering-OS build work |
| `.beads/` | Local issue tracker (`bd`) — no git remote |

---

*Two operating systems, one lifecycle: decide it and prove it good with PM_SE, build it and keep it good with AI-Engineering-OS.*
