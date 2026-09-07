# Eindejaarsuitkering-percentage per jaar

## Probleem
Bij "In loondienst" wordt de eindejaarsuitkering automatisch voorgerekend als 5% van het bruto inkomen, ongeacht het gekozen jaar. Volgens de opdrachtgever moet dit voor 2025 3% zijn.

## Oplossing: percentage toevoegen aan YEAR_PARAMS

**1. `YEAR_PARAMS` uitbreiden (`src/components/Calculator.tsx`, regel 311-314)**

Een nieuw veld `eindejaarsPercentage` toevoegen:
```ts
const YEAR_PARAMS: Record<number, { maxPensioengevend: number; franchise: number; premiePercentage: number; eindejaarsPercentage: number }> = {
  2026: { maxPensioengevend: 113738, franchise: 19172, premiePercentage: 0.307, eindejaarsPercentage: 0.05 },
  2025: { maxPensioengevend: 109606, franchise: 18475, premiePercentage: 0.307, eindejaarsPercentage: 0.03 },
};
```
- 2026 blijft 5%
- 2025 wordt 3%

**2. LoondienstForm gebruikt het jaarspecifieke percentage (regels 1005-1045)**

De drie plekken waar nu hardcoded `brutoYear * 0.05` staat (in `handleBrutoChange`, `handleBrutoPeriodChange` en `handleEindejaarsPeriodChange`) vervangen door `brutoYear * params.eindejaarsPercentage`. De handmatige invoer blijft mogelijk — de gebruiker kan het voorgerekende bedrag nog altijd aanpassen.

**3. Label dynamisch maken (regel 1102)**

Het label "Uw eindejaarsuitkering conform CAO (5%)" wordt dynamisch: bij 2025 toont het "(3%)", bij 2026 "(5%)". Het getal komt uit `params.eindejaarsPercentage`.

**4. Herberekenen bij jaarwissel**

Wanneer de gebruiker van jaar wisselt in de dropdown en de eindejaarsuitkering niet handmatig is aangepast, wordt het bedrag automatisch opnieuw berekend met het percentage van het nieuw gekozen jaar. Wel handmatig aangepast? Dan blijft de eigen invoer staan (consistent met het bestaande gedrag).

## Wat verandert er niet
- Het vakantiegeld blijft 8% voor alle jaren.
- DGA en Zelfstandig worden niet aangeraakt (daar is geen automatisch eindejaarsuitkering-percentage).
- PDF-export gebruikt automatisch de ingevulde bedragen, dus die klopt vanzelf.

## Controle na wijziging
- Build check via build-errors.log.
- Snelle visuele controle in de preview: 2025 geselecteerd → eindejaarsuitkering toont 3% van bruto inkomen; 2026 → 5%.
