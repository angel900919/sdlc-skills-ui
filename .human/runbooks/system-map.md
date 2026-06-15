# system-map — incident runbook

**If you're reading this, the Architecture tab is misbehaving** — a blank graph,
greyed-out statuses, or it won't update on its own.

This is a local, single-user tool. Nothing here pages anyone. You are the responder.
Worst case, you revert the feature and restart — see "Turn it off" at the bottom.

## Quick links
- Open it: `http://127.0.0.1:4317` → Architecture tab (dev: `http://127.0.0.1:5180`)
- Health check: `curl -s http://127.0.0.1:4317/api/health`
- Rebuild the data: `python3 .claude/skills/_build_share/project-state.py`

## The graph is empty ("No model yet")
What's happening: the app can't read the architecture file.
1. Check the file exists: `.ai/architecture/02-components.md`.
2. Look at the server log for a line starting `architecture.parse`. If it says `warn`,
   the file is malformed.
3. Fix the file (or run `/architect`). The empty graph is the app being honest, not a crash.

## The graph shows up but every box is grey
What's happening: the live project status couldn't be computed, so the app shows the
shape without the colors.
1. Rebuild the data: `python3 .claude/skills/_build_share/project-state.py`.
2. Reload the tab. Colors should come back.
3. If they don't, check that `python3` works and `SDLC_PYTHON_BIN` points at it.

## The tab doesn't update when the model changes
What's happening: the live connection dropped.
1. Reload the tab. That alone usually fixes it.
2. If it keeps happening, restart the server.

## The "adoption" number looks too low
What's happening: the tab reports its own usage in the background, and a report can be
dropped if the server blinks. This never blocks the tab. There's nothing to fix — the
count just runs a little low.

## You see "forbidden origin" or "forbidden host" in the logs
What's happening: the safety guard refused a request that didn't come from the dashboard.
1. If you changed the dev web port away from `5180`, set `SDLC_WEB_DEV_PORT` to the new port
   and restart.
2. Otherwise, this is the guard doing its job — a page that isn't the dashboard tried to
   reach the server. No action needed.

## Turn it off (rollback)
The Architecture tab is an add-on; removing it is clean.
1. Undo the system-map changes: on the `v2-prototype-architecture-tab` branch,
   `git revert` the system-map commits.
2. Restart: `npm run dev`.
3. Confirm it's alive: `curl -s http://127.0.0.1:4317/api/health`.

There are no database changes to undo and no feature flag — revert and restart is the
only off switch.
