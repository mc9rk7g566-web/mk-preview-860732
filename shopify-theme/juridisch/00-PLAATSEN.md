# Juridische pagina's plaatsen — Maarten kookt

Klaar-om-te-plaatsen teksten. Job kan de Shopify-pagina's niet zelf aanmaken (geen
content-scope), dus dit doet Maarten of Job handmatig. ~10 minuten werk.

## 1. Vul eenmalig de bedrijfsgegevens in
Shopify-admin → **Online Store → Themes → Customize → Thema-instellingen →
"Juridisch en bedrijfsgegevens"**. Vul in:
- Handelsnaam / bedrijfsnaam
- KvK-nummer
- Btw-id (optioneel)
- Vestigingsadres (optioneel)

Zodra dit is ingevuld verschijnt het automatisch onder in de footer.

## 2. Maak 3 pagina's aan (met exact deze handles)
Voor elke pagina: **Online Store → Pages → Add page** → titel invullen →
in de editor op **`< >` (HTML weergave)** klikken → de bijbehorende HTML plakken →
**Save**. Controleer dat de URL-handle klopt (staat rechts onderin bij "Search engine listing → Edit").

| Titel | Handle (moet exact zo) | Bestand |
|-------|------------------------|---------|
| Privacyverklaring | `privacyverklaring` | `privacyverklaring.html` |
| Cookiebeleid | `cookiebeleid` | `cookiebeleid.html` |
| Algemene voorwaarden | `algemene-voorwaarden` | `algemene-voorwaarden.html` |

De footer-links naar deze pagina's verschijnen automatisch zodra de pagina's bestaan.

## 3. Vervang de invulvelden in de tekst
In de geplakte tekst staan `[HANDELSNAAM]`, `[KVK-NUMMER]`, `[ADRES]` en `[DATUM]`.
Vervang die door de echte gegevens en de datum van vandaag.

## 4. Nog belangrijk (buiten de website om) — dit moet Maarten zelf regelen
Dit kan ik niet voor je verzinnen of regelen; het is wettelijk en aan Maarten:
- **KvK-inschrijving** — wie wijn verkoopt heeft een bedrijf nodig; de KvK/handelsnaam
  hoort in de privacyverklaring en voorwaarden.
- **Alcohol = 18+** — verkoop en levering uitsluitend aan 18-plussers; controleer de leeftijd.
- **Verkoop van alcohol kan een vergunning/registratie vereisen.** Voor structurele
  verkoop (ook online/particulier) gelden regels uit de Alcoholwet. Laat dit checken
  bij de gemeente of een jurist voordat je groot gaat verkopen.
- De teksten hierboven zijn een degelijke, eerlijke basis die de AVG-basis dekt —
  maar geen vervanging voor juridisch advies als je zekerheid wilt.

## Cookiebanner
De cookiemelding staat er al: dat is Shopify's eigen toestemmingsbanner. Het cookiebeleid
hierboven legt uit wat er gebeurt. Extra plugin is niet nodig.
