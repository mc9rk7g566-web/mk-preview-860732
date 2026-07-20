# Design Map — babi.sh (The Babish Culinary Universe)

> Geanalyseerd 12-07-2026 over 3 pagina's: `/`, `/recipes`, `/recipes/10-levels-of-cheesesteak`.
> **Herbekeken 20-07-2026 (taste-skill):** de homepage is nu nóg minimaler = **alleen een
> schermvullende hero-foto + één reuze-titel (futura-pt 100.8px/800 UPPERCASE, wit) + één
> "JOIN"-pill + mini-nav + zwarte footer met social-icons.** Verder bijna GEEN tekst.
> Kernles voor Maarten: **weinig tekst, één grote titel, één duidelijke actie per sectie,
> foto's dragen alles.** Toegepast 20-07: values-tekstblok van de home verwijderd, hero + about
> ingekort, alle secties foto-geleid.
> Referentie voor het Maarten Kievit-concept. Structuur overnemen, look restylen naar
> bordeaux/beige dark — nooit 1-op-1 kopiëren.

## Spacing Scale
- Basis: margins/paddings gereset naar 0 — alle ruimte via `gap`
- Grid-gaps: 24px (recepten-bibliotheek, 4 kolommen), 40px (feature-grid, 2 kolommen)
- Sectieruimte: ~120-160px, gemaakt met achtergrondband-wissels in plaats van dividers

## Font Hierarchy
- Hero h1: 100.8px / 800 / futura-pt / uppercase / lh 1.2
- Sectie h2: 60.48px / 800 / futura-pt
- Feature-kaartlabel: ~28px / 800
- Body: 22px / 800 (bold is de default)
- Recept-kaarttitel: ~16px / 800 / uppercase
- Meta: 13px / ~400 / #9D9D9D

## Color Palette
- `#FFFFFF` body-achtergrond · `#F5F5F5` sectieband + serie-kaarten · `#F1F1F1` zoekbalk
- `#000000` footer, pills, actieve nav · `#9D9D9D` meta · `#525252` secundair
- `rgba(255,255,255,0.333)` + backdrop-blur — frosted pills op foto's
- Accent: **geen** — fotografie is het kleursysteem

## Image Ratios
- Hero 1.50:1 full-bleed (aparte mobiele crop 0.77:1) · carousel 1.60-2.17:1 · feature 1.50-1.78:1 · thumbnail ~1.55:1

