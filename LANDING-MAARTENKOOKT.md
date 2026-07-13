# maartenkookt.nl live als landingspagina (via Shopify)

> Doel: de landing NU live op maartenkookt.nl, met e-mail-inschrijving die rechtstreeks in
> Shopify belandt (Klanten → e-mailabonnees) zodat Maarten vanaf dag één zijn lijst opbouwt
> en er later met Shopify Email (gratis tot 10.000 mails/mnd) campagnes op kan sturen.
> Het thema staat klaar: `maartenkookt-theme.zip` in deze repo.

## Wat er in het thema zit
- **Landing als homepage** (`main-landing`): hero met merk-lockup + e-mailformulier +
  "wat komt eraan"-band. Inschrijvingen krijgen tags `nieuwsbrief, landing` en tellen als
  e-mailabonnee (marketing-toestemming) in Shopify.
- **Landing-modus** (Thema-instellingen → Navigatie en contact): navigatie verborgen tot de
  volledige site live gaat. Vinkje uit = volledige navigatie terug.
- **Volledige homepage blijft bewaard** als alternatief template `index.volledig` — als de
  content er is: Online Store → Pages/Theme editor → template van de homepage omzetten,
  landing-modus uitvinken, klaar.
- Wachtwoordpagina in huisstijl ("Er wordt gekookt"), receptenpagina's en productpagina
  zitten er al in voor later.

## Stappen naar live (±30 minuten)
1. **Plan kiezen** in Shopify (Basic is nodig voor een eigen thema; check de actuele
   €1/mnd-promo voor de eerste maanden). Starter is niet genoeg.
2. **Thema uploaden**: Online Store → Themes → Add theme → Upload zip →
   `maartenkookt-theme.zip` → daarna **Publish**.
3. **Wachtwoord uit**: Online Store → Preferences → "Restrict access" uitzetten
   (kan pas na plan-keuze). Zolang het wachtwoord aan staat, zien bezoekers de
   huisstijl-wachtwoordpagina.
4. **Domein koppelen**: Settings → Domains → Connect existing domain → `maartenkookt.nl`.
   Bij de registrar (waar het domein is gekocht):
   - A-record `@` → `23.227.38.65`
   - CNAME `www` → `shops.myshopify.com`
   Shopify regelt daarna zelf het SSL-certificaat. Zet maartenkookt.nl als primair domein.
5. **Afzender-e-mail**: Settings → Notifications → Sender email → `info@maartenkookt.nl`
   → volg "authenticate your domain" (paar DNS-records bij de registrar). Zonder dit belanden
   mails in spam. Let op: Shopify host geen mailbox — info@maartenkookt.nl zelf bestaat bij
   de registrar/mailprovider.
6. **Test de funnel**: schrijf je eigen adres in op de site → check Klanten (abonnee met tag
   `landing`, status "subscribed") → Marketing → Shopify Email → stuur een testcampagne naar
   jezelf.
7. **AVG**: Settings → Policies → privacyverklaring genereren en in de footer-link zetten
   (kan ook na livegang, maar vóór de eerste echte campagne).

## Waarom deze route (kort)
- Lijst staat meteen op de plek waar straks óók het kookboek verkocht wordt: geen migratie.
- Shopify Email is gratis tot 10.000 mails/maand, dubbele opt-in instelbaar.
- Kosten: Shopify Basic-abonnement (±€27/mnd na de promo) — dat is de afweging vs. een
  gratis statische landing met een losse mailtool.

## Voor later
- Volledige site aanzetten: template `index.volledig` + landing-modus uit.
- Kookboek verkopen: product aanmaken en als "Kookboekproduct" kiezen in de thema-instellingen
  (de nav-link wijst er dan automatisch heen). De Buy Button-route uit `SHOPIFY-KOPPELING.md`
  is dan niet meer nodig — alles draait al ín Shopify.
