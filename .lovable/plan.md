

## Add Per maand / Per jaar dropdown to 5 Loondienst fields

### Changes in `src/components/Calculator.tsx`

1. **Import `Select` components** from `@/components/ui/select`.

2. **Create a new `EuroInputWithPeriod` component** that wraps `EuroInput` with a small `Select` dropdown (choices: "Per maand" / "Per jaar"). The dropdown defaults to "Per maand". Layout: label on left, then euro input + period select on right.

3. **Add state for each period selector** in `LoondienstForm`:
   - `eindejaarsperiod`, `bonusPeriod`, `waarnemingPeriod`, `managementPeriod`, `vakantiegeldPeriod` — each defaults to `"maand"`.

4. **Update labels** — remove "— per maand" suffix from:
   - "Vaste bonus (indien onderdeel loonafspraak)"
   - "Vaste waarnemingstoeslag"
   - "Vaste management- of bereikbaarheidsvergoeding"
   - "Uw vakantiegeld (8%)"

5. **Update calculation** — use multiplier based on period:
   ```
   multiplier = period === "maand" ? 12 : 1
   ```
   Apply to each of the 5 fields in `subtotaal1` and `subtotaal2` calculations. The `eindejaarsuitkering` currently uses `×1` (yearly); with the dropdown it will use the same logic.

6. **Replace the 5 `EuroInput` calls** (eindejaars, bonus, waarneming, management, vakantiegeld) with `EuroInputWithPeriod`.

### EuroInputWithPeriod layout
The select dropdown sits inline next to the euro input field, both sharing the right-side space.