## Component Tokens
- Radius: 10000px pills · 60px feature-kaarten · 40px modal · 8px thumbnails · 6px icoontjes
- Schaduwen: geen (0 op 3 pagina's)
- Grid: 4×277px+24px (bibliotheek) / 2×556px+40px (features), content ~1180px, hero/footer full-bleed
- Motion: hover 0.15-0.3s, carousel `transform 0.7s ease-in-out`; geen focus-visible, geen reduced-motion (gaten)

## Paginastructuur (voor het concept)
- **Home**: dark hero (viewport-hoog, full-bleed foto, gecentreerde uppercase h1, frosted pill-CTA) → lichte band met h2 → featured-carousel (60px radius kaarten, VIEW RECIPE-pill) → "More" 2×2 grid → zwarte footer met social-pills
- **Bibliotheek**: zoekbalk in header + tabs (All/Popular/Likes) + 3 serie-kaarten + 4-koloms grid (still + uppercase titel + meta)
- **Detail**: titel + "cook: X"-meta → full-width video → 2 kolommen (tools/ingrediënten links, bereiding rechts) → RELATED-carousel
- **Monetisatie**: recepten achter $10/jaar-gate — Maarten doet het omgekeerde (gratis recepten, funnel naar WhatsApp)

---

# Taste DNA

### De merkstem is een lettergewicht
- **Trigger**: Merk-herkenning nodig op elke pagina, kaart en knop zonder logo-herhaling
- **Decision**: Eén geometrische familie (futura-pt) op weight 800 voor álle rollen — over een display/body-paar met meerdere gewichten
- **Reason**: Een YouTube-publiek herkent de maker aan zijn stem; één zware letter maakt elke regel "hem", en de site heeft nauwelijks lange teksten dus de nuance-prijs is laag
- **Evidence**: h1 100.8px/800, body 22px/800, nav 800; kleinste groottesprong 1.23× — schaal doet het hiërarchie-werk

### De UI mag geen kleur hebben
- **Trigger**: Chrome vormgeven op een site vol foodfotografie
- **Decision**: Strikt monochroom (#000/#fff + vier pure grijzen, accentkleur: geen) — over een merk-accentkleur op knoppen en links
- **Reason**: Eten verkoopt via verzadiging; kleurloze chrome garandeert dat het felste element op het scherm altijd het gerecht is
- **Evidence**: accentCandidates = alleen zwart; #9D9D9D/#F5F5F5 exact neutraal; 10 foto's van 277-1440px vullen elk kaartoppervlak

### Diepte lenen in plaats van tekenen *(restraint)*
- **Trigger**: Knoppen en kaarten scheiden van foto's — waar box-shadows en borders de standaard zijn
- **Decision**: Nul schaduwen; achtergrondband-wissels (#fff→#f5f5f5→#000) en frosted-glass pills (rgba(255,255,255,0.333)+blur) — over Material-achtige elevation
- **Reason**: Een schaduw beweert dat de UI boven de content zweeft; frosted glass zegt het omgekeerde — de content is het object, de UI slechts een waas erover
- **Evidence**: `shadows: []` over 3 pagina's; frosted pills op hero + recept-kaarten; sectie-overgangen zonder één divider

### Elke kaart pocht zijn eigen publiek
- **Trigger**: Meta-regel kiezen voor recept-kaarten (gangbaar: kooktijd, moeilijkheid, sterren)
- **Decision**: YouTube-statistieken ("875k views • Apr 30") als vaste derde regel op élke kaart — over culinaire metadata (die pas op de detailpagina komt)
- **Reason**: Wie van YouTube komt beslist op sociale bewijskracht sneller dan op bereidingstijd; de bibliotheek verkoopt zichzelf bij elke scroll
- **Evidence**: meta 13px #9D9D9D op 20+ kaarten zonder variatie; detailpagina toont wél "cook: 1 h 30 min"

---

# Vertaling naar Maarten (bordeaux/beige, écht donker)

Wat we **overnemen**: één-lettergewicht-merkstem (maar dan een eigen font, geen futura-pt) ·
fotografie/video als enige kleurbron náást het merkpalet · frosted-glass pills · vorm=affordance
(pill=knop) · kaart-anatomie still+titel+meta · sectiebanden i.p.v. dividers · zoek-first bibliotheek.

Wat we **anders/beter** doen:
1. **Écht donker**: babi.sh is wit met een donkere hero; Maarten wordt volledig donker
   (warm-donker à la Ikoyi, niet puur zwart) met beige tekst en bordeaux als enige accent.
2. **Bordeaux spaarzaam**: zoals Babish' "geen kleur"-regel, maar dan: bordeaux alléén op
   het primaire CTA-niveau (WhatsApp/pills) — nooit op grote vlakken tegelijk met foodfoto's.
3. **Motion-polish**: babi.sh heeft nul scroll-craft; wij voegen rustige reveals + page-feel toe
   (GSAP, met prefers-reduced-motion-vangnet) — dat is het award-gat.
4. **Toegankelijkheid**: focus-visible + echte `<a>`-links op kaarten (ook SEO).
5. **Funnel omgekeerd**: geen paywall — recepten gratis, vaste "proef mee"-CTA naar de
   WhatsApp-community waar de wijnverkoop gebeurt.
6. **Shop-klaar**: nav krijgt een (uitgeschakelde/teaser) Shop-positie zodat kookboek er later
   in dagen bij kan.
