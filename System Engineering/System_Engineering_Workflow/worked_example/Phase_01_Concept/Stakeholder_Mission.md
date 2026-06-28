# EVCN — Stakeholder Map & Mission

## Mission

> Make public EV charging as predictable, fast, and trustworthy as filling a gas tank — accessible to any standards-compliant EV, billable across networks, and graceful under grid stress.

## Stakeholders

| Stakeholder | Role | Primary Concerns | Influence | Interest |
|---|---|---|---|---|
| **EV Driver** | End user; authenticates, charges, pays. | Speed, reliability, transparent pricing, app UX, range anxiety. | Medium | High |
| **Site Host** | Property owner (mall, hotel, fleet depot) where chargers are installed. | Uptime, foot-traffic value, revenue share, vandalism, no-fault liability. | High | High |
| **Charge Point Operator (CPO)** | Operates the network; the primary "owner" of EVCN. | Margin, asset utilization, OPEX, fleet visibility. | High | High |
| **Mobility Service Provider (MSP)** | Sells charging to drivers via roaming (OCPI). | Roaming pricing, uptime SLAs, settlement. | Medium | Medium |
| **Utility / Grid Operator** | Provides electricity; may signal demand-response. | Peak load, power quality, demand response participation. | High | Medium |
| **Maintenance Technician** | Field service. | Diagnostics access, safe lockout/tagout, firmware OTA. | Low | High |
| **Regulators** | UL, FCC, CE, PCI Council, FTC, state energy boards. | Safety (UL 2594), EMC, payment compliance, accessibility (ADA). | High | Low |
| **Payment Processor / Bank** | Card processing partner. | PCI-DSS scope, chargeback risk, settlement timing. | Medium | Medium |
| **Roaming Partner Networks** | Other CPO networks via OCPI. | Standards compliance, settlement transparency. | Medium | Medium |
| **Security & Privacy Office** | Internal compliance. | GDPR/CCPA, IAM, threat surface. | Medium | High |

## Stakeholder Influence/Interest Matrix

```
            High Interest
                |
   Site Host    |   Driver
   CPO          |   Maintenance Tech
   Sec/Privacy  |
----------------+----------------
   Regulators   |   MSP
   Utility      |   Roaming Partners
                |   Payment Processor
                |
            Low Interest
   High Influence ←————→ Low Influence
```

## Key Use Cases (per stakeholder)

| Stakeholder | Top Use Case | Success Measure |
|---|---|---|
| Driver | "Find, plug in, charge, drive away" | < 30 s from arrival to charging start |
| Site Host | "See revenue and uptime" | Monthly statement + dashboard |
| CPO | "Maximize utilization, minimize downtime" | > 95% station availability |
| Utility | "Throttle a region during peak" | Network-wide load curtailment within 60 s |
| Technician | "Diagnose remotely, fix on first visit" | > 80% first-time-fix rate |
| Regulator | "Audit any charging session" | Tamper-evident log retention 7 years |

## Lifecycle Stage Map

| Lifecycle Stage | Activity | Lead Stakeholder |
|---|---|---|
| Concept | Market sizing, site survey, regulatory landscape | CPO + Site Host |
| Development | Hardware/firmware/cloud build | CPO engineering + vendors |
| Production | Manufacturing, factory acceptance | CPO + EMS partner |
| Operations | Daily charging, billing, monitoring | CPO + Driver + Site Host |
| Maintenance | Firmware OTA, repairs, replacements | Technician + CPO |
| Disposal | Decommission station, recycle Li-ion buffer batteries (if any), data wipe | CPO + e-waste vendor |

## Selected Lifecycle Model — Hybrid V-Model + Agile

- **V-Model** governs safety-critical power & charge-control firmware (UL 2594, IEC 61851, ISO 15118) — every design level has a corresponding test on the right side of the V.
- **Agile (2-week sprints)** governs cloud backend, mobile app, web portal, and operator dashboard — fast iteration on user-visible features.
- The two tracks integrate at well-defined seams (OCPP 2.0.1, REST APIs) covered by ICDs in `Phase_04_Architecture/ICD.md`.
