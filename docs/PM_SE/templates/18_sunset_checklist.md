# Sunset Checklist — <Product Name>

> **Phase 6 · feeds G6 Clean Exit · an afternoon.** The anti-pattern this file prevents: the zombie product — bills still charging, user data on a Pi sold on eBay, learnings lost. Execute **top to bottom, in order**: every step is reversible until the flagged POINT OF NO RETURN. Killing a product deliberately is a win — do it cleanly. Delete sections that don't apply.

| Sunset date | Trigger (why now) | Owner |
|---|---|---|
| | <sunset condition from `13_ops_review.md` / dependency EOL / better bet> | |

## The teardown (ordered — do not skip ahead)

- [ ] 1. Decide end-state: **kill / replace / mothball / hand over**. If replace → migrate data & users FIRST; don't tear down until the successor is live.
- [ ] 2. Announce to users: sunset date, what stops working, data-export instructions + deadline.
- [ ] 3. Go read-only / stop new signups (still reversible).
- [ ] 4. Archive anything legally or contractually retained (tax, invoices, health data) **BEFORE any wipe**.
- [ ] 5. Export deadline passes → **POINT OF NO RETURN** — acknowledged on <date>. Everything below is irreversible.
- [ ] 6. Delete cloud data **AND backups/snapshots** (backups, caches, logs — the classic misses).
- [ ] 7. Revoke API keys, OAuth apps, webhooks, TLS certs.
- [ ] 8. **[AI]** Revoke model-provider keys; delete stored prompts/logs containing user data; close the vendor data-retention loop — confirm the retention window has purged your data (*verify current* terms).
- [ ] 9. Cancel subscriptions **LAST** — never cut a service the teardown still needs.
- [ ] 10. Release or park the domain.
- [ ] 11. **[HW]** Destroy the disk-encryption key or physically wipe/destroy SD/SSD before selling or binning — **a format is not a wipe**; a data-bearing device leaving your custody is an attack surface.
- [ ] 12. **[HW]** E-waste to a proper recycler; harvest reusable parts first; batteries never in the bin.
- [ ] 13. Tag the final release; archive (**don't delete**) the repo with an ARCHIVED note in the README.
- [ ] 14. Write the 10-line post-mortem — what worked, what failed, what the next product inherits — routed to the next product's Phase 1 / G1.
- [ ] 15. Billing sweep: every dashboard shows **zero charges next month**.

## 10-line post-mortem (the one output that flows forward)

- **Worked:** <…>
- **Failed:** <…>
- **The next product inherits:** <assumption to test, asset to reuse, mistake to not repeat>

## Verdict — G6 Clean Exit

**Complete / Blocked** — logged in the tracker with date.

- **Complete** — every line above is ✓ or a conscious `tailored out: <reason>`.
- **Blocked** — stuck at line <n>: <what's owed, by whom, by when>.
