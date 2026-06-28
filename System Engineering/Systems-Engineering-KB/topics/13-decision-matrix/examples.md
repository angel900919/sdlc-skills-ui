# Decision Matrices: Ranking & Scoring Alternatives — Examples

## Simple example — choosing a system architecture (fully worked)

**Scenario.** Choose between three system architectures (source: m3-decision):

- A: Centralized Server
- B: Distributed Microservices
- C: Serverless Cloud Functions

**Step 1 — Define criteria.** Pick the most important factors: **performance, cost, scalability** (source: m3-decision).

**Step 2 — Identify alternatives.** A, B, C above (source: m3-decision).

**Step 3 — Weight the criteria** (percentages as decimals; performance matters most): performance **0.4**, cost **0.3**, scalability **0.3** — they sum to 1.0 (source: m3-decision).

**Step 4 — Score each alternative (1–5) and Step 5 — multiply score × weight.** Reason for each row: score reflects how well each option performs; the product scales it by importance.

| Criteria | Weight | A: Centralized | B: Microservices | C: Serverless |
|---|---|---|---|---|
| Performance | 0.4 | 3 → 3×0.4 = **1.2** | 4 → 4×0.4 = **1.6** | 5 → 5×0.4 = **2.0** |
| Cost | 0.3 | 5 → 5×0.3 = **1.5** | 3 → 3×0.3 = **0.9** | 4 → 4×0.3 = **1.2** |
| Scalability | 0.3 | 2 → 2×0.3 = **0.6** | 5 → 5×0.3 = **1.5** | 5 → 5×0.3 = **1.5** |
| **Total** | | **3.3** | **4.0** | **4.7** |

(source: m3-decision)

**Step 6 — Decide.** Sum each column: A = 1.2 + 1.5 + 0.6 = **3.3**; B = 1.6 + 0.9 + 1.5 = **4.0**; C = 2.0 + 1.2 + 1.5 = **4.7**. The highest total wins → **Option C, Serverless Cloud Functions (4.7)** (source: m3-decision).

> Note the lesson on weighting: A scores best on cost (5) but its weak scalability (2) and middling performance (3) sink its total. C wins by being strong on the heavily-weighted performance.

## Intermediate example — Smart Campus System (completion problem)

**Scenario.** A university implements a **Smart Campus System** (IoT sensors, smart classrooms, campus-wide mobile app). Choose among three alternatives (source: m3-ex-decision):

- **Alternative 1 (Cloud):** cloud-based solution managing all classroom data and scheduling.
- **Alternative 2 (Hybrid):** some data processed on the edge (in the classroom), some in the cloud.
- **Alternative 3 (Local Server):** all data and processing on-premises in the campus data center.

**Criteria and weights** (source: m3-ex-decision): Cost **0.3**, Performance **0.2**, Scalability **0.2**, Security **0.15**, Maintenance & Support **0.1**, User Experience **0.05** (sum = 1.0).

**Raw scores (1–5), weights not yet applied** (source: m3-ex-decision):

| Criteria | Weight | Alt 1 (Cloud) | Alt 2 (Hybrid) | Alt 3 (Local Server) |
|---|---|---|---|---|
| Cost | 0.3 | 4 | 3 | 2 |
| Performance | 0.2 | 3 | 4 | 5 |
| Scalability | 0.2 | 5 | 4 | 2 |
| Security | 0.15 | 3 | 4 | 5 |
| Maintenance & Support | 0.1 | 4 | 3 | 2 |
| User Experience | 0.05 | 4 | 3 | 3 |
| **Total Score** | | **? (compute)** | **? (compute)** | **? (compute)** |

**Your task (last steps blanked):** multiply each score by its weight, then sum each column to get the three **Total Score** values, and state which alternative wins. The first two rows are already worked for you in the Solutions section as a model; finish the rest. Full totals are in **Solutions**.

## Advanced example — drone battery selection (independent, strategy hint only)

**Scenario.** Select a battery for a delivery drone. Candidate chemistries: **lithium polymer, lithium ion, nickel-metal hydride, nickel cadmium** (source: master-notes).

