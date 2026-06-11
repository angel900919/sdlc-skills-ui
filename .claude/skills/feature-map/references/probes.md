# Feature-map question bank

Pull from these when stuck. **One question at a time. Propose a recommended answer.** Never ask the whole list.

---

## Phase 1 — Load + restate
- *"Discovery scope = v0.1 [list], deferred [list+dates], never [list]. Understanding has [N] behaviors: [...]. Tier = [tier], cap [N]. Did I read that right?"*
- (no understanding, mvp/production) *"There's no understanding doc — without the journeys I can't slice or trace cleanly. Run `/understand` first, or override and I'll decompose off discovery's scope and mark the roster tentative?"*
- (no discovery) *"No discovery doc. Feature-map decomposes against a validated scope. Run `/discovery` first."* → stop.

## Phase 2 — Decompose (off behaviors, framed by scope)
- *"Behavior `<journey>` — is that one shippable slice, or several?"*
- *"Split `<X>` into [A, B]? A delivers value alone by [doing what?], B by [doing what?]."*
- *"`<X>-frontend` + `<X>-backend` is one vertical feature, not two — reject the technical split. Agree?"*
- *"`<feature>` isn't in discovery's v0.1 scope. Amend discovery to add it, or defer it with a date?"* (record under `beyond_discovery`)
- **Vertical-vs-technical probe:** *"What can a user DO when `<X>` ships?"* No plain-language answer → it's a technical concern; fold it into the feature that uses it.

Bad signals (force a re-frame): name contains `api` / `endpoint` / `schema` / `layer` / `service` / `module` / `migration` / `infra` / `backend` / `frontend`; the name is a bare noun (`database`, `auth`) with no user action.

## Phase 3 — Slug
- *"Slug `<feature>` as `<recommended-kebab>`?"* (kebab-case, ≤30 chars, user outcome)
- *"`<A>` and `<B>` collide — differentiate by outcome (`invoice-create` vs `invoice-send`, not `invoice-1`/`invoice-2`)."*
- Reject: `feature-1` (no meaning) · `IS` (abbrev) · `the-invoice-thing` (informal) · `invoice_send` (snake_case) · `api-v2-invoice-endpoint` (technical leak).

## Phase 4 — Trace + coverage
- *"Which behavior from understanding does `<feature>` serve?"* → that's `satisfies`. Recommend the closest 1–2 by name.
- *"`<feature>` has no behavior behind it — orphan. Drop it, or add a missing behavior back to `/understand`?"*
- *"Entity `<E>` is in context.md but no feature touches it — is that a gap, or is it genuinely out of v0.1?"*
- (no understanding) *"Skipping the trace — marking `<feature>` tentative, `satisfies` points at the discovery capability. Re-run after `/understand`."*

## Phase 5 — Prioritize 1–N
- *"Priority for `<feature>`: P0 (the metric fails without it), P1 (high value, MVP ships without short-term), P2 (cuttable)?"*
- *"You marked [N] P0. Aim ≤4. If you could ship only one this week, which? That's #1. Next?"*
- **All-P0 push-back:** *"All-P0 means no priority — scope is too big. Force a ranking or defer some."*
- Sanity checks: *"Does this P0 trace to the JTBD/metric? If not it's at most P1."* · *"Would you feel guilty cutting it from MVP? If no, it's P2 or lower."*

## Phase 6 — Dependencies (non-obvious only)
- *"Which features are actually broken without another — not just 'nicer first'?"* (skip the section if none)
- *"`<A>` depends on `<B>` — obvious (`stripe-webhook` needs `invoice-send`) or non-obvious? Only capture non-obvious."*
- *"Does that dependency point at a feature missing from the roster (e.g. `client-portal` needs `auth-flow`)?"*

## Phase 7 — Read back
- *"Here's the roster — [paste]. Where did I misrepresent you?"*
- *"Any P0 that's really P1? Any P2 that should be P0?"*
- *"Any orphan I kept, or mega-feature I should split?"*
- *"Anything beyond discovery's scope that slipped in?"*

## Phase 8 — Tier cap
- *"Tier `<tier>`, cap `<cap>`, in-scope count `<N>` — within limit?"*
- (over cap) *"`<N>` features for a `<tier>` project is over cap. Defer `<N-cap>`, split the project, or bump the tier (re-run `/anchor`)?"*
- (uplift) *"`<signal>` (e.g. payments) bumps the effective tier to `<tier>` — that raises the cap to `<N>`. Noting it."*

---

## Questions to refuse (belong elsewhere — capture in Notes, steer back)
- Success metrics / NFRs / latency / cost ceiling for a feature → `/prd`
- EARS requirements → `/prd`
- What stack / framework / hosting → `/anchor`, `/architect`
- What does domain term `<X>` mean → `/understand`
- Should we build this at all / JTBD / target user → `/discovery`
- File structure / schema / API contract → `/design`
