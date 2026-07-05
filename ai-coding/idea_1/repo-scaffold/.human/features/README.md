# Feature Docs

One document per non-trivial feature, written for a human who needs to understand or safely change it.
Use `TEMPLATE.md` to start a new one, named `feature-name.md`.

A good feature doc: what it does (behavior), how it works (mechanism + a small diagram), where the code
is, the key decisions (linked to `.human/adr/`), edge cases, and how to change it without breaking
invariants. Link each feature doc from the code it describes and from `.human/architecture.md`.
