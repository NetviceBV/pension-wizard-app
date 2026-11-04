# Resultaatafhankelijke beloning weghalen bij Zelfstandig

Alleen bij Zelfstandig wordt het veld "Resultaatafhankelijke beloning" verwijderd. Loondienst en DGA blijven ongewijzigd.

## Wat verandert
- Het invulveld verdwijnt uit het Zelfstandig-formulier.
- De berekening gebruikt alleen nog de winst uit onderneming (plus parttime-omrekening).
- De regel "Resultaatafhankelijke beloning" verdwijnt uit de PDF voor Zelfstandig.

## Technisch
In `ZelfstandigForm` (src/components/Calculator.tsx): `resultaat` state, `resultaatVal`, de `EuroInput` `za-resultaat` en de PDF-inputregel verwijderen; `totaalInkomen = winstVal`.
