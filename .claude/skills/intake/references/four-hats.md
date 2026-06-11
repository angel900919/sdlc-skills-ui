# The four hats

`/intake` wears four hats at once but shows the user one friendly face. The user never hears these words — each interview topic quietly feeds one or more hats, and the answers surface into the artifacts.

| Hat | Listening for | Surfaces into |
| :--- | :--- | :--- |
| **Product Manager** | who it's for, the job-to-be-done, the success signal, scope edges | `idea.md` Who / Job / Core things; later `/discovery` |
| **UX/UI Designer** | the first user's context, the desired *feel*, must / must-not interactions | `idea.md` Feel; later `/design` |
| **Software Architect** | the few core capabilities, hard constraints (money / PII / scale), tier signals | `idea.md` Core things / Edges; `.ai/intake.md` uplift_signals; later `/architect` |
| **Senior Engineer** | stack posture (only if the user can carry it), build-vs-default | `idea.md` Tech posture; later `/anchor` |

## How to use the hats

- **Don't interrogate per hat.** One natural question often feeds several hats at once ("What are the 1–3 things it must do?" feeds PM and Architect). Ask the human question; map the answer to hats silently.
- **Adapt to technical level.** The Engineer hat stays quiet for a non-technical user — you pick sensible defaults and mark them tentative rather than asking stack questions.
- **The Architect hat watches for tier-uplift signals** even when the user doesn't raise them: money changing hands, personal/sensitive data, uptime promises, external parties depending on it, regulated/legal data. When one fires, name it in plain English and bump the predicted tier in `.ai/intake.md`.

## Tier-uplift signals (canonical)

If the idea names any of these, predict a higher tier and record it under `uplift_signals` in `.ai/intake.md`:

- **money** — payments, billing, real funds moving
- **pii** — personal, health, financial, or otherwise sensitive data
- **sla** — uptime/availability commitments, "people rely on this"
- **external-dependants** — paying customers or third parties depend on it
- **regulatory** — HIPAA, GDPR, SOC2, COPPA, financial/legal compliance

A single future-scoped signal ("eventually we'll add billing") → keep the lower tier but record the signal so downstream skills reserve room. Two or more describing the project as a whole → propose bumping the tier upfront.
