

## Voorpagina met introductie en categoriekeuze

### Wat wordt er gebouwd

Een landingspagina die als eerste scherm wordt getoond vóór de calculator. De pagina bevat:

1. **SPOA logo** bovenaan
2. **Titel**: bijv. "Premierekentool"
3. **Introductietekst**: korte uitleg over wat de tool doet (pensioengevend inkomen berekenen, premie inzien, etc.)
4. **Drie keuzekaarten** naast elkaar (of gestapeld op mobiel):
   - **In Loondienst** — met korte beschrijving
   - **DGA** — met korte beschrijving
   - **Zelfstandig** — met korte beschrijving
5. **"Start berekening" knop** die pas actief wordt na een keuze

Na klikken op de knop wordt de huidige Calculator getoond met de juiste tab geselecteerd.

### Technische aanpak

**Bestand: `src/components/Calculator.tsx`**

- Voeg een `showIntro` state toe (default `true`) en een `selectedCategory` state
- Als `showIntro === true`: toon de voorpagina met logo, tekst en drie klikbare kaarten
- Bij klik op "Start berekening": zet `showIntro` op `false` en stel de `tab` state in op de gekozen categorie
- De bestaande calculator-code blijft ongewijzigd; het wordt alleen conditioneel getoond

```text
┌──────────────────────────────────┐
│          SPOA Logo               │
│                                  │
│       Premierekentool            │
│                                  │
│   Introductietekst over de       │
│   tool en het doel ervan...      │
│                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Loon- │ │ DGA  │ │Zelf- │    │
│  │dienst│ │      │ │standig│   │
│  └──────┘ └──────┘ └──────┘    │
│                                  │
│      [ Start berekening ]        │
└──────────────────────────────────┘
```

**Styling**: SPOA blue (`rgb(76, 180, 212)`) accenten, dezelfde kaart-styling als de rest van de app. Geselecteerde kaart krijgt een blauwe border/achtergrond.

Eén bestand gewijzigd, ~60 regels toegevoegd.

