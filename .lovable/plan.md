

## Add Result Fields Below Parttimepercentage in Loondienst

Based on the screenshot, add these always-visible result rows after the parttimepercentage input in the Loondienst form, replacing the current conditional `ResultBlock`:

1. **Uw pensioengevend inkomen per jaar (maximaal 113.738)** — computed, displayed as euro
2. **Franchise 2026** — fixed €19.172
3. **Uw pensioengrondslag (*parttimepercentage)** — computed
4. **Uw premie in 2026 (30,7% van de pensioengrondslag)** — computed

### Changes in `src/components/Calculator.tsx`

In the `LoondienstForm`, replace the conditional `{hasInput && <ResultBlock ... />}` with 4 inline result rows that always show (displaying €0,00 when empty). Each row uses the same horizontal label-value layout as the existing `Subtotaal` component but with a € prefix on the value side. The Franchise row shows the fixed 19.172 value.