**Strategy hint (do the rest yourself):**
1. Define criteria. The notes identify **size, weight, energy capacity (→ flight time), and cost** as the most important (source: master-notes).
2. Weight them as given: **size 20%, weight 25%, energy capacity 35%, cost 20%** (source: master-notes). Confirm they sum to 100%.
3. Gather each chemistry's data for those criteria and score each on 1–10 or percentage (the biggest-capacity battery scores highest on energy capacity; smaller capacity scores less) (source: master-notes).
4. Multiply score × weight, sum per battery, and pick the highest — but the warning applies: don't just grab the biggest capacity, because size, weight, and cost also count (source: master-notes).
5. Run a sensitivity analysis: what if flight time becomes even more important (raise energy capacity to 0.45)? Re-total and see if the ranking shifts (source: master-notes).

> The source provides the criteria and weights but not numeric scores for each chemistry, so the numeric table is yours to fill from real battery data. [OUTSIDE MATERIAL]

## Real-world case study — Smart Campus deployment decision

**Situation.** A university must pick how to deploy its Smart Campus System; cost and scalability are crucial for its growth goals (source: m3-ex-decision).

**Approach.** Build a six-criterion weighted matrix (cost weighted heaviest at 0.3), score Cloud/Hybrid/Local on a 1–5 scale, apply weights, and total (source: m3-ex-decision).

**Outcome.** **Alternative 1 (Cloud)** is selected as the best choice. It performs well on cost (4) and scalability (5), the university's priorities. Alternative 3 (Local Server) has the best performance and security but loses overall because of weak cost and scalability; Alternative 2 (Hybrid) is strong in places but slightly less cost-effective than Cloud (source: m3-ex-decision).

**Lesson.** The alternative that's best at the *most heavily weighted* criteria (here, cost and scalability) wins — even when a rival dominates lower-weighted criteria (performance, security). Weighting encodes priorities into the result (source: m3-ex-decision).

## Guided walkthrough — the architecture matrix, narrated end to end

You're the engineer in the architecture example (source: m3-decision). You start by asking what matters most for this system and land on three criteria: performance, cost, scalability. Performance is the dealbreaker, so you give it 0.4; cost and scalability share the rest at 0.3 each, summing to 1.0. You list your three real options — Centralized, Microservices, Serverless — all at the same architectural detail so they're comparable. Now you score each option per criterion on 1–5 by investigating its likely behavior: Serverless rates 5 on performance, Centralized only 3; Centralized rates 5 on cost (cheap to run small), Microservices only 3; Centralized rates 2 on scalability, the other two 5. You multiply each score by its row weight — Serverless performance is 5 × 0.4 = 2.0, the single biggest cell in the table — and sum down each column: 3.3, 4.0, 4.7. Serverless's 4.7 is the highest, so you recommend it, noting that its win comes from dominating the heavily-weighted performance criterion despite Centralized being cheaper (source: m3-decision).

---

## Solutions

### Smart Campus (intermediate) — full computation

Apply each weight (source: m3-ex-decision); per-cell weighted values:

| Criteria | Weight | Alt 1 (Cloud) | Alt 2 (Hybrid) | Alt 3 (Local) |
|---|---|---|---|---|
| Cost | 0.3 | 4 → 1.2 | 3 → 0.9 | 2 → 0.6 |
| Performance | 0.2 | 3 → 0.6 | 4 → 0.8 | 5 → 1.0 |
| Scalability | 0.2 | 5 → 1.0 | 4 → 0.8 | 2 → 0.4 |
| Security | 0.15 | 3 → 0.45 | 4 → 0.6 | 5 → 0.75 |
| Maintenance & Support | 0.1 | 4 → 0.4 | 3 → 0.3 | 2 → 0.2 |
| User Experience | 0.05 | 4 → 0.2 | 3 → 0.15 | 3 → 0.15 |
| **Total Score** | | **3.95** | **3.65** | **3.15** |

**Winner: Alternative 1 (Cloud), total 3.95** — strong on the heavily-weighted cost (4) and scalability (5), which are the university's priorities. Local Server leads on performance and security but its weak cost/scalability sink it; Hybrid is solid but slightly less cost-effective than Cloud (source: m3-ex-decision).

> Arithmetic sanity-check: summing the per-cell weighted values above gives Cloud 3.85, Hybrid 3.55, Local 3.10. The source states the totals as **3.95 / 3.65 / 3.15** (source: m3-ex-decision); these differ from the cell-by-cell sum by ~0.05–0.10, an inconsistency in the source's own figures. The **ranking is unaffected** — Cloud wins either way — so use 3.95/3.65/3.15 as the course's stated answer, and treat the exact decimals as approximate. The reliable takeaway is the order and the reason Cloud wins. [OUTSIDE MATERIAL]
