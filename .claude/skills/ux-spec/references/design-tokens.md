# Design-token vocabulary + interview defaults

Tokens are **role names a downstream agent can reference**, not pixel-perfect values. The
whole point: when `/design` or the build loop styles a button, it says `primary-action`, not
a hex code it invented. Record exact values ONLY when the user actually has them (a brand
guide, an existing stylesheet, a Figma export) — otherwise the name is the contract and the
value is a build-time choice within it.

## Color roles (the minimum set — prototype stops here)

| role | covers | interview question (plain English) |
| :-- | :-- | :-- |
| `surface` | page + card backgrounds | "Light app or dark app — or follow the device?" |
| `surface-raised` | modals, menus, raised cards | (derive; don't ask) |
| `text` / `text-muted` | primary + secondary text | (derive) |
| `primary-action` | the main button / link color | "Is there a brand color things should match? If not I'll pick one and mark it tentative." |
| `secondary-action` | secondary buttons, links | (derive) |
| `danger` | destructive actions, errors | (derive — red family unless told otherwise) |
| `success` / `warning` | confirmations, cautions | (derive) |
| `border` | dividers, input outlines | (derive) |

Record user-supplied values inline: `primary-action: #1A56DB (from brand guide)`. Derived
picks get `(tentative)`.

## Type scale (mvp+) — names only

| name | used for |
| :-- | :-- |
| `display` | the one big number / hero line (omit if none) |
| `heading` | screen + section titles |
| `body` | default text |
| `caption` | metadata, helper text, table headers |

One question: *"Any font you're attached to? Otherwise the system font — fastest and always
looks native."* Sizes/weights only if the user supplies them.

## Spacing scale (mvp+) — names only

`xs · sm · md · lg · xl` — a relative ladder. The convention to record is the **usage rule**,
not the pixel values, e.g.:

- `sm` between related elements (label ↔ field)
- `md` between groups (form sections, cards)
- `lg` around screen edges / between major regions

Plus, if relevant: `radius` (sharp | rounded | pill — one word) and `shadow` (flat | subtle |
pronounced).

## Interview defaults (when the user says "I don't know")

Offer 2–3 simple options, pick a sensible default, mark it tentative:

- **Colors**: neutral light surface, one blue `primary-action`, standard red/green/amber
  semantic roles. *(tentative)*
- **Type**: system font, 4-step scale. *(tentative)*
- **Spacing**: 5-step ladder, `rounded` radius, `subtle` shadow. *(tentative)*

Tentative tokens follow the anchor convention: a `(tentative)` note on the line + a Notes
entry — confirm before production.

## What does NOT go in the token section

- CSS variables, Tailwind config, theme files — that mapping is `/design` / the build.
- Component-library names (MUI, shadcn) — the library pick is governed by `/design` against
  `anchor.approved_dependencies`; tokens must survive any library.
- Pixel values the user never gave you — never invent precision.
