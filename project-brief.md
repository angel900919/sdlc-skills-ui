# Project Brief — Unified Product → Engineering Lifecycle

**Status:** Scope locked (design) · 2026-06-28 · implementation not started.

## Goal
Merge three bodies of work in this repo into **one lean, coherent lifecycle** for a solo
or 2-person builder of personal, utility-grade products — supporting **both software and
systems-engineering** projects. Reuse what exists; build only the missing seams. The
dashboard's job is to look at a project and tell you the next move ("the path you should take").

Three bodies:
- **SDLC chain** (`.claude/skills/`, ~55 skills + the `apps/` dashboard) — the engineering
  spine (design → build → ship → operate). Mature and shipping. **Keep as the spine.**
- **PM library** (`product_management _part/`, P00–P16) — the "what & why" front. **Curate down.**
- **SE library** (`System Engineering/`, 12 phases) — a rigor overlay. **Keep only high-value
  seams.** The sibling `Systems-Engineering-KB` stays a learning resource, outside the lifecycle.

## Architecture — two stages

### Stage 1 — Product (what & why). Optional body; skippable when already approved/requested.
Gather evidence, validate, decide **what** to build and **why**. Produces stakeholder-facing
`.human/` artifacts **and** the `.ai/` foundation files Stage 2 consumes — one source of truth,
seamless handoff (PM writes the same foundation files; it does not create a parallel artifact set).

| Skill | Status | Role |
|---|---|---|
| `/intake` | reuse · Stage-1 entry (lightly enriched) | capture the idea + route ("Route, don't gatekeep") |
| `/strategy` | **NEW · opt-in** | direction: 1-page vision, North Star, 1–3 OKRs (PM P01) |
| `/market-research` | **NEW · opt-in** | TAM/SAM/SOM, competitors, positioning (PM P02) |
| `/discovery` | reuse | problem validation (JTBD, metric, kill criteria) + light `PROCEED/INVESTIGATE/KILL` |
| `/opportunity` | **NEW · opt-in** | deep go/no-go: synthesize all evidence → sized, four-risks+ethics, strategy-fit, lean business case → Persevere/Pivot/Kill (PM P04). **Stage-1 exit gate.** |

"Worth building?" is **one gate that scales with evidence**: `/discovery`'s verdict on the lean
path; `/opportunity`'s synthesis once you've done real evaluation (`/strategy` and/or `/market-research`).

### Stage 2 — Engineering (how). Always runs.
The existing SDLC spine, with the SE rigor overlay lighting up for systems-engineering projects.

| Skill | Status | Role |
|---|---|---|
| existing spine | reuse | `/anchor → /architect → /feature-map → per-feature(prd → research → design → plan → to-issues → publish-issues → build → mtdd-* → qa → ship → measure) → runbook → promote → sunset` |
| `/requirements` | **NEW · opt-in** (systems-track) | system-level requirements + traceability + measures (SE P02); per-feature `/prd` traces **up** to it |
| `/tradeoff` | **NEW · opt-in** | weighted trade study for a load-bearing decision; emits an ADR (SE P05) |
| `/architect` + interface-control | merge | fold SE ICD / interface-freeze (`se-phase-04`) into `/architect` |

## New skills: 5, all opt-in
`/strategy`, `/market-research`, `/opportunity` (PM) · `/requirements`, `/tradeoff` (SE).
**The default lean path touches none:** `intake → discovery → anchor → … → ship`.

## Merges (fold the valuable bit into an existing skill — no new command)
- PM P03 discovery extras (personas / JTBD / interview-guide) → `/discovery`
- PM P05 roadmap + P06 prioritization → `/feature-map` (Now/Next/Later + RICE/ICE on the priority field)
- PM P07 solution de-risk → per-feature `/research`
- PM P08 PRD + P09 stories → `/prd` (+ one "traces to" line)
- PM P11 launch → `/ship` (landing-page + announcement note); PM P12 analytics → `/measure`
- PM P16 sunset + SE P11 disposal → `/sunset`
- SE P01 concept / OpsCon → `/understand`; SE P04 ICD → `/architect`;
  SE P07/08 V&V → `/qa` + `/measure` (V≠V note); SE P10 ops → `/runbook`

## Omits (recorded, not silently dropped)
PM P00 charter, P10 delivery, P13 experimentation, P14 feedback-ops, P15 growth (opt-in only).
SE P00 agreement/SEMP, P03 SysML 7-diagram modeling, P06 integration/HIL ceremony, P09 formal
change-config/CCB, safety-RAMS / EVM / COCOMO threads. `Systems-Engineering-KB` (learning resource).

## Tailoring
- **Tiers: reuse the existing 3** — `prototype | mvp | production` (anchor's dial). PM "Solo/Lean"
  and SE "Minimum-Viable" map onto `prototype`/`mvp`; personal-utility ≈ `prototype`. No 4th tier.
- **Project-type flag** controls *which overlay* runs (product-track PM skills, systems-track SE
  skills); the tier dial controls *depth*. The router reads both.
- **Safety / responsible floor — always on, even at prototype:** one-line "can this harm/exclude
  someone or leak personal data?" + basic secrets/dependency hygiene. Deeper `/threat-model`
  stays gated to production / PII / money.

## The one genuinely new engineering seam
The dashboard becomes the path-router by **reusing** the existing `/next` boundary table +
`anchor.project_tier` + `dashboard/state.json` + `verdictWatcher`. Build only:
`GET /api/projects/:id/next` → `{boundary, primarySkill, alternative, ruleCitation, tier}`,
rendered as "your next move" (suggest-only, never auto-invoke).

## Principles
Reuse the spine · fold seams, don't copy skills (avoid duplicate owners) · one source of truth
(`.ai/` machine + `.human/` stakeholder mirror) · lean default, opt-in depth, expandable later ·
never silently skip — record tailored-out phases with a reason.

## Open decisions
1. **Dashboard scope** — single-project `/next` endpoint (recommended) vs portfolio roll-up vs
   full v2 app. Decide when we plan the dashboard; does not block the lifecycle/skill design.
2. **Front-feed wiring detail** — the exact prompts added to `/intake` + `/discovery` for the
   PM "why/strategy" hook (design-time, low-risk).
