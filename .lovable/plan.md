

## Change Default Period for Three Fields in Loondienst

In `LoondienstForm`, change the default period from `"maand"` to `"jaar"` for:

1. `eindejaarsperiod` (Eindejaarsuitkering)
2. `bonusPeriod` (Vaste bonus)
3. `vakantiegeldPeriod` (Vakantiegeld)

Single file change in `src/components/Calculator.tsx`, three `useState` initializers.

