# Per-surface design checklists

For `/design` Phase 3. A feature exposes a **surface** — the shape of the thing being built. The surface adds 3–5 design concerns and a file-layout hint on top of the default rounds. This is the lean replacement for the legacy 7-overlay-file system: one file, six checklists, no heavy picker round.

## How to detect the surface (light)

Infer from `maps_to_component` (what the component does) + the anchor stack — then recommend and confirm in one line. No menu, no dedicated round.

- Component owns a browser view / the stack is Next.js, React, Vue, SvelteKit → **web-ui**.
- Component owns an iOS/Android/RN/Flutter screen → **mobile**.
- `ai_in_core_path: true` in `anchor.md`, or the PRD carries an AI transparency card → **ai-llm** *(mandatory — see below)*.
- Component is a batch ETL / stream processor → **data-pipeline**.
- Component is a command-line tool or a published SDK/library, no network surface → **cli/lib**.
- Component is Terraform / Pulumi / K8s / provisioning → **infra**.
- No UI, plain HTTP/RPC/job/queue-consumer → **backend-service** (the default; no extra checklist, the base rounds cover it).

A feature can span two surfaces (e.g. web-ui + backend-service). Apply both checklists, but bias toward one surface — if it could ship as two features, say so once. **Cross-surface contract rule:** whichever surface *produces* a contract owns it; the other references it (backend owns the API table; web-ui references it, doesn't redeclare).

---

## web-ui

1. **Component tree** — the new/changed components and their parent-child nesting (not a full re-draw of the app).
2. **State & data fetching** — where server state lives (loader / query hook / RSC), client state owner, optimistic-update policy.
3. **Navigation** — new routes/params and how the user reaches them; auth-gated routes named.
4. **Accessibility** — keyboard path, focus management, ARIA for any custom control, and the a11y test in the test plan.
5. **Loading / empty / error states** — every async view names all three; error surfaces map to the API's 4xx/5xx error shapes.

*File-layout hint:* follow anchor's framework convention (`app/` routes + `components/` for Next.js; `src/routes` + `src/lib` for SvelteKit). Co-locate the component test next to the component.

---

## mobile

1. **Screen / navigation graph** — new screens + the navigation transitions (stack/tab/modal) reaching them.
2. **Offline & sync** — what works offline, the local store, the conflict-resolution rule on reconnect.
3. **Platform differences** — anything that diverges iOS vs Android (permissions, native modules, push).
4. **Permissions & lifecycle** — runtime permissions requested + when; background/foreground handling.
5. **Release surface** — build channel / OTA-update policy; the slowest-to-fix path (store review) flagged.

*File-layout hint:* feature folder under `src/features/<feature>/` (screens, hooks, native bridges); platform-specific files via the `.ios.tsx`/`.android.tsx` split where the stack supports it.

---

## ai-llm  *(MANDATORY when `ai_in_core_path` or the PRD carries an AI transparency card)*

Don't let AI rigor drop between `/prd` and the build. The design must carry:

1. **Prompt design** — the prompt template (system + user structure), where inputs are interpolated, and the injection-defense boundary (untrusted input never reaches the system slot). A tested prompt template may be inlined via the prototype-snippet exception.
2. **Model & params** — provider/model (from `anchor.md` AI block), temperature/token caps, fallback model on error/timeout, and the per-request cost ceiling honored.
3. **Eval design** — the eval suite + dataset, pass/fail metric and threshold, and (production) a judge model that **differs from the drafter** (per anchor). How regressions are caught before ship.
4. **AI transparency card honored** — every field of the PRD's AI card maps to a design element: what the AI does / does NOT do / data it sees / data it never sees / where it runs / opt-out path. Name the module enforcing each.
5. **Failure & grounding** — hallucination/refusal handling, retrieval grounding if RAG, output validation (schema/guardrail) before the result is trusted.

*File-layout hint:* `src/ai/<feature>/` with `prompt.ts`, `eval/` (dataset + runner), and the guardrail/validator co-located. Keep prompts in version control, not inline string literals scattered across modules.

---

## data-pipeline

1. **Pipeline DAG** — stages (extract → transform → load) and their ordering/dependencies; the call-flow step list doubles as the DAG.
2. **Schema contract** — input schema, output schema, and the event/payload schema if streaming; schema-evolution policy.
3. **Idempotency & replay** — exactly-once vs at-least-once, dedupe key, and how a replay/backfill is run safely.
4. **Partitioning & scale** — partition key, watermark/late-data handling (stream), batch window size.
5. **Data quality** — validation gates, the dead-letter path for bad records, and the freshness/completeness metric in observability.

*File-layout hint:* `pipelines/<feature>/` with stage modules + a DAG definition file matching the orchestrator (Airflow DAG, Dagster job, etc.).

---

## cli/lib

1. **Public API surface** — the exact commands/flags (CLI) or exported functions/types (library); this is the contract consumers depend on.
2. **Backward compatibility** — semver impact of the change; what breaks; the deprecation path for any removed surface.
3. **Input/output contract** — argument parsing, stdin/stdout/exit-code conventions (CLI); return/throw contract (library).
4. **Errors & help** — error messages + exit codes; `--help` text for new commands.
5. **Distribution** — how it ships (npm package, binary, Homebrew); versioning of the published artifact.

*File-layout hint:* `src/commands/` (CLI) or a clean `src/index.ts` barrel exposing only the public surface (library); keep internals un-exported.

---

## infra

1. **Resources & module boundary** — the resources provisioned and the module's inputs/outputs (variables/outputs); blast radius named.
2. **State & drift** — where state lives, locking, and how drift is detected.
3. **Idempotency & rollback** — plan/apply safety, the rollback path, and what a failed apply leaves behind.
4. **Secrets & IAM** — least-privilege roles, secret sourcing (never inline), the auth boundary the resources sit behind.
5. **Environments** — how the module parameterizes dev/staging/prod; what differs per environment.

*File-layout hint:* `infra/<feature>/` with the module + a `variables`/`outputs` split + per-env tfvars; outputs other surfaces consume are the owned contract.
