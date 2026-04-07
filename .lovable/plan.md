

## SPOA logo, terug-navigatie en tab-verwijdering op de berekeningspagina

### Wat verandert

1. **Logo als terug-knop**: Op de berekeningspagina wordt het SPOA logo bovenaan getoond (boven de card header). Klikken op het logo brengt de gebruiker terug naar de landingspagina. Dit is een bekende UX-conventie (logo = home). Een subtiele "← Terug" link wordt ernaast geplaatst voor duidelijkheid.

2. **Tabs verwijderen**: De `TabsList` (de drie knoppen "In loondienst / DGA / Zelfstandig") wordt niet meer getoond. In plaats daarvan wordt een badge/label getoond met de geselecteerde categorie (bijv. "In loondienst") zodat de gebruiker weet welke berekening actief is.

3. **Alleen het juiste formulier tonen**: In plaats van `<Tabs>` met drie `TabsContent`, renderen we direct het juiste formulier op basis van de `tab` state.

```text
┌──────────────────────────────────┐
│  [SPOA Logo]  ← Terug           │
├──────────────────────────────────┤
│  Pensioengevend Inkomen Tool     │
│  ┌─────────────┐                 │
│  │In loondienst│  (badge)        │
│  └─────────────┘                 │
│  Formulier...                    │
└──────────────────────────────────┘
```

### Technische aanpak — `src/components/Calculator.tsx`

**Berekeningspagina (niet-embedded)**:
- Boven de `<Card>`, voeg een klikbaar logo + "Terug" link toe die `setShowIntro(true)` aanroept
- Vervang de `<Tabs>` component door directe conditionele rendering: `tab === "loondienst" ? <LoondienstForm /> : tab === "dga" ? <DGAForm /> : <ZelfstandigForm />`
- Voeg een SPOA-blauwe badge toe in de CardHeader met de geselecteerde categorie-naam
- Behoud de Q&A knop en FAQ-sectie (die al categorie-specifiek filtert)

**Embedded variant**: Zelfde aanpak — logo + terug-link bovenaan, geen tabs, directe form rendering.

Eén bestand, ~30 regels gewijzigd.

