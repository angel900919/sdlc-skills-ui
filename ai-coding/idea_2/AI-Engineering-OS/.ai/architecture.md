---
owner: <tech lead>
updated: 2026-07-05
status: live
---

# Architecture — agent view

> Terse system map + the decisions and invariants an agent must respect. The Mermaid, narrative
> version for humans is `../.human/architecture.md` — keep them in sync; **this file is authoritative.**

## System in one paragraph
<what it is, what it does, the shape — 3–5 sentences an agent can load fast>

## Components
| Component | Responsibility | Key paths |
|---|---|---|
| _(example — delete)_ api | HTTP + auth | `src/api/**` |
| _(example — delete)_ worker | async jobs | `src/worker/**` |

## Interfaces / seams (where independently built things meet)
| Seam | Contract (named schema) | Auth | Failure behaviour |
|---|---|---|---|
| _(example — delete)_ web↔api | `openapi.yaml` | JWT | 401→refresh · 5xx→retry×3 |

## Key decisions → traces
- _(example — delete)_ Postgres over Mongo → `decisions/0001-datastore.md`

## Invariants — MUST NOT break
- _(example — delete)_ All money is integer cents; never floats.
- _(example — delete)_ `migrations/` are append-only; never edit a shipped migration.

## Stack & the NOT-using list
- **Using:** <lang / framework / datastore / infra>
- **NOT using:** <named rejection> — because <reason tied to a constraint or principle>
