# ADR-0001 (system-map) — We will render the System Map ourselves now and defer LikeC4, adopting its metadata convention

- Status: accepted (2026-06-13)
- Context: the System Map needs a status-colored component graph from a markdown-sourced model.
  [LikeC4](https://github.com/likec4/likec4) (MIT, actively maintained — `v1.58.0`, 2026-06-05) is
  the purpose-built tool and, on inspection, is **not** declared-structure-only: elements carry
  queryable metadata, custom React node renderers can read `getMetadata()` to drive status color,
  `@likec4/core` is a rich graph-query API, and it renders on `@xyflow/react` — which we already
  ship. So "why not just use LikeC4?" is the obvious question a future reader will ask. But for
  slice-1 it drags in a second styling stack (Mantine/PandaCSS), shadow-DOM/bundle weight, and a
  compile/layout pipeline; its metadata is part of the *compiled* model, so live status updates
  mean re-deriving/re-layouting on our side anyway. We already have a proven status-colored
  `@xyflow/react` + MUI pattern in `PipelinePage`.
- Decision: We will build the slice-1 renderer on our own `@xyflow/react` + MUI custom nodes
  (the `PipelinePage` pattern + `theme.ts` `statusColor` tokens) — no new dependency. We will
  **adopt LikeC4's metadata convention** in `ComponentNode`/`ArchEdge` (`status`, `progress`,
  `issue`, `codePath` keys; component `kind`; typed edges) so the model is forward-compatible. We
  will **defer** evaluating LikeC4-as-renderer and `@likec4/core`-as-model-backbone to the C4-view
  and code↔model **drift** fast-follow, where its multi-view, code-path links, and graph queries
  genuinely pay off. The alternative — adopting LikeC4 now — is rejected for slice-1 as premature
  (YAGNI; simplicity among correct solutions).
- Consequences: slice-1 stays simple and visually coherent (one styling system, full MUI control,
  a direct markdown→graph mapping we own). The forward-compat hedge makes the later decision
  "feed the same model into `@likec4/core` / swap the renderer," not a remodel — a low-cost option
  kept open. The trade: we hand-roll graph layout (static grid like `PipelinePage`, or a small
  layout pass) and the status-rollup queries that `@likec4/core` would otherwise provide; and we
  re-confirm the build-vs-buy call at the drift fast-follow rather than committing now. New
  dependency only at that point → an `anchor.approved_dependencies` add then, not now.
