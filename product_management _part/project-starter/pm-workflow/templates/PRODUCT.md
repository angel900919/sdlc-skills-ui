---
Document: <Product> — Home
Document ID: HOME-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: <Product Manager>
Updated: <YYYY-MM-DD>
---

# <Product Name> — Product Home

> The one-page front door for this product. Pair it with [`WORKFLOW.md`](WORKFLOW.md) (your phase-by-phase runbook). Keep this `Living` — update the "Current state" block whenever a gate moves.
> Prime directive: **outcomes over outputs** — we are measured by customer & business value, not features shipped.

## What this product is
- **One-liner:** <what good does it do, and for whom?>
- **Target segment:** <who it's for>
- **Vision (P01):** <the world once we've won — link [01_Strategy/Vision.md](01_Strategy/Vision.md)>
- **North Star metric (P01):** <value-exchange metric> — current: `<value / TODO>`

## Current state
| | |
|---|---|
| **Stage** | <idea / 0→1 / growth / mature / sunset> |
| **Current phase** | <e.g. P07 Solution Design> |
| **Last gate passed** | <e.g. G3 Opportunity Go/No-Go — Persevere, YYYY-MM-DD> |
| **Next command to run** | `</pm-phase-NN-name>` |
| **Tailoring profile** | <Solo-Lean / Standard / Enterprise-Formal> (+ any Full-rigour thread) |
| **Top open risk** | `RSK-<nn>` <one line — see _threads/Risk_Register.md> |

## Where everything lives
- **Runbook & gate log:** [`WORKFLOW.md`](WORKFLOW.md)
- **Method reference:** [`pm-workflow/`](pm-workflow/) (Conventions, Protocol, Frameworks Map, Tailoring, templates, threads, prompts, checklists)
- **Artifacts by phase:** `00_Charter/` … `16_Sunset/` (see [Conventions §9](pm-workflow/05_Conventions.md))
- **Living threads:** [`_threads/`](_threads/) — Decision Log (`DEC-*`), Risk Register (`RSK-*`), Responsible Product Review, Portfolio View

## The traceability spine (fill as you go)
`INS-<nn>` insight → `OPP-<nn>` opportunity → `OBJ/KR` outcome → `RMI-<nn>` roadmap item → `SOL-<nn>` bet → `FEAT-/REQ-` spec → `US-<nn>` story → `MET-<nn>` metric. *Every bet traces back to an opportunity and forward to a metric.*

<!-- Tip: this template is for a real product instance. Copy it to your product folder as PRODUCT.md and keep it current. -->
