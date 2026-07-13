# design.md — Maarten kookt (bouwkompas)

> Geef dit bestand mee in elke bouw-prompt: "gebruik mijn design.md".
> Volledige uitleg + logo-regels: `merkgids.html` / `merkgids.pdf` in deze map.

## Palet
| Rol | Hex |
|---|---|
| Canvas (achtergrond) | `#170A0C` (bordeaux-zwart, nooit puur zwart) |
| Surface 1 (sectiebanden) | `#1F0E11` |
| Surface 2 (kaarten, inputs) | `#2A1317` |
| Tekst primair | `#F4EDE4` (crème, nooit puur wit) |
| Tekst secundair | `#E5D9C6` |
| Tekst tertiair / meta / labels | `#CDB998` (tan) |
| Randen | `rgba(244,237,228,0.14)` |
| ACCENT | `#B31B2B` (knoppen/actief) · `#7B0D1E` (banden, wijnmoment) |
| Licht kleurblok | `#F4EDE4` met bordeaux-tekst — max één per pagina |

> Eén accent, spaarzaam gebruikt. Het accent markeert status, succes en één nadruk — nooit
> bodytekst, nooit overal. Terughoudendheid leest als duur. Bordeaux nooit als groot vlak
> naast foodfotografie: het eten is de kleurbron.

## Typografie (laad-bron: Google Fonts)
- **Display:** Lilita One, altijd uppercase — koppen, kaarttitels, logo. Eén gewicht; hiërarchie via grootte (hero clamp 3.4–8.5rem · sectie 1.9–3.4rem · kaart 1.15rem).
- **Body/UI:** Montserrat 400/500/600 — body 1rem/1.75, lead 500, nav-links 600 lowercase.
- **Label:** Montserrat 600, 0.8125rem, letterspacing 0.02–0.42em, kleur tan. Sublabels in het streepjes-lockup (— ZO —), max één per scherm.

## Componenten
- **Interactief = pill** (radius 999px). Kaarten/media = 24px. Inputs = pill. Geen andere radii.
- **Geen box-shadows.** Diepte via kleurband-wissels en frosted glass (`rgba(23,10,12,0.42)` + blur 18px + rand `rgba(244,237,228,0.24)`) op foto's.
- **Receptkaart:** still (4:3, 24px radius) + Lilita-titel + meta "25 min · Vis" (max één middenpunt per regel).
- **Iconen:** Phosphor regular. Nooit emoji.
- **Grain:** vaste laag, ±5% opacity, pointer-events none.

## Sfeer & motion
- GSAP: hero-regels uit maskers (power4.out), reveals fade-up bij scroll (once), trage hero-parallax. Altijd `prefers-reduced-motion`-vangnet. Beweging ondersteunt, schreeuwt niet.
- Fotografie: donker, warm strijklicht, gerecht dichtbij, wijn in het verhaal. Nooit witte achtergronden of AI-eten.

## Stem
- **Principes:** kort, direct, warm; vakmanschap in gewone woorden; altijd het waarom erbij ("droog vel wordt krokant vel").
- **Signature:** "Proef mee" (WhatsApp-CTA, overal hetzelfde label) · "De groepsapp hoort het eerst." · streepjes-lockup voor sublabels.
- **USE:** proef mee, eerlijk product, rechtstreeks uit de keuken, de fles die erbij hoort.
- **AVOID:** superlatieven, resultaatbeloftes, verzonnen cijfers/views, sterrenkeuken-jargon, uitroeptekens stapelen, "100%/gegarandeerd/viraal", em-dashes in lopende tekst.

> In elke bouw-prompt zeg je: "gebruik mijn design.md".
