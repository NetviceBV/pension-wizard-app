

## Jaarselectie met jaar-specifieke parameters

### Wat wordt er gebouwd

Een dropdown bovenaan de berekeningspagina waarmee het jaar gekozen kan worden (standaard 2026). De berekeningen en weergave gebruiken dan de parameters van het geselecteerde jaar.

### Technische aanpak — `src/components/Calculator.tsx`

**1. Parameters-object per jaar**

Vervang de losse constanten door een configuratie-object:

```ts
const YEAR_PARAMS: Record<number, { maxPensioengevend: number; franchise: number; premiePercentage: number }> = {
  2026: { maxPensioengevend: 113738, franchise: 19172, premiePercentage: 0.307 },
  2025: { maxPensioengevend: 0, franchise: 0, premiePercentage: 0 }, // placeholder
  2024: { maxPensioengevend: 0, franchise: 0, premiePercentage: 0 }, // placeholder
};
const AVAILABLE_YEARS = Object.keys(YEAR_PARAMS).map(Number).sort((a, b) => b - a);
```

Placeholders voor 2025/2024 worden later door jou ingevuld met de juiste waarden.

**2. State en dropdown**

Een `selectedYear` state (default `2026`) en een `Select` dropdown boven het formulier, naast de categorie-badge. De actieve parameters worden afgeleid:

```ts
const params = YEAR_PARAMS[selectedYear];
```

**3. Berekeningen aanpassen**

`calcResult` krijgt de parameters als argument in plaats van globale constanten:

```ts
function calcResult(fulltimeIncome: number, parttimePct: number, params) { ... }
```

**4. Labels aanpassen**

"Franchise 2026" wordt dynamisch: `Franchise ${selectedYear}`. Idem in de PDF.

**5. PDF**

De PDF-titel en parameterlabels tonen het geselecteerde jaar. De parameterwaarden komen uit het actieve `params` object.

### Samenvatting

- Eén bestand gewijzigd
- ~30 regels aangepast
- Jaren 2024/2025 krijgen placeholder-waarden (nullen) die je later kunt aanleveren

