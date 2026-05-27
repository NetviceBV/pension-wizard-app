In `src/components/Calculator.tsx` (Loondienst-blok) het label van het bruto-inkomen veld niet langer laten meebewegen met de gekozen periode (maand/jaar), maar altijd tonen als **"Bruto inkomen"**.

Wijzigingen:
- Regel 1087: `label={brutoPeriod === "maand" ? "Bruto maandinkomen" : "Bruto jaarinkomen"}` → `label="Bruto inkomen"`
- Regel 1171 (resultatenoverzicht/PDF): zelfde label vast op `"Bruto inkomen"` zodat invoer en uitvoer consistent zijn. De waarde blijft "€ X per maand/jaar" tonen, dus de gekozen periode blijft zichtbaar.

De dropdown "Per maand / Per jaar" en de bijhorende berekeningen blijven ongewijzigd.