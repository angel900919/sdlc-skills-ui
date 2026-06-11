# Trust-boundary derivation checklist

How Phase 2 turns the architecture's dependency-edge table + entry points into the proposed
`B-N` boundary list. The derivation is **mechanical first, confirmed second** — never start
from a blank "where are your boundaries?" question, and never invent a boundary no edge or
entry point supports.

## 1. Walk the dependency-edge table

Source: `.ai/architecture/02-components.md` dependency-edge table (`{ from, to, kind, via }`),
or the `## Components` edges at prototype shape. For **each edge**, ask three mechanical
questions; any "yes" makes the edge a boundary candidate:

| Crossing | Test | Typical examples |
| :-- | :-- | :-- |
| **process** | Do `from` and `to` run in different processes/runtimes? | app → background worker, app → local LLM runtime, web → native helper |
| **network** | Does the call leave the machine/VPC? | app → managed DB, app → payment API, browser → API, service → queue broker |
| **org** | Is the far side owned/operated by someone else? | any third-party SaaS, an auth provider, a partner API, an app store |

An edge crossing **none** of the three (two modules in one monolith process) is NOT a trust
boundary — don't pad the list with it.

## 2. Enumerate external entry points

Every place the outside world initiates contact is a boundary even if no internal edge models
it. Check each of these against the architecture + `environments.md`:

- **UI** — every browser/mobile surface (the user is outside the trust line).
- **API** — public or partner-facing endpoints.
- **Webhook / third-party callback** — Stripe/GitHub/etc. calling in. Ask: is the caller verified (signature, allowlist)?
- **Queue consumer** — messages from a broker another party can write to.
- **File upload** — any user-supplied file path (parse, store, serve).
- **Scheduled external pull** — cron jobs fetching third-party data (poisoned-input direction).
- **Email/SMS inbound** — if the app parses inbound messages.

## 3. Add the environments/secrets surfaces (`.ai/environments.md`)

If `environments.md` exists, add the operational surfaces; if it's missing, warn that this
slice of the attack surface is unmodeled:

- **Secret stores** — where secrets live per env; who/what can read them.
- **CI/CD pipeline** — it holds deploy credentials; a compromised pipeline is a boundary.
- **Deploy mechanism** — who can push to production.
- **Non-prod environments** — staging with prod data is a boundary in its own right.

## 4. Commonly missed (scan before proposing)

- Admin/back-office surfaces ("only we use it" still faces the internet).
- Logs and error reporters (PII/secret leakage destination — Information disclosure).
- Backups and data exports (a second copy of every asset).
- LLM prompt paths when `anchor.ai_in_core_path: true` (untrusted text → model → tool/action = an injection boundary).
- Browser localStorage / mobile device storage holding tokens.

## 5. The B-N table shape

One row per confirmed boundary, recorded in `## Trust boundaries`:

```markdown
| id | boundary | crosses | entry points | inside / outside |
| :-- | :-- | :-- | :-- | :-- |
| B-1 | browser ↔ api | network | UI, public API | SubmitOrder, AuthenticateUser / end users |
| B-2 | api ↔ stripe callbacks | network+org | webhook | RecordPayment / Stripe (and anyone with the URL) |
```

`crosses` ∈ process | network | org (combine with `+`). `inside / outside` names the
components on the trusted side and who sits on the far side.

## 6. Confirmation round (plain English)

Present the list in everyday words, one confirm round, with a proposed answer:

> "I count five places where trust changes hands: the line between people's browsers and your
> app, the line to Stripe's payment callbacks, … Anything missing — some other way data or
> commands get into the system?"

If the user names a boundary **no edge or entry point supports**, that's a finding, not a
boundary: either the architecture is missing a component/edge (→ `NEEDS-ARCHITECTURE-UPDATE`)
or it's genuinely out of scope (→ record under `## Out of scope` with the reason).

## Lite pass

Keep only the 2–3 boundaries facing the highest-value assets (usually: the public entry point,
the money/PII path, the secrets surface). List the rest in one `## Out of scope` line each.
