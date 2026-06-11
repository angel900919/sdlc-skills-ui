# React / Next.js — Rule Packs

Read only the pack(s) that match the classified task. Each pack is a tight, imperative list distilled from the 2025-2026 React patterns review (React 18 → 19, Next.js 13–14 App Router, Vercel AI SDK).

## Hard defaults — apply to every React task

- **Function components only.** Class components ONLY for Error Boundaries (still class-only via `getDerivedStateFromError`).
- **TypeScript by default.** Typed prop interfaces, generic components and hooks (`Select<T>`, `useLocalStorage<T>`).
- **Hooks-first for reuse.** Reach for a custom hook before HOC or render-props.
- **Server Components by default** in Next.js App Router; add `"use client"` only at the leaf that needs interactivity, browser APIs, or state.
- **Never ship API keys to the client.** LLM / third-party calls go through a server route or Server Action.
- **Stream when you can.** `renderToPipeableStream` + `<Suspense>` — not `renderToString`.
- **No `useEffect` for derived state**, event handling, or anything synchronous from props. Effects are for subscriptions and external side effects.
- **No blanket `useMemo` / `useCallback`.** The React Compiler covers most cases; memoize only when profiling shows a problem.

## Pack: component

A presentational leaf — Button, Card, Badge, Avatar, ListItem.

- Function component. No class.
- Type props with an `interface` or `type` alias; mark optional with `?`, don't default to `any`.
- Conditional render with ternary or `&&`. No nested `if` trees inside JSX.
- Lift state only as far as needed; otherwise keep it local.
- Prefer `children` over render-prop APIs. Do NOT ship a `render={fn}` prop on new components.
- Inputs: pick one model per form — **controlled** (`value` + `onChange`) for live validation, **uncontrolled** (`ref` + `defaultValue`) for simple Server-Action submits.
- Wrap risky subtrees (third-party widgets, dynamic imports, AI streams) in an Error Boundary.
- Compose styles with Tailwind utility classes; reach for `styled-components` / CVA only when the project already uses one.
- Mark the component `"use client"` ONLY if it uses state, effects, refs, browser APIs, or event handlers. Otherwise leave it as a Server Component.

## Pack: component-family

Tabs, Dropdown, Menu, Modal, Accordion — multiple components sharing state.

- Use **Compound Components via Context**, NOT `React.Children.map` + `cloneElement`. The map approach only reaches direct children and breaks the instant someone wraps a child in `<div>`.
- Parent owns state and exposes a `Context.Provider`. Children consume via a single `use<Family>()` hook that **throws** if used outside the provider.
- Attach subcomponents as static properties for a declarative consumer API: `FlyOut.Toggle`, `FlyOut.List`, `FlyOut.Item`.
- Memoize the context value with `useMemo` so consumers don't re-render when the parent re-renders for unrelated reasons.
- If you have independent state slices that change at different rates, split into multiple contexts rather than one fat context.
- Expose imperative actions through the context value (`{ open, toggle, close }`), not by exposing the setter directly.
- Keep the family in one file (or one folder with a barrel) so the static-property API stays discoverable.

## Pack: custom-hook

Extracting stateful logic for reuse (`useDebounce`, `useLocalStorage`, `useKeyPress`, `useDogImages`).

- Name **must** start with `use`. The linter and React rely on it.
- Top-level calls only. No hooks inside conditionals, loops, nested functions, or after early returns.
- Return shape: **tuple** `[value, setter]` for state-shaped hooks; **object** `{ value, actions }` for multi-action hooks. Pick by shape, be consistent.
- Generic hooks should be generic in TS: `useLocalStorage<T>(key: string, initial: T)`.
- List **all** dependencies in `useEffect` / `useCallback` / `useMemo`. Do not suppress the exhaustive-deps lint rule — fix the underlying issue.
- **Skip `useEffect`** for: derived state (`const full = first + ' ' + last`), event-driven updates (do it in the handler), anything synchronous from props.
- Subscribe in the effect body; cleanup in the returned function. Always pair them.
- For data fetching, prefer the framework's data layer (Server Components, `fetch` cache, TanStack Query, SWR) over hand-rolled `useEffect` fetches.
- React 19: prefer `useOptimistic` for instant-feedback updates, `use(promise)` to await a promise inside a component, `use(Context)` for conditional context reads.

