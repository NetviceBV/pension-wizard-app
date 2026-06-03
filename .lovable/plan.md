## Wijzigingen in `src/components/Calculator.tsx`

**1. YEAR_PARAMS bijwerken (regels 306–310)**

- 2024 verwijderen
- 2025 echte waarden: `{ maxPensioengevend: 109606, franchise: 18475, premiePercentage: 0.307 }`
- 2026 blijft ongewijzigd

```ts
const YEAR_PARAMS: Record<number, { maxPensioengevend: number; franchise: number; premiePercentage: number }> = {
  2026: { maxPensioengevend: 113738, franchise: 19172, premiePercentage: 0.307 },
  2025: { maxPensioengevend: 109606, franchise: 18475, premiePercentage: 0.307 },
};
```

**2. Dropdowns (regels 893–895 en 934–936)**

- "(soon)" / disabled-logica verwijderen, omdat beide jaren nu geldige waarden hebben.

```tsx
{AVAILABLE_YEARS.map((y) => (
  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
))}
```

**3. Fallback voor onbekende jaren**

- In de hook waar `params` wordt opgehaald (regel 726): als `YEAR_PARAMS[selectedYear]` niet bestaat, terugvallen op de 2026-waarden.

```ts
const params = YEAR_PARAMS[selectedYear] ?? YEAR_PARAMS[2026];
```

Geen andere logica wordt aangeraakt; PDF-export, premieberekening en UI gebruiken automatisch de nieuwe waarden.