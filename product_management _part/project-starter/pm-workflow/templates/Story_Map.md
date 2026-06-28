---
Document: Story Map — <Product / Feature>
Document ID: MAP-<PRODUCT_SLUG>-v0.1
Status: Living
Owner: Product Manager
Updated: <YYYY-MM-DD>
---

<!-- Phase 09 · owned by skill `pm-phase-09-stories`. Conforms to ../05_Conventions.md
     (IDs §3, traceability spine §4, frontmatter §6, outcomes-over-outputs §7).
     A story map (Jeff Patton) keeps the whole journey in view so you can cut a
     coherent *release slice* (a walking skeleton), not a feature pile.
     Sibling templates: User_Stories.md · DoR_DoD.md. Upstream: PRD.md (08). -->

> *How to use:* fill the context block, lay the **backbone** (user activities, left→right in
> journey order), hang **steps/details** under each (top→bottom by priority), then draw
> horizontal **release slices** — the top slice is the smallest end-to-end MVP. Replace every
> `<ANGLE_BRACKET>` / `TODO:`; never ship placeholders. Status stays `Living` (Conventions §6).

## 1. Context & traceability
<!-- Cross-reference by ID — never re-describe the source (Conventions §4). -->

| Field | Value |
|---|---|
| Feature / epic this map serves | `FEAT-<nn>` — <title> |
| Roadmap item in flight | `RMI-<nn>` (Now) |
| Solution / bet implemented | `SOL-<nn>` (G5-validated) |
| Opportunity served | `OPP-<nn>` |
| Outcome targeted | `OBJ-<nn>` / `KR-<nn>` → metric `MET-<nn>` |
| Primary persona(s) | `PER-<nn>` <!-- if invented w/o research → flag; pm-phase-03-discovery owns the fix --> |
| Key job(s)-to-be-done | `JOB-<nn>` |
| PRD MoSCoW / MVP line | <link or quote the PRD's MVP boundary> |

## 2. The backbone (user activities → steps)
<!-- Backbone = the big things the user does, in the order they do them (the journey).
     Steps = the smaller actions inside each activity. This is the narrative spine. -->

- **Activity A — `<verb-phrase>`** → steps: `<step>` · `<step>` · `<step>`
- **Activity B — `<verb-phrase>`** → steps: `<step>` · `<step>`
- **Activity C — `<verb-phrase>`** → steps: `<step>` · `<step>` · `<step>`
- TODO: add activities until the end-to-end journey is whole, edge to edge.

## 3. The map (backbone × release slices)
<!-- Columns = backbone activities. Rows = release slices (horizontal cuts).
     Cells = US-ids placed under the activity they belong to. Use "—" when an
     activity contributes nothing to that slice. Slices are RELEASES, not layers. -->

| Backbone (activity) → | **A · `<activity>`** | **B · `<activity>`** | **C · `<activity>`** |
|---|---|---|---|
| **Release 1 — MVP / walking skeleton** | US-01 | US-03 | US-05 |
| **Release 2 — Next** | US-02 | US-04 | — |
| **Release 3 — Later** | TODO: | TODO: | TODO: |

> *Walking skeleton:* Release 1 must let the persona complete the journey end-to-end and move
> `MET-<nn>` — the **thinnest** path that delivers the outcome, not the most features.

## 4. Slice rationale
<!-- Why this is the smallest coherent slice; what is deliberately deferred and why. -->

- **Release 1 (MVP)** — delivers: <outcome>. Out of this slice (deferred): `<capability>` → Release <n> because `<reason>`.
- **Release 2 (Next)** — <directional intent>.
- **Release 3 (Later)** — <directional intent>; revisit after `MET-<nn>` evidence.

## 5. Open questions & risks
<!-- Unknowns become TODO: <what is owed — by whom — by when>. Log discovery gaps and risks. -->

- TODO: <open question> — owner: <who> — by: <YYYY-MM-DD>.
- New discovery need → spin out `INS-`/`OPP-` (Continuous Discovery thread).
- New risk → log `RSK-<nn>` in `_threads/Risk_Register.md`.

## 6. Links
- Stories & acceptance criteria → **User_Stories.md** (`US-*` / `AC-*`)
- Readiness & done bar → **DoR_DoD.md**
- Upstream spec → **PRD.md** / **NFR_Checklist.md** (Phase 08)
- Downstream build → **Delivery_Plan.md** / **Sprint_Plan.md** (Phase 10)
- Owning skill → `pm-phase-09-stories` · Conventions → `../05_Conventions.md`