## Pack: page

A Next.js route or full screen. Decide rendering **before** writing components.

- Rendering decision table:

  | Page shape | Strategy |
  |---|---|
  | Identical for all users, infrequent updates | SSG (App Router default) |
  | Identical for all users, content updates between deploys | SSG + ISR (`revalidate`, `revalidateTag`, `revalidatePath`) |
  | Personalized per-user, request-dependent | SSR / Streaming SSR |
  | Data-heavy but mostly read-only | RSC inside a streamed shell |
  | Interactive widget only, no SEO need | Client Component (`"use client"`) |
  | Pure CSR | Only for internal dashboards behind auth |

- Server Component is the default. Only add `"use client"` at the **lowest leaf** that needs interactivity. Hoist `"use client"` down the tree, not up.
- Data fetching lives in Server Components or Server Actions, NOT in `useEffect`.
- Heavy libraries (markdown parsers, sanitizers, date-fns, chart libs) belong in Server Components — they never reach the client bundle.
- Wrap below-the-fold sections (Comments, "You may also like", Reviews) in `<Suspense fallback={...}>` so they stream independently and selectively hydrate.
- For mutations, use Server Actions (`"use server"`) called from `<form action={...}>` or event handlers. Skip API routes unless you need a public URL.
- For ISR, use `revalidateTag(tag)` for fine-grained invalidation; reserve `revalidatePath(path)` for whole-page busts.
- Next 14: consider Partial Prerendering (PPR) when the page has a static shell with dynamic islands.

## Pack: form

Sign-up, checkout, settings, search filters, any data submission.

- Default to **controlled inputs** when you need live validation; **uncontrolled** (`<form action={action}>` with `FormData`) is fine for simple Server-Action posts.
- React 19 APIs (use them):
  - `useActionState(action, initial)` — wraps a Server Action and returns `[state, formAction, isPending]`. Use for form state + error handling.
  - `useFormStatus()` — call **inside** a submit button to read `{ pending }`. Disable the button while pending.
  - `useOptimistic(state, reducer)` — for instant-feedback list updates (chat messages, todo adds) before the server replies.
- Server Actions for mutations. Return `{ error: string | null, data?: T }` so the client can render error state.
- Surface validation errors inline next to the field, not in a global toast. Keyboard focus moves to the first error.
- For lists, optimistic insert immediately; reconcile when the server response arrives. On error, roll back and show the error inline.
- Don't write a custom `isSubmitting` flag if you can read it from `useFormStatus` or `useActionState`.
- For complex forms, consider `react-hook-form` + `zod` — but the React 19 primitives cover most cases now.

## Pack: ai

Chat, autocomplete, agentic UIs, anything that streams from an LLM.

