# QA gate — system-map

**Verdict so far:** Evidence complete — **0 FAIL, 3 WARN, 2 SKIP**. Ready for your acceptance run + sign-off.
Machine evidence: [`.ai/specs/system-map/qa-report.md`](../../../.ai/specs/system-map/qa-report.md).

All four slices are merged and closed; the full test suite (217 tests) and typecheck are green; every user story and NFR traces to a slice with a backing test; the three architecture invariants hold.

## Needs your judgment (non-blocking WARNs)
1. **Security** — not formally reviewed (mvp). Surface is small and local-first (read-only architecture render + a `nav` beacon with allow-listed kinds). Consider `/security-review` + `/threat-model` before ship.
2. **Accessibility** — the Architecture tab (graph, inspector, SDLC view) hasn't had a WCAG pass: keyboard navigation, labels on nodes/inspector, status-color contrast, and loading/empty/error states. Worth a look since color carries meaning here.
3. **Runbook** — none yet; run `/runbook system-map` after approval.

## Acceptance script — run this, then sign

**Setup:** start the app (`/run` or `npm run dev`), open a project that has `.ai/architecture/` populated, and go to the **Architecture** tab.

**US-1 — see components + connections** (graph)
1. Open the Architecture tab → **expected:** the project's components render as a graph with edges within ~1 s, no manual refresh.
2. Compare node/edge count to `.ai/architecture/02-components.md` → **expected:** every declared component and edge is present, none invented (NFR-3).
   Result: ☐ pass ☐ fail

**US-2 — status colors** (at-a-glance build state)
1. Look at the node colors → **expected:** each component is colored by status (done / building / planned / blocked); a building component shows a live indicator.
   Result: ☐ pass ☐ fail

**US-3 — component inspector** (jump from box to work)
1. Click a component → **expected:** an inspector shows role, inputs, outputs, dependencies, files, responsible owner, and the linked feature + slices + issue refs.
2. Click a component with no linked feature → **expected:** it reads as honestly "unlinked," not a fabricated link.
   Result: ☐ pass ☐ fail

**US-4 — auto-refresh on model change** (live, not stale) (NFR-2)
1. With the tab open, edit/regenerate `.ai/architecture/` (e.g. `/architect`, or merge a slice) → **expected:** the tab updates on its own within ~2 s, no manual reload.
   Result: ☐ pass ☐ fail

**US-5 — SDLC progress view**
1. Switch to the SDLC view → **expected:** chain stages grouped by phase, colored by status, with exactly one "next" stage marked; statuses match the Pipeline view (same source of truth).
   Result: ☐ pass ☐ fail

## Exploratory prompt (poke the edges)
- Open the tab on a project whose `.ai/architecture/` is **missing or malformed** → does it fail gracefully (empty/error state), not crash?
- Click rapidly between components / open the inspector on every node → any stale or blank panels?
- Regenerate the model repeatedly in quick succession → does auto-refresh debounce cleanly, or flicker/lag past ~2 s?
- Confirm the rendered model **excludes** `dashboard/` and `prototypes/` (the app must not show itself).
- Keyboard-only: can you reach and open a node without the mouse? (feeds the a11y WARN)

When the acceptance steps pass, approve `system-map` for ship (this flips it `building → qa-approved`).