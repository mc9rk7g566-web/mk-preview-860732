# Shopify-koppeling — kookboek verkopen vanaf deze site

> De site blijft custom (design blijft van ons), maar zodra je drie waarden invult in
> `js/shopify-config.js` verschijnt er een echte koopknop op `shop.html`. Afrekenen gebeurt
> op de beveiligde Shopify-checkout (iDEAL/kaart), en **de hele backend is dan automatisch
> Shopify**: bestellingen, betalingen, orderbevestigings-mails, voorraad, verzending, btw
> en rapportages zitten in je Shopify-admin. Wij hoeven géén eigen backend te bouwen of
> beveiligen.

## Stap 1 — In Shopify (±10 minuten)
1. Log in op je Shopify-admin.
2. **Product aanmaken**: Producten → Nieuw product → bv. "Kookboek Maarten, in de keuken
   (testproduct)" met een prijs en voorraad. Zet hem op *Actief*.
3. **Buy Button-kanaal toevoegen**: Instellingen → Apps en verkoopkanalen → Shopify-appstore
   → zoek "Buy Button" → toevoegen (gratis, officieel van Shopify).
4. **Buy Button maken**: open het Buy Button-kanaal → "Create a Buy Button" → kies het
   kookboek-product → "Generate code".
5. Uit de gegenereerde code heb je maar drie dingen nodig:
   - `domain: '….myshopify.com'`
   - `storefrontAccessToken: '…'`
   - `id: '…'` (het lange nummer bij het product)

## Stap 2 — In deze repo (1 minuut)
Open `js/shopify-config.js` en vul de drie waarden in. Push naar GitHub. Klaar —
`shop.html` toont nu prijs + "In winkelwagen" + winkelwagentje, in de huisstijl.

## Stap 3 — Testen zonder echte betaling
1. Shopify-admin → Instellingen → Betalingen → activeer **Bogus Gateway**
   ("(for testing) Bogus Gateway") óf zet Shopify Payments in **testmodus**.
2. Doe een bestelling via de site. Bij Bogus Gateway: kaartnummer `1` = geslaagd,
   `2` = geweigerd, `3` = fout. Bij Shopify Payments-testmodus: kaart `4242 4242 4242 4242`.
3. Check in de admin: de order staat onder Bestellingen, de bevestigingsmail is verstuurd.
   Dat is de "backend" die er automatisch bij zit.
4. **Vóór echte verkoop:** testgateway weer uit, echte betaalmethode aan (iDEAL via
   Shopify Payments/Mollie), verzendtarieven en btw-instellingen nalopen, en de
   launch-checklist draaien.

## Veiligheid (belangrijk)
- De **Storefront-token mag publiek zijn** — die is daarvoor ontworpen (kan alleen
  producten lezen en een checkout starten).
- **Admin-API-keys horen hier NOOIT in.** Die geven volledige toegang tot je winkel.
- Rate limiting, betalingen en klantdata: allemaal aan Shopify's kant — dat is de winst
  van dit model.

## Zelfde patroon voor Honing van Manuel
HvM heeft al een Shopify-winkel. Twee routes:
1. **Custom pagina's + Buy Button** (dit patroon): mooie eigen landingspagina's die
   verkopen via hún bestaande winkel. Alleen hún domain/token/product-id's invullen —
   werkt in een dag.
2. **Volledige theme-redesign in Shopify** (wat in de offerte zit): de hele winkel in de
   nieuwe huisstijl, alles op één plek. Meer werk, maar één systeem.
De test met Maartens kookboek bewijst route 1 meteen ook voor HvM.

## Later opschalen (als de shop groeit)
Meerdere producten/collecties → Storefront API (headless) of een theme-port van dit
design. De huidige structuur (aparte `shop.html`, config los van code) is daarop voorbereid.
