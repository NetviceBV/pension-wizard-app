## Veld toevoegen: Resultaatafhankelijke beloning (alle 3 formulieren)

Een nieuw invoerveld **"Resultaatafhankelijke beloning"** wordt toegevoegd aan elk van de drie formulieren in `src/components/Calculator.tsx` en telt mee in de berekening van het pensioengevend inkomen.

### Loondienst-formulier
- Positie: ná "Vaste bonus", vóór "Vaste waarnemingstoeslag".
- Component: `EuroInputWithPeriod` met maand/jaar-toggle, **standaard "jaar"**, placeholder "0".
- State: `resultaat` + `resultaatPeriod`.
- Telt mee in `subtotaal1` (vóór vakantiegeld) — dezelfde behandeling als bonus/waarneming/management.
- PDF-export (DownloadButton inputs): regel "Resultaatafhankelijke beloning — €x per maand/jaar" toevoegen op overeenkomstige positie.

### DGA-formulier
- Positie: ná "Structurele eindejaarsuitkering", vóór "Vaste waarnemingstoeslag".
- Component: `EuroInputWithPeriod`, standaard "jaar", placeholder "0".
- State: `resultaat` + `resultaatPeriod`.
- Telt mee in het subtotaal vóór vakantiegeld (zelfde plek als waar eindejaarsuitkering/waarneming/management worden opgeteld).
- PDF-export: regel toevoegen op overeenkomstige positie.

### Zelfstandig-formulier
- Positie: ná "Winst uit onderneming van drie jaar geleden, vóór toepassing van de oudedagsreserve en de ondernemersaftrek", vóór het parttimepercentage.
- Component: `EuroInput` (geen periode-toggle, consistent met de bestaande winst-input die per jaar is). Placeholder "0".
- State: `resultaat`.
- Telt mee in het inkomen dat naar fulltime wordt herleid: `(winstVal + resultaatVal) / parttime`.
- PDF-export: regel "Resultaatafhankelijke beloning — €x" toevoegen direct ná de winst-regel.

### Niet gewijzigd
- FAQ-teksten, uitleg-collapsibles ("Wat telt mee / niet mee"), berekeningsparameters, branding, en validatieregels blijven ongewijzigd.