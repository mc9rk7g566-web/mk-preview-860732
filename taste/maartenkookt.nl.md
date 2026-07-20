# Taste — maartenkookt.nl

> Captured 2026-07-20 from the live homepage (DOM + tokens). Screenshot capture hit the wrong browser tab, so the visual read leans on the DOM data plus the known brand assets (logo, design.md); the numbers below are measured.

## Design Map

**Color** — every value is red-shifted; there is no pure black and no pure white.
| Role | Hex |
|---|---|
| Canvas | `#170A0C` (bordeaux-black) |
| Surface 1 / 2 | `#1F0E11` / `#2A1317` |
| Text primary / secondary / tertiary | `#F4EDE4` / `#E5D9C6` / `#CDB998` |
| Accent | `#7B0D1E` (bright `#B31B2B`) |

**Type** — Lilita One (single 400 weight, UPPERCASE) carries every heading, the logo and card titles; hierarchy is size-driven (h1 136px / 1.02). Montserrat 500 for body, Montserrat 600 tan for labels.

**Icons** — one line system: Phosphor, regular weight, single stroke. Brandmark is the MK monogram inside a filled bordeaux disc. No emoji.

**Shape** — interactive = 999px pill; cards = 24px; hairline detail = 2px. No meaningful shadow; depth comes from color-band changes and frosted glass over photos.

**Motion** — `prefers-reduced-motion` guard present; easing `cubic-bezier(0.16,1,0.3,1)`, durations 0.18–0.45s.

## Taste DNA

**1. Bordeaux-black, not black.**
Trigger: the ground has to flatter dark food photography. Decision: canvas is `#170A0C`, and every surface is red-shifted. Reason: pure black reads cold and flattens warm food; a red-shifted near-black holds a wine-cellar warmth and keeps the plated food the brightest thing on screen. Evidence: `pageBackground rgb(23,10,12)`, surfaces `rgb(31,14,17)` / `rgb(42,19,23)`.

**2. One heavy face does all the shouting.**
Trigger: personality without hurting readability. Decision: Lilita One (one weight, uppercase) for every heading, the logo and card titles; Montserrat only for body and labels. Reason: hierarchy from size not weight keeps headings characterful and body legible, and two families hold the voice together. Evidence: h1 136px Lilita One vs body 11.5px Montserrat 500; three families total.

**3. The accent is rationed. (Restraint)**
Trigger: deciding where saturation is allowed. Decision: `#7B0D1E` marks status and one emphasis per view, never body text, never a large block beside food. Reason: holding the red back reads as expensive, and the food supplies the real color — red everywhere would fight the plate. Evidence: text colors are cream/tan; `#7B0D1E` shows up only on buttons and active surfaces.

**4. Icons are one line grammar, never emoji.**
Trigger: dozens of small marks are needed across the site. Decision: all icons come from a single line system (Phosphor, one weight); the brandmark is MK in a filled bordeaux disc. Reason: one grammar keeps many small marks reading as one family and matches the confident weight of Lilita One — mixed illustration styles or emoji would fracture the tone. Evidence: Phosphor icon font loaded on the page; `mk-icoon-bordeaux.svg` is a filled disc; design.md: "Iconen: Phosphor regular. Nooit emoji."

---

### Consequence for the story-highlight icons
The set must read as **one line system at a single stroke weight** (Phosphor-grade), cream on a bordeaux disc — not six separately-drawn solid blobs. The stroke is tuned bold enough to sit next to Lilita One and the MK monogram. This is the reason the earlier AI-filled icons felt off-brand: they broke principle 4.
