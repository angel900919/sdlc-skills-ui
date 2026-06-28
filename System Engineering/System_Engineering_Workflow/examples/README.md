# Worked Examples

Four complete, end‑to‑end instances of the [workflow](../README.md), chosen to span very different domains so you can see how the *same* 12‑stage process and 8 threads adapt. Each runs the full **Phase 00 → 11** with a coherent traceability spine (`need → requirement → design → test → ops → disposal`).

| # | Example | Domain | Lifecycle | What it best demonstrates |
|---|---|---|---|---|
| 1 | [EV Charging Station Network](../worked_example/) | Hardware + cloud (energy/EV) | Hybrid V + Agile | The **canonical** reference; power/safety‑critical + cloud; OCPP/ISO 15118; corrected COCOMO & decision matrices |
| 2 | [TalentFlow — B2B SaaS ATS](2_SaaS_ATS/) | Pure SaaS (multi‑tenant) | Agile / SAFe | The **software‑leaning** path — multi‑tenant isolation, privacy/GDPR & right‑to‑erasure, availability SLOs, scalability; Production collapses to release, no HIL |
| 3 | [SentinelEdge — Industrial IoT + Edge AI](3_IoT_Edge_AI/) | Hardware + firmware + edge‑AI + cloud | Hybrid V + Agile | The **hardware/hybrid + embedded‑ML** path — the on‑device AI model as a first‑class V&V item (accuracy, drift, OTA), RAMS, HIL, e‑waste disposal |
| 4 | [Aria — AI Work Assistant](4_Work_Assistant/) | Software + LLM/agentic | Agile | The **integration‑ & AI‑heavy** path — 4 SaaS integrations (Outlook/HubSpot/JIRA/Therefore), a unified dashboard + AI chat, identity/least‑privilege, and **how to verify & validate an LLM agent** (eval sets, prompt‑injection, human‑in‑the‑loop action safety) |

## How to read an example

Each folder has a `README.md` (system‑at‑a‑glance + phase index + traceability spine) and one folder per phase. Start at the example's README, then walk Phase 01 (the need) → 02 (the requirements) → 04/05 (the design + decisions) → 07/08 (proving it) → 10/11 (running and retiring it).

> These are **demonstrations of the process**, not production specs — numbers and vendors are illustrative. When you run the workflow on your own system, the AI produces the same artifacts grounded in *your* answers. Calibrate, don't copy.

## Why these four

They were chosen to stress different parts of the workflow:
- **Tailoring** — SaaS shows the lean software path; the EV network and IoT device show the full Formal/safety path; Aria shows Formal *only* on security/privacy/AI‑action‑safety.
- **Threads** — privacy/security dominate SaaS & Aria; safety/RAMS dominate EV & IoT; measurement/TPMs dominate IoT (edge‑AI accuracy) and SaaS (SLOs).
- **The hard new thing** — each has one: multi‑tenancy (SaaS), embedded ML (IoT), and an autonomous LLM agent acting across four systems (Aria).
