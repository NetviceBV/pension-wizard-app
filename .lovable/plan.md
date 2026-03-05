

## Add Per maand / Per jaar dropdown to DGA form fields

### Changes in `src/components/Calculator.tsx` — `DGAForm`

1. **Add period state** for each of the 5 fields, all defaulting to `"jaar"`:
   - `brutoPeriod`, `eindejaarsPeriod`, `waarnemingPeriod`, `managementPeriod`, `vakantiegeldPeriod`

2. **Replace 5 `EuroInput` calls with `EuroInputWithPeriod`**, passing period state and onChange. Remove "(per jaar)" from labels since the dropdown now handles that.

3. **Update calculations** — apply multiplier `m(period)` to each field:
   ```
   const m = (p: string) => p === "maand" ? 12 : 1;
   subtotaal1 = brutoVal*m(brutoPeriod) + eindejaarsVal*m(eindejaarsPeriod) + ...
   subtotaal2 = subtotaal1 + vakantiegeldVal*m(vakantiegeldPeriod)
   ```

