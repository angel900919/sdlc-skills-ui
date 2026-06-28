---
Document: Research Insights — Cadence
Document ID: INS-cadence-v1.0
Status: Approved (G2-approved 2026-02-26)
Owner: Product Manager (the trio)
Updated: 2026-02-26
---

# Research Insights — Cadence

<!-- Owning skill: pm-phase-03-discovery. The evidence base for the G2 Problem Validated gate. -->

## 1. Discovery question & outcome
- **Outcome served:** `OBJ-01` / `KR-01` (make async standups the default for distributed teams).
- **Discovery question:** How do distributed software teams stay aligned daily today, and where does the live standup actually hurt them?
- **Decision it changes:** whether to commit OPP-01 (async standup) as the lead bet at G3, or pivot to a different problem (notes-search, status roll-up).

## 2. Method & cadence
- **Methods:** semi-structured interviews (Switch/forces lens) + analysis of how teams improvise standups in Slack.
- **Conversations this cycle:** 14 (12 distributed teams across 3+ timezones; ≥5 needed for G2).
- **Recruiting channel:** founder network + 2 PLG waitlist cohorts; screened for "team spans ≥3 timezones."
- **Segment:** eng/product team leads (champion), ICs (users), 3 VP/budget-holders.

## 3. Insights (`INS-*`)
| Insight | Finding (customer's words) | Evidence (snapshot ref) | Segment | Frequency | Traces to | Candidate `OPP` |
|---|---|---|---|---|---|---|
| INS-01 | "Our 9am standup is 11pm for our Manila engineer — someone always loses." | Snapshot P3 §5 | Lead | 11 of 14 | OBJ-01/KR-01 | OPP-01 |
| INS-02 | "I scroll Slack for 20 minutes trying to remember what we decided last week." | Snapshot P7 §5 | Lead+IC | 10 of 14 | OBJ-01/KR-01 | OPP-02 |
| INS-03 | "I spend half an hour every morning chasing updates so I can report up." | Snapshot P2 §5 | Lead | 9 of 14 | OBJ-01 | OPP-03 |
| INS-04 | "Standup at 10 kills my whole morning — I can't get into flow before it." | Snapshot P5 §5 | IC | 12 of 14 | OBJ-01/KR-01 | OPP-04 → OPP-01 |
| INS-05 | "A blocker we'd have caught Monday sat until Thursday's live sync." | Snapshot P9 §5 | Lead+IC | 8 of 14 | OBJ-01 | OPP-01 |
| INS-06 | "We already do async standups in a Slack thread — but it's chaos, no one knows who's missing or what got decided." | Snapshot P6 §5 | Lead+IC | 9 of 14 | OBJ-01 | OPP-01 (workaround) |

## 4. Disconfirming evidence
- **What would falsify our conclusion:** that teams *value* the live standup as social glue and would refuse to drop it (so async wouldn't replace it — only add).
- **What we found:** 3 of 14 explicitly valued the live sync for team bonding; 2 said they'd keep a *weekly* live sync but drop the *daily* one. → async should **replace the daily** standup, not all sync. This sharpens ASM-01 and RSK-01: measure meeting-reduction, not just adoption.
- **Conclusions resting on <5 conversations or one loud voice:** INS-05 (8 of 14) is moderate; flagged for confirmation post-launch via blocker-latency metric.

## 5. Interview snapshots — one per session

### Snapshot — P3 (Lead, 8-person eng team, 4 timezones) · 2026-02-10
- **Who:** Eng team lead (champion segment) — anonymised.
- **Situation:** running a 9am-London daily standup; their Manila IC joins at 11pm or skips.
- **Job:** keep the whole team aligned daily without making anyone work off-hours.
- **Struggle:** every timezone choice punishes someone; attendance is partial so the standup isn't even reliable.
- **Workaround:** lead DMs the absent members afterward and retypes the summary.
- **Key quotes:** "Our 9am standup is 11pm for our Manila engineer." · "I'm basically running standup twice."
- **Insights extracted:** INS-01, INS-03.

### Snapshot — P6 (IC + Lead, product team, 3 timezones) · 2026-02-14
- **Who:** Senior IC who also runs the team's improvised process.
- **Situation:** team posts updates in a `#standup` Slack thread on the honor system.
- **Job:** share progress and surface blockers without a meeting.
- **Struggle:** no structure, no completion signal, un-searchable a week later.
- **Workaround:** the Slack thread itself ("it's chaos").
- **Key quotes:** "We already do async standups in a Slack thread — but it's chaos." · "No one knows who's missing or what got decided."
- **Insights extracted:** INS-02, INS-06.

### Snapshot — P5 (IC engineer, 3 timezones) · 2026-02-12
- **Who:** Backend IC (user segment).
- **Situation:** mid-morning live standup interrupts deep work.
- **Job:** protect maker focus time while still being a good teammate.
- **Struggle:** context-switch cost; the meeting itself adds little for him.
- **Workaround:** schedules "do not disturb" and skips when he can.
- **Key quotes:** "Standup at 10 kills my whole morning." 
- **Insights extracted:** INS-04, INS-05.

## 6. Candidate opportunities seeded (`OPP-*` → P04)
| Candidate opportunity | Need / pain / desire (not a solution) | Backed by | Frequency / severity |
|---|---|---|---|
| OPP-01 | "Stay aligned daily across timezones without forcing anyone off-hours or into a meeting" | INS-01, INS-04, INS-05, INS-06 | 12 of 14 · high |
| OPP-02 | "Find what we discussed/decided last week without re-asking the team" | INS-02 | 10 of 14 · high |
| OPP-03 | "Stop manually compiling team status to report upward" | INS-03 | 9 of 14 · medium |
| OPP-04 | "Get my focus/maker time back from the daily live meeting" | INS-04 | 12 of 14 · high (overlaps OPP-01) |

## 7. Open questions / TODO
- TODO: quantify *meeting-reduction* — do teams actually drop the daily live sync? — owner PM, measure post-launch (RSK-01).
- TODO: confirm INS-05 (late blockers) with a blocker-latency metric once instrumented — owner PM, 2026-07.

---
**Status note:** Approved (G2-approved 2026-02-26); thereafter `Living` under continuous discovery.
*Produced by* the **pm-phase-03-discovery** skill. Candidate `OPP-*` feed **pm-phase-04-opportunity** (OST, sizing, G3).
