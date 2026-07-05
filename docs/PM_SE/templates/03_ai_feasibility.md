# 03 · AI Feasibility — <Product Name>

> **Copy only when a model's output reaches users or decisions. Skipping? One line in the tracker's tailoring log.**
>
> **Phase 1 · feeds G1 Opportunity Gate** — §§1–6. **Updated in Phase 2** with the model decision — §§7–8. Time budget: ~half a day, most of it §2. Exists to prevent: months of build on a product a rules engine could do — or a model can't. Hardware in the product too? Fill `04_hw_feasibility.md` as well — they're twins.
>
> Prices, model capabilities, and vendor terms move fast: **verify current** at decision time, never from memory, and date every number. Delete sections that don't apply — with a tailoring line.

| Owner | Date | Status |
|---|---|---|
| | | Draft / Final |

## 1. The AI-or-not check

> List the non-AI ways to solve the job. If one covers ~90% of cases at a fraction of the cost, don't use AI — or use it only for the residual.

| Non-AI alternative | % of cases it covers | Cost/effort | Verdict |
|---|---|---|---|
| Rules / heuristics | | | |
| Search / lookup / template | | | |
| Manual / concierge | | | |

**Decision:** AI / hybrid (AI only for <residual>) / no AI — <why, one line>

## 2. Error analysis on real examples ← the highest-value hour you'll spend

> Collect **30–100 real inputs** (real tickets, docs, queries — from the manual process or Wizard-of-Oz if the product doesn't exist). Run them through a frontier model with a simple prompt. Read every output. Label pass/fail. Name and count the failure modes. This is feasibility evidence *and* the seed of your Phase 2 golden set.

- **Examples collected:** <n> — source: <where they came from — must be real>
- **Setup:** model <name+version> · prompt v0 (keep it) · date <…>

| Failure mode (name it) | Count | Example | Fixable by… (prompt / retrieval / scope cut / nothing) |
|---|---|---|---|
| hallucinated policy details *(example — delete)* | | | |
| wrong output format *(example — delete)* | | | |

## 3. Zero-shot baseline — the bar to beat

> Record this **before** spending anything on data, labeling, or fine-tuning. Every later investment must measurably beat it.

**Baseline: <x>/<n> pass (<%>) — model <name+version>, prompt v0, examples v0, <date>**

**Read:** <strong signal / promising with fixes / no learnable signal → feasibility FAIL at G1>

## 4. Data reality check

| Question | Answer |
|---|---|
| What data does this need at runtime? | |
| Do we have it / can we get it? | |
| **Provenance** — where it comes from, license/terms allow this use? | |
| **Lawful basis** — personal data? consent/legitimate basis? (unlawful data = dead product) | |
| Fresh enough? Update path? | |

## 5. Cost-per-successful-outcome sketch

> Not cost-per-token. Include retries and context: `cost ≈ (model cost per request × requests per successful outcome)`. A 70% success rate inflates cost ×1.4.

| | Pilot | Target scale | 10× |
|---|---|---|---|
| Outcomes / month | | | |
| Cost per successful outcome | | | |
| Value per outcome (price or savings) | | | |
| **Margin per outcome** | | | |

**Read:** <positive with room / thin — reshape levers: smaller model, caching, cap output & reasoning tokens, trim context, narrow scope / underwater → viability FAIL>

## 6. Local-LLM block *(delete if hosted-only — one tailoring line)*

> "Runs locally" is a measurement, not a vibe. Measure on the **actual target hardware** — "runs on a Pi 5 8GB?" is answered by a Pi 5 8GB, never by your dev machine.

**Target device:** <device, RAM/VRAM> · **model + quantization:** <name, quant> · **date:** <…>

| Measured on target | Value |
|---|---|
| RAM / VRAM at load and at peak | |
| Tokens/sec (generation, sustained — not the first request) | |
| Latency: first token / full response | |
| §3 examples re-run at this quantization | <x>/<n> pass |

- [ ] **Weights license** permits commercial use + our distribution mode — read the actual license, not the model-card summary (**verify current**)
- [ ] Quantized file's provenance trusted — you ship exactly this artifact

**Read:** <fits with headroom / fits only at a quantization that fails §3 → stay hosted / doesn't fit → local is a feasibility FAIL>

---

## 7. Model decision *(Phase 2 — a config choice, not a marriage)*

> Rule: the **cheapest model that clears your frozen ship-bar** (`07_ship_bar.md`), behind a swappable interface, with a named fallback. Buy the base (hosted APIs); build only your differentiation. Climb ladders only when the current rung measurably fails the bar. Local-vs-API is a 1-way door → ADR in `15_decision_log.md`.

| | Choice | Why |
|---|---|---|
| **Primary model** | <name+version, pinned> | cheapest that clears the bar |
| **Fallback** | <stronger model / non-AI path / human> | when primary fails or degrades |
| **Capability rung** | prompt / +RAG / +fine-tune | <evidence the cheaper rung failed, if above "prompt"> |
| **Deployment rung** | hosted API / local quantized | <§6 measurements, if local> |
| **Price snapshot** (verify current) | <$ /Mtok in·out> | verified <date> |

## 8. Vendor check *(before real user data flows anywhere)*

> The deal-killers — get them in writing (contract, not a UI toggle) or walk. Terms change: **verify current**.

- [ ] Vendor does **not train on our data** (in the contract)
- [ ] Data **deletion** actually works (incl. logs/backups) on request
- [ ] Data residency/tenancy acceptable for our users
- [ ] Model **version pinning** — no silent model swaps under us
- [ ] If PII flows: DPA signed (scale-up trigger → see README Right-sizing)
