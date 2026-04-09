

## Jaar toevoegen aan PDF-badge

### Wat verandert

Op regel 58 in `src/components/Calculator.tsx` wordt de badge-tekst aangepast van:

```ts
const badgeText = `Resultaat — ${tabLabel}`;
```

naar:

```ts
const badgeText = `Resultaat ${selectedYear} — ${tabLabel}`;
```

Dit geeft bijv. "Resultaat 2026 — In Loondienst" in de blauwe pill-badge op de PDF.

### Samenvatting

Eén regel, één bestand.

