# Shopify-thema installeren

De bestaande statische website staat nog steeds in de root van deze repository. De map
`shopify-theme/` is dezelfde vormgeving, omgebouwd naar een Shopify Online Store 2.0-thema.

## Uploaden

1. Open Shopify-admin → **Webshop → Thema's**.
2. Kies **Thema importeren → ZIP-bestand uploaden**.
3. Upload `maarten-shopify-theme.zip` uit deze repository.
4. Open eerst **Voorbeeld**; publiceer het thema pas na controle.

## Eenmalige inrichting in Shopify

1. Maak het kookboek aan onder **Producten** en voeg prijs, voorraad, beschrijving,
   productfoto en eventuele varianten toe.
2. Open de thema-editor → **Thema-instellingen → Navigatie en contact** en selecteer
   dit product bij **Kookboekproduct**. Vul daar ook de groepsapp en sociale links in.
3. Maak onder **Webshop → Pagina's** een pagina `Recepten` met URL-handle `recepten`.
   Kies voor deze pagina het themasjabloon `recepten`.
4. Maak een pagina `Recept` met URL-handle `recept` en kies het themasjabloon `recept`.
5. Bewerk recepten, ingrediënten, stappen en afbeeldingen via de thema-editor.

## Wat automatisch via Shopify loopt

- Productprijs, varianten en voorraad
- Winkelwagen en beveiligde checkout
- Betalingen, bestellingen en bevestigingsmails
- Btw, verzending en rapportages volgens de Shopify-instellingen

Test de winkel eerst met Shopify Payments in testmodus of de Bogus Gateway. Activeer pas
daarna echte betalingen en publiceer vervolgens het gecontroleerde thema.
