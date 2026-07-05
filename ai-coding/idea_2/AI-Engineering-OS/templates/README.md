# templates/ — Root-level starters

Copy these to your **repo root** — they live outside `.ai/` and `.human/`:

| File | Purpose | Where it goes |
|---|---|---|
| `AGENTS.md` | The operating contract the agent reads first | repo root |
| `verify.sh` | The deterministic gate (tests + lint + diff cap + marker scan) | repo root — `chmod +x verify.sh` |

The `.ai/` and `.human/` directories are **themselves the templates** — copy those folders directly and fill in the `(example — delete)` rows. Everything is calibrated to the house style in [`../CONVENTIONS.md`](../CONVENTIONS.md).

## Fastest path to adoption
```bash
# from your repo root
cp -r <path>/AI-Engineering-OS/.ai   .ai
cp -r <path>/AI-Engineering-OS/.human .human
cp    <path>/AI-Engineering-OS/templates/AGENTS.md  AGENTS.md
cp    <path>/AI-Engineering-OS/templates/verify.sh  verify.sh && chmod +x verify.sh
# then fill .ai/project-state.md, .ai/architecture.md, .ai/coding-standards.md and open PLAYBOOK.md
```
