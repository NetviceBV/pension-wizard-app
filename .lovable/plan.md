

## Introductietekst op landingspagina aanpassen

### Wat verandert

De huidige tekst op regel 753-755:
> "Met deze tool berekent u eenvoudig uw pensioengevend inkomen, pensioengrondslag en premie voor 2026. Kies hieronder uw situatie om te starten."

Wordt vervangen door een tekst die de nadruk legt op het invullen van het pensioengevend inkomen via de Mijn-omgeving, in de strekking van de calculator-pagina tekst maar herschreven voor de landingspagina context. Bijvoorbeeld:

> "Met deze tool kunt u uw pensioengevend inkomen en parttimepercentage berekenen. Na inloggen op Mijn Apothekerspensioen kunt u deze gegevens direct invullen via de tegel 'Pensioengevend inkomen en parttimepercentage'. Kies hieronder uw situatie om te starten."

### Technische aanpak

Eén wijziging in `src/components/Calculator.tsx`, regels 753-756: de `<p>` tag met nieuwe tekst.

