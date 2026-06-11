# Mermaid syntax gotchas & per-type cheat-sheets

The validator catches errors; this file helps you avoid them in the first place and fix them fast.

## The failures that cause ~90% of parse errors

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `Parse error ... Expecting 'SQE'/'PE'/'DIAMOND_STOP'` | Special char in a node label | Quote the whole label: `A["Order (paid)"]` |
| Diagram truncates / subgraph swallows nodes | Node id literally `end` | Rename: `done`, `finish`, `end_` |
| Edge label fails | Unquoted `:`, `|`, `#` in label | `A -->|"rate: hourly"| B` |
| `Lexical error` near a word | Reserved-ish token (`graph`, `subgraph`, `class`, `click`, `style`, `linkStyle`) used as an id | Rename the node |
| Class diagram method fails | Unescaped generics `List<Order>` | Use `List~Order~` (Mermaid generic syntax) |
| Nothing renders, no error | Missing diagram-type header line | First non-comment line must be `flowchart TD`, `sequenceDiagram`, etc. |
| Newline inside a label | Literal line break in `[...]` | Use `<br/>`: `A["line one<br/>line two"]` |

**Golden rule:** if a label contains any of `( ) [ ] { } : ; / # " ' < >` or starts with a digit, wrap it in double quotes. When in doubt, quote it.

## Characters that must be escaped inside quoted labels

- `"` inside a quoted label → use `#quot;` or `&quot;`
- `<` / `>` → use `&lt;` / `&gt;` (or `<br/>` for an intentional line break)
- A literal `#` at the start → quote the label

## Per-type cheat-sheets (each validated)

### Flowchart
```mermaid
flowchart TD
  Start([User opens app]) --> Q{"Signed in?"}
  Q -->|no| Login[Log in]
  Q -->|yes| Home["Home (feed)"]
  Login --> Home
```
- Directions: `TD`/`TB` (top-down), `LR` (left-right), `BT`, `RL`.
- Shapes: `[rect]`, `(round)`, `([stadium])`, `{diamond}`, `[[subroutine]]`, `[(database)]`, `((circle))`.
- Subgraphs: `subgraph title ... end` — never name a node `end`.

### Sequence
```mermaid
sequenceDiagram
  actor User
  participant App
  participant API
  User->>App: Submit form
  App->>API: POST /sessions
  API-->>App: 201 Created
  App-->>User: Confirmation
```
- Arrows: `->>` (solid call), `-->>` (dashed return), `-x` (lost), `-)` (async).
- `activate`/`deactivate` or `+`/`-` for activation bars. `Note over A,B: text`.

### State (lifecycle / status machine — ideal for `.human` summaries of invariants)
```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> Open: submit
  Open --> Paid: payment clears
  Open --> Cancelled: cancel
  Paid --> [*]
  Cancelled --> [*]
```
- Use `stateDiagram-v2` (not `stateDiagram`). `[*]` is the start/end pseudo-state.

### Entity-relationship (good for `.human` mirror of an `.ai` entity model)
```mermaid
erDiagram
  CLIENT ||--o{ SESSION : books
  SESSION ||--|| INVOICE : produces
  CLIENT {
    string name
    string email
  }
```
- Cardinality: `||` exactly one, `o{` zero-or-many, `|{` one-or-many.

### Class
```mermaid
classDiagram
  class Session {
    +String id
    +DateTime closedAt
    +invoice() Invoice
  }
  Session "1" --> "1" Invoice : produces
```
- Generics use tildes: `List~Session~`. Visibility: `+ - # ~`.

### User journey (great for a plain-English journey summary)
```mermaid
journey
  title Close a session and bill the client
  section Close out
    Open app: 4: Maya
    Find unbilled session: 3: Maya
  section Bill
    Confirm rate: 5: Maya
    Send invoice: 5: Maya
```
- Scores are 1–5 (sentiment). Each task: `Task name: score: Actor`.

### Mindmap (idea / scope breakdown — good for an idea-on-a-page in `.human/intake`)
```mermaid
mindmap
  root((Running club app))
    Members
      RSVP to runs
      See who is coming
    Organizer
      Post a run
```
- Indentation defines hierarchy. Root shape `((text))`. Keep labels short.

### Gantt
```mermaid
gantt
  title Rollout
  dateFormat YYYY-MM-DD
  section Build
  Spike      :a1, 2026-06-01, 5d
  MVP        :after a1, 10d
```

### C4 context
```mermaid
C4Context
  title System context
  Person(user, "Runner")
  System(app, "Club app", "RSVP to weekend runs")
  Rel(user, app, "RSVPs via")
```

## Picking the right diagram for an artifact

| You want to show… | Use |
| :--- | :--- |
| How a user gets a job done, step by step | `journey` or `flowchart LR` |
| What states a thing moves through (lifecycle, invariants) | `stateDiagram-v2` |
| The domain entities and how they relate | `erDiagram` |
| Who talks to whom and in what order | `sequenceDiagram` |
| The shape/scope of an idea at a glance | `mindmap` |
| System boundaries and external actors | `C4Context` |

Validate after writing. Always.