- **API key NEVER on the client.** Always proxy through a Node/Edge server route or Server Action. The client must not know the provider's key exists.
- Stream tokens. Server returns a streaming response (`StreamingTextResponse`, `ReadableStream`); client renders incrementally.
- Use the Vercel AI SDK as the client transport: `useChat()` for conversational, `useCompletion()` for one-shot. Returns `{ messages, input, handleInputChange, handleSubmit, isLoading, stop }`.
- Separate transport from UI: keep a presentational `<ChatMessage>` + `<InputBox>` pair; `useChat` is the data layer. Don't mix them.
- **Debounce auto-suggest input ~300–500ms.** Never fire one request per keystroke.
- **Disable input while `isLoading`** and expose a visible `stop()` / cancel button to abort the stream.
- Optimistic UI: push the user's message into the visible list immediately (`useOptimistic` or local push), reconcile when the server response begins.
- Message shape: `{ role: 'user' | 'assistant' | 'system' | 'tool', content: string }[]`. Tool calls and tool results are separate roles.
- Errors: inline retry next to the failed message, never a silent swallow. Distinguish "network error" (retry) from "model refusal" (don't retry, show explanation).
- For agentic flows, render pending tool calls and intermediate steps so the user understands what the agent is doing.

## Pack: performance

Code-splitting, hydration, RSC migration, "page feels slow."

- Stream SSR with `renderToPipeableStream` (Node) or `renderToReadableStream` (Edge):
  - `onShellReady()` — flush the shell, start streaming
  - `onAllReady()` — everything ready (use for SSG / crawler responses)
  - `onError(e)` — log and convert to 500
  - Do NOT use `renderToString` for new code — loses Suspense streaming and selective hydration.
- Wrap independent UI islands in `<Suspense>` so they stream and hydrate independently. React prioritizes hydrating whichever island the user interacts with first (selective hydration).
- Code-split with `React.lazy(() => import('./Heavy'))` + `<Suspense fallback={...}>` for routes and heavy widgets. RSCs split automatically at `"use client"` boundaries.
- Move expensive computations and heavy dependencies into Server Components — they don't ship JS to the client at all (typical savings 18–29% of bundle).
- Don't blanket-memoize. The React Compiler ("Forget") covers most cases. Reach for `useMemo` / `useCallback` only when profiling shows a measurable re-render problem.
- Avoid creating new objects or inline functions in props passed to memoized children — that defeats memoization.
- Images: `next/image` (or `<img loading="lazy">` outside Next), correct `sizes`, modern formats (AVIF/WebP), explicit width/height to prevent CLS.
- Below-the-fold widgets (Comments, Recommendations): combine `<Suspense>` + `React.lazy` + progressive hydration.

## Pack: cross-cutting

Auth, logging, theming, feature flags, i18n across many components.

- **Default to a custom hook** (`useAuth`, `useTheme`, `useFeatureFlag`) instead of an HOC. HOCs cause prop-name collisions and wrapper hell.
- Use a Provider + Context to distribute the value. Place the provider at the highest reasonable point in the tree (often the root layout).
- React 19: prefer `use(Context)` for conditional reads — it works inside `if`, `for`, and after early returns.
- **Split contexts by update frequency.** A "rarely changes" context (theme, locale) and a "changes often" context (current user, draft state) should be separate. One re-render shouldn't cascade through unrelated consumers.
- For server-injected values (current user, locale, feature flags), prefer reading from a Server Component layout and passing down as props, instead of a client-side Context.
- Memoize the provider value with `useMemo` so children don't re-render when the parent re-renders for unrelated reasons.
- HOCs are still acceptable when ALL of: (a) the wrapped behavior is fully uncustomized, (b) it must wrap many components, (c) it genuinely can't be a hook (e.g., framework-mandated wrappers like `React.memo`, `observer` from MobX, `connect` from legacy Redux).
- For feature flags, fetch flags on the server (Server Component or middleware) and pass down — don't flicker between flag states on the client.

## Pack-selection map

| Task phrasing | Packs to load |
|---|---|
| "Build a Button / Card / Badge / Avatar" | `component` |
| "Build a Tabs / Dropdown / Menu / Modal / Accordion" | `component-family` |
| "Write a `useXxx` hook" / "Extract this logic" | `custom-hook` |
| "Add a `/products/[id]` page" / "Build the home page" | `page` (+ `performance` if heavy) |
| "Build a sign-up / checkout / settings form" | `form` (+ `component`) |
| "Add a chatbot / AI autocomplete / agentic UI" | `ai` (+ `form`) |
| "Page feels slow" / "TTI is bad" / "Reduce bundle" | `performance` (+ `page`) |
| "Add auth / logging / theme across components" | `cross-cutting` |
