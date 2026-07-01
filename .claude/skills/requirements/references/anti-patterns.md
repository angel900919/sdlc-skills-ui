# Requirements — anti-patterns (scan the draft before writing)

Each row is a rejection class. If the draft shows the symptom, fix it before writing the artifacts.

| Symptom | Why it fails | Fix |
| :-- | :-- | :-- |
| Untestable adjective ("fast", "robust", "intuitive"). | No measurable threshold or condition — not SMART | Replace with a number + condition; SMART-check it. |
| Two requirements in one ("…and…"). | Double-barrelled — can't pass/fail cleanly | Split into one observable behaviour per requirement. |
| Requirement with no parent need. | A solution invented ahead of the problem | Trace to a discovery/understanding/strategy need; if none exists, drop it or mark `TODO: need validation`. |
| A need with no covering requirement. | Coverage gap | Add a requirement, or record the need as out-of-scope with a reason. |
| Quality attribute filed as functional. | Mixed "what it does" with "how well" | Reclassify: performance/reliability/security/usability → quality, not functional. |
| Regulation captured as a vague constraint without naming the standard. | A citable industry standard treated like a generic budget/tech limit — the source is lost | Keep it a constraint (per rule 5), but name and cite the specific standard/clause. |
| A solution stated as a requirement ("use a Postgres table"). | Design leaking into the requirement layer | Capture the need behind it ("retain records for N years"); the stack lives in `/anchor`, the design in `/architect`/`/design`. |
| Invented threshold or standard clause. | Answered an external question from the room | Mark it `TODO:` with an owner, or route to `/research-report`; never fabricate a number. |
| Requirements renumbered between runs. | IDs treated as disposable | REQ-NN is stable for life; add new IDs, never reuse or renumber existing ones. |
| Method treated as the final test plan. | Forgot `/qa` / `/test-strategy` own verification | Label the test/inspect/analyze/demo as a *seed*; leave the authoritative plan to `/qa`. |
| A requirement set with nothing measurable. | A wish list, not a contract | Name the measures that say the system works; ladder mission-level ones to the North Star / success metric. |
