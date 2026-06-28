# Change Management & Continuous Validation — Examples

## Simple example (fully worked): impact analysis of a checkout UI redesign

**Change request:** redesign the checkout screen by moving the payment-method selector above the order summary and adding visual icons for each option, for a payment application (source: m4-change).

Apply the 5 impact-analysis steps, one reason per step:

1. **Identify change scope.** The change traces to **three front-end components**: the *CheckoutPage*, the *PaymentOptions widget*, and *responsive layout styles*. *Reason:* you must know exactly what code is touched before estimating anything (source: m4-change).
2. **Assess risks and dependencies.** Dependencies were flagged on the **icon-library version** and the **localization pipeline** (so new labels render correctly in all languages). Risk assessment highlighted potential **regression in the order-total calculation display** and **accessibility compliance**. *Reason:* surfacing dependencies and risks early prevents downstream breakage (source: m4-change).
3. **Estimate cost and schedule impact.** The UI/UX lead estimated **~16 hours** of design and implementation work, plus **~8 hours** for cross-browser and mobile-responsiveness testing. *Reason:* the board needs the time/budget cost to decide (source: m4-change).
4. **Evaluate compliance and safety risks.** Because accessibility was at risk, **additional aXe audits** and **user-acceptance testing with keyboard navigation** were needed. *Reason:* a cosmetic change can still break accessibility compliance (source: m4-change).
5. **Review stakeholder input.** Findings were collated for review before approval. *Reason:* engineers, users, and managers must weigh in before go/no-go (source: m4-change).

**Deliverable:** all findings were documented in an **Impact Analysis Report** — outlining code-change scope, schedule impact, key test requirements, and mitigation steps (e.g., **feature-flag rollout**) — before submitting for **CCB approval** (source: m4-change).

**Why this is the model:** the report converts a vague "redesign the checkout" into scoped components, a 16h+8h estimate, named dependencies, named risks, and a mitigation, so the CCB can decide on evidence (source: m4-change).

## Intermediate example (completion problem): the "Submit Payment" button move

**Change request:** move the **"Submit Payment"** button from the bottom to the top of the payment page to improve usability (source: m4-ex-impact).

Steps 1–2 are partly done for you; complete the blanks (solutions at the bottom).

**Step 1 — areas impacted** (some given):

| Affected area | Why it might be impacted |
| :-- | :-- |
| UI Layout and Flow | The visual structure and user flow will change |
| Frontend Code | Layout code must be modified to reposition the button |
| Accessibility Features | Screen readers and keyboard navigation may be disrupted |
| Automated UI Tests | Test scripts may reference button location and fail |
| **______ (blank 1)** | Screenshots and descriptions need to reflect new placement |
| **______ (blank 2)** | Placement change could affect click-behavior data |

**Step 2 — identify at least 3 risks** (one given, supply two more):

- Accidental Submissions — users might confirm payment before reviewing full information.
- **______ (blank 3)**
- **______ (blank 4)**

*(Solutions at bottom — from m4-ex-impact.)*

## Advanced example (mostly blanked): finish the "Submit Payment" analysis and decide

Using only the strategy hint, finish steps 3–4 and the decision for the "Submit Payment" button move (source: m4-ex-impact). *Hint:* list items to update (test cases, design docs, user guides, training), recommend validation steps, then answer **should the change be done?** with reasoning.

- **Items to update:** ______
- **Validation steps:** ______
- **Decision (should it be done?) + reasoning:** ______

*(Solution at bottom — from m4-ex-impact.)*

## Real-world case study: the payment-app checkout redesign (named system)

- **Situation:** a product owner requests a checkout-screen redesign for a payment application — move the payment-method selector above the order summary and add option icons (source: m4-change).
- **Approach:** trace the change to three front-end components (CheckoutPage, PaymentOptions widget, responsive layout styles); estimate 16h implementation + 8h cross-browser/mobile testing; flag icon-library and localization dependencies; assess order-total-display regression and accessibility risks; add aXe audits and keyboard-navigation UAT (source: m4-change).
- **Outcome:** an Impact Analysis Report with scope, schedule, test requirements, and mitigation (feature-flag rollout), submitted for CCB approval (source: m4-change).
- **Lesson:** even a "cosmetic" UI change has measurable cost, real dependencies, and compliance risk — impact analysis turns it into evidence a board can approve responsibly (source: m4-change). (The source also points to a WhatsApp large-scale change-management case in the lesson video, not detailed in text — source: m4-changemgmt.)

## Guided walkthrough: one change request through all 6 phases

Trace a single CR — "swap a car-engine component to overcome supply issues" — through the change control process (source: m4-change):

1. **Change Request Submission.** A stakeholder submits a CR with details of the component swap.
2. **Initial Review.** The team checks feasibility superficially: is this possible at all — yes or no?
3. **Impact Analysis.** Engineers assess impact on cost, schedule, and technical feasibility (the 5 steps).
4. **Approval Process.** The **CCB** reviews the impact analysis and makes the final go/no-go decision.
5. **Implementation & Testing.** If approved, the change is integrated and tested.
6. **Documentation & Communication.** All documentation is updated and stakeholders are notified — the whole flow tracked in configuration-management software, e.g. IBM DOORS for compliance (source: m4-change).

---

## Solutions

**Intermediate (button move, steps 1–2) — from m4-ex-impact:**

- Blank 1 (area) = **User Documentation** ("screenshots and descriptions need to reflect new button placement").
- Blank 2 (area) = **Analytics/Tracking** ("placement change could affect click-behavior data").
- Blank 3 (risk) = **Visual Clutter** — button might feel out of place or confuse user expectations.
- Blank 4 (risk) = **Break in Test Automation** — existing UI tests may fail due to changes in element positioning.

**Advanced (button move, steps 3–4 + decision) — from m4-ex-impact:**

- **Items to update:** Test Cases (button-location references and validation checks); Design Documentation (mockups and layout-flow diagrams); User Manuals / Help Docs (replace screenshots and steps describing the old layout); Training Material (reflect the UI change in onboarding/internal training).
- **Validation steps:** Regression Testing (ensure no existing functionality breaks); Usability Testing (assess how users interact with the new position); Cross-Browser/Responsive Testing (works across screen sizes and browsers); Accessibility Testing (assistive-tech support remains intact).
- **Decision: *Yes, but with caution and proper planning.*** Reasons to proceed: improved usability if UX research supports it; no architectural/backend changes (isolated to the frontend/UI layer); risks are mitigable with proper regression, accessibility, and usability testing; limited system-wide impact (no change to business logic, security, or payment workflows). Conditions to proceed: update all automated tests before deploying; conduct usability testing with real users/personas; include accessibility verification (keyboard navigation, screen-reader compatibility); communicate the change to support, documentation, and training teams. When to delay/reconsider: if analytics show users are already successful with the current flow; if close to a critical release window; if the change is based on assumption rather than user data. The deciding principle: it's not just whether the change is "safe," but whether the value outweighs the effort and risk (source: m4-ex-impact).
